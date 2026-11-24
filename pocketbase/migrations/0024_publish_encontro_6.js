// Encontro 6 · Crenças sobre dinheiro, venda e exposição.
// Atualiza o título da aula e publica o card na trilha do Guia da Aluna,
// logo depois do Encontro 5. A aula é em breve, então precisa aparecer
// para alunas matriculadas sem depender de toggle manual no Admin.
// Idempotente: em um banco sem o registro, apenas não faz nada.
migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('fac_guia_encontros', 'numero', 6)
      record.set('titulo', 'Encontro 6 · Crenças sobre dinheiro, venda e exposição')
      record.set('status', 'publicado')
      app.save(record)
    } catch (_) {
      // Registro ainda não existe nesta cópia do banco; nada a publicar
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('fac_guia_encontros', 'numero', 6)
      record.set('titulo', 'Encontro 6 — Tema a ser liberado')
      record.set('status', 'rascunho')
      app.save(record)
    } catch (_) {}
  },
)
