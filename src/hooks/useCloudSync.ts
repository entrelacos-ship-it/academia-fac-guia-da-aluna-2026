import { useState, useEffect, useCallback, useRef } from 'react'
import pb from '@/lib/pocketbase/client'
import {
  BACKUP_STORAGE_KEYS,
  BackupRecord,
  fetchLatestCloudBackup,
  saveCloudBackup,
  restoreBackupDataToLocal,
  hasSignificantLocalData,
} from '@/services/cloudBackup'
import { getErrorMessage } from '@/lib/pocketbase/errors'

export interface CloudUserState {
  id: string
  email: string
  name?: string
  role?: 'admin' | 'user' | string
  is_active?: boolean
}

export function useCloudSync() {
  const [currentUser, setCurrentUser] = useState<CloudUserState | null>(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      const record = pb.authStore.model as Record<string, unknown>
      return {
        id: pb.authStore.model.id,
        email: pb.authStore.model.email || '',
        name: record.name as string | undefined,
        role: (record.role as string | undefined) || 'user',
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
        const record = pb.authStore.model as Record<string, unknown>
        if (record.is_active === false) {
          pb.authStore.clear()
          setCurrentUser(null)
          setRemoteBackup(null)
          setStatusMessage({
            type: 'error',
            text: 'Conta desativada. Entre em contato com a administração.',
          })
          return
        }
        setCurrentUser({
          id: pb.authStore.model.id,
          email: pb.authStore.model.email || '',
          name: record.name as string | undefined,
          role: (record.role as string | undefined) || 'user',
          is_active: record.is_active !== false,
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
        const record = authData.record as Record<string, unknown>

        // Validação defensiva client-side para garantir que contas desativadas não fiquem logadas
        if (record.is_active === false) {
          pb.authStore.clear()
          setCurrentUser(null)
          setStatusMessage({
            type: 'error',
            text: 'Conta desativada. Entre em contato com a administração.',
          })
          return false
        }

        setCurrentUser({
          id: authData.record.id,
          email: authData.record.email || '',
          name: authData.record.name,
          role: (record.role as string | undefined) || 'user',
          is_active: record.is_active !== false,
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
        if (raw.includes('conta desativada') || raw.includes('desativada')) {
          friendly = 'Conta desativada. Entre em contato com a administração.'
        } else if (raw.includes('failed to authenticate') || raw.includes('invalid credentials')) {
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
    async (email: string, pass: string, name?: string, passwordConfirm?: string) => {
      setIsLoading(true)
      setStatusMessage(null)
      const finalConfirm = passwordConfirm ?? pass
      if (pass !== finalConfirm) {
        setStatusMessage({
          type: 'error',
          text: 'A confirmação de senha não confere com a nova senha digitada.',
        })
        setIsLoading(false)
        return false
      }
      try {
        await pb.collection('users').create({
          email: email.trim(),
          password: pass,
          passwordConfirm: finalConfirm,
          name: name?.trim() || 'Psicóloga',
        })
        // Realiza login imediato após cadastro
        const authData = await pb.collection('users').authWithPassword(email.trim(), pass)
        const record = authData.record as Record<string, unknown>
        setCurrentUser({
          id: authData.record.id,
          email: authData.record.email || '',
          name: authData.record.name,
          role: (record.role as string | undefined) || 'user',
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
        if (
          raw.includes('email already exists') ||
          raw.includes('unique') ||
          raw.includes('must be unique')
        ) {
          friendly = 'Já existe uma conta com este e-mail. Faça login na aba Entrar.'
        } else if (
          raw.includes('password') &&
          (raw.includes('short') || raw.includes('length') || raw.includes('minimum'))
        ) {
          friendly = 'A senha deve conter no mínimo 8 caracteres.'
        } else if (raw.includes('confirm') || raw.includes('match')) {
          friendly = 'A confirmação de senha não confere com a senha digitada.'
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

  // Solicitar recuperação de senha (Esqueci minha senha)
  const requestPasswordReset = useCallback(async (email: string) => {
    setIsLoading(true)
    setStatusMessage(null)
    try {
      await pb.collection('users').requestPasswordReset(email.trim())
      setStatusMessage({
        type: 'success',
        text: 'Se este e-mail estiver cadastrado, as instruções para redefinição de senha foram enviadas.',
      })
      return true
    } catch (err: unknown) {
      console.warn('Erro ao solicitar redefinição de senha:', err)
      // Por segurança contra enumeração de usuários, manter feedback neutro e orientativo
      setStatusMessage({
        type: 'info',
        text: 'Se este e-mail estiver cadastrado, você receberá um link de redefinição. Verifique também sua caixa de spam.',
      })
      return true
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Confirmar redefinição de senha com token recebido por e-mail
  const confirmPasswordReset = useCallback(
    async (token: string, newPassword: string, newPasswordConfirm: string) => {
      setIsLoading(true)
      setStatusMessage(null)
      if (newPassword.length < 8) {
        setStatusMessage({
          type: 'error',
          text: 'A nova senha deve ter no mínimo 8 caracteres.',
        })
        setIsLoading(false)
        return false
      }
      if (newPassword !== newPasswordConfirm) {
        setStatusMessage({
          type: 'error',
          text: 'A confirmação da nova senha não confere.',
        })
        setIsLoading(false)
        return false
      }
      try {
        await pb
          .collection('users')
          .confirmPasswordReset(token.trim(), newPassword, newPasswordConfirm)
        setStatusMessage({
          type: 'success',
          text: 'Sua senha foi redefinida com sucesso! Você já pode entrar com a nova senha.',
        })
        return true
      } catch (err: unknown) {
        console.warn('Erro ao confirmar redefinição de senha:', err)
        let friendly = 'Link de redefinição inválido ou expirado. Solicite um novo link.'
        const raw = getErrorMessage(err).toLowerCase()
        if (raw.includes('network') || raw.includes('failed to fetch')) {
          friendly = 'Sem conexão no momento. Verifique sua internet e tente novamente.'
        }
        setStatusMessage({ type: 'error', text: friendly })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // Alteração de senha da usuária autenticada
  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string, newPasswordConfirm: string) => {
      if (!pb.authStore.isValid || !pb.authStore.model) {
        setStatusMessage({
          type: 'error',
          text: 'Você precisa estar conectada para alterar sua senha.',
        })
        return false
      }
      if (newPassword.length < 8) {
        setStatusMessage({
          type: 'error',
          text: 'A nova senha deve ter no mínimo 8 caracteres.',
        })
        return false
      }
      if (newPassword !== newPasswordConfirm) {
        setStatusMessage({
          type: 'error',
          text: 'A confirmação da nova senha não confere.',
        })
        return false
      }
      setIsLoading(true)
      setStatusMessage(null)
      try {
        const userId = pb.authStore.model.id
        await pb.collection('users').update(userId, {
          oldPassword,
          password: newPassword,
          passwordConfirm: newPasswordConfirm,
        })
        setStatusMessage({
          type: 'success',
          text: 'Senha alterada com sucesso!',
        })
        return true
      } catch (err: unknown) {
        console.warn('Erro ao alterar senha:', err)
        let friendly = 'Não foi possível alterar sua senha. Verifique sua senha atual.'
        const raw = getErrorMessage(err).toLowerCase()
        if (
          raw.includes('oldpassword') ||
          raw.includes('wrong password') ||
          raw.includes('invalid credentials')
        ) {
          friendly = 'A senha atual informada está incorreta.'
        } else if (raw.includes('length') || raw.includes('short')) {
          friendly = 'A nova senha deve ter pelo menos 8 caracteres.'
        } else if (raw.includes('network') || raw.includes('failed to fetch')) {
          friendly = 'Sem conexão com a nuvem no momento. Verifique sua internet.'
        }
        setStatusMessage({ type: 'error', text: friendly })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // Logout
  const logout = useCallback(() => {
    pb.authStore.clear()
    setCurrentUser(null)
    setRemoteBackup(null)
    setStatusMessage({
      type: 'info',
      text: 'Você saiu da sua conta. Seus dados locais permanecem seguros neste aparelho.',
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

  // Prompt de restauração detectado quando há backup na nuvem mais recente/relevante
  const [cloudRestoreAvailable, setCloudRestoreAvailable] = useState<boolean>(false)

  // Debounce de sincronização automática após edições locais (quando autenticada)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scheduleAutoSync = useCallback(
    (delayMs = 2000) => {
      if (!currentUser) return
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(async () => {
        setIsSyncing(true)
        try {
          const record = await saveCloudBackup()
          setRemoteBackup(record)
          setLastSyncDate(record.updated)
        } catch (err) {
          console.warn('[AutoSync] Erro na sincronização automática em background:', err)
        } finally {
          setIsSyncing(false)
        }
      }, delayMs)
    },
    [currentUser],
  )

  // Ao montar ou mudar currentUser, escuta eventos de storage locais de outras abas ou componentes
  useEffect(() => {
    if (!currentUser) return

    // Checar se a conta tem backup na nuvem e se o estado local é vazio/mais antigo
    const checkForCloudRestore = async () => {
      try {
        const backup = await fetchLatestCloudBackup()
        if (backup && backup.payload?.data) {
          setRemoteBackup(backup)
          const localHasData = hasSignificantLocalData()
          const localLastSync = localStorage.getItem(BACKUP_STORAGE_KEYS.LAST_SYNC)

          // Se o dispositivo local estiver vazio OU não tiver registro de sync enquanto a nuvem tem
          if (!localHasData) {
            setCloudRestoreAvailable(true)
          } else if (
            backup.updated &&
            (!localLastSync || new Date(backup.updated) > new Date(localLastSync))
          ) {
            setCloudRestoreAvailable(true)
          } else {
            setCloudRestoreAvailable(false)
          }
        } else {
          // Nuvem ainda vazia: se temos dados locais significativos, salva automaticamente o primeiro backup
          if (hasSignificantLocalData()) {
            scheduleAutoSync(500)
          }
        }
      } catch {
        // falhas de rede silenciosas
      }
    }

    checkForCloudRestore()

    // Ouve evento customizado disparado quando qualquer dado da calculadora é modificado
    const handleLocalDataChanged = () => {
      scheduleAutoSync(2500)
    }

    window.addEventListener('entrelacos_fac_data_changed', handleLocalDataChanged)
    return () => {
      window.removeEventListener('entrelacos_fac_data_changed', handleLocalDataChanged)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [currentUser, scheduleAutoSync])

  const dismissCloudRestorePrompt = useCallback(() => {
    setCloudRestoreAvailable(false)
  }, [])

  const isAdmin = currentUser?.role === 'admin'

  return {
    currentUser,
    isConnected: !!currentUser,
    isAdmin,
    isLoading,
    isSyncing,
    isRestoring,
    lastSyncDate,
    remoteBackup,
    statusMessage,
    setStatusMessage,
    login,
    signup,
    requestPasswordReset,
    confirmPasswordReset,
    changePassword,
    logout,
    syncNow,
    restoreNow,
    scheduleAutoSync,
    refreshRemoteInfo,
    cloudRestoreAvailable,
    restoreLatestBackup: restoreNow,
    dismissCloudRestorePrompt,
  }
}
