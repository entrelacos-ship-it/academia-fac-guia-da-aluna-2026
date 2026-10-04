import pb from '@/lib/pocketbase/client'

/**
 * Nomes base das chaves de dados do app da Calculadora FAC
 */
export const BASE_STORAGE_KEYS = {
  STATE: 'entrelacos_fac_pricing_state_v2',
  SCENARIOS: 'entrelacos_fac_scenarios_v1',
  TAXSIM: 'entrelacos_fac_taxsim_v1',
  REAJUSTE: 'entrelacos_fac_reajuste_v1',
  CONTRATO: 'entrelacos_fac_contrato_v1',
  FINPLAN: 'entrelacos_fac_finplan_v1',
  IKIGAI: 'entrelacos_fac_ikigai_v1',
  LAST_SYNC: 'entrelacos_fac_last_cloud_sync',
} as const

export type StorageKeyType = keyof typeof BASE_STORAGE_KEYS

export const NOTIFY_DATA_CHANGED_EVENT = 'entrelacos_fac_data_changed'
export const NOTIFY_DATA_LOADED_EVENT = 'entrelacos_fac_cloud_data_loaded'

/**
 * Retorna o ID do usuário atualmente autenticado no PocketBase (ou null)
 */
export function getActiveUserId(): string | null {
  if (pb.authStore.isValid && pb.authStore.model) {
    return pb.authStore.model.id || null
  }
  return null
}

/**
 * Retorna a chave do localStorage com namespace do usuário ativo.
 * Se houver usuário logado: `u_${userId}_${baseKey}`
 * Se não houver: `${baseKey}`
 */
export function getUserStorageKey(baseKey: string, explicitUserId?: string | null): string {
  const uid = explicitUserId !== undefined ? explicitUserId : getActiveUserId()
  if (uid) {
    return `u_${uid}_${baseKey}`
  }
  return baseKey
}

/**
 * Lê item JSON do cache local, com suporte a namespace do usuário.
 * No primeiro acesso de um usuário logado, se a chave namespaced estiver vazia
 * mas existir a chave legada sem namespace, migra de forma segura.
 */
export function getUserStorageItem<T>(baseKey: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue

  try {
    const uid = getActiveUserId()
    const namespacedKey = getUserStorageKey(baseKey, uid)
    const namespacedVal = localStorage.getItem(namespacedKey)

    if (namespacedVal !== null) {
      return JSON.parse(namespacedVal) as T
    }

    // Se usuário está logado e chave namespaced não existe, verifica chave legada
    if (uid) {
      const legacyVal = localStorage.getItem(baseKey)
      if (legacyVal !== null) {
        try {
          const parsed = JSON.parse(legacyVal) as T
          // Migra para o namespace deste usuário e remove a legada desprotegida
          localStorage.setItem(namespacedKey, legacyVal)
          localStorage.removeItem(baseKey)
          return parsed
        } catch {
          // parse falhou
        }
      }
    }

    return defaultValue
  } catch (err) {
    console.warn(`[UserStorage] Erro ao ler chave ${baseKey}:`, err)
    return defaultValue
  }
}

/**
 * Grava item JSON no cache local namespaced do usuário ativo
 */
export function setUserStorageItem<T>(baseKey: string, value: T): void {
  if (typeof window === 'undefined') return

  try {
    const uid = getActiveUserId()
    const namespacedKey = getUserStorageKey(baseKey, uid)
    localStorage.setItem(namespacedKey, JSON.stringify(value))
  } catch (err) {
    console.warn(`[UserStorage] Erro ao salvar chave ${baseKey}:`, err)
  }
}

/**
 * Remove chave do storage do usuário ativo
 */
export function removeUserStorageItem(baseKey: string): void {
  if (typeof window === 'undefined') return

  try {
    const uid = getActiveUserId()
    const namespacedKey = getUserStorageKey(baseKey, uid)
    localStorage.removeItem(namespacedKey)
  } catch (err) {
    console.warn(`[UserStorage] Erro ao remover chave ${baseKey}:`, err)
  }
}

/**
 * Dispara evento global de que os dados foram alterados localmente (para disparar auto-sync em nuvem)
 */
export function notifyLocalDataChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOTIFY_DATA_CHANGED_EVENT))
  }
}

/**
 * Dispara evento de que dados vindos da nuvem hidrataram o storage do usuário atual
 */
export function notifyCloudDataLoaded(sourcePayload?: unknown): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOTIFY_DATA_LOADED_EVENT, { detail: sourcePayload }))
  }
}
