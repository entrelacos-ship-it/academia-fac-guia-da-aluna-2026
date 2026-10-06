import React from 'react'
import { Coins, ArrowRight, ArrowLeft, Sparkles, Info, Check, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/CurrencyInput'
import { PricingState } from '@/types/pricing'
import { formatBRL } from '@/lib/currency'

interface StepRetiradaProps {
  state: PricingState
  onSetRetirada: (val: number) => void
  onNext: () => void
  onPrev: () => void
}

const PRESETS = [
  { label: 'Estilo de vida mínimo', value: 1500, desc: 'Foco em estabilização inicial' },
  { label: 'Qualidade de vida', value: 2500, desc: 'Conforto equilibrado e lazer regular' },
  { label: 'Ambição de crescimento', value: 4000, desc: 'Expansão e projetos pessoais' },
]

export const StepRetirada: React.FC<StepRetiradaProps> = ({
  state,
  onSetRetirada,
  onNext,
  onPrev,
}) => {
  const currentRetirada = state.retiradaDesejada || 0

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Cabeçalho Editorial */}
      <div className="border-b border-slate-200/80 dark:border-zinc-800/80 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono font-medium text-[#7c3aed] dark:text-[#C084FC] tracking-wider uppercase">
            Passo 03 de 07
          </span>
          <span className="text-slate-300 dark:text-zinc-700">•</span>
          <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">Pilar 03</span>
        </div>
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-slate-900 dark:text-zinc-100">
          Retirada Desejada (Pró-Labore)
        </h2>
        <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2 max-w-2xl font-light leading-relaxed">
          Valor livre para lazer, projetos futuros e qualidade de vida, além dos seus custos fixos.
          Este é o seu verdadeiro &ldquo;salário líquido pessoal&rdquo; do consultório.
        </p>
      </div>

      {/* Caixa Central Editorial */}
      <div className="bg-white/80 dark:bg-[#0c0914] rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs space-y-6">
        {/* Atalhos Rápidos */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-[#A1A1AA]">
            Sugestões de Atividade Sugerida:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {PRESETS.map((p) => {
              const isSelected = currentRetirada === p.value
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => onSetRetirada(p.value)}
                  className={`p-3 rounded-[12px] text-left border transition-all ${
                    isSelected
                      ? 'border-[#7c3aed] dark:border-[#C084FC] bg-purple-50/80 dark:bg-[#121216] text-[#7c3aed] dark:text-[#C084FC] shadow-xs'
                      : 'border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#0A0A14] hover:border-slate-300 dark:hover:border-[#3F3F46] text-slate-700 dark:text-[#A1A1AA]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold block">{p.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC]" />
                    )}
                  </div>
                  <div className="font-mono text-base font-bold mt-1 text-slate-900 dark:text-white">
                    {formatBRL(p.value)}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-[#71717A] block mt-0.5">
                    {p.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Input Principal Grande */}
        <div className="pt-2">
          <CurrencyInput
            id="retirada-input"
            label="Sua Retirada Mensal Desejada"
            icon={<Coins className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />}
            value={currentRetirada}
            onChange={onSetRetirada}
            size="large"
            placeholder="0,00"
            helperText="Digite qualquer valor livre ou selecione um atalho acima"
          />
        </div>

        {/* Feedback Contextual Dinâmico */}
        {currentRetirada > 0 && currentRetirada < 1000 && (
          <div className="p-3.5 rounded-[12px] bg-orange-50/80 dark:bg-[#121216] border border-orange-200 dark:border-[#FB923C]/40 flex items-start gap-2.5 text-xs text-[#ea580c] dark:text-[#FB923C]">
            <Info className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C] shrink-0 mt-0.5" />
            <p>
              Você está considerando uma retirada conservadora. Lembre-se de incluir lazer, descanso
              remunerado e reservas pessoais para manter a saúde mental ao longo da carreira.
            </p>
          </div>
        )}

        {currentRetirada >= 5000 && (
          <div className="p-3.5 rounded-[12px] bg-purple-50/80 dark:bg-[#121216] border border-purple-200 dark:border-[#C084FC]/40 flex items-start gap-2.5 text-xs text-[#6d28d9] dark:text-purple-200">
            <TrendingUp className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC] shrink-0 mt-0.5" />
            <p>
              Excelente ambição clínica! O Método FAC permite estruturar sua agenda com qualidade e
              tempo de estudo para atingir faturamento elevado de forma sustentável e sem burnout.
            </p>
          </div>
        )}
      </div>

      {/* Botões de Navegação */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-slate-200/80 dark:border-zinc-800/80">
        <Button
          variant="outline"
          onClick={onPrev}
          className="min-h-[44px] justify-center gap-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button
          onClick={onNext}
          className="min-h-[44px] justify-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-medium px-6 rounded-lg transition-all"
        >
          <span>Reserva & Tributos</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
