import React, { useState } from 'react'
import {
  Home,
  Utensils,
  Car,
  HeartPulse,
  Users,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/CurrencyInput'
import { PricingState } from '@/types/pricing'
import { sumCustosPessoais } from '@/lib/facMath'
import { formatBRL } from '@/lib/currency'

interface StepPessoaisProps {
  state: PricingState
  onUpdate: (field: keyof PricingState['custosPessoais'], val: number) => void
  onAddCustom: (label: string, val: number) => void
  onRemoveCustom: (id: string) => void
  onNext: () => void
  onPrev: () => void
}

export const StepPessoais: React.FC<StepPessoaisProps> = ({
  state,
  onUpdate,
  onAddCustom,
  onRemoveCustom,
  onNext,
  onPrev,
}) => {
  const [customLabel, setCustomLabel] = useState('')
  const [customVal, setCustomVal] = useState(0)
  const [isAdding, setIsAdding] = useState(false)

  const totalPessoais = sumCustosPessoais(state.custosPessoais)

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customLabel.trim()) return
    onAddCustom(customLabel.trim(), customVal)
    setCustomLabel('')
    setCustomVal(0)
    setIsAdding(false)
  }

  return (
    <div className="space-y-8">
      {/* Banner de Explicação Astral */}
      <div className="p-4 rounded-[12px] bg-[#18181B] border border-[#27272A] flex items-start gap-3">
        <div className="p-2 rounded-[8px] bg-[#0A0A14] border border-[#27272A] text-[#C084FC] shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-[#FB923C]" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold text-[#C084FC] uppercase tracking-wider">
            PASSO 1 / 7
          </span>
          <h2 className="font-sans text-lg font-semibold text-white">Custos Pessoais de Vida</h2>
          <p className="text-xs text-[#A1A1AA] leading-relaxed mt-0.5">
            Despesas básicas de sobrevivência e dignidade pessoal. O Método FAC começa aqui: sua
            clínica deve, antes de tudo, sustentar sua existência digna no mundo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Formulário de Categorias (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CurrencyInput
              id="moradia"
              label="Moradia"
              icon={<Home className="w-4 h-4" />}
              value={state.custosPessoais.moradia}
              onChange={(val) => onUpdate('moradia', val)}
              placeholder="0,00"
              helperText="Aluguel/financiamento, condomínio, IPTU"
            />

            <CurrencyInput
              id="alimentacao"
              label="Alimentação"
              icon={<Utensils className="w-4 h-4" />}
              value={state.custosPessoais.alimentacao}
              onChange={(val) => onUpdate('alimentacao', val)}
              placeholder="0,00"
              helperText="Supermercado, feira, refeições diárias"
            />

            <CurrencyInput
              id="transporte"
              label="Transporte"
              icon={<Car className="w-4 h-4" />}
              value={state.custosPessoais.transporte}
              onChange={(val) => onUpdate('transporte', val)}
              placeholder="0,00"
              helperText="Combustível, transporte público, IPVA, Uber"
            />

            <CurrencyInput
              id="saude"
              label="Saúde Pessoal"
              icon={<HeartPulse className="w-4 h-4" />}
              value={state.custosPessoais.saude}
              onChange={(val) => onUpdate('saude', val)}
              placeholder="0,00"
              helperText="Plano de saúde, terapia pessoal, medicamentos"
            />

            <CurrencyInput
              id="dependentes"
              label="Dependentes / Família"
              icon={<Users className="w-4 h-4" />}
              value={state.custosPessoais.dependentes}
              onChange={(val) => onUpdate('dependentes', val)}
              placeholder="0,00"
              helperText="Escola dos filhos, apoio a familiares"
            />

            <CurrencyInput
              id="outros-pessoais"
              label="Outros Gastos Pessoais"
              icon={<Plus className="w-4 h-4" />}
              value={state.custosPessoais.outros}
              onChange={(val) => onUpdate('outros', val)}
              placeholder="0,00"
              helperText="Vestuário, cuidados pessoais, pets"
            />
          </div>

          {/* Itens Personalizados */}
          {state.custosPessoais.customItems.length > 0 && (
            <div className="pt-4 space-y-2 border-t border-[#27272A]">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Itens Personalizados Adicionados:
              </span>
              <div className="space-y-2">
                {state.custosPessoais.customItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-[8px] bg-[#18181B] border border-[#27272A] text-sm"
                  >
                    <span className="font-medium text-white">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-[#C084FC]">
                        {formatBRL(item.value)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveCustom(item.id)}
                        className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-[6px]"
                        aria-label={`Remover item ${item.label}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Adicionar Item Personalizado */}
          {!isAdding ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAdding(true)}
              className="gap-2 border-dashed border-[#27272A] bg-[#18181B]/50 text-[#A1A1AA] hover:text-white hover:border-[#C084FC]/50 rounded-[8px]"
            >
              <Plus className="w-4 h-4 text-[#C084FC]" />
              Adicionar item personalizado
            </Button>
          ) : (
            <form
              onSubmit={handleAddCustom}
              className="p-4 rounded-[12px] bg-[#18181B] border border-[#27272A] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#C084FC] uppercase tracking-wider">
                  Novo Custo Pessoal
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAdding(false)}
                  className="h-7 text-xs text-[#A1A1AA]"
                >
                  Cancelar
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Nome do item (ex: Academia, Seguro)"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  className="h-10 text-sm bg-[#0A0A14] border-[#27272A] text-white focus:border-[#C084FC] rounded-[8px]"
                  autoFocus
                />
                <CurrencyInput value={customVal} onChange={setCustomVal} placeholder="0,00" />
              </div>

              <Button
                type="submit"
                size="sm"
                disabled={!customLabel.trim()}
                className="w-full bg-[#C084FC] hover:bg-[#a855f7] text-[#0A0A14] font-semibold rounded-[8px]"
              >
                Salvar Item
              </Button>
            </form>
          )}
        </div>

        {/* Card Sticky de Totalização Astral */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="p-6 rounded-[16px] bg-[#18181B] border border-[#27272A] shadow-xl space-y-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C084FC]">
              Subtotal Pessoal
            </span>

            <div className="space-y-1">
              <div className="font-mono text-3xl sm:text-4xl font-bold text-white">
                {formatBRL(totalPessoais)}
              </div>
              <p className="text-xs text-[#A1A1AA]">
                Necessidade mensal de sobrevivência e dignidade
              </p>
            </div>

            <div className="pt-4 border-t border-[#27272A] space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                <Info className="w-3.5 h-3.5 text-[#C084FC] shrink-0" />
                <span>Você pode preencher valores estimados e ajustá-los a qualquer momento.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Navegação */}
      <div className="flex items-center justify-between pt-6 border-t border-[#27272A]">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-2 border-[#27272A] bg-[#18181B] text-[#A1A1AA] hover:text-white rounded-[8px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button
          onClick={onNext}
          className="gap-2 bg-[#C084FC] hover:bg-[#a855f7] text-[#0A0A14] font-semibold px-6 rounded-[8px] shadow-md shadow-[#C084FC]/20"
        >
          Continuar para Custos Profissionais
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
