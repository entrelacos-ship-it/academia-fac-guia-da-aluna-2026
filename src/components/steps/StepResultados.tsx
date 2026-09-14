import React from 'react'
import {
  Sparkles,
  Printer,
  ArrowRight,
  ArrowLeft,
  AlertOctagon,
  CheckCircle2,
  Scale,
  TrendingDown,
  TrendingUp,
  FileDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PricingState, CalculationResult, CFP_VALUES } from '@/types/pricing'
import { formatBRL, formatNumberBR } from '@/lib/currency'
import { FinancialBreakdownCharts } from '@/components/results/FinancialBreakdownCharts'
import { IdealRevenueGoalCalculator } from '@/components/results/IdealRevenueGoalCalculator'
import { SensitivityAnalysis } from '@/components/results/SensitivityAnalysis'
import { SavedScenariosManager } from '@/components/results/SavedScenariosManager'
import { AIAdvisor } from '@/components/results/AIAdvisor'
import { PrintableReport } from '@/components/results/PrintableReport'
import { SavedScenario } from '@/types/pricing'

interface StepResultadosProps {
  state: PricingState
  calculation: CalculationResult
  scenarios: SavedScenario[]
  onAdjustGrade: (sessoes: number) => void
  onSaveScenario: (name: string, notes?: string) => void
  onLoadScenario: (scenario: SavedScenario) => void
  onDeleteScenario: (id: string) => void
  onClearAllScenarios: () => void
  onNext: () => void
  onPrev: () => void
}

