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
} from 'lucide-react'
import { FACLogo } from '@/components/FACLogo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCloudSync } from '@/hooks/useCloudSync'
import { ENCONTRO_1_CONTENT } from '@/config/guiaContent'
import { DiagnosticoFACSection } from '@/components/guia/DiagnosticoFACSection'
import { ValidarEmailModal } from '@/components/guia/ValidarEmailModal'
import { RetratoDeAutoriaSection } from '@/components/RetratoDeAutoriaSection'
import {
  AlunaGuiaService,
  AlunaSession,
  EncontroResumo,
  EncontroDetalhe,
} from '@/services/alunaGuiaService'

const STORAGE_KEY_THEME = 'entrelacos_fac_theme_mode'

export const GuiaPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, isConnected, isAdmin, logout } = useCloudSync()
  const [validarModalOpen, setValidarModalOpen] = useState(false)

  // Sessão da aluna (validação do e-mail de compra)
  const [alunaSession, setAlunaSession] = useState<AlunaSession | null>(() =>
    AlunaGuiaService.getLocalSession(),
  )

  // Encontro atualmente selecionado (1 a 19, padrão: 1)
  // Ou modo Retrato de Autoria se a rota for /guia/retrato-de-autoria
  const isRetratoRoute = window.location.pathname.includes('retrato-de-autoria')
  const [encontroSelecionado, setEncontroSelecionado] = useState<number>(1)
  const [exibirSkillRetrato, setExibirSkillRetrato] = useState<boolean>(isRetratoRoute)

  // Lista dos 19 encontros carregada do backend
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

  // Carregar lista dos 19 encontros
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
  const isAlunaValidada = !!alunaSession && alunaSession.status === 'ativa'

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

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f23] rounded-[8px] text-xs font-mono font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              <span className="hidden sm:inline">HUB DA ACADEMIA</span>
            </Button>

            {/* Atalho Perfil e Senha */}
            <Link
              to="/perfil"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-xs font-mono font-semibold bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/50 transition-colors"
              title="Acessar Perfil e Alterar Senha"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
              <span className="hidden sm:inline">PERFIL & SENHA</span>
            </Link>

            {/* Status da Aluna / Botão Validar E-mail */}
            {isAlunaValidada ? (
              <div
                className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-mono"
                title={`Matrícula Ativa: ${alunaSession?.email}`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Aluna:</span>
                <span className="text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                  {alunaSession?.email}
                </span>
                <button
                  type="button"
                  onClick={handleSairSessaoAluna}
                  className="text-rose-500 hover:text-rose-700 ml-1 text-[11px]"
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
                className="min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 border-purple-300 dark:border-[#7c3aed]/50 bg-purple-50 dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-100 dark:hover:bg-[#27272A] rounded-[8px] text-xs font-mono font-semibold"
              >
                <ShieldCheck className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
                <span>JÁ SOU ALUNA</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#18181B] rounded-[8px]"
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
      <div className="border-b border-slate-200 dark:border-[#27272A] bg-white/60 dark:bg-[#0A0A14]/60 backdrop-blur-xs py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#A1A1AA]">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Academia
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#7c3aed] dark:text-[#C084FC] font-semibold">
              Guia da Aluna · Percurso dos 19 Encontros
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAlunaValidada && (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Matrícula Ativa ({alunaSession?.ciclo || 'Ciclo 2026'})
              </span>
            )}
            <button
              type="button"
              onClick={() => setExibirSkillRetrato(!exibirSkillRetrato)}
              className="text-[#ea580c] dark:text-[#FB923C] hover:underline cursor-pointer"
            >
              {exibirSkillRetrato ? '← Voltar ao Guia da Aluna' : 'Skill Retrato de Autoria →'}
            </button>
          </div>
        </div>
      </div>

      {/* HERO DA AULA MAGNA ABERTA */}
      <section className="bg-white dark:bg-[#0A0A14] border-b border-slate-200 dark:border-[#27272A] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-xs font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
            <span>AULA MAGNA ABERTA</span>
            <span className="text-slate-400 dark:text-[#71717A]">•</span>
            <span className="text-slate-600 dark:text-[#A1A1AA]">ENCONTRO 1 · 06/10/2026</span>
          </div>

          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            O Chão da Clínica Sustentável & os Três Pilares FAC.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-[#A1A1AA] leading-relaxed max-w-2xl mx-auto">
            A Aula 1 do Guia é gratuita e aberta a toda a categoria. Aqui você realiza o{' '}
            <strong className="text-slate-900 dark:text-white">
              Diagnóstico FAC Aprofundado versão 2
            </strong>
            , descobre a saúde dos seus pilares (Fundação, Atração, Conexão) e conhece os
            fundamentos do Método FAC.
          </p>

          {!isAlunaValidada && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={() => setEncontroSelecionado(1)}
                className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] min-h-[44px]"
              >
                <span>Acessar Aula Magna Aberta</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setValidarModalOpen(true)}
                className="border-purple-300 dark:border-[#7c3aed]/50 text-[#7c3aed] dark:text-[#C084FC] font-semibold rounded-[8px] min-h-[44px]"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5 text-[#ea580c] dark:text-[#FB923C]" />
                <span>Já sou aluna: Validar e-mail de compra</span>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* MAPA DOS 19 ENCONTROS (LAYOUT EM DUAS COLUNAS: MENU LATERAL + CONTEÚDO) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Esquerda: Índice dos 19 Encontros */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#27272A] mb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                  <span>Índice dos 19 Encontros</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-[#71717A]">
                  Turma 2026
                </span>
              </div>

              {loadingEncontros ? (
                <div className="p-8 text-center text-xs font-mono text-slate-500 flex flex-col items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#7c3aed]" />
                  <span>Carregando encontros...</span>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
                  {/* Encontro 1 */}
                  <button
                    type="button"
                    onClick={() => {
                      setEncontroSelecionado(1)
                      setExibirSkillRetrato(false)
                    }}
                    className={`w-full text-left p-3 rounded-[10px] text-xs transition-all flex items-center justify-between cursor-pointer ${
                      encontroSelecionado === 1
                        ? 'bg-purple-100/70 dark:bg-purple-950/40 text-slate-900 dark:text-white border border-[#7c3aed] dark:border-[#C084FC] font-semibold'
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

                  {/* Encontros 2 a 19 */}
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
                            setExibirSkillRetrato(false)
                          }}
                          className={`w-full text-left p-3 rounded-[10px] text-xs transition-all flex items-center justify-between cursor-pointer ${
                            isAtivo
                              ? 'bg-purple-100/70 dark:bg-purple-950/40 text-slate-900 dark:text-white border border-[#7c3aed] dark:border-[#C084FC] font-semibold'
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
            <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-xs text-slate-600 dark:text-[#A1A1AA] space-y-2">
              <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                Regras de Acesso Pedagógico
              </p>
              <p className="text-[11px] leading-relaxed">
                A Aula 1 é 100% aberta e gratuita. Os encontros 2 a 19 são exclusivos para alunas
                matriculadas. O calendário não publica automaticamente: cada encontro é
                disponibilizado manualmente antes da respectiva aula ao vivo.
              </p>
            </div>
          </aside>

          {/* Coluna Direita: Conteúdo do Encontro Selecionado ou Retrato de Autoria */}
          <section className="lg:col-span-8 space-y-8">
            {exibirSkillRetrato ? (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExibirSkillRetrato(false)}
                  className="gap-1.5 font-mono text-xs rounded-[8px]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar aos Encontros</span>
                </Button>
                <RetratoDeAutoriaSection />
              </div>
            ) : encontroSelecionado === 1 ? (
              <div className="space-y-8">
                {/* Caderno Didático do Encontro 1 */}
                <div className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-[#27272A]">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                        Caderno Didático · Acesso Aberto Gratuito
                      </span>
                      <h2 className="font-sans text-2xl font-semibold text-slate-900 dark:text-white">
                        {ENCONTRO_1_CONTENT.titulo}
                      </h2>
                      <p className="text-xs font-mono text-slate-500 dark:text-[#A1A1AA] mt-0.5">
                        {ENCONTRO_1_CONTENT.subtitulo}
                      </p>
                    </div>

                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs font-mono px-3 py-1">
                      Encontro 1
                    </Badge>
                  </div>

                  <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/70 dark:bg-[#121216] p-5 rounded-[12px] border border-slate-200 dark:border-[#27272A]">
                    {ENCONTRO_1_CONTENT.introducao}
                  </div>

                  {/* 4 Seções do Caderno (Preparar / Participar / Construir / Entregar) */}
                  <div className="space-y-4">
                    <h3 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
                      Estrutura do Encontro 1
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      {ENCONTRO_1_CONTENT.secoesCaderno.map((sec) => (
                        <div
                          key={sec.id}
                          className="p-5 rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-sans font-semibold text-base text-slate-900 dark:text-white">
                              {sec.titulo}
                            </h4>
                            <span className="text-[11px] font-mono text-slate-500 dark:text-[#71717A]">
                              {sec.descricao}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed whitespace-pre-line">
                            {sec.conteudo}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Complemento exclusivo para Alunas Validadas no Encontro 1 */}
                  {isAlunaValidada ? (
                    <div className="p-5 rounded-[12px] bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-[#7c3aed]/40 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
                        <h4 className="font-sans font-semibold text-sm text-[#7c3aed] dark:text-[#C084FC]">
                          Complemento Exclusivo de Continuidade (Turma Ativa)
                        </h4>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        Como aluna com matrícula validada, você tem acesso à Trilha de Continuidade,
                        ao grupo de troca com as facilitadoras e aos cadernos didáticos da Turma.
                        Seus exercícios do Diagnóstico servirão de base para o Encontro 2 e para as
                        reflexões da sua formação.
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => setEncontroSelecionado(2)}
                          className="bg-[#7c3aed] text-white hover:bg-[#6d28d9] font-mono text-xs rounded-[8px]"
                        >
                          Avançar para o Caderno do Encontro 2 →
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-sans font-semibold text-sm text-slate-900 dark:text-white">
                          Já se matriculou na Academia Método FAC?
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-[#A1A1AA] mt-0.5">
                          Valide seu e-mail de compra para liberar os Encontros 2 a 19 e as
                          gravações.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setValidarModalOpen(true)}
                        className="bg-[#ea580c] hover:bg-[#c2410c] dark:bg-[#FB923C] dark:hover:bg-[#f97316] text-white dark:text-[#0A0A14] font-semibold text-xs rounded-[8px] shrink-0"
                      >
                        Validar E-mail de Compra
                      </Button>
                    </div>
                  )}
                </div>

                {/* DIAGNÓSTICO FAC APROFUNDADO V2 (MOTOR COMPLETO) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#7c3aed] dark:text-[#C084FC]" />
                    <h3 className="font-sans text-xl font-semibold text-slate-900 dark:text-white">
                      Diagnóstico FAC Aprofundado (Versão 2)
                    </h3>
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
                  <div className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-[#27272A]">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
                          Caderno Didático Exclusivo · Encontro {encontroDetalhe.numero}
                        </span>
                        <h2 className="font-sans text-2xl font-semibold text-slate-900 dark:text-white">
                          {encontroDetalhe.titulo}
                        </h2>
                        <p className="text-xs font-mono text-slate-500 dark:text-[#A1A1AA] mt-0.5">
                          Data prevista: {encontroDetalhe.data_prevista}
                        </p>
                      </div>

                      <Badge className="bg-purple-500/15 text-[#7c3aed] dark:text-[#C084FC] border-[#7c3aed]/30 text-xs font-mono px-3 py-1">
                        Turma Ativa
                      </Badge>
                    </div>

                    {encontroDetalhe.conteudo?.introducao && (
                      <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-[#121216] p-5 rounded-[12px] border border-slate-200 dark:border-[#27272A]">
                        {encontroDetalhe.conteudo.introducao}
                      </div>
                    )}

                    {/* Seções do caderno */}
                    {encontroDetalhe.conteudo?.secoes &&
                      encontroDetalhe.conteudo.secoes.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
                            Orientações & Atividades do Encontro
                          </h3>
                          <div className="grid grid-cols-1 gap-4">
                            {encontroDetalhe.conteudo.secoes.map((sec, idx) => (
                              <div
                                key={idx}
                                className="p-5 rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] space-y-2"
                              >
                                <h4 className="font-sans font-semibold text-base text-slate-900 dark:text-white">
                                  {sec.titulo}
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed whitespace-pre-line">
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
