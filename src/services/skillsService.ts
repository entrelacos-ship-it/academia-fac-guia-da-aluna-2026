import pb from '@/lib/pocketbase/client'

export interface SkillItem {
  id: string
  titulo: string
  descricao?: string
  arquivo: string // nome do arquivo armazenado no PocketBase
  categoria?: string
  ordem?: number
  ativo: boolean
  versao?: string
  rotulo_badge?: string
  instrucoes?: string
  created?: string
  updated?: string
}

export interface CreateSkillPayload {
  titulo: string
  descricao?: string
  categoria?: string
  ordem?: number
  ativo?: boolean
  versao?: string
  rotulo_badge?: string
  instrucoes?: string
  arquivo: File
}

export interface UpdateSkillPayload {
  titulo?: string
  descricao?: string
  categoria?: string
  ordem?: number
  ativo?: boolean
  versao?: string
  rotulo_badge?: string
  instrucoes?: string
  arquivo?: File
}

export const SkillsService = {
  /**
   * Listar skills
   * @param apenasAtivas se true (padrão para aluna), retorna somente ativo = true
   */
  async listarSkills(apenasAtivas: boolean = false): Promise<SkillItem[]> {
    try {
      const filter = apenasAtivas ? 'ativo = true' : ''
      const records = await pb.collection('fac_skills').getFullList<SkillItem>({
        filter,
        sort: 'ordem,-created',
      })
      return records
    } catch (err) {
      console.warn('Erro ao listar skills:', err)
      return []
    }
  },

  /**
   * Obter URL direta do arquivo da skill no PocketBase
   */
  getFileUrl(skill: { id: string; arquivo: string }, download: boolean = true): string {
    const base = pb.baseURL || ''
    const url = `${base}/api/files/fac_skills/${skill.id}/${skill.arquivo}`
    return download ? `${url}?download=1` : url
  },

  /**
   * Executa o download de uma skill com validação de matrícula de aluna
   * Serve o arquivo original (.zip, .md, etc.) intacto para download
   */
  async downloadSkillAluna(
    skill: SkillItem,
    alunaToken?: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // 1. Chamar o endpoint autenticado de backend para validar a matrícula e registrar auditoria
      const res = await pb.send<{
        success: boolean
        file_url?: string
        filename?: string
        message?: string
        requires_login?: boolean
        status?: string
      }>('/backend/v1/fac/skills/download', {
        method: 'POST',
        body: {
          id: skill.id,
          token: alunaToken || '',
        },
      })

      if (!res.success) {
        return { success: false, message: res.message || 'Não foi possível baixar o arquivo.' }
      }

      // 2. Buscar o arquivo real via fetch e gerar blob com o nome correto
      const fileUrl = this.getFileUrl(skill, true)
      const tokenHeader: Record<string, string> = {}
      if (pb.authStore.token) {
        tokenHeader['Authorization'] = pb.authStore.token
      }

      const fileResponse = await fetch(fileUrl, {
        headers: tokenHeader,
      })

      if (!fileResponse.ok) {
        // Fallback: abrir link direto com ?download=1
        window.open(fileUrl, '_blank')
        return { success: true }
      }

      const blob = await fileResponse.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      // Se tiver o nome original, use-o; senão fallback para o arquivo salvo
      a.download = res.filename || skill.arquivo
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1000)

      return { success: true }
    } catch (err: unknown) {
      console.error('Erro ao realizar download da skill:', err)
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as Error)?.message ||
        'Falha ao baixar o arquivo da skill.'
      return { success: false, message: msg }
    }
  },

  /**
   * Criar skill (Admin) com upload nativo de arquivo (FormData)
   */
  async criarSkill(payload: CreateSkillPayload): Promise<SkillItem> {
    const formData = new FormData()
    formData.append('titulo', payload.titulo)
    if (payload.descricao) formData.append('descricao', payload.descricao)
    if (payload.categoria) formData.append('categoria', payload.categoria)
    if (payload.ordem !== undefined) formData.append('ordem', String(payload.ordem))
    formData.append('ativo', String(payload.ativo ?? true))
    if (payload.versao) formData.append('versao', payload.versao)
    if (payload.rotulo_badge) formData.append('rotulo_badge', payload.rotulo_badge)
    if (payload.instrucoes) formData.append('instrucoes', payload.instrucoes)
    formData.append('arquivo', payload.arquivo)

    const record = await pb.collection('fac_skills').create<SkillItem>(formData)
    return record
  },

  /**
   * Atualizar skill (Admin)
   */
  async atualizarSkill(id: string, payload: UpdateSkillPayload): Promise<SkillItem> {
    const formData = new FormData()
    if (payload.titulo !== undefined) formData.append('titulo', payload.titulo)
    if (payload.descricao !== undefined) formData.append('descricao', payload.descricao)
    if (payload.categoria !== undefined) formData.append('categoria', payload.categoria)
    if (payload.ordem !== undefined) formData.append('ordem', String(payload.ordem))
    if (payload.ativo !== undefined) formData.append('ativo', String(payload.ativo))
    if (payload.versao !== undefined) formData.append('versao', payload.versao)
    if (payload.rotulo_badge !== undefined) formData.append('rotulo_badge', payload.rotulo_badge)
    if (payload.instrucoes !== undefined) formData.append('instrucoes', payload.instrucoes)
    if (payload.arquivo) formData.append('arquivo', payload.arquivo)

    const record = await pb.collection('fac_skills').update<SkillItem>(id, formData)
    return record
  },

  /**
   * Alternar ativação de skill (Admin)
   */
  async toggleAtivo(id: string, ativo: boolean): Promise<SkillItem> {
    return pb.collection('fac_skills').update<SkillItem>(id, { ativo })
  },

  /**
   * Excluir skill (Admin)
   */
  async excluirSkill(id: string): Promise<boolean> {
    return pb.collection('fac_skills').delete(id)
  },
}
