migrate(
  (app) => {
    // 1. Atualizar conta tati.kellen@yahoo.com.br para is_active = true
    try {
      app
        .db()
        .newQuery("UPDATE users SET is_active = 1 WHERE lower(email) = 'tati.kellen@yahoo.com.br'")
        .execute()
    } catch (err) {
      console.warn('[Migration 0013] Erro ao atualizar tati.kellen:', err)
    }

    // 2. Garantir que nenhuma conta existente continue com is_active falso por omissão ou nulo
    try {
      app
        .db()
        .newQuery('UPDATE users SET is_active = 1 WHERE is_active IS NULL OR is_active = 0')
        .execute()
    } catch (err) {
      console.warn('[Migration 0013] Erro ao sincronizar is_active:', err)
    }
  },
  () => {},
)
