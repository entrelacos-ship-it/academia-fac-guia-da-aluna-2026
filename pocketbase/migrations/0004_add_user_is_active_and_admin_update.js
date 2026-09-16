migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // 1. Adicionar campo 'is_active' (booleano opcional — padrão true)
    // Regra Skip Cloud: nunca marcar bool flags como required
    if (!users.fields.getByName('is_active')) {
      users.fields.add(
        new BoolField({
          name: 'is_active',
          required: false,
        }),
      )
    }

    // 2. Atualizar regras da coleção users:
    // list/view: auth user pode ver seu perfil OU admin pode ver todos
    // update: o próprio usuário pode atualizar seus dados OU admin pode atualizar contas
    users.listRule =
      "@request.auth.id != '' && (id = @request.auth.id || @request.auth.role = 'admin')"
    users.viewRule =
      "@request.auth.id != '' && (id = @request.auth.id || @request.auth.role = 'admin')"
    users.updateRule =
      "@request.auth.id != '' && (id = @request.auth.id || @request.auth.role = 'admin')"

    app.save(users)

    // 3. Garantir que usuárias existentes tenham is_active = true
    try {
      app.db().newQuery('UPDATE users SET is_active = 1 WHERE is_active IS NULL').execute()
    } catch (_) {}
  },
  (app) => {
    try {
      const users = app.findCollectionByNameOrId('_pb_users_auth_')
      users.updateRule = 'id = @request.auth.id'
      const isActiveField = users.fields.getByName('is_active')
      if (isActiveField) {
        users.fields.removeByName('is_active')
      }
      app.save(users)
    } catch (_) {}
  },
)
