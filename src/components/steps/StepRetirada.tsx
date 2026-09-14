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
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Banner de Explicação */}
      <div className="p-4 rounded-xl bg-[#F5F2F9] dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#5B3A8E] text-white shrink-0 mt-0.5">
          <Coins className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
            Passo 3: Retirada Desejada (Pró-Labore)
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">
            Valor livre para lazer, projetos futuros e qualidade de vida, além dos seus custos
            fixos. Este é o seu verdadeiro &ldquo;salário líquido pessoal&rdquo; do consultório.
          </p>
        </div>
      </div>

      {/* Caixa Central de Entrada */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Atalhos Rápidos */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
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
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'border-[#5B3A8E] bg-[#F5F2F9] dark:bg-purple-950/50 text-[#5B3A8E] dark:text-purple-300 ring-2 ring-[#5B3A8E]/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-purple-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold block">{p.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#5B3A8E]" />}
                  </div>
                  <div className="font-mono text-base font-bold mt-1 text-slate-900 dark:text-white">
                    {formatBRL(p.value)}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
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
            icon={<Coins className="w-4 h-4" />}
            value={currentRetirada}
            onChange={onSetRetirada}
            size="large"
            placeholder="0,00"
            helperText="Digite qualquer valor livre ou selecione um atalho acima"
          />
        </div>

        {/* Feedback Contextual Dinâmico */}
        {currentRetirada > 0 && currentRetirada < 1000 && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Você está considerando uma retirada conservadora. Lembre-se de incluir lazer, descanso
              remunerado e reservas pessoais para manter a saúde mental ao longo da carreira.
            </p>
          </div>
        )}

        {currentRetirada >= 5000 && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-200">
            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Excelente ambição clínica! O Método FAC permite estruturar sua agenda com qualidade e
              tempo de estudo para atingir faturamento elevado de forma sustentável e sem burnout.
            </p>
          </div>
        )}
      </div>

      {/* Botões de Navegação */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-2 border-slate-300 dark:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos Custos Profissionais
        </Button>
        <Button
          onClick={onNext}
          className="gap-2 bg-[#5B3A8E] hover:bg-[#452A6F] text-white px-6 font-medium shadow-sm"
        >
          Continuar para Reserva & Tributação
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
