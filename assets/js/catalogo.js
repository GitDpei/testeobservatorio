/**
 * ============================================================
 *  CATÁLOGO DE PAINÉIS — Observatório Municipal de Porto Velho
 * ============================================================
 *  Este é o ÚNICO arquivo que precisa ser editado para incluir,
 *  remover, renomear ou reordenar painéis. O menu lateral, a
 *  página inicial, a busca e os links compartilháveis são gerados
 *  automaticamente a partir desta lista (a ordem aqui é a ordem
 *  do menu).
 *
 *  Como adicionar um painel:
 *   1. No Power BI: Arquivo > Inserir relatório > Publicar na Web.
 *   2. Copie o LINK (https://app.powerbi.com/view?r=...).
 *      Também pode colar o código <iframe> inteiro: o site extrai o src.
 *   3. Adicione { titulo: "...", url: "..." } dentro da seção desejada.
 *
 *  Ícones disponíveis para as seções:
 *   prancheta, mapa, pessoas, broto, dinheiro, predio-publico,
 *   guindaste, arvore, alvo, barras, planta, escudo, banco-dados,
 *   medidor, trofeu.
 *
 *  Por segurança, só são aceitos links https de app.powerbi.com
 *  (ajuste em assets/js/app.js > CONFIG.hostsPermitidos).
 * ============================================================
 */
