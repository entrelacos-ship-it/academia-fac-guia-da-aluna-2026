migrate(
  (app) => {
    // Definir is_active = true para todas as usuárias existentes
    try {
      const users = app.findRecordsByFilter('users', '', '', 100, 0)
      for (const u of users) {
        u.set('is_active', true)
        app.save(u)
      }
    } catch (err) {
      console.warn('Ajuste de is_active nas usuárias:', err)
    }
  },
  () => {},
)
