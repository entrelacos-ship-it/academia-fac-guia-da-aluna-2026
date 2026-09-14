import React, { useEffect, useState, useCallback } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { usePricingManager } from '@/hooks/usePricingManager'
import { validateSection14TestCase } from '@/lib/testCaseValidation'
import { GuidedTourModal, TOUR_STORAGE_KEY } from '@/components/GuidedTourModal'

import { StepWelcome } from '@/components/steps/StepWelcome'
import { StepPessoais } from '@/components/steps/StepPessoais'
import { StepProfissionais } from '@/components/steps/StepProfissionais'
import { StepRetirada } from '@/components/steps/StepRetirada'
import { StepReservaTributos } from '@/components/steps/StepReservaTributos'
import { StepCapacidade } from '@/components/steps/StepCapacidade'
import { StepResultados } from '@/components/steps/StepResultados'
import { StepModelos } from '@/components/steps/StepModelos'

export default function Index() {
  const manager = usePricingManager()
  const {
    state,
    calculation,
    theme,
    toggleTheme,
    setStep,
    nextStep,
    prevStep,
    resetToZero,
    updatePessoais,
    addCustomPessoal,
    removeCustomPessoal,
    updateProfissionais,
    addCustomProfissional,
    removeCustomProfissional,
    setRetirada,
    setReservaPct,
    setTributosPct,
    setSessoesPorSemana,
    setSemanasPorMes,
    setTaxaFaltaPct,
    setPrecoAtual,
    setCfpTier,
    scenarios,
    saveCurrentScenario,
    loadScenario,
    deleteScenario,
    clearAllScenarios,
  } = manager

  // Estado do Tour Guiado
  const [tourOpen, setTourOpen] = useState(false)
  const [tourStep, setTourStep] = useState(0)

  // Validação Canônica Seção 14 executada na inicialização do app (QA-02)
  useEffect(() => {
    validateSection14TestCase()
  }, [])

  // Auto-iniciar tour na primeira visita (Passo 0 / Boas-Vindas)
  useEffect(() => {
    try {
      const tourDone = localStorage.getItem(TOUR_STORAGE_KEY)
      if (!tourDone && state.activeStep === 0) {
        // Pequeno atraso para garantir montagem fluida da interface
        const timer = setTimeout(() => {
          setTourStep(0)
          setTourOpen(true)
        }, 400)
        return () => clearTimeout(timer)
      }
    } catch {
      // ignore
    }
  }, [state.activeStep])

  const handleCloseTour = useCallback(() => {
    setTourOpen(false)
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true')
    } catch {
      // ignore
    }
  }, [])

  const handleCompleteTour = useCallback(() => {
    setTourOpen(false)
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true')
    } catch {
      // ignore
    }
  }, [])

  const handleManualOpenTour = useCallback(() => {
    setTourStep(0)
    setTourOpen(true)
  }, [])

  const hasSavedProgress =
    state.activeStep > 0 ||
    calculation.somaCustosPessoais > 0 ||
    calculation.somaCustosProfissionais > 0

  return (
    <AppLayout
      activeStep={state.activeStep}
      onSelectStep={setStep}
      theme={theme}
      onToggleTheme={toggleTheme}
      onOpenTour={handleManualOpenTour}
    >
      <div className="transition-all duration-300">
        {state.activeStep === 0 && (
          <StepWelcome
            onStart={() => setStep(1)}
            onContinue={() => setStep(state.activeStep > 0 ? state.activeStep : 1)}
            onReset={resetToZero}
            hasSavedState={hasSavedProgress}
            onOpenTour={handleManualOpenTour}
          />
        )}

        {state.activeStep === 1 && (
          <StepPessoais
            state={state}
            onUpdate={updatePessoais}
            onAddCustom={addCustomPessoal}
            onRemoveCustom={removeCustomPessoal}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {state.activeStep === 2 && (
          <StepProfissionais
            state={state}
            onUpdate={updateProfissionais}
            onAddCustom={addCustomProfissional}
            onRemoveCustom={removeCustomProfissional}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {state.activeStep === 3 && (
          <StepRetirada
            state={state}
            onSetRetirada={setRetirada}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {state.activeStep === 4 && (
          <StepReservaTributos
            state={state}
            onSetReservaPct={setReservaPct}
            onSetTributosPct={setTributosPct}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {state.activeStep === 5 && (
          <StepCapacidade
            state={state}
            onSetSessoesPorSemana={setSessoesPorSemana}
            onSetSemanasPorMes={setSemanasPorMes}
            onSetTaxaFaltaPct={setTaxaFaltaPct}
            onSetPrecoAtual={setPrecoAtual}
            onSetCfpTier={setCfpTier}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {state.activeStep === 6 && (
          <StepResultados
            state={state}
            calculation={calculation}
            scenarios={scenarios}
            onAdjustGrade={setSessoesPorSemana}
            onSaveScenario={saveCurrentScenario}
            onLoadScenario={loadScenario}
            onDeleteScenario={deleteScenario}
            onClearAllScenarios={clearAllScenarios}
            onSelectStep={setStep}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {state.activeStep === 7 && (
          <StepModelos
            onReset={resetToZero}
            onKeepData={() => setStep(6)}
            onPrev={() => setStep(6)}
          />
        )}

        {/* Modal do Tour Guiado */}
        <GuidedTourModal
          isOpen={tourOpen}
          currentStep={tourStep}
          onStepChange={setTourStep}
          onClose={handleCloseTour}
          onComplete={handleCompleteTour}
        />
      </div>
    </AppLayout>
  )
}
