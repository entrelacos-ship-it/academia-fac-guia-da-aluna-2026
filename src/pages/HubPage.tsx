import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calculator,
  Compass,
  Sparkles,
  BookOpen,
  ArrowRight,
  Lock,
  Moon,
  Sun,
  LogOut,
  Shield,
  Layers,
  FileText,
  Video,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Cpu,
  GraduationCap,
  KeyRound,
} from 'lucide-react'
import { FACLogo } from '@/components/FACLogo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCloudSync } from '@/hooks/useCloudSync'
import pb from '@/lib/pocketbase/client'
import { ValidarEmailModal } from '@/components/guia/ValidarEmailModal'
import { AlunaGuiaService, AlunaSession } from '@/services/alunaGuiaService'
import { HubService, HubItem } from '@/services/hubService'
import {
  SISTEMA_CATEGORIAS,
  SISTEMA_ITEMS_EXTRAS,
  SKILL_MENTORA_FAC_ITEM,
  SistemaCategory,
} from '@/config/sistemaHubConfig'
import { SkillMentoraModal } from '@/components/hub/SkillMentoraModal'
import { Download, Bot, Sparkles as SparklesIcon, FileDown } from 'lucide-react'

const STORAGE_KEY_THEME = 'entrelacos_fac_theme_mode'

// Mapeamento de ícones suportados dinamicamente
const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  BookOpen,
  Calculator,
  Compass,
  FileText,
  Video,
  Layers,
  Sparkles,
  GraduationCap,
  Bot,
  FileDown,
  Download,
}