window.OBSERVATORIO_CATALOGO = [
  {
    titulo: "Censo",
    icone: "prancheta",
    paineis: [
      { titulo: "Religião", url: "https://app.powerbi.com/view?r=eyJrIjoiMmVjZWJlOTUtZmIyOC00NDNiLWI3ZjktNjk5OGUxYzkwNDVmIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9" },
      { titulo: "Quilombolas", url: "https://app.powerbi.com/view?r=eyJrIjoiNmI0YmU0YmMtOWRlMS00NmVlLThhYjUtM2NkMGNlNDU2ZjFlIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=d9ea0affed466e7c11ae" },
      { titulo: "População", url: "https://app.powerbi.com/view?r=eyJrIjoiOGJmZjIzYTUtYmVlZS00NTU2LWE0M2EtZDdkYzEzZTJlN2JkIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9" },
      { titulo: "População - Características", url: "https://app.powerbi.com/view?r=eyJrIjoiOTgzYTg5YmEtZmRkMy00NWUwLWIxZjctZmU1Mjk1ZTBjNGM0IiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9" },
      { titulo: "Indígenas", url: "https://app.powerbi.com/view?r=eyJrIjoiM2U5NzRjNTMtOTZjOC00ZWNlLThmYjItYmIzNjdlNDQ0YzA0IiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=004f10693c1747580e07" },
      { titulo: "Favelas", url: "https://app.powerbi.com/view?r=eyJrIjoiNTE4MDE5NzAtYjFmMC00Y2U1LTllZGYtZDkzYzBhZjY3ZWUyIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9" },
      { titulo: "Educação", url: "https://app.powerbi.com/view?r=eyJrIjoiNTZjOWNhYmItZGI3Yi00ZjIzLWFhM2YtNDhmYWRlMDQzNTMwIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9" },
      { titulo: "Domicílios", url: "https://app.powerbi.com/view?r=eyJrIjoiMTQ2NzM5YWYtMzU1ZS00MDhiLTlmNzMtZTllMDcxY2ZlYjRmIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9" },
      { titulo: "Distritos", url: "https://app.powerbi.com/view?r=eyJrIjoiNzEyMTkyY2ItMThiNy00MzEzLTg3MjEtOTYyZmQ1ZTI4MmRhIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9" },
      { titulo: "Deficiência e autismo", url: "https://app.powerbi.com/view?r=eyJrIjoiMjczMDAwNjUtZDgyOC00NTI4LWIyMjMtYmU3NzEzYzMzMmZhIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9" },
      { titulo: "Bairros", url: "https://app.powerbi.com/view?r=eyJrIjoiYmE1MTVmNTYtMzhiMi00MjVmLWE1MDItODg1NTNhMDVmMGEzIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9" },
      { titulo: "Censo Demográfico", url: "https://app.powerbi.com/view?r=eyJrIjoiZTE1MDljNmQtMmU1ZS00YjQzLTk3NTItYTJlNzRmYjEwMWRlIiwidCI6ImFhYzA0ZmI0LTJkMGMtNGIzOS04MmI5LTg0NWEyMDdhNWU2YiJ9" }
    ]
  },
  {
    titulo: "Território",
    icone: "mapa",
    paineis: [
      { titulo: "Território", url: "https://app.powerbi.com/view?r=eyJrIjoiNTE3YjNkMzktZDk4MC00MTdhLWJlYjctNGUzYWQwNTc2MzAzIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=ecf669772b0a5a04d509" }
    ]
  },
  {
    titulo: "Demografia",
    icone: "pessoas",
    paineis: [
      { titulo: "Natalidade", url: "https://app.powerbi.com/view?r=eyJrIjoiNzM2ZWFhNmYtMjQ5My00ZjNkLTg0NjctMTQ4MzE4M2UxOTgzIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=52a5907f08598c07623c" },
      { titulo: "Mortalidade", url: "https://app.powerbi.com/view?r=eyJrIjoiNzg5OWJmMjItMjlkYy00NjJiLTk2MmEtMjQ5NmM5ZjNlMWRkIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=f16f3fb3606247aa091b" },
      { titulo: "População e Eleitores", url: "https://app.powerbi.com/view?r=eyJrIjoiZDU3OWQyNWQtYzFkYS00ZmQ5LWE2YjgtYzNhYTZmZDQ5N2VhIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=99f04937be6307319270" }
    ]
  },
  {
    titulo: "Qualidade de Vida",
    icone: "broto",
    paineis: [
      { titulo: "Assistência Social", url: "https://app.powerbi.com/view?r=eyJrIjoiY2ZiOTdlNzktZmU5Mi00YWFhLWJkNWQtYjIwNDhlZTU3NGMwIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=f669ac52120abaa305db" },
      { titulo: "Educação", url: "https://app.powerbi.com/view?r=eyJrIjoiNmMzYWI1NWMtMGEzMy00YTVlLTgxZDQtZjFmMjk5M2RkZTQ3IiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=021da59b40da69692bb0" },
      { titulo: "Saúde", url: "https://app.powerbi.com/view?r=eyJrIjoiMDAzYTg1ODMtZmQ1MS00YzhkLWE1NDgtNTYyYTAzNDZmYzM4IiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=ddf9bbbe0896c5a51ceb" }
    ]
  },
  {
    titulo: "Aspectos Econômicos",
    icone: "dinheiro",
    paineis: [
      { titulo: "Comércio", url: "https://app.powerbi.com/view?r=eyJrIjoiYzE1NzgyYzktNTNlYi00YjMzLWJlODAtYzI1YTc3YTVlMTA2IiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=ac11dbd19958335dc87e" },
      { titulo: "Contas Regionais", url: "https://app.powerbi.com/view?r=eyJrIjoiZmQ3ZDQxNzAtOTI1ZC00YmUyLThmZTEtNzZiMWVjYjhlZTgzIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=5789ef4fe42d7506d835" }
    ]
  },
  {
    titulo: "Finanças Públicas",
    icone: "predio-publico",
    paineis: [
      { titulo: "Despesa", url: "https://app.powerbi.com/view?r=eyJrIjoiZGM1NWFiNDctYjQ3OC00ZDJhLTg3NWUtZDk2ZDZmYzliODNjIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=6c0d0e6635225c10b651" },
      { titulo: "Receitas", url: "https://app.powerbi.com/view?r=eyJrIjoiYjVkNmRhN2QtNDc2Zi00OTRjLTk5MjgtNjI2Y2EyNmRjOTk2IiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=7025bf10c7c0b4b27043" }
    ]
  },
  {
    titulo: "Infraestrutura",
    icone: "guindaste",
    paineis: [
      { titulo: "Energia", url: "https://app.powerbi.com/view?r=eyJrIjoiMDY2YzNlMTYtMTVmZC00NzA0LTk4NTMtZWE4MzZiMWU5MmYxIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=a959279c4270d87ec369" },
      { titulo: "Saneamento", url: "https://app.powerbi.com/view?r=eyJrIjoiNzA0OGU1MTUtM2FmOS00MTM3LThlM2EtMWZkOTYzNDM1MTE5IiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=b76b9bd983296332d556" },
      { titulo: "Telefonia Fixa e Transporte", url: "https://app.powerbi.com/view?r=eyJrIjoiODQ4MjExMWItOGQ3Yy00OGIxLTkwMGMtMDVhNDg1YTZkOTA3IiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=2cd62a18734782c2a710" }
    ]
  },
  {
    titulo: "Meio Ambiente",
    icone: "arvore",
    paineis: [
      { titulo: "Meio Ambiente", url: "https://app.powerbi.com/view?r=eyJrIjoiZmI3Mzg4OTgtNDc0Ny00ZjlmLThmZDAtN2UxZjU4ODdhOWM0IiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=6ee14fa4876bc340c81a" }
    ]
  },
  {
    titulo: "ODS",
    icone: "alvo",
    paineis: [
      { titulo: "ODS", url: "https://app.powerbi.com/view?r=eyJrIjoiNjBhNTI5YmUtMjczNy00OTExLTkxNmQtNzkxMDNhMGUwMDQ0IiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=b6af275ae18ce8d3a26a" }
    ]
  },
  {
    titulo: "Indicadores",
    icone: "barras",
    paineis: [
      { titulo: "Agropecuária", url: "https://app.powerbi.com/view?r=eyJrIjoiZDJiNTQ5ZDgtY2UxYy00NzcxLWJlZjMtYmJlZjE4ZmJkNDc1IiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=a69ee421e941cd513ac5" },
      { titulo: "Sociais", url: "https://app.powerbi.com/view?r=eyJrIjoiMjcxMWM5ZWItODNlMS00MjM0LTlmZDItMDgzZDk1MzI4ODUxIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=68828ceb4cddbf96154d" },
      { titulo: "Econômicos", url: "https://app.powerbi.com/view?r=eyJrIjoiOGNkZmM1MTItYThkNC00MzYwLWFkZDUtMWEyNWI5MzU1NmM0IiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=5cce9e4945201bbad5ea" },
      { titulo: "IDSC - PVH", url: "https://app.powerbi.com/view?r=eyJrIjoiODk0NWIzNDgtYWZhNi00ZjUyLWI3ODYtYWE0MTI5MGVjMjg2IiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=de55ee04566c203363a4" }
    ]
  },
  {
    titulo: "IPS",
    icone: "medidor",
    paineis: [
      { titulo: "IPS", url: "https://app.powerbi.com/view?r=eyJrIjoiNWQzNzg0NDMtYzg4MS00MWE0LWJmZTYtYjE0MGY2ZWM3MDlhIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=55fbeff5e297de5024c3" }
    ]
  },
  {
    titulo: "CLP",
    icone: "trofeu",
    paineis: [
      { titulo: "CLP", url: "https://app.powerbi.com/view?r=eyJrIjoiZTJkNjk5NjUtYTUxNy00NWEwLTlmMjEtMmZmNDE0NDNmN2Q2IiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9" }
    ]
  },
  {
    titulo: "Plano Diretor",
    icone: "planta",
    paineis: [
      { titulo: "Plano Diretor", url: "https://app.powerbi.com/view?r=eyJrIjoiYWE0OWY0YjQtNWY4Yi00ZjRjLWI3MWMtZTM2ZTgwYzczNGYxIiwidCI6IjU1ZDQ0MWRkLTQ1MzgtNGI1Yi04YjRiLTA4YjM3OTEzYTk5MyJ9&pageName=cfc86ecee5a1cf3d67b5" }
    ]
  },
  {
    titulo: "Defesa Civil",
    icone: "escudo",
    paineis: [
      { titulo: "Projeto Acolher", url: "https://app.powerbi.com/view?r=eyJrIjoiZTMzNDgxNzItNTg0OS00NDIwLTg1OTAtM2QwNGE4ZjExYzM1IiwidCI6IjYwMTQxNTkzLTI3MmQtNGZjYS05OTYyLWIxNTE4ZTgwNGYwZCJ9" }
    ]
  }

  /* ---- Dados Abertos: aparece no modelo, mas ainda não tem link. ----
     Para ativar, remova as marcas de comentário e preencha as URLs.
  ,{
    titulo: "Dados Abertos",
    icone: "banco-dados",
    paineis: [
      { titulo: "Nome do painel", url: "https://app.powerbi.com/view?r=..." }
    ]
  }
  */
];
