migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // 1. Adicionar campo 'role' (select com valores 'user', 'admin') se não existir
    if (!users.fields.getByName('role')) {
      users.fields.add(
        new SelectField({
          name: 'role',
          required: false,
          values: ['user', 'admin'],
          maxSelect: 1,
        }),
      )
    }

    // 2. Atualizar regras de acesso para permitir que 'admin' liste e visualize todos os usuários,
    // mantendo contas normais limitadas ao seu próprio registro (id = @request.auth.id)
    users.listRule =
      "@request.auth.id != '' && (id = @request.auth.id || @request.auth.role = 'admin')"
    users.viewRule =
      "@request.auth.id != '' && (id = @request.auth.id || @request.auth.role = 'admin')"

    app.save(users)

    // 3. Atualizar usuário inicial existente com role = 'user' se ainda não tiver
    try {
      const initialUser = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'entre.lacos.psi.cursos@gmail.com',
      )
      if (!initialUser.get('role')) {
        initialUser.set('role', 'user')
        app.save(initialUser)
      }
    } catch (_) {}

    // 4. Criar ou atualizar usuário institucional admin idempotentemente
    const adminEmail = 'admin@entrelacospsi.com.br'
    const adminPass = 'Admin@Fac2026!'
    try {
      const existingAdmin = app.findAuthRecordByEmail('_pb_users_auth_', adminEmail)
      existingAdmin.set('role', 'admin')
      existingAdmin.set('name', 'Administradora Entrelaços')
      existingAdmin.setPassword(adminPass)
      existingAdmin.setVerified(true)
      app.save(existingAdmin)
    } catch (_) {
      const adminRecord = new Record(users)
      adminRecord.setEmail(adminEmail)
      adminRecord.setPassword(adminPass)
      adminRecord.setVerified(true)
      adminRecord.set('name', 'Administradora Entrelaços')
      adminRecord.set('role', 'admin')
      app.save(adminRecord)
    }

    // 5. Atualizar regras da coleção fac_backups para permitir visualização por admins
    try {
      const backups = app.findCollectionByNameOrId('fac_backups')
      backups.listRule =
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')"
      backups.viewRule =
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')"
      app.save(backups)
    } catch (_) {}
  },
  (app) => {
    try {
      const admin = app.findAuthRecordByEmail('_pb_users_auth_', 'admin@entrelacospsi.com.br')
      app.delete(admin)
    } catch (_) {}

    try {
      const users = app.findCollectionByNameOrId('_pb_users_auth_')
      users.listRule = 'id = @request.auth.id'
      users.viewRule = 'id = @request.auth.id'
      const roleField = users.fields.getByName('role')
      if (roleField) {
        users.fields.removeByName('role')
      }
      app.save(users)
    } catch (_) {}
  },
)