export const HubPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, logout } = useCloudSync()
  const [validarModalOpen, setValidarModalOpen] = useState(() => {
    try {
      const search = new URLSearchParams(window.location.search)
      return search.get('motivo') === 'exclusivo_aluna'
    } catch {
      return false
    }
  })
  const [itemBloqueadoClicado, setItemBloqueadoClicado] = useState<string | null>(() => {
    try {
      const search = new URLSearchParams(window.location.search)
      return search.get('motivo') === 'exclusivo_aluna' ? 'Calculadora de Precificação FAC' : null
    } catch {
      return null
    }
  })

  // Itens dinâmicos vindos do PocketBase
  const [items, setItems] = useState<HubItem[]>([])
  const [loadingItems, setLoadingItems] = useState(true)

  // Categoria ativa no bloco Sistema
  const [activeSistemaCategory, setActiveSistemaCategory] = useState<string>('aplicativos')

  // Modal para prévia e download da skill Mentora-FAC
  const [skillModalOpen, setSkillModalOpen] = useState(false)

  // Sessão de aluna validada por e-mail de compra
  const [alunaSession, setAlunaSession] = useState<AlunaSession | null>(() =>
    AlunaGuiaService.getLocalSession(),
  )

  // Conta verificada (verified = true no PocketBase) OU matrícula ativa local OU admin
  const isAlunaValidada =
    currentUser?.role === 'admin' ||
    currentUser?.verified === true ||
    (!!alunaSession && alunaSession.status === 'ativa')

  // Carregar os itens do hub no backend
  useEffect(() => {
    let isMounted = true
    HubService.listarItens(false)
      .then((data) => {
        if (isMounted) {
          setItems(data)
          setLoadingItems(false)
        }
      })
      .catch(() => {
        if (isMounted) setLoadingItems(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  // Tema Astral Claro/Escuro (persistido em localStorage)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME)
      if (saved === 'light' || saved === 'dark') return saved
    } catch {
      // ignore
    }
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme)
    } catch {
      // ignore
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  // Filtrar itens por bloco e mesclar com itens extras (ex: Skill Mentora-FAC)
  const heroItem = items.find((it) => it.bloco === 'hero' && it.ativo)

  // Garantir que a skill Mentora-FAC esteja presente se não vier do backend
  const allSistemaItems: HubItem[] = React.useMemo(() => {
    const fromApi = items.filter((it) => it.bloco === 'sistema' && it.ativo)
    const hasMentora = fromApi.some((it) => it.chave === 'mentora-fac')
    if (!hasMentora) {
      return [...fromApi, SKILL_MENTORA_FAC_ITEM as HubItem]
    }
    return fromApi
  }, [items])

  const materialItems = items.filter((it) => it.bloco === 'material' && it.ativo)

  // Função para executar download seguro do arquivo Mentora-FAC.md
  const handleDownloadMentoraFac = () => {
    if (!isAlunaValidada) {
      setItemBloqueadoClicado('Skill Mentora-FAC')
      setValidarModalOpen(true)
      return
    }

    const extra = SISTEMA_ITEMS_EXTRAS['mentora-fac']
    const content = extra?.download?.rawContent || ''
    const filename = extra?.download?.filename || 'Mentora-FAC.md'

    try {
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      console.error('Erro ao baixar arquivo da skill:', err)
      // Fallback via link direto do asset estático
      window.open('/downloads/Mentora-FAC.md', '_blank')
    }
  }

  // Ao clicar em uma peça exclusiva de aluna (ex: Calculadora, IKIGAI ou Skill)
  const handleItemClick = (item: HubItem) => {
    const extra = SISTEMA_ITEMS_EXTRAS[item.chave]

    // Se for uma skill ou item de download
    if (item.chave === 'mentora-fac' || extra?.tipo === 'skill') {
      if (item.exclusivo_alunas && !isAlunaValidada) {
        setItemBloqueadoClicado(item.titulo)
        setValidarModalOpen(true)
        return
      }
      // Aluna autenticada: abre modal para visualizar e/ou baixar
      setSkillModalOpen(true)
      return
    }

    // Se a peça está marcada com rótulo "Em breve" ou "Em construção" e não tem rota pronta, aviso informativo
    if (
      item.rotulo_badge &&
      (item.rotulo_badge.toLowerCase().includes('breve') ||
        item.rotulo_badge.toLowerCase().includes('construção')) &&
      item.bloco === 'material'
    ) {
      navigate('/guia')
      return
    }

    if (item.exclusivo_alunas && !isAlunaValidada) {
      setItemBloqueadoClicado(item.titulo)
      setValidarModalOpen(true)
      return
    }

    if (item.url) {
      navigate(item.url)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#03000A] text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-200 astral-glow-bg">
      {/* Topbar Fixa Astral */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A0A14]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#27272A] shadow-xs dark:shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              to="/"
              className="flex items-center text-left group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC] rounded-[8px] p-1 transition-opacity hover:opacity-90 min-w-0 shrink"
              aria-label="Página inicial da Academia Entrelaços"
            >
              <FACLogo size="md" subtitle="Academia Entrelaços" />
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Indicador de Matrícula de Aluna */}
            {isAlunaValidada ? (
              <div
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-medium"
                title={`Matrícula Ativa: ${alunaSession?.email || currentUser?.email}`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate max-w-[130px]">
                  {currentUser?.role === 'admin' ? 'Admin / Aluna' : 'Aluna Validada'}
                </span>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setValidarModalOpen(true)}
                className="min-h-[44px] h-10 px-2.5 sm:px-3 text-xs font-mono gap-1 border-purple-200 dark:border-[#7c3aed]/50 text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-50 dark:hover:bg-[#18181B] rounded-[8px]"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Já sou aluna</span>
                <span className="xs:hidden">Aluna</span>
              </Button>
            )}

            {/* Identificação de Usuária e Atalho Perfil */}
            <Link
              to="/perfil"
              className="inline-flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-[8px] text-xs font-mono font-semibold bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/50 transition-colors"
              title="Acessar Perfil e Alterar Senha"
              aria-label="Perfil e Senha"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
              <span className="hidden md:inline">PERFIL & SENHA</span>
            </Link>

            <div
              className="hidden xl:flex flex-col text-right pl-2 pr-1 border-l border-slate-200 dark:border-[#27272A] max-w-[150px]"
              title={`Usuária logada: ${currentUser?.email}`}
            >
              <span className="text-xs font-medium text-slate-900 dark:text-white truncate">
                {currentUser?.name || 'Psicóloga'}
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-[#A1A1AA] truncate -mt-0.5">
                {currentUser?.email}
              </span>
            </div>

            {currentUser?.role === 'admin' && (
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-[8px] text-xs font-mono font-semibold bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/50 transition-colors"
                title="Painel de Administração FAC"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
                <span className="hidden sm:inline">ADMIN</span>
              </a>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-10 w-10 min-h-[44px] min-w-[44px] text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#18181B] rounded-[8px]"
              aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-[#FB923C]" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                logout()
                AlunaGuiaService.clearLocalSession()
                window.location.href = '/login'
              }}
              className="min-h-[44px] min-w-[44px] h-10 w-10 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-[8px] sm:w-auto sm:px-2.5 sm:gap-1"
              title="Encerrar sessão e voltar ao login"
              aria-label="Sair da conta"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs font-mono font-medium">SAIR</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal do Hub */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Hero do Hub com Cubo Mágico 3D */}
        <div className="relative overflow-hidden rounded-[24px] p-6 sm:p-10 lg:p-12 border border-purple-200/70 dark:border-[#27272A] bg-gradient-to-br from-purple-50/60 via-white to-purple-100/30 dark:from-[#110D20] dark:via-[#0A0A14] dark:to-[#05020B] shadow-sm dark:shadow-2xl">
          {/* Luz astral ambiente decorativa */}
          <div
            className="absolute top-0 right-0 w-[420px] h-[420px] bg-radial from-[#7c3aed]/20 via-[#6b21a8]/10 to-transparent blur-3xl pointer-events-none -z-0"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Lado Esquerdo: Textos e Ações Principais */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/90 dark:bg-[#18181B]/90 border border-purple-200 dark:border-[#27272A] text-xs font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                <Sparkles className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
                <span>ACADEMIA ENTRELAÇOS</span>
                <span className="text-slate-400 dark:text-[#71717A]">•</span>
                <span className="text-slate-600 dark:text-[#A1A1AA]">MÉTODO FAC</span>
              </div>

              <h1 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-medium tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Sua formação e prática integrada na{' '}
                <span className="text-[#7c3aed] dark:text-[#C084FC] italic">Academia FAC</span>.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-[#A1A1AA] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                O Guia da Aluna conduz toda a trilha pedagógica da formação. No bloco Sistema você
                acessa as aplicações clínicas do dia a dia, e em Material & Tutoriais os recursos de
                apoio e estudo continuado.
              </p>

              {/* Botões rápidos de acesso na hero */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Button
                  onClick={() => navigate('/guia')}
                  className="min-h-[46px] px-6 gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[10px] shadow-sm text-sm cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Entrar no Guia da Aluna</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                {!isAlunaValidada && (
                  <Button
                    variant="outline"
                    onClick={() => setValidarModalOpen(true)}
                    className="min-h-[46px] px-5 gap-1.5 font-mono text-xs border-purple-300 dark:border-[#7c3aed]/50 text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-50 dark:hover:bg-[#18181B] rounded-[10px]"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
                    <span>Já sou aluna</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Lado Direito: Percurso dos 3 Pilares e Destaque Metodológico (sem cubo 3D) */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-3 pt-2 lg:pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
                <div className="p-3.5 rounded-[12px] bg-white/80 dark:bg-[#18181B]/80 border border-purple-200/80 dark:border-[#27272A] shadow-xs">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                    Pilar 1 · Fundação
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-snug">
                    Custo de vida real, reserva ética e piso mínimo sustentável da sessão.
                  </p>
                </div>
                <div className="p-3.5 rounded-[12px] bg-white/80 dark:bg-[#18181B]/80 border border-purple-200/80 dark:border-[#27272A] shadow-xs">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] block">
                    Pilar 2 · Atração
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-snug">
                    Posicionamento ético, autoridade técnica e fluxo consistente de pacientes.
                  </p>
                </div>
                <div className="p-3.5 rounded-[12px] bg-white/80 dark:bg-[#18181B]/80 border border-purple-200/80 dark:border-[#27272A] shadow-xs">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                    Pilar 3 · Conexão
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-snug">
                    Primeira consulta acolhedora, contrato clínico e retenção ética continuada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 1. O GUIA VEM PRIMEIRO: CARD DESTACADO HERO ================= */}
        {heroItem && (
          <section aria-labelledby="secao-guia-aluna" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
                Percurso Pedagógico Principal
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-[10px] font-mono tracking-wider uppercase">
                {heroItem.rotulo_badge || 'Aula 1 Aberta · Trilha do Ciclo'}
              </Badge>
            </div>

            <div className="p-6 sm:p-8 rounded-[16px] border border-purple-200/80 dark:border-purple-900/40 bg-gradient-to-br from-purple-50/50 via-white to-white dark:from-purple-950/20 dark:via-[#0c0914] dark:to-[#0a0712] transition-colors">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3.5 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-[10px] bg-[#7c3aed] text-white flex items-center justify-center shadow-xs">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                        Coração da Academia
                      </span>
                      <h2
                        id="secao-guia-aluna"
                        className="font-serif-editorial text-2xl sm:text-3xl font-medium text-slate-900 dark:text-white tracking-tight"
                      >
                        {heroItem.titulo}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {heroItem.descricao ||
                      'Aula Magna aberta com o Diagnóstico FAC Aprofundado (24 perguntas), trilha completa de encontros, cadernos didáticos e validação do e-mail de compra para alunas da turma.'}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-600 dark:text-[#A1A1AA] pt-1">
                    <span className="px-2.5 py-1 rounded-[6px] bg-white dark:bg-[#151220] border border-slate-200 dark:border-[#27272A]">
                      ✓ Diagnóstico FAC 24 perguntas
                    </span>
                    <span className="px-2.5 py-1 rounded-[6px] bg-white dark:bg-[#151220] border border-slate-200 dark:border-[#27272A]">
                      ✓ Relatório PDF com radar
                    </span>
                    <span className="px-2.5 py-1 rounded-[6px] bg-white dark:bg-[#151220] border border-slate-200 dark:border-[#27272A]">
                      ✓ Cadernos Didáticos da Turma
                    </span>
                  </div>
                </div>

                <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
                  <Button
                    onClick={() => navigate('/guia')}
                    className="w-full sm:w-auto min-h-[46px] px-6 gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] text-sm cursor-pointer shadow-xs"
                  >
                    <span>Abrir Guia da Aluna</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  {!isAlunaValidada && (
                    <Button
                      variant="outline"
                      onClick={() => setValidarModalOpen(true)}
                      className="w-full sm:w-auto min-h-[44px] px-4 gap-1.5 font-mono text-xs border-purple-200 dark:border-purple-800/60 text-[#7c3aed] dark:text-[#C084FC] rounded-[8px] hover:bg-purple-50 dark:hover:bg-[#161224]"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
                      <span>Validar Matrícula da Turma</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= 2. BLOCO SISTEMA: ABAS EXTENSÍVEIS (APLICATIVOS, SKILLS, ETC.) ================= */}
        {allSistemaItems.length > 0 && (
          <section aria-labelledby="secao-aplicativos-recursos" className="space-y-5 pt-2">
            {/* Cabeçalho do Bloco com Título e Abas Estilo Editorial/Pills */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#221f2d]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                  <h3
                    id="secao-aplicativos-recursos"
                    className="font-serif-editorial text-2xl sm:text-3xl font-medium text-slate-900 dark:text-white"
                  >
                    Aplicativos e recursos
                  </h3>
                </div>
                <p className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
                  Launcher de ferramentas, aplicativos e skills exclusivas para alunas
                </p>
              </div>

              {/* Seletor de Abas de Categorias */}
              <div className="flex items-center gap-1.5 p-1 rounded-[12px] bg-slate-100 dark:bg-[#131020] border border-slate-200 dark:border-[#27272A] overflow-x-auto max-w-full scrollbar-none">
                {SISTEMA_CATEGORIAS.map((cat) => {
                  const isActive = activeSistemaCategory === cat.id
                  const countInCat = allSistemaItems.filter((it) => {
                    const extra = SISTEMA_ITEMS_EXTRAS[it.chave]
                    const itemCat = it.categoria || extra?.categoria || 'aplicativos'
                    return itemCat === cat.id
                  }).length

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveSistemaCategory(cat.id)}
                      className={`relative px-3.5 py-1.5 rounded-[9px] text-xs font-mono font-medium transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-white dark:bg-[#201833] text-[#7c3aed] dark:text-[#C084FC] shadow-xs font-semibold border border-purple-200/80 dark:border-purple-800/60'
                          : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-[#1a1529]'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive
                            ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold'
                            : 'bg-slate-200/70 dark:bg-[#242033] text-slate-600 dark:text-zinc-400'
                        }`}
                      >
                        {countInCat}
                      </span>
                      {cat.badge && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] dark:bg-[#FB923C]" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Descrição sutil da categoria atual */}
            {(() => {
              const currentCatObj = SISTEMA_CATEGORIAS.find((c) => c.id === activeSistemaCategory)
              return currentCatObj?.descricao ? (
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#A1A1AA] -mt-1 px-1">
                  <span>{currentCatObj.descricao}</span>
                </div>
              ) : null
            })()}

            {/* Grade responsiva de cards da categoria selecionada */}
            {(() => {
              const itemsNaCategoria = allSistemaItems.filter((it) => {
                const extra = SISTEMA_ITEMS_EXTRAS[it.chave]
                const itemCat = it.categoria || extra?.categoria || 'aplicativos'
                return itemCat === activeSistemaCategory
              })

              if (itemsNaCategoria.length === 0) {
                return (
                  <div className="p-8 text-center rounded-[18px] border border-dashed border-slate-200 dark:border-[#27272A] bg-slate-50/50 dark:bg-[#0c0915]/50">
                    <p className="text-xs font-mono text-slate-500 dark:text-zinc-500">
                      Nenhum item disponível nesta categoria no momento.
                    </p>
                  </div>
                )
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                  {itemsNaCategoria.map((item, idx) => {
                    const extra = SISTEMA_ITEMS_EXTRAS[item.chave]
                    const IconComponent =
                      ICON_MAP[item.icone || ''] || (extra?.tipo === 'skill' ? Sparkles : Cpu)
                    const isBlocked = item.exclusivo_alunas && !isAlunaValidada
                    const isEmBreve =
                      item.rotulo_badge?.toLowerCase().includes('breve') ||
                      item.rotulo_badge?.toLowerCase().includes('construção')
                    const isSkill = extra?.tipo === 'skill' || item.chave === 'mentora-fac'

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleItemClick(item)
                          }
                        }}
                        aria-label={`${item.titulo}${isBlocked ? ' - Exclusivo para alunas' : ''}`}
                        className={`group relative text-left w-full min-h-[300px] sm:min-h-[320px] p-4 sm:p-5 rounded-[18px] border transition-all duration-200 flex flex-col justify-between cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC] overflow-hidden ${
                          isBlocked
                            ? 'bg-gradient-to-b from-white to-amber-50/30 dark:from-[#0d0a14] dark:to-[#17110d] border-amber-200/80 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-700 hover:shadow-md'
                            : 'bg-white dark:bg-[#0c0915] border-slate-200/80 dark:border-[#221f2d] hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/50 hover:shadow-lg dark:hover:shadow-purple-950/20 hover:-translate-y-0.5'
                        }`}
                      >
                        {/* Topo do Card: Ícone em destaque, índice e selo de status */}
                        <div className="w-full space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            {/* Ícone quadrado do aplicativo ou skill */}
                            <div
                              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shrink-0 ${
                                isBlocked
                                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/40'
                                  : isSkill
                                    ? 'bg-gradient-to-br from-purple-100 via-purple-50 to-amber-50 dark:from-[#2a1740] dark:via-[#1c1230] dark:to-[#171124] text-[#7c3aed] dark:text-[#C084FC] border border-purple-200/80 dark:border-purple-800/60 group-hover:bg-[#7c3aed] group-hover:text-white dark:group-hover:bg-[#C084FC] dark:group-hover:text-[#0A0A14]'
                                    : 'bg-gradient-to-br from-purple-50 to-purple-100/70 dark:from-[#1b142e] dark:to-[#120d20] text-[#7c3aed] dark:text-[#C084FC] border border-purple-200/80 dark:border-purple-900/50 group-hover:bg-[#7c3aed] group-hover:text-white dark:group-hover:bg-[#C084FC] dark:group-hover:text-[#0A0A14]'
                              }`}
                            >
                              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>

                            {/* Índice numérico sutil */}
                            <span className="font-mono text-[11px] text-slate-400 dark:text-zinc-600 font-semibold pt-0.5">
                              0{idx + 1}
                            </span>
                          </div>

                          {/* Selo / Badge */}
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {isBlocked ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 text-[10px] font-mono uppercase tracking-wider font-medium">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Exclusivo alunas</span>
                              </span>
                            ) : isEmBreve ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-slate-100 dark:bg-[#1a1824] text-slate-600 dark:text-[#A1A1AA] border border-slate-200 dark:border-[#2b273b] text-[10px] font-mono uppercase tracking-wider font-medium">
                                <Clock className="w-2.5 h-2.5" />
                                <span>{item.rotulo_badge || 'Em breve'}</span>
                              </span>
                            ) : isSkill ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-purple-500/10 text-[#7c3aed] dark:text-[#C084FC] border border-purple-500/25 text-[10px] font-mono uppercase tracking-wider font-medium">
                                <Sparkles className="w-2.5 h-2.5 text-[#ea580c] dark:text-[#FB923C]" />
                                <span>{item.rotulo_badge || 'Skill FAC'}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-[10px] font-mono uppercase tracking-wider font-medium">
                                {item.rotulo_badge || 'Disponível'}
                              </span>
                            )}
                          </div>

                          {/* Título e Descrição */}
                          <div className="space-y-1.5 pt-1 min-w-0">
                            <h4 className="font-serif-editorial text-lg sm:text-xl font-medium text-slate-900 dark:text-white leading-snug group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors line-clamp-2">
                              {item.titulo}
                            </h4>

                            <p
                              title={item.descricao}
                              className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed line-clamp-3 font-normal break-words overflow-hidden text-ellipsis"
                            >
                              {item.descricao}
                            </p>
                          </div>
                        </div>

                        {/* Rodapé do Card: Ação de Launcher ou Download */}
                        <div className="w-full pt-4 mt-3 border-t border-slate-100 dark:border-[#1a1726] flex items-center justify-between text-xs font-mono">
                          {isBlocked ? (
                            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 text-[11px] font-medium group-hover:text-amber-800 dark:group-hover:text-amber-300">
                              <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              <span className="truncate">
                                Já sou aluna? Validar e-mail de matrícula
                              </span>
                            </div>
                          ) : isSkill ? (
                            <div className="flex items-center gap-1.5 text-[#7c3aed] dark:text-[#C084FC] text-[11px] font-semibold group-hover:translate-x-0.5 transition-transform">
                              <Download className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
                              <span>Baixar Mentora-FAC</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[#7c3aed] dark:text-[#C084FC] text-[11px] font-semibold group-hover:translate-x-0.5 transition-transform">
                              <span>Abrir app</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          )}

                          <span className="text-[10px] text-slate-400 dark:text-zinc-600 uppercase tracking-wider shrink-0 ml-1">
                            {isSkill ? 'Skill' : 'App'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </section>
        )}

        {/* ================= 3. BLOCO MATERIAL & TUTORIAIS (LINHAS EDITORIAIS) ================= */}
        {materialItems.length > 0 && (
          <section aria-labelledby="secao-materiais" className="space-y-3 pt-2">
            <div className="flex items-baseline justify-between pb-2.5 border-b border-slate-200 dark:border-[#221f2d]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
                <h3
                  id="secao-materiais"
                  className="font-serif-editorial text-2xl font-medium text-slate-900 dark:text-white"
                >
                  Material & Tutoriais
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
                Estudo continuado & referências
              </span>
            </div>

            <div className="divide-y divide-slate-200/80 dark:divide-[#221f2d] bg-white dark:bg-[#0c0a14] rounded-[14px] border border-slate-200/80 dark:border-[#221f2d] overflow-hidden">
              {materialItems.map((item, idx) => {
                const IconComponent = ICON_MAP[item.icone || ''] || FileText
                const isEmBreve =
                  item.rotulo_badge?.toLowerCase().includes('breve') ||
                  item.rotulo_badge?.toLowerCase().includes('construção')

                return (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 editorial-row flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs text-[#ea580c] dark:text-[#FB923C] font-semibold">
                          0{idx + 1}
                        </span>
                        <div className="w-7 h-7 rounded-[6px] bg-orange-50 dark:bg-[#201511] text-[#ea580c] dark:text-[#FB923C] flex items-center justify-center shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <h4 className="font-serif-editorial text-xl sm:text-2xl font-medium text-slate-900 dark:text-white">
                          {item.titulo}
                        </h4>
                        <Badge className="bg-slate-100 dark:bg-[#1a1824] text-slate-600 dark:text-[#A1A1AA] border-slate-200 dark:border-[#2b273b] text-[10px] font-mono tracking-wider uppercase">
                          {item.rotulo_badge || 'Em breve'}
                        </Badge>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed max-w-2xl font-normal">
                        {item.descricao}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {isEmBreve ? (
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#71717A] py-1">
                          <Clock className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
                          <span>Coordenação Pedagógica</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleItemClick(item)}
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto min-h-[44px] px-4 font-mono text-xs rounded-[8px]"
                        >
                          <span>Consultar Material</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer Astral */}
      <footer className="border-t border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] py-4 px-4 text-center text-xs text-slate-600 dark:text-[#A1A1AA] print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px]">
          <p className="text-slate-800 dark:text-white font-medium">
            Entrelaços Psicologia — Academia & Método FAC · Astral System © 2026
          </p>
          <p className="text-slate-400 dark:text-[#71717A]">
            Plataforma pedagógica e sistemas exclusivos para alunas da Academia.
          </p>
        </div>
      </footer>

      {/* Modais */}
      <ValidarEmailModal
        isOpen={validarModalOpen}
        onClose={() => {
          setValidarModalOpen(false)
          setItemBloqueadoClicado(null)
        }}
        defaultEmail={currentUser?.email || ''}
        onSuccess={async (aluna) => {
          setAlunaSession(aluna)

          // Atualizar o authStore local se a usuária logada tiver o mesmo e-mail validado
          try {
            if (pb.authStore.isValid && pb.authStore.model) {
              const currentEmail = (pb.authStore.model.email || '').toLowerCase()
              if (currentEmail === aluna.email.toLowerCase()) {
                await pb.collection('users').authRefresh()
              }
            }
          } catch {
            // ignore
          }

          const target = itemBloqueadoClicado?.toLowerCase() || ''
          setItemBloqueadoClicado(null)

          if (target.includes('calculadora')) {
            navigate('/calculadora')
          } else if (target.includes('ikigai')) {
            navigate('/ikigai')
          } else if (target.includes('mentora') || target.includes('skill')) {
            setActiveSistemaCategory('skills')
            setSkillModalOpen(true)
          }
        }}
      />

      {/* Modal de Prévia e Download da Skill Mentora-FAC */}
      <SkillMentoraModal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        rawContent={SISTEMA_ITEMS_EXTRAS['mentora-fac']?.download?.rawContent || ''}
        onDownload={handleDownloadMentoraFac}
      />
    </div>
  )
}

export default HubPage
