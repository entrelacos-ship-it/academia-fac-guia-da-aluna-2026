migrate(
  (app) => {
    try {
      const enc2 = app.findFirstRecordByData('fac_guia_encontros', 'numero', 2)
      enc2.set('titulo', 'Encontro 2: Do sentido ao mercado')
      enc2.set('data_prevista', '13/10/2026')
      // Assegura que o status do encontro continua como publicado para permitir acesso às alunas validadas
      enc2.set('status', 'publicado')
      app.save(enc2)
    } catch (err) {
      console.warn('[Migration 0015] Encontro 2 record not found or error:', err)
    }
  },
  (app) => {
    try {
      const enc2 = app.findFirstRecordByData('fac_guia_encontros', 'numero', 2)
      enc2.set('titulo', 'Encontro 2 — Identidade Profissional & Propósito Clínico')
      enc2.set('data_prevista', '13/10/2026')
      app.save(enc2)
    } catch (_) {}
  },
)
