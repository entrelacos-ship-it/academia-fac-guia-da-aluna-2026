import { useState, useEffect, useMemo, useCallback } from 'react'
import { PricingState, CalculationResult, SavedScenario } from '@/types/pricing'
import { DEFAULT_PRICING_STATE, calculateFacMetrics } from '@/lib/facMath'
import {
  BASE_STORAGE_KEYS,
  getUserStorageItem,
  setUserStorageItem,
  removeUserStorageItem,
  NOTIFY_DATA_LOADED_EVENT,
  notifyLocalDataChanged,
} from '@/services/userStorage'

const STORAGE_KEY_THEME = 'entrelacos_fac_theme_mode'

function getInitialPricingState(): PricingState {
  try {
    const parsed = getUserStorageItem<Partial<PricingState> | null>(BASE_STORAGE_KEYS.STATE, null)
    if (parsed) {
      return {
        ...DEFAULT_PRICING_STATE,
        ...parsed,
        custosPessoais: {
          ...DEFAULT_PRICING_STATE.custosPessoais,
          ...(parsed.custosPessoais || {}),
          customItems: parsed.custosPessoais?.customItems || [],
        },
        custosProfissionais: {
          ...DEFAULT_PRICING_STATE.custosProfissionais,
          ...(parsed.custosProfissionais || {}),
          customItems: parsed.custosProfissionais?.customItems || [],
        },
        cfpConfig: {
          ...DEFAULT_PRICING_STATE.cfpConfig,
          ...(parsed.cfpConfig || {}),
        },
      }
    }
  } catch (e) {
    console.warn('Erro ao restaurar estado do pricing:', e)
  }
  return DEFAULT_PRICING_STATE
}

function getInitialScenarios(): SavedScenario[] {
  try {
    const saved = getUserStorageItem<SavedScenario[]>(BASE_STORAGE_KEYS.SCENARIOS, [])
    if (Array.isArray(saved)) return saved
  } catch (e) {
    console.warn('Erro ao restaurar cenários:', e)
  }
  return []
}

