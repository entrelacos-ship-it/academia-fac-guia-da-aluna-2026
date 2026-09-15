import React, { useState } from 'react'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertOctagon,
  CheckCircle2,
  Scale,
  FileDown,
  LayoutDashboard,
  BarChart3,
  CalendarDays,
  Wrench,
  Bot,
  Receipt,
  Percent,
  FileCheck2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PricingState, CalculationResult, CFP_VALUES } from '@/types/pricing'
import { formatBRL } from '@/lib/currency'
import { FinancialBreakdownCharts } from '@/components/results/FinancialBreakdownCharts'
import { IdealRevenueGoalCalculator } from '@/components/results/IdealRevenueGoalCalculator'
import { SensitivityAnalysis } from '@/components/results/SensitivityAnalysis'
import { SavedScenariosManager } from '@/components/results/SavedScenariosManager'
import { AIAdvisor } from '@/components/results/AIAdvisor'
import { StrategicInsights } from '@/components/results/StrategicInsights'
import { PrintableReport } from '@/components/results/PrintableReport'
import { TaxSimulatorModule } from '@/components/results/TaxSimulatorModule'
import { AnnualReadjustmentModule } from '@/components/results/AnnualReadjustmentModule'
import { ClinicalContractModule } from '@/components/results/ClinicalContractModule'
import { FinancialPlanningModule } from '@/components/results/FinancialPlanningModule'
import { StepModelos } from '@/components/steps/StepModelos'
import { SavedScenario } from '@/types/pricing'
import { ResultsSubmenu } from '@/lib/strategicInsightsEngine'
import { cn } from '@/lib/utils'

interface StepResultadosProps {
  state: PricingState
  calculation: CalculationResult
  scenarios: SavedScenario[]
  onAdjustGrade: (sessoes: number) => void
  onSaveScenario: (name: string, notes?: string) => void
  onLoadScenario: (scenario: SavedScenario) => void
  onDeleteScenario: (id: string) => void
  onClearAllScenarios: () => void
  onSelectStep?: (step: number) => void
  onNext: () => void
  onPrev: () => void
}

