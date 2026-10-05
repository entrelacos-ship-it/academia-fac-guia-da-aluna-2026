import { describe, it, expect } from 'vitest'
import pb from './pocketbase/client'

describe('Disparo Real do Fluxo de Solicitação de Código', () => {
  it('dispara requisição para o endpoint ao vivo', async () => {
    try {
      const res = await pb.send<{ success: boolean; message: string }>(
        '/backend/v1/fac/guia/solicitar-codigo',
        {
          method: 'POST',
          body: { email: 'entre.lacos.psi.cursos@gmail.com' },
        },
      )
      console.log('Resposta do endpoint:', res)
      expect(res.success).toBe(true)
    } catch (err) {
      console.error('Erro ao chamar endpoint:', err)
      throw err
    }
  })
})
