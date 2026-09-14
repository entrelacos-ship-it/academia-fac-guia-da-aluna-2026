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
      {/* Banner de Explicação */}
      <div className="p-4 rounded-xl bg-[#F5F2F9] dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#5B3A8E] text-white shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
            Passo 1: Custos Pessoais de Vida
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">
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
            <div className="pt-4 space-y-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Itens Personalizados Adicionados:
              </span>
              <div className="space-y-2">
                {state.custosPessoais.customItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {formatBRL(item.value)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveCustom(item.id)}
                        className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950"
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
              className="gap-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-[#5B3A8E] hover:border-purple-300"
            >
              <Plus className="w-4 h-4" />
              Adicionar item personalizado
            </Button>
          ) : (
            <form
              onSubmit={handleAddCustom}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5B3A8E] uppercase tracking-wider">
                  Novo Custo Pessoal
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAdding(false)}
                  className="h-7 text-xs text-slate-500"
                >
                  Cancelar
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Nome do item (ex: Academia, Seguro)"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  className="h-10 text-sm"
                  autoFocus
                />
                <CurrencyInput value={customVal} onChange={setCustomVal} placeholder="0,00" />
              </div>

              <Button
                type="submit"
                size="sm"
                disabled={!customLabel.trim()}
                className="w-full bg-[#5B3A8E] hover:bg-[#452A6F] text-white"
              >
                Salvar Item
              </Button>
            </form>
          )}
        </div>

        {/* Card Sticky de Totalização */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-900/60 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B3A8E] dark:text-purple-400">
              Subtotal Pessoal
            </span>

            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                {formatBRL(totalPessoais)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Necessidade mensal de sobrevivência e dignidade
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Info className="w-3.5 h-3.5 text-[#5B3A8E] shrink-0" />
                <span>Você pode preencher valores estimados e ajustá-los a qualquer momento.</span>
              </div>
            </div>
          </div>
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
          Voltar
        </Button>
        <Button
          onClick={onNext}
          className="gap-2 bg-[#5B3A8E] hover:bg-[#452A6F] text-white px-6 font-medium shadow-sm"
        >
          Continuar para Custos Profissionais
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
