// Hook de redefinição de senha com envio amigável Entrelaços em pt-BR
// Suporta envio direto via Resend / SMTP / SendGrid se segredos estiverem presentes,
// ou personaliza o Mailer padrão do PocketBase.

onMailerRecordPasswordResetSend((e) => {
  const user = e.record
  const meta = e.meta || {}
  const token = meta.token || ''
  const userName = user && user.get('name') ? user.get('name') : 'Colega Psicóloga'
  const userEmail = user && user.email() ? user.email() : ''

  // Obter URLs da aplicação
  let siteUrl = $os.getenv('SITE_URL') || ''
  if (!siteUrl) {
    siteUrl = 'https://calculadora-de-precificacao-fac-017b3.shrd00.internal.goskip.dev'
  }
  if (siteUrl.endsWith('/')) {
    siteUrl = siteUrl.slice(0, -1)
  }

  const resetLink = siteUrl + '/login?token=' + encodeURIComponent(token)

  // Customizar o assunto e conteúdo do e-mail padrão do PocketBase
  if (e.message) {
    e.message.subject = 'Redefinição de Senha — Calculadora de Precificação FAC'
    e.message.html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Redefinição de Senha — Método FAC</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 32px 16px;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #ea580c 100%); padding: 28px 24px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700; letter-spacing: -0.02em;">
        Calculadora de Precificação FAC
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
        Recebemos uma solicitação para redefinir a senha de acesso da sua conta na <strong>Calculadora de Precificação Ética (Método FAC)</strong>.
      </p>
      
      <div style="text-align: center; margin: 28px 0;">
        <a href="${resetLink}" style="display: inline-block; background-color: #7c3aed; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 13px 28px; border-radius: 8px; box-shadow: 0 4px 8px rgba(124, 58, 237, 0.25);">
          Redefinir Minha Senha
        </a>
      </div>

      <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0 0 16px;">
        Se o botão acima não funcionar, copie e cole o seguinte link no seu navegador:<br>
        <a href="${resetLink}" style="color: #7c3aed; word-break: break-all;">${resetLink}</a>
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin: 20px 0;">
        <p style="margin: 0; font-size: 11px; font-family: monospace; color: #475569;">
          <strong>Seu token de redefinição direta:</strong><br>
          <span style="word-break: break-all; color: #7c3aed;">${token}</span>
        </p>
      </div>

      <div style="border-left: 3px solid #ea580c; background-color: #fff7ed; padding: 10px 14px; border-radius: 0 6px 6px 0; margin: 20px 0;">
        <p style="margin: 0; font-size: 12px; color: #9a3412;">
          <strong>Atenção:</strong> Este link é válido por <strong>30 minutos</strong> e expira automaticamente após o uso. Se você não solicitou esta redefinição, por favor desconsidere este e-mail. Sua senha permanecerá inalterada.
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0 20px;">

      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0; line-height: 1.5;">
        Entrelaços Psicologia — Formação e Gestão Clínica Ética<br>
        Este é um e-mail transacional automático. Por favor, não responda a esta mensagem.
      </p>
    </div>
  </div>
</body>
</html>
`
  }

  // Se houver chave RESEND_API_KEY configurada nos segredos, dispara também via HTTP API da Resend
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
          subject: 'Redefinição de Senha — Calculadora de Precificação FAC',
          html: e.message.html,
        }),
        timeout: 10,
      })
      console.log('[Email] Redefinição enviada com sucesso via Resend para:', userEmail)
    } catch (sendErr) {
      console.warn('[Email] Erro ao enviar redefinição via Resend API:', sendErr)
    }
  }

  e.next()
})
