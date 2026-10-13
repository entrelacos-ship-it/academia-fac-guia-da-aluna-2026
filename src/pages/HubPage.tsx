import React, { useState, useEffect, useMemo } from 'react'
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
  Layers,
  FileText,
  Video,
  ExternalLink,
  ShieldCheck,
  Cpu,
  GraduationCap,
  KeyRound,
  Download,
  Bot,
  FileDown,
  Loader2,
  Clock,
  HeartHandshake,
} from 'lucide-react'
import { FACLogo } from '@/components/FACLogo'
import { Button } from '@/components/ui/button'
import { useCloudSync } from '@/hooks/useCloudSync'
import pb from '@/lib/pocketbase/client'
import { ValidarEmailModal } from '@/components/guia/ValidarEmailModal'
import { AlunaGuiaService, AlunaSession } from '@/services/alunaGuiaService'
import { HubService, HubItem } from '@/services/hubService'
import {
  SISTEMA_CATEGORIAS,
  SISTEMA_ITEMS_EXTRAS,
  SKILL_MENTORA_FAC_ITEM,
} from '@/config/sistemaHubConfig'
import { LINK_ECOSSISTEMA } from '@/config/guiaContent'
import { SkillMentoraModal } from '@/components/hub/SkillMentoraModal'
import { SkillsService, SkillItem } from '@/services/skillsService'
import { useToast } from '@/hooks/use-toast'

const STORAGE_KEY_THEME = 'entrelacos_fac_theme_mode'

