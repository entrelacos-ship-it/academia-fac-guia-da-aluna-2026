import { describe, it, expect, beforeEach } from 'vitest'
import { validateSection14TestCase } from './testCaseValidation'
import {
  BASE_STORAGE_KEYS,
  getUserStorageKey,
  getUserStorageItem,
  setUserStorageItem,
  getActiveUserId,
} from '../services/userStorage'
import {
  collectLocalBackupData,
  restoreBackupDataToLocal,
  clearUserLocalData,
  BackupPayload,
} from '../services/cloudBackup'
import pb from './pocketbase/client'

describe('Validação Canônica do Método FAC', () => {
  it('deve confirmar que o piso mínimo canônico é exatamente R$ 180,50', () => {
    const isValid = validateSection14TestCase()
    expect(isValid).toBe(true)
  })
})

describe('Isolamento de Contas e Nuvem como Fonte da Verdade', () => {
  beforeEach(() => {
    localStorage.clear()
    pb.authStore.clear()
  })

  it('deve isolar dados entre Conta A e Conta B na mesma máquina via namespace', () => {
    const userA = 'user_id_aaaaa'
    const userB = 'user_id_bbbbb'

    // Simula Login do Usuário A
    pb.authStore.save('fake_token_a', { id: userA, email: 'userA@teste.com' } as any)
    expect(getActiveUserId()).toBe(userA)

    // Usuário A salva dados de pricing
    const stateA = {
      activeStep: 3,
      custosPessoais: { moradia: 3500 },
      retiradaDesejada: 6000,
    }
    setUserStorageItem(BASE_STORAGE_KEYS.STATE, stateA)

    // Confere que no storage a chave está com namespace de A
    const storedA = getUserStorageItem(BASE_STORAGE_KEYS.STATE, null)
    expect(storedA).toEqual(stateA)
    expect(localStorage.getItem(`u_${userA}_${BASE_STORAGE_KEYS.STATE}`)).toBe(
      JSON.stringify(stateA),
    )

    // Simula Logout do Usuário A com limpeza do seu cache
    clearUserLocalData(userA)
    pb.authStore.clear()
    expect(getActiveUserId()).toBeNull()

    // Simula Login do Usuário B na MESMA máquina
    pb.authStore.save('fake_token_b', { id: userB, email: 'userB@teste.com' } as any)
    expect(getActiveUserId()).toBe(userB)

    // Usuário B NÃO deve ver os dados de A
    const storedB = getUserStorageItem(BASE_STORAGE_KEYS.STATE, null)
    expect(storedB).toBeNull()

    // Usuário B cria seus próprios dados
    const stateB = {
      activeStep: 1,
      custosPessoais: { moradia: 1200 },
      retiradaDesejada: 4000,
    }
    setUserStorageItem(BASE_STORAGE_KEYS.STATE, stateB)
    expect(getUserStorageItem(BASE_STORAGE_KEYS.STATE, null)).toEqual(stateB)

    // Usuário B faz logout
    clearUserLocalData(userB)
    pb.authStore.clear()

    // Simula Usuário A logando de volta e recebendo os dados hidratados da nuvem
    pb.authStore.save('fake_token_a', { id: userA, email: 'userA@teste.com' } as any)
    expect(getActiveUserId()).toBe(userA)

    const cloudPayloadA: BackupPayload = {
      version: 2,
      timestamp: new Date().toISOString(),
      data: {
        pricingState: stateA,
        scenarios: [{ id: 'sc_1', name: 'Cenário da Conta A' }],
        taxsim: { faturamentoBrutoMensal: 9500 },
        reajuste: null,
        contrato: null,
      },
    }

    // Hidratação a partir da nuvem para a Conta A
    restoreBackupDataToLocal(cloudPayloadA, userA)

    const rehydratedA = getUserStorageItem(BASE_STORAGE_KEYS.STATE, null)
    expect(rehydratedA).toEqual(stateA)

    const rehydratedScenariosA = getUserStorageItem<any[]>(BASE_STORAGE_KEYS.SCENARIOS, [])
    expect(rehydratedScenariosA).toHaveLength(1)
    expect(rehydratedScenariosA[0].name).toBe('Cenário da Conta A')

    // Confere que os dados pertencem estritamente ao namespace do Usuário A
    expect(localStorage.getItem(`u_${userA}_${BASE_STORAGE_KEYS.STATE}`)).toBe(
      JSON.stringify(stateA),
    )
    expect(localStorage.getItem(`u_${userB}_${BASE_STORAGE_KEYS.STATE}`)).toBeNull()
  })
})
