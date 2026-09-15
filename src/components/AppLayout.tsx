import React, { useState } from 'react'
import {
  Heart,
  Moon,
  Sun,
  BookOpen,
  Menu,
  X,
  Check,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Cloud,
  LogOut,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlossaryModal } from './GlossaryModal'
import { CloudBackupModal } from './CloudBackupModal'
import { AuthModal, AuthMode } from './AuthModal'
import { useCloudSync } from '@/hooks/useCloudSync'

export interface StepDef {
  index: number
  title: string
  shortLabel: string
  description: string
}

export const WIZARD_STEPS: StepDef[] = [
  {
    index: 0,
    title: 'Boas-Vindas',
    shortLabel: 'Início',
    description: 'Visão geral do Método FAC',
  },
  {
    index: 1,
    title: 'Custos Pessoais',
    shortLabel: 'Pessoais',
    description: 'Custo de vida e dignidade',
  },
  {
    index: 2,
    title: 'Custos Profissionais',
    shortLabel: 'Profissionais',
    description: 'Consultório e prática',
  },
  {
    index: 3,
    title: 'Retirada Desejada',
    shortLabel: 'Retirada',
    description: 'Pró-labore e qualidade de vida',
  },
  {
    index: 4,
    title: 'Reserva & Tributos',
    shortLabel: 'Reserva',
    description: 'Fundo técnico e impostos',
  },
  {
    index: 5,
    title: 'Capacidade Clínica',
    shortLabel: 'Capacidade',
    description: 'Horários, faltas e CFP',
  },
  {
    index: 6,
    title: 'Painel de Resultados',
    shortLabel: 'Resultados',
    description: 'Piso FAC, gráficos e IA',
  },
  {
    index: 7,
    title: 'Modelos Clínicos',
    shortLabel: 'Modelos',
    description: 'Comparativo dos 4 modelos',
  },
]

interface LayoutProps {
  children: React.ReactNode
  activeStep: number
  onSelectStep: (step: number) => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onOpenTour?: () => void
  onOpenCloudBackup?: () => void
  onOpenAuth?: (mode?: AuthMode) => void
}