// Mapeamento dinâmico de ícones com stroke fino estilo Resend
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

  const { toast } = useToast()

  // Itens dinâmicos vindos do PocketBase
  const [items, setItems] = useState<HubItem[]>([])
  const [loadingItems, setLoadingItems] = useState(true)

  // Skills cadastradas no PocketBase (fac_skills) para download
  const [dbSkills, setDbSkills] = useState<SkillItem[]>([])
  const [loadingDbSkills, setLoadingDbSkills] = useState(true)
  const [downloadingSkillId, setDownloadingSkillId] = useState<string | null>(null)

  // Categoria ativa no bloco Sistema (permite inicialização via query param ?aba=skills ou ?aba=aplicativos)
  const [activeSistemaCategory, setActiveSistemaCategory] = useState<string>(() => {
    try {
      const search = new URLSearchParams(window.location.search)
      const aba = search.get('aba')
      if (aba && SISTEMA_CATEGORIAS.some((c) => c.id === aba)) {
        return aba
      }
    } catch {
      // ignore
    }
    return 'aplicativos'
  })

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

  // Carregar os itens do hub no backend e as skills cadastradas
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

    // Carregar skills ativas para alunas
    SkillsService.listarSkills(true)
      .then((data) => {
        if (isMounted) {
          setDbSkills(data)
          setLoadingDbSkills(false)
        }
      })
      .catch(() => {
        if (isMounted) setLoadingDbSkills(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Tema Dual-Mode (Light & Dark), com fundo escuro sendo o roxo escurão da marca (#0D0522)
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
  const allSistemaItems: HubItem[] = useMemo(() => {
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
      window.open('/downloads/Mentora-FAC.md', '_blank')
    }
  }

  // Função para download autenticado de skills cadastradas no PocketBase
  const handleDownloadDbSkill = async (sk: SkillItem) => {
    if (!isAlunaValidada) {
      setItemBloqueadoClicado(sk.titulo)
      setValidarModalOpen(true)
      return
    }

    setDownloadingSkillId(sk.id)
    try {
      const res = await SkillsService.downloadSkillAluna(sk, alunaSession?.token)
      if (res.success) {
        toast({
          title: 'Download iniciado',
          description: `O arquivo ${sk.arquivo} foi baixado com sucesso.`,
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Não foi possível baixar',
          description: res.message || 'Verifique sua matrícula de aluna.',
        })
      }
    } catch (err) {
      console.error('Erro no download:', err)
      toast({
        variant: 'destructive',
        title: 'Erro no download',
        description: 'Tente novamente em instantes.',
      })
    } finally {
      setDownloadingSkillId(null)
    }
  }

  // Ao clicar em uma peça exclusiva de aluna (ex: Calculadora, IKIGAI ou Skill)
  const handleItemClick = (item: HubItem) => {
    const extra = SISTEMA_ITEMS_EXTRAS[item.chave]

    if (item.chave === 'mentora-fac') {
      if (item.exclusivo_alunas && !isAlunaValidada) {
        setItemBloqueadoClicado(item.titulo)
        setValidarModalOpen(true)
        return
      }
      setSkillModalOpen(true)
      return
    }

    if (extra?.tipo === 'skill') {
      if (item.exclusivo_alunas && !isAlunaValidada) {
        setItemBloqueadoClicado(item.titulo)
        setValidarModalOpen(true)
        return
      }
      setSkillModalOpen(true)
      return
    }

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
    <div className="min-h-screen bg-[#F6F6F9] dark:bg-[#0D0522] text-[#0f172a] dark:text-[#f8fafc] flex flex-col font-sans transition-colors duration-200">
      {/* Topbar Fixa Estilo Resend: hairline fina, fundo semitransparente com blur suave */}
      <header className="sticky top-0 z-40 bg-[#F6F6F9]/90 dark:bg-[#0D0522]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08] print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/"
              className="flex items-center text-left group focus:outline-hidden focus:ring-1 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC] rounded-[8px] p-0.5 transition-opacity hover:opacity-90 min-w-0 shrink"
              aria-label="Página inicial da Academia Entrelaços"
            >
              <FACLogo size="md" subtitle="Academia Entrelaços" />
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Indicador de Matrícula de Aluna */}
            {isAlunaValidada ? (
              <div
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono"
                title={`Matrícula Ativa: ${alunaSession?.email || currentUser?.email}`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate max-w-[130px]">
                  {currentUser?.role === 'admin' ? 'Admin / Aluna' : 'Aluna Validada'}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setValidarModalOpen(true)}
                className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-mono font-medium rounded-[6px] border border-slate-300/80 dark:border-white/[0.1] text-slate-700 dark:text-[#cbd5e1] hover:text-[#7c3aed] dark:hover:text-[#C084FC] hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/40 bg-transparent transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3 text-[#ea580c] dark:text-[#FB923C]" />
                <span className="hidden xs:inline">Já sou aluna</span>
                <span className="xs:hidden">Aluna</span>
              </button>
            )}

            {/* Identificação de Usuária e Atalho Perfil */}
            <Link
              to="/perfil"
              className="inline-flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-[6px] text-xs font-mono font-medium border border-slate-300/80 dark:border-white/[0.1] text-slate-700 dark:text-[#cbd5e1] hover:text-[#7c3aed] dark:hover:text-[#C084FC] hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/40 transition-colors"
              title="Acessar Perfil e Alterar Senha"
              aria-label="Perfil e Senha"
            >
              <KeyRound className="w-3 h-3 text-[#ea580c] dark:text-[#FB923C]" />
              <span className="hidden md:inline">PERFIL & SENHA</span>
            </Link>

            {currentUser?.role === 'admin' && (
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-[6px] text-xs font-mono font-medium border border-slate-300/80 dark:border-white/[0.1] text-slate-700 dark:text-[#cbd5e1] hover:text-[#7c3aed] dark:hover:text-[#C084FC] hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/40 transition-colors"
                title="Painel de Administração FAC"
              >
                <Sparkles className="w-3 h-3 text-[#ea580c] dark:text-[#FB923C]" />
                <span className="hidden sm:inline">ADMIN</span>
              </a>
            )}

            {/* Alternador de tema claro/escuro */}
            <button
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 inline-flex items-center justify-center rounded-[6px] border border-transparent hover:border-slate-300/80 dark:hover:border-white/[0.1] text-slate-600 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-[#FB923C]" />
              )}
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={() => {
                logout()
                AlunaGuiaService.clearLocalSession()
                window.location.href = '/login'
              }}
              className="h-9 px-2.5 inline-flex items-center gap-1.5 rounded-[6px] border border-transparent hover:border-rose-300/60 dark:hover:border-rose-900/40 text-slate-500 dark:text-[#94a3b8] hover:text-rose-600 dark:hover:text-rose-400 text-xs font-mono font-medium transition-colors cursor-pointer"
              title="Encerrar sessão e voltar ao login"
              aria-label="Sair da conta"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SAIR</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal do Hub: Layout fluido, espaçoso, padrão Resend (container ~1360px no topo) */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-20 space-y-16 sm:space-y-24">
        {/* ================= HERO ELEGANTE PREMIUM (Sem 3D, Timeline Vertical com Entregas Reais) ================= */}
        <section
          aria-label="Apresentação da Academia Entrelaços"
          className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 lg:py-20 antialiased overflow-x-hidden"
        >
          {/* Glow de fundo atmosférico e sutil (#7C3AED / ametista suave com opacidade bem baixa + toque laranja mínimo) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 lg:right-1/4 w-[500px] sm:w-[720px] lg:w-[820px] h-[500px] sm:h-[720px] lg:h-[820px] rounded-full bg-[#7c3aed]/12 dark:bg-[#7c3aed]/18 blur-[120px] -z-10 transition-opacity motion-reduce:hidden"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/3 -left-32 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full bg-[#ea580c]/6 dark:bg-[#FB923C]/8 blur-[130px] -z-10 transition-opacity motion-reduce:hidden"
          />

          <div className="w-full max-w-7xl px-2 sm:px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              {/* Coluna Esquerda: lg:col-span-5 */}
              <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
                {/* Badge Pill no topo */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-slate-300/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xs text-[11px] font-mono tracking-widest uppercase text-slate-700 dark:text-[#cbd5e1] mb-6 sm:mb-8 transition-colors shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] dark:bg-[#FB923C] animate-pulse motion-reduce:animate-none" />
                  <span>Academia Entrelaços</span>
                  <span className="text-slate-300 dark:text-white/20">•</span>
                  <span className="text-slate-500 dark:text-[#94a3b8]">MÉTODO FAC</span>
                </div>

                {/* Headline: Inter Tight 500 + Instrument Serif italic na palavra-âncora */}
                <h1 className="font-sans font-medium text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.12] tracking-tight text-slate-900 dark:text-white text-balance">
                  Formação e prática{' '}
                  <em className="font-serif-anchor not-italic font-normal text-[#7c3aed] dark:text-[#C084FC]">
                    integrada
                  </em>{' '}
                  para psicólogas.
                </h1>

                {/* Parágrafo com ênfase em tom mais claro */}
                <p className="text-base lg:text-lg text-slate-600 dark:text-gray-400 leading-relaxed max-w-lg mt-6 font-normal text-balance">
                  Acesso unificado aos{' '}
                  <strong className="font-medium text-slate-900 dark:text-gray-200">
                    cadernos pedagógicos
                  </strong>
                  , aplicações de sustentabilidade clínica, recursos de posicionamento e ferramentas
                  metodológicas da Academia.
                </p>

                {/* Botões: Primário sólido para Guia da Aluna + Secundário fantasma com seta deslizante */}
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => navigate('/guia')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-[#0D0522] dark:hover:bg-slate-100 shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Acessar o Guia da Aluna</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isAlunaValidada) {
                        setItemBloqueadoClicado('Calculadora de Precificação FAC')
                        setValidarModalOpen(true)
                      } else {
                        navigate('/calculadora')
                      }
                    }}
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-medium border border-slate-300/80 dark:border-white/10 bg-transparent text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/25 transition-all cursor-pointer"
                  >
                    <Calculator className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
                    <span>Calculadora FAC</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
                  </button>
                </div>

                {/* Sublegenda de status de aluna */}
                <div className="mt-5 flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#94a3b8]">
                  {isAlunaValidada ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Matrícula ativa reconhecida</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setValidarModalOpen(true)}
                      className="inline-flex items-center gap-1 text-slate-600 dark:text-gray-400 hover:text-[#7c3aed] dark:hover:text-[#C084FC] transition-colors cursor-pointer"
                    >
                      <Lock className="w-3 h-3 text-[#ea580c] dark:text-[#FB923C]" />
                      <span>Já é aluna da turma? Valide seu e-mail aqui</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Coluna Direita: lg:col-span-7 (Timeline vertical elegante com trilho e os 3 pilares do Método FAC) */}
              <div className="lg:col-span-7 w-full">
                <div className="relative pl-6 sm:pl-8">
                  {/* Trilho vertical de 1px com gradiente elegante */}
                  <div
                    aria-hidden="true"
                    className="absolute left-0 sm:left-1 top-3 bottom-3 w-px bg-gradient-to-b from-transparent via-slate-300/80 dark:via-white/15 to-transparent"
                  />

                  <div className="space-y-4 sm:space-y-5">
                    {/* Card 1 — Pilar 1 · Fundação (Em destaque / Ativo) */}
                    <div
                      onClick={() => navigate('/guia')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate('/guia')
                        }
                      }}
                      className="group relative cursor-pointer"
                    >
                      {/* Nó na timeline com data/label em mono à esquerda */}
                      <div className="absolute -left-6 sm:-left-7 top-6 -translate-x-1/2 flex items-center">
                        <span className="w-3 h-3 rounded-full border-2 border-white dark:border-[#0D0522] bg-[#7c3aed] dark:bg-[#C084FC] shadow-xs" />
                      </div>

                      {/* Card com hairline de highlight no topo e borda refinada */}
                      <div className="relative rounded-xl border border-slate-300/80 dark:border-white/10 bg-white/90 dark:bg-white/[0.03] p-5 sm:p-6 transition-all duration-200 hover:border-[#7c3aed]/50 dark:hover:border-white/20 hover:shadow-sm">
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 dark:via-white/20 to-transparent"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start sm:items-center gap-3.5">
                            <div className="w-9 h-9 rounded-lg border border-[#7c3aed]/30 dark:border-[#C084FC]/30 bg-[#7c3aed]/10 dark:bg-[#C084FC]/10 text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center shrink-0">
                              <Layers className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono tracking-wider uppercase text-[#7c3aed] dark:text-[#C084FC]">
                                  Método FAC · Eixo 01
                                </span>
                              </div>
                              <h3 className="font-sans font-medium text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
                                Pilar 1 · Fundação
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                              <span>Em destaque</span>
                            </span>
                            <span className="text-xs font-mono text-slate-400 dark:text-white/40 hidden sm:inline">
                              Chão estrutural
                            </span>
                          </div>
                        </div>

                        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                          De “atendo todo mundo” para uma prática com nome, direção e preço.
                        </p>

                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-xs font-mono text-slate-500 dark:text-[#94a3b8]">
                          <span className="text-[10px] uppercase tracking-wider">
                            Sustentação clínica
                          </span>
                          <span className="inline-flex items-center gap-1 font-medium text-[#7c3aed] dark:text-[#C084FC] group-hover:translate-x-0.5 transition-transform motion-reduce:transform-none">
                            Conhecer no Guia <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2 — Pilar 2 · Atração (Esmaecido) */}
                    <div
                      onClick={() => navigate('/guia')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate('/guia')
                        }
                      }}
                      className="group relative cursor-pointer"
                    >
                      <div className="absolute -left-6 sm:-left-7 top-6 -translate-x-1/2 flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0D0522] bg-[#ea580c] dark:bg-[#FB923C]" />
                      </div>

                      <div className="relative rounded-xl border border-slate-300/80 dark:border-white/10 bg-white/80 dark:bg-white/[0.025] p-5 sm:p-6 transition-all duration-200 hover:border-[#ea580c]/50 dark:hover:border-white/20 hover:shadow-sm">
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 dark:via-white/10 to-transparent"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start sm:items-center gap-3.5">
                            <div className="w-9 h-9 rounded-lg border border-orange-300/40 dark:border-orange-500/30 bg-orange-500/10 text-[#ea580c] dark:text-[#FB923C] flex items-center justify-center shrink-0">
                              <Compass className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono tracking-wider uppercase text-[#ea580c] dark:text-[#FB923C]">
                                Método FAC · Eixo 02
                              </span>
                              <h3 className="font-sans font-medium text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#ea580c] dark:group-hover:text-[#FB923C] transition-colors">
                                Pilar 2 · Atração
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className="text-xs font-mono text-slate-400 dark:text-white/40 hidden sm:inline">
                              Presença ética
                            </span>
                          </div>
                        </div>

                        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                          De esperar indicação para ser encontrada por quem precisa de você.
                        </p>

                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-xs font-mono text-slate-500 dark:text-[#94a3b8]">
                          <span className="text-[10px] uppercase tracking-wider">
                            Posicionamento autoral
                          </span>
                          <span className="inline-flex items-center gap-1 font-medium text-[#ea580c] dark:text-[#FB923C] group-hover:translate-x-0.5 transition-transform motion-reduce:transform-none">
                            Ver detalhes <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3 — Pilar 3 · Conexão (Esmaecido) */}
                    <div
                      onClick={() => navigate('/guia')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate('/guia')
                        }
                      }}
                      className="group relative cursor-pointer"
                    >
                      <div className="absolute -left-6 sm:-left-7 top-6 -translate-x-1/2 flex items-center">
                        <span className="w-2 h-2 rounded-full border-2 border-white dark:border-[#0D0522] bg-[#7c3aed]/80 dark:bg-[#C084FC]/80" />
                      </div>

                      <div className="relative rounded-xl border border-slate-300/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] p-5 sm:p-6 transition-all duration-200 hover:border-[#7c3aed]/40 dark:hover:border-white/15 hover:shadow-sm">
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 dark:via-white/10 to-transparent"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start sm:items-center gap-3.5">
                            <div className="w-9 h-9 rounded-lg border border-purple-200/50 dark:border-purple-500/20 bg-purple-500/5 text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center shrink-0">
                              <HeartHandshake className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono tracking-wider uppercase text-[#7c3aed] dark:text-[#C084FC]">
                                Método FAC · Eixo 03
                              </span>
                              <h3 className="font-sans font-medium text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
                                Pilar 3 · Conexão
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className="text-xs font-mono text-slate-400 dark:text-white/40 hidden sm:inline">
                              Vínculo & Permanência
                            </span>
                          </div>
                        </div>

                        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                          De contatos que somem para pacientes que ficam.
                        </p>

                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-xs font-mono text-slate-500 dark:text-[#94a3b8]">
                          <span className="text-[10px] uppercase tracking-wider">
                            Permanência clínica
                          </span>
                          <span className="inline-flex items-center gap-1 font-medium text-[#7c3aed] dark:text-[#C084FC] group-hover:translate-x-0.5 transition-transform motion-reduce:transform-none">
                            Ver detalhes <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 1. O GUIA VEM PRIMEIRO: Card Hairline Estilo Resend ================= */}
        {heroItem && (
          <section aria-labelledby="secao-guia-aluna" className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-mono font-medium uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
                Percurso Pedagógico Principal
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] border border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                {heroItem.rotulo_badge || 'Aula 1 Aberta · Trilha do Ciclo'}
              </span>
            </div>

            <div className="p-6 sm:p-8 rounded-[12px] border border-slate-300/80 dark:border-white/[0.1] bg-white dark:bg-white/[0.02] transition-colors">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[8px] border border-[#7c3aed]/30 dark:border-[#C084FC]/30 bg-[#7c3aed]/10 dark:bg-[#C084FC]/10 text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                        Coração da Academia
                      </span>
                      <h2
                        id="secao-guia-aluna"
                        className="h-section font-medium text-slate-900 dark:text-white tracking-tight"
                      >
                        Guia da{' '}
                        <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                          Aluna
                        </em>
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-[#cbd5e1] leading-relaxed font-normal">
                    {heroItem.descricao ||
                      'Aula Magna aberta com o Diagnóstico FAC Aprofundado (24 perguntas), trilha completa de encontros, cadernos didáticos e validação do e-mail de compra para alunas da turma.'}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-600 dark:text-[#94a3b8] pt-1">
                    <span className="px-2 py-0.5 rounded-[4px] border border-slate-200 dark:border-white/[0.08] bg-slate-100/60 dark:bg-white/[0.02]">
                      ✓ Diagnóstico FAC 24 perguntas
                    </span>
                    <span className="px-2 py-0.5 rounded-[4px] border border-slate-200 dark:border-white/[0.08] bg-slate-100/60 dark:bg-white/[0.02]">
                      ✓ Relatório PDF com radar
                    </span>
                    <span className="px-2 py-0.5 rounded-[4px] border border-slate-200 dark:border-white/[0.08] bg-slate-100/60 dark:bg-white/[0.02]">
                      ✓ Acesso livre para toda a categoria
                    </span>
                  </div>
                </div>

                <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
                  <Button
                    onClick={() => navigate('/guia')}
                    className="w-full sm:w-auto min-h-[44px] px-6 gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#7c3aed] dark:hover:bg-[#6d28d9] text-white font-medium rounded-[8px] text-sm cursor-pointer shadow-none"
                  >
                    <span>Abrir Guia da Aluna</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  {!isAlunaValidada && (
                    <button
                      type="button"
                      onClick={() => setValidarModalOpen(true)}
                      className="w-full sm:w-auto min-h-[44px] px-4 inline-flex items-center justify-center gap-1.5 font-mono text-xs rounded-[8px] border border-slate-300/80 dark:border-white/[0.12] bg-white/40 dark:bg-white/[0.02] text-slate-700 dark:text-[#cbd5e1] hover:text-[#7c3aed] dark:hover:text-[#C084FC] hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/40 transition-colors cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
                      <span>Validar Matrícula da Turma</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= 2. BLOCO SISTEMA: Navegação Hairline Discreta e Lista Resend ================= */}
        {allSistemaItems.length > 0 && (
          <section aria-labelledby="secao-aplicativos-recursos" className="space-y-6">
            {/* Cabeçalho do Bloco com Título e Tabs Discretas Estilo Resend */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200/90 dark:border-white/[0.08]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                  <h3
                    id="secao-aplicativos-recursos"
                    className="h-section font-medium text-slate-900 dark:text-white"
                  >
                    Aplicativos e{' '}
                    <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                      recursos
                    </em>
                  </h3>
                </div>
                <p className="text-xs font-mono text-slate-500 dark:text-[#94a3b8]">
                  Launcher de ferramentas, aplicativos e skills exclusivas para alunas
                </p>
              </div>

              {/* Tabs discretas estilo Resend: texto com indicador sutil (pílula hairline) */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-full scrollbar-none py-1">
                {SISTEMA_CATEGORIAS.map((cat) => {
                  const isActive = activeSistemaCategory === cat.id
                  const countInCat =
                    cat.id === 'skills'
                      ? allSistemaItems.filter((it) => {
                          const extra = SISTEMA_ITEMS_EXTRAS[it.chave]
                          return (it.categoria || extra?.categoria) === 'skills'
                        }).length + dbSkills.length
                      : allSistemaItems.filter((it) => {
                          const extra = SISTEMA_ITEMS_EXTRAS[it.chave]
                          const itemCat = it.categoria || extra?.categoria || 'aplicativos'
                          return itemCat === cat.id
                        }).length

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveSistemaCategory(cat.id)}
                      className={`relative px-3 py-1.5 rounded-[6px] text-xs font-mono transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
                        isActive
                          ? 'text-slate-900 dark:text-white font-medium border border-slate-300 dark:border-white/[0.16] bg-white dark:bg-white/[0.05]'
                          : 'text-slate-500 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white border border-transparent'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive
                            ? 'bg-[#7c3aed]/15 dark:bg-[#C084FC]/15 text-[#7c3aed] dark:text-[#C084FC] font-medium'
                            : 'bg-slate-200/60 dark:bg-white/[0.06] text-slate-500 dark:text-[#94a3b8]'
                        }`}
                      >
                        {countInCat}
                      </span>
                      {cat.badge && (
                        <span className="w-1 h-1 rounded-full bg-[#ea580c] dark:bg-[#FB923C]" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Descrição sutil da categoria */}
            {(() => {
              const currentCatObj = SISTEMA_CATEGORIAS.find((c) => c.id === activeSistemaCategory)
              return currentCatObj?.descricao ? (
                <p className="text-xs text-slate-500 dark:text-[#94a3b8] -mt-2">
                  {currentCatObj.descricao}
                </p>
              ) : null
            })()}

            {/* GRID DE CARDS ESTILO RESEND: Borda hairline de 1px, sem sombras, organização limpa */}
            {(() => {
              const itemsNaCategoria = allSistemaItems.filter((it) => {
                const extra = SISTEMA_ITEMS_EXTRAS[it.chave]
                const itemCat = it.categoria || extra?.categoria || 'aplicativos'
                return itemCat === activeSistemaCategory
              })

              const hasDbSkills = activeSistemaCategory === 'skills' && dbSkills.length > 0

              if (itemsNaCategoria.length === 0 && !hasDbSkills) {
                return (
                  <div className="py-12 text-center rounded-[8px] border border-dashed border-slate-300/80 dark:border-white/[0.08]">
                    <p className="text-xs font-mono text-slate-500 dark:text-[#94a3b8]">
                      Nenhum item disponível nesta categoria no momento.
                    </p>
                  </div>
                )
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {/* Cards dos Itens da Categoria */}
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
                        className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-[10px] border border-slate-300/80 dark:border-white/[0.1] bg-white dark:bg-white/[0.02] hover:border-[#7c3aed]/40 dark:hover:border-[#C084FC]/30 transition-colors cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC]"
                      >
                        <div className="space-y-4">
                          {/* Cabeçalho do Card: Índice técnico + Ícone + Badge */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <span className="text-[11px] font-mono text-slate-400 dark:text-[#94a3b8]">
                                0{idx + 1}
                              </span>
                              <div className="w-8 h-8 rounded-[6px] border border-slate-200 dark:border-white/[0.08] bg-slate-100/70 dark:bg-white/[0.03] text-slate-700 dark:text-[#cbd5e1] group-hover:border-[#7c3aed]/40 dark:group-hover:border-[#C084FC]/40 group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] flex items-center justify-center shrink-0 transition-colors">
                                <IconComponent className="w-4 h-4" />
                              </div>
                            </div>

                            {/* Badge de status */}
                            {isBlocked ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] border border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-mono uppercase tracking-wider">
                                <Lock className="w-2.5 h-2.5 text-[#ea580c] dark:text-[#FB923C]" />
                                <span>Exclusivo</span>
                              </span>
                            ) : isEmBreve ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-white/[0.03] text-slate-600 dark:text-[#94a3b8] text-[10px] font-mono uppercase tracking-wider">
                                <Clock className="w-2.5 h-2.5" />
                                <span>{item.rotulo_badge || 'Em breve'}</span>
                              </span>
                            ) : isSkill ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] border border-purple-500/25 bg-purple-500/10 text-[#7c3aed] dark:text-[#C084FC] text-[10px] font-mono uppercase tracking-wider">
                                <Sparkles className="w-2.5 h-2.5 text-[#ea580c] dark:text-[#FB923C]" />
                                <span>{item.rotulo_badge || 'Skill FAC'}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] border border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono uppercase tracking-wider">
                                {item.rotulo_badge || 'Disponível'}
                              </span>
                            )}
                          </div>

                          {/* Título e Descrição */}
                          <div className="space-y-1.5">
                            <h4 className="font-serif-editorial text-base sm:text-lg font-medium text-slate-900 dark:text-white group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors leading-snug">
                              {item.titulo}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-[#cbd5e1] leading-relaxed font-normal">
                              {item.descricao}
                            </p>
                          </div>
                        </div>

                        {/* Rodapé do Card: Ação alinhada na base com filete sutil */}
                        <div className="pt-4 mt-5 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono">
                          <span className="text-[10px] text-slate-400 dark:text-[#94a3b8] uppercase tracking-wider">
                            {isSkill ? 'Instrução IA' : 'Módulo FAC'}
                          </span>

                          {isBlocked ? (
                            <div className="inline-flex items-center gap-1.5 text-[#ea580c] dark:text-[#FB923C] group-hover:underline">
                              <Lock className="w-3 h-3 shrink-0" />
                              <span>Validar matrícula</span>
                            </div>
                          ) : isSkill ? (
                            <div className="inline-flex items-center gap-1.5 font-medium text-[#7c3aed] dark:text-[#C084FC] group-hover:translate-x-0.5 transition-transform">
                              <Download className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C] shrink-0" />
                              <span>Baixar Mentora</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 font-medium text-[#7c3aed] dark:text-[#C084FC] group-hover:translate-x-0.5 transition-transform">
                              <span>Abrir app</span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {/* Cards das Skills do PocketBase no mesmo grid */}
                  {activeSistemaCategory === 'skills' &&
                    dbSkills.map((sk, skIdx) => {
                      const isBlocked = !isAlunaValidada
                      const isDownloading = downloadingSkillId === sk.id

                      return (
                        <div
                          key={sk.id}
                          onClick={() => handleDownloadDbSkill(sk)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleDownloadDbSkill(sk)
                            }
                          }}
                          aria-label={`Baixar skill ${sk.titulo}${isBlocked ? ' - Exclusivo para alunas' : ''}`}
                          className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-[10px] border border-slate-300/80 dark:border-white/[0.1] bg-white dark:bg-white/[0.02] hover:border-[#7c3aed]/40 dark:hover:border-[#C084FC]/30 transition-colors cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC]"
                        >
                          <div className="space-y-4">
                            {/* Cabeçalho do Card */}
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <span className="text-[11px] font-mono text-slate-400 dark:text-[#94a3b8]">
                                  0{itemsNaCategoria.length + skIdx + 1}
                                </span>
                                <div className="w-8 h-8 rounded-[6px] border border-slate-200 dark:border-white/[0.08] bg-slate-100/70 dark:bg-white/[0.03] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center shrink-0">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {isBlocked ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] border border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-mono uppercase tracking-wider">
                                    <Lock className="w-2.5 h-2.5 text-[#ea580c] dark:text-[#FB923C]" />
                                    <span>Exclusivo</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] border border-purple-500/25 bg-purple-500/10 text-[#7c3aed] dark:text-[#C084FC] text-[10px] font-mono uppercase tracking-wider">
                                    <Sparkles className="w-2.5 h-2.5 text-[#ea580c] dark:text-[#FB923C]" />
                                    <span>{sk.rotulo_badge || sk.versao || 'Skill FAC'}</span>
                                  </span>
                                )}

                                {sk.versao && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[4px] border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-[#94a3b8]">
                                    {sk.versao}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Título e Descrição */}
                            <div className="space-y-1.5">
                              <h4 className="font-serif-editorial text-base sm:text-lg font-medium text-slate-900 dark:text-white group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors leading-snug">
                                {sk.titulo}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-[#cbd5e1] leading-relaxed font-normal">
                                {sk.descricao || 'Pacote de instrução clínica para uso no ChatGPT.'}
                              </p>
                              <div className="text-[10px] font-mono text-slate-500 dark:text-[#94a3b8] pt-1 truncate">
                                Arquivo:{' '}
                                <strong className="text-slate-700 dark:text-[#e2e8f0] font-medium">
                                  {sk.arquivo}
                                </strong>
                              </div>
                            </div>
                          </div>

                          {/* Rodapé do Card */}
                          <div className="pt-4 mt-5 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono">
                            <span className="text-[10px] text-slate-400 dark:text-[#94a3b8] uppercase tracking-wider">
                              ChatGPT Skill
                            </span>

                            {isBlocked ? (
                              <div className="inline-flex items-center gap-1.5 text-[#ea580c] dark:text-[#FB923C] group-hover:underline">
                                <Lock className="w-3 h-3 shrink-0" />
                                <span>Validar matrícula</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 font-medium text-[#7c3aed] dark:text-[#C084FC] group-hover:translate-x-0.5 transition-transform">
                                {isDownloading ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                                    <span>Baixando...</span>
                                  </>
                                ) : (
                                  <>
                                    <Download className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C] shrink-0" />
                                    <span>Baixar Arquivo</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              )
            })()}
          </section>
        )}

        {/* ================= 3. BLOCO MATERIAL & TUTORIAIS: Cards em Grid Estilo Resend ================= */}
        {materialItems.length > 0 && (
          <section aria-labelledby="secao-materiais" className="space-y-5">
            <div className="flex items-baseline justify-between pb-3 border-b border-slate-200/90 dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
                <h3
                  id="secao-materiais"
                  className="h-section font-medium text-slate-900 dark:text-white"
                >
                  Material &{' '}
                  <em className="font-serif-anchor not-italic text-[#ea580c] dark:text-[#FB923C]">
                    Tutoriais
                  </em>
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-[#94a3b8]">
                Estudo continuado & referências
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {materialItems.map((item, idx) => {
                const IconComponent = ICON_MAP[item.icone || ''] || FileText
                const isEmBreve =
                  item.rotulo_badge?.toLowerCase().includes('breve') ||
                  item.rotulo_badge?.toLowerCase().includes('construção')

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!isEmBreve) handleItemClick(item)
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && !isEmBreve) {
                        e.preventDefault()
                        handleItemClick(item)
                      }
                    }}
                    className={`group relative flex flex-col justify-between p-5 sm:p-6 rounded-[10px] border border-slate-300/80 dark:border-white/[0.1] bg-white dark:bg-white/[0.02] transition-colors ${
                      isEmBreve
                        ? 'opacity-90'
                        : 'hover:border-[#ea580c]/40 dark:hover:border-[#FB923C]/30 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#ea580c]'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Cabeçalho do Card */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] font-mono text-[#ea580c] dark:text-[#FB923C]">
                            0{idx + 1}
                          </span>
                          <div className="w-8 h-8 rounded-[6px] border border-orange-200/60 dark:border-orange-500/20 bg-orange-500/5 text-[#ea580c] dark:text-[#FB923C] flex items-center justify-center shrink-0">
                            <IconComponent className="w-4 h-4" />
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[4px] border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-[#94a3b8] uppercase tracking-wider">
                          {item.rotulo_badge || 'Em breve'}
                        </span>
                      </div>

                      {/* Título e Descrição */}
                      <div className="space-y-1.5">
                        <h4 className="font-serif-editorial text-base sm:text-lg font-medium text-slate-900 dark:text-white group-hover:text-[#ea580c] dark:group-hover:text-[#FB923C] transition-colors leading-snug">
                          {item.titulo}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-[#cbd5e1] leading-relaxed font-normal">
                          {item.descricao}
                        </p>
                      </div>
                    </div>

                    {/* Rodapé do Card */}
                    <div className="pt-4 mt-5 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono">
                      <span className="text-[10px] text-slate-400 dark:text-[#94a3b8] uppercase tracking-wider">
                        Documentação
                      </span>

                      {isEmBreve ? (
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#94a3b8]">
                          <Clock className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
                          <span>Coordenação</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 font-medium text-[#ea580c] dark:text-[#FB923C] group-hover:translate-x-0.5 transition-transform">
                          <span>Consultar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ================= 4. CONVITE EDITORIAL FINAL: Moldura Hairline Fina Estilo Resend ================= */}
        <section
          aria-labelledby="secao-convite-academia"
          className="relative rounded-[12px] p-8 sm:p-12 border border-slate-300/80 dark:border-white/[0.1] bg-white dark:bg-white/[0.02] text-center space-y-6"
        >
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-white/[0.1] text-xs font-mono tracking-widest uppercase text-slate-700 dark:text-[#cbd5e1]">
              <Sparkles className="w-3 h-3 text-[#ea580c] dark:text-[#FB923C]" />
              <span>FORMAÇÃO CONTINUADA</span>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <span className="text-slate-500 dark:text-[#94a3b8]">MÉTODO FAC</span>
            </div>

            <h3
              id="secao-convite-academia"
              className="h-section font-medium tracking-tight text-slate-900 dark:text-white leading-snug"
            >
              Pronta para continuar seu{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                percurso
              </em>
              ?
            </h3>

            <p className="text-sm text-slate-600 dark:text-[#cbd5e1] leading-relaxed font-normal">
              Aprofunde sua prática clínica com o ciclo completo de encontros, o método FAC em
              detalhes, ferramentas exclusivas e a comunidade da Entrelaços Psicologia.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://pay.kirvano.com/36c1a314-0dc2-4bc8-9287-79fb1e804b06"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-6 gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#7c3aed] dark:hover:bg-[#6d28d9] text-white font-medium rounded-[8px] text-sm transition-colors cursor-pointer"
              >
                <span>Entrar na Academia FAC</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={LINK_ECOSSISTEMA}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-5 gap-2 rounded-[8px] border border-slate-300/80 dark:border-white/[0.12] bg-white/40 dark:bg-white/[0.02] text-slate-700 dark:text-[#cbd5e1] hover:text-[#7c3aed] dark:hover:text-[#C084FC] hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/40 text-xs font-mono font-medium transition-colors"
              >
                <span>Acessar Plataforma Ecossistema</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-[11px] font-mono text-slate-500 dark:text-[#94a3b8] pt-1">
              Acesso imediato à trilha completa pedagógica e ao ecossistema de alunas.
            </p>
          </div>
        </section>
      </main>

      {/* Footer Estilo Resend: hairline superior, limpo, tipografia mono */}
      <footer className="border-t border-slate-200/90 dark:border-white/[0.08] py-6 px-4 text-xs print:hidden mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-slate-600 dark:text-[#94a3b8]">
          <p className="text-slate-800 dark:text-[#f8fafc] font-medium">
            Entrelaços Psicologia · Academia e Método FAC · Sistema Oficial © 2026
          </p>
          <p className="text-slate-500 dark:text-[#94a3b8]">
            Plataforma pedagógica e sistemas exclusivos para alunas da Academia.
          </p>
        </div>
      </footer>

      {/* Modais existentes preservados */}
      <ValidarEmailModal
        isOpen={validarModalOpen}
        onClose={() => {
          setValidarModalOpen(false)
          setItemBloqueadoClicado(null)
        }}
        defaultEmail={currentUser?.email || ''}
        onSuccess={async (aluna) => {
          setAlunaSession(aluna)

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
