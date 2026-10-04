import React, { useState, useEffect, useCallback } from 'react'
import {
  IkigaiState,
  CircleId,
  IntersectionId,
  CircleItem,
  MissionHistoryEntry,
} from '@/types/ikigai'
import {
  getUserStorageItem,
  setUserStorageItem,
  BASE_STORAGE_KEYS,
  notifyLocalDataChanged,
  NOTIFY_DATA_LOADED_EVENT,
} from '@/services/userStorage'
import { INITIAL_EMPTY_IKIGAI_STATE } from '@/config/ikigaiContent'
import { sanitizeTypography, sanitizeIkigaiState } from '@/lib/ikigaiEngine'

export function useIkigaiManager() {
  const [state, setState] = useState<IkigaiState>(() => {
    const saved = getUserStorageItem<IkigaiState>(
      BASE_STORAGE_KEYS.IKIGAI,
      INITIAL_EMPTY_IKIGAI_STATE,
    )
    if (saved) {
      const { sanitizedState, wasSanitized } = sanitizeIkigaiState(saved)
      if (wasSanitized) {
        setUserStorageItem(BASE_STORAGE_KEYS.IKIGAI, sanitizedState)
        // Notifica sincronização em nuvem para que a versão limpa sobrescreva a nuvem
        setTimeout(() => {
          notifyLocalDataChanged()
        }, 0)
        return sanitizedState
      }
      return saved
    }
    return INITIAL_EMPTY_IKIGAI_STATE
  })

  // Sincroniza quando dados da nuvem chegam
  useEffect(() => {
    const handleCloudLoaded = () => {
      const refreshed = getUserStorageItem<IkigaiState>(
        BASE_STORAGE_KEYS.IKIGAI,
        INITIAL_EMPTY_IKIGAI_STATE,
      )
      if (refreshed) {
        const { sanitizedState, wasSanitized } = sanitizeIkigaiState(refreshed)
        if (wasSanitized) {
          setUserStorageItem(BASE_STORAGE_KEYS.IKIGAI, sanitizedState)
          notifyLocalDataChanged()
          setState(sanitizedState)
        } else {
          setState(refreshed)
        }
      }
    }
    window.addEventListener(NOTIFY_DATA_LOADED_EVENT, handleCloudLoaded)
    return () => window.removeEventListener(NOTIFY_DATA_LOADED_EVENT, handleCloudLoaded)
  }, [])

  // Grava e notifica
  const persistState = useCallback((newState: IkigaiState) => {
    setState(newState)
    setUserStorageItem(BASE_STORAGE_KEYS.IKIGAI, newState)
    notifyLocalDataChanged()
  }, [])

  // Navegação de passos
  const setStep = useCallback((stepIndex: number) => {
    setState((prev) => {
      const next = { ...prev, activeStep: stepIndex, updatedAt: new Date().toISOString() }
      setUserStorageItem(BASE_STORAGE_KEYS.IKIGAI, next)
      notifyLocalDataChanged()
      return next
    })
  }, [])

  // Adicionar item a um círculo
  const addCircleItem = useCallback((circleId: CircleId, text: string) => {
    const cleaned = sanitizeTypography(text.trim())
    if (!cleaned) return

    setState((prev) => {
      const newItem: CircleItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        text: cleaned,
        starred: false,
        createdAt: new Date().toISOString(),
      }
      const updatedList = [...prev.circles[circleId], newItem]
      const next: IkigaiState = {
        ...prev,
        circles: {
          ...prev.circles,
          [circleId]: updatedList,
        },
        updatedAt: new Date().toISOString(),
      }
      setUserStorageItem(BASE_STORAGE_KEYS.IKIGAI, next)
      notifyLocalDataChanged()
      return next
    })
  }, [])

  // Remover item de um círculo
  const removeCircleItem = useCallback((circleId: CircleId, itemId: string) => {
    setState((prev) => {
      const updatedList = prev.circles[circleId].filter((it) => it.id !== itemId)
      const next: IkigaiState = {
        ...prev,
        circles: {
          ...prev.circles,
          [circleId]: updatedList,
        },
        updatedAt: new Date().toISOString(),
      }
      setUserStorageItem(BASE_STORAGE_KEYS.IKIGAI, next)
      notifyLocalDataChanged()
      return next
    })
  }, [])

  // Alternar estrela (máx 3 estrelas por círculo)
  const toggleStarItem = useCallback((circleId: CircleId, itemId: string) => {
    setState((prev) => {
      const list = prev.circles[circleId]
      const currentStarredCount = list.filter((it) => it.starred && it.id !== itemId).length
      const target = list.find((it) => it.id === itemId)
      if (!target) return prev

      // Se já tem 3 e está tentando marcar mais um, não permite
      if (!target.starred && currentStarredCount >= 3) {
        return prev
      }

      const updatedList = list.map((it) =>
        it.id === itemId ? { ...it, starred: !it.starred } : it,
      )
      const next: IkigaiState = {
        ...prev,
        circles: {
          ...prev.circles,
          [circleId]: updatedList,
        },
        updatedAt: new Date().toISOString(),
      }
      setUserStorageItem(BASE_STORAGE_KEYS.IKIGAI, next)
      notifyLocalDataChanged()
      return next
    })
  }, [])

  // Reordenar itens de um círculo
  const reorderCircleItems = useCallback((circleId: CircleId, newItems: CircleItem[]) => {
    setState((prev) => {
      const next: IkigaiState = {
        ...prev,
        circles: {
          ...prev.circles,
          [circleId]: newItems,
        },
        updatedAt: new Date().toISOString(),
      }
      setUserStorageItem(BASE_STORAGE_KEYS.IKIGAI, next)
      notifyLocalDataChanged()
      return next
    })
  }, [])

  // Editar texto de um item
  const updateCircleItemText = useCallback(
    (circleId: CircleId, itemId: string, newText: string) => {
      const cleaned = sanitizeTypography(newText.trim())
      if (!cleaned) return
      setState((prev) => {
        const updatedList = prev.circles[circleId].map((it) =>
          it.id === itemId ? { ...it, text: cleaned } : it,
        )
        const next: IkigaiState = {
          ...prev,
          circles: {
            ...prev.circles,
            [circleId]: updatedList,
          },
          updatedAt: new Date().toISOString(),
        }
        setUserStorageItem(BASE_STORAGE_KEYS.IKIGAI, next)
        notifyLocalDataChanged()
        return next
      })
    },
    [],
  )

  // Atualizar encontro/interseção
  const setIntersection = useCallback((id: IntersectionId, text: string, notFound: boolean) => {
    setState((prev) => {
      const next: IkigaiState = {
        ...prev,
        intersections: {
          ...prev.intersections,
          [id]: {
            text: sanitizeTypography(text),
            notFound,
            updatedAt: new Date().toISOString(),
          },
        },
        updatedAt: new Date().toISOString(),
      }
      setUserStorageItem(BASE_STORAGE_KEYS.IKIGAI, next)
      notifyLocalDataChanged()
      return next
    })
  }, [])

  // Salvar declaração de missão com histórico
  const saveMissionStatement = useCallback((statement: string) => {
    const cleaned = sanitizeTypography(statement.trim())
    setState((prev) => {
      const history: MissionHistoryEntry[] = [...prev.missionHistory]
      if (prev.missionStatement && prev.missionStatement.trim() !== cleaned) {
        history.unshift({
          id: `ver-${Date.now()}`,
          text: prev.missionStatement,
          savedAt: new Date().toISOString(),
        })
      }
      const next: IkigaiState = {
        ...prev,
        missionStatement: cleaned,
        missionHistory: history.slice(0, 10), // mantém últimas 10
        updatedAt: new Date().toISOString(),
      }
      setUserStorageItem(BASE_STORAGE_KEYS.IKIGAI, next)
      notifyLocalDataChanged()
      return next
    })
  }, [])

  // Restaurar versão anterior da missão
  const restoreMissionVersion = useCallback(
    (versionText: string) => {
      saveMissionStatement(versionText)
    },
    [saveMissionStatement],
  )

  // Recomeçar do zero (com confirmação)
  const resetToEmpty = useCallback(() => {
    persistState({
      ...INITIAL_EMPTY_IKIGAI_STATE,
      updatedAt: new Date().toISOString(),
    })
  }, [persistState])

  // Substituir todo o estado a partir de um JSON importado
  const replaceEntireState = useCallback(
    (imported: IkigaiState) => {
      persistState({
        ...imported,
        version: 1,
        updatedAt: new Date().toISOString(),
      })
    },
    [persistState],
  )

  return {
    state,
    setStep,
    addCircleItem,
    removeCircleItem,
    toggleStarItem,
    reorderCircleItems,
    updateCircleItemText,
    setIntersection,
    saveMissionStatement,
    restoreMissionVersion,
    resetToEmpty,
    replaceEntireState,
  }
}
