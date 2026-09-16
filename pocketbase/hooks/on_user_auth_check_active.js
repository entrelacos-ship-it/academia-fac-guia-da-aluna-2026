// Intercepta tentativas de autenticação com senha para garantir que contas desativadas
// (is_active === false) não consigam entrar no sistema.

onRecordAuthWithPasswordRequest((e) => {
  // Executa o fluxo normal de validação de senha primeiro
  e.next()

  const record = e.record
  if (!record) return

  // Verificar se a conta está desativada
  const isActive = record.get('is_active')
  // Se o campo for explicitamente falso (booleano false ou string 'false' ou 0)
  if (isActive === false || isActive === 'false' || isActive === 0) {
    throw e.forbiddenError('Conta desativada. Entre em contato com a administração.', {
      is_active: false,
    })
  }
}, 'users')
