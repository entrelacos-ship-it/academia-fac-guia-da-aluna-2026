import pb from '@/lib/pocketbase/client'

export interface HubItem {
  id: string
  chave: string
  titulo: string
  descricao?: string
  bloco: 'hero' | 'sistema' | 'material'
  ativo: boolean
  rotulo_badge?: string
  ordem?: number
  icone?: string
  url?: string
  exclusivo_alunas?: boolean
  created?: string
  updated?: string
}

export const HubService = {
  /**
   * Lista todos os itens do hub para exibição.
   * Por padrão, para usuários comuns filtra por ativo=true e ordena por ordem asc.
   * Se includeInactive=true (para tela admin), traz tudo.
   */
  async listarItens(includeInactive = false): Promise<HubItem[]> {
    try {
      const filter = includeInactive ? '' : 'ativo = true'
      const records = await pb.collection('fac_hub_items').getFullList<HubItem>({
        filter,
        sort: 'ordem',
      })
      return records
    } catch (err) {
      console.warn('Erro ao carregar itens do hub no PocketBase, usando fallback local:', err)
      // Fallback estático seguro caso o backend esteja inacessível momentaneamente
      return [
        {
          id: 'fallback_guia',
          chave: 'guia_aluna',
          titulo: 'Guia da Aluna FAC',
          descricao:
            'Aula Magna aberta com o Diagnóstico FAC Aprofundado (24 perguntas), trilha completa de encontros, cadernos didáticos e validação do e-mail de compra para alunas.',
          bloco: 'hero',
          ativo: true,
          rotulo_badge: 'Aula 1 Aberta · Trilha do Ciclo',
          ordem: 1,
          icone: 'BookOpen',
          url: '/guia',
          exclusivo_alunas: false,
        },
        {
          id: 'fallback_calc',
          chave: 'calculadora',
          titulo: 'Calculadora de Precificação FAC',
          descricao:
            'Calcule seu piso ético por sessão a partir do custo real de vida, pró-labore justo, tributos e capacidade clínica. Central de resultados, cenários e planejamento.',
          bloco: 'sistema',
          ativo: true,
          rotulo_badge: 'Exclusivo para alunas',
          ordem: 2,
          icone: 'Calculator',
          url: '/calculadora',
          exclusivo_alunas: true,
        },
        {
          id: 'fallback_ikigai',
          chave: 'ikigai',
          titulo: 'Meu IKIGAI Clínico',
          descricao:
            'Construa seu painel dos 4 círculos, diagnostique os vazios e gere sua declaração de missão autoral. Salvo na nuvem da sua conta com exportação para IA, PNG e PDF.',
          bloco: 'sistema',
          ativo: true,
          rotulo_badge: 'Exclusivo para alunas',
          ordem: 3,
          icone: 'Compass',
          url: '/ikigai',
          exclusivo_alunas: true,
        },
        {
          id: 'fallback_material_1',
          chave: 'caderno_exercicios',
          titulo: 'Cadernos & Fichas de Estudo',
          descricao:
            'Compilação de fichas de campo, roteiros de reflexão e materiais complementares das aulas da Academia.',
          bloco: 'material',
          ativo: true,
          rotulo_badge: 'Em breve',
          ordem: 4,
          icone: 'FileText',
          url: '/guia',
          exclusivo_alunas: true,
        },
        {
          id: 'fallback_material_2',
          chave: 'tutoriais_video',
          titulo: 'Tutoriais de Prática & Plataformas',
          descricao:
            'Passo a passo em vídeo demonstrando a operação dos sistemas clínicos, organização de prontuário e enquadre de contrato.',
          bloco: 'material',
          ativo: true,
          rotulo_badge: 'Em breve',
          ordem: 5,
          icone: 'Video',
          url: '/guia',
          exclusivo_alunas: true,
        },
      ]
    }
  },

  /**
   * Alterna a liberação ou edita o rótulo da peça (Apenas Administradora).
   * Registra na trilha de auditoria através do hook dedicado.
   */
  async adminToggleItem(params: {
    chave: string
    ativo?: boolean
    rotulo_badge?: string
  }): Promise<{ success: boolean; message: string; item?: HubItem }> {
    return pb.send<{ success: boolean; message: string; item?: HubItem }>(
      '/backend/v1/fac/admin/hub/toggle-status',
      {
        method: 'POST',
        body: params,
      },
    )
  },
}
