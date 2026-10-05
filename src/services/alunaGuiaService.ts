import pb from '@/lib/pocketbase/client'

export interface AlunaSession {
  email: string
  nome?: string
  status: 'ativa' | 'suspensa' | 'expirada'
  ciclo?: string
  token: string
}

export interface EncontroResumo {
  numero: number
  titulo: string
  status: 'rascunho' | 'publicado'
  data_prevista: string
  is_publico: boolean
}

export interface EncontroDetalhe {
  numero: number
  titulo: string
  status: 'rascunho' | 'publicado'
  data_prevista: string
  conteudo?: {
    introducao?: string
    secoes?: Array<{ titulo: string; texto: string }>
  }
  recursos?: Array<{ rotulo: string; tipo: string; url: string }>
  gravacao_url?: string
  is_publico?: boolean
  restrito?: boolean
  em_breve?: boolean
  autorizado?: boolean
}

const STORAGE_KEY_ALUNA = 'entrelacos_fac_aluna_session'

export const AlunaGuiaService = {
  // Obter sessão atual de aluna do localStorage (com fallback caso storage falhe)
  getLocalSession(): AlunaSession | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALUNA)
      if (saved) {
        return JSON.parse(saved) as AlunaSession
      }
    } catch {
      // ignore
    }
    return null
  },

  saveLocalSession(session: AlunaSession) {
    try {
      localStorage.setItem(STORAGE_KEY_ALUNA, JSON.stringify(session))
    } catch {
      // ignore
    }
  },

  clearLocalSession() {
    try {
      localStorage.removeItem(STORAGE_KEY_ALUNA)
    } catch {
      // ignore
    }
  },

  // Solicitar código de validação de e-mail (envio neutro)
  async solicitarCodigo(email: string): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase()
    return pb.send<{ success: boolean; message: string }>('/backend/v1/fac/guia/solicitar-codigo', {
      method: 'POST',
      body: { email: cleanEmail },
    })
  },

  // Confirmar código e receber sessão de aluna
  async confirmarCodigo(
    email: string,
    codigo: string,
  ): Promise<{ success: boolean; message: string; aluna?: AlunaSession; status?: string }> {
    const cleanEmail = email.trim().toLowerCase()
    const cleanCode = codigo.trim()

    return pb.send<{
      success: boolean
      message: string
      aluna?: AlunaSession
      status?: string
    }>('/backend/v1/fac/guia/confirmar-codigo', {
      method: 'POST',
      body: { email: cleanEmail, codigo: cleanCode },
    })
  },

  // Listar os 19 encontros (resumo de títulos e datas)
  async listarEncontros(): Promise<EncontroResumo[]> {
    try {
      const res = await pb.send<{ success: boolean; encontros: EncontroResumo[] }>(
        '/backend/v1/fac/guia/encontros',
        { method: 'GET' },
      )
      return res.encontros || []
    } catch {
      return []
    }
  },

  // Buscar conteúdo de um encontro com validação estrita no backend
  async buscarEncontro(
    numero: number,
    token?: string,
  ): Promise<{
    success: boolean
    encontro?: EncontroDetalhe
    message?: string
    requires_login?: boolean
    status?: string
  }> {
    return pb.send<{
      success: boolean
      encontro?: EncontroDetalhe
      message?: string
      requires_login?: boolean
      status?: string
    }>('/backend/v1/fac/guia/encontro', {
      method: 'POST',
      body: { numero, token: token || '' },
    })
  },

  // Alternar status de encontro (Apenas Admin)
  async adminToggleEncontroStatus(
    numero: number,
    status: 'publicado' | 'rascunho',
  ): Promise<{ success: boolean; message: string }> {
    return pb.send<{ success: boolean; message: string }>(
      '/backend/v1/fac/admin/encontros/toggle-status',
      {
        method: 'POST',
        body: { numero, status },
      },
    )
  },
}
