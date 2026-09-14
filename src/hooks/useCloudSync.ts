import { useState, useEffect, useCallback, useRef } from 'react'
import pb from '@/lib/pocketbase/client'
import {
  BACKUP_STORAGE_KEYS,
  BackupRecord,
  fetchLatestCloudBackup,
  saveCloudBackup,
  restoreBackupDataToLocal,
} from '@/services/cloudBackup'
import { getErrorMessage } from '@/lib/pocketbase/errors'

export interface CloudUserState {
  id: string
  email: string
  name?: string
}

export function useCloudSync() {
  const [currentUser, setCurrentUser] = useState<CloudUserState | null>(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      return {
        id: pb.authStore.model.id,
        email: pb.authStore.model.email || '',
        name: (pb.authStore.model as Record<string, unknown>).name as string | undefined,
      }
    }
    return null
  })

  const [lastSyncDate, setLastSyncDate] = useState<string | null>(() => {
    try {
      return localStorage.getItem(BACKUP_STORAGE_KEYS.LAST_SYNC)
    } catch {
      return null
    }
  })

  const [remoteBackup, setRemoteBackup] = useState<BackupRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info'
    text: string
  } | null>(null)

  // Ouvir mudanças no authStore do PocketBase
  useEffect(() => {
    const unsub = pb.authStore.onChange(() => {
      if (pb.authStore.isValid && pb.authStore.model) {
        setCurrentUser({
          id: pb.authStore.model.id,
          email: pb.authStore.model.email || '',
          name: (pb.authStore.model as Record<string, unknown>).name as string | undefined,
        })
      } else {
        setCurrentUser(null)
        setRemoteBackup(null)
      }
    })
    return () => unsub()
  }, [])

  // Buscar informações do último backup remoto quando o usuário estiver autenticado
  const refreshRemoteInfo = useCallback(async () => {
    if (!pb.authStore.isValid || !pb.authStore.model) return
    setIsLoading(true)
    try {
      const backup = await fetchLatestCloudBackup()
      setRemoteBackup(backup)
      if (backup?.updated) {
        setLastSyncDate(backup.updated)
        try {
          localStorage.setItem(BACKUP_STORAGE_KEYS.LAST_SYNC, backup.updated)
        } catch {
          // ignore
        }
      }
    } catch {
      // Falhas silenciosas no background de refresh
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      refreshRemoteInfo()
    }
  }, [currentUser, refreshRemoteInfo])

  // Login com e-mail e senha
  const login = useCallback(
    async (email: string, pass: string) => {
      setIsLoading(true)
      setStatusMessage(null)
      try {
        const authData = await pb.collection('users').authWithPassword(email.trim(), pass)
        setCurrentUser({
          id: authData.record.id,
          email: authData.record.email || '',
          name: authData.record.name,
        })
        setStatusMessage({
          type: 'success',
          text: 'Conectada com sucesso!',
        })
        await refreshRemoteInfo()
        return true
      } catch (err: unknown) {
        console.warn('Erro ao fazer login:', err)
        let friendly = 'Não foi possível entrar. Verifique seu e-mail e senha.'
        const raw = getErrorMessage(err).toLowerCase()
        if (raw.includes('failed to authenticate') || raw.includes('invalid credentials')) {
          friendly = 'E-mail ou senha incorretos. Confira os dados informados.'
        } else if (raw.includes('network') || raw.includes('failed to fetch')) {
          friendly = 'Sem conexão com a nuvem no momento. Verifique sua internet.'
        }
        setStatusMessage({ type: 'error', text: friendly })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [refreshRemoteInfo],
  )

  // Cadastro de nova conta
  const signup = useCallback(
    async (email: string, pass: string, name?: string) => {
      setIsLoading(true)
      setStatusMessage(null)
      try {
        await pb.collection('users').create({
          email: email.trim(),
          password: pass,
          passwordConfirm: pass,
          name: name?.trim() || 'Psicóloga',
        })
        // Realiza login imediato após cadastro
        const authData = await pb.collection('users').authWithPassword(email.trim(), pass)
        setCurrentUser({
          id: authData.record.id,
          email: authData.record.email || '',
          name: authData.record.name,
        })
        setStatusMessage({
          type: 'success',
          text: 'Conta criada com sucesso! Você já está conectada.',
        })
        // Opcional: fazer o primeiro backup de imediato
        try {
          await saveCloudBackup()
          await refreshRemoteInfo()
        } catch {
          // ignore
        }
        return true
      } catch (err: unknown) {
        console.warn('Erro ao criar conta:', err)
        let friendly = 'Erro ao criar conta. Tente novamente mais tarde.'
        const raw = getErrorMessage(err).toLowerCase()
        if (raw.includes('email already exists') || raw.includes('unique')) {
          friendly = 'Já existe uma conta com este e-mail. Faça login na aba Entrar.'
        } else if (raw.includes('password') && (raw.includes('short') || raw.includes('length'))) {
          friendly = 'A senha deve conter no mínimo 8 caracteres.'
        } else if (raw.includes('network') || raw.includes('failed to fetch')) {
          friendly = 'Sem conexão com a nuvem no momento. Verifique sua internet.'
        }
        setStatusMessage({ type: 'error', text: friendly })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [refreshRemoteInfo],
  )

  // Logout
  const logout = useCallback(() => {
    pb.authStore.clear()
    setCurrentUser(null)
    setRemoteBackup(null)
    setStatusMessage({
      type: 'info',
      text: 'Você saiu da sua conta. Seus dados permanecem seguros neste aparelho.',
    })
  }, [])

  // Sincronizar Agora (Upload do estado local para a nuvem)
  const syncNow = useCallback(async () => {
    if (!currentUser) {
      setStatusMessage({ type: 'error', text: 'Você precisa estar conectada para sincronizar.' })
      return false
    }
    setIsSyncing(true)
    setStatusMessage(null)
    try {
      const record = await saveCloudBackup()
      setRemoteBackup(record)
      setLastSyncDate(record.updated)
      setStatusMessage({
        type: 'success',
        text: 'Backup salvo na nuvem com sucesso!',
      })
      return true
    } catch (err) {
      console.warn('Erro ao salvar backup na nuvem:', err)
      setStatusMessage({
        type: 'error',
        text: 'Não foi possível salvar o backup na nuvem. Verifique sua conexão.',
      })
      return false
    } finally {
      setIsSyncing(false)
    }
  }, [currentUser])

  // Restaurar da Nuvem (Download e substituição no localStorage local)
  const restoreNow = useCallback(
    async (onSuccessCallback?: () => void) => {
      if (!currentUser) {
        setStatusMessage({ type: 'error', text: 'Você precisa estar conectada para restaurar.' })
        return false
      }
      setIsRestoring(true)
      setStatusMessage(null)
      try {
        const backup = await fetchLatestCloudBackup()
        if (!backup || !backup.payload) {
          setStatusMessage({
            type: 'info',
            text: 'Nenhum backup encontrado na nuvem para esta conta.',
          })
          return false
        }
        restoreBackupDataToLocal(backup.payload)
        setRemoteBackup(backup)
        setLastSyncDate(backup.updated)
        setStatusMessage({
          type: 'success',
          text: 'Dados restaurados com sucesso a partir da nuvem!',
        })
        if (onSuccessCallback) {
          onSuccessCallback()
        }
        return true
      } catch (err) {
        console.warn('Erro ao restaurar da nuvem:', err)
        setStatusMessage({
          type: 'error',
          text: 'Erro ao restaurar dados da nuvem. Verifique sua conexão.',
        })
        return false
      } finally {
        setIsRestoring(false)
      }
    },
    [currentUser],
  )

  // Debounce de sincronização automática após edições locais (opcional, só quando logada)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scheduleAutoSync = useCallback(() => {
    if (!currentUser) return
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const record = await saveCloudBackup()
        setRemoteBackup(record)
        setLastSyncDate(record.updated)
      } catch {
        // auto-sync falha silenciosamente sem incomodar a psicóloga
      }
    }, 4000) // 4 segundos de debounce
  }, [currentUser])

  return {
    currentUser,
    isConnected: !!currentUser,
    isLoading,
    isSyncing,
    isRestoring,
    lastSyncDate,
    remoteBackup,
    statusMessage,
    setStatusMessage,
    login,
    signup,
    logout,
    syncNow,
    restoreNow,
    scheduleAutoSync,
    refreshRemoteInfo,
  }
}
