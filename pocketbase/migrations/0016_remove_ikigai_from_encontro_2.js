migrate(
  (app) => {
    try {
      const enc2 = app.findFirstRecordByData('fac_guia_encontros', 'numero', 2)
      enc2.set('titulo', 'Encontro 2: Do sentido ao mercado')
      enc2.set('data_prevista', '13/10/2026')
      enc2.set('status', 'publicado')
      enc2.set('conteudo', {
        introducao:
          'Neste segundo encontro, mergulhamos no Detetive de Nicho, skills do ChatGPT, brecha de mercado, público-alvo e relatório de posicionamento.',
        secoes: [
          {
            titulo: 'Detetive de Nicho & Posicionamento',
            texto:
              'Caderno didático interativo de 10 estações para investigação da dor latente, mapeamento dos 5 níveis de consciência e construção do relatório de posicionamento.',
          },
        ],
      })
      enc2.set('recursos', [])
      app.save(enc2)

      // Garantir que o IKIGAI está ativo no bloco Sistema do hub (Aplicativos e recursos)
      try {
        const ikigaiItem = app.findFirstRecordByData('fac_hub_items', 'chave', 'ikigai')
        ikigaiItem.set('ativo', true)
        ikigaiItem.set('bloco', 'sistema')
        ikigaiItem.set('categoria', 'aplicativos')
        ikigaiItem.set('url', '/ikigai')
        app.save(ikigaiItem)
      } catch (ikiErr) {
        console.warn('[Migration 0016] fac_hub_items ikigai not found:', ikiErr)
      }
    } catch (err) {
      console.warn('[Migration 0016] Encontro 2 record not found or error:', err)
    }
  },
  (app) => {
    try {
      const enc2 = app.findFirstRecordByData('fac_guia_encontros', 'numero', 2)
      enc2.set('recursos', [
        { rotulo: 'App Complementar: Meu IKIGAI', tipo: 'app', url: '/ikigai' },
      ])
      app.save(enc2)
    } catch (_) {}
  },
)
