migrate(
  (app) => {
    try {
      const ikigaiItem = app.findFirstRecordByData('fac_hub_items', 'chave', 'ikigai')
      ikigaiItem.set('ativo', true)
      ikigaiItem.set('bloco', 'sistema')
      ikigaiItem.set('categoria', 'aplicativos')
      ikigaiItem.set('url', '/ikigai')
      app.save(ikigaiItem)
    } catch (err) {
      console.warn('[Migration 0017] fac_hub_items ikigai not found:', err)
    }
  },
  (app) => {
    try {
      const ikigaiItem = app.findFirstRecordByData('fac_hub_items', 'chave', 'ikigai')
      ikigaiItem.set('ativo', false)
      app.save(ikigaiItem)
    } catch (_) {}
  },
)
