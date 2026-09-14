import React, { useState } from 'react'
import {
  Target,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/CurrencyInput'
import { CalculationResult, PricingState, CFP_VALUES } from '@/types/pricing'
import { formatBRL, formatNumberBR } from '@/lib/currency'
import { toast } from 'sonner'

interface RevenueGoalProps {
  state: PricingState
  calculation: CalculationResult
  onAdjustGrade: (sessoesPorSemana: number) => void
}

const PRESET_GOALS = [10000, 15000, 20000]

export const IdealRevenueGoalCalculator: React.FC<RevenueGoalProps> = ({
  state,
  calculation,
  onAdjustGrade,
}) => {
  const [metaFaturamento, setMetaFaturamento] = useState<number>(0)
  const [precoReferencia, setPrecoReferencia] = useState<'piso' | 'atual' | 'cfp'>('piso')

  // Determinar preço base para a conta reversa
  let basePrice = calculation.pisoMinimoSessao
  if (precoReferencia === 'atual' && (state.precoAtual || 0) > 0) {
    basePrice = state.precoAtual
  } else if (precoReferencia === 'cfp') {
    basePrice = calculation.cfpValorReferencia
  }

  const semanasPorMes = Math.max(1, state.semanasPorMes || 4)
  const taxaFalta = Math.max(0, Math.min(100, state.taxaFaltaPct || 0)) / 100

  // Fórmula reversa:
  // meta = sessões/sem × semanasPorMês × (1 - taxaFalta) × basePrice
  // sessões/sem necessárias = meta / (basePrice × semanasPorMês × (1 - taxaFalta))
  let sessoesNecessarias = 0
  const denominador = basePrice * semanasPorMes * (1 - taxaFalta)
  if (denominador > 0 && metaFaturamento > 0) {
    sessoesNecessarias = Math.round((metaFaturamento / denominador) * 10) / 10
  }

  // Horas reais de dedicação = sessoes * 1.5 (atendimento + prontuário/estudo)
  const horasDedicacaoReal = Math.round(sessoesNecessarias * 1.5 * 10) / 10

  // Diagnóstico de Burnout
  const isHealthy = sessoesNecessarias <= 20
  const isModerate = sessoesNecessarias > 20 && sessoesNecessarias <= 28
  const isBurnout = sessoesNecessarias > 28

  const handleApplyToGrade = () => {
    const rounded = Math.max(1, Math.min(60, Math.round(sessoesNecessarias)))
    onAdjustGrade(rounded)
    toast.success(`Capacidade clínica atualizada para ${rounded} sessões semanais no Passo 5!`)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-[#5B3A8E] text-white">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
            Planejador Reverso de Meta de Faturamento
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Descubra quantas sessões semanais são necessárias para atingir seu objetivo financeiro
            sem entrar em burnout
          </p>
        </div>
      </div>

      {/* Meta Input com Chips */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Escolha uma meta de faturamento bruto mensal:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_GOALS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setMetaFaturamento(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                metaFaturamento === preset
                  ? 'bg-[#5B3A8E] text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {formatBRL(preset)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setMetaFaturamento(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              metaFaturamento === 0
                ? 'bg-purple-100 text-[#5B3A8E] dark:bg-purple-950 dark:text-purple-300'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Personalizado
          </button>
        </div>

        <CurrencyInput
          value={metaFaturamento}
          onChange={setMetaFaturamento}
          placeholder="Ex: 12.000,00"
          helperText="Informe o total bruto mensal que deseja faturar na clínica"
        />
      </div>

      {/* Seletor de Base de Preço */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Base de preço considerada por atendimento:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPrecoReferencia('piso')}
            className={`p-2.5 rounded-lg text-left border text-xs transition-all ${
              precoReferencia === 'piso'
                ? 'border-[#5B3A8E] bg-[#F5F2F9] dark:bg-purple-950/40 text-[#5B3A8E] font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-600'
            }`}
          >
            <span className="block font-medium">Piso Ético FAC</span>
            <span className="font-mono font-bold">{formatBRL(calculation.pisoMinimoSessao)}</span>
          </button>

          <button
            type="button"
            disabled={!state.precoAtual || state.precoAtual <= 0}
            onClick={() => setPrecoReferencia('atual')}
            className={`p-2.5 rounded-lg text-left border text-xs transition-all disabled:opacity-40 ${
              precoReferencia === 'atual'
                ? 'border-[#5B3A8E] bg-[#F5F2F9] dark:bg-purple-950/40 text-[#5B3A8E] font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-600'
            }`}
          >
            <span className="block font-medium">Preço Atual</span>
            <span className="font-mono font-bold">
              {state.precoAtual > 0 ? formatBRL(state.precoAtual) : 'Não informado'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPrecoReferencia('cfp')}
            className={`p-2.5 rounded-lg text-left border text-xs transition-all ${
              precoReferencia === 'cfp'
                ? 'border-[#5B3A8E] bg-[#F5F2F9] dark:bg-purple-950/40 text-[#5B3A8E] font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-600'
            }`}
          >
            <span className="block font-medium">Tabela CFP</span>
            <span className="font-mono font-bold">{formatBRL(calculation.cfpValorReferencia)}</span>
          </button>
        </div>
      </div>

      {/* Resultado do Planejador */}
      {metaFaturamento > 0 && sessoesNecessarias > 0 && (
        <div className="pt-3 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                  Carga Semanal Necessária
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
                    {formatNumberBR(sessoesNecessarias, 1)}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    sessões / semana
                  </span>
                </div>
              </div>

              {/* Dedicação Semanal Real */}
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold font-mono">
                    {formatNumberBR(horasDedicacaoReal, 1)}h
                  </span>
                  <span className="text-[11px] block text-amber-700 dark:text-amber-300">
                    Dedicação real (1,5h por sessão)
                  </span>
                </div>
              </div>
            </div>

            {/* Banners de Risco de Burnout */}
            {isHealthy && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Carga Saudável e Equilibrada.</strong> Você tem margem para estudo,
                  supervisão e vida pessoal com tranquilidade.
                </span>
              </div>
            )}

            {isModerate && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 flex items-center gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Carga Moderada a Densa.</strong> Exija rigor absoluto com intervalos entre
                  sessões e evite acúmulo de prontuários.
                </span>
              </div>
            )}

            {isBurnout && (
              <div className="p-4 rounded-xl bg-rose-700 text-white flex items-start gap-3 text-xs shadow-md">
                <Flame className="w-5 h-5 shrink-0 mt-0.5 text-rose-200 animate-pulse" />
                <div className="space-y-1">
                  <strong className="text-sm font-serif block">
                    Alerta Crítico de Risco de Burnout
                  </strong>
                  <p className="leading-relaxed text-rose-100">
                    O caminho para crescer não é lotar a agenda até a exaustão, mas elevar o valor
                    por sessão. Mais de 28 atendimentos semanais compromete a escuta ética e o
                    equilíbrio psíquico do terapeuta.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={handleApplyToGrade}
            className="w-full gap-2 bg-[#5B3A8E] hover:bg-[#452A6F] text-white font-medium"
          >
            Ajustar minha grade para {Math.round(sessoesNecessarias)} sessões/semana
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
