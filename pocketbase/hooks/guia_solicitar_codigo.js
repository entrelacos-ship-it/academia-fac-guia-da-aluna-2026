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
    } else if (status === 'ativa' && isExpiredByDate) {
      // Data de vigência vencida: atualizar status no banco para refletir a expiração
      try {
        matRecord.set('status', 'expirada')
        $app.save(matRecord)
        const auditCol = $app.findCollectionByNameOrId('fac_auditoria')
        const auditRec = new Record(auditCol)
        auditRec.set('operador', 'sistema')
        auditRec.set('acao', 'expiracao_automatica_por_data')
        auditRec.set('alvo', rawEmail)
        auditRec.set('motivo', `Matrícula expirou automaticamente em ${fimStr}`)
        $app.save(auditRec)
      } catch (_) {}
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
  <title>Seu código de acesso ao Guia da Aluna — Academia Método FAC</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 32px 16px;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.06);">
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #ea580c 100%); padding: 30px 24px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700; letter-spacing: -0.02em;">
        Academia Método FAC
      </h1>
      <p style="color: rgba(255,255,255,0.92); font-size: 13px; margin: 6px 0 0; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">
        Guia da Aluna · Ciclo de Estudos FAC
      </p>
    </div>
    <div style="padding: 32px 28px;">
      <p style="font-size: 16px; margin: 0 0 16px; color: #0f172a;">
        Olá${matriculaNome ? ', <strong>' + matriculaNome + '</strong>' : ''}! Que bom ter você aqui.
      </p>
      <p style="font-size: 14px; line-height: 1.65; color: #334155; margin: 0 0 16px;">
        Recebemos sua solicitação de validação para liberar o seu acesso completo ao <strong>Guia da Aluna da Academia Método FAC</strong>.
      </p>
      <p style="font-size: 14px; line-height: 1.65; color: #334155; margin: 0 0 20px;">
        Com este acesso você acompanha a <strong>trilha completa de encontros do Ciclo FAC</strong>, seus cadernos didáticos, gravações de aula e todas as ferramentas integradas da Academia (como a Calculadora de Precificação, o Meu IKIGAI e os materiais complementares).
      </p>

      <div style="text-align: center; margin: 26px 0; background: linear-gradient(180deg, #faf5ff 0%, #f5f3ff 100%); border: 2px dashed #7c3aed; border-radius: 14px; padding: 22px;">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #6d28d9; font-weight: 700; display: block; margin-bottom: 8px;">
          Seu código temporário de acesso
        </span>
        <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #7c3aed; display: inline-block; padding: 4px 12px;">
          ${code}
        </span>
        <p style="font-size: 12px; color: #64748b; margin: 8px 0 0;">
          Válido por <strong>30 minutos</strong> · até 5 tentativas
        </p>
      </div>

      <div style="background-color: #f8fafc; border-left: 4px solid #7c3aed; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 0 0 20px;">
        <p style="font-size: 13px; color: #334155; line-height: 1.5; margin: 0;">
          <strong>Como usar:</strong> Retorne à tela do Guia da Aluna na Academia, digite ou cole este código de 6 dígitos no campo de validação e clique em <em>Confirmar Código</em> para ativar sua sessão.
        </p>
      </div>

      <p style="font-size: 12px; color: #64748b; line-height: 1.55; margin: 0 0 12px;">
        🔒 <strong>Aviso de segurança:</strong> Este código é pessoal e intransferível. A equipe da Entrelaços nunca solicitará este código fora da tela oficial da Academia. Se você não solicitou este acesso, pode ignorar este e-mail com segurança.
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0 20px;">
      <p style="font-size: 13px; color: #475569; text-align: center; line-height: 1.5; margin: 0 0 6px; font-weight: 600;">
        Entrelaços Psicologia · Academia Método FAC
      </p>
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
        Mensagem transacional automática de validação pedagógica.
      </p>
    </div>
  </div>
