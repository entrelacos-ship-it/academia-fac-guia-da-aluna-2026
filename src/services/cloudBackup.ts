import pb from '@/lib/pocketbase/client'
import { sanitizeIkigaiState } from '@/lib/ikigaiEngine'
import {
  BASE_STORAGE_KEYS,
  getUserStorageKey,
  getUserStorageItem,
  setUserStorageItem,
  removeUserStorageItem,
  getActiveUserId,
  notifyLocalDataChanged,
  notifyCloudDataLoaded,
  NOTIFY_DATA_CHANGED_EVENT,
  NOTIFY_DATA_LOADED_EVENT,
} from './userStorage'

// Re-exporta chaves e eventos para compatibilidade
export const BACKUP_STORAGE_KEYS = BASE_STORAGE_KEYS
export {
  NOTIFY_DATA_CHANGED_EVENT,
  NOTIFY_DATA_LOADED_EVENT,
  notifyLocalDataChanged,
  notifyCloudDataLoaded,
}

export interface BackupPayload {
  version: 2
  timestamp: string
  deviceInfo?: string
  data: {
    pricingState: unknown
    scenarios: unknown[]
    taxsim: unknown
    reajuste: unknown
    contrato: unknown
    finplan?: unknown
    ikigai?: unknown
  }
}

export interface BackupRecord {
  id: string
  user_id: string
  payload: BackupPayload
  device_name?: string
  created: string
  updated: string
}

/**
 * Coleta todos os dados das chaves sincronizáveis da usuária autenticada
 */
export function collectLocalBackupData(explicitUserId?: string | null): BackupPayload {
  const uid = explicitUserId !== undefined ? explicitUserId : getActiveUserId()

  const getVal = (baseKey: string, defaultVal: unknown = null) => {
    try {
      const key = getUserStorageKey(baseKey, uid)
      const item = localStorage.getItem(key)
      if (item !== null) return JSON.parse(item)

      // Fallback para chave legada se o usuário ainda não tiver a chave namespaced
      if (uid) {
        const legacy = localStorage.getItem(baseKey)
        if (legacy !== null) return JSON.parse(legacy)
      }
      return defaultVal
    } catch {
      return defaultVal
    }
  }

  // Sanitiza o estado ikigai antes de gerar o payload de backup, garantindo que a nuvem nunca receba itens contaminados
  const rawIkigai = getVal(BASE_STORAGE_KEYS.IKIGAI)
  const cleanedIkigai = rawIkigai ? sanitizeIkigaiState(rawIkigai).sanitizedState : null

  return {
    version: 2,
    timestamp: new Date().toISOString(),
    deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'Desconhecido',
    data: {
      pricingState: getVal(BASE_STORAGE_KEYS.STATE),
      scenarios: (getVal(BASE_STORAGE_KEYS.SCENARIOS, []) as unknown[]) || [],
      taxsim: getVal(BASE_STORAGE_KEYS.TAXSIM),
      reajuste: getVal(BASE_STORAGE_KEYS.REAJUSTE),
      contrato: getVal(BASE_STORAGE_KEYS.CONTRATO),
      finplan: getVal(BASE_STORAGE_KEYS.FINPLAN),
      ikigai: cleanedIkigai,
    },
  }
}

/**
 * Verifica se os dados locais da conta informada (ou logada) contêm conteúdo significativo
 */
