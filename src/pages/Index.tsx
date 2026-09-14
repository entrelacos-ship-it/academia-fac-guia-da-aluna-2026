import React, { useEffect } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { usePricingManager } from '@/hooks/usePricingManager'
import { validateSection14TestCase } from '@/lib/testCaseValidation'

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

  // Validação Canônica Seção 14 executada na inicialização do app (QA-02)
  useEffect(() => {
    validateSection14TestCase()
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
    >
      <div className="transition-all duration-300">
        {state.activeStep === 0 && (
          <StepWelcome
            onStart={() => setStep(1)}
            onContinue={() => setStep(state.activeStep > 0 ? state.activeStep : 1)}
            onReset={resetToZero}
            hasSavedState={hasSavedProgress}
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
      </div>
    </AppLayout>
  )
}
