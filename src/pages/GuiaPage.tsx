import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Compass,
  ArrowLeft,
  Moon,
  Sun,
  BookOpen,
  Sparkles,
  LogOut,
  Layers,
  ChevronRight,
  Calculator,
  Lock,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Download,
  ExternalLink,
  Loader2,
  FileText,
  AlertTriangle,
  PlayCircle,
  HelpCircle,
  KeyRound,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Maximize2,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { FACLogo, FACSymbol } from '@/components/FACLogo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCloudSync } from '@/hooks/useCloudSync'
import { ENCONTRO_1_CONTENT } from '@/config/guiaContent'
import { DiagnosticoFACSection } from '@/components/guia/DiagnosticoFACSection'
import { Encontro1CadernoCompleto } from '@/components/guia/Encontro1CadernoCompleto'
import { ValidarEmailModal } from '@/components/guia/ValidarEmailModal'
import {
  AlunaGuiaService,
  AlunaSession,
  EncontroResumo,
  EncontroDetalhe,
} from '@/services/alunaGuiaService'

const STORAGE_KEY_THEME = 'entrelacos_fac_theme_mode'
const STORAGE_KEY_SIDEBAR_OPEN = 'entrelacos_fac_guia_sidebar_open'

export const GuiaPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, isConnected, isAdmin, logout } = useCloudSync()
  const [validarModalOpen, setValidarModalOpen] = useState(false)

  // Controle de expansão/ocultação do menu de trilha (Desktop)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SIDEBAR_OPEN)
      if (saved !== null) {
        return saved === 'true'
      }
    } catch {
      // ignore
    }
    return true
  })

  // Gaveta móvel da trilha (Mobile Sheet)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false)

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY_SIDEBAR_OPEN, String(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  // Sessão da aluna (validação do e-mail de compra)
  const [alunaSession, setAlunaSession] = useState<AlunaSession | null>(() =>
    AlunaGuiaService.getLocalSession(),
  )

  // Encontro atualmente selecionado (padrão: 1)
  const [encontroSelecionado, setEncontroSelecionado] = useState<number>(1)

  // Lista de encontros do ciclo carregada do backend
  const [encontrosList, setEncontrosList] = useState<EncontroResumo[]>([])
  const [loadingEncontros, setLoadingEncontros] = useState<boolean>(true)
  // Dados do encontro detalhado (obtido sob demanda com validação de matrícula)
  const [encontroDetalhe, setEncontroDetalhe] = useState<EncontroDetalhe | null>(null)
  const [loadingDetalhe, setLoadingDetalhe] = useState<boolean>(false)
  const [erroAcesso, setErroAcesso] = useState<{
    tipo: 'restrito' | 'suspensa' | 'expirada' | 'erro'
    mensagem: string
  } | null>(null)

  // Tema Claro/Escuro Astral
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

  // Carregar lista de encontros
  useEffect(() => {
    const fetchEncontros = async () => {
      setLoadingEncontros(true)
      try {
        const list = await AlunaGuiaService.listarEncontros()
        setEncontrosList(list)
      } catch (err) {
        console.warn('Erro ao listar encontros:', err)
      } finally {
        setLoadingEncontros(false)
      }
    }
    fetchEncontros()
  }, [])

  // Carregar conteúdo do encontro selecionado
  useEffect(() => {
    const carregarEncontro = async () => {
      setErroAcesso(null)

      if (encontroSelecionado === 1) {
        // Encontro 1 é estático e aberto
        setEncontroDetalhe({
          numero: 1,
          titulo: ENCONTRO_1_CONTENT.titulo,
          status: 'publicado',
          data_prevista: ENCONTRO_1_CONTENT.data,
          is_publico: true,
          autorizado: true,
        })
        return
      }

      setLoadingDetalhe(true)
      try {
        const token = alunaSession?.token || ''
        const res = await AlunaGuiaService.buscarEncontro(encontroSelecionado, token)

        if (res.success && res.encontro) {
          setEncontroDetalhe(res.encontro)
        } else {
          setErroAcesso({
            tipo:
              (res.status as 'suspensa' | 'expirada') || (res.requires_login ? 'restrito' : 'erro'),
            mensagem: res.message || 'Acesso restrito.',
          })
          setEncontroDetalhe(res.encontro || null)
        }
      } catch (err: unknown) {
        const errorData = (
          err as { data?: { message?: string; status?: string; requires_login?: boolean } }
        )?.data
        const status = errorData?.status
        const requiresLogin = errorData?.requires_login
        const msg = errorData?.message || 'Acesso indisponível no momento.'

        if (status === 'suspensa') {
          setErroAcesso({ tipo: 'suspensa', mensagem: msg })
        } else if (status === 'expirada') {
          setErroAcesso({ tipo: 'expirada', mensagem: msg })
        } else if (requiresLogin) {
          setErroAcesso({ tipo: 'restrito', mensagem: msg })
        } else {
          setErroAcesso({ tipo: 'erro', mensagem: msg })
        }
        setEncontroDetalhe(null)
      } finally {
        setLoadingDetalhe(false)
      }
    }

    carregarEncontro()
  }, [encontroSelecionado, alunaSession])

  const handleSairSessaoAluna = () => {
    AlunaGuiaService.clearLocalSession()
    setAlunaSession(null)
    setEncontroSelecionado(1)
  }

  // Verifica se o encontro 1 deve mostrar a variante pública ou com complementos
  const isAlunaValidada =
    isAdmin || currentUser?.verified === true || (!!alunaSession && alunaSession.status === 'ativa')

  // Componente interno reutilizável da lista da trilha de encontros (usado tanto no desktop quanto no mobile sheet)
  const renderTrilhaContent = (isMobileSheet = false) => (
    <div className="space-y-4">
      <div className="p-4 sm:p-5 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#27272A] mb-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
            <span>Trilha de Encontros</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500 dark:text-[#71717A]">
            Ciclo de Formação
          </span>
        </div>

        {loadingEncontros ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500 flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#7c3aed]" />
            <span>Carregando encontros...</span>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[60vh] lg:max-h-[580px] overflow-y-auto pr-1">
            {/* Encontro 1 */}
            <button
              type="button"
              onClick={() => {
                setEncontroSelecionado(1)
                if (isMobileSheet) setMobileDrawerOpen(false)
              }}
              className={`w-full text-left p-3 rounded-[10px] text-xs transition-all flex items-center justify-between cursor-pointer ${
                encontroSelecionado === 1
                  ? 'bg-purple-100/70 dark:bg-purple-950/40 text-slate-900 dark:text-white border border-[#7c3aed] dark:border-[#C084FC] font-semibold ring-1 ring-[#7c3aed]/20'
                  : 'bg-slate-50/70 dark:bg-[#121216] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-[#27272A] hover:bg-purple-50 dark:hover:bg-[#1f1f23]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div className="truncate">
                  <p className="truncate font-medium">Aula Magna Aberta</p>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-[#71717A]">
                    06/10/2026
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[9px] font-mono shrink-0">
                Aberta
              </Badge>
            </button>

            {/* Demais Encontros do Ciclo */}
            {encontrosList
              .filter((e) => e.numero >= 2)
              .map((enc) => {
                const isAtivo = encontroSelecionado === enc.numero
                const isPublicado = enc.status === 'publicado'

                return (
                  <button
                    key={enc.numero}
                    type="button"
                    onClick={() => {
                      setEncontroSelecionado(enc.numero)
                      if (isMobileSheet) setMobileDrawerOpen(false)
                    }}
                    className={`w-full text-left p-3 rounded-[10px] text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isAtivo
                        ? 'bg-purple-100/70 dark:bg-purple-950/40 text-slate-900 dark:text-white border border-[#7c3aed] dark:border-[#C084FC] font-semibold ring-1 ring-[#7c3aed]/20'
                        : 'bg-slate-50/70 dark:bg-[#121216] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-[#27272A] hover:bg-slate-100 dark:hover:bg-[#1f1f23]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-[#27272A] text-slate-700 dark:text-[#A1A1AA] font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                        {enc.numero}
                      </span>
                      <div className="truncate">
                        <p className="truncate font-medium">{enc.titulo}</p>
                        <p className="text-[10px] font-mono text-slate-500 dark:text-[#71717A]">
                          {enc.data_prevista || 'Em breve'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isPublicado ? (
                        isAlunaValidada ? (
                          <Badge className="bg-purple-500/15 text-[#7c3aed] dark:text-[#C084FC] border-[#7c3aed]/30 text-[9px] font-mono">
                            Liberado
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[9px] font-mono text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 gap-1"
                          >
                            <Lock className="w-2.5 h-2.5" />
                            Alunas
                          </Badge>
                        )
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[9px] font-mono text-slate-500 dark:text-[#71717A] border-slate-300 dark:border-[#3f3f46]"
                        >
                          Em breve
                        </Badge>
                      )}
                    </div>
                  </button>
                )
              })}
          </div>
        )}
      </div>

      {/* Caixa de Aviso Pedagógico */}
      <div className="p-4 sm:p-5 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-xs text-slate-600 dark:text-[#A1A1AA] space-y-2">
        <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
          Regras de Acesso Pedagógico
        </p>
        <p className="text-[11px] leading-relaxed">
          A Aula 1 é 100% aberta e gratuita. Os demais encontros do ciclo são exclusivos para alunas
          matriculadas. O calendário não publica automaticamente: cada encontro é disponibilizado
          manualmente antes da respectiva aula ao vivo.
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#03000A] text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-200 astral-glow-bg">
      {/* Topbar Astral */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0A0A14]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#27272A] shadow-xs dark:shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center text-left group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC] rounded-[8px] p-1 transition-opacity hover:opacity-90"
              aria-label="Página inicial"
            >
              <FACLogo size="md" subtitle="Academia Entrelaços" />
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="min-h-[44px] h-10 px-2.5 sm:px-3 gap-1.5 border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f23] rounded-[8px] text-xs font-mono font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              <span className="hidden sm:inline">HUB</span>
            </Button>

            {/* Atalho Perfil e Senha */}
            <Link
              to="/perfil"
              className="inline-flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 min-h-[44px] rounded-[8px] text-xs font-mono font-semibold bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/50 transition-colors"
              title="Acessar Perfil e Alterar Senha"
              aria-label="Perfil e Senha"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
              <span className="hidden sm:inline">PERFIL</span>
            </Link>

            {/* Status da Aluna / Botão Validar E-mail */}
            {isAlunaValidada ? (
              <div
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-mono"
                title={`Matrícula Ativa: ${alunaSession?.email}`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Aluna</span>
                <button
                  type="button"
                  onClick={handleSairSessaoAluna}
                  className="text-rose-500 hover:text-rose-700 ml-1 text-[11px] underline"
                  title="Desconectar e-mail de aluna deste navegador"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setValidarModalOpen(true)}
                className="min-h-[44px] h-10 px-2.5 sm:px-3 gap-1 border-purple-300 dark:border-[#7c3aed]/50 bg-purple-50 dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-100 dark:hover:bg-[#27272A] rounded-[8px] text-xs font-mono font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
                <span className="hidden xs:inline">JÁ SOU ALUNA</span>
                <span className="xs:hidden">ALUNA</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-10 w-10 min-h-[44px] min-w-[44px] text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#18181B] rounded-[8px]"
              aria-label={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-[#FB923C]" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Subcabeçalho / Breadcrumbs */}
      <div className="border-b border-slate-200 dark:border-[#27272A] bg-white/60 dark:bg-[#0A0A14]/60 backdrop-blur-xs py-2.5 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#A1A1AA] min-w-0">
            <Link
              to="/"
              className="hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
            >
              Academia
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[#7c3aed] dark:text-[#C084FC] font-semibold truncate">
              Guia da Aluna · Trilha do Ciclo
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isAlunaValidada && (
              <span className="inline-flex text-emerald-600 dark:text-emerald-400 font-semibold items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Matrícula Ativa
              </span>
            )}

            {/* Botão Mobile para abrir a gaveta da Trilha */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden min-h-[36px] h-9 px-2.5 gap-1.5 border-purple-200 dark:border-[#27272A] bg-purple-50/70 dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-100 dark:hover:bg-[#27272A] rounded-[8px] text-xs font-mono font-semibold"
              aria-label="Abrir menu da Trilha de Encontros"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Trilha</span>
            </Button>
          </div>
        </div>
      </div>

      {/* HERO DA AULA MAGNA ABERTA */}
      <section className="bg-white dark:bg-[#0A0A14] border-b border-slate-200 dark:border-[#27272A] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-xs font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
            <span>AULA MAGNA ABERTA</span>
            <span className="text-slate-400 dark:text-[#71717A]">•</span>
            <span className="text-slate-600 dark:text-[#A1A1AA]">ENCONTRO 1 · 06/10/2026</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl lg:text-[3.75rem] font-medium tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            O Chão da Clínica Sustentável & os Três Pilares FAC.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-[#A1A1AA] leading-relaxed max-w-3xl mx-auto font-light">
            A Aula 1 do Guia é gratuita e aberta a toda a categoria. Aqui você realiza o{' '}
            <strong className="text-slate-900 dark:text-white font-medium">
              Diagnóstico FAC Aprofundado — Versão 2
            </strong>
            , descobre a saúde dos seus pilares (Fundação, Atração, Conexão) e conhece os
            fundamentos do Método FAC.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => {
                setEncontroSelecionado(1)
                const el = document.getElementById('caderno-encontro-1')
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] min-h-[44px] px-5 text-sm shadow-xs"
            >
              <span>Acessar Aula Magna Aberta</span>
            </Button>
            {!isAlunaValidada && (
              <Button
                variant="outline"
                onClick={() => setValidarModalOpen(true)}
                className="border-purple-300 dark:border-[#7c3aed]/50 text-[#7c3aed] dark:text-[#C084FC] font-semibold rounded-[8px] min-h-[44px] px-5 text-sm"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5 text-[#ea580c] dark:text-[#FB923C]" />
                <span>Já sou aluna: Validar e-mail de compra</span>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* MAPA DE ENCONTROS (LAYOUT EM DUAS COLUNAS: MENU LATERAL + CONTEÚDO AMPLIADO) */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-12 transition-all duration-300">
        {/* Barra superior de comando da área de conteúdo (Alternar trilha / Encontro atual / Status) */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-3.5 sm:px-5 rounded-[14px] bg-white/90 dark:bg-[#121216]/90 border border-slate-200 dark:border-[#27272A] backdrop-blur-sm shadow-2xs">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Botão Desktop Premium: Recolher/Expandir menu lateral com acabamento refinado */}
            <button
              type="button"
              onClick={toggleSidebar}
              className={`hidden lg:inline-flex items-center gap-2 min-h-[40px] h-10 px-3.5 rounded-[10px] text-xs font-mono font-medium transition-all duration-200 border cursor-pointer group shadow-2xs ${
                isSidebarOpen
                  ? 'border-purple-200 dark:border-purple-900/60 bg-purple-50/60 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 hover:bg-purple-100/80 dark:hover:bg-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700'
                  : 'border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#222227] hover:border-purple-300 dark:hover:border-purple-800'
              }`}
              title={
                isSidebarOpen
                  ? 'Ocultar menu lateral da trilha para expandir a área de leitura'
                  : 'Expandir menu lateral da trilha de encontros'
              }
              aria-expanded={isSidebarOpen}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  isSidebarOpen
                    ? 'bg-purple-200/70 dark:bg-purple-800/50 text-[#7c3aed] dark:text-[#C084FC]'
                    : 'bg-slate-100 dark:bg-[#27272A] text-slate-600 dark:text-[#A1A1AA] group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC]'
                }`}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                ) : (
                  <PanelLeftOpen className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                )}
              </div>
              <span className="tracking-tight font-semibold">
                {isSidebarOpen ? 'Ocultar Trilha' : 'Expandir Trilha'}
              </span>
            </button>

            {/* Botão Mobile: Abrir menu da trilha em gaveta */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 min-h-[40px] h-10 px-3.5 rounded-[10px] border border-purple-200 dark:border-[#27272A] bg-purple-50/70 dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] text-xs font-mono font-semibold cursor-pointer shadow-2xs hover:bg-purple-100/70 dark:hover:bg-[#222227] transition-colors"
            >
              <Compass className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
              <span>Ver Trilha</span>
            </button>

            <span className="hidden sm:inline-block h-5 w-px bg-slate-200 dark:bg-[#27272A]" />

            {/* Identificação do encontro em foco */}
            <div className="flex items-center gap-2 text-xs sm:text-[13px] font-mono">
              <span className="text-slate-500 dark:text-[#71717A]">Visualizando:</span>
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7c3aed] dark:bg-[#C084FC] animate-pulse" />
                Encontro {encontroSelecionado} {encontroSelecionado === 1 ? '— Aula Magna' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-[#A1A1AA]">
            {!isSidebarOpen && (
              <span className="hidden lg:inline-flex items-center gap-1 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-[6px] border border-purple-200 dark:border-purple-800/40">
                <Maximize2 className="w-3 h-3" />
                Modo Tela Expandida Ativo
              </span>
            )}
            <span className="hidden md:inline">Ciclo de Encontros</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
          {/* Coluna Esquerda: Trilha Completa de Encontros (Desktop - Ocultável com transição suave) */}
          {isSidebarOpen && (
            <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 2xl:col-span-3 space-y-4 sticky top-24 transition-all duration-300 animate-fade-in">
              {renderTrilhaContent(false)}
            </aside>
          )}

          {/* Coluna Direita: Conteúdo do Encontro Selecionado (Expande com tela ampla e generosa se fechado) */}
          <section
            className={`space-y-10 transition-all duration-300 ${
              isSidebarOpen
                ? 'lg:col-span-8 xl:col-span-9 2xl:col-span-9'
                : 'lg:col-span-12 w-full max-w-6xl mx-auto'
            }`}
          >
            {encontroSelecionado === 1 ? (
              <div
                id="caderno-encontro-1"
                className="space-y-16 sm:space-y-20 scroll-mt-20 w-full transition-all duration-300"
              >
                {/* Caderno Editorial Completo do Encontro 1 */}
                <Encontro1CadernoCompleto
                  onAbrirDiagnostico={() => {
                    const el = document.getElementById('secao-diagnostico-fac')
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                  isAlunaValidada={isAlunaValidada}
                  onValidarEmail={() => setValidarModalOpen(true)}
                  onAvancarEncontro2={() => {
                    setEncontroSelecionado(2)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                />

                {/* DIAGNÓSTICO FAC APROFUNDADO V2 (MOTOR COMPLETO COM ÂNCORA) */}
                <div
                  id="secao-diagnostico-fac"
                  className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200/80 dark:border-[#27272A]"
                >
                  <div className="flex items-center gap-3.5 pb-2">
                    <FACSymbol size={36} />
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                      <h3 className="font-sans text-2xl font-semibold text-slate-900 dark:text-white">
                        Diagnóstico FAC Aprofundado — Versão 2
                      </h3>
                      <span className="text-xs font-mono text-purple-700 dark:text-purple-300 font-medium">
                        (Versão 2 · 04/10/2026)
                      </span>
                    </div>
                  </div>
                  <DiagnosticoFACSection />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {loadingDetalhe ? (
                  <div className="p-16 text-center text-xs font-mono text-slate-500 flex flex-col items-center justify-center gap-3 bg-white dark:bg-[#18181B] rounded-[16px] border border-slate-200 dark:border-[#27272A]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#7c3aed] dark:text-[#C084FC]" />
                    <span>Verificando credenciais e carregando caderno...</span>
                  </div>
                ) : erroAcesso ? (
                  /* Telas de Bloqueio Ético e Suporte (SEM expor conteúdo pago) */
                  <div className="p-8 sm:p-10 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-lg text-center space-y-6">
                    <div className="w-14 h-14 rounded-[12px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] mx-auto flex items-center justify-center">
                      <Lock className="w-7 h-7 text-[#ea580c] dark:text-[#FB923C]" />
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <h3 className="font-sans text-xl font-semibold text-slate-900 dark:text-white">
                        {erroAcesso.tipo === 'suspensa'
                          ? 'Acesso Temporariamente Suspenso'
                          : erroAcesso.tipo === 'expirada'
                            ? 'Período da Turma Concluído'
                            : 'Encontro Exclusivo para Alunas'}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                        {erroAcesso.mensagem}
                      </p>
                    </div>

                    {erroAcesso.tipo === 'restrito' && (
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button
                          onClick={() => setValidarModalOpen(true)}
                          className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-xs rounded-[8px] min-h-[44px]"
                        >
                          <ShieldCheck className="w-4 h-4 mr-2" />
                          <span>Validar meu e-mail de compra</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEncontroSelecionado(1)}
                          className="text-xs font-mono rounded-[8px] min-h-[44px]"
                        >
                          Voltar para Aula Aberta
                        </Button>
                      </div>
                    )}

                    {(erroAcesso.tipo === 'suspensa' || erroAcesso.tipo === 'expirada') && (
                      <div className="pt-2">
                        <a
                          href="mailto:contato@entrelacos.entrelacospsicologia.com.br"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[8px] bg-slate-100 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] text-xs font-mono font-semibold text-slate-800 dark:text-white hover:border-[#7c3aed]"
                        >
                          <span>Falar com o Suporte da Academia</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                ) : encontroDetalhe?.em_breve ? (
                  /* Encontro em Rascunho / Futuro */
                  <div className="p-8 sm:p-10 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md text-center space-y-4">
                    <Badge className="bg-slate-100 dark:bg-[#27272A] text-slate-600 dark:text-[#A1A1AA] border-slate-200 dark:border-[#3f3f46] font-mono text-xs">
                      Em breve · Encontro {encontroDetalhe.numero}
                    </Badge>
                    <h3 className="font-sans text-xl font-semibold text-slate-900 dark:text-white">
                      {encontroDetalhe.titulo}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
                      O caderno e as atividades deste encontro serão liberados pela coordenação
                      pedagógica antes da data da aula ao vivo (
                      {encontroDetalhe.data_prevista || 'Em breve'}).
                    </p>
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEncontroSelecionado(1)}
                        className="text-xs font-mono rounded-[8px]"
                      >
                        Ver Aula Magna Aberta
                      </Button>
                    </div>
                  </div>
                ) : encontroDetalhe ? (
                  /* Encontro Pago Liberado com Sucesso! */
                  <div className="p-8 sm:p-12 lg:p-14 rounded-[20px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-10 w-full transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-[#27272A]">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
                          Caderno Didático Exclusivo · Encontro {encontroDetalhe.numero}
                        </span>
                        <h2 className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl font-medium text-slate-900 dark:text-white">
                          {encontroDetalhe.titulo}
                        </h2>
                        <p className="text-xs font-mono text-slate-500 dark:text-[#A1A1AA] mt-1">
                          Data prevista: {encontroDetalhe.data_prevista}
                        </p>
                      </div>

                      <Badge className="bg-purple-500/15 text-[#7c3aed] dark:text-[#C084FC] border-[#7c3aed]/30 text-xs font-mono px-3 py-1 self-start sm:self-auto">
                        Turma Ativa
                      </Badge>
                    </div>

                    {encontroDetalhe.conteudo?.introducao && (
                      <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-[#121216] p-6 sm:p-7 rounded-[14px] border border-slate-200 dark:border-[#27272A] font-light">
                        {encontroDetalhe.conteudo.introducao}
                      </div>
                    )}

                    {/* Seções do caderno */}
                    {encontroDetalhe.conteudo?.secoes &&
                      encontroDetalhe.conteudo.secoes.length > 0 && (
                        <div className="space-y-5">
                          <h3 className="font-sans text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                            Orientações & Atividades do Encontro
                          </h3>
                          <div className="grid grid-cols-1 gap-5">
                            {encontroDetalhe.conteudo.secoes.map((sec, idx) => (
                              <div
                                key={idx}
                                className="p-6 sm:p-7 rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] space-y-2.5 shadow-2xs"
                              >
                                <h4 className="font-sans font-semibold text-base sm:text-lg text-slate-900 dark:text-white">
                                  {sec.titulo}
                                </h4>
                                <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-[#A1A1AA] leading-relaxed whitespace-pre-line font-light">
                                  {sec.texto}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Recursos e Links */}
                    {encontroDetalhe.recursos && encontroDetalhe.recursos.length > 0 && (
                      <div className="pt-4 border-t border-slate-200 dark:border-[#27272A] space-y-3">
                        <h4 className="font-sans font-semibold text-sm text-slate-900 dark:text-white">
                          Aplicações & Materiais Vinculados
                        </h4>
                        <div className="flex flex-wrap gap-2.5">
                          {encontroDetalhe.recursos.map((rec, rIdx) => (
                            <Button
                              key={rIdx}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (rec.url.startsWith('http')) {
                                  window.open(rec.url, '_blank')
                                } else {
                                  navigate(rec.url)
                                }
                              }}
                              className="font-mono text-xs gap-1.5 border-purple-200 dark:border-[#7c3aed]/40 text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-50 dark:hover:bg-[#18181B] rounded-[8px]"
                            >
                              <span>{rec.rotulo}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Aviso de gravações na plataforma da turma */}
                    <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] text-xs text-slate-600 dark:text-[#A1A1AA] flex items-start gap-2.5">
                      <PlayCircle className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C] shrink-0 mt-0.5" />
                      <span>
                        Gravações e entregas oficiais ficam hospedadas na plataforma da turma da
                        Academia e podem exigir login específico de aluna da Entrelaços.
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer Astral */}
      <footer className="border-t border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] py-4 px-4 text-center text-xs text-slate-600 dark:text-[#A1A1AA] print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px]">
          <p className="text-slate-800 dark:text-white font-medium">
            Entrelaços Psicologia: Academia & Método FAC · Astral System © 2026
          </p>
          <p className="text-slate-400 dark:text-[#71717A]">
            Materiais pedagógicos de autoria e precificação para psicólogas.
          </p>
        </div>
      </footer>

      {/* Gaveta Móvel da Trilha de Encontros (Mobile Sheet) */}
      <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent
          side="left"
          className="w-full sm:max-w-md p-6 bg-slate-50 dark:bg-[#0A0A14] border-r border-slate-200 dark:border-[#27272A] overflow-y-auto"
        >
          <SheetHeader className="text-left pb-4 border-b border-slate-200 dark:border-[#27272A]">
            <SheetTitle className="font-serif-editorial text-2xl font-normal text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#7c3aed] dark:text-[#C084FC]" />
              <span>Trilha de Encontros</span>
            </SheetTitle>
            <SheetDescription className="text-xs font-mono text-slate-500 dark:text-[#A1A1AA]">
              Selecione o encontro para visualizar o caderno pedagógico e orientações do ciclo.
            </SheetDescription>
          </SheetHeader>

          <div className="py-4">{renderTrilhaContent(true)}</div>
        </SheetContent>
      </Sheet>

      {/* Modais */}
      <ValidarEmailModal
        isOpen={validarModalOpen}
        onClose={() => setValidarModalOpen(false)}
        defaultEmail={currentUser?.email || ''}
        onSuccess={(aluna) => {
          setAlunaSession(aluna)
        }}
      />
    </div>
  )
}

export default GuiaPage
