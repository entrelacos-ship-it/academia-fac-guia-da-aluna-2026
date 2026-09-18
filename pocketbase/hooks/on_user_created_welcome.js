// Hook de boas-vindas após criação de conta
// Dispara e-mail transacional de boas-vindas se houver provedor configurado
// (Resend via RESEND_API_KEY ou MailClient padrão com SMTP)

onRecordAfterCreateSuccess((e) => {
  const record = e.record
  const userEmail = record.email()
  const userName = record.get('name') || 'Colega Psicóloga'

  let siteUrl = $os.getenv('SITE_URL') || ''
  if (!siteUrl) {
    siteUrl = 'https://calculadora-de-precificacao-fac-017b3.shrd00.internal.goskip.dev'
  }
  if (siteUrl.endsWith('/')) {
    siteUrl = siteUrl.slice(0, -1)
  }

  const welcomeHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Boas-vindas ao Método FAC</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 32px 16px;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #ea580c 100%); padding: 28px 24px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">
        Bem-vinda à Calculadora FAC!
      </h1>
      <p style="color: rgba(255,255,255,0.9); font-size: 13px; margin: 6px 0 0; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">
        Método FAC · Entrelaços Psicologia
      </p>
    </div>
    
    <div style="padding: 32px 28px;">
      <p style="font-size: 16px; margin: 0 0 16px; color: #0f172a;">
        Olá, <strong>${userName}</strong>!
      </p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px;">
        Sua conta na <strong>Calculadora de Precificação Ética FAC</strong> foi criada com sucesso.
        Agora você tem em mãos uma ferramenta completa para calcular o piso ético das suas sessões, planejar sua reserva financeira e proteger a sustentabilidade do seu consultório.
      </p>
      
      <div style="text-align: center; margin: 28px 0;">
        <a href="${siteUrl}/login" style="display: inline-block; background-color: #7c3aed; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 13px 28px; border-radius: 8px;">
          Acessar a Calculadora
        </a>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 8px; font-size: 13px; color: #0f172a;">Recursos da sua conta:</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #475569; line-height: 1.6;">
          <li>Sincronização em nuvem e backup automático dos seus cálculos</li>
          <li>Simulador tributário (PF vs Simples Nacional Anexo III e V)</li>
          <li>Contrato clínico e gerador de proposta de reajuste anual</li>
          <li>Consultoria Heurística FAC com IA</li>
        </ul>
      </div>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0 20px;">

      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0; line-height: 1.5;">
        Entrelaços Psicologia — Cursos e Formação Clínica<br>
        Dúvidas ou suporte: contato@entrelacos.entrelacospsicologia.com.br
      </p>
    </div>
  </div>
</body>
</html>
`

  // 1. Tentar envio via Resend se RESEND_API_KEY existir
  const resendApiKey = $os.getenv('RESEND_API_KEY')
  if (resendApiKey && userEmail) {
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
          to: [userEmail],
          subject: 'Bem-vinda à Calculadora de Precificação FAC — Entrelaços',
          html: welcomeHtml,
        }),
        timeout: 10,
      })
      console.log('[Email] Boas-vindas enviadas com sucesso via Resend para:', userEmail)
    } catch (resendErr) {
      console.warn('[Email] Erro ao enviar boas-vindas via Resend API:', resendErr)
    }
  } else if (userEmail) {
    // 2. Se não houver Resend, tentar via MailClient padrão do PocketBase (se SMTP estiver configurado)
    try {
      const mailer = $app.newMailClient()
      const senderAddress =
        $app.settings().meta.senderAddress || 'noreply@entrelacos.entrelacospsicologia.com.br'
      const senderName = $app.settings().meta.senderName || 'Entrelaços Psicologia'

      const msg = new MailerMessage({
        from: {
          address: senderAddress,
          name: senderName,
        },
        to: [{ address: userEmail }],
        subject: 'Bem-vinda à Calculadora de Precificação FAC — Entrelaços',
        html: welcomeHtml,
      })
      mailer.send(msg)
      console.log('[Email] Boas-vindas enviadas via PocketBase mailer para:', userEmail)
    } catch (mailerErr) {
      // Falha graciosa se SMTP não estiver configurado
      console.log('[Email] SMTP não configurado para boas-vindas:', mailerErr)
    }
  }

  e.next()
}, 'users')
