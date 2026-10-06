import mentoraFacVerbatimContent from '@/assets/skill-97bde.md?raw'

export interface SistemaCategory {
  id: string
  label: string
  descricao?: string
  badge?: string
}

export interface SistemaItemDownload {
  filename: string
  url: string
  rawContent?: string
  tipo: 'markdown' | 'pdf' | 'zip' | 'outro'
  tamanhoAproximado?: string
}

export interface SistemaItemExtra {
  categoria: string // 'aplicativos' | 'skills' | outros futuros
  tipo: 'app' | 'skill' | 'ferramenta'
  download?: SistemaItemDownload
  versao?: string
  destaqueBadge?: string
  instrucoesUso?: string
}

/**
 * Categorias pré-configuradas e extensíveis para o Bloco Sistema do Hub.
 * Novas categorias podem ser adicionadas facilmente neste array.
 */
export const SISTEMA_CATEGORIAS: SistemaCategory[] = [
  {
    id: 'aplicativos',
    label: 'Aplicativos',
    descricao:
      'Ferramentas clínicas interativas do Método FAC com cálculo e diagnóstico em tempo real.',
  },
  {
    id: 'skills',
    label: 'Skills',
    descricao:
      'Agentes e instruções especializadas do Método FAC para inteligência artificial e mentoria.',
    badge: 'Novo',
  },
]

/**
 * Itens estáticos ou complementares do bloco Sistema.
 * Podem se sobrepor ou complementar os itens vindos de `fac_hub_items` do PocketBase.
 */
export const SISTEMA_ITEMS_EXTRAS: Record<string, SistemaItemExtra> = {
  // Configuração para Calculadora de Precificação
  calculadora: {
    categoria: 'aplicativos',
    tipo: 'app',
  },
  // Configuração para Meu IKIGAI Clínico
  ikigai: {
    categoria: 'aplicativos',
    tipo: 'app',
  },
  // Configuração para a Skill Mentora-FAC
  'mentora-fac': {
    categoria: 'skills',
    tipo: 'skill',
    versao: '1.0',
    destaqueBadge: 'Mentora de Carreira',
    instrucoesUso:
      'Copie as instruções ou baixe o arquivo Mentora-FAC.md para importar como Custom Instruction ou Skill no seu assistente de IA preferido (ChatGPT, Claude, etc.).',
    download: {
      filename: 'Mentora-FAC.md',
      url: '/downloads/Mentora-FAC.md',
      rawContent: mentoraFacVerbatimContent,
      tipo: 'markdown',
      tamanhoAproximado: '13 KB',
    },
  },
}

/**
 * Skill Mentora-FAC como item nativo do Hub
 */
export const SKILL_MENTORA_FAC_ITEM = {
  id: 'hub_skill_mentora_fac',
  chave: 'mentora-fac',
  titulo: 'Mentora do FAC',
  descricao:
    'Mentora de carreira das alunas da Academia Método FAC: tira dúvidas do método, realiza o diagnóstico profundo dos 3 pilares, revisa entregáveis e direciona plano de 90 dias.',
  bloco: 'sistema' as const,
  ativo: true,
  rotulo_badge: 'Download Exclusivo',
  ordem: 1,
  icone: 'Sparkles',
  exclusivo_alunas: true,
  categoria: 'skills',
}
