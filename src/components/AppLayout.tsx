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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlossaryModal } from './GlossaryModal'
import { CloudBackupModal } from './CloudBackupModal'

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
}

export const AppLayout: React.FC<LayoutProps> = ({
  children,
  activeStep,
  onSelectStep,
  theme,
  onToggleTheme,
  onOpenTour,
  onOpenCloudBackup,
}) => {
  const [glossaryOpen, setGlossaryOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cloudBackupOpen, setCloudBackupOpen] = useState(false)

  const handleOpenCloud = () => {
    if (onOpenCloudBackup) {
      onOpenCloudBackup()
    } else {
      setCloudBackupOpen(true)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    onSelectStep(stepIndex)
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#080C16] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Topbar Fixa */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0d1322]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Marca */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectStep(0)}
              className="flex items-center gap-2 text-left group focus:outline-hidden focus:ring-2 focus:ring-[#5B3A8E] rounded-lg p-1"
              aria-label="Ir para a página inicial"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#5B3A8E] to-[#452A6F] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 fill-white/20" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  Método FAC
                  <span className="text-[10px] font-sans font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#EDE8F5] text-[#5B3A8E] dark:bg-purple-950 dark:text-purple-300">
                    Entrelaços
                  </span>
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 -mt-0.5 font-medium">
                  Precificação Clínica Ética
                </span>
              </div>
            </button>
          </div>

          {/* Progresso Compacto Mobile (<1024px) */}
          <div className="flex lg:hidden items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="text-[#5B3A8E] dark:text-purple-400 font-bold">
              Passo {activeStep}
            </span>
            <span className="text-slate-400">/</span>
            <span>7</span>
            <span className="hidden sm:inline-block ml-1 truncate max-w-[110px] text-slate-600 dark:text-slate-400">
              · {WIZARD_STEPS[activeStep]?.shortLabel}
            </span>
          </div>

          {/* Ações da Direita */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenCloud}
              className="min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-[#F5F2F9] dark:hover:bg-slate-800 hover:text-[#5B3A8E] dark:hover:text-purple-300"
              aria-label="Sincronização e Backup em Nuvem"
              title="Backup em Nuvem Multi-dispositivo"
            >
              <Cloud className="w-4 h-4 text-[#5B3A8E] dark:text-purple-400" />
              <span className="hidden sm:inline font-medium">Nuvem</span>
            </Button>

            {onOpenTour && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenTour}
                className="min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-[#F5F2F9] dark:hover:bg-slate-800 hover:text-[#5B3A8E] dark:hover:text-purple-300"
                aria-label="Abrir Tour Guiado da Calculadora"
                title="Tour Guiado da Calculadora"
              >
                <HelpCircle className="w-4 h-4 text-[#5B3A8E] dark:text-purple-400" />
                <span className="hidden sm:inline font-medium">Tour</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setGlossaryOpen(true)}
              className="min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-[#F5F2F9] dark:hover:bg-slate-800 hover:text-[#5B3A8E] dark:hover:text-purple-300"
              aria-label="Abrir Glossário"
            >
              <BookOpen className="w-4 h-4 text-[#5B3A8E] dark:text-purple-400" />
              <span className="hidden sm:inline font-medium">Glossário</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="h-9 w-9 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </Button>

            {/* Hambúrguer Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-9 w-9 text-slate-700 dark:text-slate-300"
              aria-label="Abrir menu de passos"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Barra de Progresso Horizontal Fluida (Mobile & Desktop) */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1">
          <div
            className="bg-linear-to-r from-[#5B3A8E] via-[#16746E] to-[#5B3A8E] h-1 transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, (activeStep / 7) * 100)}%` }}
          />
        </div>
      </header>

      {/* Conteúdo Principal com Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Fixa Desktop (>= 1024px) */}
        <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 p-6 bg-white/60 dark:bg-[#0c1220]/60 backdrop-blur-xs min-h-[calc(100vh-4.25rem)] sticky top-16 print:hidden">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Jornada de Precificação
            </h2>
            <span className="text-xs font-semibold text-[#5B3A8E] dark:text-purple-400">
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
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-150 group ${
                    isCurrent
                      ? 'bg-[#5B3A8E] text-white shadow-sm font-semibold'
                      : isPast
                        ? 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-[#F5F2F9] dark:hover:bg-slate-800'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-white text-[#5B3A8E]'
                        : isPast
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.index}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm truncate ${
                        isCurrent
                          ? 'text-white font-medium'
                          : 'text-slate-800 dark:text-slate-200 group-hover:text-[#5B3A8E] dark:group-hover:text-purple-300'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p
                      className={`text-[11px] truncate ${
                        isCurrent ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                  {isCurrent && <ChevronRight className="w-4 h-4 text-white/80 shrink-0" />}
                </button>
              )
            })}
          </nav>

          {/* Card Dica Metodológica */}
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-[#F5F2F9] to-[#EDE8F5] dark:from-purple-950/30 dark:to-slate-900 border border-purple-200 dark:border-purple-900/50">
            <div className="flex items-center gap-2 text-[#5B3A8E] dark:text-purple-300 mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Pilar Ético</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              O Método FAC inverte a lógica do mercado: parte do seu custo real de vida para chegar
              ao piso justo por sessão.
            </p>
          </div>
        </aside>

        {/* Menu Overlay Mobile (< 1024px) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex print:hidden">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-80 max-w-[85vw] bg-white dark:bg-[#0c1220] h-full shadow-2xl p-6 flex flex-col z-10 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                <span className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                  Passos da Calculadora
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8"
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
                      className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${
                        isCurrent
                          ? 'bg-[#5B3A8E] text-white font-medium'
                          : isPast
                            ? 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                            : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isCurrent
                            ? 'bg-white text-[#5B3A8E]'
                            : isPast
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                              : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      >
                        {isPast ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.index}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{step.title}</p>
                        <p
                          className={`text-[11px] truncate ${isCurrent ? 'text-white/80' : 'text-slate-500'}`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleOpenCloud()
                  }}
                  className="w-full justify-center gap-2 min-h-[44px]"
                >
                  <Cloud className="w-4 h-4 text-[#5B3A8E]" />
                  Backup em Nuvem
                </Button>
                {onOpenTour && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onOpenTour()
                    }}
                    className="w-full justify-center gap-2 min-h-[44px]"
                  >
                    <HelpCircle className="w-4 h-4 text-[#5B3A8E]" />
                    Ver Tour Guiado
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setGlossaryOpen(true)
                  }}
                  className="w-full justify-center gap-2 min-h-[44px]"
                >
                  <BookOpen className="w-4 h-4 text-[#5B3A8E]" />
                  Abrir Glossário
                </Button>
              </div>{' '}
            </div>
          </div>
        )}

        {/* Área Central de Conteúdo */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Footer Slim */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0c1220]/80 py-4 px-4 text-center text-xs text-slate-600 dark:text-slate-400 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">Entrelaços Psicologia — Método FAC © 2026</p>
          <p className="text-slate-500 dark:text-slate-500">
            Os cálculos são pedagógicos e não substituem orientação contábil ou jurídica.
          </p>
        </div>
      </footer>

      {/* Modal do Glossário */}
      <GlossaryModal isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />

      {/* Modal de Backup em Nuvem */}
      <CloudBackupModal isOpen={cloudBackupOpen} onClose={() => setCloudBackupOpen(false)} />
    </div>
  )
}
