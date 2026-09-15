import pb from '@/lib/pocketbase/client'

export const BACKUP_STORAGE_KEYS = {
  STATE: 'entrelacos_fac_pricing_state_v2',
  SCENARIOS: 'entrelacos_fac_scenarios_v1',
  TAXSIM: 'entrelacos_fac_taxsim_v1',
  REAJUSTE: 'entrelacos_fac_reajuste_v1',
  CONTRATO: 'entrelacos_fac_contrato_v1',
  FINPLAN: 'entrelacos_fac_finplan_v1',
  LAST_SYNC: 'entrelacos_fac_last_cloud_sync',
} as const

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
 * Coleta todos os dados das chaves sincronizáveis do localStorage local
 * Exclui deliberadamente tema e tour
 */
export function collectLocalBackupData(): BackupPayload {
  const getJson = (key: string, defaultVal: unknown = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultVal
    } catch {
      return defaultVal
    }
  }

  return {
    version: 2,
    timestamp: new Date().toISOString(),
    deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'Desconhecido',
    data: {
      pricingState: getJson(BACKUP_STORAGE_KEYS.STATE),
      scenarios: (getJson(BACKUP_STORAGE_KEYS.SCENARIOS, []) as unknown[]) || [],
      taxsim: getJson(BACKUP_STORAGE_KEYS.TAXSIM),
      reajuste: getJson(BACKUP_STORAGE_KEYS.REAJUSTE),
      contrato: getJson(BACKUP_STORAGE_KEYS.CONTRATO),
      finplan: getJson(BACKUP_STORAGE_KEYS.FINPLAN),
    },
  }
}

/**
 * Restaura dados do snapshot em nuvem para o localStorage do dispositivo atual
 */
export function restoreBackupDataToLocal(payload: BackupPayload): void {
  if (!payload || !payload.data) {
    throw new Error('Formato de backup inválido na nuvem.')
  }

  const { data } = payload

  if (data.pricingState) {
    localStorage.setItem(BACKUP_STORAGE_KEYS.STATE, JSON.stringify(data.pricingState))
  }
  if (data.scenarios) {
    localStorage.setItem(BACKUP_STORAGE_KEYS.SCENARIOS, JSON.stringify(data.scenarios))
  }
  if (data.taxsim) {
    localStorage.setItem(BACKUP_STORAGE_KEYS.TAXSIM, JSON.stringify(data.taxsim))
  }
  if (data.reajuste) {
    localStorage.setItem(BACKUP_STORAGE_KEYS.REAJUSTE, JSON.stringify(data.reajuste))
  }
  if (data.contrato) {
    localStorage.setItem(BACKUP_STORAGE_KEYS.CONTRATO, JSON.stringify(data.contrato))
  }
  if (data.finplan) {
    localStorage.setItem(BACKUP_STORAGE_KEYS.FINPLAN, JSON.stringify(data.finplan))
  }

  // Grava carimbo da restauração
  localStorage.setItem(BACKUP_STORAGE_KEYS.LAST_SYNC, new Date().toISOString())
}

/**
 * Busca o backup mais recente do usuário autenticado na coleção fac_backups
 */
export async function fetchLatestCloudBackup(): Promise<BackupRecord | null> {
  if (!pb.authStore.isValid || !pb.authStore.model) {
    return null
  }

  try {
    const records = await pb.collection('fac_backups').getList<BackupRecord>(1, 1, {
      filter: `user_id = "${pb.authStore.model.id}"`,
      sort: '-updated',
    })

    return records.items[0] || null
  } catch (err) {
    console.warn('[CloudBackup] Erro ao buscar último backup:', err)
    throw err
  }
}

/**
 * Salva ou atualiza o snapshot da usuária na nuvem
 */
export async function saveCloudBackup(customDeviceName?: string): Promise<BackupRecord> {
  if (!pb.authStore.isValid || !pb.authStore.model) {
    throw new Error('É necessário estar conectada para sincronizar com a nuvem.')
  }

  const userId = pb.authStore.model.id
  const payload = collectLocalBackupData()
  const deviceName =
    customDeviceName ||
    (typeof window !== 'undefined' && window.innerWidth < 768
      ? 'Smartphone'
      : 'Computador/Notebook')

  // Procura se já existe um registro prévio do usuário
  const existing = await fetchLatestCloudBackup()

  let record: BackupRecord
  if (existing) {
    record = await pb.collection('fac_backups').update<BackupRecord>(existing.id, {
      payload,
      device_name: deviceName,
    })
  } else {
    record = await pb.collection('fac_backups').create<BackupRecord>({
      user_id: userId,
      payload,
      device_name: deviceName,
    })
  }

  // Salva no localStorage a hora do último backup com sucesso
  localStorage.setItem(BACKUP_STORAGE_KEYS.LAST_SYNC, record.updated || new Date().toISOString())

  return record
}
