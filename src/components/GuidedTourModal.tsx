import React, { useEffect, useCallback } from 'react'
import {
  Sparkles,
  Route,
  ReceiptText,
  BarChart3,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Compass,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface TourStep {
  id: string
  stepNumber: number
  badge: string
  title: string
  description: string
  details?: string[]
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'intro',
    stepNumber: 1,
    badge: 'Método FAC',
    title: 'Bem-vinda ao Método FAC',
    description:
      'A precificação tradicional empurra tabelas arbitrárias ou médias de mercado. O Método FAC inverte essa lógica: parte do seu custo real de vida e da dignidade da sua prática para chegar ao piso ético por sessão.',
    details: [
      'Sem subprecificação crônica ou culpa por cobrar o valor justo.',
      'Metodologia alinhada às diretrizes do CFP e DIEESE.',
    ],
    icon: Compass,
    iconBg: 'bg-purple-100 dark:bg-purple-950/80',
    iconColor: 'text-[#5B3A8E] dark:text-purple-300',
  },
  {
    id: 'journey',
    stepNumber: 2,
    badge: 'Etapas',
    title: 'Sua jornada em 7 passos',
    description:
      'A barra lateral acompanha sua evolução passo a passo. Você pode avançar, voltar e revisar a qualquer momento:',
    details: [
      'Passo 1 e 2: Custos Pessoais e Custos Profissionais reais.',
      'Passo 3: Retirada Desejada (seu pró-labore justo).',
      'Passo 4: Reserva Técnica e Tributos com Markup Divisor.',
      'Passo 5: Capacidade Clínica e taxa de absenteísmo.',
      'Passos 6 e 7: Painel Executivo e Comparativo de Modelos.',
    ],
    icon: Route,
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/80',
    iconColor: 'text-[#16746E] dark:text-emerald-300',
  },
  {
    id: 'customization',
    stepNumber: 3,
    badge: 'Privacidade & Flexibilidade',
    title: 'Custos e personalização total',
    description:
      'Cada etapa de custos permite adicionar itens personalizados (ex.: softwares específicos, pós-graduação ou dependentes). Seus dados nunca saem do seu computador.',
    details: [
      '100% client-side: privacidade total e conformidade com a LGPD.',
      'Salvamento automático no seu navegador — continue de onde parou quando quiser.',
    ],
    icon: ReceiptText,
    iconBg: 'bg-amber-100 dark:bg-amber-950/80',
    iconColor: 'text-amber-700 dark:text-amber-300',
  },
  {
    id: 'results',
    stepNumber: 4,
    badge: 'Tomada de Decisão',
    title: 'Painel Executivo & Ferramentas Avançadas',
    description:
      'No final, você obtém uma visão completa para sustentar sua clínica com segurança e profissionalismo:',
    details: [
      'Piso ético mínimo por sessão e comparação com a Tabela CFP.',
      'Gráficos de decomposição financeira e sensibilidade de faltas.',
      'Módulos integrados: Transição Tributária (PF vs. PJ), Reajuste Anual por inflação, Gerador de Proposta & Contrato Clínico e Consultor FAC.',
    ],
    icon: BarChart3,
    iconBg: 'bg-purple-100 dark:bg-purple-950/80',
    iconColor: 'text-[#5B3A8E] dark:text-purple-300',
  },
  {
    id: 'glossary',
    stepNumber: 5,
    badge: 'Apoio Contínuo',
    title: 'Glossário e Suporte sempre à mão',
    description:
      'Dúvidas sobre termos como Markup Divisor, Pró-labore, Fator R ou Reserva Técnica? O botão "Glossário" no topo da tela explica tudo de forma descomplicada.',
    details: [
      'Acesse o Glossário e este Tour a qualquer momento no cabeçalho.',
      'Você está pronta para transformar a sustentabilidade da sua clínica!',
    ],
    icon: BookOpen,
    iconBg: 'bg-indigo-100 dark:bg-indigo-950/80',
    iconColor: 'text-indigo-600 dark:text-indigo-300',
  },
]

export const TOUR_STORAGE_KEY = 'entrelacos_fac_tour_done_v1'

