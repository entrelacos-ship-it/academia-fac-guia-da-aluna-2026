import React, { useState } from 'react'
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Presentation,
  CheckCircle2,
  Heart,
  Link as LinkIcon,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useIkigaiManager } from '@/hooks/useIkigaiManager'
import { StepWelcome } from '@/components/ikigai/StepWelcome'
import { StepMoment1Circles } from '@/components/ikigai/StepMoment1Circles'
import { StepMoment2Intersections } from '@/components/ikigai/StepMoment2Intersections'
import { StepMoment3Panel } from '@/components/ikigai/StepMoment3Panel'
import { PresentationMode } from '@/components/ikigai/PresentationMode'

export const STEPS_CONFIG = [
  { id: 0, title: 'Boas-vindas', short: 'Início' },
  { id: 1, title: 'Momento 1 · Escrever (4 Círculos)', short: '1. Escrever' },
  { id: 2, title: 'Momento 2 · Conectar (4 Encontros)', short: '2. Conectar' },
  { id: 3, title: 'Momento 3 · Painel & Entregáveis', short: '3. Painel' },
]

export const IkigaiWorkflow: React.FC = () => {
  const {
    state,
    setStep,
    addCircleItem,
    removeCircleItem,
    toggleStarItem,
    updateCircleItemText,
    setIntersection,
    saveMissionStatement,
    restoreMissionVersion,
    resetToEmpty,
    replaceEntireState,
  } = useIkigaiManager()

  const [presentationOpen, setPresentationOpen] = useState(false)

  // Normalização do passo ativo (0: Welcome, 1: Escrever, 2: Conectar, 3: Painel)
  // Se o usuário tinha activeStep salvo de versões antigas (> 3), mapeia coerentemente
  const rawStep = state.activeStep ?? 0
  let currentStep = rawStep
  if (rawStep > 3) {
    if (rawStep <= 5)
      currentStep = 1 // antigos passos de círculos
    else if (rawStep <= 9)
      currentStep = 2 // antigos passos de encontros
    else currentStep = 3 // leitura, missão, painel
  }

  const hasExistingData =
    state.circles.love.length > 0 ||
    state.circles.goodAt.length > 0 ||
    state.circles.worldNeeds.length > 0 ||
    state.circles.paidFor.length > 0 ||
    Boolean(state.missionStatement?.trim())

  const progressPercentage = Math.round((currentStep / (STEPS_CONFIG.length - 1)) * 100)

  return (
    <div className="w-full space-y-6">
      {/* Barra de Progresso e Navegação Superior */}
      {currentStep > 0 && (
        <div className="astral-card p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#7c3aed] dark:text-[#C084FC]">
                ETAPA {currentStep} DE {STEPS_CONFIG.length - 1}
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {STEPS_CONFIG[currentStep]?.title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Botão Apresentação */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPresentationOpen(true)}
                className="h-7 text-xs font-mono text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-50 dark:hover:bg-[#1f1f23] px-2 cursor-pointer"
                title="Abrir tela limpa da facilitadora"
              >
                <Presentation className="w-3.5 h-3.5 mr-1" />
                <span>Modo Apresentação</span>
              </Button>

              {/* Botão Recomeçar com Diálogo de Confirmação */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="text-xs font-mono text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Recomeçar
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white dark:bg-[#121216] border border-slate-200 dark:border-[#27272A]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deseja recomeçar seu IKIGAI do zero?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Isso limpará os círculos, encontros e a declaração preenchida. Seus dados na
                      nuvem serão reiniciados para novo preenchimento.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        resetToEmpty()
                        setStep(1)
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                    >
                      Sim, recomeçar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <Progress value={progressPercentage} className="h-1.5" />

          {/* Atalhos Rápidos para Voltar a Qualquer Etapa dos 3 Momentos */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs font-mono">
            {STEPS_CONFIG.map((s) => {
              const isCurrent = s.id === currentStep
              const isPassed = s.id < currentStep
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`px-3 py-1.5 rounded-[8px] shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-[#7c3aed] text-white font-bold shadow-xs'
                      : isPassed
                        ? 'bg-purple-50 dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-100 dark:hover:bg-[#27272A]'
                        : 'bg-slate-100 dark:bg-[#18181B] text-slate-400 dark:text-[#71717A] hover:text-slate-700'
                  }`}
                >
                  <span>{s.short}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Renderização Condicional da Etapa Atual (3 Momentos Práticos) */}
      {currentStep === 0 && (
        <StepWelcome
          hasExistingData={hasExistingData}
          lastUpdated={state.updatedAt}
          onStartNew={() => {
            resetToEmpty()
            setStep(1) // vai direto para o Momento 1: Escrever
          }}
          onResume={() => {
            // Continua de onde parou ou vai para o painel se já preenchido
            if (state.missionStatement) {
              setStep(3)
            } else if (
              state.circles.love.length >= 3 &&
              state.circles.goodAt.length >= 3 &&
              state.circles.worldNeeds.length >= 3 &&
              state.circles.paidFor.length >= 3
            ) {
              setStep(2)
            } else {
              setStep(1)
            }
          }}
        />
      )}

      {/* Momento 1: Escrever (4 círculos em tela única) */}
      {currentStep === 1 && (
        <StepMoment1Circles
          circles={state.circles}
          onAddItem={addCircleItem}
          onRemoveItem={removeCircleItem}
          onToggleStar={toggleStarItem}
          onUpdateText={updateCircleItemText}
          onNext={() => setStep(2)}
          onPrev={() => setStep(0)}
        />
      )}

      {/* Momento 2: Conectar (4 encontros em tela única) */}
      {currentStep === 2 && (
        <StepMoment2Intersections
          intersections={state.intersections}
          circles={state.circles}
          onChangeIntersection={setIntersection}
          onNext={() => setStep(3)}
          onPrev={() => setStep(1)}
        />
      )}

      {/* Momento 3: Painel (Leitura, Missão e Painel SVG integrados com exportações) */}
      {currentStep === 3 && (
        <StepMoment3Panel
          state={state}
          onSaveMissionStatement={saveMissionStatement}
          onRestoreMissionVersion={restoreMissionVersion}
          onRestart={() => {
            resetToEmpty()
            setStep(1)
          }}
          onBackToConnect={() => setStep(2)}
          onOpenPresentation={() => setPresentationOpen(true)}
          onImportJson={replaceEntireState}
        />
      )}

      {/* Modal / Modo Apresentação da Facilitadora */}
      {presentationOpen && <PresentationMode onClose={() => setPresentationOpen(false)} />}
    </div>
  )
}
export default IkigaiWorkflow
