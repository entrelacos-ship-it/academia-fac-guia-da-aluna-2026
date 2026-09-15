import React, { useState } from 'react'
import {
  Cloud,
  CloudUpload,
  CloudDownload,
  LogOut,
  User,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Smartphone,
  Laptop,
  Calendar,
  AlertTriangle,
  KeyRound,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useCloudSync } from '@/hooks/useCloudSync'

interface CloudBackupModalProps {
  isOpen: boolean
  onClose: () => void
  onRestoredSuccess?: () => void
}

export const CloudBackupModal: React.FC<CloudBackupModalProps> = ({
  isOpen,
  onClose,
  onRestoredSuccess,
}) => {
  const {
    currentUser,
    isConnected,
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
    changePassword,
    logout,
    syncNow,
    restoreNow,
  } = useCloudSync()

  // Form states
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [name, setName] = useState('')

  // Sub-estados para Alteração de senha e Esqueci senha dentro do modal
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')

  // Confirmation dialog state for destructive restore
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false)

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    const ok = await login(email, password)
    if (ok) {
      setPassword('')
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    const ok = await signup(email, password, name, passwordConfirm)
    if (ok) {
      setPassword('')
      setPasswordConfirm('')
    }
  }

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldPassword || !newPassword || !newPasswordConfirm) return
    const ok = await changePassword(oldPassword, newPassword, newPasswordConfirm)
    if (ok) {
      setOldPassword('')
      setNewPassword('')
      setNewPasswordConfirm('')
      setIsChangingPassword(false)
    }
  }

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    await requestPasswordReset(email)
  }

  const handleConfirmRestore = async () => {
    setConfirmRestoreOpen(false)
    const ok = await restoreNow(() => {
      if (onRestoredSuccess) {
        onRestoredSuccess()
      }
    })
    if (ok) {
      // Pequeno timeout para recarregar o estado do app
      setTimeout(() => {
        window.location.reload()
      }, 900)
    }
  }

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Nenhuma sincronização ainda'
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md bg-[#18181B] border-[#27272A] text-white p-6 max-h-[92vh] overflow-y-auto rounded-[16px] shadow-2xl">
          <DialogHeader className="space-y-1.5 pb-2 border-b border-[#27272A]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[8px] bg-[#0A0A14] border border-[#27272A] text-[#C084FC] flex items-center justify-center shrink-0">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="font-sans text-lg sm:text-xl font-semibold text-white">
                  Backup em Nuvem Multi-dispositivo
                </DialogTitle>
                <DialogDescription className="text-xs text-[#A1A1AA] font-mono">
                  SINCRONIZAÇÃO ASTRAL · FAC
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Mensagem de status/alerta */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2.5 transition-all ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
                  : statusMessage.type === 'error'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
                    : 'bg-purple-50 text-purple-800 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#5B3A8E] dark:text-purple-400" />
              )}
              <span className="flex-1 font-medium">{statusMessage.text}</span>
            </div>
          )}

          {/* ESTADO 1: CONECTADA */}
          {isConnected && currentUser ? (
            <div className="space-y-5 pt-2">
              <div className="p-4 rounded-[12px] bg-[#121216] border border-[#27272A] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C] animate-pulse" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Conta Conectada
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono bg-[#0A0A14] border-[#27272A] text-[#C084FC]"
                  >
                    Nuvem Ativa
                  </Badge>
                </div>

                <div className="text-xs space-y-1 font-mono">
                  <div className="flex items-center gap-1.5 text-[#A1A1AA] font-medium truncate">
                    <Mail className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                    <span className="truncate text-white">{currentUser.email}</span>
                  </div>
                  {currentUser.name && (
                    <div className="text-[#A1A1AA] text-[11px] pl-5">{currentUser.name}</div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#27272A] text-[11px] font-mono text-[#A1A1AA] flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[#71717A]">
                    <Calendar className="w-3.5 h-3.5" />
                    Última sincronização:
                  </span>
                  <strong className="text-[#C084FC]">
                    {formatDate(lastSyncDate || remoteBackup?.updated)}
                  </strong>
                </div>

                {remoteBackup?.device_name && (
                  <div className="text-[10px] font-mono text-[#71717A] flex items-center gap-1 pl-0.5">
                    <Laptop className="w-3 h-3" />
                    Dispositivo: {remoteBackup.device_name}
                  </div>
                )}
              </div>

              {/* Informação sobre sessão ativa */}
              <div className="p-3 rounded-[8px] bg-[#18181B] border border-[#27272A] text-xs text-[#A1A1AA] leading-relaxed">
                Você está autenticada no sistema. Salve suas alterações na nuvem ou restaure em
                outro aparelho para manter seus dados sincronizados.
              </div>

              {/* Painel de Alteração de Senha Opcional */}
              {isChangingPassword ? (
                <form
                  onSubmit={handleChangePasswordSubmit}
                  className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#5B3A8E] dark:text-purple-400" />
                      Alterar minha senha
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsChangingPassword(false)}
                      className="text-xs h-7 text-slate-500"
                    >
                      Cancelar
                    </Button>
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Senha atual
                    </Label>
                    <Input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Nova senha (mínimo 8 caracteres)
                    </Label>
                    <Input
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Confirmar nova senha
                    </Label>
                    <Input
                      type="password"
                      required
                      minLength={8}
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-9 bg-[#5B3A8E] hover:bg-[#452A6F] text-white text-xs font-medium"
                  >
                    {isLoading ? 'Salvando...' : 'Atualizar Senha'}
                  </Button>
                </form>
              ) : null}

              {/* Botões de Ação Principais Astral */}
              <div className="space-y-2.5">
                <Button
                  onClick={syncNow}
                  disabled={isSyncing || isRestoring}
                  className="w-full min-h-[44px] gap-2 bg-[#C084FC] hover:bg-[#a855f7] text-[#0A0A14] font-semibold rounded-[8px] shadow-md shadow-[#C084FC]/20 transition-all font-mono text-xs"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#0A0A14]" />
                      Salvando na nuvem...
                    </>
                  ) : (
                    <>
                      <CloudUpload className="w-4 h-4 text-[#0A0A14]" />
                      SINCRONIZAR AGORA (SALVAR NA NUVEM)
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setConfirmRestoreOpen(true)}
                  disabled={isSyncing || isRestoring}
                  className="w-full min-h-[44px] gap-2 border-[#27272A] bg-[#0A0A14] text-white hover:border-[#FB923C]/50 rounded-[8px] transition-all font-mono text-xs"
                >
                  {isRestoring ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#FB923C]" />
                      Restaurando dados...
                    </>
                  ) : (
                    <>
                      <CloudDownload className="w-4 h-4 text-[#FB923C]" />
                      RESTAURAR DA NUVEM NESTE APARELHO
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                {!isChangingPassword ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsChangingPassword(true)}
                    className="text-slate-600 dark:text-slate-300 hover:text-[#5B3A8E] text-[11px] gap-1 p-0 h-auto"
                  >
                    <KeyRound className="w-3 h-3 text-[#5B3A8E]" />
                    Alterar senha
                  </Button>
                ) : (
                  <span />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 min-h-[44px] gap-1 px-3"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair da conta
                </Button>
              </div>
            </div>
          ) : (
            /* ESTADO 2: NÃO CONECTADA */
            <div className="space-y-4 pt-1">
              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                A calculadora funciona 100% no seu navegador sem cadastro. Entre ou crie uma conta
                apenas se desejar acessar seus cálculos em múltiplos computadores ou celular.
              </div>

              <Tabs
                value={activeTab}
                onValueChange={(val) => {
                  setActiveTab(val as 'login' | 'signup')
                  setStatusMessage(null)
                }}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full bg-slate-100 dark:bg-slate-800 h-10">
                  <TabsTrigger value="login" className="text-xs font-semibold min-h-[36px]">
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-xs font-semibold min-h-[36px]">
                    Criar conta
                  </TabsTrigger>
                </TabsList>

                {/* Aba Entrar */}
                <TabsContent value="login" className="mt-4 space-y-3">
                  <form onSubmit={handleLoginSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <Label
                        htmlFor="cloud-login-email"
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        E-mail
                      </Label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <Input
                          id="cloud-login-email"
                          type="email"
                          required
                          placeholder="seu.email@exemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9 h-11 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="cloud-login-password"
                          className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                          Senha
                        </Label>
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(!isForgotPassword)}
                          className="text-xs text-[#5B3A8E] dark:text-purple-400 hover:underline"
                        >
                          {isForgotPassword ? 'Lembrei a senha' : 'Esqueci minha senha'}
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <Input
                          id="cloud-login-password"
                          type="password"
                          required={!isForgotPassword}
                          placeholder="Sua senha"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9 h-11 text-sm"
                        />
                      </div>
                    </div>

                    {isForgotPassword && (
                      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-2 text-xs">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          Enviaremos as orientações de redefinição para o seu e-mail cadastrado
                          acima.
                        </p>
                        <Button
                          type="button"
                          onClick={handleForgotPasswordSubmit}
                          disabled={isLoading || !email}
                          className="w-full h-9 bg-[#5B3A8E] hover:bg-[#452A6F] text-white text-xs font-medium"
                        >
                          {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
                        </Button>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full min-h-[44px] gap-2 bg-[#5B3A8E] hover:bg-[#452A6F] text-white font-medium shadow-sm mt-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        <>
                          <Cloud className="w-4 h-4" />
                          Conectar e Sincronizar
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Aba Criar Conta */}
                <TabsContent value="signup" className="mt-4 space-y-3">
                  <form onSubmit={handleSignupSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <Label
                        htmlFor="cloud-signup-name"
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Seu Nome ou Como prefere ser chamada (opcional)
                      </Label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <Input
                          id="cloud-signup-name"
                          type="text"
                          placeholder="Ex: Dra. Mariana Costa"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-9 h-11 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="cloud-signup-email"
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        E-mail
                      </Label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <Input
                          id="cloud-signup-email"
                          type="email"
                          required
                          placeholder="seu.email@exemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9 h-11 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="cloud-signup-password"
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Senha (mínimo de 8 caracteres)
                      </Label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <Input
                          id="cloud-signup-password"
                          type="password"
                          required
                          minLength={8}
                          placeholder="Crie uma senha segura"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9 h-11 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="cloud-signup-password-confirm"
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Confirmar senha
                      </Label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <Input
                          id="cloud-signup-password-confirm"
                          type="password"
                          required
                          minLength={8}
                          placeholder="Repita sua senha"
                          value={passwordConfirm}
                          onChange={(e) => setPasswordConfirm(e.target.value)}
                          className="pl-9 h-11 text-sm"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full min-h-[44px] gap-2 bg-[#16746E] hover:bg-[#115e59] text-white font-medium shadow-sm mt-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        <>
                          <CloudUpload className="w-4 h-4" />
                          Criar Conta e Ativar Nuvem
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Rodapé LGPD & Segurança */}
          <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#5B3A8E] dark:text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-700 dark:text-slate-300">
                Privacidade & LGPD Ética:
              </strong>{' '}
              Seus dados são criptografados em trânsito (HTTPS/TLS) e apenas a dona da conta tem
              acesso às regras de leitura e gravação. Nenhum dado do paciente é armazenado em texto
              não autorizado.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmação de Restauração Destrutiva */}
      <AlertDialog open={confirmRestoreOpen} onOpenChange={setConfirmRestoreOpen}>
        <AlertDialogContent className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
              <AlertTriangle className="w-5 h-5" />
              <AlertDialogTitle className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                Substituir dados deste dispositivo?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Esta ação <strong>substituirá todos os dados locais deste navegador</strong> (custos,
              cenários salvos e simulador tributário) pela versão mais recente salva na nuvem.
              <br />
              <br />
              Certifique-se de que a versão em nuvem é a que você deseja manter antes de prosseguir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px]">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRestore}
              className="bg-amber-600 hover:bg-amber-700 text-white min-h-[44px]"
            >
              Sim, restaurar da nuvem
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
