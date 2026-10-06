import { ClientResponseError } from 'pocketbase'

export type FieldErrors = Record<string, string>

export function extractFieldErrors(error: unknown): FieldErrors {
  if (!(error instanceof ClientResponseError)) return {}
  const data = error.response?.data
  if (!data || typeof data !== 'object') return {}
  const errors: FieldErrors = {}
  for (const [field, detail] of Object.entries(data)) {
    if (
      detail &&
      typeof detail === 'object' &&
      'message' in detail &&
      typeof (detail as { message: unknown }).message === 'string'
    ) {
      errors[field] = (detail as { message: string }).message
    }
  }
  return errors
}

export function getErrorMessage(error: unknown): string {
  if (!(error instanceof ClientResponseError)) {
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof (error as { message: unknown }).message === 'string'
    ) {
      return (error as { message: string }).message
    }
    return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
  }

  // 1. Verificar erros específicos por campo no response.data
  const fieldMsgs = Object.values(extractFieldErrors(error))
  if (fieldMsgs.length > 0) {
    return fieldMsgs.join(' ')
  }

  // 2. Extrair mensagem customizada retornada no corpo JSON do backend { message: '...' }
  const respData = error.response?.data
  if (
    respData &&
    typeof respData === 'object' &&
    'message' in respData &&
    typeof (respData as { message: unknown }).message === 'string'
  ) {
    return (respData as { message: string }).message
  }

  // 3. Extrair mensagem de nível superior do response se existir
  if (
    error.response &&
    typeof error.response === 'object' &&
    'message' in error.response &&
    typeof (error.response as { message: unknown }).message === 'string'
  ) {
    const respMsg = (error.response as { message: string }).message
    if (respMsg && respMsg !== 'Something went wrong while processing your request.') {
      return respMsg
    }
  }

  // 4. Se a mensagem for a genérica do PocketBase, verificar se há dados originais ou mensagem mais clara
  if (error.message && error.message !== 'Something went wrong while processing your request.') {
    return error.message
  }

  if (error.status === 403) {
    return 'Permissão negada. Apenas administradoras autorizadas podem realizar esta ação.'
  }
  if (error.status === 404) {
    return 'Registro ou recurso não encontrado no servidor.'
  }
  if (error.status === 400) {
    return 'Parâmetros inválidos enviados ao servidor. Verifique os dados informados.'
  }

  return error.message || 'Ocorreu uma falha ao processar a requisição no servidor.'
}
