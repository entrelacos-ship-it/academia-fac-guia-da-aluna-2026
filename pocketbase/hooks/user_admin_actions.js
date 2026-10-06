// Rotas administrativas exclusivas para gestão e CRUD completo de contas (coleção users)
// Endpoints:
// - GET    /backend/v1/fac/admin/users          (Listar todas as contas com busca e paginação)
// - POST   /backend/v1/fac/admin/users          (Criar conta com email, nome, role, senha e verified)
// - PATCH  /backend/v1/fac/admin/users/{id}     (Editar dados da conta: email, nome, role, is_active, verified)
// - POST   /backend/v1/fac/admin/users/{id}/reset-password (Redefinir senha da conta sem senha antiga)
// - DELETE /backend/v1/fac/admin/users/{id}     (Excluir conta definitivamente, impedindo autoexclusão)

// 1. LISTAR CONTAS
routerAdd(
  'GET',
  '/backend/v1/fac/admin/users',
  (e) => {
    const authUser = e.auth
    if (!authUser || authUser.get('role') !== 'admin') {
      return e.json(403, {
        success: false,
        message: 'Apenas administradoras podem gerenciar contas.',
      })
    }

    const query = e.requestInfo().query || {}
    const page = parseInt(query.page, 10) || 1
    const perPage = parseInt(query.perPage, 10) || 50
    const search = (query.search || '').toString().trim().toLowerCase()
    const offset = Math.max(0, (page - 1) * perPage)

    try {
      // Buscar todos os registros ordenados por data de criação decrescente
      let filter = ''
      if (search) {
        // Escapar aspas simples para segurança básica do filtro PB
        const sanitized = search.replace(/'/g, "\\'")
        filter = `email ~ '${sanitized}' || name ~ '${sanitized}'`
      }

      // Contagem total
      const allRecords = $app.findRecordsByFilter('users', filter, '-created', 1000, 0)
      const totalItems = allRecords.length
      const totalPages = Math.ceil(totalItems / perPage) || 1

      // Paginação na memória
      const paginatedRecords = allRecords.slice(offset, offset + perPage)

      const items = paginatedRecords.map((u) => {
        return {
          id: u.id,
          email: u.email(),
          name: u.getString('name') || '',
          role: u.getString('role') || 'user',
          verified: u.getBool('verified'),
          is_active: u.get('is_active') !== false,
          created: u.getString('created'),
          updated: u.getString('updated'),
        }
      })

      return e.json(200, {
        success: true,
        page: page,
        perPage: perPage,
        totalItems: totalItems,
        totalPages: totalPages,
        items: items,
      })
    } catch (err) {
      return e.json(500, {
        success: false,
        message: 'Erro ao listar contas de usuárias: ' + err,
      })
    }
  },
  $apis.requireAuth(),
)

// 2. CRIAR CONTA
routerAdd(
  'POST',
  '/backend/v1/fac/admin/users',
  (e) => {
    const authUser = e.auth
    if (!authUser || authUser.get('role') !== 'admin') {
      return e.json(403, {
        success: false,
        message: 'Apenas administradoras podem criar contas.',
      })
    }

    const body = e.requestInfo().body || {}
    const email = (body.email || '').toString().trim().toLowerCase()
    const password = (body.password || '').toString()
    const name = (body.name || '').toString().trim()
    const role = body.role === 'admin' ? 'admin' : 'user'
    const verified = body.verified === true || body.verified === 'true'
    const isActive = body.is_active !== false && body.is_active !== 'false'

    if (!email || !email.includes('@')) {
      return e.json(400, { success: false, message: 'Informe um e-mail válido.' })
    }

    if (!password || password.length < 8) {
      return e.json(400, {
        success: false,
        message: 'A senha deve conter no mínimo 8 caracteres.',
      })
    }

    try {
      // Verificar se já existe conta com este e-mail
      try {
        const existing = $app.findAuthRecordByEmail('_pb_users_auth_', email)
        if (existing) {
          return e.json(400, {
            success: false,
            message: 'Já existe uma conta cadastrada com este e-mail.',
          })
        }
      } catch (_) {
        // Não existe, prosseguir
      }

      const usersCol = $app.findCollectionByNameOrId('_pb_users_auth_')
      const newRec = new Record(usersCol)
      newRec.setEmail(email)
      newRec.setPassword(password)
      newRec.setVerified(verified)
      newRec.set('name', name)
      newRec.set('role', role)
      newRec.set('is_active', isActive)

      $app.save(newRec)

      // Registrar auditoria
      try {
        const auditCol = $app.findCollectionByNameOrId('fac_auditoria')
        const auditRec = new Record(auditCol)
        auditRec.set('operador', authUser.email())
        auditRec.set('acao', 'criar_conta_usuario')
        auditRec.set('alvo', email)
        auditRec.set('motivo', 'Criação manual de conta pelo painel administrativo')
        auditRec.set('detalhes', {
          user_id: newRec.id,
          email: email,
          name: name,
          role: role,
          verified: verified,
          is_active: isActive,
        })
        $app.save(auditRec)
      } catch (_) {}

      return e.json(201, {
        success: true,
        message: `Conta de ${email} criada com sucesso.`,
        user: {
          id: newRec.id,
          email: newRec.email(),
          name: newRec.getString('name'),
          role: newRec.getString('role'),
          verified: newRec.getBool('verified'),
          is_active: newRec.get('is_active') !== false,
          created: newRec.getString('created'),
          updated: newRec.getString('updated'),
        },
      })
    } catch (err) {
      return e.json(500, {
        success: false,
        message: 'Erro ao criar conta: ' + err,
      })
    }
  },
  $apis.requireAuth(),
)

// 3. EDITAR CONTA (E-mail, Nome, Papel, Status ativo, Verificado)
routerAdd(
  'PATCH',
  '/backend/v1/fac/admin/users/{id}',
  (e) => {
    const authUser = e.auth
    if (!authUser || authUser.get('role') !== 'admin') {
      return e.json(403, {
        success: false,
        message: 'Apenas administradoras podem editar contas.',
      })
    }

    const targetId = (
      e.request.pathValue('id') ||
      (e.requestInfo().params && e.requestInfo().params.id) ||
      ''
    )
      .toString()
      .trim()
    if (!targetId) {
      return e.json(400, { success: false, message: 'ID da conta não informado.' })
    }

    const body = e.requestInfo().body || {}

    try {
      const targetUser = $app.findFirstRecordByData('users', 'id', targetId)
      const oldEmail = targetUser.email()
      const oldName = targetUser.getString('name')
      const oldRole = targetUser.getString('role')
      const oldVerified = targetUser.getBool('verified')
      const oldIsActive = targetUser.get('is_active') !== false

      // Alteração de email
      if (body.email !== undefined) {
        const cleanEmail = String(body.email).trim().toLowerCase()
        if (!cleanEmail || !cleanEmail.includes('@')) {
          return e.json(400, { success: false, message: 'E-mail informado é inválido.' })
        }
        if (cleanEmail !== oldEmail) {
          try {
            const dup = $app.findAuthRecordByEmail('_pb_users_auth_', cleanEmail)
            if (dup && dup.id !== targetId) {
              return e.json(400, {
                success: false,
                message: 'Já existe outra conta com este e-mail.',
              })
            }
          } catch (_) {}
          targetUser.setEmail(cleanEmail)
        }
      }

      if (body.name !== undefined) {
        targetUser.set('name', String(body.name).trim())
      }

      if (body.role !== undefined) {
        const newRole = body.role === 'admin' ? 'admin' : 'user'
        // Se a admin estiver editando o próprio papel para user, impedir caso seja o único admin
        if (targetId === authUser.id && newRole !== 'admin') {
          return e.json(400, {
            success: false,
            message: 'Você não pode remover seu próprio papel de administradora.',
          })
        }
        targetUser.set('role', newRole)
      }

      if (body.verified !== undefined) {
        targetUser.setVerified(body.verified === true || body.verified === 'true')
      }

      if (body.is_active !== undefined) {
        const newActive = body.is_active === true || body.is_active === 'true'
        // Impedir desativar a própria conta com que está logada
        if (targetId === authUser.id && !newActive) {
          return e.json(400, {
            success: false,
            message: 'Você não pode desativar a sua própria conta de login.',
          })
        }
        targetUser.set('is_active', newActive)
      }

      $app.save(targetUser)

      // Trilha de auditoria
      try {
        const auditCol = $app.findCollectionByNameOrId('fac_auditoria')
        const auditRec = new Record(auditCol)
        auditRec.set('operador', authUser.email())
        auditRec.set('acao', 'editar_conta_usuario')
        auditRec.set('alvo', targetUser.email())
        auditRec.set('motivo', 'Atualização cadastral de conta pelo painel administrativo')
        auditRec.set('detalhes', {
          user_id: targetId,
          alteracoes: {
            email: { de: oldEmail, para: targetUser.email() },
            name: { de: oldName, para: targetUser.getString('name') },
            role: { de: oldRole, para: targetUser.getString('role') },
            verified: { de: oldVerified, para: targetUser.getBool('verified') },
            is_active: { de: oldIsActive, para: targetUser.get('is_active') !== false },
          },
        })
        $app.save(auditRec)
      } catch (_) {}

      return e.json(200, {
        success: true,
        message: `Conta de ${targetUser.email()} atualizada com sucesso.`,
        user: {
          id: targetUser.id,
          email: targetUser.email(),
          name: targetUser.getString('name'),
          role: targetUser.getString('role'),
          verified: targetUser.getBool('verified'),
          is_active: targetUser.get('is_active') !== false,
          created: targetUser.getString('created'),
          updated: targetUser.getString('updated'),
        },
      })
    } catch (err) {
      return e.json(500, {
        success: false,
        message: 'Erro ao editar conta: ' + err,
      })
    }
  },
  $apis.requireAuth(),
)

// 4. REDEFINIR SENHA DA CONTA
routerAdd(
  'POST',
  '/backend/v1/fac/admin/users/{id}/reset-password',
  (e) => {
    const authUser = e.auth
    if (!authUser || authUser.get('role') !== 'admin') {
      return e.json(403, {
        success: false,
        message: 'Apenas administradoras podem redefinir senhas.',
      })
    }

    const targetId = (
      e.request.pathValue('id') ||
      (e.requestInfo().params && e.requestInfo().params.id) ||
      ''
    )
      .toString()
      .trim()
    if (!targetId) {
      return e.json(400, { success: false, message: 'ID da conta não informado.' })
    }

    const body = e.requestInfo().body || {}
    const newPassword = (body.password || '').toString()

    if (!newPassword || newPassword.length < 8) {
      return e.json(400, {
        success: false,
        message: 'A nova senha deve ter no mínimo 8 caracteres.',
      })
    }

    try {
      const targetUser = $app.findFirstRecordByData('users', 'id', targetId)
      targetUser.setPassword(newPassword)
      $app.save(targetUser)

      // Registrar auditoria (SEM expor a senha no log)
      try {
        const auditCol = $app.findCollectionByNameOrId('fac_auditoria')
        const auditRec = new Record(auditCol)
        auditRec.set('operador', authUser.email())
        auditRec.set('acao', 'redefinir_senha_usuario')
        auditRec.set('alvo', targetUser.email())
        auditRec.set(
          'motivo',
          'Redefinição direta de senha realizada pela administradora sem necessidade da senha antiga',
        )
        auditRec.set('detalhes', {
          user_id: targetId,
          target_email: targetUser.email(),
        })
        $app.save(auditRec)
      } catch (_) {}

      return e.json(200, {
        success: true,
        message: `Senha da conta ${targetUser.email()} redefinida com sucesso.`,
      })
    } catch (err) {
      return e.json(500, {
        success: false,
        message: 'Erro ao redefinir senha: ' + err,
      })
    }
  },
  $apis.requireAuth(),
)

// 5. EXCLUIR CONTA
routerAdd(
  'DELETE',
  '/backend/v1/fac/admin/users/{id}',
  (e) => {
    const authUser = e.auth
    if (!authUser || authUser.get('role') !== 'admin') {
      return e.json(403, {
        success: false,
        message: 'Apenas administradoras podem excluir contas.',
      })
    }

    const targetId = (
      e.request.pathValue('id') ||
      (e.requestInfo().params && e.requestInfo().params.id) ||
      ''
    )
      .toString()
      .trim()
    if (!targetId) {
      return e.json(400, { success: false, message: 'ID da conta não informado.' })
    }

    // Regra crítica: impedir que a administradora exclua a si mesma
    if (targetId === authUser.id) {
      return e.json(400, {
        success: false,
        message: 'Você não pode excluir a sua própria conta com a qual está conectada.',
      })
    }

    try {
      let targetUser
      try {
        targetUser = $app.findRecordById('users', targetId)
      } catch (_) {
        try {
          targetUser = $app.findFirstRecordByData('users', 'id', targetId)
        } catch (findErr) {
          return e.json(404, {
            success: false,
            message: 'Conta não encontrada no sistema para o ID informado.',
          })
        }
      }

      const targetEmail = targetUser.email()
      const targetName = targetUser.getString('name') || ''
      const targetRole = targetUser.getString('role') || 'user'

      // Não permitir exclusão se a conta alvo for a própria usuária logada
      if (targetEmail.toLowerCase() === authUser.email().toLowerCase()) {
        return e.json(400, {
          success: false,
          message: 'Você não pode excluir a sua própria conta de administradora.',
        })
      }

      // Conforme o briefing: as matrículas permanecem intactas (fac_matriculas vincula por e-mail e não é tocada).
      // Limpeza de dependências vinculadas por chave estrangeira ou por ID:
      // 1. fac_backups vincula user_id -> users com cascade ou FK. Removemos todos os backups associados.
      try {
        const backups = $app.findRecordsByFilter(
          'fac_backups',
          `user_id = '${targetId}'`,
          '',
          500,
          0,
        )
        for (const b of backups) {
          try {
            $app.delete(b)
          } catch (_) {}
        }
      } catch (_) {}

      // 2. Excluir o registro de autenticação da usuária
      $app.delete(targetUser)

      // 3. Trilha de auditoria persistente
      try {
        const auditCol = $app.findCollectionByNameOrId('fac_auditoria')
        const auditRec = new Record(auditCol)
        auditRec.set('operador', authUser.email())
        auditRec.set('acao', 'excluir_conta_usuario_permanente')
        auditRec.set('alvo', targetEmail)
        auditRec.set(
          'motivo',
          'Exclusão definitiva de conta de usuária solicitada pela administradora com confirmação EXCLUIR',
        )
        auditRec.set('detalhes', {
          user_id: targetId,
          email: targetEmail,
          name: targetName,
          role: targetRole,
        })
        $app.save(auditRec)
      } catch (_) {}

      return e.json(200, {
        success: true,
        message: `Conta de ${targetEmail} foi excluída permanentemente.`,
      })
    } catch (err) {
      const errMsg = err && err.message ? String(err.message) : String(err)
      return e.json(500, {
        success: false,
        message: 'Erro ao excluir conta de usuária: ' + errMsg,
      })
    }
  },
  $apis.requireAuth(),
)
