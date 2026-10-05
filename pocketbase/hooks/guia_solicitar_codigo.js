// Rota pública para solicitação de código de validação de e-mail de aluna
// Responde sempre de forma neutra (evitando enumeração de e-mails de compra)

routerAdd('POST', '/backend/v1/fac/guia/solicitar-codigo', (e) => {
  const body = e.requestInfo().body || {}
  const rawEmail = (body.email || '').toString().trim().toLowerCase()

  if (!rawEmail || !rawEmail.includes('@')) {
    return e.json(400, {
      success: false,
      message: 'Por favor, informe um endereço de e-mail válido.',
    })
  }

  // Verificar se há matrícula ativa para este e-mail
  let hasActiveMatricula = false
  let matriculaNome = ''
  try {
    const matRecord = $app.findFirstRecordByData('fac_matriculas', 'email', rawEmail)
    const status = matRecord.getString('status')
    const fimStr = matRecord.getString('fim')
    let isExpiredByDate = false
    if (fimStr) {
      try {
        const fimDate = new Date(fimStr)
        if (fimDate.getTime() < Date.now()) {
          isExpiredByDate = true
        }
      } catch (_) {}
    }

    if (status === 'ativa' && !isExpiredByDate) {
      hasActiveMatricula = true
      matriculaNome = matRecord.getString('nome') || ''
    }
  } catch (_) {
    // Matrícula não encontrada: não revelamos à usuária (proteção contra enumeração)
  }

  // Gera código numérico de 6 dígitos
  const code = '' + Math.floor(100000 + Math.random() * 900000)
  // Expira em 30 minutos
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString()

  // Salvar registro de código temporário se houver matrícula ativa
  // Se não houver matrícula ativa, não gravamos código nem enviamos, mas retornamos sucesso com mensagem neutra
  if (hasActiveMatricula) {
    try {
      const codigosCol = $app.findCollectionByNameOrId('fac_acesso_codigos')
      const codRecord = new Record(codigosCol)
      codRecord.set('email', rawEmail)
      codRecord.set('codigo', code)
      codRecord.set('expira_em', expiresAt)
      codRecord.set('tentativas', 0)
      codRecord.set('usado', false)
      $app.save(codRecord)

      // Registrar auditoria
      try {
        const auditCol = $app.findCollectionByNameOrId('fac_auditoria')
        const auditRec = new Record(auditCol)
        auditRec.set('operador', rawEmail)
        auditRec.set('acao', 'solicitar_codigo')
        auditRec.set('alvo', rawEmail)
        auditRec.set('motivo', 'Solicitação de código de acesso ao Guia da Aluna')
        auditRec.set('detalhes', { expira_em: expiresAt })
        $app.save(auditRec)
      } catch (_) {}

      // Enviar e-mail transacional se houver Resend ou MailClient
      const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Código de Acesso: Guia da Aluna FAC</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 32px 16px;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #ea580c 100%); padding: 28px 24px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">
        Academia Método FAC
      </h1>
      <p style="color: rgba(255,255,255,0.9); font-size: 13px; margin: 6px 0 0; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">
        Guia da Aluna · Código de Confirmação
      </p>
    </div>
    <div style="padding: 32px 28px;">
      <p style="font-size: 16px; margin: 0 0 16px; color: #0f172a;">
        Olá${matriculaNome ? ', <strong>' + matriculaNome + '</strong>' : ''}!
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px;">
        Recebemos seu pedido de validação de e-mail para liberação dos encontros pagos do <strong>Guia da Aluna da Academia Método FAC</strong>.
      </p>
      <div style="text-align: center; margin: 28px 0; background-color: #f5f3ff; border: 1px dashed #7c3aed; border-radius: 12px; padding: 20px;">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #6d28d9; font-weight: 600; display: block; margin-bottom: 6px;">Seu código de acesso:</span>
        <span style="font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #7c3aed;">${code}</span>
      </div>
      <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0 0 16px;">
        Este código é válido por <strong>30 minutos</strong> e pode ser usado uma única vez no formulário do Guia.
      </p>
      <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0 0 16px;">
        Se você não solicitou este código, ignore esta mensagem com segurança.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0 20px;">
      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
        Entrelaços Psicologia: Academia Método FAC<br>
        Mensagem transacional automática.
      </p>
    </div>
  </div>
</body>
</html>
      `

      const resendApiKey = $os.getenv('RESEND_API_KEY')
      if (resendApiKey) {
        try {
          const resendSender =
            $os.getenv('EMAIL_FROM') ||
            'Entrelaços Psicologia <noreply@entrelacos.entrelacospsicologia.com.br>'
          $http.send({
            url: 'https://api.resend.com/emails',
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + resendApiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: resendSender,
              to: [rawEmail],
              subject: 'Código de Validação: Guia da Aluna Academia FAC',
              html: emailHtml,
            }),
            timeout: 10,
          })
          console.log('[FAC Guia] Código enviado com sucesso via Resend para:', rawEmail)
        } catch (resendErr) {
          console.warn('[FAC Guia] Falha ao enviar via Resend:', resendErr)
        }
      } else {
        // Tentar mailer nativo do PocketBase
        try {
          const mailer = $app.newMailClient()
          const senderAddress =
            $app.settings().meta.senderAddress || 'noreply@entrelacos.entrelacospsicologia.com.br'
          const senderName = $app.settings().meta.senderName || 'Entrelaços Psicologia'
          const msg = new MailerMessage({
            from: { address: senderAddress, name: senderName },
            to: [{ address: rawEmail }],
            subject: 'Código de Validação: Guia da Aluna Academia FAC',
            html: emailHtml,
          })
          mailer.send(msg)
        } catch (mErr) {
          console.log('[FAC Guia] Mailer nativo não disponível ou não configurado:', mErr)
        }
      }
    } catch (saveErr) {
      console.warn('[FAC Guia] Erro ao gravar código temporário:', saveErr)
    }
  }

  // Resposta sempre neutra para proteger privacidade e não enumerar quem comprou
  return e.json(200, {
    success: true,
    message:
      'Se o e-mail informado corresponder a uma matrícula ativa na Academia Método FAC, você receberá um código de confirmação em instantes. Verifique também sua caixa de spam.',
  })
})