</body>
</html>
      `

      const resendApiKey = $os.getenv('RESEND_API_KEY')
      if (resendApiKey) {
        // Lista ordenada de remetentes a tentar:
        // 1. EMAIL_FROM do ambiente (se existir)
        // 2. Remetente padrão de produção da marca
        // 3. Fallback onboarding@resend.dev (sandbox oficial da Resend, funciona mesmo sem domínio verificado)
        const sendersToTry = []
        const envEmailFrom = ($os.getenv('EMAIL_FROM') || '').trim()
        if (envEmailFrom) {
          sendersToTry.push(envEmailFrom)
        }
        const defaultSender =
          'Entrelaços Psicologia <noreply@entrelacos.entrelacospsicologia.com.br>'
        if (!sendersToTry.includes(defaultSender)) {
          sendersToTry.push(defaultSender)
        }
        const sandboxSender = 'Entrelaços Psicologia <onboarding@resend.dev>'
        if (!sendersToTry.includes(sandboxSender)) {
          sendersToTry.push(sandboxSender)
        }

        let sendSuccess = false
        let successfulSender = ''
        let resendResponseId = ''
        let lastErrorMessage = ''
        let lastStatusCode = 0

        for (let i = 0; i < sendersToTry.length; i++) {
          const sender = sendersToTry[i]
          try {
            const res = $http.send({
              url: 'https://api.resend.com/emails',
              method: 'POST',
              headers: {
                Authorization: 'Bearer ' + resendApiKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: sender,
                to: [rawEmail],
                subject: 'Seu código de acesso ao Guia da Aluna — Academia Método FAC',
                html: emailHtml,
              }),
              timeout: 10,
            })

            const statusCode = res.statusCode || 200
            const resBody = res.json || {}

            if (statusCode >= 200 && statusCode < 300) {
              sendSuccess = true
              successfulSender = sender
              resendResponseId = resBody && resBody.id ? String(resBody.id) : ''
              console.log(
                '[FAC Guia] Código enviado com sucesso via Resend para: ' +
                  rawEmail +
                  ' usando remetente: ' +
                  sender,
              )
              break
            } else {
              lastStatusCode = statusCode
              let errMsg = 'HTTP ' + statusCode
              if (resBody && resBody.message) {
                errMsg = String(resBody.message)
              } else if (res.raw) {
                errMsg = String(res.raw).slice(0, 150)
              }
              lastErrorMessage = errMsg
              console.error('[FAC Guia] Falha Resend (' + sender + '): ' + errMsg)

              // Se o erro foi de remetente / domínio não verificado ou 403, continuar para o próximo remetente
              // Caso seja outro erro terminal (ex: 400 formato inválido de destinatário), também tentamos o próximo por resiliência
            }
          } catch (netErr) {
            lastStatusCode = 0
            lastErrorMessage = netErr && netErr.message ? String(netErr.message) : String(netErr)
            console.error('[FAC Guia] Exceção de rede Resend (' + sender + '): ' + lastErrorMessage)
          }
        }

        // Registrar auditoria explícita do envio
        try {
          const auditCol = $app.findCollectionByNameOrId('fac_auditoria')
          const auditSend = new Record(auditCol)
          auditSend.set('operador', 'sistema')
          auditSend.set('alvo', rawEmail)

          if (sendSuccess) {
            auditSend.set('acao', 'envio_codigo_ok')
            auditSend.set(
              'motivo',
              'E-mail com código enviado com sucesso via Resend (' + successfulSender + ')',
            )
            auditSend.set('detalhes', {
              canal: 'resend',
              remetente: successfulSender,
              resend_id: resendResponseId,
            })
          } else {
            auditSend.set('acao', 'envio_codigo_falha')
            auditSend.set(
              'motivo',
              'Falha no envio de e-mail com código via Resend: ' + lastErrorMessage.slice(0, 150),
            )
            auditSend.set('detalhes', {
              canal: 'resend',
              status_http: lastStatusCode,
              erro: lastErrorMessage.slice(0, 200),
              remetentes_testados: sendersToTry,
            })
          }

          $app.save(auditSend)
        } catch (auditErr) {
          console.error('[FAC Guia] Erro ao gravar auditoria do envio de e-mail:', auditErr)
        }
      } else {
        // Sem RESEND_API_KEY configurada — tentar mailer nativo do PocketBase
        let nativeSuccess = false
        let nativeError = ''
        try {
          const mailer = $app.newMailClient()
          const senderAddress =
            $app.settings().meta.senderAddress || 'noreply@entrelacos.entrelacospsicologia.com.br'
          const senderName = $app.settings().meta.senderName || 'Entrelaços Psicologia'
          const msg = new MailerMessage({
            from: { address: senderAddress, name: senderName },
            to: [{ address: rawEmail }],
            subject: 'Seu código de acesso ao Guia da Aluna — Academia Método FAC',
            html: emailHtml,
          })
          mailer.send(msg)
          nativeSuccess = true
          console.log('[FAC Guia] Código enviado com sucesso via mailer nativo para:', rawEmail)
        } catch (mErr) {
          nativeError = mErr && mErr.message ? String(mErr.message) : String(mErr)
          console.error('[FAC Guia] Mailer nativo não disponível ou falhou:', mErr)
        }

        try {
          const auditCol = $app.findCollectionByNameOrId('fac_auditoria')
          const auditSend = new Record(auditCol)
          auditSend.set('operador', 'sistema')
          auditSend.set('alvo', rawEmail)
          if (nativeSuccess) {
            auditSend.set('acao', 'envio_codigo_ok')
            auditSend.set('motivo', 'E-mail enviado via mailer nativo do PocketBase')
            auditSend.set('detalhes', { canal: 'pocketbase_native' })
          } else {
            auditSend.set('acao', 'envio_codigo_falha')
            auditSend.set(
              'motivo',
              'Mailer nativo falhou e RESEND_API_KEY não configurada: ' + nativeError.slice(0, 150),
            )
            auditSend.set('detalhes', {
              canal: 'pocketbase_native',
              erro: nativeError.slice(0, 200),
            })
          }
          $app.save(auditSend)
        } catch (_) {}
      }
    } catch (saveErr) {
      console.error('[FAC Guia] Erro ao gravar código temporário:', saveErr)
    }
  }

  // Resposta sempre neutra para proteger privacidade e não enumerar quem comprou
  return e.json(200, {
    success: true,
    message:
      'Se o e-mail informado corresponder a uma matrícula ativa na Academia Método FAC, você receberá um código de confirmação em instantes. Verifique também sua caixa de spam.',
  })
})
