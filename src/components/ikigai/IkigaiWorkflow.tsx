import React, { useState } from 'react'
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  Presentation,
  CheckCircle2,
  FileText,
  Heart,
  Award,
  Globe,
  Coins,
  Link as LinkIcon,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { StepImportRetrato } from '@/components/ikigai/StepImportRetrato'
import { StepCircleView } from '@/components/ikigai/StepCircleView'
import { StepIntersectionView } from '@/components/ikigai/StepIntersectionView'
import { StepPanelReading } from '@/components/ikigai/StepPanelReading'
import { StepMissionStatement } from '@/components/ikigai/StepMissionStatement'
import { StepMyPanel } from '@/components/ikigai/StepMyPanel'
import { PresentationMode } from '@/components/ikigai/PresentationMode'
import { CircleId, IntersectionId } from '@/types/ikigai'

export const STEPS_CONFIG = [
  { id: 0, title: 'Boas-vindas', short: 'Início' },
  { id: 1, title: 'Retrato de Autoria', short: 'Importar' },
  { id: 2, title: '1. O que amo', short: 'Amo' },
  { id: 3, title: '2. No que sou boa', short: 'Sou boa' },
  { id: 4, title: '3. Do que o mundo precisa', short: 'Mundo' },
  { id: 5, title: '4. Remuneração digna', short: 'Renda' },
  { id: 6, title: 'Paixão', short: 'Paixão' },
  { id: 7, title: 'Missão', short: 'Missão' },
  { id: 8, title: 'Vocação', short: 'Vocação' },
  { id: 9, title: 'Profissão', short: 'Profissão' },
  { id: 10, title: 'Leitura do Painel', short: 'Leitura' },
  { id: 11, title: 'Declaração de Missão', short: 'Declaração' },
  { id: 12, title: 'Meu Painel', short: 'Meu Painel' },
]

