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
    <div className="bg-[#18181B] rounded-[16px] p-6 border border-[#27272A] shadow-xl space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-[8px] bg-[#0A0A14] border border-[#27272A] text-[#C084FC]">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C084FC] block">
            PLANEJAMENTO DE CAPACIDADE
          </span>
          <h3 className="font-sans text-lg font-semibold text-white">
            Planejador Reverso de Meta de Faturamento
          </h3>
          <p className="text-xs text-[#A1A1AA]">
            Descubra quantas sessões semanais são necessárias para atingir seu objetivo financeiro
            sem entrar em burnout
          </p>
        </div>
      </div>

      {/* Meta Input com Chips */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-semibold text-[#A1A1AA] uppercase tracking-wider block">
          Escolha uma meta de faturamento bruto mensal:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_GOALS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setMetaFaturamento(preset)}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-mono font-semibold transition-all ${
                metaFaturamento === preset
                  ? 'bg-[#C084FC] text-[#0A0A14] font-bold shadow-md shadow-[#C084FC]/20'
                  : 'bg-[#121216] border border-[#27272A] text-[#A1A1AA] hover:text-white'
              }`}
            >
              {formatBRL(preset)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setMetaFaturamento(0)}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-mono font-medium ${
              metaFaturamento === 0
                ? 'bg-[#18181B] text-[#FB923C] border border-[#FB923C]/40 font-bold'
                : 'text-[#71717A] hover:text-[#A1A1AA]'
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
      <div className="space-y-2 pt-2 border-t border-[#27272A]">
        <span className="text-xs font-mono font-semibold text-[#A1A1AA] uppercase tracking-wider block">
          Base de preço considerada por atendimento:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPrecoReferencia('piso')}
            className={`p-3 rounded-[8px] text-left border text-xs transition-all ${
              precoReferencia === 'piso'
                ? 'border-[#C084FC] bg-[#0A0A14] text-[#C084FC] font-semibold'
                : 'border-[#27272A] bg-[#121216] text-[#A1A1AA] hover:text-white'
            }`}
          >
            <span className="block font-sans text-xs">Piso Ético FAC</span>
            <span className="font-mono font-bold text-sm block mt-0.5">
              {formatBRL(calculation.pisoMinimoSessao)}
            </span>
          </button>

          <button
            type="button"
            disabled={!state.precoAtual || state.precoAtual <= 0}
            onClick={() => setPrecoReferencia('atual')}
            className={`p-3 rounded-[8px] text-left border text-xs transition-all disabled:opacity-40 ${
              precoReferencia === 'atual'
                ? 'border-[#C084FC] bg-[#0A0A14] text-[#C084FC] font-semibold'
                : 'border-[#27272A] bg-[#121216] text-[#A1A1AA] hover:text-white'
            }`}
          >
            <span className="block font-sans text-xs">Preço Atual</span>
            <span className="font-mono font-bold text-sm block mt-0.5">
              {state.precoAtual > 0 ? formatBRL(state.precoAtual) : 'Não informado'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPrecoReferencia('cfp')}
            className={`p-3 rounded-[8px] text-left border text-xs transition-all ${
              precoReferencia === 'cfp'
                ? 'border-[#C084FC] bg-[#0A0A14] text-[#C084FC] font-semibold'
                : 'border-[#27272A] bg-[#121216] text-[#A1A1AA] hover:text-white'
            }`}
          >
            <span className="block font-sans text-xs">Tabela CFP</span>
            <span className="font-mono font-bold text-sm block mt-0.5">
              {formatBRL(calculation.cfpValorReferencia)}
            </span>
          </button>
        </div>
      </div>

      {/* Resultado do Planejador */}
      {metaFaturamento > 0 && sessoesNecessarias > 0 && (
        <div className="pt-3 space-y-4">
          <div className="p-4 rounded-[12px] bg-[#121216] border border-[#27272A] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#71717A] block">
                  Carga Semanal Necessária
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-mono text-3xl font-bold text-white">
                    {formatNumberBR(sessoesNecessarias, 1)}
                  </span>
                  <span className="text-xs font-mono text-[#A1A1AA]">sessões / semana</span>
                </div>
              </div>

              {/* Dedicação Semanal Real */}
              <div className="p-2.5 rounded-[8px] bg-[#0A0A14] border border-[#27272A] text-xs font-mono text-[#FB923C] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FB923C] shrink-0" />
                <div>
                  <span className="font-bold">{formatNumberBR(horasDedicacaoReal, 1)}h</span>
                  <span className="text-[10px] block text-[#A1A1AA]">
                    Dedicação real (1,5h por sessão)
                  </span>
                </div>
              </div>
            </div>

            {/* Banners de Risco de Burnout */}
            {isHealthy && (
              <div className="p-3 rounded-[8px] bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Carga Saudável e Equilibrada.</strong> Você tem margem para estudo,
                  supervisão e vida pessoal com tranquilidade.
                </span>
              </div>
            )}

            {isModerate && (
              <div className="p-3 rounded-[8px] bg-amber-950/60 border border-amber-500/40 text-amber-200 flex items-center gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Carga Moderada a Densa.</strong> Exija rigor absoluto com intervalos entre
                  sessões e evite acúmulo de prontuários.
                </span>
              </div>
            )}

            {isBurnout && (
              <div className="p-4 rounded-[12px] bg-rose-950/90 border border-rose-500/60 text-white flex items-start gap-3 text-xs shadow-lg">
                <Flame className="w-5 h-5 shrink-0 mt-0.5 text-rose-400 animate-pulse" />
                <div className="space-y-1">
                  <strong className="text-sm font-sans font-semibold text-rose-200 block">
                    Alerta Crítico de Risco de Burnout (&gt;28 sessões/semana)
                  </strong>
                  <p className="leading-relaxed text-rose-100/90">
                    O caminho ético para crescer não é lotar a agenda até a exaustão, mas elevar o
                    valor por sessão. Mais de 28 atendimentos semanais compromete a escuta ética e o
                    equilíbrio psíquico do terapeuta.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={handleApplyToGrade}
            className="w-full gap-2 bg-[#C084FC] hover:bg-[#a855f7] text-[#0A0A14] font-semibold rounded-[8px] h-10 shadow-md shadow-[#C084FC]/20"
          >
            Ajustar minha grade para {Math.round(sessoesNecessarias)} sessões/semana
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
