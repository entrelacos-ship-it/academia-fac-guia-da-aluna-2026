import { describe, it, expect, vi } from 'vitest'
import { getErrorMessage, extractFieldErrors } from './pocketbase/errors'
import { ClientResponseError } from 'pocketbase'
import { UserManagementService } from '../services/userManagementService'
import pb from './pocketbase/client'

describe('getErrorMessage & Error Handling', () => {
  it('retorna a mensagem de erro direto de Error padrão', () => {
    const err = new Error('Falha de conexão')
    expect(getErrorMessage(err)).toBe('Falha de conexão')
  })

  it('retorna mensagem extraída de objeto com chave message', () => {
    const err = { message: 'Erro customizado de negócio' }
    expect(getErrorMessage(err)).toBe('Erro customizado de negócio')
  })

  it('prioriza mensagem customizada de response.data.message sobre a genérica', () => {
    const clientErr = new ClientResponseError({
      status: 400,
      response: {
        code: 400,
        message: 'Something went wrong while processing your request.',
        data: {
          message: 'Você não pode excluir a sua própria conta com a qual está conectada.',
        },
      },
    })
    expect(getErrorMessage(clientErr)).toBe(
      'Você não pode excluir a sua própria conta com a qual está conectada.',
    )
  })

  it('extrai mensagens por campo se presentes', () => {
    const clientErr = new ClientResponseError({
      status: 400,
      response: {
        code: 400,
        message: 'Something went wrong while processing your request.',
        data: {
          email: { message: 'Já existe uma conta com este e-mail.' },
        },
      },
    })
    expect(getErrorMessage(clientErr)).toBe('Já existe uma conta com este e-mail.')
    expect(extractFieldErrors(clientErr)).toEqual({
      email: 'Já existe uma conta com este e-mail.',
    })
  })

  it('substitui mensagem genérica por mensagem clara conforme status HTTP quando sem detalhe', () => {
    const err403 = new ClientResponseError({
      status: 403,
      response: {
        message: 'Something went wrong while processing your request.',
        data: {},
      },
    })
    expect(getErrorMessage(err403)).toContain('Permissão negada')

    const err404 = new ClientResponseError({
      status: 404,
      response: {
        message: 'Something went wrong while processing your request.',
        data: {},
      },
    })
    expect(getErrorMessage(err404)).toContain('Registro ou recurso não encontrado')
  })
})

describe('UserManagementService.deleteUser', () => {
  it('envia requisição DELETE para a rota administrativa correta', async () => {
    const sendSpy = vi.spyOn(pb, 'send').mockResolvedValueOnce({
      success: true,
      message: 'Conta de teste excluída com sucesso.',
    })

    const res = await UserManagementService.deleteUser('user_target_123')
    expect(sendSpy).toHaveBeenCalledWith('/backend/v1/fac/admin/users/user_target_123', {
      method: 'DELETE',
    })
    expect(res.success).toBe(true)

    sendSpy.mockRestore()
  })
})

describe('Validação de confirmação de exclusão (EXCLUIR)', () => {
  const isDeleteConfirmed = (typed: string) => {
    const trimmed = (typed || '').trim()
    return (
      trimmed.localeCompare('EXCLUIR', undefined, { sensitivity: 'accent' }) === 0 ||
      trimmed.toUpperCase() === 'EXCLUIR'
    )
  }

  it('aceita "EXCLUIR" em maiúsculas exatas', () => {
    expect(isDeleteConfirmed('EXCLUIR')).toBe(true)
  })

  it('aceita "excluir" em minúsculas (relato verbatim da usuária)', () => {
    expect(isDeleteConfirmed('excluir')).toBe(true)
  })

  it('aceita variações com caixa mista e espaços extras nas bordas', () => {
    expect(isDeleteConfirmed(' Excluir ')).toBe(true)
    expect(isDeleteConfirmed('  EXCLUIR  ')).toBe(true)
    expect(isDeleteConfirmed('  excluir  \n')).toBe(true)
    expect(isDeleteConfirmed('ExClUiR')).toBe(true)
  })

  it('rejeita palavras incompletas ou incorretas', () => {
    expect(isDeleteConfirmed('')).toBe(false)
    expect(isDeleteConfirmed('   ')).toBe(false)
    expect(isDeleteConfirmed('exclu')).toBe(false)
    expect(isDeleteConfirmed('exclusao')).toBe(false)
    expect(isDeleteConfirmed('excluir! ')).toBe(false)
    expect(isDeleteConfirmed('EXCLUIR AGORA')).toBe(false)
  })
})
