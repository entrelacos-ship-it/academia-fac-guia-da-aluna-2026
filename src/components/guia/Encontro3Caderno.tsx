import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Lock,
  ArrowRight,
  Copy,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Check,
  Menu,
  Sparkles,
  Calculator,
  ChevronLeft,
  ChevronRight,
  FileText,
  Compass,
  CheckSquare,
  HelpCircle,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ENCONTRO_3_CONTENT, LINK_COMUNIDADE } from '@/config/guiaContent'

export interface Encontro3CartaoState {
  piso: string
  precoPraticado: string
  aPartirDe: string
  vagasSocial: string
  publicoSocial: string
  revisaoSocialMeses: string
  pacoteCondicao: string
  dataRevisao: string
}

export const INITIAL_CARTAO_STATE: Encontro3CartaoState = {
  piso: '',
  precoPraticado: '',
  aPartirDe: '',
  vagasSocial: '',
  publicoSocial: '',
  revisaoSocialMeses: '',
  pacoteCondicao: '',
  dataRevisao: '',
}

export interface Encontro3PromptState {
  piso: string
  precoAtual: string
  sessoesSemana: string
  publicoFormato: string
}

export interface Encontro3ChecklistState {
  postarGrupo: boolean
  conferirCustos: boolean
  confirmarContador: boolean
}

export const INITIAL_CHECKLIST_E3: Encontro3ChecklistState = {
  postarGrupo: false,
  conferirCustos: false,
  confirmarContador: false,
}

const STORAGE_KEY_CARTAO = 'entrelacos_fac_encontro_3_cartao_v1'
const STORAGE_KEY_CHECKLIST_E3 = 'entrelacos_fac_encontro_3_checklist_v1'
const STORAGE_KEY_PROMPT_E3 = 'entrelacos_fac_encontro_3_prompt_v1'

export const SECOES_ENCONTRO_3 = [
  { id: 'secao-visao-geral', numero: '1', label: 'Visão geral', short: 'Visão geral' },
  { id: 'secao-teoria', numero: '2', label: 'Os 7 Princípios em Slides', short: 'Teoria' },
  { id: 'secao-atividade-1', numero: '3', label: 'Atividade 1: Meu piso', short: 'Atividade 1' },
  {
    id: 'secao-laboratorio',
    numero: '4',
    label: 'Laboratório: Leitura ao vivo',
    short: 'Laboratório',
  },
  {
    id: 'secao-atividade-2',
    numero: '5',
    label: 'Atividade 2: Cartão de Preço',
    short: 'Atividade 2',
  },
  { id: 'secao-combinado', numero: '6', label: 'Combinado da semana', short: 'Combinado' },
]

interface Encontro3CadernoProps {
  isAlunaValidada: boolean
  onValidarEmail: () => void
  alunaToken?: string
}

