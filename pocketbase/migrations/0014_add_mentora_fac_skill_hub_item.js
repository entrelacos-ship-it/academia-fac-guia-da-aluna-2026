migrate(
  (app) => {
    // 1. Adicionar campo 'categoria' à coleção fac_hub_items se ainda não existir
    try {
      const col = app.findCollectionByNameOrId('fac_hub_items')
      if (!col.fields.getByName('categoria')) {
        col.fields.add(
          new TextField({
            name: 'categoria',
          }),
        )
        app.save(col)
      }
    } catch (err) {
      console.log('Aviso ao ajustar coleção fac_hub_items:', err)
    }

    // 2. Atualizar itens existentes com suas categorias correspondentes
    try {
      const calc = app.findFirstRecordByData('fac_hub_items', 'chave', 'calculadora')
      calc.set('categoria', 'aplicativos')
      app.save(calc)
    } catch (_) {}

    try {
      const ikigai = app.findFirstRecordByData('fac_hub_items', 'chave', 'ikigai')
      ikigai.set('categoria', 'aplicativos')
      app.save(ikigai)
    } catch (_) {}

    // 3. Cadastrar a skill Mentora-FAC na coleção fac_hub_items
    try {
      app.findFirstRecordByData('fac_hub_items', 'chave', 'mentora-fac')
    } catch (_) {
      try {
        const col = app.findCollectionByNameOrId('fac_hub_items')
        const record = new Record(col)
        record.set('chave', 'mentora-fac')
        record.set('titulo', 'Mentora do FAC')
        record.set(
          'descricao',
          'Mentora de carreira das alunas da Academia Método FAC: tira dúvidas do método, realiza o diagnóstico profundo dos 3 pilares, revisa entregáveis e direciona plano de 90 dias.',
        )
        record.set('bloco', 'sistema')
        record.set('ativo', true)
        record.set('rotulo_badge', 'Download Exclusivo')
        record.set('ordem', 4)
        record.set('icone', 'Sparkles')
        record.set('url', '/downloads/Mentora-FAC.md')
        record.set('exclusivo_alunas', true)
        record.set('categoria', 'skills')
        app.save(record)
      } catch (err) {
        console.log('Erro ao cadastrar mentora-fac em fac_hub_items:', err)
      }
    }
  },
  (app) => {
    try {
      const item = app.findFirstRecordByData('fac_hub_items', 'chave', 'mentora-fac')
      app.delete(item)
    } catch (_) {}
  },
)