interface GuidedTourModalProps {
  isOpen: boolean
  currentStep: number
  onStepChange: (stepIndex: number) => void
  onClose: () => void
  onComplete: () => void
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  currentStep,
  onStepChange,
  onClose,
  onComplete,
}) => {
  const totalSteps = TOUR_STEPS.length
  const step = TOUR_STEPS[currentStep] || TOUR_STEPS[0]
  const isFirst = currentStep === 0
  const isLast = currentStep === totalSteps - 1

  const handleNext = useCallback(() => {
    if (isLast) {
      onComplete()
    } else {
      onStepChange(currentStep + 1)
    }
  }, [currentStep, isLast, onComplete, onStepChange])

  const handlePrev = useCallback(() => {
    if (!isFirst) {
      onStepChange(currentStep - 1)
    }
  }, [currentStep, isFirst, onStepChange])

  // Acessibilidade por teclado: Escape fecha/grava flag, Enter avança
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleNext, handlePrev, onClose])

  // Travar o scroll do body enquanto o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const StepIcon = step.icon

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-dialog-title"
      aria-describedby="tour-dialog-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop semi-escuro */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card do Tour Astral */}
      <div className="relative z-10 w-full max-w-lg bg-[#18181B] rounded-[16px] border border-[#27272A] shadow-2xl overflow-hidden flex flex-col transition-all duration-200 animate-in fade-in-0 zoom-in-95">
        {/* Faixa decorativa superior */}
        <div className="h-1 w-full bg-gradient-to-r from-[#C084FC] via-[#FB923C] to-[#C084FC]" />

        {/* Header do Card */}
        <div className="p-5 sm:p-6 pb-2 sm:pb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[8px] bg-[#0A0A14] border border-[#27272A] text-[#C084FC] flex items-center justify-center shrink-0">
              <StepIcon className="w-5 h-5 text-[#C084FC]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-[#0A0A14] text-[#C084FC] border border-[#27272A] font-mono font-semibold text-[10px] px-2 py-0.5 rounded-[4px] uppercase"
                >
                  {step.badge}
                </Badge>
                <span className="text-xs font-mono text-[#A1A1AA]">
                  PASSO {currentStep + 1} DE {totalSteps}
                </span>
              </div>
              <h2
                id="tour-dialog-title"
                className="font-sans text-xl sm:text-2xl font-semibold text-white mt-1 leading-snug"
              >
                {step.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-white p-2 rounded-[6px] hover:bg-[#0A0A14] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-[#C084FC]"
            aria-label="Pular tour e fechar"
            title="Pular tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Passo */}
        <div className="px-5 sm:px-6 py-3 flex-1 overflow-y-auto max-h-[55vh]">
          <p id="tour-dialog-description" className="text-sm text-[#A1A1AA] leading-relaxed">
            {step.description}
          </p>

          {step.details && step.details.length > 0 && (
            <div className="mt-4 space-y-2 bg-[#121216] p-3.5 rounded-[12px] border border-[#27272A]">
              {step.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#A1A1AA]">
                  <CheckCircle2 className="w-4 h-4 text-[#FB923C] shrink-0 mt-0.5" />
                  <span className="leading-snug">{detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer com Progresso e Botões de Navegação */}
        <div className="p-5 sm:p-6 pt-3 sm:pt-4 border-t border-[#27272A] bg-[#0A0A14] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Indicadores de Passo (Dots) */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Passos do tour">
            {TOUR_STEPS.map((s, index) => {
              const active = index === currentStep
              const completed = index < currentStep
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onStepChange(index)}
                  className={`h-1.5 rounded-full transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-[#C084FC] ${
                    active
                      ? 'w-6 bg-[#C084FC]'
                      : completed
                        ? 'w-2 bg-[#FB923C]'
                        : 'w-2 bg-[#27272A] hover:bg-[#3F3F46]'
                  }`}
                  aria-label={`Ir para passo ${index + 1}: ${s.title}`}
                  aria-selected={active}
                  role="tab"
                />
              )
            })}
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-mono text-[#71717A] hover:text-white underline-offset-4 hover:underline px-2 py-2 min-h-[44px] flex items-center focus:outline-hidden focus:ring-2 focus:ring-[#C084FC] rounded-[6px]"
            >
              Pular tour
            </button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={isFirst}
                className="h-9 px-3 text-[#A1A1AA] hover:text-white border-[#27272A] bg-[#18181B] rounded-[8px] min-w-[44px] focus:ring-2 focus:ring-[#C084FC] font-mono text-xs"
                aria-label="Passo anterior do tour"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">ANTERIOR</span>
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleNext}
                className="h-9 px-4 bg-[#C084FC] hover:bg-[#a855f7] text-[#0A0A14] font-semibold rounded-[8px] shadow-sm min-h-[44px] focus:ring-2 focus:ring-[#C084FC] gap-1.5 font-mono text-xs"
                aria-label={isLast ? 'Concluir tour e começar' : 'Próximo passo do tour'}
              >
                {isLast ? (
                  <>
                    <span>COMEÇAR!</span>
                    <Sparkles className="w-4 h-4 text-[#0A0A14]" />
                  </>
                ) : (
                  <>
                    <span>PRÓXIMO</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Rodapé de atalhos de teclado */}
        <div className="bg-[#03000A] px-4 py-1.5 text-[10px] font-mono text-[#71717A] text-center flex items-center justify-center gap-3 border-t border-[#27272A]">
          <span>
            Use as teclas{' '}
            <kbd className="px-1 py-0.5 bg-[#18181B] border border-[#27272A] rounded text-[10px] text-white">
              ←
            </kbd>{' '}
            <kbd className="px-1 py-0.5 bg-[#18181B] border border-[#27272A] rounded text-[10px] text-white">
              →
            </kbd>{' '}
            para navegar
          </span>
          <span className="text-[#27272A]">•</span>
          <span>
            <kbd className="px-1 py-0.5 bg-[#18181B] border border-[#27272A] rounded text-[10px] text-white">
              ESC
            </kbd>{' '}
            para fechar
          </span>
        </div>
      </div>
    </div>
  )
}
