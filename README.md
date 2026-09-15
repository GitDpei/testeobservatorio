# Observatório Municipal de Porto Velho

Site estático (HTML, CSS e JavaScript puro, sem dependências) que reúne os painéis
públicos do Power BI do Observatório em um só lugar: menu lateral com temas em
dropdown, busca, página inicial com todos os temas e o painel escolhido ao lado.

Feito para o **GitHub Pages**: não precisa de build, servidor nem banco de dados.

---

## Estrutura

```
.
├── index.html               # Página única (menu + área do painel)
├── 404.html                 # Página de erro do GitHub Pages
├── site.webmanifest         # Ícones e cores quando o site é "instalado" no celular
├── robots.txt
├── .nojekyll                # Diz ao GitHub Pages para publicar os arquivos como estão
└── assets/
    ├── css/styles.css       # Todo o visual (tokens de cor no início do arquivo)
    ├── js/catalogo.js       # ⭐ LISTA DE PAINÉIS — o único arquivo do dia a dia
    ├── js/app.js            # Menu, busca, rotas, carregamento dos painéis
    ├── fonts/               # Fonte Inter (hospedada no próprio site)
    └── img/                 # Logos, favicon, ícones e imagem de compartilhamento
                             # (logo-azul.png = versão transparente para fundos claros)
```

## Como incluir, trocar ou remover um painel

1. No Power BI Service, abra o relatório › **Arquivo › Inserir relatório › Publicar na Web (público)**.
2. Copie o **link** (`https://app.powerbi.com/view?r=...`). Pode colar o código `<iframe>` inteiro, se preferir: o site extrai o endereço sozinho.
3. Abra `assets/js/catalogo.js` e adicione uma linha dentro da seção desejada:

```js
{ titulo: "Nome do painel", url: "https://app.powerbi.com/view?r=..." },
```

A ordem no arquivo é a ordem do menu. Menu, página inicial, busca e links são
gerados automaticamente. Para criar um tema novo, copie um bloco `{ titulo, icone, paineis: [...] }`.
Os ícones disponíveis estão listados no topo do `catalogo.js`.

> Seções com um único painel de mesmo nome (ex.: Território) viram link direto no
> menu, um clique a menos. Para voltar ao comportamento do modelo antigo (sempre
> dropdown), mude `dropdownParaPainelUnico` para `true` no início de `assets/js/app.js`.

## Links compartilháveis

Cada painel tem um endereço próprio, por exemplo:

```
https://SEU-USUARIO.github.io/SEU-REPOSITORIO/#/demografia/natalidade
https://SEU-USUARIO.github.io/SEU-REPOSITORIO/#/censo/bairros
https://SEU-USUARIO.github.io/SEU-REPOSITORIO/#/territorio
```

O endereço é formado pelo nome da seção e do painel, sem acentos. **Se você renomear
um painel no `catalogo.js`, o link dele muda.**

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `observatorio`) e envie **todo o conteúdo desta pasta** para a raiz dele (inclusive o arquivo oculto `.nojekyll`).
   - Pelo site: *Add file › Upload files* e arraste os arquivos e pastas.
   - Pelo terminal:
     ```bash
     git init && git add . && git commit -m "Observatório Municipal"
     git branch -M main
     git remote add origin https://github.com/SEU-USUARIO/observatorio.git
     git push -u origin main
     ```
2. No repositório: **Settings › Pages › Build and deployment › Source: Deploy from a branch**, branch `main`, pasta `/ (root)` › **Save**.
3. Em 1 a 2 minutos o site estará em `https://SEU-USUARIO.github.io/observatorio/`.
4. (Opcional) Domínio próprio, como `observatorio.portovelho.ro.gov.br`: em *Settings › Pages › Custom domain*, e crie o registro CNAME no DNS da prefeitura apontando para `SEU-USUARIO.github.io`. Marque **Enforce HTTPS**.

Depois de publicar, vale completar no `index.html` as tags `og:url`/`canonical` com o endereço final.

## Testar no computador antes de publicar

Abrir o `index.html` com dois cliques já mostra o site funcionando (apenas a fonte
Inter é trocada pela fonte do sistema, porque o navegador bloqueia fontes em arquivos
locais). Para ver exatamente como ficará no GitHub Pages, rode um servidor local na pasta:

```bash
python -m http.server 8000
# acesse http://localhost:8000
```

## Proporção dos painéis

O Power BI encaixa o relatório mantendo a proporção da página e pinta o resto de branco. O site
recorta a moldura do painel **na mesma proporção do relatório**, então não sobra faixa branca e nada
é esticado. O padrão está em `assets/css/styles.css` (`--razao-painel`, medido em 1600 × 873 = 1.8326)
e as exceções por painel em `assets/js/app.js` (`CONFIG.proporcaoPorRota`) ou no próprio catálogo:

```js
{ titulo: "Nome do painel", url: "https://app.powerbi.com/view?r=...", proporcao: "16/9" },
```

Sobrou branco dos lados? Aumente a razão. Sobrou em cima e embaixo? Diminua.

## Página inicial

Segue o estilo "soft UI": superfícies foscas, sombra dupla (relevo), poços afundados para campos,
ícones e trilhos, e anéis de proporção nos cartões de tema. Os tokens ficam no topo de
`assets/css/styles.css` (seção 2) e o conteúdo é montado por `montarInicio()` em `assets/js/app.js`.

## Decisões técnicas

| Tema | Como foi feito |
|---|---|
| Layout | Menu lateral + painel ao lado, como o modelo; visual de vidro fosco inspirado no UI.png. |
| Desempenho | Sem frameworks nem CDNs; fonte própria (48 KB); conexão antecipada com o Power BI; até 3 painéis já abertos ficam em memória para troca instantânea (`maxPaineisEmCache` no `app.js`). |
| Histórico | Cada troca de painel cria um iframe novo, então o botão **Voltar** do navegador volta para o painel anterior em vez de ficar preso dentro do Power BI. |
| Segurança | `Content-Security-Policy` só permite scripts do próprio site e iframes de `app.powerbi.com`; o catálogo rejeita links que não sejam `https://app.powerbi.com`. Para outro domínio, atualize `frame-src` no `index.html` **e** `hostsPermitidos` no `app.js`. |
| Acessibilidade | HTML semântico, "Pular para o conteúdo", dropdowns com `aria-expanded`, página atual com `aria-current`, foco visível, navegação completa por teclado (`/` ou `Ctrl+K` abre a busca, `Esc` fecha o menu), anúncio da troca de painel para leitores de tela, respeito a "reduzir movimento", "reduzir transparência" e alto contraste do Windows. Auditado com axe-core (WCAG 2.1 AA) sem violações. |
| Responsivo | No celular e no tablet o menu vira gaveta; os botões viram ícones; nada rola na horizontal. |
| Privacidade | Nenhum rastreador ou fonte externa; o único serviço de terceiros é o próprio Power BI. |

## Observação sobre o "Publicar na Web"

Painéis publicados com *Publicar na Web* ficam **públicos para qualquer pessoa na
internet**. Publique apenas dados que podem ser abertos (sem dados pessoais), conforme a LGPD.
