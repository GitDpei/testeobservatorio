/**
 * Observatório Municipal de Porto Velho — aplicação
 * ------------------------------------------------------------
 * JavaScript puro (sem dependências), compatível com GitHub Pages.
 * Lê o catálogo em assets/js/catalogo.js e monta:
 *   - menu lateral com dropdowns acessíveis e busca;
 *   - página inicial com os temas;
 *   - área do painel (iframe do Power BI) com rotas compartilháveis
 *     no formato  #/secao/painel.
 */
(function () {
  'use strict';

  /* ----------------------------------------------------------
   * Configuração
   * -------------------------------------------------------- */
  var CONFIG = {
    nomeSite: 'Observatório Municipal de Porto Velho',
    // false = seção com um único painel de mesmo nome vira link direto
    // (um clique a menos). true = sempre usa dropdown, como no modelo antigo.
    dropdownParaPainelUnico: false,
    // Somente links destes domínios são aceitos no catálogo (segurança).
    hostsPermitidos: ['app.powerbi.com'],
    // Quantos painéis já abertos ficam guardados em memória para
    // troca instantânea. Aumente com cautela: Power BI consome RAM.
    maxPaineisEmCache: 3,
    // Após este tempo sem carregar, sugere abrir em nova aba.
    avisoLentidaoMs: 20000,
    chaveMenuRecolhido: 'observatorio:menu-recolhido',

    // ---- Proporção dos relatórios (evita as faixas brancas) -------------
    // O Power BI mantém a proporção da página do relatório e preenche o
    // resto de branco. O site recorta a moldura na mesma proporção, sem
    // esticar nada. Valor = largura ÷ altura da página do relatório.
    // Medido nos painéis da Prefeitura: 1600 × 873 = 1.8326.
    // Aceita número (1.8326) ou texto ("16/9", "16:9", "1600x900").
    proporcaoPadrao: '1600/873',
    // Exceções por rota, para relatórios feitos em outro tamanho.
    // A rota é o que aparece no endereço depois de "#/".
    proporcaoPorRota: {
      'defesa-civil/projeto-acolher': '16/9',
      'censo/censo-demografico': '16/9'
    }
  };

  var catalogo = Array.isArray(window.OBSERVATORIO_CATALOGO) ? window.OBSERVATORIO_CATALOGO : [];

  /* ----------------------------------------------------------
   * Utilidades
   * -------------------------------------------------------- */
  function $(seletor, contexto) { return (contexto || document).querySelector(seletor); }
  function $$(seletor, contexto) { return Array.prototype.slice.call((contexto || document).querySelectorAll(seletor)); }

  function normalizar(texto) {
    return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function criarSlug(texto) {
    return normalizar(texto).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  /** Aceita tanto o link quanto o código <iframe> colado do Power BI. */
  function extrairUrl(valor) {
    var texto = String(valor || '').trim();
    var src = texto.match(/src\s*=\s*["']([^"']+)["']/i);
    return (src ? src[1] : texto).replace(/&amp;/g, '&');
  }

  /** Retorna a URL somente se for https e de um domínio permitido. */
  function validarUrl(valor) {
    try {
      var url = new URL(extrairUrl(valor));
      if (url.protocol !== 'https:') return null;
      if (CONFIG.hostsPermitidos.indexOf(url.hostname) === -1) return null;
      return url.href;
    } catch (erro) {
      return null;
    }
  }

  /** Converte "16/9", "16:9", "1600x900" ou 1.7778 em número. */
  function lerProporcao(valor) {
    if (valor === undefined || valor === null || valor === '') return null;
    if (typeof valor === 'number') return valor > 0 ? valor : null;
    var texto = String(valor).trim().replace(',', '.');
    var partes = texto.match(/^([\d.]+)\s*[/:x×]\s*([\d.]+)$/i);
    if (partes) {
      var razao = parseFloat(partes[1]) / parseFloat(partes[2]);
      return razao > 0 && isFinite(razao) ? razao : null;
    }
    var numero = parseFloat(texto);
    return numero > 0 ? numero : null;
  }

  var proporcaoPadrao = lerProporcao(CONFIG.proporcaoPadrao) || 16 / 9;

  function el(tag, atributos, filhos) {
    var no = document.createElement(tag);
    Object.keys(atributos || {}).forEach(function (chave) {
      var valor = atributos[chave];
      if (valor === null || valor === undefined || valor === false) return;
      if (chave === 'class') no.className = valor;
      else if (chave === 'text') no.textContent = valor;
      else no.setAttribute(chave, valor === true ? '' : valor);
    });
    (filhos || []).forEach(function (filho) {
      if (filho) no.appendChild(typeof filho === 'string' ? document.createTextNode(filho) : filho);
    });
    return no;
  }

  var SVG_NS = 'http://www.w3.org/2000/svg';
  function iconeCirculo(nome) {
    return el('span', { class: 'nav__icone' }, [icone(nome)]);
  }
  function icone(nome, classe) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icone ' + (classe || ''));
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var uso = document.createElementNS(SVG_NS, 'use');
    uso.setAttribute('href', '#i-' + nome);
    svg.appendChild(uso);
    return svg;
  }

  function lerPreferencia(chave) {
    try { return window.localStorage.getItem(chave); } catch (e) { return null; }
  }
  function salvarPreferencia(chave, valor) {
    try { window.localStorage.setItem(chave, valor); } catch (e) { /* modo privado etc. */ }
  }

  /* ----------------------------------------------------------
   * Modelo de dados (normaliza o catálogo)
   * -------------------------------------------------------- */
  var secoes = [];
  var paineisPorRota = new Map();

  catalogo.forEach(function (bruta, indice) {
    var tituloSecao = String(bruta.titulo || '').trim() || 'Seção ' + (indice + 1);
    var secao = {
      id: criarSlug(tituloSecao) || 'secao-' + (indice + 1),
      titulo: tituloSecao,
      icone: bruta.icone || 'barras',
      paineis: []
    };

    // evita ids repetidos entre seções
    var base = secao.id, n = 2;
    while (secoes.some(function (s) { return s.id === secao.id; })) secao.id = base + '-' + n++;

    (bruta.paineis || []).forEach(function (p) {
      var url = validarUrl(p.url);
      var titulo = String(p.titulo || '').trim();
      if (!url || !titulo) {
        console.warn('[Observatório] Painel ignorado (título ou URL inválidos):', p);
        return;
      }
      secao.paineis.push({
        titulo: titulo,
        descricao: p.descricao ? String(p.descricao) : '',
        atualizado: p.atualizado ? String(p.atualizado) : '',
        proporcao: lerProporcao(p.proporcao),
        url: url,
        secao: secao
      });
    });

    if (!secao.paineis.length) return;

    secao.unica = !CONFIG.dropdownParaPainelUnico && secao.paineis.length === 1 &&
      normalizar(secao.paineis[0].titulo) === normalizar(secao.titulo);

    var usados = {};
    secao.paineis.forEach(function (p) {
      var s = criarSlug(p.titulo) || 'painel';
      if (usados[s]) s += '-' + (++usados[s]); else usados[s] = 1;
      p.rota = secao.unica ? secao.id : secao.id + '/' + s;
      // prioridade: painel no catálogo > exceção por rota > padrão
      if (!p.proporcao) p.proporcao = lerProporcao(CONFIG.proporcaoPorRota[p.rota]) || proporcaoPadrao;
      paineisPorRota.set(p.rota, p);
    });

    secoes.push(secao);
  });

  var totalPaineis = paineisPorRota.size;

  /* ----------------------------------------------------------
   * Referências do DOM
   * -------------------------------------------------------- */
  var app = $('.app');
  var sidebar = $('#menu-lateral');
  var navLista = $('#nav-lista');
  var navVazio = $('#nav-vazio');
  var busca = $('#busca');
  var botaoMenu = $('#botao-menu');
  var botaoFecharMenu = $('#botao-fechar-menu');
  var botaoRecolher = $('#botao-recolher');
  var scrim = $('#scrim');
  var principal = $('#principal');
  var migalhas = $('#migalhas');
  var acoes = $('#acoes-painel');
  var anunciador = $('#anunciador');

  var vistas = {
    inicio: $('#vista-inicio'),
    painel: $('#vista-painel'),
    naoEncontrado: $('#vista-nao-encontrado')
  };

  var palco = $('#palco');
  var carregando = $('#carregando');
  var aviso = $('#aviso-lentidao');
  var linkAvisoNovaAba = $('#aviso-nova-aba');
  var tituloPainel = $('#titulo-painel');
  var navLateral = $('.lateral__nav');

  var dica = $('#dica-flutuante');
  var voltarTopo = $('#voltar-topo');

  var mqMobile = window.matchMedia('(max-width: 1023.98px)');
  var mqMovimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ----------------------------------------------------------
   * Menu lateral
   * -------------------------------------------------------- */
  function montarMenu() {
    var fragmento = document.createDocumentFragment();

    secoes.forEach(function (secao) {
      var item = el('li', { class: 'nav__item', 'data-secao': secao.id });

      if (secao.unica) {
        var painel = secao.paineis[0];
        var link = el('a', {
          class: 'nav__secao nav__secao--link',
          href: '#/' + painel.rota,
          'data-rota': painel.rota,
          'data-busca': normalizar(secao.titulo)
        }, [iconeCirculo(secao.icone), el('span', { class: 'nav__rotulo', text: secao.titulo })]);
        link.setAttribute('data-dica', secao.titulo);
        item.appendChild(link);
      } else {
        var idSub = 'sub-' + secao.id;
        var botao = el('button', {
          type: 'button',
          class: 'nav__secao',
          'aria-expanded': 'false',
          'aria-controls': idSub,
          'data-dica': secao.titulo,
          'data-busca': normalizar(secao.titulo)
        }, [
          iconeCirculo(secao.icone),
          el('span', { class: 'nav__rotulo', text: secao.titulo }),
          el('span', { class: 'nav__contagem', text: String(secao.paineis.length), 'aria-hidden': 'true' }),
          icone('seta', 'nav__seta')
        ]);

        var sub = el('ul', { class: 'nav__sub', role: 'list' });
        secao.paineis.forEach(function (p) {
          sub.appendChild(el('li', { 'data-busca': normalizar(p.titulo) }, [
            el('a', { class: 'nav__link', href: '#/' + p.rota, 'data-rota': p.rota }, [
              el('span', { class: 'nav__link-texto', text: p.titulo })
            ])
          ]));
        });

        var envoltorio = el('div', { class: 'nav__painel', id: idSub }, [el('div', { class: 'nav__painel-interno' }, [sub])]);
        botao.addEventListener('click', function () {
          if (app.getAttribute('data-menu') === 'recolhido' && !mqMobile.matches) {
            definirMenuRecolhido(false);
            alternarSecao(botao, true);
            return;
          }
          alternarSecao(botao);
        });

        item.appendChild(botao);
        item.appendChild(envoltorio);
      }

      fragmento.appendChild(item);
    });

    navLista.appendChild(fragmento);
  }

  function alternarSecao(botao, forcar) {
    var abrir = typeof forcar === 'boolean' ? forcar : botao.getAttribute('aria-expanded') !== 'true';
    botao.setAttribute('aria-expanded', String(abrir));
  }

  function abrirSecaoDoPainel(painel) {
    var item = $('.nav__item[data-secao="' + painel.secao.id + '"]', navLista);
    var botao = item && $('button.nav__secao', item);
    if (botao) alternarSecao(botao, true);
  }

  function marcarAtivo(rota) {
    $$('[aria-current="page"]', sidebar).forEach(function (a) { a.removeAttribute('aria-current'); });
    $$('.nav__item.is-ativo', sidebar).forEach(function (li) { li.classList.remove('is-ativo'); });
    if (rota === null) return;
    var link = $('[data-rota="' + CSS.escape(rota) + '"]', sidebar);
    if (link) {
      link.setAttribute('aria-current', 'page');
      link.closest('.nav__item').classList.add('is-ativo');
    }
  }

  /* ---- busca no menu ---- */
  function destacar(elemento, termo) {
    var original = elemento.getAttribute('data-original');
    if (original === null) {
      original = elemento.textContent;
      elemento.setAttribute('data-original', original);
    }
    elemento.textContent = '';
    if (!termo) { elemento.textContent = original; return; }

    var alvo = normalizar(original);
    var inicio = alvo.indexOf(termo);
    if (inicio === -1) { elemento.textContent = original; return; }
    // normalize('NFD') + remoção de acentos preserva o tamanho para textos em português
    elemento.appendChild(document.createTextNode(original.slice(0, inicio)));
    elemento.appendChild(el('mark', { text: original.slice(inicio, inicio + termo.length) }));
    elemento.appendChild(document.createTextNode(original.slice(inicio + termo.length)));
  }

  function filtrarMenu(consulta) {
    var termo = normalizar(consulta);
    var visiveis = 0;
    navLateral.classList.toggle('is-buscando', Boolean(termo));

    $$('.nav__item', navLista).forEach(function (item) {
      var cabecalho = $('.nav__secao', item);
      var rotulo = $('.nav__rotulo', item);
      var secaoCombina = !termo || cabecalho.getAttribute('data-busca').indexOf(termo) !== -1;
      var algumFilho = false;

      $$('.nav__sub > li', item).forEach(function (li) {
        var combina = !termo || secaoCombina || li.getAttribute('data-busca').indexOf(termo) !== -1;
        li.hidden = !combina;
        destacar($('.nav__link-texto', li), termo && li.getAttribute('data-busca').indexOf(termo) !== -1 ? termo : '');
        if (combina) { algumFilho = true; visiveis++; }
      });

      if (cabecalho.tagName === 'A' && secaoCombina) visiveis++;

      var mostrar = secaoCombina || algumFilho;
      item.hidden = !mostrar;
      destacar(rotulo, termo && secaoCombina ? termo : '');

      if (cabecalho.tagName === 'BUTTON') {
        if (termo) alternarSecao(cabecalho, mostrar);
        else alternarSecao(cabecalho, item.classList.contains('is-ativo'));
      }
    });

    navVazio.hidden = visiveis > 0;
  }

  /* ---- menu recolhido (desktop) e gaveta (mobile) ---- */
  function definirMenuRecolhido(recolher) {
    app.setAttribute('data-menu', recolher ? 'recolhido' : 'expandido');
    botaoRecolher.setAttribute('aria-pressed', String(recolher));
    botaoRecolher.setAttribute('aria-label', recolher ? 'Expandir menu' : 'Recolher menu');
    $('.botao-recolher__texto', botaoRecolher).textContent = recolher ? 'Expandir menu' : 'Recolher menu';
    salvarPreferencia(CONFIG.chaveMenuRecolhido, recolher ? '1' : '0');
  }

  var elementoAntesDaGaveta = null;

  function abrirGaveta(focarCampoBusca) {
    elementoAntesDaGaveta = document.activeElement;
    sidebar.inert = false;
    app.classList.add('gaveta-aberta');
    botaoMenu.setAttribute('aria-expanded', 'true');
    scrim.hidden = false;
    principal.inert = true;
    $('.topo').inert = true;
    document.body.classList.add('sem-rolagem');
    // No celular, focar a busca abriria o teclado sem o usuário pedir.
    var alvoFoco = focarCampoBusca === true ? busca : botaoFecharMenu;
    window.setTimeout(function () { alvoFoco.focus({ preventScroll: true }); }, 30);
  }

  function fecharGaveta(devolverFoco) {
    if (!app.classList.contains('gaveta-aberta')) return;
    app.classList.remove('gaveta-aberta');
    if (mqMobile.matches) sidebar.inert = true;
    botaoMenu.setAttribute('aria-expanded', 'false');
    scrim.hidden = true;
    principal.inert = false;
    $('.topo').inert = false;
    document.body.classList.remove('sem-rolagem');
    if (devolverFoco !== false) (elementoAntesDaGaveta || botaoMenu).focus();
  }

  function aoMudarBreakpoint() {
    fecharGaveta(false);
    sidebar.inert = mqMobile.matches; // gaveta fechada no celular não recebe foco
    esconderDica();
    if (mqMobile.matches) {
      app.setAttribute('data-menu', 'expandido');
    } else {
      definirMenuRecolhido(lerPreferencia(CONFIG.chaveMenuRecolhido) === '1');
    }
  }

  /* ----------------------------------------------------------
   * Página inicial (cartões de tema, barras e atalho)
   * -------------------------------------------------------- */
  var LIMITE_LISTA = 5; // painéis visíveis por cartão antes de "mostrar mais"
  var CORES_ANEL = ['var(--anel-1)', 'var(--anel-2)', 'var(--anel-3)'];

  /** Anel de proporção: quanto o tema representa diante do maior tema. */
  function anel(quantidade, maximo) {
    var raio = 22;
    var circunferencia = 2 * Math.PI * raio;
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'anel__grafico');
    svg.setAttribute('viewBox', '0 0 52 52');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');

    ['anel__trilho', 'anel__valor'].forEach(function (classe) {
      var circulo = document.createElementNS(SVG_NS, 'circle');
      circulo.setAttribute('class', classe);
      circulo.setAttribute('cx', '26');
      circulo.setAttribute('cy', '26');
      circulo.setAttribute('r', String(raio));
      if (classe === 'anel__valor') {
        circulo.setAttribute('stroke-dasharray', circunferencia.toFixed(1));
        circulo.setAttribute('stroke-dashoffset', (circunferencia * (1 - quantidade / maximo)).toFixed(1));
      }
      svg.appendChild(circulo);
    });

    return el('span', { class: 'anel' }, [svg, el('span', { class: 'anel__numero', text: String(quantidade) })]);
  }

  function montarInicio() {
    $('#total-temas').textContent = String(secoes.length);
    $('#total-paineis').textContent = String(totalPaineis);
    montarCartoes();
    montarBarras();
    montarAtalho();
  }

  function montarCartoes() {
    var grade = $('#grade-temas');
    var fragmento = document.createDocumentFragment();
    var maior = secoes.reduce(function (maximo, s) { return Math.max(maximo, s.paineis.length); }, 0) || 1;

    secoes.forEach(function (secao, indice) {
      var lista = el('ul', { class: 'cartao__lista', role: 'list' });

      secao.paineis.forEach(function (p, indice) {
        var item = el('li', {}, [
          el('a', { class: 'cartao__link', href: '#/' + p.rota }, [
            el('span', { text: p.titulo }),
            icone('seta-direita')
          ])
        ]);
        if (indice >= LIMITE_LISTA) item.hidden = true;
        lista.appendChild(item);
      });

      var quantidade = secao.paineis.length;
      var cartao = el('li', { class: 'cartao', id: 'tema-' + secao.id }, [
        el('div', { class: 'cartao__topo' }, [
          el('span', { class: 'cartao__icone' }, [icone(secao.icone)]),
          el('div', {}, [
            el('h3', { class: 'cartao__titulo', text: secao.titulo }),
            el('p', { class: 'cartao__meta', text: quantidade + (quantidade === 1 ? ' painel' : ' painéis') })
          ]),
          anel(quantidade, maior)
        ]),
        lista
      ]);
      secao.cor = CORES_ANEL[indice % CORES_ANEL.length];
      cartao.style.setProperty('--cor-anel', secao.cor);

      var ocultos = quantidade - LIMITE_LISTA;
      if (ocultos > 0) {
        var botao = el('button', {
          class: 'cartao__mais',
          type: 'button',
          'aria-expanded': 'false',
          text: 'Mostrar mais ' + ocultos
        });
        botao.addEventListener('click', function () {
          var abrir = botao.getAttribute('aria-expanded') !== 'true';
          $$('li', lista).forEach(function (item, indice) {
            item.hidden = !abrir && indice >= LIMITE_LISTA;
          });
          botao.setAttribute('aria-expanded', String(abrir));
          botao.textContent = abrir ? 'Mostrar menos' : 'Mostrar mais ' + ocultos;
        });
        cartao.appendChild(botao);
      }

      fragmento.appendChild(cartao);
    });

    grade.appendChild(fragmento);
  }

  /** Barras "painéis por tema": levam ao cartão do tema. */
  function montarBarras() {
    var lista = $('#barras-temas');
    if (!lista) return;
    var maior = secoes.reduce(function (maximo, s) { return Math.max(maximo, s.paineis.length); }, 0) || 1;

    secoes.forEach(function (secao) {
      var preenchimento = el('span', { class: 'barra__preenchimento' });
      preenchimento.style.setProperty('--proporcao', Math.round((secao.paineis.length / maior) * 100) + '%');

      var botao = el('button', {
        class: 'barra__botao',
        type: 'button',
        'aria-label': 'Ver o tema ' + secao.titulo + ' (' + secao.paineis.length + ' painéis)'
      }, [
        el('span', { class: 'barra__nome', text: secao.titulo }),
        el('span', { class: 'barra__valor', text: String(secao.paineis.length) }),
        el('span', { class: 'barra__trilho', 'aria-hidden': 'true' }, [preenchimento])
      ]);
      botao.addEventListener('click', function () { destacarTema(secao.id); });

      botao.style.setProperty('--cor-anel', secao.cor || CORES_ANEL[0]);
      lista.appendChild(el('li', { class: 'barra' }, [botao]));
    });
  }

  function destacarTema(id) {
    var cartao = document.getElementById('tema-' + id);
    if (!cartao) return;
    rolarPara(cartao);
    cartao.classList.add('is-destacado');
    var primeiro = $('a.cartao__link', cartao);
    if (primeiro) primeiro.focus({ preventScroll: true });
    window.setTimeout(function () { cartao.classList.remove('is-destacado'); }, 1800);
  }

  /** "Comece por": aponta para o tema com mais painéis. */
  function montarAtalho() {
    var link = $('#atalho-destaque');
    if (!link || !secoes.length) return;
    var maior = secoes.slice().sort(function (a, b) { return b.paineis.length - a.paineis.length; })[0];
    var painel = maior.paineis[0];
    link.href = '#/' + painel.rota;
    link.setAttribute('aria-label', 'Comece por ' + maior.titulo + ': abrir o painel ' + painel.titulo);
    $('#atalho-titulo').textContent = maior.titulo;
    $('#atalho-nota').textContent = maior.paineis.length + ' painéis · abrir ' + painel.titulo;
  }

  /* ----------------------------------------------------------
   * Área do painel (iframes com cache LRU)
   * -------------------------------------------------------- */
  var cache = new Map(); // rota -> { iframe, carregado }
  var painelAtual = null;
  var temporizadorLentidao = null;

  function criarIframe(painel) {
    var registro = { carregado: false, iframe: null };
    var iframe = el('iframe', {
      class: 'palco__iframe',
      title: 'Painel ' + painel.titulo + ' — ' + painel.secao.titulo + ' (Power BI)',
      src: painel.url,
      allow: 'fullscreen',
      referrerpolicy: 'strict-origin-when-cross-origin'
    });
    iframe.addEventListener('load', function () {
      registro.carregado = true;
      if (painelAtual === painel) finalizarCarregamento();
    });
    registro.iframe = iframe;
    return registro;
  }

  /** Ajusta a moldura à proporção do relatório (sem esticar a imagem). */
  function aplicarProporcao(painel) {
    palco.style.setProperty('--razao-painel', String(painel.proporcao || proporcaoPadrao));
  }

  function podarCache() {
    while (cache.size > CONFIG.maxPaineisEmCache) {
      var maisAntiga = cache.keys().next().value;
      if (painelAtual && maisAntiga === painelAtual.rota) break;
      cache.get(maisAntiga).iframe.remove();
      cache.delete(maisAntiga);
    }
  }

  function exibirIframe(painel, recarregar) {
    var registro = cache.get(painel.rota);

    aplicarProporcao(painel);

    if (registro && recarregar) {
      registro.iframe.remove();
      cache.delete(painel.rota);
      registro = null;
    }

    if (!registro) {
      registro = criarIframe(painel);
      palco.appendChild(registro.iframe);
    } else {
      cache.delete(painel.rota); // renova a posição no LRU
    }
    cache.set(painel.rota, registro);
    podarCache();

    cache.forEach(function (r, rota) {
      var ativo = rota === painel.rota;
      r.iframe.classList.toggle('is-ativo', ativo);
      r.iframe.inert = !ativo;
      if (ativo) r.iframe.removeAttribute('aria-hidden'); else r.iframe.setAttribute('aria-hidden', 'true');
    });

    clearTimeout(temporizadorLentidao);
    aviso.hidden = true;

    if (registro.carregado) {
      finalizarCarregamento();
    } else {
      palco.setAttribute('aria-busy', 'true');
      carregando.hidden = false;
      temporizadorLentidao = setTimeout(function () {
        if (painelAtual === painel && !registro.carregado) aviso.hidden = false;
      }, CONFIG.avisoLentidaoMs);
    }
  }

  function finalizarCarregamento() {
    clearTimeout(temporizadorLentidao);
    palco.removeAttribute('aria-busy');
    carregando.hidden = true;
    aviso.hidden = true;
  }

  /* ----------------------------------------------------------
   * Roteamento por hash  (#/secao/painel)
   * -------------------------------------------------------- */
  /** '' = início; null = âncora interna (ex.: #temas), não é rota. */
  function rotaAtual() {
    var hash = window.location.hash;
    if (!hash || hash === '#' || hash === '#/') return '';
    if (hash.indexOf('#/') !== 0) return null;
    var rota = hash.slice(2);
    try { rota = decodeURIComponent(rota); } catch (e) { /* mantém como veio */ }
    return rota.replace(/\/+$/, '');
  }

  function mostrarVista(nome) {
    Object.keys(vistas).forEach(function (chave) { vistas[chave].hidden = chave !== nome; });
    app.setAttribute('data-vista', nome);
    acoes.hidden = nome !== 'painel';
    tituloPainel.hidden = nome !== 'painel';
  }

  function atualizarMigalhas(itens) {
    var lista = $('ol', migalhas);
    lista.textContent = '';
    itens.forEach(function (item) {
      var li = el('li', { class: 'migalhas__item' });
      if (item.href) li.appendChild(el('a', { href: item.href, text: item.texto }));
      else li.appendChild(el('span', { 'aria-current': item.atual ? 'page' : null, text: item.texto }));
      lista.appendChild(li);
    });
  }

  var primeiraRenderizacao = true;

  function rotear() {
    var rota = rotaAtual();
    if (rota === null) {
      if (!primeiraRenderizacao) return;
      rota = '';
    }
    var painel = paineisPorRota.get(rota);
    esconderDica();
    atualizarVoltarTopo();

    if (!rota) {
      painelAtual = null;
      mostrarVista('inicio');
      marcarAtivo('');
      atualizarMigalhas([{ texto: 'Início', atual: true }]);
      document.title = CONFIG.nomeSite;
      focarVista($('[data-foco]', vistas.inicio), 'Página inicial');
    } else if (painel) {
      painelAtual = painel;
      mostrarVista('painel');
      tituloPainel.textContent = painel.titulo;
      linkAvisoNovaAba.href = painel.url;
      marcarAtivo(painel.rota);
      abrirSecaoDoPainel(painel);
      // O título do painel já aparece no <h1>; a trilha mostra o caminho até a seção.
      atualizarMigalhas(painel.secao.unica
        ? [{ texto: 'Início', href: '#/' }]
        : [{ texto: 'Início', href: '#/' }, { texto: painel.secao.titulo }]);
      document.title = (painel.secao.unica ? painel.titulo : painel.titulo + ' · ' + painel.secao.titulo) + ' | ' + CONFIG.nomeSite;
      exibirIframe(painel);
      focarVista(tituloPainel, 'Painel ' + painel.titulo + ', ' + painel.secao.titulo);
    } else {
      painelAtual = null;
      mostrarVista('naoEncontrado');
      marcarAtivo(null);
      atualizarMigalhas([{ texto: 'Início', href: '#/' }, { texto: 'Página não encontrada', atual: true }]);
      document.title = 'Página não encontrada | ' + CONFIG.nomeSite;
      focarVista($('[data-foco]', vistas.naoEncontrado), 'Página não encontrada');
    }

    if (mqMobile.matches) fecharGaveta(false);
    primeiraRenderizacao = false;
  }

  /** Move o foco para o título da vista (leitores de tela) e anuncia a troca. */
  function focarVista(titulo, mensagem) {
    if (primeiraRenderizacao) return;
    if (titulo) titulo.focus({ preventScroll: true });
    principal.scrollTop = 0;
    window.scrollTo(0, 0);
    anunciador.textContent = '';
    window.setTimeout(function () { anunciador.textContent = mensagem; }, 60);
  }

  /* ----------------------------------------------------------
   * Ação do painel (tela cheia)
   * -------------------------------------------------------- */
  function configurarAcoes() {
    var botaoTelaCheia = $('#acao-tela-cheia');
    var suportaTelaCheia = document.fullscreenEnabled || document.webkitFullscreenEnabled;
    if (!suportaTelaCheia) {
      botaoTelaCheia.hidden = true;
      return;
    }

    botaoTelaCheia.addEventListener('click', function () {
      var emTelaCheia = document.fullscreenElement || document.webkitFullscreenElement;
      if (emTelaCheia) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        var alvo = $('.palco-moldura');
        (alvo.requestFullscreen || alvo.webkitRequestFullscreen).call(alvo);
      }
    });

    var aoMudarTelaCheia = function () {
      var ativo = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      botaoTelaCheia.setAttribute('aria-pressed', String(ativo));
      $('.acao__texto', botaoTelaCheia).textContent = ativo ? 'Sair da tela cheia' : 'Tela cheia';
      $('use', botaoTelaCheia).setAttribute('href', ativo ? '#i-sair-tela-cheia' : '#i-tela-cheia');
    };
    document.addEventListener('fullscreenchange', aoMudarTelaCheia);
    document.addEventListener('webkitfullscreenchange', aoMudarTelaCheia);
  }

  /* ----------------------------------------------------------
   * Dica flutuante (menu recolhido) e botão "voltar ao topo"
   * -------------------------------------------------------- */
  function menuRecolhido() {
    return app.getAttribute('data-menu') === 'recolhido' && !mqMobile.matches;
  }

  function mostrarDica(alvo) {
    var texto = alvo && alvo.getAttribute('data-dica');
    if (!texto || !menuRecolhido()) return esconderDica();
    var r = alvo.getBoundingClientRect();
    dica.textContent = texto;
    dica.style.top = Math.round(r.top + r.height / 2) + 'px';
    dica.style.left = Math.round(r.right + 14) + 'px';
    dica.hidden = false;
  }

  function esconderDica() { dica.hidden = true; }

  function atualizarVoltarTopo() {
    voltarTopo.hidden = !(app.getAttribute('data-vista') === 'inicio' && principal.scrollTop > 480);
  }

  function rolarPara(alvo) {
    alvo.scrollIntoView({ behavior: mqMovimentoReduzido.matches ? 'auto' : 'smooth', block: 'start' });
  }

  function focarBusca() {
    if (mqMobile.matches) { abrirGaveta(true); return; }
    if (menuRecolhido()) definirMenuRecolhido(false);
    busca.focus();
  }

  /* ----------------------------------------------------------
   * Eventos globais
   * -------------------------------------------------------- */
  function configurarEventos() {
    window.addEventListener('hashchange', rotear);

    busca.addEventListener('input', function () { filtrarMenu(busca.value); });
    busca.addEventListener('keydown', function (evento) {
      if (evento.key === 'Enter') {
        evento.preventDefault();
        var primeiro = $$('.nav__item:not([hidden]) [data-rota]', navLista).filter(function (a) {
          return !a.closest('li[hidden]');
        })[0];
        if (primeiro) {
          window.location.hash = primeiro.getAttribute('href');
          busca.value = '';
          filtrarMenu('');
        }
      } else if (evento.key === 'Escape' && busca.value) {
        evento.stopPropagation();
        busca.value = '';
        filtrarMenu('');
      }
    });

    botaoMenu.addEventListener('click', function () { abrirGaveta(false); });
    botaoFecharMenu.addEventListener('click', function () { fecharGaveta(); });
    scrim.addEventListener('click', function () { fecharGaveta(); });

    botaoRecolher.addEventListener('click', function () {
      definirMenuRecolhido(app.getAttribute('data-menu') !== 'recolhido');
      esconderDica();
    });

    $('#busca-trilho').addEventListener('click', focarBusca);

    $('.pular-link').addEventListener('click', function (evento) {
      evento.preventDefault();
      var alvo = app.getAttribute('data-vista') === 'painel' ? tituloPainel : principal;
      alvo.focus();
    });

    // Dicas do menu recolhido (mouse e teclado)
    sidebar.addEventListener('mouseover', function (evento) { mostrarDica(evento.target.closest('[data-dica]')); });
    sidebar.addEventListener('mouseleave', esconderDica);
    sidebar.addEventListener('focusin', function (evento) { mostrarDica(evento.target.closest('[data-dica]')); });
    sidebar.addEventListener('focusout', esconderDica);
    $('.lateral__nav').addEventListener('scroll', esconderDica, { passive: true });

    principal.addEventListener('scroll', atualizarVoltarTopo, { passive: true });
    voltarTopo.addEventListener('click', function () {
      principal.scrollTo({ top: 0, behavior: mqMovimentoReduzido.matches ? 'auto' : 'smooth' });
      $('[data-foco]', vistas.inicio).focus({ preventScroll: true });
    });

    // Atalhos: "/" ou Ctrl+K focam a busca; Esc fecha a gaveta
    document.addEventListener('keydown', function (evento) {
      var digitando = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if ((evento.key === '/' && !digitando) || ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === 'k')) {
        evento.preventDefault();
        focarBusca();
      } else if (evento.key === 'Escape') {
        fecharGaveta();
      }
    });

    // Mantém o foco dentro da gaveta aberta (mobile)
    sidebar.addEventListener('keydown', function (evento) {
      if (evento.key !== 'Tab' || !app.classList.contains('gaveta-aberta')) return;
      var focaveis = $$('a[href], button:not([disabled]), input', sidebar).filter(function (n) {
        return n.offsetParent !== null && !n.closest('[hidden]');
      });
      if (!focaveis.length) return;
      var primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
      if (evento.shiftKey && document.activeElement === primeiro) { evento.preventDefault(); ultimo.focus(); }
      else if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primeiro.focus(); }
    });

    if (mqMobile.addEventListener) mqMobile.addEventListener('change', aoMudarBreakpoint);
    else mqMobile.addListener(aoMudarBreakpoint);
  }

  /* ----------------------------------------------------------
   * Inicialização
   * -------------------------------------------------------- */
  function iniciar() {
    if (!secoes.length) {
      console.error('[Observatório] Catálogo vazio ou não carregado (assets/js/catalogo.js).');
    }
    var ano = $('#ano-atual');
    if (ano) ano.textContent = String(new Date().getFullYear());

    montarMenu();
    montarInicio();
    configurarAcoes();
    configurarEventos();
    aoMudarBreakpoint();
    rotear();
    app.classList.add('is-pronto');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
