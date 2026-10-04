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
import { INITIAL_EMPTY_IKIGAI_STATE, FICTITIOUS_FACILITATOR_EXAMPLE } from '@/config/ikigaiContent'
import { sanitizeTypography } from '@/lib/ikigaiEngine'

export function useIkigaiManager() {
  const [state, setState] = useState<IkigaiState>(() => {
    const saved = getUserStorageItem<IkigaiState>(
      BASE_STORAGE_KEYS.IKIGAI,
      INITIAL_EMPTY_IKIGAI_STATE,
    )
    return saved || INITIAL_EMPTY_IKIGAI_STATE
  })

  // Sincroniza quando dados da nuvem chegam
  useEffect(() => {
    const handleCloudLoaded = () => {
      const refreshed = getUserStorageItem<IkigaiState>(
        BASE_STORAGE_KEYS.IKIGAI,
        INITIAL_EMPTY_IKIGAI_STATE,
      )
      if (refreshed) {
        setState(refreshed)
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

  // Mover item da bandeja para um círculo específico
  const moveTrayItemToCircle = useCallback((trayIndex: number, circleId: CircleId) => {
    setState((prev) => {
      const textToMove = prev.rawRetratoTray[trayIndex]
      if (!textToMove) return prev
      const newTray = prev.rawRetratoTray.filter((_, i) => i !== trayIndex)
      const newItem: CircleItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        text: sanitizeTypography(textToMove),
        starred: false,
        createdAt: new Date().toISOString(),
      }
      const next: IkigaiState = {
        ...prev,
        rawRetratoTray: newTray,
        circles: {
          ...prev.circles,
          [circleId]: [...prev.circles[circleId], newItem],
        },
        updatedAt: new Date().toISOString(),
      }
      setUserStorageItem(BASE_STORAGE_KEYS.IKIGAI, next)
      notifyLocalDataChanged()
      return next
    })
  }, [])

  // Descartar item da bandeja
  const removeTrayItem = useCallback((trayIndex: number) => {
    setState((prev) => {
      const newTray = prev.rawRetratoTray.filter((_, i) => i !== trayIndex)
      const next: IkigaiState = {
        ...prev,
        rawRetratoTray: newTray,
        updatedAt: new Date().toISOString(),
      }
      setUserStorageItem(BASE_STORAGE_KEYS.IKIGAI, next)
      notifyLocalDataChanged()
      return next
    })
  }, [])

  // Importar matéria-prima do Retrato de Autoria
  const importRetratoData = useCallback(
    (parsed: { circles: Record<CircleId, string[]>; tray: string[] }) => {
      setState((prev) => {
        const makeItems = (texts: string[]): CircleItem[] =>
          texts.map((t, idx) => ({
            id: `imported-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
            text: sanitizeTypography(t),
            starred: idx < 2, // os primeiros já como sugestão de destaque
            createdAt: new Date().toISOString(),
          }))

        const next: IkigaiState = {
          ...prev,
          circles: {
            love: [...prev.circles.love, ...makeItems(parsed.circles.love)],
            goodAt: [...prev.circles.goodAt, ...makeItems(parsed.circles.goodAt)],
            worldNeeds: [...prev.circles.worldNeeds, ...makeItems(parsed.circles.worldNeeds)],
            paidFor: [...prev.circles.paidFor, ...makeItems(parsed.circles.paidFor)],
          },
          rawRetratoTray: [...prev.rawRetratoTray, ...parsed.tray.map(sanitizeTypography)],
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

  // Carregar exemplo fictício da facilitadora (apenas temporário ou em visualização)
  const loadFictitiousExample = useCallback(() => {
    persistState({
      ...FICTITIOUS_FACILITATOR_EXAMPLE,
      updatedAt: new Date().toISOString(),
    })
  }, [persistState])

  return {
    state,
    setStep,
    addCircleItem,
    removeCircleItem,
    toggleStarItem,
    reorderCircleItems,
    updateCircleItemText,
    moveTrayItemToCircle,
    removeTrayItem,
    importRetratoData,
    setIntersection,
    saveMissionStatement,
    restoreMissionVersion,
    resetToEmpty,
    replaceEntireState,
    loadFictitiousExample,
  }
}
