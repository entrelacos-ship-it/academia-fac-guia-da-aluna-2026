migrate(
  (app) => {
    try {
      const item = app.findFirstRecordByData('fac_hub_items', 'chave', 'guia_aluna')
      item.set(
        'descricao',
        'Aula Magna aberta com o Diagnóstico FAC Aprofundado (24 perguntas), trilha completa de encontros, cadernos didáticos e validação do e-mail de compra para alunas.',
      )
      item.set('rotulo_badge', 'Aula 1 Aberta · Trilha do Ciclo')
      app.save(item)
    } catch (_) {}
  },
  (app) => {
    try {
      const item = app.findFirstRecordByData('fac_hub_items', 'chave', 'guia_aluna')
      item.set(
        'descricao',
        'Aula Magna aberta com o Diagnóstico FAC Aprofundado (24 perguntas), índice dos 19 encontros, cadernos didáticos e validação do e-mail de compra para alunas.',
      )
      item.set('rotulo_badge', 'Aula 1 Aberta · 19 Encontros')
      app.save(item)
    } catch (_) {}
  },
)
