import React from 'react'
import {
  CalendarDays,
  Clock,
  CalendarX,
  BadgeDollarSign,
  Scale,
  ArrowRight,
  ArrowLeft,
  Minus,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { CurrencyInput } from '@/components/CurrencyInput'
import { PricingState, CFP_VALUES } from '@/types/pricing'
import { formatBRL } from '@/lib/currency'

interface StepCapacidadeProps {
  state: PricingState
  onSetSessoesPorSemana: (count: number) => void
  onSetSemanasPorMes: (weeks: number) => void
  onSetTaxaFaltaPct: (pct: number) => void
  onSetPrecoAtual: (val: number) => void
  onSetCfpTier: (tier: PricingState['cfpConfig']['tier'], customValue?: number) => void
  onNext: () => void
  onPrev: () => void
}

export const StepCapacidade: React.FC<StepCapacidadeProps> = ({
  state,
  onSetSessoesPorSemana,
  onSetSemanasPorMes,
  onSetTaxaFaltaPct,
  onSetPrecoAtual,
  onSetCfpTier,
  onNext,
  onPrev,
}) => {
  const sessoesPorSemana = state.sessoesPorSemana || 15
  const semanasPorMes = state.semanasPorMes || 4
  const taxaFalta = state.taxaFaltaPct ?? 10
  const sessoesAgendadas = sessoesPorSemana * semanasPorMes
  const sessoesEfetivas = Math.round(sessoesAgendadas * (1 - taxaFalta / 100) * 10) / 10

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Banner */}
      <div className="p-4 rounded-xl bg-[#F5F2F9] dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#5B3A8E] text-white shrink-0 mt-0.5">
          <CalendarDays className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
            Passo 5: Capacidade Clínica & Parâmetros de Mercado
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">
            Defina sua grade semanal de atendimentos e considere as faltas reais. Uma agenda
            sustentável protege seu tempo de estudo, prontuário e descanso.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-7">
        {/* Sessões / Semana (Stepper 1-60) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                Sessões Planejadas por Semana
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Capacidade máxima realista de atendimentos semanais (1 a 60)
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={sessoesPorSemana <= 1}
                onClick={() => onSetSessoesPorSemana(sessoesPorSemana - 1)}
                className="h-8 w-8 rounded-lg"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-mono font-bold text-lg text-slate-900 dark:text-white">
                {sessoesPorSemana}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={sessoesPorSemana >= 60}
                onClick={() => onSetSessoesPorSemana(sessoesPorSemana + 1)}
                className="h-8 w-8 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Semanas / Mês (Stepper 3-5) */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                Semanas Efetivas por Mês
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Padrão de 4 semanas de trabalho por mês clínico
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[3, 4, 5].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onSetSemanasPorMes(w)}
                  className={`w-10 h-9 rounded-lg font-mono font-semibold text-sm transition-all ${
                    semanasPorMes === w
                      ? 'bg-[#5B3A8E] text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {w} sem
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Taxa de Falta % Slider (0-50%) */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <CalendarX className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                  Taxa de Falta e Absenteísmo
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Perda por cancelamentos, feriados e faltas não remuneradas
                </span>
              </div>
            </div>
            <span className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
              {taxaFalta}%
            </span>
          </div>

          <Slider
            value={[taxaFalta]}
            min={0}
            max={50}
            step={1}
            onValueChange={(vals) => onSetTaxaFaltaPct(vals[0] || 0)}
            className="py-1"
          />

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              {sessoesAgendadas} agendadas → <strong>{sessoesEfetivas} sessões remuneradas</strong>
            </span>
            <span className="text-slate-500">
              Perda mensal: ~{(sessoesAgendadas - sessoesEfetivas).toFixed(1)} atendimentos
            </span>
          </div>
        </div>

        {/* Preço Atual Opcional */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <CurrencyInput
            id="preco-atual"
            label="Preço Atual por Sessão (Opcional — para diagnóstico da lacuna)"
            icon={<BadgeDollarSign className="w-4 h-4" />}
            value={state.precoAtual || 0}
            onChange={onSetPrecoAtual}
            placeholder="0,00"
            helperText="Quanto você cobra em média hoje? Permite calcular seu déficit ou superávit clínico no próximo passo."
          />
        </div>

        {/* Seletor Segmentado CFP */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#5B3A8E]/10 text-[#5B3A8E] dark:text-purple-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                Referência da Tabela de Honorários CFP
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Parâmetro oficial do Conselho Federal de Psicologia / FENAPSI
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'inferior' as const, label: 'Inferior', val: CFP_VALUES.inferior },
              { id: 'medio' as const, label: 'Médio (Padrão)', val: CFP_VALUES.medio },
              { id: 'superior' as const, label: 'Superior', val: CFP_VALUES.superior },
              {
                id: 'personalizado' as const,
                label: 'Personalizado',
                val: state.cfpConfig.customValue || CFP_VALUES.medio,
              },
            ].map((t) => {
              const isSelected = state.cfpConfig.tier === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSetCfpTier(t.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-[#5B3A8E] bg-[#F5F2F9] dark:bg-purple-950/50 text-[#5B3A8E] dark:text-purple-300 ring-2 ring-[#5B3A8E]/30 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-purple-200 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs block">{t.label}</span>
                  <span className="font-mono text-xs font-bold block mt-0.5 text-slate-900 dark:text-white">
                    {t.id === 'personalizado' ? 'Valor próprio' : formatBRL(t.val)}
                  </span>
                </button>
              )
            })}
          </div>

          {state.cfpConfig.tier === 'personalizado' && (
            <div className="pt-2">
              <CurrencyInput
                label="Valor de Referência Personalizado"
                value={state.cfpConfig.customValue || 0}
                onChange={(val) => onSetCfpTier('personalizado', val)}
                placeholder="0,00"
                helperText="Defina um piso de referência do seu estado ou sindicato regional"
              />
            </div>
          )}
        </div>
      </div>

      {/* Botões de Navegação */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-2 border-slate-300 dark:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar a Reserva & Tributos
        </Button>
        <Button
          onClick={onNext}
          className="gap-2 bg-[#5B3A8E] hover:bg-[#452A6F] text-white px-7 font-medium shadow-md text-base"
        >
          Ver Painel Executivo de Resultados
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
