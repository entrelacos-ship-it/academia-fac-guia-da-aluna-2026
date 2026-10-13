import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Lock,
  ArrowRight,
  Copy,
  Download,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Check,
  Search,
  Target,
  FileCheck,
  X,
  Menu,
  HelpCircle,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { SkillsService, SkillItem } from '@/services/skillsService'
import { AlunaGuiaService } from '@/services/alunaGuiaService'
import { LINK_PECA_3, LINK_COMUNIDADE, LINK_ECOSSISTEMA } from '@/config/guiaContent'
import { ManifestoTeoriaBloco } from './ManifestoTeoriaBloco'

export interface Encontro2ChecklistState {
  frasePeca3: boolean
  contaChatGpt: boolean
  skillsOuPlanoB: boolean
  respostasDetetive: boolean
}

export const INITIAL_CHECKLIST_STATE: Encontro2ChecklistState = {
  frasePeca3: false,
  contaChatGpt: false,
  skillsOuPlanoB: false,
  respostasDetetive: false,
}

const STORAGE_KEY_CHECKLIST = 'entrelacos_fac_encontro_2_checklist_v2'

export const SECOES_GUIA = [
  { id: 'secao-1', numero: '1', label: 'Antes de começar', short: 'Checklist' },
  { id: 'secao-2', numero: '2', label: 'Sua conta no ChatGPT', short: 'Conta ChatGPT' },
  { id: 'secao-3', numero: '3', label: 'A teoria do encontro', short: 'Teoria' },
  { id: 'secao-4', numero: '4', label: 'Baixe e importe as skills', short: 'Skills' },
  { id: 'secao-5', numero: '5', label: 'Como usar as skills no ChatGPT', short: 'Como usar' },
  { id: 'secao-6', numero: '6', label: 'Entrega da semana', short: 'Entrega' },
  { id: 'secao-7', numero: '7', label: 'Se acontecer isto', short: 'Ajuda' },
]

interface Encontro2CadernoProps {
  isAlunaValidada: boolean
  onValidarEmail: () => void
  alunaToken?: string
}

