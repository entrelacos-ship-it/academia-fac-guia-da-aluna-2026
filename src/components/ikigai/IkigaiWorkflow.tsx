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
      {/* Barra de Progresso e Navegação Superior Editorial */}
      {currentStep > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#0c0914] border border-slate-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#7c3aed] dark:text-[#C084FC] font-medium">
                0{currentStep} / 0{STEPS_CONFIG.length - 1}
              </span>
              <span className="text-slate-300 dark:text-zinc-700">•</span>
              <span className="font-serif-editorial text-sm sm:text-base text-slate-900 dark:text-zinc-100">
                {STEPS_CONFIG[currentStep]?.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Botão Apresentação */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPresentationOpen(true)}
                className="text-xs font-mono text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-500/10 px-2.5 rounded-lg"
                title="Abrir tela limpa da facilitadora"
              >
                <Presentation className="w-3.5 h-3.5 mr-1" />
                <span>Modo Apresentação</span>
              </Button>

              {/* Botão Recomeçar */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="px-2 py-1 text-xs font-mono text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    Recomeçar
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[92vw] max-w-lg bg-background border border-border/80 rounded-2xl p-5 sm:p-6">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-serif-editorial text-xl">
                      Deseja recomeçar seu IKIGAI do zero?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground font-light">
                      Isso limpará os círculos, encontros e a declaração preenchida. Seus dados na
                      nuvem serão reiniciados para novo preenchimento.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
                    <AlertDialogCancel className="cursor-pointer text-xs font-mono rounded-lg">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        resetToEmpty()
                        setStep(1)
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white cursor-pointer text-xs font-mono rounded-lg"
                    >
                      Sim, recomeçar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <Progress value={progressPercentage} className="h-1 bg-slate-100 dark:bg-zinc-800" />

          {/* Atalhos Rápidos */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs font-mono">
            {STEPS_CONFIG.map((s) => {
              const isCurrent = s.id === currentStep
              const isPassed = s.id < currentStep
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-[#7c3aed] text-white font-medium shadow-xs'
                      : isPassed
                        ? 'bg-purple-500/10 text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-500/20'
                        : 'bg-muted/40 text-muted-foreground hover:text-foreground'
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