interface SubmenuItem {
  id: ResultsSubmenu
  label: string
  shortLabel: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const SUBMENUS: SubmenuItem[] = [
  {
    id: 'visao_geral',
    label: 'Visão Geral',
    shortLabel: 'Visão Geral',
    description: 'Piso Ético FAC, lacuna de faturamento e gráfico donut de decomposição.',
    icon: LayoutDashboard,
  },
  {
    id: 'analises',
    label: 'Análises',
    shortLabel: 'Análises',
    description: 'Barras mensais, análise de sensibilidade e comparativo dos 4 modelos clínicos.',
    icon: BarChart3,
  },
  {
    id: 'planejamento',
    label: 'Planejamento',
    shortLabel: 'Planejamento',
    description: 'Meta reversa sem burnout, cenários salvos e planejamento financeiro em 4 seções.',
    icon: CalendarDays,
  },
  {
    id: 'ferramentas',
    label: 'Ferramentas',
    shortLabel: 'Ferramentas',
    description: 'Transição tributária PF×PJ, reajuste anual por inflação e proposta/contrato.',
    icon: Wrench,
  },
  {
    id: 'consultor',
    label: 'Consultor',
    shortLabel: 'Consultor',
    description: 'Insights estratégicos priorizados e consultor heurístico inteligente.',
    icon: Bot,
  },
]

export const StepResultados: React.FC<StepResultadosProps> = ({
  state,
  calculation,
  scenarios,
  onAdjustGrade,
  onSaveScenario,
  onLoadScenario,
  onDeleteScenario,
  onClearAllScenarios,
  onSelectStep,
  onNext,
  onPrev,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<ResultsSubmenu>('visao_geral')
  const [activeFerramentaTab, setActiveFerramentaTab] = useState<
    'tributario' | 'reajuste' | 'contrato'
  >('tributario')

  const handlePrint = () => {
    window.print()
  }

  const handleScrollToSection = (elementId: string) => {
    const el = document.getElementById(elementId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleNavigateSubmenu = (
    submenu: ResultsSubmenu,
    submodule?: 'tributario' | 'reajuste' | 'contrato',
    anchorId?: string,
  ) => {
    setActiveSubmenu(submenu)
    if (submodule) {
      setActiveFerramentaTab(submodule)
    }
    if (anchorId) {
      setTimeout(() => {
        handleScrollToSection(anchorId)
      }, 150)
    }
  }

  return (
    <div className="space-y-8">
      {/* Elemento de impressão invisível na tela normal */}
      <PrintableReport state={state} calculation={calculation} />

      {/* Top Banner de Ações do Painel — Astral Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[11px] font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
            <span>PASSO 6 · CENTRAL DE RESULTADOS</span>
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white mt-1.5">
            Central de Resultados & Tomada de Decisão
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] mt-0.5">
            Navegue pelos 5 submenus organizados por intenção de uso para analisar, planejar e
            formalizar sua clínica.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
            className="gap-2 border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:border-[#7c3aed]/40 dark:hover:border-[#C084FC]/40 rounded-[8px] font-mono text-xs font-semibold shadow-xs"
          >
            <FileDown className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
            EXPORTAR PDF
          </Button>
        </div>
      </div>

      {/* HUB COM NAVEGAÇÃO: Abas horizontais no mobile (<1024px) / Layout com Sidebar no Desktop (>=1024px) */}
      <div className="print:hidden">
        {/* Navegação Mobile / Tablet (<1024px): scroll horizontal */}
        <div className="lg:hidden mb-6">
          <div className="overflow-x-auto pb-1 scrollbar-none">
            <nav
              className="bg-slate-100 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] p-1.5 rounded-[12px] inline-flex min-w-full gap-1"
              aria-label="Submenus da Central de Resultados"
            >
              {SUBMENUS.map((item) => {
                const Icon = item.icon
                const isActive = activeSubmenu === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSubmenu(item.id)}
                    className={cn(
                      'flex items-center gap-2 py-2 px-3 text-xs font-mono font-semibold rounded-[8px] whitespace-nowrap transition-all duration-200 shrink-0',
                      isActive
                        ? 'bg-white dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] border border-[#7c3aed]/40 dark:border-[#C084FC]/50 shadow-md shadow-[#7c3aed]/10 dark:shadow-[#C084FC]/10'
                        : 'text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#18181B]/50 border border-transparent',
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4',
                        isActive
                          ? 'text-[#7c3aed] dark:text-[#C084FC]'
                          : 'text-slate-400 dark:text-[#71717A]',
                      )}
                    />
                    <span>{item.shortLabel}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Layout Desktop (>=1024px): Sidebar à esquerda + Conteúdo à direita */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* Sidebar Vertical Desktop */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-6 space-y-3">
            <div className="p-3 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-1.5">
              <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-[#71717A]">
                SUBMENUS DA CENTRAL
              </div>

              <nav className="space-y-1" aria-label="Navegação lateral do Passo 6">
                {SUBMENUS.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSubmenu === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSubmenu(item.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 text-left rounded-[10px] transition-all duration-200 group relative',
                        isActive
                          ? 'bg-purple-50/80 dark:bg-[#0A0A14] text-slate-900 dark:text-white border border-[#7c3aed]/40 dark:border-[#C084FC]/60 shadow-md shadow-[#7c3aed]/10 dark:shadow-[#C084FC]/10'
                          : 'text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#0A0A14]/50 border border-transparent',
                      )}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 border transition-colors',
                          isActive
                            ? 'bg-white dark:bg-[#18181B] border-[#7c3aed] dark:border-[#C084FC] text-[#7c3aed] dark:text-[#C084FC]'
                            : 'bg-slate-50 dark:bg-[#121216] border-slate-200 dark:border-[#27272A] text-slate-400 dark:text-[#71717A] group-hover:text-slate-600 dark:group-hover:text-[#A1A1AA]',
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              'font-sans text-sm font-semibold truncate',
                              isActive
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-700 dark:text-[#A1A1AA] group-hover:text-slate-900 dark:group-hover:text-white',
                            )}
                          >
                            {item.label}
                          </span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] dark:bg-[#C084FC] animate-pulse" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-[#71717A] truncate font-sans">
                          {item.shortLabel}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </nav>

              {/* Mini resumo de piso fixado na sidebar */}
              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-[#27272A] px-2 py-1">
                <span className="text-[10px] font-mono text-slate-500 dark:text-[#71717A] uppercase block">
                  Piso FAC Calculado
                </span>
                <span className="font-mono text-lg font-bold text-[#7c3aed] dark:text-[#C084FC] block">
                  {formatBRL(calculation.pisoMinimoSessao)}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-[#71717A]">
                  {calculation.sessoesEfetivas} sessões efetivas/mês
                </span>
              </div>
            </div>
          </aside>

          {/* Área Principal de Conteúdo (Colunas 4-12 no desktop) */}
          <main className="lg:col-span-9 space-y-8 min-w-0">
            {/* ================================================================= */}
            {/* SUBMENU 1: VISÃO GERAL (limpa, curta, essencial)                  */}
            {/* ================================================================= */}
            {activeSubmenu === 'visao_geral' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Cabeçalho da subpágina */}
                <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-sans text-base font-semibold text-slate-900 dark:text-white">
                        1. Visão Geral Essencial
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                        O diagnóstico nuclear do seu trabalho: Piso Ético, lacuna de honorários e
                        destino de cada centavo.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#7c3aed] dark:text-[#C084FC] bg-purple-50 dark:bg-[#0A0A14] px-2.5 py-1 rounded-[6px] border border-purple-200 dark:border-[#27272A]">
                    FOCO TOTAL
                  </span>
                </div>

                {/* Cards Principais: Piso FAC + Lacuna & CFP */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Card Destaque do Piso FAC (2 cols no desktop) — Astral Bento */}
                  <div className="lg:col-span-2 p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#7c3aed] dark:bg-[#C084FC]" />
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                        Piso Ético Mínimo Calculado (Método FAC)
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                          {formatBRL(calculation.pisoMinimoSessao)}
                        </span>
                        <span className="text-sm font-mono text-slate-500 dark:text-[#A1A1AA]">
                          / sessão
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed max-w-xl">
                        Este é o valor mínimo por atendimento necessário para cobrir rigorosamente
                        seu custo de vida, consultório, supervisão contínua, reserva técnica de{' '}
                        {state.reservaPct}% e impostos ({state.tributosPct}%).
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-200 dark:border-[#27272A] text-xs font-mono">
                      <div>
                        <span className="text-slate-500 dark:text-[#71717A] uppercase tracking-wider text-[10px] block">
                          Faturamento Bruto Alvo
                        </span>
                        <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                          {formatBRL(calculation.faturamentoBruto)}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-[#71717A]">
                          ao mês
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 dark:text-[#71717A] uppercase tracking-wider text-[10px] block">
                          Sessões Efetivas
                        </span>
                        <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                          {calculation.sessoesEfetivas} / mês
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-[#71717A]">
                          ({state.sessoesPorSemana} sem. - {state.taxaFaltaPct}% falta)
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 dark:text-[#71717A] uppercase tracking-wider text-[10px] block">
                          Markup Divisor
                        </span>
                        <span className="text-base font-bold text-[#7c3aed] dark:text-[#C084FC] mt-0.5 block">
                          {calculation.divisor.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-[#71717A]">
                          ({state.reservaPct}% res. + {state.tributosPct}% imp.)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Diagnóstico da Lacuna (Gap Analysis) + Comparativo CFP */}
                  <div className="p-6 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-[#A1A1AA] block">
                        Diagnóstico de Lacuna (Gap)
                      </span>

                      {calculation.hasPrecoAtual ? (
                        calculation.isDeficit ? (
                          <div className="space-y-3">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300">
                              <AlertOctagon className="w-3.5 h-3.5" />
                              DÉFICIT CLÍNICO
                            </div>

                            <div className="space-y-1">
                              <div className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                                Defasagem por atendimento:
                              </div>
                              <div className="font-mono text-2xl font-bold text-rose-600 dark:text-rose-400">
                                -{formatBRL(calculation.deltaSessao)}
                              </div>
                            </div>

                            <div className="p-3 rounded-[8px] bg-rose-50/70 dark:bg-[#121216] border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-200 space-y-1 font-mono">
                              <div className="flex justify-between">
                                <span>Déficit Mensal:</span>
                                <strong>{formatBRL(calculation.deltaMensal)}</strong>
                              </div>
                              <div className="flex justify-between font-bold pt-1 border-t border-rose-200 dark:border-rose-900/40">
                                <span>Prejuízo Anual:</span>
                                <strong>{formatBRL(calculation.prejuizoAnualProjetado)}</strong>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#FB923C]/40 text-[#ea580c] dark:text-[#FB923C]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              SUSTENTÁVEL
                            </div>

                            <div className="space-y-1">
                              <div className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                                Margem positiva por sessão:
                              </div>
                              <div className="font-mono text-2xl font-bold text-[#ea580c] dark:text-[#FB923C]">
                                +{formatBRL(Math.abs(calculation.deltaSessao))}
                              </div>
                            </div>

                            <div className="p-3 rounded-[8px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] text-xs text-slate-700 dark:text-[#A1A1AA] font-mono">
                              Sua clínica gera superávit mensal de{' '}
                              <strong className="text-slate-900 dark:text-white">
                                {formatBRL(Math.abs(calculation.deltaMensal))}
                              </strong>{' '}
                              sobre o piso mínimo.
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="p-4 rounded-[8px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] text-xs text-slate-600 dark:text-[#A1A1AA] space-y-2">
                          <p>Você não informou seu preço atual no Passo 5.</p>
                          <p className="text-[11px] font-mono text-slate-500 dark:text-[#71717A]">
                            Preencha o valor atual para comparar sua remuneração real e descobrir
                            seu eventual déficit clínico.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Comparativo com Faixas CFP */}
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-[#27272A] space-y-2">
                      <span className="text-[11px] font-mono font-semibold text-slate-600 dark:text-[#A1A1AA] flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC]" />
                        COMPARATIVO TABELA CFP:
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                        <div
                          className={`p-1.5 rounded-[6px] border ${
                            calculation.cfpFaixaAtingida === 'inferior'
                              ? 'border-[#7c3aed] dark:border-[#C084FC] bg-purple-50 dark:bg-[#0A0A14] font-bold text-[#7c3aed] dark:text-[#C084FC]'
                              : 'border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#121216] text-slate-500 dark:text-[#71717A]'
                          }`}
                        >
                          <div>Inferior</div>
                          <div>{formatBRL(CFP_VALUES.inferior)}</div>
                        </div>
                        <div
                          className={`p-1.5 rounded-[6px] border ${
                            calculation.cfpFaixaAtingida === 'medio'
                              ? 'border-[#7c3aed] dark:border-[#C084FC] bg-purple-50 dark:bg-[#0A0A14] font-bold text-[#7c3aed] dark:text-[#C084FC]'
                              : 'border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#121216] text-slate-500 dark:text-[#71717A]'
                          }`}
                        >
                          <div>Médio</div>
                          <div>{formatBRL(CFP_VALUES.medio)}</div>
                        </div>
                        <div
                          className={`p-1.5 rounded-[6px] border ${
                            calculation.cfpFaixaAtingida === 'superior'
                              ? 'border-[#7c3aed] dark:border-[#C084FC] bg-purple-50 dark:bg-[#0A0A14] font-bold text-[#7c3aed] dark:text-[#C084FC]'
                              : 'border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#121216] text-slate-500 dark:text-[#71717A]'
                          }`}
                        >
                          <div>Superior</div>
                          <div>{formatBRL(CFP_VALUES.superior)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gráfico Donut: Decomposição Financeira Visual (para onde vai cada centavo da sessão) */}
                <div>
                  <FinancialBreakdownCharts calculation={calculation} />
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* SUBMENU 2: ANÁLISES (barras mensais, sensibilidade, 4 modelos)     */}
            {/* ================================================================= */}
            {activeSubmenu === 'analises' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[8px] bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A] text-[#ea580c] dark:text-[#FB923C] flex items-center justify-center">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-sans text-base font-semibold text-slate-900 dark:text-white">
                        2. Análises Avançadas de Precificação
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                        Decomposição em barras, simulação dinâmica de sensibilidade e avaliação
                        comparativa dos 4 modelos clínicos.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#ea580c] dark:text-[#FB923C] bg-orange-50 dark:bg-[#0A0A14] px-2.5 py-1 rounded-[6px] border border-orange-200 dark:border-[#27272A]">
                    3 MÓDULOS DE ANÁLISE
                  </span>
                </div>

                {/* 1. Decomposição Financeira (Barras e Por Sessão) */}
                <div>
                  <FinancialBreakdownCharts calculation={calculation} />
                </div>

                {/* 2. Análise de Sensibilidade */}
                <div id="sensibilidade-section">
                  <SensitivityAnalysis baseState={state} baseCalculation={calculation} />
                </div>

                {/* 3. Comparativo dos 4 Modelos Clínicos */}
                <div className="pt-2">
                  <StepModelos
                    onReset={() => {
                      if (onSelectStep) onSelectStep(0)
                    }}
                    onKeepData={() => setActiveSubmenu('visao_geral')}
                    onPrev={() => setActiveSubmenu('visao_geral')}
                  />
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* SUBMENU 3: PLANEJAMENTO (meta reversa, cenários, fin planning)     */}
            {/* ================================================================= */}
            {activeSubmenu === 'planejamento' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-sans text-base font-semibold text-slate-900 dark:text-white">
                        3. Planejamento Clínico & Patrimonial
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                        Meta reversa com proteção de burnout, comparador de cenários salvos e
                        planejamento financeiro em 4 seções.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#7c3aed] dark:text-[#C084FC] bg-purple-50 dark:bg-[#0A0A14] px-2.5 py-1 rounded-[6px] border border-purple-200 dark:border-[#27272A]">
                    SUSTENTABILIDADE
                  </span>
                </div>

                {/* 1. Planejador Reverso de Meta (com alerta de burnout >28 e botão Ajustar Grade) */}
                <div id="meta-section">
                  <IdealRevenueGoalCalculator
                    state={state}
                    calculation={calculation}
                    onAdjustGrade={onAdjustGrade}
                  />
                </div>

                {/* 2. Gerenciador de Cenários (Base, Conservador, Otimista + salvos) */}
                <div id="cenarios-section">
                  <SavedScenariosManager
                    currentState={state}
                    currentCalculation={calculation}
                    scenarios={scenarios}
                    onSaveScenario={onSaveScenario}
                    onLoadScenario={onLoadScenario}
                    onDeleteScenario={onDeleteScenario}
                    onClearAll={onClearAllScenarios}
                  />
                </div>

                {/* 3. Módulo de Planejamento Financeiro Completo (4 seções internas) */}
                <div id="planejamento-financeiro-section">
                  <FinancialPlanningModule state={state} calculation={calculation} />
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* SUBMENU 4: FERRAMENTAS (Tributos PF×PJ, Reajuste, Contrato)       */}
            {/* ================================================================= */}
            {activeSubmenu === 'ferramentas' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[8px] bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A] text-[#ea580c] dark:text-[#FB923C] flex items-center justify-center">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-sans text-base font-semibold text-slate-900 dark:text-white">
                        4. Ferramentas Práticas de Gestão
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                        Simulação tributária PF×PJ com ponto de virada, reajuste por inflação
                        oficial e minuta de contrato.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seletor interno das 3 ferramentas */}
                <div className="overflow-x-auto pb-1">
                  <div className="bg-slate-100 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] p-1 rounded-[10px] inline-flex gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveFerramentaTab('tributario')}
                      className={cn(
                        'flex items-center gap-2 py-2 px-3.5 text-xs font-mono font-semibold rounded-[8px] transition-all',
                        activeFerramentaTab === 'tributario'
                          ? 'bg-white dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] border border-slate-200 dark:border-[#27272A] shadow-xs'
                          : 'text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white',
                      )}
                    >
                      <Receipt className="w-4 h-4" />
                      <span>TRANSIÇÃO TRIBUTÁRIA PF×PJ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFerramentaTab('reajuste')}
                      className={cn(
                        'flex items-center gap-2 py-2 px-3.5 text-xs font-mono font-semibold rounded-[8px] transition-all',
                        activeFerramentaTab === 'reajuste'
                          ? 'bg-white dark:bg-[#18181B] text-[#ea580c] dark:text-[#FB923C] border border-slate-200 dark:border-[#27272A] shadow-xs'
                          : 'text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white',
                      )}
                    >
                      <Percent className="w-4 h-4" />
                      <span>REAJUSTE ANUAL (IPCA/IGP-M)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFerramentaTab('contrato')}
                      className={cn(
                        'flex items-center gap-2 py-2 px-3.5 text-xs font-mono font-semibold rounded-[8px] transition-all',
                        activeFerramentaTab === 'contrato'
                          ? 'bg-white dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] border border-slate-200 dark:border-[#27272A] shadow-xs'
                          : 'text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white',
                      )}
                    >
                      <FileCheck2 className="w-4 h-4" />
                      <span>PROPOSTA & CONTRATO CLÍNICO</span>
                    </button>
                  </div>
                </div>

                {/* Conteúdo da Ferramenta Selecionada */}
                <div className="mt-4">
                  {activeFerramentaTab === 'tributario' && (
                    <TaxSimulatorModule
                      initialFaturamento={calculation.faturamentoBruto}
                      initialDespesasProfissionais={calculation.somaCustosProfissionais}
                      reservaPct={state.reservaPct}
                    />
                  )}

                  {activeFerramentaTab === 'reajuste' && (
                    <AnnualReadjustmentModule
                      initialHonorario={calculation.pisoMinimoSessao}
                      sessoesEfetivas={calculation.sessoesEfetivas}
                      precoAtualCadastrado={state.precoAtual}
                    />
                  )}

                  {activeFerramentaTab === 'contrato' && (
                    <ClinicalContractModule
                      initialPisoFac={calculation.pisoMinimoSessao}
                      precoAtual={state.precoAtual}
                      taxaFaltaPct={state.taxaFaltaPct}
                    />
                  )}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* SUBMENU 5: CONSULTOR (StrategicInsights + AIAdvisor)               */}
            {/* ================================================================= */}
            {activeSubmenu === 'consultor' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-sans text-base font-semibold text-slate-900 dark:text-white">
                        5. Consultoria Estratégica & Heurística
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                        Diagnósticos automáticos acionáveis e suporte com respostas às dúvidas
                        clínicas mais frequentes.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#7c3aed] dark:text-[#C084FC] bg-purple-50 dark:bg-[#0A0A14] px-2.5 py-1 rounded-[6px] border border-purple-200 dark:border-[#27272A]">
                    100% PRIVADO
                  </span>
                </div>

                {/* 1. Insights Estratégicos Acionáveis */}
                <div id="insights-section">
                  <StrategicInsights
                    state={state}
                    calculation={calculation}
                    onNavigateSubmenu={handleNavigateSubmenu}
                    onNavigateStep={onSelectStep}
                    onScrollToSection={handleScrollToSection}
                  />
                </div>

                {/* 2. Consultor Inteligente Heurístico */}
                <div id="ai-advisor-section">
                  <AIAdvisor calculation={calculation} />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Barra Inferior de Ação Astral */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-[#27272A] print:hidden">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-2 border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#27272A] rounded-[8px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Passo 5
        </Button>
        <Button
          onClick={onNext}
          className="gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold px-7 rounded-[8px] shadow-md shadow-[#7c3aed]/20 dark:shadow-[#C084FC]/20 text-base"
        >
          Comparar Modelos Clínicos
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