export function hasSignificantLocalData(explicitUserId?: string | null): boolean {
  try {
    const uid = explicitUserId !== undefined ? explicitUserId : getActiveUserId()
    const rawState =
      localStorage.getItem(getUserStorageKey(BASE_STORAGE_KEYS.STATE, uid)) ||
      (uid ? localStorage.getItem(BASE_STORAGE_KEYS.STATE) : null)

    if (rawState) {
      const parsed = JSON.parse(rawState)
      const cp = parsed?.custosPessoais || {}
      const cprof = parsed?.custosProfissionais || {}
      const sumP =
        (cp.moradia || 0) +
        (cp.alimentacao || 0) +
        (cp.transporte || 0) +
        (cp.saude || 0) +
        (cp.dependentes || 0) +
        (cp.outros || 0) +
        ((cp.customItems || []).length > 0 ? 1 : 0)
      const sumProf =
        (cprof.sala || 0) +
        (cprof.internet || 0) +
        (cprof.softwares || 0) +
        (cprof.supervisao || 0) +
        (cprof.formacao || 0) +
        (cprof.contador || 0) +
        (cprof.marketing || 0) +
        (cprof.outros || 0) +
        ((cprof.customItems || []).length > 0 ? 1 : 0)
      const ret = parsed?.retiradaDesejada || 0
      const preco = parsed?.precoAtual || 0
      const step = parsed?.activeStep || 0

      if (sumP > 0 || sumProf > 0 || ret > 0 || preco > 0 || step > 0) {
        return true
      }
    }

    const rawScenarios =
      localStorage.getItem(getUserStorageKey(BASE_STORAGE_KEYS.SCENARIOS, uid)) ||
      (uid ? localStorage.getItem(BASE_STORAGE_KEYS.SCENARIOS) : null)
    if (rawScenarios) {
      const scenarios = JSON.parse(rawScenarios)
      if (Array.isArray(scenarios) && scenarios.length > 0) return true
    }

    const rawTaxsim =
      localStorage.getItem(getUserStorageKey(BASE_STORAGE_KEYS.TAXSIM, uid)) ||
      (uid ? localStorage.getItem(BASE_STORAGE_KEYS.TAXSIM) : null)
    if (rawTaxsim) return true

    const rawFinplan =
      localStorage.getItem(getUserStorageKey(BASE_STORAGE_KEYS.FINPLAN, uid)) ||
      (uid ? localStorage.getItem(BASE_STORAGE_KEYS.FINPLAN) : null)
    if (rawFinplan) {
      const fin = JSON.parse(rawFinplan)
      if (
        (fin.goals && fin.goals.length > 0) ||
        (fin.capitalAcumuladoReserva && fin.capitalAcumuladoReserva > 0)
      ) {
        return true
      }
    }

    const rawIkigai =
      localStorage.getItem(getUserStorageKey(BASE_STORAGE_KEYS.IKIGAI, uid)) ||
      (uid ? localStorage.getItem(BASE_STORAGE_KEYS.IKIGAI) : null)
    if (rawIkigai) {
      const iki = JSON.parse(rawIkigai)
      const circles = iki?.circles || {}
      const hasCircles =
        (circles.love?.length || 0) +
          (circles.goodAt?.length || 0) +
          (circles.worldNeeds?.length || 0) +
          (circles.paidFor?.length || 0) >
        0
      const hasMission = !!iki?.missionStatement?.trim()
      if (hasCircles || hasMission || (iki?.activeStep || 0) > 0) {
        return true
      }
    }

    return false
  } catch {
    return false
  }
}

/**
 * Restaura dados do snapshot em nuvem para o cache local da usuária (namespaced)
 */
export function restoreBackupDataToLocal(
  payload: BackupPayload,
  explicitUserId?: string | null,
): void {
  if (!payload || !payload.data) {
    throw new Error('Formato de backup inválido na nuvem.')
  }

  const uid = explicitUserId !== undefined ? explicitUserId : getActiveUserId()
  const { data } = payload

  if (data.pricingState !== undefined && data.pricingState !== null) {
    localStorage.setItem(
      getUserStorageKey(BASE_STORAGE_KEYS.STATE, uid),
      JSON.stringify(data.pricingState),
    )
  }
  if (data.scenarios !== undefined && data.scenarios !== null) {
    localStorage.setItem(
      getUserStorageKey(BASE_STORAGE_KEYS.SCENARIOS, uid),
      JSON.stringify(data.scenarios),
    )
  }
  if (data.taxsim !== undefined && data.taxsim !== null) {
    localStorage.setItem(
      getUserStorageKey(BASE_STORAGE_KEYS.TAXSIM, uid),
      JSON.stringify(data.taxsim),
    )
  }
  if (data.reajuste !== undefined && data.reajuste !== null) {
    localStorage.setItem(
      getUserStorageKey(BASE_STORAGE_KEYS.REAJUSTE, uid),
      JSON.stringify(data.reajuste),
    )
  }
  if (data.contrato !== undefined && data.contrato !== null) {
    localStorage.setItem(
      getUserStorageKey(BASE_STORAGE_KEYS.CONTRATO, uid),
      JSON.stringify(data.contrato),
    )
  }
  if (data.finplan !== undefined && data.finplan !== null) {
    localStorage.setItem(
      getUserStorageKey(BASE_STORAGE_KEYS.FINPLAN, uid),
      JSON.stringify(data.finplan),
    )
  }
  if (data.ikigai !== undefined && data.ikigai !== null) {
    const { sanitizedState } = sanitizeIkigaiState(data.ikigai)
    localStorage.setItem(
      getUserStorageKey(BASE_STORAGE_KEYS.IKIGAI, uid),
      JSON.stringify(sanitizedState),
    )
  }

  // Grava carimbo da restauração
  localStorage.setItem(
    getUserStorageKey(BASE_STORAGE_KEYS.LAST_SYNC, uid),
    new Date().toISOString(),
  )

  // Notifica componentes para re-hidratarem seus estados
  notifyCloudDataLoaded(payload)
}

