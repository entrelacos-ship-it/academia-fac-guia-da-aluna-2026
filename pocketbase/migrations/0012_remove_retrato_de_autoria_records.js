migrate(
  (app) => {
    // 1. Remover qualquer item remanescente com chave ou título citando Retrato de Autoria na coleção fac_hub_items
    try {
      const hubItems = app.findRecordsByFilter(
        'fac_hub_items',
        "chave ~ 'retrato' || titulo ~ 'Retrato' || url ~ 'retrato'",
        '-created',
        50,
        0,
      )
      for (const item of hubItems) {
        app.delete(item)
      }
    } catch (_) {}

    // 2. Garantir que fac_guia_encontros não contenha recursos ou títulos citando Retrato de Autoria
    try {
      const encontros = app.findRecordsByFilter(
        'fac_guia_encontros',
        "titulo ~ 'Retrato'",
        'numero',
        50,
        0,
      )
      for (const enc of encontros) {
        if (enc.getInt('numero') === 2) {
          enc.set('titulo', 'Encontro 2 — Identidade Profissional & Propósito Clínico')
          app.save(enc)
        }
      }
    } catch (_) {}

    // 3. Limpar recursos vinculados nos encontros que possam apontar para /guia/retrato-de-autoria
    try {
      const allEncontros = app.findRecordsByFilter('fac_guia_encontros', '', 'numero', 100, 0)
      for (const enc of allEncontros) {
        const recursosRaw = enc.get('recursos')
        if (Array.isArray(recursosRaw)) {
          const filtrados = recursosRaw.filter((r) => {
            if (!r) return false
            const url = (r.url || '').toLowerCase()
            const rotulo = (r.rotulo || '').toLowerCase()
            return !url.includes('retrato') && !rotulo.includes('retrato')
          })
          if (filtrados.length !== recursosRaw.length) {
            enc.set('recursos', filtrados)
            app.save(enc)
          }
        }
      }
    } catch (_) {}
  },
  (app) => {
    // Reversão no-op pois a remoção do Retrato é definitiva
  },
)