export const IkigaiWorkflow: React.FC = () => {
  const {
    state,
    setStep,
    addCircleItem,
    removeCircleItem,
    toggleStarItem,
    updateCircleItemText,
    moveTrayItemToCircle,
    removeTrayItem,
    importRetratoData,
    setIntersection,
    saveMissionStatement,
    restoreMissionVersion,
    resetToEmpty,
    replaceEntireState,
  } = useIkigaiManager()

  const [presentationOpen, setPresentationOpen] = useState(false)
  const currentStep = state.activeStep || 0

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
                PASSO {currentStep} DE {STEPS_CONFIG.length - 1}
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
                className="h-7 text-xs font-mono text-[#7c3aed] hover:bg-purple-50 dark:hover:bg-[#1f1f23] px-2"
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
                      Isso limpará os círculos, encontros e a declaração preenchida. Recomendamos
                      baixar o arquivo JSON antes se quiser guardar seu progresso.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={resetToEmpty}
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

          {/* Atalhos Rápidos para Voltar a Qualquer Etapa */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-[11px] font-mono">
            {STEPS_CONFIG.map((s) => {
              const isCurrent = s.id === currentStep
              const isPassed = s.id < currentStep
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`px-2 py-1 rounded-[6px] shrink-0 transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#7c3aed] text-white font-bold'
                      : isPassed
                        ? 'bg-purple-50 dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-100'
                        : 'bg-slate-100 dark:bg-[#18181B] text-slate-400 dark:text-[#71717A] hover:text-slate-700'
                  }`}
                >
                  {s.short}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Renderização Condicional da Etapa Atual */}
      {currentStep === 0 && (
        <StepWelcome
          hasExistingData={hasExistingData}
          lastUpdated={state.updatedAt}
          onStartNew={() => {
            resetToEmpty()
            setStep(2) // vai direto para o círculo 1
          }}
          onResume={() => {
            // Continua de onde parou ou vai para o painel se já preenchido
            setStep(state.missionStatement ? 12 : 2)
          }}
          onImportRetrato={() => setStep(1)}
        />
      )}

      {currentStep === 1 && (
        <StepImportRetrato
          onConfirmImport={(parsed) => {
            importRetratoData(parsed)
            setStep(2) // vai para o círculo 1
          }}
          onSkip={() => setStep(2)}
          onBack={() => setStep(0)}
        />
      )}

      {/* 4 Círculos (Passos 2, 3, 4, 5) */}
      {currentStep === 2 && (
        <StepCircleView
          circleId="love"
          items={state.circles.love}
          trayItems={state.rawRetratoTray}
          onAddItem={(t) => addCircleItem('love', t)}
          onRemoveItem={(id) => removeCircleItem('love', id)}
          onToggleStar={(id) => toggleStarItem('love', id)}
          onUpdateText={(id, txt) => updateCircleItemText('love', id, txt)}
          onMoveTrayItem={(tIdx) => moveTrayItemToCircle(tIdx, 'love')}
          onNext={() => setStep(3)}
          onPrev={() => setStep(0)}
          canGoNext={state.circles.love.length >= 3}
        />
      )}

      {currentStep === 3 && (
        <StepCircleView
          circleId="goodAt"
          items={state.circles.goodAt}
          trayItems={state.rawRetratoTray}
          onAddItem={(t) => addCircleItem('goodAt', t)}
          onRemoveItem={(id) => removeCircleItem('goodAt', id)}
          onToggleStar={(id) => toggleStarItem('goodAt', id)}
          onUpdateText={(id, txt) => updateCircleItemText('goodAt', id, txt)}
          onMoveTrayItem={(tIdx) => moveTrayItemToCircle(tIdx, 'goodAt')}
          onNext={() => setStep(4)}
          onPrev={() => setStep(2)}
          canGoNext={state.circles.goodAt.length >= 3}
        />
      )}

      {currentStep === 4 && (
        <StepCircleView
          circleId="worldNeeds"
          items={state.circles.worldNeeds}
          trayItems={state.rawRetratoTray}
          onAddItem={(t) => addCircleItem('worldNeeds', t)}
          onRemoveItem={(id) => removeCircleItem('worldNeeds', id)}
          onToggleStar={(id) => toggleStarItem('worldNeeds', id)}
          onUpdateText={(id, txt) => updateCircleItemText('worldNeeds', id, txt)}
          onMoveTrayItem={(tIdx) => moveTrayItemToCircle(tIdx, 'worldNeeds')}
          onNext={() => setStep(5)}
          onPrev={() => setStep(3)}
          canGoNext={state.circles.worldNeeds.length >= 3}
        />
      )}

      {currentStep === 5 && (
        <StepCircleView
          circleId="paidFor"
          items={state.circles.paidFor}
          trayItems={state.rawRetratoTray}
          onAddItem={(t) => addCircleItem('paidFor', t)}
          onRemoveItem={(id) => removeCircleItem('paidFor', id)}
          onToggleStar={(id) => toggleStarItem('paidFor', id)}
          onUpdateText={(id, txt) => updateCircleItemText('paidFor', id, txt)}
          onMoveTrayItem={(tIdx) => moveTrayItemToCircle(tIdx, 'paidFor')}
          onNext={() => setStep(6)} // vai para o primeiro encontro
          onPrev={() => setStep(4)}
          canGoNext={state.circles.paidFor.length >= 3}
        />
      )}

      {/* 4 Encontros / Interseções (Passos 6, 7, 8, 9) */}
      {currentStep === 6 && (
        <StepIntersectionView
          intersectionId="passion"
          stepNumber={1}
          data={state.intersections.passion}
          itemsA={state.circles.love}
          itemsB={state.circles.goodAt}
          onChange={(t, notFound) => setIntersection('passion', t, notFound)}
          onNext={() => setStep(7)}
          onPrev={() => setStep(5)}
        />
      )}

      {currentStep === 7 && (
        <StepIntersectionView
          intersectionId="mission"
          stepNumber={2}
          data={state.intersections.mission}
          itemsA={state.circles.love}
          itemsB={state.circles.worldNeeds}
          onChange={(t, notFound) => setIntersection('mission', t, notFound)}
          onNext={() => setStep(8)}
          onPrev={() => setStep(6)}
        />
      )}

      {currentStep === 8 && (
        <StepIntersectionView
          intersectionId="vocation"
          stepNumber={3}
          data={state.intersections.vocation}
          itemsA={state.circles.worldNeeds}
          itemsB={state.circles.paidFor}
          onChange={(t, notFound) => setIntersection('vocation', t, notFound)}
          onNext={() => setStep(9)}
          onPrev={() => setStep(7)}
        />
      )}

      {currentStep === 9 && (
        <StepIntersectionView
          intersectionId="profession"
          stepNumber={4}
          data={state.intersections.profession}
          itemsA={state.circles.goodAt}
          itemsB={state.circles.paidFor}
          onChange={(t, notFound) => setIntersection('profession', t, notFound)}
          onNext={() => setStep(10)} // vai para a leitura
          onPrev={() => setStep(8)}
        />
      )}

      {/* Leitura Estrutural dos Vazios (Passo 10) */}
      {currentStep === 10 && (
        <StepPanelReading
          state={state}
          onNext={() => setStep(11)} // vai para a declaração de missão
          onPrev={() => setStep(9)}
        />
      )}

      {/* Declaração de Missão (Passo 11) */}
      {currentStep === 11 && (
        <StepMissionStatement
          currentStatement={state.missionStatement}
          history={state.missionHistory}
          onSaveStatement={saveMissionStatement}
          onRestoreVersion={restoreMissionVersion}
          onNext={() => setStep(12)} // vai para o painel final
          onPrev={() => setStep(10)}
        />
      )}

      {/* Painel Final e Exportações (Passo 12) */}
      {currentStep === 12 && (
        <StepMyPanel
          state={state}
          onRestart={resetToEmpty}
          onBackToEdit={() => setStep(11)}
          onOpenPresentation={() => setPresentationOpen(true)}
          onImportJson={replaceEntireState}
        />
      )}

      {/* Modal / Modo Apresentação da Facilitadora */}
      {presentationOpen && <PresentationMode onClose={() => setPresentationOpen(false)} />}
    </div>
  )
}
