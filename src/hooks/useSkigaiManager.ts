import { useState, useEffect, useRef, useCallback } from 'react'
import { SkigaiDataModel } from '@/types/skigai'
import {
  criarEstadoInicialSkigai,
  validarEImportarSkigaiJson,
  importarCapsulaOuJson,
  exportarCapsulaSkigai,
  exportarJsonCompativelSkill,
} from '@/lib/skigaiSchema'
import {
  getUserStorageKey,
  getUserStorageItem,
  setUserStorageItem,
  removeUserStorageItem,
  getActiveUserId,
  notifyLocalDataChanged,
} from '@/services/userStorage'

export const SKIGAI_STORAGE_BASE_KEY = 'entrelacos_fac_skigai_mapa_v1'
export const SKIGAI_HISTORY_BASE_KEY = 'entrelacos_fac_skigai_history_v1'

export interface SkigaiHistoryEntry {
  data: string
  fase: number
  estado: SkigaiDataModel
}

export function useSkigaiManager() {
  const [isStorageAvailable, setIsStorageAvailable] = useState<boolean>(true)
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)
  const [history, setHistory] = useState<SkigaiHistoryEntry[]>([])

  // Estado central do mapa
  const [model, setModel] = useState<SkigaiDataModel>(() => {
    try {
      const stored = getUserStorageItem<SkigaiDataModel | null>(SKIGAI_STORAGE_BASE_KEY, null)
      if (stored && stored.necessidades && stored.necessidades.length === 7) {
        return stored
      }
    } catch {
      // falha no storage (ex: navegação privada bloqueando)
    }
    return criarEstadoInicialSkigai()
  })

  // Checar disponibilidade do localStorage
  useEffect(() => {
    try {
      const testKey = '__storage_test__'
      localStorage.setItem(testKey, testKey)
      localStorage.removeItem(testKey)
      setIsStorageAvailable(true)
    } catch {
      setIsStorageAvailable(false)
    }

    // Carregar histórico local
    try {
      const hist = getUserStorageItem<SkigaiHistoryEntry[]>(SKIGAI_HISTORY_BASE_KEY, [])
      if (Array.isArray(hist)) setHistory(hist)
    } catch {
      // ignore
    }
  }, [])

  // Debounced Autosave (500 ms)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const persistState = useCallback((currentModel: SkigaiDataModel) => {
    try {
      setUserStorageItem(SKIGAI_STORAGE_BASE_KEY, currentModel)
      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      setLastSavedTime(timeStr)
      notifyLocalDataChanged()

      // Manter histórico das últimas 5 versões
      try {
        const hist = getUserStorageItem<SkigaiHistoryEntry[]>(SKIGAI_HISTORY_BASE_KEY, [])
        const updatedHist = [
          {
            data: now.toISOString(),
            fase: currentModel.app.faseAtual,
            estado: JSON.parse(JSON.stringify(currentModel)),
          },
          ...hist.filter((_, idx) => idx < 4),
        ]
        setUserStorageItem(SKIGAI_HISTORY_BASE_KEY, updatedHist)
        setHistory(updatedHist)
      } catch {
        // ignore
      }
    } catch {
      setIsStorageAvailable(false)
    }
  }, [])

  const triggerAutosave = useCallback(
    (newModel: SkigaiDataModel) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      saveTimeoutRef.current = setTimeout(() => {
        persistState(newModel)
      }, 500)
    },
    [persistState],
  )

  // Atualizador imutável do modelo com autosave acoplado (aceita updater funcional ou objeto parcial)
  const updateModel = useCallback(
    (updaterOrPartial: Partial<SkigaiDataModel> | ((prev: SkigaiDataModel) => SkigaiDataModel)) => {
      setModel((prev) => {
        const next: SkigaiDataModel =
          typeof updaterOrPartial === 'function'
            ? updaterOrPartial(prev)
            : { ...prev, ...updaterOrPartial }

        next.app = {
          ...next.app,
          atualizadoEm: new Date().toISOString(),
        }
        triggerAutosave(next)
        return next
      })
    },
    [triggerAutosave],
  )

  // Avançar / retroceder fase
  const setFase = useCallback(
    (fase: number) => {
      updateModel((prev) => {
        const concluidas = prev.app.fasesConcluidas.includes(prev.app.faseAtual)
          ? prev.app.fasesConcluidas
          : [...prev.app.fasesConcluidas, prev.app.faseAtual]

        return {
          ...prev,
          app: {
            ...prev.app,
            faseAtual: Math.max(0, Math.min(8, fase)),
            fasesConcluidas: concluidas,
          },
        }
      })
    },
    [updateModel],
  )

  // Importar cápsula ou JSON
  const importData = useCallback(
    (rawInput: string) => {
      const res = importarCapsulaOuJson(rawInput)
      if (res.sucesso && res.dados) {
        setModel(res.dados)
        persistState(res.dados)
        return { sucesso: true, mensagem: 'Mapa importado com sucesso!' }
      }
      return { sucesso: false, erro: res.erro || 'Falha ao importar o arquivo informado.' }
    },
    [persistState],
  )

  // Limpar / Resetar mapa deste aparelho com confirmação
  const apagarMapaLocal = useCallback(() => {
    removeUserStorageItem(SKIGAI_STORAGE_BASE_KEY)
    removeUserStorageItem(SKIGAI_HISTORY_BASE_KEY)
    const novo = criarEstadoInicialSkigai()
    setModel(novo)
    setHistory([])
    setLastSavedTime(null)
  }, [])

  // Iniciar Revisão de 30 dias (guarda o atual em anterior e limpa notas)
  const iniciarRevisao30Dias = useCallback(() => {
    updateModel((prev) => {
      const cloneAnterior: SkigaiDataModel = JSON.parse(JSON.stringify(prev))
      const hoje = new Date()
      const dataFormatada = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`

      return {
        ...prev,
        data: dataFormatada,
        anterior: cloneAnterior,
        app: {
          ...prev.app,
          faseAtual: 0, // volta para o termômetro e 7 notas
          fasesConcluidas: [],
          atualizadoEm: hoje.toISOString(),
        },
      }
    })
  }, [updateModel])

  return {
    model,
    updateModel,
    fase: model.app.faseAtual,
    setFase,
    lastSavedTime,
    isStorageAvailable,
    history,
    importData,
    apagarMapaLocal,
    iniciarRevisao30Dias,
    gerarCapsula: () => exportarCapsulaSkigai(model),
    gerarJson: () => exportarJsonCompativelSkill(model),
  }
}
