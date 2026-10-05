import React, { useState } from 'react'
import {
  Moon,
  Sun,
  BookOpen,
  Menu,
  X,
  Check,
  ChevronRight,
  Sparkles,
  HelpCircle,
  LogOut,
  Shield,
  KeyRound,
  User,
} from 'lucide-react'
import { FACLogo } from '@/components/FACLogo'
import { CloudStatusIcon } from '@/components/CloudStatusIcon'
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
  onOpenAuth?: (mode?: AuthMode) => void
}

export const AppLayout: React.FC<LayoutProps> = ({
  children,
  activeStep,
  onSelectStep,
  theme,
  onToggleTheme,
  onOpenTour,
  onOpenAuth,
}) => {
  const { currentUser, isConnected, isSyncing, logout } = useCloudSync()
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

  const handleStepClick = (stepIndex: number) => {
    onSelectStep(stepIndex)
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#03000A] text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-200 astral-glow-bg">
      {/* Topbar Fixa Astral */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0A0A14]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#27272A] shadow-xs dark:shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Marca Astral */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center text-left group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC] rounded-[8px] p-1 transition-opacity hover:opacity-90"
              aria-label="Voltar para a página inicial da Academia Entrelaços"
            >
              <FACLogo size="md" />
            </a>
          </div>

          {/* Progresso Compacto Mobile (<1024px) */}
          <div className="flex lg:hidden items-center gap-1.5 bg-slate-100 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] px-2.5 py-1 rounded-[8px] text-xs font-mono font-medium text-slate-700 dark:text-[#A1A1AA]">
            <span className="text-[#7c3aed] dark:text-[#C084FC] font-semibold">
              PASSO {activeStep}
            </span>
            <span className="text-slate-400 dark:text-[#71717A]">/</span>
            <span>7</span>
            <span className="hidden sm:inline-block ml-1 truncate max-w-[110px] text-slate-600 dark:text-[#A1A1AA]">
              · {WIZARD_STEPS[activeStep]?.shortLabel}
            </span>
          </div>

          {/* Ações da Direita */}
          <div className="flex items-center gap-2">
            {/* Indicador de Status da Nuvem no Cabeçalho (somente leitura / sem ação de botão) */}
            <div
              className="inline-flex items-center min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 px-2.5 py-1.5 border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-800 dark:text-white rounded-[8px] select-none"
              aria-label="Status da sincronização em nuvem"
              title={
                isSyncing
                  ? 'Sincronizando alterações automaticamente com a nuvem...'
                  : isConnected
                    ? `Nuvem conectada e sincronizada (${currentUser?.email || 'Conectada'})`
                    : 'Desconectada da nuvem'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSyncing
                    ? 'bg-[#ea580c] dark:bg-[#FB923C] animate-ping'
                    : isConnected
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                }`}
              />
              <CloudStatusIcon
                status={isSyncing ? 'syncing' : isConnected ? 'connected' : 'disconnected'}
                size={16}
                strokeWidth={1.75}
                className="text-[#7c3aed] dark:text-[#C084FC]"
              />
              <span className="hidden sm:inline font-mono text-xs font-semibold">
                {isSyncing ? 'Sincronizando' : 'Nuvem'}
              </span>
            </div>

            {/* Identificação de Usuária no Desktop */}
            <div
              className="hidden xl:flex flex-col text-right pl-2 pr-1 border-l border-slate-200 dark:border-[#27272A] max-w-[160px]"
              title={`Usuária logada: ${currentUser?.email}`}
            >
              <span className="text-xs font-medium text-slate-900 dark:text-white truncate">
                {currentUser?.name || 'Psicóloga'}
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-[#A1A1AA] truncate -mt-0.5">
                {currentUser?.email}
              </span>
            </div>
            {/* Link para o Painel Admin se a usuária for admin */}
            {currentUser?.role === 'admin' && (
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-xs font-mono font-semibold bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/50 transition-colors"
                title="Painel de Administração FAC"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
                <span className="hidden sm:inline">ADMIN</span>
              </a>
            )}

            {/* Botão de Retorno ao Hub da Academia */}
            <a
              href="/"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-xs font-mono font-semibold bg-slate-100 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:border-[#7c3aed]/40 transition-colors"
              title="Ir para o Hub de Aplicações da Academia"
            >
              <span className="hidden sm:inline">HUB ACADEMIA</span>
            </a>

            {/* Link para o Guia / Retrato de Autoria */}
            <a
              href="/guia/retrato-de-autoria"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-xs font-mono font-semibold bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] hover:border-[#7c3aed]/60 transition-colors"
              title="Guia da Skill: Retrato de Autoria"
            >
              <span className="hidden sm:inline">RETRATO</span>
            </a>

            {/* Atalho Perfil & Troca de Senha */}
            <a
              href="/perfil"
              className="min-h-[44px] sm:min-h-0 sm:h-9 text-xs font-mono font-medium text-[#7c3aed] dark:text-[#C084FC] hover:bg-slate-100 dark:hover:bg-[#18181B] hover:text-slate-900 dark:hover:text-white px-2.5 hidden md:inline-flex items-center gap-1 rounded-[8px]"
              title="Gerenciar perfil e trocar senha"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>PERFIL & SENHA</span>
            </a>

            {onOpenTour && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenTour}
                className="min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f23] hover:border-[#7c3aed]/40 dark:hover:border-[#C084FC]/40 rounded-[8px]"
                aria-label="Abrir Tour Guiado da Calculadora"
                title="Tour Guiado da Calculadora"
              >
                <HelpCircle className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                <span className="hidden sm:inline font-mono text-xs font-semibold">TOUR</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setGlossaryOpen(true)}
              className="min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f23] hover:border-[#7c3aed]/40 dark:hover:border-[#C084FC]/40 rounded-[8px]"
              aria-label="Abrir Glossário"
            >
              <BookOpen className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              <span className="hidden sm:inline font-mono text-xs font-semibold">GLOSSÁRIO</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="h-9 w-9 text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#18181B] rounded-[8px]"
              aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
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
              className="min-h-[44px] sm:min-h-0 sm:h-9 text-xs font-mono font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1 px-2.5 hidden md:inline-flex rounded-[8px]"
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
              className="lg:hidden h-9 w-9 text-slate-800 dark:text-white rounded-[8px]"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        {/* Barra de Progresso Horizontal Astral */}
        <div className="w-full bg-slate-200 dark:bg-[#18181B] h-0.5">
          <div
            className="bg-gradient-to-r from-[#7c3aed] via-[#ea580c] to-[#7c3aed] dark:from-[#C084FC] dark:via-[#FB923C] dark:to-[#C084FC] h-0.5 transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, (activeStep / 7) * 100)}%` }}
          />
        </div>
      </header>

      {/* Conteúdo Principal com Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Fixa Desktop (>= 1024px) Astral Nested Surface */}
        <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-200 dark:border-[#27272A] p-6 bg-slate-50/70 dark:bg-[#0A0A14] min-h-[calc(100vh-4.25rem)] sticky top-16 print:hidden">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1AA]">
              Jornada FAC
            </h2>
            <span className="text-xs font-mono font-bold text-[#7c3aed] dark:text-[#C084FC]">
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
                      ? 'bg-white dark:bg-[#18181B] border-[#7c3aed] dark:border-[#C084FC] text-slate-900 dark:text-white shadow-md shadow-[#7c3aed]/10 dark:shadow-[#C084FC]/10 font-medium'
                      : isPast
                        ? 'bg-slate-100/80 dark:bg-[#121216] border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-[#3F3F46]'
                        : 'bg-transparent border-transparent text-slate-400 dark:text-[#71717A] hover:bg-slate-100 dark:hover:bg-[#18181B]/40 hover:text-slate-700 dark:hover:text-[#A1A1AA]'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-[8px] flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-[#7c3aed] dark:bg-[#C084FC] text-white dark:text-[#0A0A14]'
                        : isPast
                          ? 'bg-orange-50 dark:bg-[#18181B] text-[#ea580c] dark:text-[#FB923C] border border-orange-200 dark:border-[#27272A]'
                          : 'bg-slate-200 dark:bg-[#18181B] text-slate-500 dark:text-[#71717A]'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.index}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm truncate ${
                        isCurrent
                          ? 'text-slate-900 dark:text-white font-medium'
                          : 'text-slate-700 dark:text-[#A1A1AA] group-hover:text-slate-900 dark:group-hover:text-white'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p
                      className={`text-[11px] truncate font-mono ${
                        isCurrent
                          ? 'text-[#7c3aed] dark:text-[#C084FC]'
                          : 'text-slate-400 dark:text-[#71717A]'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                  {isCurrent && (
                    <ChevronRight className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC] shrink-0" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Card Dica Metodológica Astral */}
          <div className="mt-8 p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs">
            <div className="flex items-center gap-2 text-[#7c3aed] dark:text-[#C084FC] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                Pilar Metodológico
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
              O Método FAC inverte a lógica do mercado: parte do seu custo real de vida para chegar
              ao piso justo por sessão.
            </p>
          </div>
        </aside>

        {/* Menu Overlay Mobile (< 1024px) Astral */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex print:hidden">
            <div
              className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-80 max-w-[85vw] bg-white dark:bg-[#0A0A14] border-r border-slate-200 dark:border-[#27272A] h-full shadow-2xl p-6 flex flex-col z-10 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#27272A] mb-4">
                <span className="font-sans font-semibold text-lg text-slate-900 dark:text-white">
                  Passos da Calculadora
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8 text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white"
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
                          ? 'bg-purple-50 dark:bg-[#18181B] border-[#7c3aed] dark:border-[#C084FC] text-slate-900 dark:text-white font-medium'
                          : isPast
                            ? 'bg-slate-100 dark:bg-[#121216] border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-[#A1A1AA]'
                            : 'bg-transparent border-transparent text-slate-400 dark:text-[#71717A]'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-[8px] flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                          isCurrent
                            ? 'bg-[#7c3aed] dark:bg-[#C084FC] text-white dark:text-[#0A0A14]'
                            : isPast
                              ? 'bg-orange-50 dark:bg-[#18181B] text-[#ea580c] dark:text-[#FB923C] border border-orange-200 dark:border-[#27272A]'
                              : 'bg-slate-200 dark:bg-[#18181B] text-slate-500 dark:text-[#71717A]'
                        }`}
                      >
                        {isPast ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.index}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate text-slate-900 dark:text-white">
                          {step.title}
                        </p>
                        <p
                          className={`text-[11px] truncate font-mono ${isCurrent ? 'text-[#7c3aed] dark:text-[#C084FC]' : 'text-slate-500 dark:text-[#71717A]'}`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-[#27272A] space-y-2">
                {/* Usuária logada no mobile */}
                <div className="p-3 rounded-[12px] bg-slate-100 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white truncate">
                    {currentUser?.name || 'Psicóloga'}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-[#A1A1AA] truncate">
                    {currentUser?.email}
                  </div>
                  {currentUser?.role === 'admin' && (
                    <div className="mt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                        <Shield className="w-3 h-3" /> PAPEL ADMIN
                      </span>
                    </div>
                  )}
                </div>

                {/* Links Rápidos Mobile: Hub, Retrato e Perfil/Senha */}
                <a
                  href="/"
                  className="w-full flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 bg-slate-100 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-slate-800 dark:text-white font-mono text-xs rounded-[8px]"
                >
                  HUB DA ACADEMIA
                </a>
                <a
                  href="/perfil"
                  className="w-full flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs rounded-[8px] font-semibold"
                >
                  <KeyRound className="w-4 h-4" />
                  PERFIL & TROCA DE SENHA
                </a>
                <a
                  href="/guia/retrato-de-autoria"
                  className="w-full flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 bg-slate-100 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-[#A1A1AA] font-mono text-xs rounded-[8px]"
                >
                  RETRATO DE AUTORIA (GUIA)
                </a>

                {currentUser?.role === 'admin' && (
                  <a
                    href="/admin"
                    className="w-full flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 bg-purple-100/70 dark:bg-purple-950/40 border border-[#7c3aed] text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs rounded-[8px] font-semibold"
                  >
                    <Sparkles className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
                    PAINEL ADMINISTRATIVO
                  </a>
                )}

                {/* Status da Nuvem no menu mobile (apenas indicador informativo, sem ação de botão) */}
                <div
                  className="w-full flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-slate-300 font-mono text-xs rounded-[8px] select-none"
                  title={
                    isSyncing
                      ? 'Sincronizando alterações automaticamente com a nuvem...'
                      : isConnected
                        ? `Nuvem conectada e sincronizada (${currentUser?.email || 'Conectada'})`
                        : 'Desconectada da nuvem'
                  }
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSyncing
                        ? 'bg-[#ea580c] dark:bg-[#FB923C] animate-ping'
                        : isConnected
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                    }`}
                  />
                  <CloudStatusIcon
                    status={isSyncing ? 'syncing' : isConnected ? 'connected' : 'disconnected'}
                    size={16}
                    strokeWidth={1.75}
                    className="text-[#7c3aed] dark:text-[#C084FC]"
                  />
                  <span>
                    {isSyncing
                      ? 'SINCRONIZANDO COM A NUVEM...'
                      : isConnected
                        ? 'NUVEM SINCRONIZADA'
                        : 'NUVEM DESCONECTADA'}
                  </span>
                </div>
                {onOpenTour && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onOpenTour()
                    }}
                    className="w-full justify-center gap-2 min-h-[44px] bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] text-slate-800 dark:text-white font-mono text-xs rounded-[8px]"
                  >
                    <HelpCircle className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                    TOUR GUIADO
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setGlossaryOpen(true)
                  }}
                  className="w-full justify-center gap-2 min-h-[44px] bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] text-slate-800 dark:text-white font-mono text-xs rounded-[8px]"
                >
                  <BookOpen className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                  GLOSSÁRIO
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                    window.location.href = '/login'
                  }}
                  className="w-full justify-center gap-2 min-h-[44px] bg-white dark:bg-[#18181B] border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-mono text-xs rounded-[8px]"
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
      <footer className="border-t border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] py-4 px-4 text-center text-xs text-slate-600 dark:text-[#A1A1AA] print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px]">
          <p className="text-slate-800 dark:text-white font-medium">
            Entrelaços Psicologia — Método FAC · Astral System © 2026
          </p>
          <p className="text-slate-400 dark:text-[#71717A]">
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
          setAuthModalOpen(false)
        }}
      />
    </div>
  )
}
