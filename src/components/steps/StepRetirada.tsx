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
      {/* Banner de Explicação Astral */}
      <div className="p-4 rounded-[12px] bg-[#18181B] border border-[#27272A] flex items-start gap-3">
        <div className="p-2 rounded-[8px] bg-[#0A0A14] border border-[#27272A] text-[#C084FC] shrink-0 mt-0.5">
          <Coins className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#C084FC] uppercase tracking-wider">
              PASSO 3 / 7
            </span>
          </div>
          <h2 className="font-sans text-lg font-semibold text-white">
            Retirada Desejada (Pró-Labore)
          </h2>
          <p className="text-xs text-[#A1A1AA] leading-relaxed mt-0.5">
            Valor livre para lazer, projetos futuros e qualidade de vida, além dos seus custos
            fixos. Este é o seu verdadeiro &ldquo;salário líquido pessoal&rdquo; do consultório.
          </p>
        </div>
      </div>

      {/* Caixa Central de Entrada Astral */}
      <div className="bg-[#18181B] rounded-[16px] p-6 sm:p-8 border border-[#27272A] shadow-xl space-y-6">
        {/* Atalhos Rápidos */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A1A1AA]">
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
                      ? 'border-[#C084FC] bg-[#121216] text-[#C084FC] shadow-sm'
                      : 'border-[#27272A] bg-[#0A0A14] hover:border-[#3F3F46] text-[#A1A1AA]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold block">{p.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#C084FC]" />}
                  </div>
                  <div className="font-mono text-base font-bold mt-1 text-white">
                    {formatBRL(p.value)}
                  </div>
                  <span className="text-[10px] font-mono text-[#71717A] block mt-0.5">
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
            icon={<Coins className="w-4 h-4 text-[#C084FC]" />}
            value={currentRetirada}
            onChange={onSetRetirada}
            size="large"
            placeholder="0,00"
            helperText="Digite qualquer valor livre ou selecione um atalho acima"
          />
        </div>

        {/* Feedback Contextual Dinâmico */}
        {currentRetirada > 0 && currentRetirada < 1000 && (
          <div className="p-3.5 rounded-[12px] bg-[#121216] border border-[#FB923C]/40 flex items-start gap-2.5 text-xs text-[#FB923C]">
            <Info className="w-4 h-4 text-[#FB923C] shrink-0 mt-0.5" />
            <p>
              Você está considerando uma retirada conservadora. Lembre-se de incluir lazer, descanso
              remunerado e reservas pessoais para manter a saúde mental ao longo da carreira.
            </p>
          </div>
        )}

        {currentRetirada >= 5000 && (
          <div className="p-3.5 rounded-[12px] bg-[#121216] border border-[#C084FC]/40 flex items-start gap-2.5 text-xs text-purple-200">
            <TrendingUp className="w-4 h-4 text-[#C084FC] shrink-0 mt-0.5" />
            <p>
              Excelente ambição clínica! O Método FAC permite estruturar sua agenda com qualidade e
              tempo de estudo para atingir faturamento elevado de forma sustentável e sem burnout.
            </p>
          </div>
        )}
      </div>

      {/* Botões de Navegação */}
      <div className="flex items-center justify-between pt-6 border-t border-[#27272A]">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-2 border-[#27272A] bg-[#18181B] text-[#A1A1AA] hover:text-white rounded-[8px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos Custos Profissionais
        </Button>
        <Button
          onClick={onNext}
          className="gap-2 bg-[#C084FC] hover:bg-[#a855f7] text-[#0A0A14] font-semibold px-6 rounded-[8px] shadow-md shadow-[#C084FC]/20"
        >
          Continuar para Reserva & Tributação
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
