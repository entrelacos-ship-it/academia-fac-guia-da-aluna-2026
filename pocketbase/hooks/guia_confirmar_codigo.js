// Rota para confirmação de código e validação de matrícula
// Aluna autenticada ou enviando e-mail da compra + código de 6 dígitos

routerAdd('POST', '/backend/v1/fac/guia/confirmar-codigo', (e) => {
  const body = e.requestInfo().body || {}
  const rawEmail = (body.email || '').toString().trim().toLowerCase()
  const rawCode = (body.codigo || '').toString().trim()

  if (!rawEmail || !rawCode) {
    return e.json(400, {
      success: false,
      message: 'E-mail e código são obrigatórios.',
    })
  }

  // 1. Localizar código válido para este e-mail
  let codeRecord = null
  try {
    const list = $app.findRecordsByFilter(
      'fac_acesso_codigos',
      'email = {:email} && usado = false',
      '-created',
      1,
      0,
      { email: rawEmail },
    )
    if (list && list.length > 0) {
      codeRecord = list[0]
    }
  } catch (err) {
    console.warn('[FAC Guia] Erro ao buscar código:', err)
  }

  if (!codeRecord) {
    return e.json(400, {
      success: false,
      message: 'Código não encontrado ou já utilizado. Por favor, solicite um novo código.',
    })
  }

  // Verificar tentativas (máximo 5)
  const tentativas = codeRecord.getInt('tentativas') || 0
  if (tentativas >= 5) {
    return e.json(429, {
      success: false,
      message:
        'Número excessivo de tentativas para este código. Por favor, solicite um novo código e aguarde alguns minutos.',
    })
  }

  // Verificar expiração
  const expiraStr = codeRecord.getString('expira_em')
  const expiraTime = new Date(expiraStr).getTime()
  if (Date.now() > expiraTime) {
    return e.json(400, {
      success: false,
      message: 'Este código expirou. Por favor, solicite um novo código no formulário.',
    })
  }

  // Conferir código
  const expectedCode = codeRecord.getString('codigo')
  if (expectedCode !== rawCode) {
    codeRecord.set('tentativas', tentativas + 1)
    $app.save(codeRecord)
    return e.json(400, {
      success: false,
      message: 'Código incorreto. Verifique os dígitos informados ou solicite um novo código.',
    })
  }

  // Código correto! Marca como usado
  codeRecord.set('usado', true)
  $app.save(codeRecord)

  // 2. Verificar o status atual da matrícula
  let matricula = null
  try {
    matricula = $app.findFirstRecordByData('fac_matriculas', 'email', rawEmail)
  } catch (_) {}

  if (!matricula) {
    return e.json(403, {
      success: false,
      status: 'nao_encontrada',
      message:
        'Não encontramos uma matrícula vinculada a este endereço de e-mail. Se você efetuou a compra por outro endereço, entre em contato com nosso suporte pedagógico.',
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
      message:
        'Sua matrícula encontra-se temporariamente suspensa. Para mais detalhes sobre seu ciclo de estudos, entre em contato com a equipe de atendimento da Academia.',
    })
  }

  if (matStatus === 'expirada' || isExpiredByDate) {
    return e.json(403, {
      success: false,
      status: 'expirada',
      message:
        'O período de acesso da sua turma foi concluído. Entre em contato com a Entrelaços para renovação ou acesso a turmas de continuidade.',
    })
  }

  if (matStatus !== 'ativa') {
    return e.json(403, {
      success: false,
      status: matStatus,
      message: 'Acesso indisponível no momento. Por favor, contate o suporte da Academia.',
    })
  }

  // 3. Atualizar a conta users correspondente (se existir) com verified = true
  let userAccountUpdated = false
  try {
    const userRec = $app.findAuthRecordByEmail('_pb_users_auth_', rawEmail)
    if (userRec) {
      userRec.setVerified(true)
      userRec.set('is_active', true)
      $app.save(userRec)
      userAccountUpdated = true
    }
  } catch (_) {
    // Se a usuária ainda não criou conta no app de precificação, a matrícula segue validada
  }

  // 4. Gerar token assinado de sessão de aluna (JWT com 7 dias de validade)
  const jwtSecret =
    $secrets.get('PB_SUPERUSER_TOKEN') || 'entrelacos-fac-aluna-session-token-secret-key-2026'
  const payload = {
    email: rawEmail,
    nome: matricula.getString('nome') || '',
    status: 'ativa',
    ciclo: matricula.getString('ciclo') || '',
    valido_ate: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
  }
  const token = $security.createJWT(payload, jwtSecret, 7 * 24 * 3600)

  // 5. Auditoria de confirmação de código e de verificação de e-mail da aluna
  try {
    const auditCol = $app.findCollectionByNameOrId('fac_auditoria')

    // Evento de confirmação de código com sucesso
    const auditRec = new Record(auditCol)
    auditRec.set('operador', rawEmail)
    auditRec.set('acao', 'confirmar_codigo_sucesso')
    auditRec.set('alvo', rawEmail)
    auditRec.set('motivo', 'Validação com sucesso de matrícula da aluna')
    auditRec.set('detalhes', { ciclo: matricula.getString('ciclo') })
    $app.save(auditRec)

    // Evento específico exigido: email_aluna_verificado com operador sistema_guia
    const auditVerif = new Record(auditCol)
    auditVerif.set('operador', 'sistema_guia')
    auditVerif.set('acao', 'email_aluna_verificado')
    auditVerif.set('alvo', rawEmail)
    auditVerif.set('motivo', 'E-mail de aluna verificado via fluxo Já sou aluna')
    auditVerif.set('detalhes', {
      ciclo: matricula.getString('ciclo'),
      conta_usuario_atualizada: userAccountUpdated,
    })
    $app.save(auditVerif)
  } catch (_) {}

  return e.json(200, {
    success: true,
    message:
      'Validação concluída com sucesso! Bem-vinda à sua área da aluna no Guia da Academia Método FAC.',
    aluna: {
      email: rawEmail,
      nome: matricula.getString('nome') || '',
      status: 'ativa',
      ciclo: matricula.getString('ciclo') || 'Ciclo FAC 2026',
      token: token,
      verified: true,
    },
  })
})
