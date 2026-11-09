migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('fac_guia_encontros', 'numero', 4)
      record.set('titulo', 'Encontro 4 · Canais (Facebook, Instagram, WhatsApp)')
      record.set('status', 'publicado')
      app.save(record)
    } catch (_) {
      // Record does not exist yet; nothing to update
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('fac_guia_encontros', 'numero', 4)
      record.set('status', 'rascunho')
      app.save(record)
    } catch (_) {}
  },
)