export function usePricingManager() {
  // 1. Estado da calculadora
  const [state, setState] = useState<PricingState>(getInitialPricingState)

  // 2. Tema: Modo Claro por padrão na primeira visita (com persistência no localStorage)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME)
      if (saved === 'dark' || saved === 'light') {
        return saved
      }
    } catch {
      // ignore
    }
    return 'light'
  })

  // 3. Cenários salvos
  const [scenarios, setScenarios] = useState<SavedScenario[]>(getInitialScenarios)

  // Ouvir hidratação de dados vindos da nuvem (ao logar ou sincronizar com outra conta)
  useEffect(() => {
    const handleCloudLoaded = () => {
      setState(getInitialPricingState())
      setScenarios(getInitialScenarios())
    }

    if (typeof window !== 'undefined') {
      window.addEventListener(NOTIFY_DATA_LOADED_EVENT, handleCloudLoaded)
      return () => {
        window.removeEventListener(NOTIFY_DATA_LOADED_EVENT, handleCloudLoaded)
      }
    }
  }, [])

  // Sincronizar tema no DOM e no localStorage
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme)
    } catch (e) {
      console.warn('Erro ao salvar tema:', e)
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  // Persistir estado ao alterar
  useEffect(() => {
    try {
      setUserStorageItem(BASE_STORAGE_KEYS.STATE, state)
      notifyLocalDataChanged()
    } catch (e) {
      console.warn('Erro ao salvar estado:', e)
    }
  }, [state])

  // Persistir cenários
  useEffect(() => {
    try {
      setUserStorageItem(BASE_STORAGE_KEYS.SCENARIOS, scenarios)
      notifyLocalDataChanged()
    } catch (e) {
      console.warn('Erro ao salvar cenários:', e)
    }
  }, [scenarios])

  // Cálculo memorizado
  const calculation: CalculationResult = useMemo(() => {
    return calculateFacMetrics(state)
  }, [state])

  // Ações de navegação do wizard
  const setStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, activeStep: Math.max(0, Math.min(7, step)) }))
  }, [])

  const nextStep = useCallback(() => {
    setState((prev) => ({ ...prev, activeStep: Math.min(7, prev.activeStep + 1) }))
  }, [])

  const prevStep = useCallback(() => {
    setState((prev) => ({ ...prev, activeStep: Math.max(0, prev.activeStep - 1) }))
  }, [])

  // Reset total
  const resetToZero = useCallback(() => {
    try {
      removeUserStorageItem(BASE_STORAGE_KEYS.STATE)
    } catch {
      // ignore
    }
    setState({ ...DEFAULT_PRICING_STATE, activeStep: 1 })
  }, [])

  // Atualizações pontuais
  const updatePessoais = useCallback(
    (field: keyof PricingState['custosPessoais'], value: number) => {
      setState((prev) => ({
        ...prev,
        custosPessoais: {
          ...prev.custosPessoais,
          [field]: Math.max(0, value || 0),
        },
      }))
    },
    [],
  )

  const addCustomPessoal = useCallback((label: string, value: number) => {
    setState((prev) => ({
      ...prev,
      custosPessoais: {
        ...prev.custosPessoais,
        customItems: [
          ...prev.custosPessoais.customItems,
          { id: 'cp_' + Date.now() + Math.random().toString(36).substr(2, 4), label, value },
        ],
      },
    }))
  }, [])

  const removeCustomPessoal = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      custosPessoais: {
        ...prev.custosPessoais,
        customItems: prev.custosPessoais.customItems.filter((i) => i.id !== id),
      },
    }))
  }, [])

  const updateProfissionais = useCallback(
    (field: keyof PricingState['custosProfissionais'], value: number) => {
      setState((prev) => ({
        ...prev,
        custosProfissionais: {
          ...prev.custosProfissionais,
          [field]: Math.max(0, value || 0),
        },
      }))
    },
    [],
  )

  const addCustomProfissional = useCallback((label: string, value: number) => {
    setState((prev) => ({
      ...prev,
      custosProfissionais: {
        ...prev.custosProfissionais,
        customItems: [
          ...prev.custosProfissionais.customItems,
          { id: 'cpr_' + Date.now() + Math.random().toString(36).substr(2, 4), label, value },
        ],
      },
    }))
  }, [])

  const removeCustomProfissional = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      custosProfissionais: {
        ...prev.custosProfissionais,
        customItems: prev.custosProfissionais.customItems.filter((i) => i.id !== id),
      },
    }))
  }, [])

  const setRetirada = useCallback((val: number) => {
    setState((prev) => ({ ...prev, retiradaDesejada: Math.max(0, val || 0) }))
  }, [])

  const setReservaPct = useCallback((pct: number) => {
    setState((prev) => ({ ...prev, reservaPct: Math.max(0, Math.min(30, pct)) }))
  }, [])

  const setTributosPct = useCallback((pct: number) => {
    setState((prev) => ({ ...prev, tributosPct: Math.max(0, Math.min(40, pct)) }))
  }, [])

  const setSessoesPorSemana = useCallback((count: number) => {
    setState((prev) => ({ ...prev, sessoesPorSemana: Math.max(1, Math.min(60, count)) }))
  }, [])

  const setSemanasPorMes = useCallback((weeks: number) => {
    setState((prev) => ({ ...prev, semanasPorMes: Math.max(3, Math.min(5, weeks)) }))
  }, [])

  const setTaxaFaltaPct = useCallback((pct: number) => {
    setState((prev) => ({ ...prev, taxaFaltaPct: Math.max(0, Math.min(50, pct)) }))
  }, [])

  const setPrecoAtual = useCallback((val: number) => {
    setState((prev) => ({ ...prev, precoAtual: Math.max(0, val || 0) }))
  }, [])

  const setCfpTier = useCallback(
    (tier: PricingState['cfpConfig']['tier'], customValue?: number) => {
      setState((prev) => ({
        ...prev,
        cfpConfig: {
          tier,
          customValue: customValue ?? prev.cfpConfig.customValue,
        },
      }))
    },
    [],
  )

  // Cenários
  const saveCurrentScenario = useCallback(
    (name: string, notes?: string) => {
      const metrics = calculateFacMetrics(state)
      const newScenario: SavedScenario = {
        id: 'sc_' + Date.now(),
        name,
        notes,
        state: JSON.parse(JSON.stringify(state)),
        createdAt: new Date().toISOString(),
        vMin: metrics.pisoMinimoSessao,
        fBruto: metrics.faturamentoBruto,
        sessoesMes: metrics.sessoesAgendadas,
        isDeficit: metrics.isDeficit,
      }
      setScenarios((prev) => [newScenario, ...prev])
    },
    [state],
  )

  const loadScenario = useCallback((scenario: SavedScenario) => {
    setState({
      ...scenario.state,
      activeStep: 6, // abre no painel de resultados
    })
  }, [])

  const deleteScenario = useCallback((id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const clearAllScenarios = useCallback(() => {
    setScenarios([])
  }, [])

  return {
    state,
    setState,
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
  }
}

export type PricingManager = ReturnType<typeof usePricingManager>
