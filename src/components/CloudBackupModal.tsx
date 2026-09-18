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
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white p-6 max-h-[92vh] overflow-y-auto rounded-[16px] shadow-2xl">
          <DialogHeader className="space-y-1.5 pb-2 border-b border-slate-200 dark:border-[#27272A]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center shrink-0">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="font-sans text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                  Sincronização em Nuvem & Restauração
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-[#A1A1AA] font-mono">
                  SINCRONIZAÇÃO ASTRAL · FAC
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Mensagem de status/alerta */}
          {statusMessage && (
            <div
              className={`p-3 rounded-[8px] text-xs flex items-start gap-2.5 transition-all font-sans ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
                  : statusMessage.type === 'error'
                    ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
                    : 'bg-purple-50 text-[#7c3aed] border-purple-200 dark:bg-[#0A0A14] dark:text-[#C084FC] dark:border-[#27272A]'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#7c3aed] dark:text-[#C084FC]" />
              )}
              <span className="flex-1 font-medium">{statusMessage.text}</span>
            </div>
          )}

          {/* ESTADO 1: CONECTADA */}
          {isConnected && currentUser ? (
            <div className="space-y-5 pt-2">
              <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] dark:bg-[#FB923C] animate-pulse" />
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Conta Conectada
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono bg-purple-50 dark:bg-[#18181B] border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] rounded-full px-2.5"
                  >
                    Auto-Sync Ativo
                  </Badge>
                </div>

                <div className="text-xs space-y-1 font-mono">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-[#A1A1AA] font-medium truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-[#71717A] shrink-0" />
                    <span className="truncate text-slate-900 dark:text-white">
                      {currentUser.email}
                    </span>
                  </div>
                  {currentUser.name && (
                    <div className="text-slate-500 dark:text-[#A1A1AA] text-[11px] pl-5">
                      {currentUser.name}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-[#27272A] text-[11px] font-mono text-slate-600 dark:text-[#A1A1AA] flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-500 dark:text-[#71717A]">
                    <Calendar className="w-3.5 h-3.5" />
                    Última sincronização automática:
                  </span>
                  <strong className="text-[#7c3aed] dark:text-[#C084FC]">
                    {isSyncing
                      ? 'Sincronizando agora...'
                      : formatDate(lastSyncDate || remoteBackup?.updated)}
                  </strong>
                </div>

                {remoteBackup?.device_name && (
                  <div className="text-[10px] font-mono text-slate-500 dark:text-[#71717A] flex items-center gap-1 pl-0.5">
                    <Laptop className="w-3 h-3" />
                    Último dispositivo gravado: {remoteBackup.device_name}
                  </div>
                )}
              </div>

              {/* Informação sobre sincronização automática e nuvem como fonte da verdade */}
              <div className="p-3.5 rounded-[12px] bg-purple-50/70 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-xs text-slate-700 dark:text-[#A1A1AA] leading-relaxed font-sans space-y-1.5">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Dados Vinculados à Sua Conta (Nuvem como Fonte da Verdade)
                </div>
                <p>
                  Ao entrar na sua conta em qualquer computador ou celular, seus custos, cenários,
                  simuladores e planejamento financeiro são carregados automaticamente da nuvem.
                  Edições são sincronizadas em tempo real.
                </p>
              </div>

              {/* Painel de Alteração de Senha Opcional */}
              {isChangingPassword ? (
                <form
                  onSubmit={handleChangePasswordSubmit}
                  className="p-3.5 rounded-[12px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] space-y-2.5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC]" />
                      Alterar minha senha
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsChangingPassword(false)}
                      className="text-xs h-7 text-slate-500 hover:text-slate-900 dark:text-[#A1A1AA] dark:hover:text-white rounded-[6px]"
                    >
                      Cancelar
                    </Button>
                  </div>
                  <div>
                    <Label className="text-[11px] font-mono text-slate-600 dark:text-[#A1A1AA]">
                      Senha atual
                    </Label>
                    <Input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="h-9 text-xs bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white rounded-[8px] focus:border-[#7c3aed] dark:focus:border-[#C084FC]"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-mono text-slate-600 dark:text-[#A1A1AA]">
                      Nova senha (mínimo 8 caracteres)
                    </Label>
                    <Input
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-9 text-xs bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white rounded-[8px] focus:border-[#7c3aed] dark:focus:border-[#C084FC]"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-mono text-slate-600 dark:text-[#A1A1AA]">
                      Confirmar nova senha
                    </Label>
                    <Input
                      type="password"
                      required
                      minLength={8}
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      className="h-9 text-xs bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white rounded-[8px] focus:border-[#7c3aed] dark:focus:border-[#C084FC]"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-9 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] text-xs font-semibold rounded-[8px]"
                  >
                    {isLoading ? 'Salvando...' : 'Atualizar Senha'}
                  </Button>
                </form>
              ) : null}

              {/* Painel de Recarregar da Nuvem (Atualização manual sob demanda) */}
              <div className="space-y-2 p-3.5 rounded-[12px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                  <CloudDownload className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                  Recarregar dados da nuvem agora
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                  Seus dados já são atualizados automaticamente da nuvem ao logar. Use o botão
                  abaixo caso queira forçar uma reidratação imediata da sua conta.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setConfirmRestoreOpen(true)}
                  disabled={isSyncing || isRestoring}
                  className="w-full min-h-[42px] gap-2 border-purple-300 dark:border-purple-500/40 bg-white dark:bg-[#18181B] text-slate-900 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-[8px] transition-all font-mono text-xs font-semibold"
                >
                  {isRestoring ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#7c3aed] dark:text-[#C084FC]" />
                      Recarregando da nuvem...
                    </>
                  ) : (
                    <>
                      <CloudDownload className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                      FORÇAR RECARGA DA NUVEM
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
                    className="text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white text-[11px] font-mono gap-1.5 p-0 h-auto"
                  >
                    <KeyRound className="w-3 h-3 text-[#7c3aed] dark:text-[#C084FC]" />
                    Alterar senha
                  </Button>
                ) : (
                  <span />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 min-h-[44px] gap-1 px-3 rounded-[8px] font-mono text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair da conta
                </Button>
              </div>
            </div>
          ) : (
            /* ESTADO 2: NÃO CONECTADA */
            <div className="space-y-4 pt-1">
              <div className="p-3 rounded-[12px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed font-sans">
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
                <TabsList className="grid grid-cols-2 w-full bg-slate-100 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] rounded-[8px] p-1 h-10">
                  <TabsTrigger
                    value="login"
                    className="text-xs font-mono font-semibold min-h-[32px] rounded-[6px] data-[state=active]:bg-white dark:data-[state=active]:bg-[#18181B] data-[state=active]:text-[#7c3aed] dark:data-[state=active]:text-[#C084FC]"
                  >
                    ENTRAR
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="text-xs font-mono font-semibold min-h-[32px] rounded-[6px] data-[state=active]:bg-white dark:data-[state=active]:bg-[#18181B] data-[state=active]:text-[#ea580c] dark:data-[state=active]:text-[#FB923C]"
                  >
                    CRIAR CONTA
                  </TabsTrigger>
                </TabsList>

                {/* Aba Entrar */}
                <TabsContent value="login" className="mt-4 space-y-3">
                  <form onSubmit={handleLoginSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <Label
                        htmlFor="cloud-login-email"
                        className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]"
                      >
                        E-mail
                      </Label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 dark:text-[#71717A] absolute left-3 top-3.5" />
                        <Input
                          id="cloud-login-email"
                          type="email"
                          required
                          placeholder="seu.email@exemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9 h-11 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white rounded-[8px] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-1 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="cloud-login-password"
                          className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]"
                        >
                          Senha
                        </Label>
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(!isForgotPassword)}
                          className="text-xs font-mono text-[#7c3aed] dark:text-[#C084FC] hover:underline"
                        >
                          {isForgotPassword ? 'Lembrei a senha' : 'Esqueci minha senha'}
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 dark:text-[#71717A] absolute left-3 top-3.5" />
                        <Input
                          id="cloud-login-password"
                          type="password"
                          required={!isForgotPassword}
                          placeholder="Sua senha"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9 h-11 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white rounded-[8px] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-1 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC]"
                        />
                      </div>
                    </div>

                    {isForgotPassword && (
                      <div className="p-3 rounded-[12px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] space-y-2 text-xs">
                        <p className="text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                          Enviaremos as orientações de redefinição para o seu e-mail cadastrado
                          acima.
                        </p>
                        <Button
                          type="button"
                          onClick={handleForgotPasswordSubmit}
                          disabled={isLoading || !email}
                          className="w-full h-9 bg-[#ea580c] hover:bg-[#c2410c] dark:bg-[#FB923C] dark:hover:bg-[#ea580c] text-white dark:text-[#0A0A14] font-semibold text-xs rounded-[8px]"
                        >
                          {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
                        </Button>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full min-h-[44px] gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] shadow-md shadow-[#7c3aed]/20 dark:shadow-[#C084FC]/20 mt-2 font-mono text-xs focus:ring-2 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white dark:text-[#0A0A14]" />
                          Entrando...
                        </>
                      ) : (
                        <>
                          <Cloud className="w-4 h-4 text-white dark:text-[#0A0A14]" />
                          Entrar na Conta
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
                        className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]"
                      >
                        Seu Nome ou Como prefere ser chamada (opcional)
                      </Label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 dark:text-[#71717A] absolute left-3 top-3.5" />
                        <Input
                          id="cloud-signup-name"
                          type="text"
                          placeholder="Ex: Dra. Mariana Costa"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-9 h-11 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white rounded-[8px] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-1 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="cloud-signup-email"
                        className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]"
                      >
                        E-mail
                      </Label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 dark:text-[#71717A] absolute left-3 top-3.5" />
                        <Input
                          id="cloud-signup-email"
                          type="email"
                          required
                          placeholder="seu.email@exemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9 h-11 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white rounded-[8px] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-1 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="cloud-signup-password"
                        className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]"
                      >
                        Senha (mínimo de 8 caracteres)
                      </Label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 dark:text-[#71717A] absolute left-3 top-3.5" />
                        <Input
                          id="cloud-signup-password"
                          type="password"
                          required
                          minLength={8}
                          placeholder="Crie uma senha segura"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9 h-11 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white rounded-[8px] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-1 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="cloud-signup-password-confirm"
                        className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]"
                      >
                        Confirmar senha
                      </Label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 dark:text-[#71717A] absolute left-3 top-3.5" />
                        <Input
                          id="cloud-signup-password-confirm"
                          type="password"
                          required
                          minLength={8}
                          placeholder="Repita sua senha"
                          value={passwordConfirm}
                          onChange={(e) => setPasswordConfirm(e.target.value)}
                          className="pl-9 h-11 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white rounded-[8px] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-1 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC]"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full min-h-[44px] gap-2 bg-[#ea580c] hover:bg-[#c2410c] dark:bg-[#FB923C] dark:hover:bg-[#ea580c] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] shadow-md shadow-[#ea580c]/20 dark:shadow-[#FB923C]/20 mt-2 font-mono text-xs focus:ring-2 focus:ring-[#ea580c] dark:focus:ring-[#FB923C]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white dark:text-[#0A0A14]" />
                          Criando conta...
                        </>
                      ) : (
                        <>
                          <CloudUpload className="w-4 h-4 text-white dark:text-[#0A0A14]" />
                          Criar Conta
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Rodapé LGPD & Segurança Astral */}
          <div className="pt-3 mt-2 border-t border-slate-200 dark:border-[#27272A] text-[11px] text-slate-500 dark:text-[#71717A] flex items-start gap-2 leading-relaxed font-sans">
            <ShieldCheck className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-700 dark:text-[#A1A1AA]">
                Privacidade & LGPD Ética:
              </strong>{' '}
              Seus dados são criptografados em trânsito (HTTPS/TLS) e apenas a dona da conta tem
              acesso às regras de leitura e gravação. Nenhum dado do paciente é armazenado em texto
              não autorizado.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmação de Restauração Destrutiva Astral */}
      <AlertDialog open={confirmRestoreOpen} onOpenChange={setConfirmRestoreOpen}>
        <AlertDialogContent className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white rounded-[16px] shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-[#ea580c] dark:text-[#FB923C] mb-1">
              <AlertTriangle className="w-5 h-5" />
              <AlertDialogTitle className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
                Recarregar dados da sua conta na nuvem?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed space-y-2">
              <p>
                A aplicação atualizará os dados da tela trazendo a versão mais recente salva na
                nuvem.
              </p>
              {remoteBackup?.updated && (
                <div className="p-2.5 rounded-[8px] bg-slate-100 dark:bg-[#0A0A14] font-mono text-[11px] text-slate-700 dark:text-[#A1A1AA]">
                  Data na nuvem:{' '}
                  <span className="text-[#7c3aed] dark:text-[#C084FC] font-semibold">
                    {formatDate(remoteBackup.updated)}
                  </span>
                  {remoteBackup.device_name && <span> ({remoteBackup.device_name})</span>}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px] bg-slate-100 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white rounded-[8px]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRestore}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold min-h-[44px] rounded-[8px]"
            >
              Sim, recarregar da nuvem
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