export const Encontro3Caderno: React.FC<Encontro3CadernoProps> = ({
  isAlunaValidada,
  onValidarEmail,
}) => {
  const { toast } = useToast()
  const navigate = useNavigate()

  // Modo aula
  const [modoAula, setModoAula] = useState<boolean>(false)

  // Seções abertas/recolhidas
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'secao-visao-geral': true,
    'secao-teoria': true,
    'secao-atividade-1': true,
    'secao-laboratorio': true,
    'secao-atividade-2': true,
    'secao-combinado': true,
  })

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Seção ativa observada via scroll
  const [activeSectionId, setActiveSectionId] = useState<string>('secao-visao-geral')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140
      let current = SECOES_ENCONTRO_3[0].id
      for (const sec of SECOES_ENCONTRO_3) {
        const el = document.getElementById(sec.id)
        if (el) {
          const top = el.offsetTop
          if (scrollPosition >= top) {
            current = sec.id
          }
        }
      }
      setActiveSectionId(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // No modo aula, garantir que a Teoria esteja expandida
  useEffect(() => {
    if (modoAula) {
      setOpenSections((prev) => (prev['secao-teoria'] ? prev : { ...prev, 'secao-teoria': true }))
    }
  }, [modoAula])

  // Menu móvel do índice
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  // Navegador de slides da Teoria (1 a 11)
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0)
  const slides = ENCONTRO_3_CONTENT.slides
  const currentSlide = slides[currentSlideIndex]

  // Estado do Cartão "Minha Regra de Preço" (localStorage try/catch)
  const [cartao, setCartao] = useState<Encontro3CartaoState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CARTAO)
      if (raw) {
        const parsed = JSON.parse(raw)
        return {
          piso: parsed.piso || '',
          precoPraticado: parsed.precoPraticado || '',
          aPartirDe: parsed.aPartirDe || '',
          vagasSocial: parsed.vagasSocial || '',
          publicoSocial: parsed.publicoSocial || '',
          revisaoSocialMeses: parsed.revisaoSocialMeses || '',
          pacoteCondicao: parsed.pacoteCondicao || '',
          dataRevisao: parsed.dataRevisao || '',
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_CARTAO_STATE
  })

  // Salvar cartão
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CARTAO, JSON.stringify(cartao))
    } catch {
      // ignore
    }
  }, [cartao])

  // Estado dos campos do prompt do ChatGPT
  const [promptFields, setPromptFields] = useState<Encontro3PromptState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROMPT_E3)
      if (raw) {
        const parsed = JSON.parse(raw)
        return {
          piso: parsed.piso || '',
          precoAtual: parsed.precoAtual || '',
          sessoesSemana: parsed.sessoesSemana || '',
          publicoFormato: parsed.publicoFormato || '',
        }
      }
    } catch {
      // ignore
    }
    return {
      piso: '',
      precoAtual: '',
      sessoesSemana: '',
      publicoFormato: 'adultos, psicoterapia online',
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROMPT_E3, JSON.stringify(promptFields))
    } catch {
      // ignore
    }
  }, [promptFields])

  // Checklist do Combinado da Semana
  const [checklist, setChecklist] = useState<Encontro3ChecklistState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CHECKLIST_E3)
      if (raw) {
        const parsed = JSON.parse(raw)
        return {
          postarGrupo: Boolean(parsed.postarGrupo),
          conferirCustos: Boolean(parsed.conferirCustos),
          confirmarContador: Boolean(parsed.confirmarContador),
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_CHECKLIST_E3
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKLIST_E3, JSON.stringify(checklist))
    } catch {
      // ignore
    }
  }, [checklist])

  // Estados de cópia
  const [copiedCartao, setCopiedCartao] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedFormula, setCopiedFormula] = useState(false)

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false)
    setOpenSections((prev) => (prev[id] ? prev : { ...prev, [id]: true }))
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 50)
  }

  // Gera o texto preenchido do Cartão
  const getCartaoPreenchidoText = () => {
    const l1 = `1. Meu piso por sessão é R$ ${cartao.piso.trim() || '____'}. Abaixo disso eu não atendo.`
    const l2 = `2. Meu preço praticado é R$ ${cartao.precoPraticado.trim() || '____'} (a partir de ${cartao.aPartirDe.trim() || '____'}).`
    const l3 = `3. Valor social: até ${cartao.vagasSocial.trim() || '____'} vagas, para quem ${cartao.publicoSocial.trim() || '____'}, revisado a cada ${cartao.revisaoSocialMeses.trim() || '____'} meses.`
    const l4 = `4. Pacote ou condição especial que eu ofereço: ${cartao.pacoteCondicao.trim() || '____'}.`
    const l5 = `5. Vou revisar meu preço em ${cartao.dataRevisao.trim() || '____'}, ou quando minha agenda passar de 80%.`

    return `MINHA REGRA DE PREÇO\n\n${l1}\n${l2}\n${l3}\n${l4}\n${l5}`
  }

  const handleCopyCartao = async () => {
    try {
      const text = getCartaoPreenchidoText()
      await navigator.clipboard.writeText(text)
      setCopiedCartao(true)
      setTimeout(() => setCopiedCartao(false), 2400)
      toast({
        title: 'Cartão copiado!',
        description: 'Texto do cartão pronto para colar na comunidade ou grupo.',
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Não foi possível copiar',
        description: 'Tente selecionar o texto e copiar manualmente.',
      })
    }
  }

  // Gera o prompt do ChatGPT com as variáveis preenchidas
  const promptCompleto = useMemo(() => {
    const pisoVal = promptFields.piso.trim() || cartao.piso.trim() || '[valor]'
    const precoAtualVal =
      promptFields.precoAtual.trim() || cartao.precoPraticado.trim() || '[valor]'
    const sessoesVal = promptFields.sessoesSemana.trim() || '[número]'
    const publicoVal = promptFields.publicoFormato.trim() || '[ex.: adultos, psicoterapia online]'
    const cartaoTexto = getCartaoPreenchidoText()

    return `Aja como uma consultora de sustentabilidade financeira para psicólogas, com olhar ético e realista.

Vou te passar o resultado da minha calculadora de precificação e a minha regra de preço.

Meu piso por sessão: R$ ${pisoVal}
Quanto cobro hoje: R$ ${precoAtualVal}
Sessões por semana que consigo sustentar: ${sessoesVal}
Meu público e formato de atendimento: ${publicoVal}
Minha regra de preço:
${cartaoTexto}

Com base nisso:
1. Me diga, com franqueza, se a minha regra protege a minha sustentabilidade ou deixa brechas.
2. Aponte qual item da regra tem mais risco de eu mesma não cumprir, e por quê.
3. Se meu preço atual estiver abaixo do piso, sugira um plano de transição em até 3 etapas, sem prejudicar os pacientes atuais.
4. Escreva uma frase curta, firme e acolhedora para eu comunicar meu valor quando alguém perguntar o preço.

Não me dê fórmulas genéricas. Responda considerando a realidade da psicologia clínica no Brasil.`
  }, [promptFields, cartao])

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptCompleto)
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2400)
      toast({
        title: 'Prompt copiado com um clique!',
        description: 'Abra o ChatGPT e cole com Ctrl+V (ou toque em colar).',
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Não foi possível copiar',
        description: 'Selecione e copie o texto manualmente.',
      })
    }
  }

  const handleCopyFormula = async () => {
    try {
      await navigator.clipboard.writeText(
        'Piso por sessão = ((Custos pessoais + Custos profissionais + Retirada) ÷ (1 − %Reserva − %Tributos)) ÷ (Sessões por semana × Semanas no mês × (1 − %Faltas))',
      )
      setCopiedFormula(true)
      setTimeout(() => setCopiedFormula(false), 2400)
      toast({
        title: 'Fórmula copiada!',
      })
    } catch {
      // ignore
    }
  }

  // Se aluna não for validada, bloqueio ético padrão
  if (!isAlunaValidada) {
    return (
      <div className="p-8 sm:p-12 lg:p-14 rounded-[20px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-lg text-center space-y-7 max-w-3xl mx-auto">
        <div className="w-14 h-14 rounded-[12px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] mx-auto flex items-center justify-center">
          <Lock className="w-7 h-7 text-[#ea580c] dark:text-[#FB923C]" />
        </div>

        <div className="space-y-3">
          <Badge className="bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] border-purple-200 dark:border-purple-800 text-xs font-mono">
            Academia Método FAC · Fundação · Encontro 3
          </Badge>
          <h2 className="h-section font-medium text-editorial-primary">
            Princípios da Sustentabilidade Financeira da{' '}
            <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
              Clínica
            </em>
          </h2>
          <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed max-w-lg mx-auto font-light">
            O Encontro 3 é exclusivo para alunas matriculadas na Academia Método FAC. Valide o seu
            e-mail de matrícula para liberar este caderno didático e as atividades práticas.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            type="button"
            onClick={onValidarEmail}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-xs sm:text-sm rounded-[8px] min-h-[44px] px-6 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            <span>Validar meu e-mail de compra</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <article
      className={`space-y-12 sm:space-y-16 w-full ${
        modoAula ? 'text-lg sm:text-xl space-y-16 sm:space-y-20' : ''
      }`}
    >
      {/* ÍNDICE FIXO NO TOPO (Barra refinada: hairline 1px, fundo escuro #0D0522, sem sombras) */}
      <nav
        aria-label="Índice das seções do Encontro 3"
        className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-white/95 dark:bg-[#0D0522]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-white/[0.08] print:hidden transition-colors"
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3 min-w-0">
            {/* Eyebrow e título do encontro */}
            <div className="flex items-center gap-2 min-w-0 shrink-0">
              <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] shrink-0">
                Guia Encontro 3
              </span>
              <span
                className="text-slate-300 dark:text-white/20 hidden sm:inline"
                aria-hidden="true"
              >
                •
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 truncate max-w-[160px] md:max-w-xs hidden sm:inline">
                Sustentabilidade Financeira
              </span>
            </div>

            {/* Abas desktop/tablet: scroll horizontal discreto, respiro confortável, item ativo destacado */}
            <div
              className="hidden md:flex items-center gap-1 overflow-x-auto min-w-0 py-0.5 px-1 scroll-smooth"
              style={{ scrollbarWidth: 'thin' }}
            >
              {SECOES_ENCONTRO_3.map((sec) => {
                const isActive = activeSectionId === sec.id
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => handleScrollTo(sec.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`px-2.5 py-1.5 rounded-[6px] text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                      isActive
                        ? 'border-[#7c3aed]/40 dark:border-[#C084FC]/40 bg-[#7c3aed]/10 dark:bg-[#C084FC]/15 text-[#7c3aed] dark:text-[#C084FC]'
                        : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-mono ${
                        isActive
                          ? 'text-[#7c3aed] dark:text-[#C084FC] font-semibold'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {sec.numero}.
                    </span>
                    <span>{sec.short}</span>
                  </button>
                )
              })}
            </div>

            {/* Ações à direita: Menu mobile e Botão Modo Aula */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Botão de menu móvel (< md) */}
              <div className="md:hidden relative">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className="min-h-[36px] h-9 px-2.5 text-xs font-mono font-medium gap-1.5 rounded-[6px] border-slate-300/80 dark:border-white/[0.1] bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-200 shadow-none cursor-pointer"
                  aria-expanded={mobileMenuOpen}
                  aria-label="Abrir índice de seções"
                >
                  <Menu className="w-3.5 h-3.5" />
                  <span>
                    {SECOES_ENCONTRO_3.find((s) => s.id === activeSectionId)?.short || 'Índice'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                </Button>

                {mobileMenuOpen && (
                  <div className="absolute right-0 top-11 w-64 p-2 rounded-[10px] bg-white dark:bg-[#0D0522] border border-slate-200 dark:border-white/[0.12] shadow-xl z-40 flex flex-col gap-1">
                    <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Seções do Guia
                    </span>
                    {SECOES_ENCONTRO_3.map((sec) => {
                      const isActive = activeSectionId === sec.id
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => handleScrollTo(sec.id)}
                          className={`w-full text-left px-3 py-2 rounded-[6px] text-xs font-mono transition-colors cursor-pointer flex items-center justify-between ${
                            isActive
                              ? 'bg-[#7c3aed]/10 dark:bg-[#C084FC]/15 text-[#7c3aed] dark:text-[#C084FC] font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                          }`}
                        >
                          <span>
                            {sec.numero}. {sec.label}
                          </span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] dark:bg-[#C084FC]" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Botão de Modo Aula */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModoAula((prev) => !prev)}
                className={`min-h-[36px] h-9 px-3 text-xs font-mono font-medium gap-1.5 rounded-[6px] border transition-colors shrink-0 shadow-none cursor-pointer whitespace-nowrap ${
                  modoAula
                    ? 'bg-[#7c3aed]/15 dark:bg-[#C084FC]/20 border-[#7c3aed] dark:border-[#C084FC] text-[#7c3aed] dark:text-[#C084FC] font-semibold'
                    : 'bg-white dark:bg-white/[0.03] border-slate-300/80 dark:border-white/[0.1] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:border-[#7c3aed]/40'
                }`}
                title={
                  modoAula
                    ? 'Sair do Modo aula (retornar ao tamanho padrão)'
                    : 'Ativar Modo aula (amplia a tipografia para tela/projeção)'
                }
              >
                {modoAula ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Modo normal</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Modo aula</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Barra de progresso contínua */}
          <div
            className="w-full h-0.5 bg-slate-200/70 dark:bg-white/[0.06] rounded-full overflow-hidden"
            aria-hidden="true"
          >
            {(() => {
              const activeIdx = Math.max(
                0,
                SECOES_ENCONTRO_3.findIndex((s) => s.id === activeSectionId),
              )
              const pct = Math.round(((activeIdx + 1) / SECOES_ENCONTRO_3.length) * 100)
              return (
                <div
                  className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] dark:from-[#C084FC] dark:to-[#e879f9] transition-all duration-300 ease-out"
                  style={{ width: `${pct}%` }}
                />
              )
            })()}
          </div>
        </div>
      </nav>

      {/* CABEÇALHO DO GUIA */}
      <header className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-11 lg:p-14 space-y-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-[#27272A] pb-5">
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-[13px] font-mono">
            <Badge className="bg-purple-500/15 text-[#7c3aed] dark:text-[#C084FC] border-[#7c3aed]/30 text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5">
              Academia Método FAC · Pilar: {ENCONTRO_3_CONTENT.pilar}
            </Badge>
            <span className="text-editorial-tertiary">•</span>
            <span className="text-editorial-secondary font-semibold">
              {ENCONTRO_3_CONTENT.data} · {ENCONTRO_3_CONTENT.condutora}
            </span>
          </div>

          <Badge
            variant="outline"
            className="text-[11px] font-mono border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5"
          >
            Caderno Didático Oficial
          </Badge>
        </div>

        <div className="space-y-4">
          <h1 className="h-display font-medium tracking-tight text-editorial-primary leading-[1.05]">
            Princípios da Sustentabilidade Financeira da{' '}
            <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
              Clínica
            </em>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-editorial-secondary leading-relaxed font-light max-w-4xl">
            {ENCONTRO_3_CONTENT.visaoGeral.resumo}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
              Pergunta central do encontro:
            </span>
            <p className="text-sm sm:text-base text-editorial-primary font-medium leading-relaxed italic">
              &ldquo;{ENCONTRO_3_CONTENT.visaoGeral.perguntaCentral}&rdquo;
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-[14px] bg-slate-50/70 dark:bg-[#0c0914] border border-slate-200/80 dark:border-[#27272A] space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] block">
              Entregável do encontro:
            </span>
            <p className="text-xs sm:text-sm text-editorial-primary leading-relaxed font-light">
              {ENCONTRO_3_CONTENT.visaoGeral.entregavel}
            </p>
          </div>
        </div>
      </header>

      {/* SEÇÃO 1 · VISÃO GERAL */}
      <section
        id="secao-visao-geral"
        className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7 shadow-xs scroll-mt-28 transition-all"
      >
        <button
          type="button"
          onClick={() => toggleSection('secao-visao-geral')}
          aria-expanded={openSections['secao-visao-geral']}
          aria-controls="conteudo-secao-visao-geral"
          className="w-full text-left border-b border-slate-200/80 dark:border-[#27272A] pb-4 min-h-[44px] flex items-center justify-between gap-4 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[8px]"
        >
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              SEÇÃO 1
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1 group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
              Visão{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                geral
              </em>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-editorial-secondary shrink-0">
            <span className="hidden sm:inline">
              {openSections['secao-visao-geral'] ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#18181B] group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 flex items-center justify-center transition-colors">
              {openSections['secao-visao-geral'] ? (
                <ChevronUp className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              )}
            </span>
          </div>
        </button>

        {openSections['secao-visao-geral'] && (
          <div id="conteudo-secao-visao-geral" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-2.5">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                  Critério de pronto
                </span>
                <p className="text-sm text-editorial-primary leading-relaxed font-light">
                  {ENCONTRO_3_CONTENT.visaoGeral.criterioDePronto}
                </p>
              </div>

              <div className="p-6 rounded-[14px] border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2.5">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Lição do Encontro 2 aplicada aqui
                </span>
                <p className="text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed font-light">
                  {ENCONTRO_3_CONTENT.visaoGeral.licaoEncontro2}
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-white dark:bg-[#0c0914] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                  Ferramenta central de trabalho
                </p>
                <p className="text-sm font-medium text-editorial-primary">
                  Calculadora de Precificação Clínica Ética (dentro do Guia)
                </p>
                <p className="text-xs text-editorial-secondary font-light">
                  Abre no navegador, exporta PDF com um clique e nenhum dado financeiro sai do seu
                  aparelho.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => navigate('/calculadora')}
                className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-xs font-mono rounded-[8px] min-h-[42px] px-4 shrink-0 flex items-center gap-2 cursor-pointer shadow-none"
              >
                <Calculator className="w-4 h-4" />
                <span>Abrir Calculadora</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* SEÇÃO 2 · OS 7 PRINCÍPIOS EM SLIDES (11 SLIDES) */}
      <section
        id="secao-teoria"
        className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7 shadow-xs scroll-mt-28 transition-all"
      >
        <button
          type="button"
          onClick={() => toggleSection('secao-teoria')}
          aria-expanded={openSections['secao-teoria']}
          aria-controls="conteudo-secao-teoria"
          className="w-full text-left border-b border-slate-200/80 dark:border-[#27272A] pb-4 min-h-[44px] flex items-center justify-between gap-4 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[8px]"
        >
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              SEÇÃO 2 · TEORIA (25 MIN)
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1 group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
              Os 7 Princípios em{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                slides
              </em>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-editorial-secondary shrink-0">
            <span className="hidden sm:inline">
              {openSections['secao-teoria'] ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#18181B] group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 flex items-center justify-center transition-colors">
              {openSections['secao-teoria'] ? (
                <ChevronUp className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              )}
            </span>
          </div>
        </button>

        {openSections['secao-teoria'] && (
          <div id="conteudo-secao-teoria" className="space-y-7">
            <p className="text-xs sm:text-sm text-editorial-secondary font-light leading-relaxed">
              Cada slide traz o título que aparece na tela e a fala-chave para você conduzir. A
              ideia é um princípio por slide, com pouco texto na tela. Navegue slide a slide abaixo:
            </p>

            {/* Navegador de Slides */}
            <div className="rounded-[18px] border border-slate-200 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] p-6 sm:p-9 space-y-6">
              {/* Topo do slide: número e seletor rápido */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-[#27272A] pb-4">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-[6px] bg-[#7c3aed]/15 text-[#7c3aed] dark:text-[#C084FC] font-semibold">
                    Slide {currentSlideIndex + 1} de {slides.length}
                  </span>
                  <span className="text-editorial-secondary truncate max-w-xs sm:max-w-md font-medium">
                    {currentSlide.titulo}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                    className="min-h-[36px] h-9 px-2.5 font-mono text-xs gap-1 rounded-[8px] cursor-pointer"
                    aria-label="Slide anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={currentSlideIndex === slides.length - 1}
                    onClick={() =>
                      setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))
                    }
                    className="min-h-[36px] h-9 px-2.5 font-mono text-xs gap-1 rounded-[8px] cursor-pointer"
                    aria-label="Próximo slide"
                  >
                    <span className="hidden sm:inline">Próximo</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Botões de atalho dos 11 slides */}
              <div
                className="flex items-center gap-1 overflow-x-auto pb-1"
                style={{ scrollbarWidth: 'thin' }}
              >
                {slides.map((s, idx) => (
                  <button
                    key={s.numero}
                    type="button"
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-7 px-2.5 rounded-[6px] font-mono text-[11px] transition-colors whitespace-nowrap cursor-pointer border ${
                      idx === currentSlideIndex
                        ? 'bg-[#7c3aed] text-white dark:bg-[#C084FC] dark:text-[#0A0A14] border-[#7c3aed] font-bold'
                        : 'border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {s.numero}
                  </button>
                ))}
              </div>

              {/* Corpo do Slide: Card que simula o projetor */}
              <div className="rounded-[16px] bg-white dark:bg-[#0D0522] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-10 space-y-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] font-semibold block mb-2">
                    Na tela:
                  </span>

                  {/* Renderização especial para o Slide 6 (Fórmula em Fração) */}
                  {currentSlide.isFormula ? (
                    <div className="space-y-4 py-2">
                      <div className="p-6 sm:p-8 rounded-[14px] bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] flex flex-col items-center justify-center text-center">
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 font-mono text-xs sm:text-sm md:text-base text-editorial-primary font-semibold">
                          <span className="text-[#7c3aed] dark:text-[#C084FC] whitespace-nowrap">
                            Piso por sessão =
                          </span>

                          <div className="flex flex-col items-center gap-1.5 max-w-2xl">
                            {/* Numerador */}
                            <div className="px-3 py-1.5 text-slate-900 dark:text-white text-center leading-snug">
                              (Custos pessoais + Custos profissionais + Retirada) ÷ (1 − %Reserva −
                              %Tributos)
                            </div>
                            {/* Linha da Fração */}
                            <div className="w-full h-0.5 bg-[#7c3aed] dark:bg-[#C084FC] rounded-full" />
                            {/* Denominador */}
                            <div className="px-3 py-1.5 text-slate-700 dark:text-slate-300 text-center leading-snug">
                              Sessões por semana × Semanas no mês × (1 − %Faltas)
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyFormula}
                          className="font-mono text-xs gap-1.5 text-editorial-secondary hover:text-editorial-primary"
                        >
                          {copiedFormula ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Fórmula copiada!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar texto da fórmula</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : currentSlide.isExemploCalculado && currentSlide.tabelaExemplo ? (
                    /* Renderização especial para o Slide 7 (Exemplo calculado) */
                    <div className="space-y-4 py-2">
                      <div className="overflow-x-auto rounded-[12px] border border-slate-200 dark:border-[#27272A]">
                        <table className="w-full text-left font-sans text-xs sm:text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#18181B] font-mono text-[11px] text-editorial-secondary uppercase tracking-wider">
                              <th className="py-2.5 px-4">Item</th>
                              <th className="py-2.5 px-4 w-48 text-right font-bold">Valor</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/70 dark:divide-[#27272A]">
                            {currentSlide.tabelaExemplo.map((row, rIdx) => {
                              const isHighlight =
                                row.item.includes('Piso por sessão') ||
                                row.item.includes('Faturamento bruto necessário')
                              return (
                                <tr
                                  key={rIdx}
                                  className={
                                    isHighlight
                                      ? 'bg-purple-50/70 dark:bg-purple-950/30 font-semibold'
                                      : ''
                                  }
                                >
                                  <td
                                    className={`py-2.5 px-4 text-editorial-primary ${
                                      isHighlight ? 'text-[#7c3aed] dark:text-[#C084FC]' : ''
                                    }`}
                                  >
                                    {row.item}
                                  </td>
                                  <td
                                    className={`py-2.5 px-4 font-mono text-right whitespace-nowrap ${
                                      isHighlight
                                        ? 'text-[#7c3aed] dark:text-[#C084FC] text-sm sm:text-base font-bold'
                                        : 'text-editorial-primary'
                                    }`}
                                  >
                                    {row.valor}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* Demais slides com texto de impacto */
                    <p className="font-serif-editorial text-xl sm:text-2xl md:text-3xl text-editorial-primary font-normal leading-snug">
                      &ldquo;{currentSlide.naTela}&rdquo;
                    </p>
                  )}
                </div>

                {/* Fala-chave para condução */}
                <div className="pt-4 border-t border-slate-200/80 dark:border-white/[0.08] space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#ea580c] dark:text-[#FB923C] font-semibold block">
                    Fala-chave para você conduzir:
                  </span>
                  <p className="text-xs sm:text-sm md:text-base text-editorial-secondary font-light leading-relaxed pl-3 border-l-2 border-[#7c3aed]/40">
                    {currentSlide.falaChave}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEÇÃO 3 · ATIVIDADE 1: MEU PISO POR SESSÃO */}
      <section
        id="secao-atividade-1"
        className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7 shadow-xs scroll-mt-28 transition-all"
      >
        <button
          type="button"
          onClick={() => toggleSection('secao-atividade-1')}
          aria-expanded={openSections['secao-atividade-1']}
          aria-controls="conteudo-secao-atividade-1"
          className="w-full text-left border-b border-slate-200/80 dark:border-[#27272A] pb-4 min-h-[44px] flex items-center justify-between gap-4 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[8px]"
        >
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              SEÇÃO 3 · PRÁTICA (25 MIN)
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1 group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
              Atividade 1 · Meu piso por{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                sessão
              </em>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-editorial-secondary shrink-0">
            <span className="hidden sm:inline">
              {openSections['secao-atividade-1'] ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#18181B] group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 flex items-center justify-center transition-colors">
              {openSections['secao-atividade-1'] ? (
                <ChevronUp className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              )}
            </span>
          </div>
        </button>

        {openSections['secao-atividade-1'] && (
          <div id="conteudo-secao-atividade-1" className="space-y-7">
            {/* Box da Ferramenta */}
            <div className="p-6 rounded-[16px] border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/60 dark:bg-purple-950/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                    Ferramenta
                  </span>
                  <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                    Calculadora de Precificação Clínica Ética
                  </h3>
                  <p className="text-xs sm:text-sm text-editorial-secondary font-light max-w-2xl leading-relaxed">
                    {ENCONTRO_3_CONTENT.atividade1.ferramenta}
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() => navigate('/calculadora')}
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-xs font-mono rounded-[8px] min-h-[44px] px-5 shrink-0 flex items-center gap-2 cursor-pointer shadow-none"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Acessar a Calculadora</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>

            {/* Passo a passo para as alunas */}
            <div className="space-y-4">
              <h4 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
                Passo a passo para as alunas:
              </h4>

              <div className="space-y-2.5">
                {ENCONTRO_3_CONTENT.atividade1.passos.map((passo, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-[12px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#7c3aed]/15 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-editorial-primary font-light leading-relaxed">
                      {passo}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Condução */}
            <div className="p-4 sm:p-5 rounded-[12px] bg-slate-100 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] space-y-1.5 text-xs sm:text-sm">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] font-bold block">
                Condução pela facilitadora:
              </span>
              <p className="text-editorial-secondary font-light leading-relaxed">
                {ENCONTRO_3_CONTENT.atividade1.conducao}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* SEÇÃO 4 · LABORATÓRIO: LEITURA AO VIVO DO RESULTADO */}
      <section
        id="secao-laboratorio"
        className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7 shadow-xs scroll-mt-28 transition-all"
      >
        <button
          type="button"
          onClick={() => toggleSection('secao-laboratorio')}
          aria-expanded={openSections['secao-laboratorio']}
          aria-controls="conteudo-secao-laboratorio"
          className="w-full text-left border-b border-slate-200/80 dark:border-[#27272A] pb-4 min-h-[44px] flex items-center justify-between gap-4 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[8px]"
        >
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              SEÇÃO 4 · LABORATÓRIO (15 MIN)
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1 group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
              Leitura ao vivo do{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                resultado
              </em>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-editorial-secondary shrink-0">
            <span className="hidden sm:inline">
              {openSections['secao-laboratorio'] ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#18181B] group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 flex items-center justify-center transition-colors">
              {openSections['secao-laboratorio'] ? (
                <ChevronUp className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              )}
            </span>
          </div>
        </button>

        {openSections['secao-laboratorio'] && (
          <div id="conteudo-secao-laboratorio" className="space-y-6">
            <p className="text-xs sm:text-sm text-editorial-secondary font-light leading-relaxed">
              {ENCONTRO_3_CONTENT.laboratorio.instrucao}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ENCONTRO_3_CONTENT.laboratorio.perguntas.map((pergunta, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-2"
                >
                  <span className="font-mono text-xs font-bold text-[#7c3aed] dark:text-[#C084FC]">
                    Pergunta {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-editorial-primary font-medium leading-relaxed">
                    {pergunta}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-5 sm:p-6 rounded-[14px] border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/60 dark:bg-purple-950/20 space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] font-bold block">
                Sua leitura como condutora:
              </span>
              <p className="text-xs sm:text-sm text-editorial-primary font-light leading-relaxed">
                {ENCONTRO_3_CONTENT.laboratorio.suaLeitura}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* SEÇÃO 5 · ATIVIDADE 2: CARTÃO MINHA REGRA DE PREÇO + TESTE NO CHATGPT */}
      <section
        id="secao-atividade-2"
        className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7 shadow-xs scroll-mt-28 transition-all"
      >
        <button
          type="button"
          onClick={() => toggleSection('secao-atividade-2')}
          aria-expanded={openSections['secao-atividade-2']}
          aria-controls="conteudo-secao-atividade-2"
          className="w-full text-left border-b border-slate-200/80 dark:border-[#27272A] pb-4 min-h-[44px] flex items-center justify-between gap-4 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[8px]"
        >
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              SEÇÃO 5 · ENTREGÁVEL (15 MIN)
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1 group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
              Atividade 2 · Cartão &ldquo;Minha Regra de{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                Preço
              </em>
              &rdquo;
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-editorial-secondary shrink-0">
            <span className="hidden sm:inline">
              {openSections['secao-atividade-2'] ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#18181B] group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 flex items-center justify-center transition-colors">
              {openSections['secao-atividade-2'] ? (
                <ChevronUp className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              )}
            </span>
          </div>
        </button>

        {openSections['secao-atividade-2'] && (
          <div id="conteudo-secao-atividade-2" className="space-y-8">
            <p className="text-xs sm:text-sm text-editorial-secondary font-light leading-relaxed">
              {ENCONTRO_3_CONTENT.atividade2.instrucao}
            </p>

            {/* CARTÃO INTERATIVO (SALVO NO LOCALSTORAGE) */}
            <div className="rounded-[18px] border border-purple-200/90 dark:border-white/[0.12] bg-white dark:bg-[#0D0522] p-6 sm:p-9 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-white/[0.08] pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] font-semibold block">
                    CARTÃO INTERATIVO · SALVO NO SEU NAVEGADOR
                  </span>
                  <h3 className="font-sans font-semibold text-lg text-editorial-primary">
                    MINHA REGRA DE PREÇO
                  </h3>
                </div>

                <Button
                  type="button"
                  onClick={handleCopyCartao}
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-xs font-mono rounded-[8px] min-h-[40px] px-4 shrink-0 flex items-center gap-2 cursor-pointer shadow-none"
                >
                  {copiedCartao ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Cartão copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar cartão preenchido</span>
                    </>
                  )}
                </Button>
              </div>

              {/* 5 Linhas Editáveis */}
              <div className="space-y-4 font-sans text-xs sm:text-sm">
                {/* Linha 1 */}
                <div className="p-4 rounded-[12px] bg-slate-50/70 dark:bg-[#18181B] border border-slate-200/80 dark:border-[#27272A] space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-editorial-primary font-medium">
                    <span>1. Meu piso por sessão é R$</span>
                    <input
                      type="text"
                      placeholder="180,00"
                      value={cartao.piso}
                      onChange={(e) => setCartao({ ...cartao, piso: e.target.value })}
                      className="px-2.5 py-1 rounded-[6px] border border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#0c0914] font-mono text-xs sm:text-sm text-[#7c3aed] dark:text-[#C084FC] font-bold w-32 focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed]"
                    />
                    <span>. Abaixo disso eu não atendo.</span>
                  </div>
                </div>

                {/* Linha 2 */}
                <div className="p-4 rounded-[12px] bg-slate-50/70 dark:bg-[#18181B] border border-slate-200/80 dark:border-[#27272A] space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-editorial-primary font-medium">
                    <span>2. Meu preço praticado é R$</span>
                    <input
                      type="text"
                      placeholder="250,00"
                      value={cartao.precoPraticado}
                      onChange={(e) => setCartao({ ...cartao, precoPraticado: e.target.value })}
                      className="px-2.5 py-1 rounded-[6px] border border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#0c0914] font-mono text-xs sm:text-sm text-[#7c3aed] dark:text-[#C084FC] font-bold w-32 focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed]"
                    />
                    <span>(a partir de</span>
                    <input
                      type="text"
                      placeholder="novembro/2026"
                      value={cartao.aPartirDe}
                      onChange={(e) => setCartao({ ...cartao, aPartirDe: e.target.value })}
                      className="px-2.5 py-1 rounded-[6px] border border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#0c0914] text-xs sm:text-sm w-36 focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed]"
                    />
                    <span>).</span>
                  </div>
                </div>

                {/* Linha 3 */}
                <div className="p-4 rounded-[12px] bg-slate-50/70 dark:bg-[#18181B] border border-slate-200/80 dark:border-[#27272A] space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-editorial-primary font-medium">
                    <span>3. Valor social: até</span>
                    <input
                      type="text"
                      placeholder="3"
                      value={cartao.vagasSocial}
                      onChange={(e) => setCartao({ ...cartao, vagasSocial: e.target.value })}
                      className="px-2.5 py-1 rounded-[6px] border border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#0c0914] font-mono text-xs sm:text-sm text-center w-16 focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed]"
                    />
                    <span>vagas, para quem</span>
                    <input
                      type="text"
                      placeholder="estudantes e baixa renda comprovada"
                      value={cartao.publicoSocial}
                      onChange={(e) => setCartao({ ...cartao, publicoSocial: e.target.value })}
                      className="px-2.5 py-1 rounded-[6px] border border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#0c0914] text-xs sm:text-sm min-w-[220px] flex-1 focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed]"
                    />
                    <span>, revisado a cada</span>
                    <input
                      type="text"
                      placeholder="6"
                      value={cartao.revisaoSocialMeses}
                      onChange={(e) => setCartao({ ...cartao, revisaoSocialMeses: e.target.value })}
                      className="px-2.5 py-1 rounded-[6px] border border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#0c0914] font-mono text-xs sm:text-sm text-center w-16 focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed]"
                    />
                    <span>meses.</span>
                  </div>
                </div>

                {/* Linha 4 */}
                <div className="p-4 rounded-[12px] bg-slate-50/70 dark:bg-[#18181B] border border-slate-200/80 dark:border-[#27272A] space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-editorial-primary font-medium">
                    <span>4. Pacote ou condição especial que eu ofereço:</span>
                    <input
                      type="text"
                      placeholder="nenhum por enquanto (ou pagamento mensal antecipado com 5% de desconto)"
                      value={cartao.pacoteCondicao}
                      onChange={(e) => setCartao({ ...cartao, pacoteCondicao: e.target.value })}
                      className="px-2.5 py-1 rounded-[6px] border border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#0c0914] text-xs sm:text-sm min-w-[260px] flex-1 focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed]"
                    />
                  </div>
                </div>

                {/* Linha 5 */}
                <div className="p-4 rounded-[12px] bg-slate-50/70 dark:bg-[#18181B] border border-slate-200/80 dark:border-[#27272A] space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-editorial-primary font-medium">
                    <span>5. Vou revisar meu preço em</span>
                    <input
                      type="text"
                      placeholder="abril de 2027"
                      value={cartao.dataRevisao}
                      onChange={(e) => setCartao({ ...cartao, dataRevisao: e.target.value })}
                      className="px-2.5 py-1 rounded-[6px] border border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#0c0914] text-xs sm:text-sm w-44 focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed]"
                    />
                    <span>(data), ou quando minha agenda passar de 80%.</span>
                  </div>
                </div>
              </div>

              {/* Botão de compartilhar na comunidade */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 dark:border-white/[0.08]">
                <p className="text-xs text-editorial-secondary font-light">
                  Preencha os campos e copie o cartão pronto para postar no grupo da turma.
                </p>
                {LINK_COMUNIDADE && (
                  <a
                    href={LINK_COMUNIDADE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#7c3aed] dark:text-[#C084FC] hover:underline"
                  >
                    <span>Abrir grupo no WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* TESTE NO CHATGPT (OPCIONAL, SE SOBRAR TEMPO) */}
            <div className="rounded-[18px] border border-slate-200 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] font-bold block">
                    TESTE NO CHATGPT · OPCIONAL (SE SOBRAR TEMPO)
                  </span>
                  <h4 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                    Prompt de Validação Ética & Regra de Preço
                  </h4>
                  <p className="text-xs sm:text-sm text-editorial-secondary font-light max-w-2xl leading-relaxed">
                    {ENCONTRO_3_CONTENT.atividade2.testeChatGPT.instrucao}
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-xs font-mono rounded-[8px] min-h-[40px] px-4 shrink-0 flex items-center gap-2 cursor-pointer shadow-none"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Prompt copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar prompt pronto</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Ajuste rápido de variáveis antes de copiar */}
              <div className="p-4 sm:p-5 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] space-y-3">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-editorial-secondary block">
                  Variáveis do prompt (preenchem automaticamente com o cartão acima):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <label className="text-editorial-secondary block mb-1">
                      Piso por sessão (R$):
                    </label>
                    <input
                      type="text"
                      placeholder={cartao.piso || '180,00'}
                      value={promptFields.piso}
                      onChange={(e) => setPromptFields({ ...promptFields, piso: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-[6px] border border-slate-300 dark:border-[#3f3f46] bg-slate-50 dark:bg-[#0c0914] text-editorial-primary"
                    />
                  </div>
                  <div>
                    <label className="text-editorial-secondary block mb-1">
                      Quanto cobro hoje (R$):
                    </label>
                    <input
                      type="text"
                      placeholder="130,00"
                      value={promptFields.precoAtual}
                      onChange={(e) =>
                        setPromptFields({ ...promptFields, precoAtual: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded-[6px] border border-slate-300 dark:border-[#3f3f46] bg-slate-50 dark:bg-[#0c0914] text-editorial-primary"
                    />
                  </div>
                  <div>
                    <label className="text-editorial-secondary block mb-1">
                      Sessões/semana suportadas:
                    </label>
                    <input
                      type="text"
                      placeholder="18"
                      value={promptFields.sessoesSemana}
                      onChange={(e) =>
                        setPromptFields({ ...promptFields, sessoesSemana: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded-[6px] border border-slate-300 dark:border-[#3f3f46] bg-slate-50 dark:bg-[#0c0914] text-editorial-primary"
                    />
                  </div>
                  <div>
                    <label className="text-editorial-secondary block mb-1">
                      Público e formato:
                    </label>
                    <input
                      type="text"
                      placeholder="adultos, online"
                      value={promptFields.publicoFormato}
                      onChange={(e) =>
                        setPromptFields({ ...promptFields, publicoFormato: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded-[6px] border border-slate-300 dark:border-[#3f3f46] bg-slate-50 dark:bg-[#0c0914] text-editorial-primary font-sans text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Caixa de Código do Prompt Verbatim */}
              <div className="relative">
                <pre className="p-4 sm:p-6 rounded-[12px] bg-slate-900 text-slate-100 dark:bg-[#0D0522] border border-slate-800 dark:border-white/[0.08] font-mono text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap overflow-x-auto">
                  {promptCompleto}
                </pre>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEÇÃO 6 · COMBINADO DA SEMANA E FECHAMENTO */}
      <section
        id="secao-combinado"
        className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7 shadow-xs scroll-mt-28 transition-all"
      >
        <button
          type="button"
          onClick={() => toggleSection('secao-combinado')}
          aria-expanded={openSections['secao-combinado']}
          aria-controls="conteudo-secao-combinado"
          className="w-full text-left border-b border-slate-200/80 dark:border-[#27272A] pb-4 min-h-[44px] flex items-center justify-between gap-4 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[8px]"
        >
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              SEÇÃO 6 · FECHAMENTO
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1 group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
              Combinado da{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                semana
              </em>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-editorial-secondary shrink-0">
            <span className="hidden sm:inline">
              {openSections['secao-combinado'] ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#18181B] group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 flex items-center justify-center transition-colors">
              {openSections['secao-combinado'] ? (
                <ChevronUp className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              )}
            </span>
          </div>
        </button>

        {openSections['secao-combinado'] && (
          <div id="conteudo-secao-combinado" className="space-y-8">
            {/* Box do Combinado da semana */}
            <div className="p-6 sm:p-7 rounded-[16px] border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/60 dark:bg-purple-950/20 space-y-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-[#7c3aed] dark:text-[#C084FC]" />
                <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                  Combinado da semana ({ENCONTRO_3_CONTENT.combinado.tempo})
                </h3>
              </div>

              <div className="space-y-3 pt-1">
                {/* Item 1 */}
                <label className="flex items-start gap-3 p-3.5 rounded-[10px] bg-white dark:bg-[#18181B] border border-slate-200/80 dark:border-[#27272A] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.postarGrupo}
                    onChange={(e) => setChecklist({ ...checklist, postarGrupo: e.target.checked })}
                    className="w-5 h-5 rounded-[4px] accent-[#7c3aed] cursor-pointer mt-0.5"
                  />
                  <span
                    className={`text-xs sm:text-sm leading-relaxed ${
                      checklist.postarGrupo
                        ? 'line-through opacity-70 text-editorial-secondary'
                        : 'text-editorial-primary font-medium'
                    }`}
                  >
                    Postar no grupo o print da calculadora (ou só a diferença, se preferir não expor
                    valores) e o cartão &ldquo;Minha Regra de Preço&rdquo;
                  </span>
                </label>

                {/* Item 2 */}
                <label className="flex items-start gap-3 p-3.5 rounded-[10px] bg-white dark:bg-[#18181B] border border-slate-200/80 dark:border-[#27272A] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.conferirCustos}
                    onChange={(e) =>
                      setChecklist({ ...checklist, conferirCustos: e.target.checked })
                    }
                    className="w-5 h-5 rounded-[4px] accent-[#7c3aed] cursor-pointer mt-0.5"
                  />
                  <span
                    className={`text-xs sm:text-sm leading-relaxed ${
                      checklist.conferirCustos
                        ? 'line-through opacity-70 text-editorial-secondary'
                        : 'text-editorial-primary font-medium'
                    }`}
                  >
                    Conferir os custos reais em três meses de extrato e recalcular se algum número
                    mudou
                  </span>
                </label>

                {/* Item 3 */}
                <label className="flex items-start gap-3 p-3.5 rounded-[10px] bg-white dark:bg-[#18181B] border border-slate-200/80 dark:border-[#27272A] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.confirmarContador}
                    onChange={(e) =>
                      setChecklist({ ...checklist, confirmarContador: e.target.checked })
                    }
                    className="w-5 h-5 rounded-[4px] accent-[#7c3aed] cursor-pointer mt-0.5"
                  />
                  <span
                    className={`text-xs sm:text-sm leading-relaxed ${
                      checklist.confirmarContador
                        ? 'line-through opacity-70 text-editorial-secondary'
                        : 'text-editorial-primary font-medium'
                    }`}
                  >
                    Confirmar com o contador o percentual de tributos usado na conta
                  </span>
                </label>
              </div>

              {/* Frase de Fechamento */}
              <div className="pt-3 border-t border-purple-200/60 dark:border-purple-900/40">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] font-bold block mb-1">
                  Frase de fechamento:
                </span>
                <p className="font-serif-editorial text-base sm:text-lg text-editorial-primary italic font-normal">
                  &ldquo;{ENCONTRO_3_CONTENT.combinado.fraseFechamento}&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </article>
  )
}

export default Encontro3Caderno
