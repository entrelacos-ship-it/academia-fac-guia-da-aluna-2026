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
      {/* Cabeçalho Editorial */}
      <div className="border-b border-slate-200/80 dark:border-zinc-800/80 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono font-medium text-[#7c3aed] dark:text-[#C084FC] tracking-wider uppercase">
            Passo 02 de 07
          </span>
          <span className="text-slate-400 dark:text-zinc-600">•</span>
          <span className="text-xs font-mono text-slate-600 dark:text-zinc-400">Pilar 02</span>
        </div>
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-slate-900 dark:text-zinc-100 tracking-tight">
          Custos Profissionais da Prática Clínica
        </h2>
        <p className="text-sm text-slate-700 dark:text-zinc-300 mt-2 max-w-2xl font-normal leading-relaxed">
          Custos operacionais do consultório. Para atender com excelência e segurança ética, você
          precisa manter supervisão, ferramentas e espaço qualificado.
        </p>
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
            <div className="pt-4 space-y-2 border-t border-slate-200 dark:border-[#27272A]">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-[#A1A1AA]">
                Itens Personalizados Adicionados:
              </span>
              <div className="space-y-2">
                {state.custosProfissionais.customItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-[8px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-sm shadow-xs"
                  >
                    <span className="font-medium text-slate-900 dark:text-white">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-[#ea580c] dark:text-[#FB923C]">
                        {formatBRL(item.value)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveCustom(item.id)}
                        className="h-8 w-8 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-[6px]"
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
              className="gap-2 border-dashed border-slate-300 dark:border-[#27272A] bg-slate-50/50 dark:bg-[#18181B]/50 text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:border-[#ea580c]/50 dark:hover:border-[#FB923C]/50 rounded-[8px]"
            >
              <Plus className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
              Adicionar item profissional personalizado
            </Button>
          ) : (
            <form
              onSubmit={handleAddCustom}
              className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#ea580c] dark:text-[#FB923C] uppercase tracking-wider">
                  Novo Custo Profissional
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAdding(false)}
                  className="h-7 text-xs text-slate-500 dark:text-[#A1A1AA]"
                >
                  Cancelar
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Nome do item (ex: Seguro RC, Anuidade CRP)"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  className="h-10 text-sm bg-white dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-zinc-500 focus:border-[#ea580c] dark:focus:border-[#FB923C] rounded-[8px]"
                  autoFocus
                />
                <CurrencyInput value={customVal} onChange={setCustomVal} placeholder="0,00" />
              </div>

              <Button
                type="submit"
                size="sm"
                disabled={!customLabel.trim()}
                className="w-full bg-[#ea580c] hover:bg-[#c2410c] dark:bg-[#FB923C] dark:hover:bg-[#ea580c] text-white dark:text-[#0A0A14] font-semibold rounded-[8px]"
              >
                Salvar Item
              </Button>
            </form>
          )}
        </div>

        {/* Painel Sticky Editorial */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#0c0914] border border-slate-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              Subtotal Profissional
            </span>

            <div className="space-y-1">
              <div className="font-serif-editorial text-3xl sm:text-4xl text-slate-900 dark:text-zinc-100">
                {formatBRL(totalProfissionais)}
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal">
                Manutenção mensal da sua prática clínica ética
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/70 dark:border-zinc-800/70 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400 font-normal">
                <Info className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC] shrink-0" />
                <span>
                  Supervisão e terapia pessoal são custos técnicos para a sustentabilidade emocional
                  da prática clínica.
                </span>
              </div>
            </div>
          </div>
        </div>
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
          <span>Retirada (Pró-Labore)</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
