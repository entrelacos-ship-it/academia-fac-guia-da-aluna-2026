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
import { StrategicInsights } from '@/components/results/StrategicInsights'
import { PrintableReport } from '@/components/results/PrintableReport'
import { TaxSimulatorModule } from '@/components/results/TaxSimulatorModule'
import { AnnualReadjustmentModule } from '@/components/results/AnnualReadjustmentModule'
import { ClinicalContractModule } from '@/components/results/ClinicalContractModule'
import { FinancialPlanningModule } from '@/components/results/FinancialPlanningModule'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calculator, Receipt, Percent, FileCheck2, BarChart3, Compass } from 'lucide-react'
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
  onSelectStep?: (step: number) => void
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
  onSelectStep,
  onNext,
  onPrev,
}) => {
  const [activeTab, setActiveTab] = React.useState<
    'painel' | 'planejamento' | 'tributario' | 'reajuste' | 'contrato'
  >('painel')

  const handlePrint = () => {
    window.print()
  }

  const handleScrollToSection = (elementId: string) => {
    const el = document.getElementById(elementId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="space-y-8">
      {/* Elemento de impressão invisível na tela normal */}
      <PrintableReport state={state} calculation={calculation} />

      {/* Top Banner de Ações do Painel — Astral Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18181B] border border-[#27272A] text-[11px] font-mono font-semibold uppercase tracking-wider text-[#C084FC]">
            <Sparkles className="w-3.5 h-3.5 text-[#FB923C]" />
            <span>PASSO 6 · PAINEL EXECUTIVO ASTRAL</span>
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-semibold text-white mt-1.5">
            Seu Piso Ético e Diagnóstico Clínico
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
            className="gap-2 border-[#27272A] bg-[#18181B] text-[#A1A1AA] hover:text-white hover:border-[#C084FC]/40 rounded-[8px] font-mono text-xs font-semibold"
          >
            <FileDown className="w-4 h-4 text-[#C084FC]" />
            EXPORTAR PDF
          </Button>
        </div>
      </div>

      {/* Navegação por Abas Principais do Passo 6 */}
      <Tabs
        value={activeTab}
        onValueChange={(val) =>
          setActiveTab(val as 'painel' | 'planejamento' | 'tributario' | 'reajuste' | 'contrato')
        }
        className="w-full print:hidden"
      >
        <div className="overflow-x-auto pb-1">
          <TabsList className="bg-[#0A0A14] border border-[#27272A] p-1 rounded-[12px] h-auto inline-flex min-w-full sm:min-w-0">
            <TabsTrigger
              value="painel"
              className="gap-2 py-2.5 px-3 sm:px-4 text-xs font-mono font-semibold rounded-[8px] data-[state=active]:bg-[#18181B] data-[state=active]:text-[#C084FC] data-[state=active]:border data-[state=active]:border-[#27272A] text-[#A1A1AA]"
            >
              <BarChart3 className="w-4 h-4" />
              <span>PAINEL EXECUTIVO</span>
            </TabsTrigger>
            <TabsTrigger
              value="planejamento"
              className="gap-2 py-2.5 px-3 sm:px-4 text-xs font-mono font-semibold rounded-[8px] data-[state=active]:bg-[#18181B] data-[state=active]:text-[#FB923C] data-[state=active]:border data-[state=active]:border-[#27272A] text-[#A1A1AA]"
            >
              <Compass className="w-4 h-4" />
              <span>PLANEJAMENTO FINANCEIRO</span>
            </TabsTrigger>
            <TabsTrigger
              value="tributario"
              className="gap-2 py-2.5 px-3 sm:px-4 text-xs font-mono font-semibold rounded-[8px] data-[state=active]:bg-[#18181B] data-[state=active]:text-[#C084FC] data-[state=active]:border data-[state=active]:border-[#27272A] text-[#A1A1AA]"
            >
              <Receipt className="w-4 h-4" />
              <span>TRANSIÇÃO TRIBUTÁRIA</span>
            </TabsTrigger>
            <TabsTrigger
              value="reajuste"
              className="gap-2 py-2.5 px-3 sm:px-4 text-xs font-mono font-semibold rounded-[8px] data-[state=active]:bg-[#18181B] data-[state=active]:text-[#FB923C] data-[state=active]:border data-[state=active]:border-[#27272A] text-[#A1A1AA]"
            >
              <Percent className="w-4 h-4" />
              <span>REAJUSTE ANUAL</span>
            </TabsTrigger>
            <TabsTrigger
              value="contrato"
              className="gap-2 py-2.5 px-3 sm:px-4 text-xs font-mono font-semibold rounded-[8px] data-[state=active]:bg-[#18181B] data-[state=active]:text-[#C084FC] data-[state=active]:border data-[state=active]:border-[#27272A] text-[#A1A1AA]"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>PROPOSTA & CONTRATO</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ABA 1: Painel Executivo Canônico FAC */}
        <TabsContent value="painel" className="space-y-8 mt-6">
          {/* MÓDULO A: Cartões Principais (Piso FAC, Lacuna e Comparativo CFP) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card Destaque do Piso FAC (2 cols no desktop) — Astral Bento */}
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-[16px] bg-[#18181B] border border-[#27272A] shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C084FC]" />
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C084FC]">
                  Piso Ético Mínimo Calculado (Método FAC)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-white">
                    {formatBRL(calculation.pisoMinimoSessao)}
                  </span>
                  <span className="text-sm font-mono text-[#A1A1AA]">/ sessão</span>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-xl">
                  Este é o valor mínimo por atendimento necessário para cobrir rigorosamente seu
                  custo de vida, consultório, supervisão contínua, reserva técnica de{' '}
                  {state.reservaPct}% e impostos ({state.tributosPct}%).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-[#27272A] text-xs font-mono">
                <div>
                  <span className="text-[#71717A] uppercase tracking-wider text-[10px] block">
                    Faturamento Bruto Alvo
                  </span>
                  <span className="text-base font-bold text-white mt-0.5 block">
                    {formatBRL(calculation.faturamentoBruto)}
                  </span>
                  <span className="text-[10px] text-[#71717A]">ao mês</span>
                </div>

                <div>
                  <span className="text-[#71717A] uppercase tracking-wider text-[10px] block">
                    Sessões Efetivas
                  </span>
                  <span className="text-base font-bold text-white mt-0.5 block">
                    {calculation.sessoesEfetivas} / mês
                  </span>
                  <span className="text-[10px] text-[#71717A]">
                    ({state.sessoesPorSemana} sem. - {state.taxaFaltaPct}% falta)
                  </span>
                </div>

                <div>
                  <span className="text-[#71717A] uppercase tracking-wider text-[10px] block">
                    Markup Divisor
                  </span>
                  <span className="text-base font-bold text-[#C084FC] mt-0.5 block">
                    {calculation.divisor.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-[#71717A]">
                    ({state.reservaPct}% res. + {state.tributosPct}% imp.)
                  </span>
                </div>
              </div>
            </div>

            {/* Card Diagnóstico da Lacuna (Gap Analysis) — Astral Surface */}
            <div className="p-6 rounded-[16px] bg-[#18181B] border border-[#27272A] shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#A1A1AA] block">
                  Diagnóstico de Lacuna (Gap)
                </span>

                {calculation.hasPrecoAtual ? (
                  calculation.isDeficit ? (
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/80 border border-rose-500/40 text-rose-300">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        DÉFICIT CLÍNICO
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-[#A1A1AA]">Defasagem por atendimento:</div>
                        <div className="font-mono text-2xl font-bold text-rose-400">
                          -{formatBRL(calculation.deltaSessao)}
                        </div>
                      </div>

                      <div className="p-3 rounded-[8px] bg-[#121216] border border-rose-900/40 text-xs text-rose-200 space-y-1 font-mono">
                        <div className="flex justify-between">
                          <span>Déficit Mensal:</span>
                          <strong>{formatBRL(calculation.deltaMensal)}</strong>
                        </div>
                        <div className="flex justify-between font-bold pt-1 border-t border-rose-900/40">
                          <span>Prejuízo Anual:</span>
                          <strong>{formatBRL(calculation.prejuizoAnualProjetado)}</strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#0A0A14] border border-[#FB923C]/40 text-[#FB923C]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        SUSTENTÁVEL
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-[#A1A1AA]">Margem positiva por sessão:</div>
                        <div className="font-mono text-2xl font-bold text-[#FB923C]">
                          +{formatBRL(Math.abs(calculation.deltaSessao))}
                        </div>
                      </div>

                      <div className="p-3 rounded-[8px] bg-[#121216] border border-[#27272A] text-xs text-[#A1A1AA] font-mono">
                        Sua clínica gera superávit mensal de{' '}
                        <strong className="text-white">
                          {formatBRL(Math.abs(calculation.deltaMensal))}
                        </strong>{' '}
                        sobre o piso mínimo.
                      </div>
                    </div>
                  )
                ) : (
                  <div className="p-4 rounded-[8px] bg-[#121216] border border-[#27272A] text-xs text-[#A1A1AA] space-y-2">
                    <p>Você não informou seu preço atual no Passo 5.</p>
                    <p className="text-[11px] font-mono text-[#71717A]">
                      Preencha o valor atual para comparar sua remuneração real e descobrir seu
                      eventual déficit clínico.
                    </p>
                  </div>
                )}
              </div>

              {/* Comparativo com Faixas CFP */}
              <div className="pt-4 mt-4 border-t border-[#27272A] space-y-2">
                <span className="text-[11px] font-mono font-semibold text-[#A1A1AA] flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-[#C084FC]" />
                  COMPARATIVO TABELA CFP:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                  <div
                    className={`p-1.5 rounded-[6px] border ${calculation.cfpFaixaAtingida === 'inferior' ? 'border-[#C084FC] bg-[#0A0A14] font-bold text-[#C084FC]' : 'border-[#27272A] bg-[#121216] text-[#71717A]'}`}
                  >
                    <div>Inferior</div>
                    <div>{formatBRL(CFP_VALUES.inferior)}</div>
                  </div>
                  <div
                    className={`p-1.5 rounded-[6px] border ${calculation.cfpFaixaAtingida === 'medio' ? 'border-[#C084FC] bg-[#0A0A14] font-bold text-[#C084FC]' : 'border-[#27272A] bg-[#121216] text-[#71717A]'}`}
                  >
                    <div>Médio</div>
                    <div>{formatBRL(CFP_VALUES.medio)}</div>
                  </div>
                  <div
                    className={`p-1.5 rounded-[6px] border ${calculation.cfpFaixaAtingida === 'superior' ? 'border-[#C084FC] bg-[#0A0A14] font-bold text-[#C084FC]' : 'border-[#27272A] bg-[#121216] text-[#71717A]'}`}
                  >
                    <div>Superior</div>
                    <div>{formatBRL(CFP_VALUES.superior)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MÓDULO ESTRATÉGICO: Insights e Recomendações Acionáveis */}
          <div id="insights-section">
            <StrategicInsights
              state={state}
              calculation={calculation}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onNavigateStep={onSelectStep}
              onScrollToSection={handleScrollToSection}
            />
          </div>

          {/* MÓDULO B: Visualização Gráfica Interativa (Recharts) */}
          <div>
            <FinancialBreakdownCharts calculation={calculation} />
          </div>

          {/* MÓDULO C & D: Planejador Reverso + Sensibilidade (2 cols desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div id="meta-section">
              <IdealRevenueGoalCalculator
                state={state}
                calculation={calculation}
                onAdjustGrade={onAdjustGrade}
              />
            </div>
            <div id="sensibilidade-section">
              <SensitivityAnalysis baseState={state} baseCalculation={calculation} />
            </div>
          </div>

          {/* MÓDULO E & F: Gerenciador de Cenários + Consultor Inteligente (2 cols desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </TabsContent>

        {/* ABA NOVA: Módulo de Planejamento Financeiro */}
        <TabsContent value="planejamento" className="mt-6">
          <FinancialPlanningModule state={state} calculation={calculation} />
        </TabsContent>

        {/* ABA 2: Módulo 1 - Simulador de Transição Tributária */}
        <TabsContent value="tributario" className="mt-6">
          <TaxSimulatorModule
            initialFaturamento={calculation.faturamentoBruto}
            initialDespesasProfissionais={calculation.somaCustosProfissionais}
            reservaPct={state.reservaPct}
          />
        </TabsContent>

        {/* ABA 3: Módulo 2 - Reajuste Anual por Índice */}
        <TabsContent value="reajuste" className="mt-6">
          <AnnualReadjustmentModule
            initialHonorario={calculation.pisoMinimoSessao}
            sessoesEfetivas={calculation.sessoesEfetivas}
            precoAtualCadastrado={state.precoAtual}
          />
        </TabsContent>

        {/* ABA 4: Módulo 3 - Contrato Clínico & Proposta */}
        <TabsContent value="contrato" className="mt-6">
          <ClinicalContractModule
            initialPisoFac={calculation.pisoMinimoSessao}
            precoAtual={state.precoAtual}
            taxaFaltaPct={state.taxaFaltaPct}
          />
        </TabsContent>
      </Tabs>

      {/* Barra Inferior de Ação Astral */}
      <div className="flex items-center justify-between pt-6 border-t border-[#27272A] print:hidden">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-2 border-[#27272A] bg-[#18181B] text-[#A1A1AA] hover:text-white rounded-[8px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Passo 5
        </Button>
        <Button
          onClick={onNext}
          className="gap-2 bg-[#C084FC] hover:bg-[#a855f7] text-[#0A0A14] font-semibold px-7 rounded-[8px] shadow-md shadow-[#C084FC]/20 text-base"
        >
          Comparar Modelos Clínicos
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
