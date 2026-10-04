migrate(
  (app) => {
    // Migration 0006: Descontaminação de dados legados do IKIGAI na coleção fac_backups
    // Remove qualquer item contendo "Marina", "Trava estrutural", IDs de exemplo ou frases do caso fictício
    const contaminatedPhrases = [
      'marina',
      'marina é psicóloga',
      'marina e psicóloga',
      'construindo o consultório',
      'trava estrutural:',
      'trava estrutural',
      'dependência de receita associada a volume de atendimentos',
    ]

    const fictitiousIdRegex = /^ex-[lgwp]\d+$/i

    const isContaminated = (item) => {
      if (!item) return false
      if (item.id && (fictitiousIdRegex.test(item.id) || item.id.startsWith('pres-'))) {
        return true
      }
      if (item.text) {
        const lower = item.text.toLowerCase()
        return contaminatedPhrases.some((phrase) => lower.includes(phrase))
      }
      return false
    }

    try {
      const records = app.findRecordsByFilter('fac_backups', '', '', 100, 0)
      for (const rec of records) {
        const payload = rec.get('payload')
        if (!payload || !payload.data || !payload.data.ikigai) {
          continue
        }

        const iki = payload.data.ikigai
        if (!iki.circles) continue

        let changed = false
        const cleanList = (list) => {
          if (!Array.isArray(list)) return []
          return list.filter((item) => {
            if (isContaminated(item)) {
              changed = true
              return false
            }
            return true
          })
        }

        iki.circles.love = cleanList(iki.circles.love || [])
        iki.circles.goodAt = cleanList(iki.circles.goodAt || [])
        iki.circles.worldNeeds = cleanList(iki.circles.worldNeeds || [])
        iki.circles.paidFor = cleanList(iki.circles.paidFor || [])

        if (changed) {
          payload.data.ikigai = iki
          rec.set('payload', payload)
          app.save(rec)
        }
      }
    } catch (err) {
      console.log('[Migration 0006] Aviso ao sanitizar fac_backups:', err)
    }
  },
  (app) => {
    // Reversão não é necessária pois os itens removidos eram estritamente contaminantes
  },
)
