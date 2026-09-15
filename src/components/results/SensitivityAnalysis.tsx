import React, { useState } from 'react'
import { SlidersHorizontal, TrendingDown, TrendingUp, RotateCcw } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { PricingState, CalculationResult } from '@/types/pricing'
import { calculateFacMetrics } from '@/lib/facMath'
import { formatBRL, formatNumberBR } from '@/lib/currency'

interface SensitivityProps {
  baseState: PricingState
  baseCalculation: CalculationResult
}

export const SensitivityAnalysis: React.FC<SensitivityProps> = ({ baseState, baseCalculation }) => {
  // Variações relativas
  const [sessoesDelta, setSessoesDelta] = useState<number>(0) // -8 a +8
  const [taxaFaltaSim, setTaxaFaltaSim] = useState<number>(baseState.taxaFaltaPct ?? 10)
  const [corteDespesasPct, setCorteDespesasPct] = useState<number>(0) // 0 a 20%

  const resetSimulation = () => {
    setSessoesDelta(0)
    setTaxaFaltaSim(baseState.taxaFaltaPct ?? 10)
    setCorteDespesasPct(0)
  }

  // Montar estado simulado
  const corteFactor = 1 - corteDespesasPct / 100
  const simState: PricingState = {
    ...baseState,
    sessoesPorSemana: Math.max(1, (baseState.sessoesPorSemana || 15) + sessoesDelta),
    taxaFaltaPct: taxaFaltaSim,
    custosPessoais: {
      ...baseState.custosPessoais,
      moradia: baseState.custosPessoais.moradia * corteFactor,
      alimentacao: baseState.custosPessoais.alimentacao * corteFactor,
      transporte: baseState.custosPessoais.transporte * corteFactor,
      saude: baseState.custosPessoais.saude * corteFactor,
      dependentes: baseState.custosPessoais.dependentes * corteFactor,
      outros: baseState.custosPessoais.outros * corteFactor,
      customItems: baseState.custosPessoais.customItems.map((i) => ({
        ...i,
        value: i.value * corteFactor,
      })),
    },
    custosProfissionais: {
      ...baseState.custosProfissionais,
      sala: baseState.custosProfissionais.sala * corteFactor,
      internet: baseState.custosProfissionais.internet * corteFactor,
      softwares: baseState.custosProfissionais.softwares * corteFactor,
      supervisao: baseState.custosProfissionais.supervisao * corteFactor,
      formacao: baseState.custosProfissionais.formacao * corteFactor,
      contador: baseState.custosProfissionais.contador * corteFactor,
      marketing: baseState.custosProfissionais.marketing * corteFactor,
      outros: baseState.custosProfissionais.outros * corteFactor,
      customItems: baseState.custosProfissionais.customItems.map((i) => ({
        ...i,
        value: i.value * corteFactor,
      })),
    },
  }

  const simCalculation = calculateFacMetrics(simState)

  const basePiso = baseCalculation.pisoMinimoSessao
  const simPiso = simCalculation.pisoMinimoSessao
  const diferencaPiso = Math.round((simPiso - basePiso) * 100) / 100
  const diferencaPct = basePiso > 0 ? ((simPiso - basePiso) / basePiso) * 100 : 0

  const isLower = simPiso < basePiso
  const isHigher = simPiso > basePiso

  return (
    <div className="bg-white dark:bg-[#18181B] rounded-[16px] p-6 border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC]">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
              MODELAGEM DE RISCO
            </span>
            <h3 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
              Análise de Sensibilidade Interativa
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
              Simule o impacto de mudanças na grade, faltas ou corte de gastos no seu Piso Ético
            </p>
          </div>
        </div>

        {(sessoesDelta !== 0 ||
          taxaFaltaSim !== baseState.taxaFaltaPct ||
          corteDespesasPct !== 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetSimulation}
            className="h-8 gap-1 text-xs font-mono text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#121216] rounded-[6px]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
            Resetar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Slider 1: Variação de Sessões Semanais */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white">
              Variação de Sessões/Semana
            </span>
            <span className="font-mono font-bold text-[#7c3aed] dark:text-[#C084FC]">
              {sessoesDelta > 0 ? `+${sessoesDelta}` : sessoesDelta} sessões (Total:{' '}
              {simState.sessoesPorSemana})
            </span>
          </div>
          <Slider
            value={[sessoesDelta]}
            min={-8}
            max={8}
            step={1}
            onValueChange={(vals) => setSessoesDelta(vals[0] || 0)}
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-[#71717A]">
            <span>-8</span>
            <span>Base (0)</span>
            <span>+8</span>
          </div>
        </div>

        {/* Slider 2: Taxa de Faltas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white">
              Taxa de Faltas Simulada
            </span>
            <span className="font-mono font-bold text-[#ea580c] dark:text-[#FB923C]">
              {taxaFaltaSim}%
            </span>
          </div>
          <Slider
            value={[taxaFaltaSim]}
            min={0}
            max={50}
            step={1}
            onValueChange={(vals) => setTaxaFaltaSim(vals[0] || 0)}
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-[#71717A]">
            <span>0% (Sem falta)</span>
            <span>25%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Slider 3: Corte de Despesas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white">
              Corte Pontual de Despesas
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              -{corteDespesasPct}%
            </span>
          </div>
          <Slider
            value={[corteDespesasPct]}
            min={0}
            max={20}
            step={1}
            onValueChange={(vals) => setCorteDespesasPct(vals[0] || 0)}
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-[#71717A]">
            <span>0%</span>
            <span>10%</span>
            <span>20% (Máx corte)</span>
          </div>
        </div>
      </div>

      {/* Card Feedback do Piso Recalculado */}
      <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-[#71717A] block">
            Piso Ético Recalculado na Simulação
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="font-mono text-3xl font-bold text-slate-900 dark:text-white">
              {formatBRL(simPiso)}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
              (Base original: {formatBRL(basePiso)})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLower && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-500/40 text-xs font-mono font-semibold">
              <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                Piso reduz em {formatBRL(Math.abs(diferencaPiso))} (
                {formatNumberBR(Math.abs(diferencaPct), 1)}%)
              </span>
            </div>
          )}

          {isHigher && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-500/40 text-xs font-mono font-semibold">
              <TrendingUp className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>
                Piso sobe em +{formatBRL(diferencaPiso)} (+{formatNumberBR(diferencaPct, 1)}%)
              </span>
            </div>
          )}

          {!isLower && !isHigher && (
            <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
              Sem variação em relação ao cenário base
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