export const StepResultados: React.FC<StepResultadosProps> = ({
  state,
  calculation,
  scenarios,
  onAdjustGrade,
  onSaveScenario,
  onLoadScenario,
  onDeleteScenario,
  onClearAllScenarios,
  onNext,
  onPrev,
}) => {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-8">
      {/* Elemento de impressão invisível na tela normal */}
      <PrintableReport state={state} calculation={calculation} />

      {/* Top Banner de Ações do Painel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <Badge
            variant="secondary"
            className="bg-[#EDE8F5] text-[#5B3A8E] dark:bg-purple-950 dark:text-purple-300 font-semibold px-3 py-1 rounded-full text-xs inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Painel Executivo
          </Badge>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Seu Piso Ético e Diagnóstico Clínico
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
            className="gap-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-[#F5F2F9] hover:text-[#5B3A8E]"
          >
            <FileDown className="w-4 h-4 text-[#5B3A8E]" />
            Exportar Relatório em PDF
          </Button>
        </div>
      </div>

      {/* MÓDULO A: Cartões Principais (Piso FAC, Lacuna e Comparativo CFP) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Card Destaque do Piso FAC (2 cols no desktop) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border-l-8 border-[#5B3A8E] border-t border-r border-b border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B3A8E] dark:text-purple-400">
              Piso Ético Mínimo Calculado (Método FAC)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                {formatBRL(calculation.pisoMinimoSessao)}
              </span>
              <span className="text-sm font-medium text-slate-500">/ sessão</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Este é o valor mínimo por atendimento necessário para cobrir rigorosamente seu custo
              de vida, consultório, supervisão contínua, reserva técnica de 10% e impostos.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block">
                Faturamento Bruto Alvo
              </span>
              <span className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                {formatBRL(calculation.faturamentoBruto)}
              </span>
              <span className="text-[10px] text-slate-500">ao mês</span>
            </div>

            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block">
                Sessões Efetivas
              </span>
              <span className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                {calculation.sessoesEfetivas} / mês
              </span>
              <span className="text-[10px] text-slate-500">
                ({state.sessoesPorSemana} sem. - {state.taxaFaltaPct}% falta)
              </span>
            </div>

            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block">
                Markup Divisor
              </span>
              <span className="font-mono text-base font-bold text-[#5B3A8E] dark:text-purple-300 mt-0.5 block">
                {calculation.divisor.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500">
                ({state.reservaPct}% res. + {state.tributosPct}% imp.)
              </span>
            </div>
          </div>
        </div>

        {/* Card Diagnóstico da Lacuna (Gap Analysis) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Diagnóstico de Lacuna (Gap)
            </span>

            {calculation.hasPrecoAtual ? (
              calculation.isDeficit ? (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-700 text-white shadow-2xs">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    Déficit Clínico (Abaixo do Piso)
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Defasagem por atendimento:
                    </div>
                    <div className="font-mono text-2xl font-bold text-rose-700 dark:text-rose-400">
                      -{formatBRL(calculation.deltaSessao)}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 space-y-1">
                    <div className="flex justify-between">
                      <span>Déficit Mensal:</span>
                      <strong className="font-mono">{formatBRL(calculation.deltaMensal)}</strong>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t border-rose-200/60 dark:border-rose-900/60">
                      <span>Prejuízo Anual Projetado:</span>
                      <strong className="font-mono">
                        {formatBRL(calculation.prejuizoAnualProjetado)}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Sustentável (Acima do Piso)
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Margem positiva por sessão:
                    </div>
                    <div className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                      +{formatBRL(Math.abs(calculation.deltaSessao))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-200">
                    Sua clínica gera superávit mensal de{' '}
                    <strong>{formatBRL(Math.abs(calculation.deltaMensal))}</strong> sobre o piso
                    mínimo.
                  </div>
                </div>
              )
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <p>Você não informou seu preço atual no Passo 5.</p>
                <p className="text-[11px] text-slate-500">
                  Preencha o valor atual para comparar sua remuneração real e descobrir seu eventual
                  déficit clínico.
                </p>
              </div>
            )}
          </div>

          {/* Comparativo com Faixas CFP */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-[#5B3A8E]" />
              Comparativo Tabela CFP:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
              <div
                className={`p-1.5 rounded-lg border ${calculation.cfpFaixaAtingida === 'inferior' ? 'border-[#5B3A8E] bg-[#EDE8F5] font-bold text-[#5B3A8E]' : 'border-slate-200 text-slate-500'}`}
              >
                <div>Inferior</div>
                <div className="font-mono">{formatBRL(CFP_VALUES.inferior)}</div>
              </div>
              <div
                className={`p-1.5 rounded-lg border ${calculation.cfpFaixaAtingida === 'medio' ? 'border-[#5B3A8E] bg-[#EDE8F5] font-bold text-[#5B3A8E]' : 'border-slate-200 text-slate-500'}`}
              >
                <div>Médio</div>
                <div className="font-mono">{formatBRL(CFP_VALUES.medio)}</div>
              </div>
              <div
                className={`p-1.5 rounded-lg border ${calculation.cfpFaixaAtingida === 'superior' ? 'border-[#5B3A8E] bg-[#EDE8F5] font-bold text-[#5B3A8E]' : 'border-slate-200 text-slate-500'}`}
              >
                <div>Superior</div>
                <div className="font-mono">{formatBRL(CFP_VALUES.superior)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MÓDULO B: Visualização Gráfica Interativa (Recharts) */}
      <div className="print:hidden">
        <FinancialBreakdownCharts calculation={calculation} />
      </div>

      {/* MÓDULO C & D: Planejador Reverso + Sensibilidade (2 cols desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
        <IdealRevenueGoalCalculator
          state={state}
          calculation={calculation}
          onAdjustGrade={onAdjustGrade}
        />
        <SensitivityAnalysis baseState={state} baseCalculation={calculation} />
      </div>

      {/* MÓDULO E & F: Gerenciador de Cenários + Consultor Inteligente (2 cols desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
        <SavedScenariosManager
          currentState={state}
          currentCalculation={calculation}
          scenarios={scenarios}
          onSaveScenario={onSaveScenario}
          onLoadScenario={onLoadScenario}
          onDeleteScenario={onDeleteScenario}
          onClearAll={onClearAllScenarios}
        />
        <AIAdvisor calculation={calculation} />
      </div>

      {/* Barra Inferior de Ação */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 print:hidden">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-2 border-slate-300 dark:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Passo 5
        </Button>
        <Button
          onClick={onNext}
          className="gap-2 bg-[#5B3A8E] hover:bg-[#452A6F] text-white px-7 font-medium shadow-md text-base"
        >
          Comparar Modelos Clínicos
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
