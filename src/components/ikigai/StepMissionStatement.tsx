import React, { useState } from 'react'
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  History,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Save,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { MissionHistoryEntry } from '@/types/ikigai'
import { MISSION_TEMPLATE_SUGGESTION } from '@/config/ikigaiContent'
import { countSentences, sanitizeTypography } from '@/lib/ikigaiEngine'

interface StepMissionStatementProps {
  currentStatement: string
  history: MissionHistoryEntry[]
  onSaveStatement: (statement: string) => void
  onRestoreVersion: (text: string) => void
  onNext: () => void
  onPrev: () => void
}

export const StepMissionStatement: React.FC<StepMissionStatementProps> = ({
  currentStatement,
  history,
  onSaveStatement,
  onRestoreVersion,
  onNext,
  onPrev,
}) => {
  const [text, setText] = useState(currentStatement || '')
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Checagens da declaração
  const [checks, setChecks] = useState({
    twoSentences: false,
    audienceCentric: false,
    speakAloud: false,
  })

  const sentenceCount = countSentences(text)
  const isTooLong = sentenceCount > 2

  const handleApplyTemplate = () => {
    setText(MISSION_TEMPLATE_SUGGESTION)
  }

  const handleSave = () => {
    const cleaned = sanitizeTypography(text.trim())
    onSaveStatement(cleaned)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2000)
  }

  const handleRestore = (itemText: string) => {
    setText(itemText)
    onRestoreVersion(itemText)
  }

  const handleNextClick = () => {
    if (text.trim() && text !== currentStatement) {
      onSaveStatement(sanitizeTypography(text.trim()))
    }
    onNext()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className="bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs uppercase tracking-wider">
            Síntese Maior · O Centro do seu IKIGAI
          </Badge>
          <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">Até 2 frases</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Declaração de Missão
        </h1>

        <p className="text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
          Esta é a frase que vai no coração do seu diagrama e sintetiza sua autoridade clínica. Ela
          comunica quem você cuida, qual a transformação gerada e o seu modo ético de intervir.
        </p>
      </div>

      {/* Editor da Declaração */}
      <Card className="astral-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Sua Missão em até 2 frases:
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleApplyTemplate}
            className="text-xs font-mono text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-50 dark:hover:bg-[#1f1f23] h-7 px-2"
          >
            Usar modelo de sugestão
          </Button>
        </div>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Eu ajudo [quem] a [transformação], por meio de [como eu faço]."
          rows={4}
          className="font-sans text-base leading-relaxed bg-white dark:bg-[#121216] border-slate-200 dark:border-[#27272A] focus:border-[#7c3aed]"
        />

        {/* Contador e Aviso de Frases */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded ${
                sentenceCount === 0
                  ? 'bg-slate-100 dark:bg-[#18181B] text-slate-500'
                  : sentenceCount <= 2
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
              }`}
            >
              {sentenceCount} {sentenceCount === 1 ? 'frase' : 'frases'} detectada(s)
            </span>

            {isTooLong && (
              <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Recomendamos enxugar para no máximo duas frases.</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="h-8 text-xs font-mono border-slate-200 dark:border-[#27272A]"
              >
                <History className="w-3.5 h-3.5 mr-1" />
                <span>Histórico ({history.length})</span>
              </Button>
            )}

            <Button
              type="button"
              onClick={handleSave}
              disabled={!text.trim()}
              size="sm"
              className="h-8 text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] gap-1"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvo!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar versão</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Histórico de Versões Salvas */}
        {showHistory && history.length > 0 && (
          <div className="p-4 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Evolução da sua reescrita:
            </span>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="p-2.5 rounded-[6px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="text-slate-800 dark:text-slate-200 italic">"{h.text}"</p>
                    <span className="font-mono text-[10px] text-slate-400">
                      {new Date(h.savedAt).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRestore(h.text)}
                    className="h-7 text-[11px] text-[#7c3aed] hover:bg-purple-50 shrink-0"
                  >
                    Restaurar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Checagem Simples em Lista */}
      <Card className="astral-card p-5 space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
          Checagem rápida da sua declaração:
        </span>
        <div className="space-y-2.5 text-xs sm:text-sm">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <Checkbox
              checked={checks.twoSentences || (sentenceCount > 0 && sentenceCount <= 2)}
              onCheckedChange={(c) => setChecks((p) => ({ ...p, twoSentences: Boolean(c) }))}
              className="mt-0.5"
            />
            <span className="text-slate-700 dark:text-slate-300">
              Cabe em até duas frases diretas e sem prolixidade?
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <Checkbox
              checked={checks.audienceCentric}
              onCheckedChange={(c) => setChecks((p) => ({ ...p, audienceCentric: Boolean(c) }))}
              className="mt-0.5"
            />
            <span className="text-slate-700 dark:text-slate-300">
              Fala de quem é atendido e da dor humana, e não apenas de títulos acadêmicos seus?
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <Checkbox
              checked={checks.speakAloud}
              onCheckedChange={(c) => setChecks((p) => ({ ...p, speakAloud: Boolean(c) }))}
              className="mt-0.5"
            />
            <span className="text-slate-700 dark:text-slate-300">
              Você diria isso em voz alta para uma colega ou parceiro com naturalidade e orgulho?
            </span>
          </label>
        </div>
      </Card>

      {/* Barra de Ações Inferior */}
      <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-[#27272A]">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-1.5 border-slate-200 dark:border-[#27272A] min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Leitura</span>
        </Button>

        <Button
          onClick={handleNextClick}
          disabled={!text.trim()}
          className="gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold min-h-[44px] rounded-[8px] cursor-pointer"
        >
          <span>Ver Meu Painel Visual</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
