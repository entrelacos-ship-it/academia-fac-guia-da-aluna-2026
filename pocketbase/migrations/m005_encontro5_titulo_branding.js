// m005: renomeia o Encontro 5 para o tema BRANDING na trilha.
// Idempotente: aplica só quando o título ainda é o seed provisório.
migrate(
  (app) => {
    const rec = app.findFirstRecordByFilter('fac_guia_encontros', 'numero = 5')
    if (!rec) return
    const tituloAtual = rec.getString('titulo')
    const titulosProvisorios = [
      'Encontro 5 — Tema a ser liberado',
      'Encontro 5 · Tema a ser liberado',
    ]
    if (titulosProvisorios.includes(tituloAtual)) {
      rec.set('titulo', 'Encontro 5 · Branding')
      app.save(rec)
    }
  },
  (app) => {
    const rec = app.findFirstRecordByFilter('fac_guia_encontros', 'numero = 5')
    if (!rec) return
    if (rec.getString('titulo') === 'Encontro 5 · Branding') {
      rec.set('titulo', 'Encontro 5 — Tema a ser liberado')
      app.save(rec)
    }
  },
)
