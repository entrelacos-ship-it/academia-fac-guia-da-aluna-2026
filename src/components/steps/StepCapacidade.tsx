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
      {/* Banner Astral */}
      <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs flex items-start gap-3">
        <div className="p-2 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] shrink-0 mt-0.5">
          <CalendarDays className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold text-[#7c3aed] dark:text-[#C084FC] uppercase tracking-wider">
            PASSO 5 / 7
          </span>
          <h2 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
            Capacidade Clínica & Parâmetros de Mercado
          </h2>
          <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed mt-0.5">
            Defina sua grade semanal de atendimentos e considere as faltas reais. Uma agenda
            sustentável protege seu tempo de estudo, prontuário e descanso.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#18181B] rounded-[16px] p-6 sm:p-8 border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-7">
        {/* Sessões / Semana (Stepper 1-60) Astral */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                Sessões Planejadas por Semana
              </span>
              <span className="text-[11px] text-slate-600 dark:text-[#A1A1AA]">
                Capacidade máxima realista de atendimentos semanais (1 a 60)
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] p-1 rounded-[8px]">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={sessoesPorSemana <= 1}
                onClick={() => onSetSessoesPorSemana(sessoesPorSemana - 1)}
                className="h-8 w-8 rounded-[6px] text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-mono font-bold text-lg text-[#7c3aed] dark:text-[#C084FC]">
                {sessoesPorSemana}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={sessoesPorSemana >= 60}
                onClick={() => onSetSessoesPorSemana(sessoesPorSemana + 1)}
                className="h-8 w-8 rounded-[6px] text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Semanas / Mês (Stepper 3-5) Astral */}
        <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-[#27272A]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                Semanas Efetivas por Mês
              </span>
              <span className="text-[11px] text-slate-600 dark:text-[#A1A1AA]">
                Padrão de 4 semanas de trabalho por mês clínico
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[3, 4, 5].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onSetSemanasPorMes(w)}
                  className={`w-12 h-9 rounded-[8px] font-mono font-semibold text-xs transition-all ${
                    semanasPorMes === w
                      ? 'bg-[#7c3aed] dark:bg-[#C084FC] text-white dark:text-[#0A0A14] shadow-xs'
                      : 'bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-[#A1A1AA] hover:border-slate-300 dark:hover:border-[#3F3F46]'
                  }`}
                >
                  {w} sem
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Taxa de Falta % Slider (0-50%) Astral */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-[#27272A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-[6px] bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A] text-[#ea580c] dark:text-[#FB923C]">
                <CalendarX className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  Taxa de Falta e Absenteísmo
                </span>
                <span className="text-[11px] text-slate-600 dark:text-[#A1A1AA]">
                  Perda por cancelamentos, feriados e faltas não remuneradas
                </span>
              </div>
            </div>
            <span className="font-mono text-lg font-bold text-[#ea580c] dark:text-[#FB923C] px-2.5 py-0.5 rounded-[8px] bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A]">
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

          <div className="p-3 rounded-[8px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600 dark:text-[#A1A1AA]">
              {sessoesAgendadas} agendadas →{' '}
              <strong className="text-slate-900 dark:text-white">
                {sessoesEfetivas} sessões remuneradas
              </strong>
            </span>
            <span className="text-[#ea580c] dark:text-[#FB923C] font-semibold">
              Perda: ~{(sessoesAgendadas - sessoesEfetivas).toFixed(1)} sessões
            </span>
          </div>
        </div>

        {/* Preço Atual Opcional */}
        <div className="pt-4 border-t border-slate-200 dark:border-[#27272A]">
          <CurrencyInput
            id="preco-atual"
            label="Preço Atual por Sessão (Opcional — para diagnóstico da lacuna)"
            icon={<BadgeDollarSign className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />}
            value={state.precoAtual || 0}
            onChange={onSetPrecoAtual}
            placeholder="0,00"
            helperText="Quanto você cobra em média hoje? Permite calcular seu déficit ou superávit clínico no próximo passo."
          />
        </div>

        {/* Seletor Segmentado CFP Astral */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-[#27272A]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-[6px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                Referência da Tabela de Honorários CFP
              </span>
              <span className="text-[11px] text-slate-600 dark:text-[#A1A1AA]">
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
                  className={`p-2.5 rounded-[8px] border text-center transition-all ${
                    isSelected
                      ? 'border-[#7c3aed] dark:border-[#C084FC] bg-purple-50/80 dark:bg-[#121216] text-[#7c3aed] dark:text-[#C084FC] font-semibold shadow-xs'
                      : 'border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#0A0A14] text-slate-700 dark:text-[#A1A1AA] hover:border-slate-300 dark:hover:border-[#3F3F46]'
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
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-[#27272A]">
        <Button
          variant="outline"
          onClick={onPrev}
          className="min-h-[44px] justify-center gap-2 border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#27272A] rounded-[8px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button
          onClick={onNext}
          className="min-h-[44px] justify-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold px-6 rounded-[8px] shadow-md shadow-[#7c3aed]/20 dark:shadow-[#C084FC]/20 text-sm sm:text-base"
        >
          <span>Ver Resultados</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
