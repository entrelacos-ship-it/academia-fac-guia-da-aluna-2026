migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // Idempotente: pular se o usuário inicial já existir
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'entre.lacos.psi.cursos@gmail.com')
      return
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('entre.lacos.psi.cursos@gmail.com')
    record.setPassword('Skip@Pass')
    record.setVerified(true)
    record.set('name', 'Psicóloga Entrelaços')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'entre.lacos.psi.cursos@gmail.com',
      )
      app.delete(record)
    } catch (_) {}
  },
)