/**
 * Limpa todos os caches da conta especificada (ex: no logout)
 */
export function clearUserLocalData(userId?: string | null): void {
  if (!userId) return
  const keysToRemove = [
    BASE_STORAGE_KEYS.STATE,
    BASE_STORAGE_KEYS.SCENARIOS,
    BASE_STORAGE_KEYS.TAXSIM,
    BASE_STORAGE_KEYS.REAJUSTE,
    BASE_STORAGE_KEYS.CONTRATO,
    BASE_STORAGE_KEYS.FINPLAN,
    BASE_STORAGE_KEYS.IKIGAI,
    BASE_STORAGE_KEYS.LAST_SYNC,
  ]
  keysToRemove.forEach((baseKey) => {
    localStorage.removeItem(getUserStorageKey(baseKey, userId))
  })
}

/**
 * Busca o registro de backup mais recente do usuário autenticado no PocketBase
 */
export async function fetchLatestCloudBackup(
  explicitUserId?: string | null,
): Promise<BackupRecord | null> {
  const uid = explicitUserId || getActiveUserId()
  if (!uid) return null

  try {
    const records = await pb.collection('fac_backups').getList<BackupRecord>(1, 1, {
      filter: `user_id = "${uid}"`,
      sort: '-updated',
    })

    return records.items[0] || null
  } catch (err) {
    console.warn('[CloudBackup] Erro ao buscar último backup:', err)
    throw err
  }
}

/**
 * Carrega os dados da nuvem para o usuário logado e hidrata o cache local imediatamente.
 * Se a nuvem tiver registro, hidrata o local e retorna o registro.
 * Se a nuvem ainda não tiver dados e houver dados significativos locais, salva-os na nuvem como ponto inicial.
 */
export async function loadUserCloudDataAndHydrate(
  explicitUserId?: string | null,
): Promise<BackupRecord | null> {
  const uid = explicitUserId || getActiveUserId()
  if (!uid) return null

  try {
    const backup = await fetchLatestCloudBackup(uid)
    if (backup && backup.payload?.data) {
      restoreBackupDataToLocal(backup.payload, uid)
      return backup
    } else {
      // Conta sem registro ainda na nuvem: se tiver dados locais namespaced ou legados,
      // faz o primeiro upload inicial silencioso para a nuvem
      if (hasSignificantLocalData(uid)) {
        const saved = await saveCloudBackup(undefined, uid)
        return saved
      }
      return null
    }
  } catch (err) {
    console.warn('[CloudBackup] Falha ao hidratar dados da nuvem:', err)
    return null
  }
}

/**
 * Salva ou atualiza o snapshot da usuária na nuvem (PocketBase)
 */
export async function saveCloudBackup(
  customDeviceName?: string,
  explicitUserId?: string | null,
): Promise<BackupRecord> {
  const uid = explicitUserId || getActiveUserId()
  if (!uid) {
    throw new Error('É necessário estar conectada para sincronizar com a nuvem.')
  }

  const payload = collectLocalBackupData(uid)
  const deviceName =
    customDeviceName ||
    (typeof window !== 'undefined' && window.innerWidth < 768
      ? 'Smartphone'
      : 'Computador/Notebook')

  // Procura se já existe um registro prévio do usuário
  const existing = await fetchLatestCloudBackup(uid)

  let record: BackupRecord
  if (existing) {
    record = await pb.collection('fac_backups').update<BackupRecord>(existing.id, {
      payload,
      device_name: deviceName,
    })
  } else {
    record = await pb.collection('fac_backups').create<BackupRecord>({
      user_id: uid,
      payload,
      device_name: deviceName,
    })
  }

  // Salva no localStorage local o carimbo do último backup com sucesso
  localStorage.setItem(
    getUserStorageKey(BASE_STORAGE_KEYS.LAST_SYNC, uid),
    record.updated || new Date().toISOString(),
  )

  return record
}
