// Publica o Encontro 5 · Branding na trilha do Guia da Aluna.
// A aula está próxima, então o caderno precisa aparecer para alunas matriculadas
// sem depender de toggle manual no Admin. Idempotente: em um banco sem o registro,
// apenas não faz nada.
migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('fac_guia_encontros', 'numero', 5)
      record.set('status', 'publicado')
      app.save(record)
    } catch (_) {
      // Registro ainda não existe nesta cópia do banco; nada a publicar
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('fac_guia_encontros', 'numero', 5)
      record.set('status', 'rascunho')
      app.save(record)
    } catch (_) {}
  },
)