export const Encontro2Caderno: React.FC<Encontro2CadernoProps> = ({
  isAlunaValidada,
  onValidarEmail,
  alunaToken: alunaTokenProp,
}) => {
  const { toast } = useToast()

  // Único estado salvo: checklist da Seção 1 em localStorage com try/catch
  const [checklist, setChecklist] = useState<Encontro2ChecklistState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CHECKLIST)
      if (raw) {
        const parsed = JSON.parse(raw)
        return {
          frasePeca3: Boolean(parsed.frasePeca3),
          contaChatGpt: Boolean(parsed.contaChatGpt),
          skillsOuPlanoB: Boolean(parsed.skillsOuPlanoB),
          respostasDetetive: Boolean(parsed.respostasDetetive),
        }
      }
    } catch {
      // Ignora erro silenciosamente
    }
    return INITIAL_CHECKLIST_STATE
  })

  // Modo aula
  const [modoAula, setModoAula] = useState<boolean>(false)

  // Estado de seções abertas/recolhidas (começam abertas por padrão)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'secao-1': true,
    'secao-2': true,
    'secao-3': true,
    'secao-4': true,
    'secao-5': true,
    'secao-6': true,
    'secao-7': true,
  })

  // Alternar recolher/expandir de uma seção
  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Seção ativa observada via scroll para destacar na barra
  const [activeSectionId, setActiveSectionId] = useState<string>('secao-1')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140
      let current = SECOES_GUIA[0].id
      for (const sec of SECOES_GUIA) {
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

  // No modo aula, garantir que a Seção 3 esteja expandida
  useEffect(() => {
    if (modoAula) {
      setOpenSections((prev) => (prev['secao-3'] ? prev : { ...prev, 'secao-3': true }))
    }
  }, [modoAula])

  // Menu móvel do índice
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  // Bloco expansível "Ver orientações completas" da Seção 2
  const [orientacoesCompletasOpen, setOrientacoesCompletasOpen] = useState<boolean>(false)

  // Modal de imagem ampliada para as duas imagens da teoria
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; title: string } | null>(
    null,
  )

  // Estados de feedback de cópia
  const [copiedSkill1, setCopiedSkill1] = useState(false)
  const [copiedSkill2, setCopiedSkill2] = useState(false)
  const [copiedSkill3, setCopiedSkill3] = useState(false)
  const [copiedPrompt1, setCopiedPrompt1] = useState(false)
  const [copiedPrompt2, setCopiedPrompt2] = useState(false)
  const [copiedPrompt3, setCopiedPrompt3] = useState(false)

  // Skills cadastradas no backend (fac_skills)
  const [dbSkills, setDbSkills] = useState<SkillItem[]>([])
  const [downloadingSkill, setDownloadingSkill] = useState<string | null>(null)

  // Disponibilidade dos arquivos (PocketBase prioritário + fallback de arquivos públicos)
  const [filesStatus, setFilesStatus] = useState<{
    radarGptZip: boolean
    radarMd: boolean
    estrategistaGptZip: boolean
    estrategistaMd: boolean
    manifestoGptZip: boolean
    manifestoMd: boolean
    // Prints Seção 2
    contaPrints: Record<number, boolean>
    // Prints Seção 4
    gptPrints: Record<number, boolean>
    // Imagens teoria
    funilImg: boolean
    niveisImg: boolean
  }>({
    radarGptZip: false,
    radarMd: false,
    estrategistaGptZip: false,
    estrategistaMd: false,
    manifestoGptZip: false,
    manifestoMd: false,
    contaPrints: {},
    gptPrints: {},
    funilImg: true,
    niveisImg: true,
  })

  // Salvar checklist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(checklist))
    } catch {
      // localStorage bloqueado ou cheio
    }
  }, [checklist])

  // Checar existência de arquivos estáticos no public/
  useEffect(() => {
    let isMounted = true

    const checkStatic = async (url: string): Promise<boolean> => {
      try {
        // Usar GET com verificação de status e Content-Type para evitar falso positivo do SPA fallback
        const res = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-0' } })
        if (!res.ok) return false
        const ct = res.headers.get('content-type') || ''
        // Se a SPA respondeu com index.html em rota estática inexistente (SPA catch-all)
        if (ct.includes('text/html')) return false
        return true
      } catch {
        return false
      }
    }

    const verifyAll = async () => {
      // 1. Carregar skills ativas cadastradas no backend PocketBase (fac_skills)
      let skillsFromDb: SkillItem[] = []
      try {
        skillsFromDb = await SkillsService.listarSkills(true)
      } catch (err) {
        console.warn('Erro ao carregar skills do backend no Encontro 2:', err)
      }

      // Mapeamento semântico robusto:
      // Cartão 1 = Radar de Nicho FAC / Radar Detetive
      // Cartão 2 = Estrategista de Posicionamento
      // Cartão 3 = Manifesto da Marca
      const matchedRadar = SkillsService.matchEncontro2Skill(skillsFromDb, 'radar')
      const matchedEstrategista = SkillsService.matchEncontro2Skill(skillsFromDb, 'estrategista')
      const matchedManifesto = SkillsService.matchEncontro2Skill(skillsFromDb, 'manifesto')

      const [
        staticRadarGptZip,
        staticRadarMd,
        staticEstrategistaGptZip,
        staticEstrategistaMd,
        funilImg,
        niveisImg,
      ] = await Promise.all([
        checkStatic('/skills/encontro-2/radar-detetive-chatgpt.zip'),
        checkStatic('/skills/encontro-2/radar-detetive.md'),
        checkStatic('/skills/encontro-2/estrategista-de-posicionamento-chatgpt.zip'),
        checkStatic('/skills/encontro-2/estrategista-de-posicionamento.md'),
        checkStatic('/images/encontro-2/funil-marketing.svg'),
        checkStatic('/images/encontro-2/niveis-consciencia.svg'),
      ])

      // Prints da Seção 2
      const contaPrints: Record<number, boolean> = {}
      for (let i = 1; i <= 6; i++) {
        contaPrints[i] = await checkStatic(`/images/encontro-2/prints/conta-${i}.png`)
      }

      // Prints da Seção 4
      const gptPrints: Record<number, boolean> = {}
      for (let i = 1; i <= 5; i++) {
        gptPrints[i] = await checkStatic(`/images/encontro-2/prints/importar-chatgpt-${i}.png`)
      }

      // Se a skill do Radar está ativa no backend:
      // O arquivo anexado habilita o download para ChatGPT
      // Se for .md ou houver .md correspondente, habilita a cópia de texto
      const radarExt = matchedRadar?.arquivo?.toLowerCase().split('.').pop() || ''
      const hasRadarBackend = !!matchedRadar && !!matchedRadar.arquivo && matchedRadar.ativo

      const estrategistaExt = matchedEstrategista?.arquivo?.toLowerCase().split('.').pop() || ''
      const hasEstrategistaBackend =
        !!matchedEstrategista && !!matchedEstrategista.arquivo && matchedEstrategista.ativo

      const manifestoExt = matchedManifesto?.arquivo?.toLowerCase().split('.').pop() || ''
      const hasManifestoBackend =
        !!matchedManifesto && !!matchedManifesto.arquivo && matchedManifesto.ativo

      if (isMounted) {
        setDbSkills(skillsFromDb)
        setFilesStatus({
          // Radar: habilitado se existir no backend ativo OU no caminho estático
          radarGptZip: hasRadarBackend || staticRadarGptZip,
          radarMd: (hasRadarBackend && ['md', 'txt', 'json'].includes(radarExt)) || staticRadarMd,
          // Estrategista: habilitado se existir no backend ativo OU no caminho estático
          estrategistaGptZip: hasEstrategistaBackend || staticEstrategistaGptZip,
          estrategistaMd:
            (hasEstrategistaBackend && ['md', 'txt', 'json'].includes(estrategistaExt)) ||
            staticEstrategistaMd,
          // Manifesto: Cartão 3
          manifestoGptZip: hasManifestoBackend,
          manifestoMd: hasManifestoBackend && ['md', 'txt', 'json'].includes(manifestoExt),
          contaPrints,
          gptPrints,
          funilImg,
          niveisImg,
        })
      }
    }

    verifyAll()
    return () => {
      isMounted = false
    }
  }, [])

  const toggleCheck = (key: keyof Encontro2ChecklistState) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false)
    // Garante que a seção alvo esteja aberta ao pular para ela
    setOpenSections((prev) => (prev[id] ? prev : { ...prev, [id]: true }))
    // Pequeno timeout para o DOM atualizar caso a seção estivesse recolhida
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 50)
  }

  // Obter token de aluna (prop ou localStorage)
  const getAlunaToken = (): string => {
    if (alunaTokenProp) return alunaTokenProp
    const session = AlunaGuiaService.getLocalSession()
    return session?.token || ''
  }

  // Download autenticado da skill do PocketBase com fallback para rota estática (ChatGPT)
  const handleDownloadSkill = async (
    tipo: 'radar' | 'estrategista' | 'manifesto',
    fallbackPath: string,
  ) => {
    if (!isAlunaValidada) {
      toast({
        variant: 'destructive',
        title: 'Acesso exclusivo de alunas',
        description: 'Valide seu e-mail de matrícula para liberar o download desta skill.',
      })
      onValidarEmail()
      return
    }

    const matched = SkillsService.matchEncontro2Skill(dbSkills, tipo)
    const token = getAlunaToken()

    if (matched && matched.arquivo) {
      setDownloadingSkill(`${tipo}-chatgpt`)
      try {
        const res = await SkillsService.downloadSkillAluna(matched, token)
        if (res.success) {
          toast({
            title: 'Download iniciado',
            description: `O arquivo ${matched.arquivo} da skill "${matched.titulo}" foi baixado.`,
          })
          return
        } else {
          toast({
            variant: 'destructive',
            title: 'Não foi possível baixar',
            description: res.message || 'Verifique sua matrícula de aluna.',
          })
          return
        }
      } catch (err) {
        console.error('Erro ao baixar skill do backend:', err)
        toast({
          variant: 'destructive',
          title: 'Erro no download',
          description: 'Falha ao conectar ao servidor de arquivos. Tentando fallback...',
        })
      } finally {
        setDownloadingSkill(null)
      }
    }

    // Fallback para arquivo estático caso não cadastrado no backend
    window.open(fallbackPath, '_blank')
  }

  // Copiar texto da skill (Plano B): tenta ler do PocketBase se for .md, com fallback no static
  const handleCopySkillText = async (
    tipo: 'radar' | 'estrategista' | 'manifesto',
    fallbackPath: string,
  ) => {
    try {
      let textToCopy = ''
      const matched = SkillsService.matchEncontro2Skill(dbSkills, tipo)
      const token = getAlunaToken()

      // 1. Tentar ler do backend se a skill for arquivo textual (.md/.txt/.json)
      if (matched) {
        const ext = matched.arquivo?.toLowerCase().split('.').pop() || ''
        if (['md', 'txt', 'json'].includes(ext)) {
          const fetchRes = await SkillsService.fetchSkillText(matched, token)
          if (fetchRes.success && fetchRes.text) {
            textToCopy = fetchRes.text
          }
        }
      }

      // 2. Fallback: buscar arquivo estático em public/
      if (!textToCopy) {
        const res = await fetch(fallbackPath, { cache: 'no-cache' })
        if (res.ok) {
          const staticText = await res.text()
          if (
            staticText &&
            !staticText.includes('<!DOCTYPE html>') &&
            !staticText.includes('<html')
          ) {
            textToCopy = staticText
          }
        }
      }

      if (!textToCopy) {
        toast({
          variant: 'destructive',
          title: 'Texto não disponível',
          description:
            'O arquivo desta skill é um pacote .zip para importação. Use o botão "Baixar para o ChatGPT" acima.',
        })
        return
      }

      await navigator.clipboard.writeText(textToCopy)
      if (tipo === 'radar') {
        setCopiedSkill1(true)
        setTimeout(() => setCopiedSkill1(false), 2400)
      } else if (tipo === 'estrategista') {
        setCopiedSkill2(true)
        setTimeout(() => setCopiedSkill2(false), 2400)
      } else {
        setCopiedSkill3(true)
        setTimeout(() => setCopiedSkill3(false), 2400)
      }
      toast({
        title: 'Texto copiado com sucesso!',
        description: 'Agora cole no ChatGPT para ativar o Plano B.',
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o texto da skill para a área de transferência.',
      })
    }
  }

  // Copiar prompt útil
  const handleCopyPromptText = async (text: string, setter: (val: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text)
      setter(true)
      setTimeout(() => setter(false), 2400)
    } catch {
      // falha silenciosa
    }
  }

  // Se aluna não for validada, bloqueio padrão
  if (!isAlunaValidada) {
    return (
      <div className="p-8 sm:p-12 lg:p-14 rounded-[20px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-lg text-center space-y-7 max-w-3xl mx-auto">
        <div className="w-14 h-14 rounded-[12px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] mx-auto flex items-center justify-center">
          <Lock className="w-7 h-7 text-[#ea580c] dark:text-[#FB923C]" />
        </div>

        <div className="space-y-3">
          <Badge className="bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] border-purple-200 dark:border-purple-800 text-xs font-mono">
            Academia Método FAC · Fundação · Encontro 2
          </Badge>
          <h2 className="h-section font-medium text-editorial-primary">
            Do sentido ao{' '}
            <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
              mercado
            </em>
          </h2>
          <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed max-w-lg mx-auto font-light">
            O Encontro 2 é exclusivo para alunas matriculadas na Academia Método FAC. Valide o seu
            e-mail de matrícula para liberar este guia e as ferramentas de investigação de mercado.
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
      {/* ÍNDICE FIXO NO TOPO (Barra refinada alinhada à linguagem do hub: hairline 1px, fundo escuro #0D0522, sem sombras) */}
      <nav
        aria-label="Índice das seções do Encontro 2"
        className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-white/95 dark:bg-[#0D0522]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-white/[0.08] print:hidden transition-colors"
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3 min-w-0">
            {/* Eyebrow e título do encontro */}
            <div className="flex items-center gap-2 min-w-0 shrink-0">
              <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] shrink-0">
                Guia Encontro 2
              </span>
              <span
                className="text-slate-300 dark:text-white/20 hidden sm:inline"
                aria-hidden="true"
              >
                •
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 truncate max-w-[140px] md:max-w-xs hidden sm:inline">
                Do sentido ao mercado
              </span>
            </div>

            {/* Abas desktop/tablet: scroll horizontal discreto, respiro confortável, item ativo destacado */}
            <div
              className="hidden md:flex items-center gap-1 overflow-x-auto min-w-0 py-0.5 px-1 scroll-smooth"
              style={{ scrollbarWidth: 'thin' }}
            >
              {SECOES_GUIA.map((sec) => {
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
                    {SECOES_GUIA.find((s) => s.id === activeSectionId)?.short || 'Índice'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                </Button>

                {mobileMenuOpen && (
                  <div className="absolute right-0 top-11 w-64 p-2 rounded-[10px] bg-white dark:bg-[#0D0522] border border-slate-200 dark:border-white/[0.12] shadow-xl z-40 flex flex-col gap-1">
                    <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Seções do Guia
                    </span>
                    {SECOES_GUIA.map((sec) => {
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

              {/* Botão de Modo Aula: rótulo visível sempre, ícone nítido, sem corte */}
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

          {/* Barra de progresso discreta das seções (hairline 1px, separada visualmente das abas e dos botões) */}
          <div
            className="w-full h-0.5 bg-slate-200/70 dark:bg-white/[0.06] rounded-full overflow-hidden"
            aria-hidden="true"
          >
            {(() => {
              const activeIdx = Math.max(
                0,
                SECOES_GUIA.findIndex((s) => s.id === activeSectionId),
              )
              const pct = Math.round(((activeIdx + 1) / SECOES_GUIA.length) * 100)
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
              Academia Método FAC · Fundação · Encontro 2
            </Badge>
            <span className="text-editorial-tertiary">•</span>
            <span className="text-editorial-secondary font-semibold">
              Terça, 13/10/2026, às 19h (ao vivo)
            </span>
          </div>

          <Badge
            variant="outline"
            className="text-[11px] font-mono border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5"
          >
            Guia de Consulta
          </Badge>
        </div>

        <div className="space-y-4">
          <h1 className="h-display font-medium tracking-tight text-editorial-primary leading-[1.05]">
            Do sentido ao{' '}
            <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
              mercado
            </em>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-editorial-secondary leading-relaxed font-light max-w-4xl">
            Hoje você investiga o seu mercado com buscas reais, escolhe a sua brecha, define o seu
            público e sai com o seu relatório de posicionamento. Tudo construído no ChatGPT, com as
            skills da Academia.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
            Você vai sair com:
          </span>
          <p className="text-sm sm:text-base text-editorial-primary font-medium leading-relaxed">
            Raio X do nicho · brecha escolhida · público-alvo · relatório de posicionamento.
          </p>
        </div>
      </header>

      {/* SEÇÃO 1 · ANTES DE COMEÇAR */}
      <section
        id="secao-1"
        className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7 shadow-xs scroll-mt-28 transition-all"
      >
        <button
          type="button"
          onClick={() => toggleSection('secao-1')}
          aria-expanded={openSections['secao-1']}
          aria-controls="conteudo-secao-1"
          className="w-full text-left border-b border-slate-200/80 dark:border-[#27272A] pb-4 min-h-[44px] flex items-center justify-between gap-4 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[8px]"
        >
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              SEÇÃO 1
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1 group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
              Antes de{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                começar
              </em>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-editorial-secondary shrink-0">
            <span className="hidden sm:inline">
              {openSections['secao-1'] ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#18181B] group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 flex items-center justify-center transition-colors">
              {openSections['secao-1'] ? (
                <ChevronUp className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              )}
            </span>
          </div>
        </button>

        {openSections['secao-1'] && (
          <div id="conteudo-secao-1" className="space-y-7">
            {/* Checklist marcável */}
            <div className="space-y-4">
              <p className="text-xs font-mono text-editorial-secondary uppercase tracking-wider font-semibold">
                Checklist preparatório (salvo no seu navegador):
              </p>

              <div className="space-y-3">
                {/* Item 1 */}
                <div className="p-4 sm:p-4.5 rounded-[12px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="flex items-start sm:items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.frasePeca3}
                      onChange={() => toggleCheck('frasePeca3')}
                      className="w-5 h-5 rounded-[4px] accent-[#7c3aed] text-white cursor-pointer mt-0.5 sm:mt-0"
                    />
                    <span
                      className={`text-sm sm:text-base leading-relaxed ${
                        checklist.frasePeca3
                          ? 'text-editorial-primary line-through opacity-70'
                          : 'text-editorial-primary font-medium'
                      }`}
                    >
                      Tenho a minha frase de direção da Peça 3 à mão.
                    </span>
                  </label>

                  {LINK_PECA_3 && (
                    <Link
                      to={LINK_PECA_3}
                      className="text-xs font-mono text-[#7c3aed] dark:text-[#C084FC] hover:underline inline-flex items-center gap-1 shrink-0 self-start sm:self-auto pl-8 sm:pl-0"
                    >
                      <span>Ainda não fiz a Peça 3</span>
                      <ArrowRight className="w-3 h-3 ml-0.5" />
                    </Link>
                  )}
                </div>

                {/* Item 2 */}
                <div className="p-4 sm:p-4.5 rounded-[12px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] flex items-center justify-between gap-3">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.contaChatGpt}
                      onChange={() => toggleCheck('contaChatGpt')}
                      className="w-5 h-5 rounded-[4px] accent-[#7c3aed] text-white cursor-pointer"
                    />
                    <span
                      className={`text-sm sm:text-base leading-relaxed ${
                        checklist.contaChatGpt
                          ? 'text-editorial-primary line-through opacity-70'
                          : 'text-editorial-primary font-medium'
                      }`}
                    >
                      Criei a minha conta no ChatGPT (seção 2).
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleScrollTo('secao-2')}
                    className="text-xs font-mono text-editorial-secondary hover:text-[#7c3aed] dark:hover:text-[#C084FC] underline cursor-pointer shrink-0"
                  >
                    Ver seção 2
                  </button>
                </div>

                {/* Item 3 */}
                <div className="p-4 sm:p-4.5 rounded-[12px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] flex items-center justify-between gap-3">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.skillsOuPlanoB}
                      onChange={() => toggleCheck('skillsOuPlanoB')}
                      className="w-5 h-5 rounded-[4px] accent-[#7c3aed] text-white cursor-pointer"
                    />
                    <span
                      className={`text-sm sm:text-base leading-relaxed ${
                        checklist.skillsOuPlanoB
                          ? 'text-editorial-primary line-through opacity-70'
                          : 'text-editorial-primary font-medium'
                      }`}
                    >
                      Baixei e importei as duas skills, ou estou com o Plano B à mão (seção 4).
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleScrollTo('secao-4')}
                    className="text-xs font-mono text-editorial-secondary hover:text-[#7c3aed] dark:hover:text-[#C084FC] underline cursor-pointer shrink-0"
                  >
                    Ver seção 4
                  </button>
                </div>

                {/* Item 4 */}
                <div className="p-4 sm:p-4.5 rounded-[12px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] flex items-center justify-between gap-3">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.respostasDetetive}
                      onChange={() => toggleCheck('respostasDetetive')}
                      className="w-5 h-5 rounded-[4px] accent-[#7c3aed] text-white cursor-pointer"
                    />
                    <span
                      className={`text-sm sm:text-base leading-relaxed ${
                        checklist.respostasDetetive
                          ? 'text-editorial-primary line-through opacity-70'
                          : 'text-editorial-primary font-medium'
                      }`}
                    >
                      Escrevi as respostas para as três perguntas do Radar Detetive (seção 5).
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleScrollTo('secao-5')}
                    className="text-xs font-mono text-editorial-secondary hover:text-[#7c3aed] dark:hover:text-[#C084FC] underline cursor-pointer shrink-0"
                  >
                    Ver seção 5
                  </button>
                </div>
              </div>
            </div>

            {/* Caixa de cuidado fixa */}
            <div className="p-4 sm:p-5 rounded-[12px] bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs sm:text-sm text-amber-950 dark:text-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="font-light leading-relaxed">
                <strong className="font-semibold font-sans text-amber-900 dark:text-amber-100">
                  Cuidado com privacidade:{' '}
                </strong>
                Em nenhuma etapa escreva nome ou detalhe que identifique quem você atende.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* SEÇÃO 2 · SUA CONTA NO CHATGPT */}
      <section
        id="secao-2"
        className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7 shadow-xs scroll-mt-28 transition-all"
      >
        <button
          type="button"
          onClick={() => toggleSection('secao-2')}
          aria-expanded={openSections['secao-2']}
          aria-controls="conteudo-secao-2"
          className="w-full text-left border-b border-slate-200/80 dark:border-[#27272A] pb-4 min-h-[44px] flex items-center justify-between gap-4 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[8px]"
        >
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              SEÇÃO 2
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1 group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
              Sua conta no{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                ChatGPT
              </em>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-editorial-secondary shrink-0">
            <span className="hidden sm:inline">
              {openSections['secao-2'] ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#18181B] group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 flex items-center justify-center transition-colors">
              {openSections['secao-2'] ? (
                <ChevronUp className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              )}
            </span>
          </div>
        </button>

        {openSections['secao-2'] && (
          <div id="conteudo-secao-2" className="space-y-7">
            <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed font-light">
              As ferramentas de hoje rodam dentro do ChatGPT. Se você já tem conta, confira só o
              último passo.
            </p>

            {/* Passo a passo numerado (1 a 6) com captura correspondente se existir */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Passo 1 */}
              <div className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h3 className="text-xs font-mono font-semibold text-editorial-secondary uppercase">
                    Passo 1
                  </h3>
                </div>
                <p className="text-sm sm:text-[15px] text-editorial-primary leading-relaxed font-light">
                  Acesse{' '}
                  <a
                    href="https://chatgpt.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#7c3aed] dark:text-[#C084FC] hover:underline"
                  >
                    chatgpt.com
                  </a>{' '}
                  no navegador do computador ou baixe o app oficial do ChatGPT na loja do seu
                  celular. Cuidado com aplicativos de nomes parecidos: o oficial é da OpenAI.
                </p>
                {filesStatus.contaPrints[1] && (
                  <img
                    src="/images/encontro-2/prints/conta-1.png"
                    alt="Passo 1 da criação da conta no ChatGPT"
                    className="w-full rounded-[8px] border border-slate-200 dark:border-[#27272A] mt-2"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Passo 2 */}
              <div className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h3 className="text-xs font-mono font-semibold text-editorial-secondary uppercase">
                    Passo 2
                  </h3>
                </div>
                <p className="text-sm sm:text-[15px] text-editorial-primary leading-relaxed font-light">
                  Toque no botão de criar conta, como mostra a imagem.
                </p>
                {filesStatus.contaPrints[2] && (
                  <img
                    src="/images/encontro-2/prints/conta-2.png"
                    alt="Passo 2 da criação da conta no ChatGPT"
                    className="w-full rounded-[8px] border border-slate-200 dark:border-[#27272A] mt-2"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Passo 3 */}
              <div className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h3 className="text-xs font-mono font-semibold text-editorial-secondary uppercase">
                    Passo 3
                  </h3>
                </div>
                <p className="text-sm sm:text-[15px] text-editorial-primary leading-relaxed font-light">
                  Entre com o seu e-mail ou com a sua conta Google.
                </p>
                {filesStatus.contaPrints[3] && (
                  <img
                    src="/images/encontro-2/prints/conta-3.png"
                    alt="Passo 3 da criação da conta no ChatGPT"
                    className="w-full rounded-[8px] border border-slate-200 dark:border-[#27272A] mt-2"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Passo 4 */}
              <div className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <h3 className="text-xs font-mono font-semibold text-editorial-secondary uppercase">
                    Passo 4
                  </h3>
                </div>
                <p className="text-sm sm:text-[15px] text-editorial-primary leading-relaxed font-light">
                  Confirme o e-mail, se for pedido, e preencha nome e data de nascimento.
                </p>
                {filesStatus.contaPrints[4] && (
                  <img
                    src="/images/encontro-2/prints/conta-4.png"
                    alt="Passo 4 da criação da conta no ChatGPT"
                    className="w-full rounded-[8px] border border-slate-200 dark:border-[#27272A] mt-2"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Passo 5 */}
              <div className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    5
                  </span>
                  <h3 className="text-xs font-mono font-semibold text-editorial-secondary uppercase">
                    Passo 5
                  </h3>
                </div>
                <p className="text-sm sm:text-[15px] text-editorial-primary leading-relaxed font-light">
                  Pronto: você está na tela de conversa.
                </p>
                {filesStatus.contaPrints[5] && (
                  <img
                    src="/images/encontro-2/prints/conta-5.png"
                    alt="Passo 5 da criação da conta no ChatGPT"
                    className="w-full rounded-[8px] border border-slate-200 dark:border-[#27272A] mt-2"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Passo 6 */}
              <div className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    6
                  </span>
                  <h3 className="text-xs font-mono font-semibold text-editorial-secondary uppercase">
                    Passo 6
                  </h3>
                </div>
                <p className="text-sm sm:text-[15px] text-editorial-primary leading-relaxed font-light">
                  Confira a busca na internet: a investigação de hoje depende de buscas reais. A
                  imagem mostra onde ela fica.
                </p>
                {filesStatus.contaPrints[6] && (
                  <img
                    src="/images/encontro-2/prints/conta-6.png"
                    alt="Passo 6 da criação da conta no ChatGPT"
                    className="w-full rounded-[8px] border border-slate-200 dark:border-[#27272A] mt-2"
                    loading="lazy"
                  />
                )}
              </div>
            </div>

            {/* Caixa "Gratuito ou pago?" */}
            <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                Gratuito ou pago?
              </span>
              <p className="text-sm sm:text-base text-editorial-primary leading-relaxed font-light">
                Para o encontro de hoje, a conta gratuita serve para começar. Alguns recursos, como
                importar skills, podem exigir o plano pago. Se a sua conta não permitir importar,
                use o Plano B da seção 4, que funciona em qualquer conta.
              </p>
            </div>

            {/* Bloco expansível de apoio com orientações detalhadas (mantido de 0.0.90) */}
            <div className="border border-slate-200 dark:border-[#27272A] rounded-[14px] overflow-hidden">
              <button
                type="button"
                onClick={() => setOrientacoesCompletasOpen((prev) => !prev)}
                className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-[#0c0914] flex items-center justify-between text-left cursor-pointer hover:bg-slate-100 dark:hover:bg-[#18181B] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                  <span className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
                    Ver orientações completas do cadastro
                  </span>
                </div>
                {orientacoesCompletasOpen ? (
                  <ChevronUp className="w-4 h-4 text-editorial-secondary" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-editorial-secondary" />
                )}
              </button>

              {orientacoesCompletasOpen && (
                <div className="p-5 sm:p-6 space-y-4 bg-white dark:bg-[#121216] border-t border-slate-200 dark:border-[#27272A] text-xs sm:text-sm font-light text-editorial-secondary leading-relaxed">
                  <p>
                    <strong>Passo 1 oficial:</strong> No computador, abra chatgpt.com. No celular,
                    baixe o app oficial ChatGPT publicado pela OpenAI.
                  </p>
                  <p>
                    <strong>Passo 2 oficial:</strong> Selecione "Criar conta" (ou "Cadastre-se" /
                    "Sign up"). Se já tem cadastro anterior, clique em "Entrar".
                  </p>
                  <p>
                    <strong>Passo 3 oficial:</strong> Você pode usar seu e-mail habitual ou opções
                    como "Continuar com Google", "Continuar com Apple" ou Microsoft. Guarde a opção
                    escolhida.
                  </p>
                  <p>
                    <strong>Passo 4 oficial:</strong> Se solicitado, abra sua caixa postal para
                    validar o link de confirmação e informe data de nascimento.
                  </p>
                  <p>
                    <strong>Passo 5 oficial:</strong> A tela inicial de diálogo aparecerá pronta
                    para receber comandos e textos.
                  </p>
                  <p>
                    <strong>Passo 6 oficial:</strong> Para testar a busca ativa, clique no ícone de
                    globo terrestre ou digite uma pergunta pedindo fonte na web.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* SEÇÃO 3 · A TEORIA DO ENCONTRO */}
      <section
        id="secao-3"
        className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-10 shadow-xs scroll-mt-28 transition-all"
      >
        <button
          type="button"
          onClick={() => toggleSection('secao-3')}
          aria-expanded={openSections['secao-3']}
          aria-controls="conteudo-secao-3"
          className="w-full text-left border-b border-slate-200/80 dark:border-[#27272A] pb-4 min-h-[44px] flex items-center justify-between gap-4 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[8px]"
        >
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              SEÇÃO 3
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1 group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
              A{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                teoria
              </em>{' '}
              do encontro
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-editorial-secondary shrink-0">
            <span className="hidden sm:inline">
              {openSections['secao-3'] ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#18181B] group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 flex items-center justify-center transition-colors">
              {openSections['secao-3'] ? (
                <ChevronUp className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              )}
            </span>
          </div>
        </button>

        {openSections['secao-3'] && (
          <div id="conteudo-secao-3" className="space-y-10">
            <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed font-light">
              Resumo dos slides, para você consultar enquanto trabalha no ChatGPT.
            </p>

            {/* Bloco 1 · O funil */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                  Bloco 1 · O funil
                </h3>
                <span className="text-xs font-mono text-editorial-secondary">
                  Toque na imagem para ampliar
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setModalImage({
                    src: '/images/encontro-2/funil-marketing.svg',
                    alt: 'Funil em três etapas. Topo do funil: pessoas que te encontram e seguidoras e contatos, que descobrem o tema e reconhecem o problema. Meio do funil: interessadas, que consideram a terapia. Fundo do funil: pacientes, que decidem agendar.',
                    title: 'O funil de marketing da clínica',
                  })
                }
                className="w-full text-left group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[16px] overflow-hidden"
              >
                <div className="p-3 sm:p-4 rounded-[16px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200 dark:border-[#27272A] transition-all group-hover:border-[#7c3aed]">
                  <img
                    src="/images/encontro-2/funil-marketing.svg"
                    alt="Funil em três etapas. Topo do funil: pessoas que te encontram e seguidoras e contatos, que descobrem o tema e reconhecem o problema. Meio do funil: interessadas, que consideram a terapia. Fundo do funil: pacientes, que decidem agendar."
                    className="w-full h-auto max-h-[380px] object-contain mx-auto"
                    loading="lazy"
                  />
                  <span className="block text-center text-xs font-mono text-editorial-secondary mt-2 group-hover:text-[#7c3aed] transition-colors">
                    Ampliar em tela cheia
                  </span>
                </div>
              </button>

              {/* Tabela do funil (versão em texto) */}
              <div className="overflow-x-auto rounded-[12px] border border-slate-200 dark:border-[#27272A]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100/80 dark:bg-[#18181B] text-editorial-primary font-mono font-semibold border-b border-slate-200 dark:border-[#27272A]">
                      <th className="p-3 sm:p-3.5">Etapa</th>
                      <th className="p-3 sm:p-3.5">Estado da pessoa</th>
                      <th className="p-3 sm:p-3.5">O que ela precisa receber</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#27272A] font-light text-editorial-primary">
                    <tr className="bg-white dark:bg-[#121216]">
                      <td className="p-3 sm:p-3.5 font-mono font-semibold text-[#7c3aed] dark:text-[#C084FC]">
                        Topo
                      </td>
                      <td className="p-3 sm:p-3.5">Sente o sintoma, não nomeia o problema</td>
                      <td className="p-3 sm:p-3.5">Conteúdo que nomeia a dor</td>
                    </tr>
                    <tr className="bg-slate-50/50 dark:bg-[#0c0914]">
                      <td className="p-3 sm:p-3.5 font-mono font-semibold text-[#7c3aed] dark:text-[#C084FC]">
                        Meio
                      </td>
                      <td className="p-3 sm:p-3.5">Sabe que tem um problema, pesquisa soluções</td>
                      <td className="p-3 sm:p-3.5">Autoridade, confiança, comparação</td>
                    </tr>
                    <tr className="bg-white dark:bg-[#121216]">
                      <td className="p-3 sm:p-3.5 font-mono font-semibold text-[#7c3aed] dark:text-[#C084FC]">
                        Fundo
                      </td>
                      <td className="p-3 sm:p-3.5">Pronta para decidir</td>
                      <td className="p-3 sm:p-3.5">Caminho simples para agendar</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bloco 2 · Os 5 níveis de consciência */}
            <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-[#27272A]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                  Bloco 2 · Os 5 níveis de consciência
                </h3>
                <span className="text-xs font-mono text-editorial-secondary">
                  Toque na imagem para ampliar
                </span>
              </div>

              <p className="text-xs sm:text-sm text-editorial-secondary font-light">
                Um modelo clássico do marketing (Eugene Schwartz) que detalha o funil em cinco
                degraus.
              </p>

              <button
                type="button"
                onClick={() =>
                  setModalImage({
                    src: '/images/encontro-2/niveis-consciencia.svg',
                    alt: 'Os 5 níveis de consciência do paciente: 1 inconsciente do problema, 2 consciente do problema, 3 consciente da solução, 4 consciente do serviço, 5 pronta para agendar.',
                    title: 'Os 5 níveis de consciência de Eugene Schwartz',
                  })
                }
                className="w-full text-left group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[16px] overflow-hidden"
              >
                <div className="p-3 sm:p-4 rounded-[16px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200 dark:border-[#27272A] transition-all group-hover:border-[#7c3aed]">
                  <img
                    src="/images/encontro-2/niveis-consciencia.svg"
                    alt="Os 5 níveis de consciência do paciente: 1 inconsciente do problema, 2 consciente do problema, 3 consciente da solução, 4 consciente do serviço, 5 pronta para agendar."
                    className="w-full h-auto max-h-[380px] object-contain mx-auto"
                    loading="lazy"
                  />
                  <span className="block text-center text-xs font-mono text-editorial-secondary mt-2 group-hover:text-[#7c3aed] transition-colors">
                    Ampliar em tela cheia
                  </span>
                </div>
              </button>

              {/* Versão em texto dos 5 níveis */}
              <div className="space-y-2.5">
                {[
                  { n: 1, titulo: 'Inconsciente do problema', fala: 'Eu só sou assim.' },
                  { n: 2, titulo: 'Consciente do problema', fala: 'Não consigo mais dormir.' },
                  { n: 3, titulo: 'Consciente da solução', fala: 'Acho que terapia pode ajudar.' },
                  {
                    n: 4,
                    titulo: 'Consciente do serviço',
                    fala: 'Vi o perfil dela, mas é para mim?',
                  },
                  { n: 5, titulo: 'Pronta para agendar', fala: 'Qual o valor e o horário?' },
                ].map((nv) => (
                  <div
                    key={nv.n}
                    className="p-3 sm:p-4 rounded-[12px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {nv.n}
                    </span>
                    <div>
                      <h4 className="font-sans font-semibold text-xs sm:text-sm text-editorial-primary">
                        {nv.n}. {nv.titulo}
                      </h4>
                      <p className="text-xs sm:text-sm text-editorial-secondary italic font-serif-editorial">
                        &ldquo;{nv.fala}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-[10px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200 dark:border-[#27272A] font-mono text-xs text-editorial-secondary text-center">
                No funil: topo = níveis 1 e 2 · meio = níveis 3 e 4 · fundo = nível 5.
              </div>
            </div>

            {/* Bloco 3 · O que cada nível pede de você */}
            <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-[#27272A]">
              <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                Bloco 3 · O que cada nível pede de você
              </h3>

              <div className="overflow-x-auto rounded-[12px] border border-slate-200 dark:border-[#27272A]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100/80 dark:bg-[#18181B] text-editorial-primary font-mono font-semibold border-b border-slate-200 dark:border-[#27272A]">
                      <th className="p-3 sm:p-3.5 w-16 text-center">Nível</th>
                      <th className="p-3 sm:p-3.5">Erro comum</th>
                      <th className="p-3 sm:p-3.5">O que funciona</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#27272A] font-light text-editorial-primary">
                    <tr className="bg-white dark:bg-[#121216]">
                      <td className="p-3 sm:p-3.5 font-mono font-bold text-center text-[#7c3aed] dark:text-[#C084FC]">
                        1
                      </td>
                      <td className="p-3 sm:p-3.5">Falar de terapia</td>
                      <td className="p-3 sm:p-3.5 font-medium">
                        Nomear o que a pessoa vive sem saber que tem nome
                      </td>
                    </tr>
                    <tr className="bg-slate-50/50 dark:bg-[#0c0914]">
                      <td className="p-3 sm:p-3.5 font-mono font-bold text-center text-[#7c3aed] dark:text-[#C084FC]">
                        2
                      </td>
                      <td className="p-3 sm:p-3.5">Falar de você</td>
                      <td className="p-3 sm:p-3.5 font-medium">Falar do problema com precisão</td>
                    </tr>
                    <tr className="bg-white dark:bg-[#121216]">
                      <td className="p-3 sm:p-3.5 font-mono font-bold text-center text-[#7c3aed] dark:text-[#C084FC]">
                        3
                      </td>
                      <td className="p-3 sm:p-3.5">Explicar abordagem teórica</td>
                      <td className="p-3 sm:p-3.5 font-medium">
                        Mostrar como a terapia ajuda nesse problema
                      </td>
                    </tr>
                    <tr className="bg-slate-50/50 dark:bg-[#0c0914]">
                      <td className="p-3 sm:p-3.5 font-mono font-bold text-center text-[#7c3aed] dark:text-[#C084FC]">
                        4
                      </td>
                      <td className="p-3 sm:p-3.5">Ficar genérica</td>
                      <td className="p-3 sm:p-3.5 font-medium">
                        Mostrar por que você e para quem é
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-[#121216]">
                      <td className="p-3 sm:p-3.5 font-mono font-bold text-center text-[#7c3aed] dark:text-[#C084FC]">
                        5
                      </td>
                      <td className="p-3 sm:p-3.5">Dificultar o contato</td>
                      <td className="p-3 sm:p-3.5 font-medium">Dar um caminho simples e claro</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bloco 4 · Definindo o público-alvo */}
            <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-[#27272A]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                  Bloco 4 · Definindo o público-alvo
                </h3>
                <span className="text-xs font-mono font-semibold text-[#7c3aed] dark:text-[#C084FC]">
                  Responda pelo menos duas categorias.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                    Faixa etária
                  </span>
                  <p className="text-xs sm:text-sm text-editorial-primary font-light">
                    crianças e adolescentes · adultos jovens · adultos · pessoas idosas
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                    Macroárea
                  </span>
                  <p className="text-xs sm:text-sm text-editorial-primary font-light">
                    saúde emocional · relacionamentos · carreira e trabalho
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                    Tipo de atendimento
                  </span>
                  <p className="text-xs sm:text-sm text-editorial-primary font-light">
                    individual · casal · família · grupo
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                    Contexto específico
                  </span>
                  <p className="text-xs sm:text-sm text-editorial-primary font-light">
                    perinatal, luto, esporte, organizacional, entre outros
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-[14px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200/80 dark:border-[#27272A] space-y-1.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-editorial-secondary block">
                  Exemplo:
                </span>
                <p className="font-serif-editorial text-sm sm:text-base text-editorial-primary italic leading-relaxed">
                  &ldquo;Mulheres adultas, em sofrimento ligado ao trabalho, em atendimento
                  individual e em grupo, no retorno da licença-maternidade.&rdquo;
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/60 dark:bg-purple-950/20 border-l-4 border-l-[#7c3aed] dark:border-l-[#C084FC] border-y border-r border-purple-100 dark:border-purple-900/30">
                <p className="font-serif-editorial text-base sm:text-lg md:text-xl text-editorial-primary font-normal italic leading-relaxed">
                  &ldquo;Ao ler o seu Raio X, pergunte: com qual nível de consciência os meus
                  concorrentes falam? O nível que ninguém atende costuma ser a sua brecha.&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEÇÃO 4 · BAIXE E IMPORTE AS SKILLS */}
      <section
        id="secao-4"
        className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-8 shadow-xs scroll-mt-28 transition-all"
      >
        <button
          type="button"
          onClick={() => toggleSection('secao-4')}
          aria-expanded={openSections['secao-4']}
          aria-controls="conteudo-secao-4"
          className="w-full text-left border-b border-slate-200/80 dark:border-[#27272A] pb-4 min-h-[44px] flex items-center justify-between gap-4 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[8px]"
        >
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              SEÇÃO 4
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1 group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
              Baixe e importe as{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                skills
              </em>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-editorial-secondary shrink-0">
            <span className="hidden sm:inline">
              {openSections['secao-4'] ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#18181B] group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 flex items-center justify-center transition-colors">
              {openSections['secao-4'] ? (
                <ChevronUp className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              )}
            </span>
          </div>
        </button>

        {openSections['secao-4'] && (
          <div id="conteudo-secao-4" className="space-y-8">
            <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed font-light">
              Skills são ferramentas prontas que ensinam o ChatGPT a fazer um trabalho do jeito da
              Entrelaços. Use os cartões abaixo para baixar os plugins ou ativar pelo Plano B.
            </p>

            {/* TRÊS CARTÕES DE SKILL: CARTÃO 1 = Radar Detetive; CARTÃO 2 = Estrategista de Posicionamento; CARTÃO 3 = Manifesto da Marca */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CARTÃO 1 (Numerado 1): Radar Detetive */}
              <div className="p-6 sm:p-7 rounded-[16px] border border-slate-200 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#7c3aed] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <Search className="w-5 h-5 text-[#7c3aed] dark:text-[#C084FC]" />
                    <h3 className="font-sans font-semibold text-lg text-editorial-primary">
                      Cartão 1 · Radar Detetive
                    </h3>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm text-editorial-secondary font-light leading-relaxed">
                    <p>
                      <strong className="font-semibold text-editorial-primary font-sans">
                        O que é:{' '}
                      </strong>
                      um investigador de mercado que faz buscas reais na internet, narra o que
                      encontra nas Notas do detetive e entrega o Raio X do nicho.
                    </p>
                    <p>
                      <strong className="font-semibold text-editorial-primary font-sans">
                        O que entrega:{' '}
                      </strong>
                      quem manda no seu mercado, quanto cobram, o que o público sente, 3 brechas, 3
                      ângulos de ataque e os temas quentes. Todo dado etiquetado. O que não achou,
                      ele diz.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-200/80 dark:border-[#27272A]">
                  {/* Botão Principal: Baixar para o ChatGPT com largura total */}
                  <Button
                    type="button"
                    size="sm"
                    disabled={!filesStatus.radarGptZip || downloadingSkill === 'radar-chatgpt'}
                    onClick={() =>
                      handleDownloadSkill('radar', '/skills/encontro-2/radar-detetive-chatgpt.zip')
                    }
                    className="w-full font-mono text-xs rounded-[8px] min-h-[42px] justify-center gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {downloadingSkill === 'radar-chatgpt'
                        ? 'Baixando...'
                        : filesStatus.radarGptZip
                          ? 'Baixar para o ChatGPT'
                          : 'Disponível em breve'}
                    </span>
                  </Button>

                  {/* Botão Plano B da Skill 1 */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!filesStatus.radarMd}
                    onClick={() =>
                      handleCopySkillText('radar', '/skills/encontro-2/radar-detetive.md')
                    }
                    className="w-full font-mono text-xs rounded-[8px] min-h-[40px] gap-1.5 border-purple-200 dark:border-purple-900/60 text-[#7c3aed] dark:text-[#C084FC] bg-white dark:bg-[#18181B] disabled:opacity-50 cursor-pointer"
                  >
                    {copiedSkill1 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Texto da skill copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>
                          {filesStatus.radarMd ? 'Copiar o texto da skill' : 'Disponível em breve'}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* CARTÃO 2 (Numerado 2): Estrategista de Posicionamento */}
              <div className="p-6 sm:p-7 rounded-[16px] border border-slate-200 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#7c3aed] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <Target className="w-5 h-5 text-[#ea580c] dark:text-[#FB923C]" />
                    <h3 className="font-sans font-semibold text-lg text-editorial-primary">
                      Cartão 2 · Estrategista de Posicionamento
                    </h3>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm text-editorial-secondary font-light leading-relaxed">
                    <p>
                      <strong className="font-semibold text-editorial-primary font-sans">
                        O que é:{' '}
                      </strong>
                      uma mentoria rápida de mercado que usa a sua frase de direção e o seu Raio X
                      para confrontar o que estiver vago e entregar a sua direção.
                    </p>
                    <p>
                      <strong className="font-semibold text-editorial-primary font-sans">
                        O que entrega:{' '}
                      </strong>
                      o Relatório de posicionamento, com quem você é, para quem fala, a sua tese,
                      onde você entra no mercado, o que oferecer primeiro e um plano com data.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-200/80 dark:border-[#27272A]">
                  {/* Botão Principal: Baixar para o ChatGPT com largura total */}
                  <Button
                    type="button"
                    size="sm"
                    disabled={
                      !filesStatus.estrategistaGptZip || downloadingSkill === 'estrategista-chatgpt'
                    }
                    onClick={() =>
                      handleDownloadSkill(
                        'estrategista',
                        '/skills/encontro-2/estrategista-de-posicionamento-chatgpt.zip',
                      )
                    }
                    className="w-full font-mono text-xs rounded-[8px] min-h-[42px] justify-center gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {downloadingSkill === 'estrategista-chatgpt'
                        ? 'Baixando...'
                        : filesStatus.estrategistaGptZip
                          ? 'Baixar para o ChatGPT'
                          : 'Disponível em breve'}
                    </span>
                  </Button>

                  {/* Botão Plano B da Skill 2 */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!filesStatus.estrategistaMd}
                    onClick={() =>
                      handleCopySkillText(
                        'estrategista',
                        '/skills/encontro-2/estrategista-de-posicionamento.md',
                      )
                    }
                    className="w-full font-mono text-xs rounded-[8px] min-h-[40px] gap-1.5 border-purple-200 dark:border-purple-900/60 text-[#7c3aed] dark:text-[#C084FC] bg-white dark:bg-[#18181B] disabled:opacity-50 cursor-pointer"
                  >
                    {copiedSkill2 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Texto da skill copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>
                          {filesStatus.estrategistaMd
                            ? 'Copiar o texto da skill'
                            : 'Disponível em breve'}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* CARTÃO 3 (Numerado 3): Manifesto da Marca */}
              <div className="p-6 sm:p-7 rounded-[16px] border border-slate-200 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] flex flex-col justify-between gap-6 md:col-span-2 lg:col-span-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#7c3aed] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <Sparkles className="w-5 h-5 text-[#7c3aed] dark:text-[#C084FC]" />
                    <h3 className="font-sans font-semibold text-lg text-editorial-primary">
                      Cartão 3 · Manifesto da Marca
                    </h3>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm text-editorial-secondary font-light leading-relaxed">
                    <p>
                      <strong className="font-semibold text-editorial-primary font-sans">
                        O que é:{' '}
                      </strong>
                      uma declaração das convicções que orientam seu negócio: o que ele acredita,
                      por que existe, que realidade deseja transformar e como escolhe agir.
                    </p>
                    <p>
                      <strong className="font-semibold text-editorial-primary font-sans">
                        O que entrega:{' '}
                      </strong>
                      as diretrizes estratégicas que transformam ideias abstratas em escolhas
                      reconhecíveis, alinhando produtos, comunicação, equipe e cuidado.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-200/80 dark:border-[#27272A]">
                  {/* Botão Principal: Baixar para o ChatGPT com largura total */}
                  <Button
                    type="button"
                    size="sm"
                    disabled={
                      !filesStatus.manifestoGptZip || downloadingSkill === 'manifesto-chatgpt'
                    }
                    onClick={() =>
                      handleDownloadSkill(
                        'manifesto',
                        '/skills/encontro-2/manifesto-da-marca-chatgpt.zip',
                      )
                    }
                    className="w-full font-mono text-xs rounded-[8px] min-h-[42px] justify-center gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {downloadingSkill === 'manifesto-chatgpt'
                        ? 'Baixando...'
                        : filesStatus.manifestoGptZip
                          ? 'Baixar para o ChatGPT'
                          : 'Disponível em breve'}
                    </span>
                  </Button>

                  {/* Botão Plano B da Skill 3 */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!filesStatus.manifestoMd}
                    onClick={() =>
                      handleCopySkillText('manifesto', '/skills/encontro-2/manifesto-da-marca.md')
                    }
                    className="w-full font-mono text-xs rounded-[8px] min-h-[40px] gap-1.5 border-purple-200 dark:border-purple-900/60 text-[#7c3aed] dark:text-[#C084FC] bg-white dark:bg-[#18181B] disabled:opacity-50 cursor-pointer"
                  >
                    {copiedSkill3 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Texto da skill copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>
                          {filesStatus.manifestoMd
                            ? 'Copiar o texto da skill'
                            : 'Disponível em breve'}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* MATERIAL TEÓRICO INTEGRAL DO MANIFESTO DA MARCA */}
            <ManifestoTeoriaBloco />

            {/* Como importar no ChatGPT */}
            <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-[#27272A]">
              <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                Como importar no ChatGPT
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    n: 1,
                    txt: "Baixe o arquivo 'para o ChatGPT' no seu computador. Não abra nem descompacte o arquivo.",
                  },
                  {
                    n: 2,
                    txt: 'No ChatGPT, abra a área de plugins, como mostra a imagem.',
                  },
                  {
                    n: 3,
                    txt: 'Escolha adicionar um novo plugin e selecione o arquivo .zip que você baixou.',
                  },
                  {
                    n: 4,
                    txt: 'Repita para a segunda skill.',
                  },
                  {
                    n: 5,
                    txt: 'Confira se o Radar Detetive e o Estrategista de Posicionamento aparecem na sua lista.',
                  },
                ].map((p) => (
                  <div
                    key={p.n}
                    className={`p-4 sm:p-5 rounded-[12px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/50 dark:bg-[#0c0914] space-y-2.5 ${
                      p.n === 5 ? 'md:col-span-2' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-[11px] font-bold flex items-center justify-center">
                        {p.n}
                      </span>
                      <span className="text-xs font-mono font-semibold text-editorial-secondary">
                        Passo {p.n}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-editorial-primary font-light leading-relaxed">
                      {p.txt}
                    </p>
                    {filesStatus.gptPrints[p.n] && (
                      <img
                        src={`/images/encontro-2/prints/importar-chatgpt-${p.n}.png`}
                        alt={`Passo ${p.n} da importação no ChatGPT`}
                        className="w-full rounded-[8px] border border-slate-200 dark:border-[#27272A] mt-2"
                        loading="lazy"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-[12px] bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs sm:text-sm text-amber-950 dark:text-amber-200">
                <strong>Aviso:</strong> A importação funciona melhor pelo computador. Pelo celular,
                use o Plano B.
              </div>
            </div>

            {/* Plano B (bloco destacado) */}
            <div className="p-6 sm:p-7 rounded-[16px] bg-purple-50/70 dark:bg-purple-950/25 border border-purple-200 dark:border-[#7c3aed]/40 space-y-4">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                  Plano B: funciona em qualquer conta e no celular
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-editorial-primary font-light leading-relaxed">
                <p>1. Toque em &ldquo;Copiar o texto da skill&rdquo; no cartão da skill.</p>
                <p>2. Abra uma conversa nova no ChatGPT.</p>
                <p>3. Cole o texto e escreva logo abaixo: &ldquo;Siga estas instruções.&rdquo;</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEÇÃO 5 · COMO USAR AS SKILLS NO CHATGPT */}
      <section
        id="secao-5"
        className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-8 shadow-xs scroll-mt-28 transition-all"
      >
        <button
          type="button"
          onClick={() => toggleSection('secao-5')}
          aria-expanded={openSections['secao-5']}
          aria-controls="conteudo-secao-5"
          className="w-full text-left border-b border-slate-200/80 dark:border-[#27272A] pb-4 min-h-[44px] flex items-center justify-between gap-4 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[8px]"
        >
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              SEÇÃO 5
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1 group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
              Como usar as skills no{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                ChatGPT
              </em>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-editorial-secondary shrink-0">
            <span className="hidden sm:inline">
              {openSections['secao-5'] ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#18181B] group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 flex items-center justify-center transition-colors">
              {openSections['secao-5'] ? (
                <ChevronUp className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              )}
            </span>
          </div>
        </button>

        {openSections['secao-5'] && (
          <div id="conteudo-secao-5" className="space-y-8">
            <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed font-light">
              Toda a construção de hoje acontece no ChatGPT. Siga a ordem: cada etapa usa o que saiu
              da anterior.
            </p>

            {/* Passos numerados em cartões */}
            <div className="space-y-6">
              {/* Passo 1 */}
              <div className="p-6 sm:p-7 rounded-[16px] border border-slate-200 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                    Passo 1 · Investigue o seu nicho (Radar Detetive)
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm text-editorial-primary font-light leading-relaxed">
                  <p>• Abra uma conversa nova com o Radar Detetive.</p>
                  <p>
                    • Escreva: &ldquo;Quero investigar o meu nicho.&rdquo; e cole a sua frase de
                    direção.
                  </p>
                  <div className="space-y-1.5 pl-3 border-l-2 border-[#7c3aed]/40">
                    <p className="font-medium text-editorial-primary">
                      • Responda às três perguntas que ele vai fazer. Vale preparar antes:
                    </p>
                    <p className="pl-2">1. O que você oferece e para quem?</p>
                    <p className="pl-2">
                      2. Como as pessoas do seu mercado costumam procurar e contratar esse cuidado?
                    </p>
                    <p className="pl-2">
                      3. Quais profissionais ou perfis você já conhece nesse espaço?
                    </p>
                  </div>
                  <p>• Acompanhe as Notas do detetive. Ao final, salve o seu Raio X do nicho.</p>
                  <p>
                    • Leia o Raio X com a lente do dia: com qual nível de consciência os
                    concorrentes mais falam? Qual nível ninguém atende?
                  </p>
                </div>
              </div>

              {/* Passo 2 */}
              <div className="p-6 sm:p-7 rounded-[16px] border border-slate-200 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                    Passo 2 · Escolha a sua brecha (na mesma conversa)
                  </h3>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-editorial-primary font-light leading-relaxed">
                  <p>
                    • Das 3 brechas do Raio X, escolha UMA que converse com a sua frase de direção.
                  </p>
                  <p>
                    • Escreva para o Radar Detetive: &ldquo;Escolho a brecha (número)
                    porque...&rdquo; e peça que ele confirme se os dados sustentam essa escolha.
                  </p>
                </div>
              </div>

              {/* Passo 3 */}
              <div className="p-6 sm:p-7 rounded-[16px] border border-slate-200 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                    Passo 3 · Defina o seu público-alvo (na mesma conversa)
                  </h3>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-editorial-primary font-light leading-relaxed">
                  <p>• Use as quatro categorias da seção 3. Responda pelo menos duas.</p>
                  <p>• Escreva a frase: &ldquo;Meu trabalho é para...&rdquo;</p>
                  <p>
                    • Faça o teste: respondeu em uma frase, sem hesitar e sem &ldquo;todo mundo que
                    precisa de ajuda&rdquo;?
                  </p>
                </div>
              </div>

              {/* Passo 4 */}
              <div className="p-6 sm:p-7 rounded-[16px] border border-slate-200 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                    Passo 4 · Gere o seu relatório de posicionamento (Estrategista de
                    Posicionamento)
                  </h3>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-editorial-primary font-light leading-relaxed">
                  <p>• Abra uma conversa nova com o Estrategista de Posicionamento.</p>
                  <p>
                    • Cole, nesta ordem: a sua frase de direção, o seu Raio X, a brecha escolhida
                    com o motivo e a frase do seu público-alvo.
                  </p>
                  <p>
                    • Responda às perguntas com sinceridade. Ele vai confrontar o que estiver vago.
                  </p>
                  <p>
                    • Salve o seu relatório de posicionamento. Ele é a matéria-prima do Encontro 3.
                  </p>
                </div>
              </div>
            </div>

            {/* Caixa de PROMPTS ÚTEIS, cada um com botão Copiar */}
            <div className="p-6 sm:p-7 rounded-[16px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200/80 dark:border-[#27272A] space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                Prompts úteis
              </span>

              <div className="space-y-3">
                {/* Prompt 1 */}
                <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="font-mono text-xs sm:text-sm text-editorial-primary">
                    &ldquo;Mostre a fonte de cada dado e marque o que você não encontrou.&rdquo;
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleCopyPromptText(
                        'Mostre a fonte de cada dado e marque o que você não encontrou.',
                        setCopiedPrompt1,
                      )
                    }
                    className="font-mono text-xs gap-1.5 rounded-[8px] min-h-[38px] shrink-0 self-start sm:self-auto"
                  >
                    {copiedPrompt1 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Prompt 2 */}
                <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="font-mono text-xs sm:text-sm text-editorial-primary">
                    &ldquo;Me devolva as opções e os critérios. A decisão é minha.&rdquo;
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleCopyPromptText(
                        'Me devolva as opções e os critérios. A decisão é minha.',
                        setCopiedPrompt2,
                      )
                    }
                    className="font-mono text-xs gap-1.5 rounded-[8px] min-h-[38px] shrink-0 self-start sm:self-auto"
                  >
                    {copiedPrompt2 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Prompt 3 */}
                <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="font-mono text-xs sm:text-sm text-editorial-primary">
                    &ldquo;Use as minhas palavras e o meu Raio X. Aponte o que ainda está vago em
                    mim.&rdquo;
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleCopyPromptText(
                        'Use as minhas palavras e o meu Raio X. Aponte o que ainda está vago em mim.',
                        setCopiedPrompt3,
                      )
                    }
                    className="font-mono text-xs gap-1.5 rounded-[8px] min-h-[38px] shrink-0 self-start sm:self-auto"
                  >
                    {copiedPrompt3 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Cuidado ético em caixa */}
            <div className="p-4 sm:p-5 rounded-[12px] bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs sm:text-sm text-amber-950 dark:text-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="font-light leading-relaxed">
                <strong className="font-semibold font-sans text-amber-900 dark:text-amber-100">
                  Cuidado ético:{' '}
                </strong>
                Antes de usar qualquer frase do relatório na sua divulgação, confira as orientações
                do Conselho Federal de Psicologia sobre publicidade: sem promessa de resultado e sem
                depoimentos de pacientes.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* SEÇÃO 6 · ENTREGA DA SEMANA */}
      <section
        id="secao-6"
        className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7 shadow-xs scroll-mt-28 transition-all"
      >
        <button
          type="button"
          onClick={() => toggleSection('secao-6')}
          aria-expanded={openSections['secao-6']}
          aria-controls="conteudo-secao-6"
          className="w-full text-left border-b border-slate-200/80 dark:border-[#27272A] pb-4 min-h-[44px] flex items-center justify-between gap-4 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[8px]"
        >
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              SEÇÃO 6
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1 group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
              Entrega da{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                semana
              </em>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-editorial-secondary shrink-0">
            <span className="hidden sm:inline">
              {openSections['secao-6'] ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#18181B] group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 flex items-center justify-center transition-colors">
              {openSections['secao-6'] ? (
                <ChevronUp className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              )}
            </span>
          </div>
        </button>

        {openSections['secao-6'] && (
          <div id="conteudo-secao-6" className="space-y-7">
            <div className="p-6 rounded-[16px] border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/60 dark:bg-purple-950/20 space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#7c3aed] dark:text-[#C084FC]" />
                <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                  Poste na comunidade:
                </h3>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-editorial-primary font-light leading-relaxed pl-3 border-l-2 border-[#7c3aed]/40">
                <p>1. A brecha que você escolheu, com uma frase de por quê.</p>
                <p>2. A frase do seu público-alvo.</p>
                <p>3. O seu relatório de posicionamento.</p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                {LINK_COMUNIDADE && (
                  <a
                    href={LINK_COMUNIDADE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs font-mono min-h-[42px]"
                  >
                    <span>Ir para a comunidade (WhatsApp)</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                )}

                {LINK_ECOSSISTEMA && (
                  <a
                    href={LINK_ECOSSISTEMA}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] border border-purple-300 dark:border-purple-800/70 bg-white dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-50 dark:hover:bg-purple-950/40 font-semibold text-xs font-mono min-h-[42px]"
                  >
                    <span>Plataforma Ecossistema (Aulas)</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                )}
              </div>
            </div>

            {/* Próximo encontro em destaque */}
            <div className="p-6 rounded-[16px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] block">
                Próximo encontro
              </span>
              <p className="text-sm sm:text-base text-editorial-primary font-medium leading-relaxed">
                Encontro 3: manifesto da marca e PVU. Traga o seu relatório de posicionamento.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* SEÇÃO 7 · SE ACONTECER ISTO */}
      <section
        id="secao-7"
        className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7 shadow-xs scroll-mt-28 transition-all"
      >
        <button
          type="button"
          onClick={() => toggleSection('secao-7')}
          aria-expanded={openSections['secao-7']}
          aria-controls="conteudo-secao-7"
          className="w-full text-left border-b border-slate-200/80 dark:border-[#27272A] pb-4 min-h-[44px] flex items-center justify-between gap-4 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] rounded-[8px]"
        >
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              SEÇÃO 7
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1 group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
              Se acontecer{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                isto
              </em>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-editorial-secondary shrink-0">
            <span className="hidden sm:inline">
              {openSections['secao-7'] ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#18181B] group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 flex items-center justify-center transition-colors">
              {openSections['secao-7'] ? (
                <ChevronUp className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              )}
            </span>
          </div>
        </button>

        {openSections['secao-7'] && (
          <div id="conteudo-secao-7" className="space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  se: 'A busca não funcionou.',
                  faca: 'Confira se a busca na internet está disponível na sua conta. Se não estiver, avise no grupo: a Tati roda o seu Raio X ao vivo.',
                },
                {
                  se: 'O Raio X trouxe dado sem fonte.',
                  faca: "Peça: 'Mostre a fonte de cada dado e marque o que você não encontrou.'",
                },
                {
                  se: 'A importação da skill deu erro.',
                  faca: 'Use o Plano B da seção 4.',
                },
                {
                  se: 'A skill decidiu por você.',
                  faca: "Responda: 'Me devolva as opções e os critérios. A decisão é minha.'",
                },
                {
                  se: 'Nenhuma brecha conversa com a sua frase.',
                  faca: 'Rode o Radar Detetive de novo, trocando a descrição do público na primeira pergunta.',
                },
                {
                  se: 'O relatório ficou genérico.',
                  faca: "Responda: 'Use as minhas palavras e o meu Raio X. Aponte o que ainda está vago em mim.'",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ea580c] dark:bg-[#FB923C]" />
                    <h4 className="font-sans font-semibold text-xs sm:text-sm text-editorial-primary">
                      Se acontecer: &ldquo;{item.se}&rdquo;
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-editorial-secondary font-light leading-relaxed pl-4 border-l-2 border-slate-200 dark:border-[#27272A]">
                    <strong>Faça isto:</strong> {item.faca}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* MODAL DE IMAGEM AMPLIADA */}
      {modalImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={modalImage.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-white dark:bg-[#18181B] rounded-[16px] p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-[#27272A] space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#27272A]">
              <h3 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
                {modalImage.title}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setModalImage(null)}
                className="h-8 w-8 p-0 rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-[#27272A]"
                aria-label="Fechar visualização"
              >
                <X className="w-4 h-4 text-editorial-primary" />
              </Button>
            </div>

            <div className="max-h-[75vh] overflow-auto flex items-center justify-center p-2 bg-slate-50 dark:bg-[#0c0914] rounded-[12px]">
              <img
                src={modalImage.src}
                alt={modalImage.alt}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            <p className="text-xs font-mono text-editorial-secondary text-center">
              Pressione ESC ou toque fora para fechar
            </p>
          </div>
        </div>
      )}
    </article>
  )
}

export default Encontro2Caderno
