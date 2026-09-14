import React, { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatBRL, formatNumberBR } from '@/lib/currency'
import { simulateTaxTransition, TaxSimulatorInputs } from '@/lib/taxSimulatorMath'
import { TrendingUp, AlertCircle, Sparkles, Scale, Info, CheckCircle2 } from 'lucide-react'

interface TaxBreakEvenChartProps {
  currentInputs: TaxSimulatorInputs
  userFaturamentoAtual: number // F_bruto do Método FAC
}

export interface BreakEvenPoint {
  faturamento: number
  tributosPf: number
  tributosPj: number
  diff: number
  winnerBefore: 'PF' | 'PJ'
  winnerAfter: 'PF' | 'PJ'
}

export const TaxBreakEvenChart: React.FC<TaxBreakEvenChartProps> = ({
  currentInputs,
  userFaturamentoAtual,
}) => {
  const [metricView, setMetricView] = useState<'tributos' | 'liquido'>('tributos')

  // Geração de dados para o eixo X de R$ 2.000 a R$ 30.000 em passos de R$ 1.000
  // e cálculo minucioso de PF vs PJ com os parâmetros da usuária
  const { chartData, breakEvenPoints, winnerOverall } = useMemo(() => {
    const data: Array<{
      faturamento: number
      faturamentoLabel: string
      tributosPf: number
      tributosPj: number
      aliquotaPf: number
      aliquotaPj: number
      liquidoPf: number
      liquidoPj: number
      economiaPj: number
      anexoPj: string
      fatorR: number
    }> = []

    const points: BreakEvenPoint[] = []

    let prevWinner: 'PF' | 'PJ' | 'EMPATE' | null = null

    // Varre de 2.000 a 30.000 em passos de 500 para detectar ponto de virada com precisão
    const fineSteps: Array<{ faturamento: number; tributosPf: number; tributosPj: number }> = []

    for (let f = 2000; f <= 30000; f += 250) {
      const sim = simulateTaxTransition({
        ...currentInputs,
        faturamentoBrutoMensal: f,
      })
      fineSteps.push({
        faturamento: f,
        tributosPf: sim.pf.totalTributosMensal,
        tributosPj: sim.pj.totalTributosMensal,
      })
    }

    // Identificar cruzamentos
    for (let i = 1; i < fineSteps.length; i++) {
      const pPrev = fineSteps[i - 1]
      const pCurr = fineSteps[i]
      const diffPrev = pPrev.tributosPf - pPrev.tributosPj
      const diffCurr = pCurr.tributosPf - pCurr.tributosPj

      if ((diffPrev < 0 && diffCurr >= 0) || (diffPrev <= 0 && diffCurr > 0)) {
        // PF era mais barata, agora PJ ficou mais barata (inversão clássica)
        points.push({
          faturamento: pCurr.faturamento,
          tributosPf: pCurr.tributosPf,
          tributosPj: pCurr.tributosPj,
          diff: Math.abs(diffCurr),
          winnerBefore: 'PF',
          winnerAfter: 'PJ',
        })
      } else if ((diffPrev > 0 && diffCurr <= 0) || (diffPrev >= 0 && diffCurr < 0)) {
        // PJ era mais barata, agora PF ficou mais barata
        points.push({
          faturamento: pCurr.faturamento,
          tributosPf: pCurr.tributosPf,
          tributosPj: pCurr.tributosPj,
          diff: Math.abs(diffCurr),
          winnerBefore: 'PJ',
          winnerAfter: 'PF',
        })
      }
    }

    // Gera os pontos principais para o gráfico (intervalos regulares de R$ 1.000 de 2k a 30k)
    for (let f = 2000; f <= 30000; f += 1000) {
      const sim = simulateTaxTransition({
        ...currentInputs,
        faturamentoBrutoMensal: f,
      })

      data.push({
        faturamento: f,
        faturamentoLabel: `R$ ${(f / 1000).toFixed(0)}k`,
        tributosPf: sim.pf.totalTributosMensal,
        tributosPj: sim.pj.totalTributosMensal,
        aliquotaPf: sim.pf.aliquotaEfetivaPct,
        aliquotaPj: sim.pj.aliquotaEfetivaTotalPct,
        liquidoPf: sim.pf.liquidoMensal,
        liquidoPj: sim.pj.liquidoMensal,
        economiaPj: sim.pf.totalTributosMensal - sim.pj.totalTributosMensal,
        anexoPj: sim.pj.enquadramentoAnexo,
        fatorR: sim.pj.fatorR,
      })
    }

    // Verifica se houve dominância única na faixa inteira
    let allPf = true
    let allPj = true
    for (const d of data) {
      if (d.tributosPf > d.tributosPj) allPf = false
      if (d.tributosPj > d.tributosPf) allPj = false
    }

    let winnerOverall: 'PF' | 'PJ' | 'MISTO' = 'MISTO'
    if (allPf) winnerOverall = 'PF'
    if (allPj) winnerOverall = 'PJ'

    return {
      chartData: data,
      breakEvenPoints: points,
      winnerOverall,
    }
  }, [currentInputs])

  // Ponto de virada principal (primeiro cruzamento relevante)
  const primaryBreakEven = breakEvenPoints[0] || null

  // Dados para a posição atual da usuária
  const userCurrentSim = useMemo(() => {
    return simulateTaxTransition({
      ...currentInputs,
      faturamentoBrutoMensal: userFaturamentoAtual,
    })
  }, [currentInputs, userFaturamentoAtual])

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-2xs">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-[#5B3A8E] text-[#5B3A8E] dark:border-purple-400 dark:text-purple-300 font-semibold text-[11px]"
              >
                Curva de Faturamento & Ponto de Virada
              </Badge>
              <span className="text-xs text-slate-500">Faixa de R$ 2.000 a R$ 30.000/mês</span>
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              Comparador Visual da Carga Tributária: PF vs. PJ
            </CardTitle>
            <CardDescription className="text-xs">
              Veja exatamente como a carga tributária evolui conforme sua clínica cresce e descubra
              em que faturamento abrir CNPJ passa a ser mais barato.
            </CardDescription>
          </div>

          {/* Seletor de Métrica: Carga Tributária vs. Líquido Disponível */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setMetricView('tributos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                metricView === 'tributos'
                  ? 'bg-white dark:bg-slate-900 text-[#5B3A8E] dark:text-purple-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Carga Tributária (Impostos)
            </button>
            <button
              type="button"
              onClick={() => setMetricView('liquido')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                metricView === 'liquido'
                  ? 'bg-white dark:bg-slate-900 text-[#16746E] dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Líquido Disponível
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Banner do Ponto de Virada (Break-Even) */}
        <div
          className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
            primaryBreakEven
              ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/50'
              : 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                primaryBreakEven ? 'bg-[#5B3A8E] text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Ponto de Virada (Break-Even Tributário)
              </span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {primaryBreakEven ? (
                  <>
                    A partir de{' '}
                    <span className="font-mono text-[#5B3A8E] dark:text-purple-300 font-bold">
                      {formatBRL(primaryBreakEven.faturamento)}/mês
                    </span>
                    , o regime <strong>Pessoa Jurídica (Simples Nacional)</strong> passa a ser mais
                    econômico que o Carnê-Leão.
                  </>
                ) : winnerOverall === 'PJ' ? (
                  'Nesta faixa (R$ 2.000 a R$ 30.000/mês), a Pessoa Jurídica no Simples Nacional é sempre mais vantajosa com os parâmetros informados.'
                ) : (
                  'Nesta faixa (R$ 2.000 a R$ 30.000/mês), a Pessoa Física com Carnê-Leão é sempre mais vantajosa com as despesas atuais.'
                )}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                {primaryBreakEven
                  ? 'Abaixo deste patamar, as deduções do Livro-Caixa ou faixas isentas de IRPF tornam a PF mais barata; acima dele, a alíquota de 27,5% da PF perde para a tributação do Simples Nacional.'
                  : 'Ajuste as despesas do Livro-Caixa e pró-labore nos parâmetros acima para ver o impacto em tempo real.'}
              </p>
            </div>
          </div>

          {/* Destaque da Posição Atual da Usuária */}
          <div className="shrink-0 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Seu Faturamento Atual (FAC)
            </div>
            <div className="font-mono text-base font-bold text-[#5B3A8E] dark:text-purple-300">
              {formatBRL(userFaturamentoAtual)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Regime atual mais barato:{' '}
              <strong
                className={
                  userCurrentSim.comparativo.regimeVencedor === 'PJ'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }
              >
                {userCurrentSim.comparativo.regimeVencedor === 'PJ'
                  ? 'Pessoa Jurídica'
                  : 'Pessoa Física'}
              </strong>
            </div>
          </div>
        </div>

        {/* Gráfico de Linhas Recharts */}
        <div className="h-80 sm:h-96 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 25, left: 15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis
                dataKey="faturamentoLabel"
                tick={{ fontSize: 11, fill: '#64748b' }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => `R$ ${(val / 1000).toFixed(1)}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null
                  const item = payload[0].payload as (typeof chartData)[0]
                  const econ = item.tributosPf - item.tributosPj
                  const isPjBetter = econ > 0

                  return (
                    <div className="bg-white dark:bg-[#0f172a] p-3.5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 text-xs space-y-2 min-w-[240px]">
                      <div className="font-bold border-b border-slate-100 dark:border-slate-800 pb-1 flex justify-between items-center">
                        <span className="text-slate-800 dark:text-slate-200">
                          Faturamento Bruto:
                        </span>
                        <span className="font-mono text-slate-900 dark:text-white font-bold">
                          {formatBRL(item.faturamento)}/mês
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-amber-700 dark:text-amber-400">
                          <span className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#5B3A8E]" />
                            {metricView === 'tributos' ? 'PF (Carnê-Leão):' : 'Líquido PF:'}
                          </span>
                          <span className="font-mono font-bold">
                            {formatBRL(
                              metricView === 'tributos' ? item.tributosPf : item.liquidoPf,
                            )}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 pl-4">
                          Alíquota efetiva PF: {formatNumberBR(item.aliquotaPf, 2)}%
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400">
                          <span className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#16746E]" />
                            {metricView === 'tributos' ? 'PJ (Simples Nacional):' : 'Líquido PJ:'}
                          </span>
                          <span className="font-mono font-bold">
                            {formatBRL(
                              metricView === 'tributos' ? item.tributosPj : item.liquidoPj,
                            )}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 pl-4">
                          Alíquota global PJ: {formatNumberBR(item.aliquotaPj, 2)}% ({item.anexoPj})
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                          Regime mais econômico:
                        </span>
                        <Badge
                          className={`text-[10px] font-bold ${
                            isPjBetter ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                          }`}
                        >
                          {isPjBetter ? 'PJ Simples' : 'PF Carnê-Leão'} (+
                          {formatBRL(Math.abs(econ))})
                        </Badge>
                      </div>
                    </div>
                  )
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
              />

              {/* Linha da PF: Roxo do Design System (#5B3A8E) */}
              <Line
                type="monotone"
                dataKey={metricView === 'tributos' ? 'tributosPf' : 'liquidoPf'}
                name={metricView === 'tributos' ? 'PF (Carnê-Leão)' : 'Líquido PF (Após tributos)'}
                stroke="#5B3A8E"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: '#5B3A8E' }}
              />

              {/* Linha da PJ: Esmeralda (#16746E) */}
              <Line
                type="monotone"
                dataKey={metricView === 'tributos' ? 'tributosPj' : 'liquidoPj'}
                name={
                  metricView === 'tributos' ? 'PJ (Simples Nacional)' : 'Líquido PJ (Após tributos)'
                }
                stroke="#16746E"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: '#16746E' }}
              />

              {/* Linha vertical no Faturamento Atual da Usuária */}
              {userFaturamentoAtual >= 2000 && userFaturamentoAtual <= 30000 && (
                <ReferenceLine
                  x={`R$ ${(Math.round(userFaturamentoAtual / 1000) * 1000) / 1000}k`}
                  stroke="#5B3A8E"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: `Seu Faturamento (${formatBRL(userFaturamentoAtual)})`,
                    position: 'insideTopLeft',
                    fill: '#5B3A8E',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              )}

              {/* Linha vertical no Ponto de Virada se estiver na faixa */}
              {primaryBreakEven && (
                <ReferenceLine
                  x={`R$ ${(Math.round(primaryBreakEven.faturamento / 1000) * 1000) / 1000}k`}
                  stroke="#16746E"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{
                    value: `Virada: ${formatBRL(primaryBreakEven.faturamento)}`,
                    position: 'insideBottomRight',
                    fill: '#16746E',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Resumo Interpretativo das Curvas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">
              Curva Carnê-Leão (PF)
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-snug">
              Cresce acentuadamente porque a alíquota marginal do IRPF atinge rapidamente{' '}
              <strong>27,5%</strong> sobre o lucro tributável.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">
              Curva Simples Nacional (PJ)
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-snug">
              Cresce de forma suave: no <strong>Anexo III (Fator R ≥ 28%)</strong> a alíquota
              efetiva começa em <strong>6%</strong> e os lucros distribuídos são isentos.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">
              Decisão Estratégica
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-snug">
              Se você pretende faturar acima do ponto de virada nos próximos 12 meses, planeje a
              abertura da PJ com antecedência de 30 a 60 dias.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
