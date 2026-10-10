// Hook para servir downloads de skills exclusivamente para alunas autenticadas
// Endpoint: POST /backend/v1/fac/skills/download
// Garante validação estrita no servidor:
// - Exige token de aluna válido ou autenticação admin ou conta verified
// - Confere se a aluna possui matrícula ativa em fac_matriculas
// - Devolve os dados da skill, URL do arquivo e/ou dispara o download

routerAdd('POST', '/backend/v1/fac/skills/download', (e) => {
  const body = e.requestInfo().body || {}
  const skillId = (body.id || body.skill_id || '').toString().trim()
  const token = (body.token || '').toString().trim()

  if (!skillId) {
    return e.json(400, { success: false, message: 'ID da skill é obrigatório.' })
  }

  // 1. Buscar a skill
  let skill = null
  try {
    skill = $app.findRecordById('fac_skills', skillId)
  } catch (_) {
    return e.json(404, { success: false, message: 'Skill não encontrada.' })
  }

  // 2. Verificar autenticação da aluna ou admin
  let emailAluna = ''
  const authUser = e.auth
  const isAdmin = authUser && authUser.get('role') === 'admin'

  if (isAdmin) {
    emailAluna = authUser.email()
  } else if (authUser && authUser.getBool('verified')) {
    emailAluna = authUser.email()
  } else if (token) {
    const jwtSecret =
      $secrets.get('PB_SUPERUSER_TOKEN') || 'entrelacos-fac-aluna-session-token-secret-key-2026'
    try {
      const parsed = $security.parseJWT(token, jwtSecret)
      if (parsed && parsed.email) {
        emailAluna = parsed.email
      }
    } catch (_) {
      return e.json(401, {
        success: false,
        requires_login: true,
        message: 'Sessão inválida ou expirada. Valide seu e-mail de aluna novamente.',
      })
    }
  }

  if (!emailAluna && !isAdmin) {
    return e.json(401, {
      success: false,
      requires_login: true,
      message:
        'Acesso exclusivo para alunas da Academia Método FAC. Valide seu e-mail de matrícula.',
    })
  }

  // 3. Checagem em cada download: matrícula ativa em fac_matriculas
  if (!isAdmin) {
    let matricula = null
    try {
      matricula = $app.findFirstRecordByData('fac_matriculas', 'email', emailAluna)
    } catch (_) {}

    if (!matricula) {
      return e.json(403, {
        success: false,
        status: 'nao_encontrada',
        message: 'Matrícula de aluna não localizada para este e-mail.',
      })
    }

    const matStatus = matricula.getString('status')
    const fimStr = matricula.getString('fim')
    let isExpiredByDate = false
    if (fimStr) {
      try {
        const fimDate = new Date(fimStr)
        if (fimDate.getTime() < Date.now()) {
          isExpiredByDate = true
        }
      } catch (_) {}
    }

    if (matStatus === 'suspensa') {
      return e.json(403, {
        success: false,
        status: 'suspensa',
        message: 'Sua matrícula está temporariamente suspensa. Fale com a coordenação.',
      })
    }

    if (matStatus === 'expirada' || isExpiredByDate) {
      return e.json(403, {
        success: false,
        status: 'expirada',
        message: 'O período de acesso da sua matrícula expirou. Fale com o suporte para renovar.',
      })
    }

    if (matStatus !== 'ativa') {
      return e.json(403, {
        success: false,
        status: matStatus,
        message: 'Acesso indisponível no momento.',
      })
    }
  }

  // 4. Registrar auditoria do download
  try {
    const auditCol = $app.findCollectionByNameOrId('fac_auditoria')
    const auditRec = new Record(auditCol)
    auditRec.set('operador', emailAluna || 'aluna')
    auditRec.set('acao', 'skill_download')
    auditRec.set('alvo', skill.getString('titulo'))
    auditRec.set(
      'motivo',
      `Download da skill ${skill.getString('titulo')} (${skill.getString('arquivo')})`,
    )
    auditRec.set('detalhes', {
      skill_id: skill.id,
      titulo: skill.getString('titulo'),
      arquivo: skill.getString('arquivo'),
      email: emailAluna,
    })
    $app.save(auditRec)
  } catch (_) {}

  const fileName = skill.getString('arquivo')
  const fileUrl = `/api/files/fac_skills/${skill.id}/${fileName}`

  return e.json(200, {
    success: true,
    file_url: fileUrl,
    filename: fileName,
    titulo: skill.getString('titulo'),
  })
})
