import React, { useState } from 'react'
import { BookmarkPlus, Layers, Trash2, UploadCloud, Check, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PricingState, CalculationResult, SavedScenario } from '@/types/pricing'
import { calculateFacMetrics } from '@/lib/facMath'
import { formatBRL } from '@/lib/currency'
import { toast } from 'sonner'

interface ScenariosManagerProps {
  currentState: PricingState
  currentCalculation: CalculationResult
  scenarios: SavedScenario[]
  onSaveScenario: (name: string, notes?: string) => void
  onLoadScenario: (scenario: SavedScenario) => void
  onDeleteScenario: (id: string) => void
  onClearAll: () => void
}

export const SavedScenariosManager: React.FC<ScenariosManagerProps> = ({
  currentState,
  currentCalculation,
  scenarios,
  onSaveScenario,
  onLoadScenario,
  onDeleteScenario,
  onClearAll,
}) => {
  const [isSaving, setIsSaving] = useState(false)
  const [scenarioName, setScenarioName] = useState('')
  const [scenarioNotes, setScenarioNotes] = useState('')

  // 1. Cenário Base (Dados Atuais)
  const baseMetrics = currentCalculation

  // 2. Preset Conservador: 80% das sessões, taxa falta 15%
  const conservadorState: PricingState = {
    ...currentState,
    sessoesPorSemana: Math.max(1, Math.round((currentState.sessoesPorSemana || 15) * 0.8)),
    taxaFaltaPct: 15,
  }
  const conservadorMetrics = calculateFacMetrics(conservadorState)

  // 3. Preset Otimista: taxa falta 5%, reserva 12%, honorário +10%
  const otimistaState: PricingState = {
    ...currentState,
    taxaFaltaPct: 5,
    reservaPct: 12,
    precoAtual: currentState.precoAtual > 0 ? Math.round(currentState.precoAtual * 1.1) : 0,
  }
  const otimistaMetrics = calculateFacMetrics(otimistaState)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!scenarioName.trim()) return
    onSaveScenario(scenarioName.trim(), scenarioNotes.trim())
    setScenarioName('')
    setScenarioNotes('')
    setIsSaving(false)
    toast.success('Cenário salvo com sucesso!')
  }

  return (
    <div className="bg-white dark:bg-[#18181B] rounded-[16px] p-6 border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-[8px] bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A] text-[#ea580c] dark:text-[#FB923C]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] block">
              GERENCIAMENTO DE PROJEÇÕES
            </span>
            <h3 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
              Gerenciador e Comparativo de Cenários
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
              Compare modelos de atuação e salve projeções personalizadas da sua clínica
            </p>
          </div>
        </div>

        {!isSaving && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsSaving(true)}
            className="gap-1.5 border-purple-200 dark:border-[#27272A] bg-purple-50 dark:bg-[#0A0A14] text-[#7c3aed] dark:text-[#C084FC] hover:border-purple-300 dark:hover:border-[#C084FC]/50 hover:text-purple-900 dark:hover:text-white rounded-[8px] text-xs font-mono font-semibold"
          >
            <BookmarkPlus className="w-4 h-4" />
            Salvar cenário atual
          </Button>
        )}
      </div>

      {/* Formulário Inline de Salvar */}
      {isSaving && (
        <form
          onSubmit={handleSave}
          className="p-4 rounded-[12px] bg-slate-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#C084FC]/40 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#7c3aed] dark:text-[#C084FC] uppercase tracking-wider">
              Novo Cenário Clínico
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsSaving(false)}
              className="h-7 text-xs text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white"
            >
              Cancelar
            </Button>
          </div>

          <Input
            placeholder="Nome do cenário (ex: Consultório 100% Particular 2026)"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            className="h-9 text-sm bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white"
            autoFocus
          />

          <Textarea
            placeholder="Notas opcionais (ex: Redução de 2 planos de saúde e aumento do pró-labore)"
            value={scenarioNotes}
            onChange={(e) => setScenarioNotes(e.target.value)}
            className="text-xs h-16 resize-none bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white"
          />

          <Button
            type="submit"
            size="sm"
            disabled={!scenarioName.trim()}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px]"
          >
            Confirmar e Salvar Cenário
          </Button>
        </form>
      )}

      {/* Tabela Comparativa Lado a Lado (Base, Conservador, Otimista) */}
      <div className="overflow-x-auto rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14]">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-[#121216] text-slate-600 dark:text-[#A1A1AA] font-mono uppercase tracking-wider border-b border-slate-200 dark:border-[#27272A]">
            <tr>
              <th className="py-2.5 px-3 font-semibold">Cenário</th>
              <th className="py-2.5 px-3 font-semibold">Sessões / Mês</th>
              <th className="py-2.5 px-3 font-semibold">Piso Ético (V_min)</th>
              <th className="py-2.5 px-3 font-semibold">Faturamento Bruto</th>
              <th className="py-2.5 px-3 font-semibold">Diagnóstico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-[#27272A] text-slate-600 dark:text-[#A1A1AA]">
            {/* Cenário Base */}
            <tr className="bg-purple-50/40 dark:bg-[#18181B]/80 font-medium">
              <td className="py-2.5 px-3 text-[#7c3aed] dark:text-[#C084FC] font-bold">
                Cenário Base (Atual)
              </td>
              <td className="py-2.5 px-3 font-mono">{baseMetrics.sessoesAgendadas} agendadas</td>
              <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                {formatBRL(baseMetrics.pisoMinimoSessao)}
              </td>
              <td className="py-2.5 px-3 font-mono">{formatBRL(baseMetrics.faturamentoBruto)}</td>
              <td className="py-2.5 px-3">
                <span
                  className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase ${
                    baseMetrics.isDeficit
                      ? 'bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-500/40'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500/40'
                  }`}
                >
                  {baseMetrics.isDeficit ? 'Déficit Clínico' : 'Sustentável'}
                </span>
              </td>
            </tr>

            {/* Cenário Conservador */}
            <tr className="bg-slate-50/50 dark:bg-[#121216]/60">
              <td className="py-2.5 px-3 text-slate-900 dark:text-white">
                Conservador (80% agenda, 15% falta)
              </td>
              <td className="py-2.5 px-3 font-mono">
                {conservadorMetrics.sessoesAgendadas} agendadas
              </td>
              <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                {formatBRL(conservadorMetrics.pisoMinimoSessao)}
              </td>
              <td className="py-2.5 px-3 font-mono">
                {formatBRL(conservadorMetrics.faturamentoBruto)}
              </td>
              <td className="py-2.5 px-3">
                <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-semibold bg-slate-100 dark:bg-[#18181B] text-slate-700 dark:text-[#A1A1AA] border border-slate-200 dark:border-[#27272A]">
                  Resguardo
                </span>
              </td>
            </tr>

            {/* Cenário Otimista */}
            <tr className="bg-white dark:bg-[#121216]/40">
              <td className="py-2.5 px-3 text-slate-900 dark:text-white">
                Otimista (5% falta, 12% reserva)
              </td>
              <td className="py-2.5 px-3 font-mono">
                {otimistaMetrics.sessoesAgendadas} agendadas
              </td>
              <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                {formatBRL(otimistaMetrics.pisoMinimoSessao)}
              </td>
              <td className="py-2.5 px-3 font-mono">
                {formatBRL(otimistaMetrics.faturamentoBruto)}
              </td>
              <td className="py-2.5 px-3">
                <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/40">
                  Alta Eficiência
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Lista de Cenários Salvos pelo Usuário */}
      {scenarios.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-[#27272A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-[#A1A1AA]">
              Seus Cenários Salvos ({scenarios.length})
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11px] font-mono text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 underline"
            >
              Limpar todos
            </button>
          </div>

          <div className="space-y-2">
            {scenarios.map((sc) => (
              <div
                key={sc.id}
                className="p-3.5 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-sans font-semibold text-slate-900 dark:text-white block">
                    {sc.name}
                  </span>
                  {sc.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-[#71717A] italic">
                      {sc.notes}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-[#A1A1AA] font-mono pt-1">
                    <span>Piso: {formatBRL(sc.vMin)}</span>
                    <span>•</span>
                    <span>Bruto: {formatBRL(sc.fBruto)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onLoadScenario(sc)
                      toast.info(`Cenário "${sc.name}" carregado com sucesso!`)
                    }}
                    className="h-8 gap-1 text-xs border-purple-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] text-[#7c3aed] dark:text-[#C084FC] hover:text-purple-900 dark:hover:text-white rounded-[6px]"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Carregar
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteScenario(sc.id)}
                    className="h-8 w-8 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-[6px]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
