import React, { useState } from 'react'
import {
  Building2,
  Wifi,
  Laptop,
  GraduationCap,
  BookOpen,
  Calculator,
  Megaphone,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/CurrencyInput'
import { PricingState } from '@/types/pricing'
import { sumCustosProfissionais } from '@/lib/facMath'
import { formatBRL } from '@/lib/currency'

interface StepProfissionaisProps {
  state: PricingState
  onUpdate: (field: keyof PricingState['custosProfissionais'], val: number) => void
  onAddCustom: (label: string, val: number) => void
  onRemoveCustom: (id: string) => void
  onNext: () => void
  onPrev: () => void
}

export const StepProfissionais: React.FC<StepProfissionaisProps> = ({
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

  const totalProfissionais = sumCustosProfissionais(state.custosProfissionais)

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
      {/* Banner de Explicação Verde Esmeralda */}
      <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#16746E] text-white shrink-0 mt-0.5">
          <Briefcase className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
            Passo 2: Custos Profissionais da Prática Clínica
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">
            Custos operacionais do consultório. Para atender com excelência e segurança ética, você
            precisa manter supervisão, ferramentas e espaço qualificado.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Formulário de Categorias (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CurrencyInput
              id="sala"
              label="Sala / Sublocação / Coworking"
              icon={<Building2 className="w-4 h-4" />}
              value={state.custosProfissionais.sala}
              onChange={(val) => onUpdate('sala', val)}
              placeholder="0,00"
              helperText="Aluguel do consultório ou horas de sublocação"
            />

            <CurrencyInput
              id="internet"
              label="Internet / Telefone Profissional"
              icon={<Wifi className="w-4 h-4" />}
              value={state.custosProfissionais.internet}
              onChange={(val) => onUpdate('internet', val)}
              placeholder="0,00"
              helperText="Plano de fibra, linha dedicada de WhatsApp"
            />

            <CurrencyInput
              id="softwares"
              label="Softwares / Prontuário Eletrônico"
              icon={<Laptop className="w-4 h-4" />}
              value={state.custosProfissionais.softwares}
              onChange={(val) => onUpdate('softwares', val)}
              placeholder="0,00"
              helperText="Psicomanager, Google Workspace, Zoom Pro"
            />

            <CurrencyInput
              id="supervisao"
              label="Supervisão Clínica"
              icon={<GraduationCap className="w-4 h-4" />}
              value={state.custosProfissionais.supervisao}
              onChange={(val) => onUpdate('supervisao', val)}
              placeholder="0,00"
              helperText="Encontros mensais de supervisão técnica"
            />

            <CurrencyInput
              id="formacao"
              label="Formação Continuada / Livros"
              icon={<BookOpen className="w-4 h-4" />}
              value={state.custosProfissionais.formacao}
              onChange={(val) => onUpdate('formacao', val)}
              placeholder="0,00"
              helperText="Pós-graduação, cursos livres, congressos"
            />

            <CurrencyInput
              id="contador"
              label="Contador / Assessoria Contábil"
              icon={<Calculator className="w-4 h-4" />}
              value={state.custosProfissionais.contador}
              onChange={(val) => onUpdate('contador', val)}
              placeholder="0,00"
              helperText="Honorário mensal de contabilidade"
            />

            <CurrencyInput
              id="marketing"
              label="Marketing Ético / Divulgação"
              icon={<Megaphone className="w-4 h-4" />}
              value={state.custosProfissionais.marketing}
              onChange={(val) => onUpdate('marketing', val)}
              placeholder="0,00"
              helperText="Site, Google Ads, fotos profissionais"
            />

            <CurrencyInput
              id="outros-profissionais"
              label="Outros Custos Profissionais"
              icon={<Plus className="w-4 h-4" />}
              value={state.custosProfissionais.outros}
              onChange={(val) => onUpdate('outros', val)}
              placeholder="0,00"
              helperText="Anuidade do CRP, materiais de teste, café"
            />
          </div>

          {/* Itens Personalizados */}
          {state.custosProfissionais.customItems.length > 0 && (
            <div className="pt-4 space-y-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Itens Personalizados Adicionados:
              </span>
              <div className="space-y-2">
                {state.custosProfissionais.customItems.map((item) => (
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
              className="gap-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-[#16746E] hover:border-emerald-300"
            >
              <Plus className="w-4 h-4" />
              Adicionar item profissional personalizado
            </Button>
          ) : (
            <form
              onSubmit={handleAddCustom}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#16746E] uppercase tracking-wider">
                  Novo Custo Profissional
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
                  placeholder="Nome do item (ex: Seguro RC, Anuidade CRP)"
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
                className="w-full bg-[#16746E] hover:bg-[#125853] text-white"
              >
                Salvar Item
              </Button>
            </form>
          )}
        </div>

        {/* Card Sticky de Totalização Verde Esmeralda */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-900/60 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16746E] dark:text-emerald-400">
              Subtotal Profissional
            </span>

            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                {formatBRL(totalProfissionais)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manutenção mensal da sua prática clínica ética
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Info className="w-3.5 h-3.5 text-[#16746E] shrink-0" />
                <span>
                  Supervisão e formação contínua são pilares éticos inegociáveis previstos pelo CFP.
                </span>
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
          Voltar aos Custos Pessoais
        </Button>
        <Button
          onClick={onNext}
          className="gap-2 bg-[#5B3A8E] hover:bg-[#452A6F] text-white px-6 font-medium shadow-sm"
        >
          Continuar para Retirada Desejada
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
