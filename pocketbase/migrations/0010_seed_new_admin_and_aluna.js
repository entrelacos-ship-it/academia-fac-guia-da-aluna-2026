migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const matriculasCol = app.findCollectionByNameOrId('fac_matriculas')
    const auditCol = app.findCollectionByNameOrId('fac_auditoria')

    // 1. Conta Administradora
    // Email: entrelacos@entrelacospsicologia.com.br
    // Senha: Entrelacos2025@
    // Role: admin
    const adminEmail = 'entrelacos@entrelacospsicologia.com.br'
    const adminPass = 'Entrelacos2025@'
    const adminName = 'Administração Entrelaços'

    let adminRecord
    let adminAcao = 'seed_admin_user'
    try {
      adminRecord = app.findAuthRecordByEmail('_pb_users_auth_', adminEmail)
      adminRecord.setPassword(adminPass)
      adminRecord.setVerified(true)
      adminRecord.set('role', 'admin')
      adminRecord.set('is_active', true)
      if (!adminRecord.get('name')) {
        adminRecord.set('name', adminName)
      }
      app.save(adminRecord)
      adminAcao = 'update_admin_user'
    } catch (_) {
      adminRecord = new Record(users)
      adminRecord.setEmail(adminEmail)
      adminRecord.setPassword(adminPass)
      adminRecord.setVerified(true)
      adminRecord.set('name', adminName)
      adminRecord.set('role', 'admin')
      adminRecord.set('is_active', true)
      app.save(adminRecord)
    }

    // Auditoria para a conta admin
    try {
      const auditAdmin = new Record(auditCol)
      auditAdmin.set('operador', 'sistema')
      auditAdmin.set('acao', adminAcao)
      auditAdmin.set('alvo', adminEmail)
      auditAdmin.set(
        'motivo',
        'Criação/atualização de conta institucional com role admin solicitada pela coordenação',
      )
      auditAdmin.set('detalhes', {
        role: 'admin',
        is_active: true,
        verified: true,
      })
      app.save(auditAdmin)
    } catch (_) {}

    // 2. Conta Aluna
    // Email: tatianaribeiropsi@gmail.com
    // Senha: Tke300311@
    // Role: user (sem role admin)
    const alunaEmail = 'tatianaribeiropsi@gmail.com'
    const alunaPass = 'Tke300311@'
    const alunaName = 'Tatiana Ribeiro'

    let alunaRecord
    let alunaAcao = 'seed_aluna_user'
    try {
      alunaRecord = app.findAuthRecordByEmail('_pb_users_auth_', alunaEmail)
      alunaRecord.setPassword(alunaPass)
      alunaRecord.setVerified(true)
      alunaRecord.set('role', 'user')
      alunaRecord.set('is_active', true)
      if (!alunaRecord.get('name')) {
        alunaRecord.set('name', alunaName)
      }
      app.save(alunaRecord)
      alunaAcao = 'update_aluna_user'
    } catch (_) {
      alunaRecord = new Record(users)
      alunaRecord.setEmail(alunaEmail)
      alunaRecord.setPassword(alunaPass)
      alunaRecord.setVerified(true)
      alunaRecord.set('name', alunaName)
      alunaRecord.set('role', 'user')
      alunaRecord.set('is_active', true)
      app.save(alunaRecord)
    }

    // Auditoria para a conta da aluna
    try {
      const auditAluna = new Record(auditCol)
      auditAluna.set('operador', 'sistema')
      auditAluna.set('acao', alunaAcao)
      auditAluna.set('alvo', alunaEmail)
      auditAluna.set('motivo', 'Criação/atualização de conta de aluna solicitada pela coordenação')
      auditAluna.set('detalhes', {
        role: 'user',
        is_active: true,
        verified: true,
      })
      app.save(auditAluna)
    } catch (_) {}

    // 3. Matrícula ativa na coleção fac_matriculas para tatianaribeiropsi@gmail.com
    let matRecord
    let matAcao = 'seed_aluna_matricula'
    try {
      matRecord = app.findFirstRecordByData('fac_matriculas', 'email', alunaEmail)
      matRecord.set('status', 'ativa')
      matRecord.set('nome', alunaName)
      if (!matRecord.get('ciclo')) {
        matRecord.set('ciclo', 'Ciclo FAC 2026')
      }
      app.save(matRecord)
      matAcao = 'update_aluna_matricula'
    } catch (_) {
      matRecord = new Record(matriculasCol)
      matRecord.set('email', alunaEmail)
      matRecord.set('nome', alunaName)
      matRecord.set('status', 'ativa')
      matRecord.set('ciclo', 'Ciclo FAC 2026')
      matRecord.set('origem', 'Coordenação FAC')
      matRecord.set('anotacao', 'Matrícula de aluna confirmada')
      app.save(matRecord)
    }

    // Auditoria da matrícula ativa
    try {
      const auditMat = new Record(auditCol)
      auditMat.set('operador', 'sistema')
      auditMat.set('acao', matAcao)
      auditMat.set('alvo', alunaEmail)
      auditMat.set('motivo', 'Ativação de matrícula no Guia da Aluna (Ciclo FAC 2026)')
      auditMat.set('detalhes', {
        status: 'ativa',
        ciclo: 'Ciclo FAC 2026',
      })
      app.save(auditMat)
    } catch (_) {}
  },
  (app) => {
    // Reversão segura se necessário
    try {
      const admin = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'entrelacos@entrelacospsicologia.com.br',
      )
      app.delete(admin)
    } catch (_) {}

    try {
      const aluna = app.findAuthRecordByEmail('_pb_users_auth_', 'tatianaribeiropsi@gmail.com')
      app.delete(aluna)
    } catch (_) {}

    try {
      const mat = app.findFirstRecordByData(
        'fac_matriculas',
        'email',
        'tatianaribeiropsi@gmail.com',
      )
      app.delete(mat)
    } catch (_) {}
  },
)
