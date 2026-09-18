import React, { useEffect, useCallback } from 'react'
import {
  Sparkles,
  Route,
  ReceiptText,
  BarChart3,
  CalendarDays,
  Wrench,
  Bot,
  CloudCheck,
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
    id: 'welcome_method',
    stepNumber: 1,
    badge: 'Método FAC',
    title: 'Bem-vinda ao Método FAC',
    description:
      'A precificação tradicional impõe médias de mercado arbitrárias. O Método FAC inverte essa lógica: parte do seu custo real de vida e da dignidade da sua prática para revelar o piso ético indispensável por sessão.',
    details: [
      'Lógica invertida: das despesas reais e pró-labore digno direto para o valor da consulta.',
      'Cobrança com embasamento técnico e sem a culpa da subprecificação crônica.',
    ],
    icon: Compass,
    iconBg: 'bg-[#0A0A14]',
    iconColor: 'text-[#C084FC]',
  },
  {
    id: 'wizard_flow',
    stepNumber: 2,
    badge: 'Jornada em 8 Passos',
    title: 'Wizard estruturado do Passo 0 ao 7',
    description:
      'Construa sua sustentabilidade em uma jornada guiada e fluida. Avance, retorne e refine cada variável pela barra lateral sempre que quiser.',
    details: [
      'Passos 1 e 2: Custos Pessoais (moradia, saúde, dependentes) e Custos Profissionais (sala, supervisão, softwares).',
      'Passo 3: Retirada Desejada (o pró-labore justo e compatível com sua qualidade de vida).',
      'Passos 4 e 5: Reserva Técnica com Markup Divisor, tributos, capacidade clínica semanal e taxa de faltas.',
      'Passos 6 e 7: Central de Resultados completa e comparativo detalhado dos 4 Modelos Clínicos.',
    ],
    icon: Route,
    iconBg: 'bg-[#0A0A14]',
    iconColor: 'text-[#FB923C]',
  },
  {
    id: 'central_resultados',
    stepNumber: 3,
    badge: 'Passo 6 · Resultados',
    title: 'Central de Resultados em 5 Submenus',
    description:
      'No Passo 6, seus dados se transformam em decisões estratégicas organizadas em 5 submenus intuitivos: Visão Geral, Análises, Planejamento, Ferramentas e Consultor.',
    details: [
      'Visão Geral: Piso Ético FAC, lacuna de faturamento e gráfico donut com o destino exato de cada real.',
      'Análises: Gráficos mensais, sensibilidade ao absenteísmo de pacientes e comparativo dos 4 modelos.',
      'Exportação instantânea de relatório executivo em PDF pronto para arquivar ou imprimir.',
    ],
    icon: BarChart3,
    iconBg: 'bg-[#0A0A14]',
    iconColor: 'text-[#C084FC]',
  },
  {
    id: 'financial_planning',
    stepNumber: 4,
    badge: 'Planejamento',
    title: 'Planejamento Financeiro Integrado',
    description:
      'Dê solidez ao futuro da sua clínica com projeções dinâmicas estruturadas para a realidade do consultório autônomo.',
    details: [
      'Consolidação de fluxo de caixa mensal entre receitas, despesas e pró-labore real.',
      'Cálculo de reserva de emergência personalizada para meses de baixa e imprevistos.',
      'Metas financeiras com aporte mensal sugerido e projeção de crescimento patrimonial em 12 meses.',
    ],
    icon: CalendarDays,
    iconBg: 'bg-[#0A0A14]',
    iconColor: 'text-[#FB923C]',
  },
  {
    id: 'clinical_tools',
    stepNumber: 5,
    badge: 'Ferramentas Clínicas',
    title: 'Simulador Tributário, Reajuste & Contrato',
    description:
      'Ferramentas práticas para blindar a gestão administrativa da clínica e conduzir negociações transparentes com seus pacientes.',
    details: [
      'Simulador Tributário: Comparativo real entre Pessoa Física (Carnê-Leão/INSS) e PJ Simples Nacional (Anexo III vs. Anexo V).',
      'Reajuste Anual: Correção por inflação oficial (IPCA, INPC, IGPM) com índice customizável.',
      'Proposta & Contrato Clínico: Minutas prontas com política de faltas, férias e termos éticos geradas em 1 clique.',
    ],
    icon: Wrench,
    iconBg: 'bg-[#0A0A14]',
    iconColor: 'text-[#C084FC]',
  },
  {
    id: 'ai_advisor',
    stepNumber: 6,
    badge: 'Consultor FAC',
    title: 'Consultoria Heurística & Modo Astral',
    description:
      'Receba insights estratégicos priorizados e converse com o Consultor Heurístico inteligente para sanar dúvidas da sua prática em um ambiente visual acolhedor.',
    details: [
      'Diagnósticos automáticos identificando subprecificação, sobrecarga de horários e gargalos de margem.',
      'Alterne entre modo claro e escuro a qualquer instante no topo da tela para seu total conforto visual.',
      'Glossário completo de termos técnicos acessível com apenas um toque no cabeçalho.',
    ],
    icon: Bot,
    iconBg: 'bg-[#0A0A14]',
    iconColor: 'text-[#FB923C]',
  },
  {
    id: 'cloud_sync',
    stepNumber: 7,
    badge: 'Sua Conta & Nuvem',
    title: 'Sincronização Automática em Nuvem',
    description:
      'Seus dados e cenários ficam salvos com segurança na sua conta pessoal e sincronizam em tempo real. Acesse de qualquer computador ou celular sem se preocupar em fazer backups manuais.',
    details: [
      'Login obrigatório com isolamento total dos seus dados clínicos e financeiros.',
      'Sincronização automática contínua na nuvem: trabalhe de onde parou em qualquer dispositivo.',
      'Você pode reabrir este Tour ou consultar o Glossário sempre que desejar pelo botão no topo da página.',
    ],
    icon: CloudCheck,
    iconBg: 'bg-[#0A0A14]',
    iconColor: 'text-[#C084FC]',
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

      {/* Card do Tour Astral com suporte claro/escuro */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-[#18181B] rounded-[16px] border border-slate-200 dark:border-[#27272A] shadow-2xl overflow-hidden flex flex-col transition-all duration-200 animate-in fade-in-0 zoom-in-95">
        {/* Faixa decorativa superior */}
        <div className="h-1 w-full bg-gradient-to-r from-[#7c3aed] via-[#ea580c] to-[#7c3aed] dark:from-[#C084FC] dark:via-[#FB923C] dark:to-[#C084FC]" />

        {/* Header do Card */}
        <div className="p-5 sm:p-6 pb-2 sm:pb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center shrink-0">
              <StepIcon className="w-5 h-5 text-[#7c3aed] dark:text-[#C084FC]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-purple-50 dark:bg-[#0A0A14] text-[#7c3aed] dark:text-[#C084FC] border border-purple-200 dark:border-[#27272A] font-mono font-semibold text-[10px] px-2 py-0.5 rounded-[4px] uppercase"
                >
                  {step.badge}
                </Badge>
                <span className="text-xs font-mono text-slate-500 dark:text-[#A1A1AA]">
                  PASSO {currentStep + 1} DE {totalSteps}
                </span>
              </div>
              <h2
                id="tour-dialog-title"
                className="font-sans text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mt-1 leading-snug"
              >
                {step.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:text-[#71717A] dark:hover:text-white p-2 rounded-[6px] hover:bg-slate-100 dark:hover:bg-[#0A0A14] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC]"
            aria-label="Pular tour e fechar"
            title="Pular tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Passo */}
        <div className="px-5 sm:px-6 py-3 flex-1 overflow-y-auto max-h-[55vh]">
          <p
            id="tour-dialog-description"
            className="text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed"
          >
            {step.description}
          </p>

          {step.details && step.details.length > 0 && (
            <div className="mt-4 space-y-2 bg-slate-50 dark:bg-[#121216] p-3.5 rounded-[12px] border border-slate-200 dark:border-[#27272A]">
              {step.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-700 dark:text-[#A1A1AA]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C] shrink-0 mt-0.5" />
                  <span className="leading-snug">{detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer com Progresso e Botões de Navegação */}
        <div className="p-5 sm:p-6 pt-3 sm:pt-4 border-t border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#0A0A14] flex flex-col sm:flex-row items-center justify-between gap-3">
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
                  className={`h-1.5 rounded-full transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC] ${
                    active
                      ? 'w-6 bg-[#7c3aed] dark:bg-[#C084FC]'
                      : completed
                        ? 'w-2 bg-[#ea580c] dark:bg-[#FB923C]'
                        : 'w-2 bg-slate-300 dark:bg-[#27272A] hover:bg-slate-400 dark:hover:bg-[#3F3F46]'
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
              className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-[#71717A] dark:hover:text-white underline-offset-4 hover:underline px-2 py-2 min-h-[44px] flex items-center focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC] rounded-[6px]"
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
                className="h-9 px-3 text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] rounded-[8px] min-w-[44px] focus:ring-2 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC] font-mono text-xs"
                aria-label="Passo anterior do tour"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">ANTERIOR</span>
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleNext}
                className="h-9 px-4 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] shadow-sm min-h-[44px] focus:ring-2 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC] gap-1.5 font-mono text-xs"
                aria-label={isLast ? 'Concluir tour e começar' : 'Próximo passo do tour'}
              >
                {isLast ? (
                  <>
                    <span>COMEÇAR!</span>
                    <Sparkles className="w-4 h-4 text-white dark:text-[#0A0A14]" />
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
        <div className="bg-slate-100 dark:bg-[#03000A] px-4 py-1.5 text-[10px] font-mono text-slate-500 dark:text-[#71717A] text-center flex items-center justify-center gap-3 border-t border-slate-200 dark:border-[#27272A]">
          <span>
            Use as teclas{' '}
            <kbd className="px-1 py-0.5 bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] rounded text-[10px] text-slate-900 dark:text-white">
              ←
            </kbd>{' '}
            <kbd className="px-1 py-0.5 bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] rounded text-[10px] text-slate-900 dark:text-white">
              →
            </kbd>{' '}
            para navegar
          </span>
          <span className="text-slate-300 dark:text-[#27272A]">•</span>
          <span>
            <kbd className="px-1 py-0.5 bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] rounded text-[10px] text-slate-900 dark:text-white">
              ESC
            </kbd>{' '}
            para fechar
          </span>
        </div>
      </div>
    </div>
  )
}
