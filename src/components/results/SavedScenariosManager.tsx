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
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#5B3A8E] text-white">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
              Gerenciador e Comparativo de Cenários
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
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
            className="gap-1.5 border-purple-200 text-[#5B3A8E] hover:bg-purple-50 dark:hover:bg-purple-950/40"
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
          className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5B3A8E] dark:text-purple-300 uppercase tracking-wider">
              Novo Cenário Clínico
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsSaving(false)}
              className="h-7 text-xs text-slate-500"
            >
              Cancelar
            </Button>
          </div>

          <Input
            placeholder="Nome do cenário (ex: Consultório 100% Particular 2026)"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            className="h-9 text-sm"
            autoFocus
          />

          <Textarea
            placeholder="Notas opcionais (ex: Redução de 2 planos de saúde e aumento do pró-labore)"
            value={scenarioNotes}
            onChange={(e) => setScenarioNotes(e.target.value)}
            className="text-xs h-16 resize-none"
          />

          <Button
            type="submit"
            size="sm"
            disabled={!scenarioName.trim()}
            className="w-full bg-[#5B3A8E] hover:bg-[#452A6F] text-white"
          >
            Confirmar e Salvar Cenário
          </Button>
        </form>
      )}

      {/* Tabela Comparativa Lado a Lado (Base, Conservador, Otimista) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3 font-semibold">Cenário</th>
              <th className="py-2.5 px-3 font-semibold">Sessões / Mês</th>
              <th className="py-2.5 px-3 font-semibold">Piso Ético (V_min)</th>
              <th className="py-2.5 px-3 font-semibold">Faturamento Bruto</th>
              <th className="py-2.5 px-3 font-semibold">Diagnóstico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Cenário Base */}
            <tr className="bg-white dark:bg-slate-900 font-medium">
              <td className="py-2.5 px-3 text-[#5B3A8E] dark:text-purple-300 font-bold">
                Cenário Base (Atual)
              </td>
              <td className="py-2.5 px-3">{baseMetrics.sessoesAgendadas} agendadas</td>
              <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                {formatBRL(baseMetrics.pisoMinimoSessao)}
              </td>
              <td className="py-2.5 px-3 font-mono">{formatBRL(baseMetrics.faturamentoBruto)}</td>
              <td className="py-2.5 px-3">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    baseMetrics.isDeficit
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {baseMetrics.isDeficit ? 'Déficit Clínico' : 'Sustentável'}
                </span>
              </td>
            </tr>

            {/* Cenário Conservador */}
            <tr className="bg-slate-50/50 dark:bg-slate-900/50">
              <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                Conservador (80% agenda, 15% falta)
              </td>
              <td className="py-2.5 px-3">{conservadorMetrics.sessoesAgendadas} agendadas</td>
              <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                {formatBRL(conservadorMetrics.pisoMinimoSessao)}
              </td>
              <td className="py-2.5 px-3 font-mono">
                {formatBRL(conservadorMetrics.faturamentoBruto)}
              </td>
              <td className="py-2.5 px-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Resguardo
                </span>
              </td>
            </tr>

            {/* Cenário Otimista */}
            <tr className="bg-white dark:bg-slate-900">
              <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                Otimista (5% falta, 12% reserva)
              </td>
              <td className="py-2.5 px-3">{otimistaMetrics.sessoesAgendadas} agendadas</td>
              <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                {formatBRL(otimistaMetrics.pisoMinimoSessao)}
              </td>
              <td className="py-2.5 px-3 font-mono">
                {formatBRL(otimistaMetrics.faturamentoBruto)}
              </td>
              <td className="py-2.5 px-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Alta Eficiência
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Lista de Cenários Salvos pelo Usuário */}
      {scenarios.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Seus Cenários Salvos ({scenarios.length})
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11px] text-rose-600 hover:text-rose-700 underline"
            >
              Limpar todos
            </button>
          </div>

          <div className="space-y-2">
            {scenarios.map((sc) => (
              <div
                key={sc.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                    {sc.name}
                  </span>
                  {sc.notes && <p className="text-[11px] text-slate-500 italic">{sc.notes}</p>}
                  <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400 font-mono pt-1">
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
                    className="h-8 gap-1 text-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Carregar
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteScenario(sc.id)}
                    className="h-8 w-8 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
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