export const AppLayout: React.FC<LayoutProps> = ({
  children,
  activeStep,
  onSelectStep,
  theme,
  onToggleTheme,
  onOpenTour,
  onOpenCloudBackup,
  onOpenAuth,
}) => {
  const { currentUser, isConnected, logout } = useCloudSync()
  const [glossaryOpen, setGlossaryOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cloudBackupOpen, setCloudBackupOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login')

  const handleOpenAuth = (mode: AuthMode = 'login') => {
    if (onOpenAuth) {
      onOpenAuth(mode)
    } else {
      setAuthModalMode(mode)
      setAuthModalOpen(true)
    }
  }

  const handleOpenCloud = () => {
    if (onOpenCloudBackup) {
      onOpenCloudBackup()
    } else {
      // Se não estiver conectada, abrir a tela rica de login/cadastro
      if (!isConnected) {
        handleOpenAuth('login')
      } else {
        setCloudBackupOpen(true)
      }
    }
  }

  const handleStepClick = (stepIndex: number) => {
    onSelectStep(stepIndex)
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#03000A] text-white flex flex-col font-sans transition-colors duration-200 astral-glow-bg">
      {/* Topbar Fixa Astral */}
      <header className="sticky top-0 z-40 bg-[#0A0A14]/90 backdrop-blur-md border-b border-[#27272A] shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Marca Astral */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectStep(0)}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden focus:ring-2 focus:ring-[#C084FC] rounded-[8px] p-1"
              aria-label="Ir para a página inicial"
            >
              <div className="w-9 h-9 rounded-[8px] bg-[#18181B] border border-[#27272A] text-[#C084FC] flex items-center justify-center shadow-inner group-hover:border-[#C084FC]/50 transition-colors">
                <Heart className="w-4.5 h-4.5 fill-[#C084FC]/25 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-semibold text-base tracking-tight text-white flex items-center gap-1.5">
                  Método FAC
                  <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-[4px] bg-[#18181B] border border-[#27272A] text-[#C084FC]">
                    Astral
                  </span>
                </span>
                <span className="text-[11px] text-[#A1A1AA] -mt-0.5 font-normal">
                  Precificação Clínica Ética
                </span>
              </div>
            </button>
          </div>

          {/* Progresso Compacto Mobile (<1024px) */}
          <div className="flex lg:hidden items-center gap-1.5 bg-[#18181B] border border-[#27272A] px-2.5 py-1 rounded-[8px] text-xs font-mono font-medium text-[#A1A1AA]">
            <span className="text-[#C084FC] font-semibold">PASSO {activeStep}</span>
            <span className="text-[#71717A]">/</span>
            <span>7</span>
            <span className="hidden sm:inline-block ml-1 truncate max-w-[110px] text-[#A1A1AA]">
              · {WIZARD_STEPS[activeStep]?.shortLabel}
            </span>
          </div>

          {/* Ações da Direita */}
          <div className="flex items-center gap-2">
            {/* Botão Nuvem / Sincronização */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenCloud}
              className="min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 border-[#27272A] bg-[#18181B] text-white hover:bg-[#1f1f23] hover:border-[#C084FC]/40 rounded-[8px]"
              aria-label="Backup em Nuvem e Sincronização"
              title={`Sincronização em Nuvem (${currentUser?.email || 'Conectada'})`}
            >
              <span className="w-2 h-2 rounded-full bg-[#FB923C] animate-pulse" />
              <Cloud className="w-4 h-4 text-[#C084FC]" />
              <span className="hidden sm:inline font-mono text-xs font-semibold">Nuvem</span>
            </Button>

            {/* Identificação de Usuária no Desktop */}
            <div
              className="hidden xl:flex flex-col text-right pl-2 pr-1 border-l border-[#27272A] max-w-[160px]"
              title={`Usuária logada: ${currentUser?.email}`}
            >
              <span className="text-xs font-medium text-white truncate">
                {currentUser?.name || 'Psicóloga'}
              </span>
              <span className="text-[10px] font-mono text-[#A1A1AA] truncate -mt-0.5">
                {currentUser?.email}
              </span>
            </div>
            {/* Link para o Painel Admin se a usuária for admin */}
            {currentUser?.role === 'admin' && (
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-xs font-mono font-semibold bg-[#18181B] border border-[#27272A] text-[#C084FC] hover:border-[#C084FC]/50 transition-colors"
                title="Painel de Administração FAC"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FB923C]" />
                <span className="hidden sm:inline">ADMIN</span>
              </a>
            )}

            {/* Identidade da Usuária Logada e Acesso a Minha Senha */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenAuth('change-password')}
              className="min-h-[44px] sm:min-h-0 sm:h-9 text-xs font-mono font-medium text-[#C084FC] hover:bg-[#18181B] hover:text-white px-2.5 hidden md:inline-flex rounded-[8px]"
              title="Gerenciar credenciais e senha"
            >
              SENHA
            </Button>

            {onOpenTour && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenTour}
                className="min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 border-[#27272A] bg-[#18181B] text-white hover:bg-[#1f1f23] hover:border-[#C084FC]/40 rounded-[8px]"
                aria-label="Abrir Tour Guiado da Calculadora"
                title="Tour Guiado da Calculadora"
              >
                <HelpCircle className="w-4 h-4 text-[#C084FC]" />
                <span className="hidden sm:inline font-mono text-xs font-semibold">TOUR</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setGlossaryOpen(true)}
              className="min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 border-[#27272A] bg-[#18181B] text-white hover:bg-[#1f1f23] hover:border-[#C084FC]/40 rounded-[8px]"
              aria-label="Abrir Glossário"
            >
              <BookOpen className="w-4 h-4 text-[#C084FC]" />
              <span className="hidden sm:inline font-mono text-xs font-semibold">GLOSSÁRIO</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="h-9 w-9 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-[8px]"
              aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-[#FB923C]" />
              )}
            </Button>

            {/* Botão Sair Desktop */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout()
                window.location.href = '/login'
              }}
              className="min-h-[44px] sm:min-h-0 sm:h-9 text-xs font-mono font-medium text-rose-400 hover:bg-rose-950/30 gap-1 px-2.5 hidden md:inline-flex rounded-[8px]"
              title="Encerrar sessão e voltar ao login"
              aria-label="Sair do sistema"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>SAIR</span>
            </Button>

            {/* Hambúrguer Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-9 w-9 text-white rounded-[8px]"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        {/* Barra de Progresso Horizontal Astral */}
        <div className="w-full bg-[#18181B] h-0.5">
          <div
            className="bg-gradient-to-r from-[#C084FC] via-[#FB923C] to-[#C084FC] h-0.5 transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, (activeStep / 7) * 100)}%` }}
          />
        </div>
      </header>

      {/* Conteúdo Principal com Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Fixa Desktop (>= 1024px) Astral Nested Surface */}
        <aside className="hidden lg:block w-72 shrink-0 border-r border-[#27272A] p-6 bg-[#0A0A14] min-h-[calc(100vh-4.25rem)] sticky top-16 print:hidden">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#A1A1AA]">
              Jornada FAC
            </h2>
            <span className="text-xs font-mono font-bold text-[#C084FC]">
              {Math.round((activeStep / 7) * 100)}%
            </span>
          </div>

          <nav className="space-y-1.5" aria-label="Progresso da calculadora">
            {WIZARD_STEPS.map((step) => {
              const isCurrent = activeStep === step.index
              const isPast = activeStep > step.index

              return (
                <button
                  key={step.index}
                  onClick={() => handleStepClick(step.index)}
                  className={`w-full text-left p-3 rounded-[12px] flex items-center gap-3 transition-all duration-150 group border ${
                    isCurrent
                      ? 'bg-[#18181B] border-[#C084FC] text-white shadow-md shadow-[#C084FC]/10 font-medium'
                      : isPast
                        ? 'bg-[#121216] border-[#27272A] text-[#A1A1AA] hover:text-white hover:border-[#3F3F46]'
                        : 'bg-transparent border-transparent text-[#71717A] hover:bg-[#18181B]/40 hover:text-[#A1A1AA]'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-[8px] flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-[#C084FC] text-[#0A0A14]'
                        : isPast
                          ? 'bg-[#18181B] text-[#FB923C] border border-[#27272A]'
                          : 'bg-[#18181B] text-[#71717A]'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.index}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm truncate ${
                        isCurrent
                          ? 'text-white font-medium'
                          : 'text-[#A1A1AA] group-hover:text-white'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p
                      className={`text-[11px] truncate font-mono ${
                        isCurrent ? 'text-[#C084FC]' : 'text-[#71717A]'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                  {isCurrent && <ChevronRight className="w-4 h-4 text-[#C084FC] shrink-0" />}
                </button>
              )
            })}
          </nav>

          {/* Card Dica Metodológica Astral */}
          <div className="mt-8 p-4 rounded-[12px] bg-[#18181B] border border-[#27272A]">
            <div className="flex items-center gap-2 text-[#C084FC] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FB923C]" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#C084FC]">
                Pilar Metodológico
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              O Método FAC inverte a lógica do mercado: parte do seu custo real de vida para chegar
              ao piso justo por sessão.
            </p>
          </div>
        </aside>

        {/* Menu Overlay Mobile (< 1024px) Astral */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex print:hidden">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-80 max-w-[85vw] bg-[#0A0A14] border-r border-[#27272A] h-full shadow-2xl p-6 flex flex-col z-10 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#27272A] mb-4">
                <span className="font-sans font-semibold text-lg text-white">
                  Passos da Calculadora
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8 text-[#A1A1AA] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 flex-1">
                {WIZARD_STEPS.map((step) => {
                  const isCurrent = activeStep === step.index
                  const isPast = activeStep > step.index

                  return (
                    <button
                      key={step.index}
                      onClick={() => handleStepClick(step.index)}
                      className={`w-full text-left p-3 rounded-[12px] flex items-center gap-3 transition-colors border ${
                        isCurrent
                          ? 'bg-[#18181B] border-[#C084FC] text-white font-medium'
                          : isPast
                            ? 'bg-[#121216] border-[#27272A] text-[#A1A1AA]'
                            : 'bg-transparent border-transparent text-[#71717A]'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-[8px] flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                          isCurrent
                            ? 'bg-[#C084FC] text-[#0A0A14]'
                            : isPast
                              ? 'bg-[#18181B] text-[#FB923C] border border-[#27272A]'
                              : 'bg-[#18181B] text-[#71717A]'
                        }`}
                      >
                        {isPast ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.index}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{step.title}</p>
                        <p
                          className={`text-[11px] truncate font-mono ${isCurrent ? 'text-[#C084FC]' : 'text-[#71717A]'}`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="pt-4 border-t border-[#27272A] space-y-2">
                {/* Usuária logada no mobile */}
                <div className="p-3 rounded-[12px] bg-[#18181B] border border-[#27272A] text-xs">
                  <div className="font-semibold text-white truncate">
                    {currentUser?.name || 'Psicóloga'}
                  </div>
                  <div className="text-[11px] font-mono text-[#A1A1AA] truncate">
                    {currentUser?.email}
                  </div>
                  {currentUser?.role === 'admin' && (
                    <div className="mt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#C084FC]">
                        <Shield className="w-3 h-3" /> PAPEL ADMIN
                      </span>
                    </div>
                  )}
                </div>

                {currentUser?.role === 'admin' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      window.location.href = '/admin'
                    }}
                    className="w-full justify-center gap-2 min-h-[44px] bg-[#18181B] border-[#27272A] text-[#C084FC] font-mono text-xs font-semibold rounded-[8px]"
                  >
                    <Shield className="w-4 h-4 text-[#FB923C]" />
                    PAINEL ADMIN
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleOpenAuth('change-password')
                  }}
                  className="w-full justify-center gap-2 min-h-[44px] bg-[#18181B] border-[#27272A] text-white font-mono text-xs rounded-[8px]"
                >
                  <Cloud className="w-4 h-4 text-[#C084FC]" />
                  MINHA SENHA
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setCloudBackupOpen(true)
                  }}
                  className="w-full justify-center gap-2 min-h-[44px] bg-[#18181B] border-[#27272A] text-white font-mono text-xs rounded-[8px]"
                >
                  <Cloud className="w-4 h-4 text-[#FB923C]" />
                  BACKUP EM NUVEM
                </Button>
                {onOpenTour && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onOpenTour()
                    }}
                    className="w-full justify-center gap-2 min-h-[44px] bg-[#18181B] border-[#27272A] text-white font-mono text-xs rounded-[8px]"
                  >
                    <HelpCircle className="w-4 h-4 text-[#C084FC]" />
                    TOUR GUIADO
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setGlossaryOpen(true)
                  }}
                  className="w-full justify-center gap-2 min-h-[44px] bg-[#18181B] border-[#27272A] text-white font-mono text-xs rounded-[8px]"
                >
                  <BookOpen className="w-4 h-4 text-[#C084FC]" />
                  GLOSSÁRIO
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                    window.location.href = '/login'
                  }}
                  className="w-full justify-center gap-2 min-h-[44px] bg-[#18181B] border-rose-900/50 text-rose-400 hover:bg-rose-950/30 font-mono text-xs rounded-[8px]"
                >
                  <LogOut className="w-4 h-4" />
                  SAIR DO SISTEMA
                </Button>
              </div>{' '}
            </div>
          </div>
        )}

        {/* Área Central de Conteúdo Astral */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Footer Slim Astral */}
      <footer className="border-t border-[#27272A] bg-[#0A0A14] py-4 px-4 text-center text-xs text-[#A1A1AA] print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px]">
          <p className="text-white font-medium">
            Entrelaços Psicologia — Método FAC · Astral System © 2026
          </p>
          <p className="text-[#71717A]">
            Cálculos pedagógicos. Não substituem consultoria contábil ou jurídica.
          </p>
        </div>
      </footer>

      {/* Modal do Glossário */}
      <GlossaryModal isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />

      {/* Modal de Backup em Nuvem */}
      <CloudBackupModal isOpen={cloudBackupOpen} onClose={() => setCloudBackupOpen(false)} />

      {/* Tela de Login / Cadastro / Recuperação de Senha (AuthModal) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          // Após login/cadastro com sucesso, abrir o painel de sincronização
          setTimeout(() => {
            setAuthModalOpen(false)
            setCloudBackupOpen(true)
          }, 600)
        }}
      />
    </div>
  )
}
