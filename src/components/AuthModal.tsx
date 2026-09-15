import React, { useState, useEffect } from 'react'
import {
  Heart,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  RotateCcw,
  Sparkles,
  X,
  LogOut,
  ChevronLeft,
} from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useCloudSync } from '@/hooks/useCloudSync'

export type AuthMode = 'login' | 'signup' | 'forgot' | 'change-password' | 'reset-token'

const REMEMBERED_EMAIL_KEY = 'entrelacos_fac_remembered_email'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: AuthMode
  onSuccess?: () => void
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const {
    currentUser,
    isConnected,
    isLoading,
    statusMessage,
    setStatusMessage,
    login,
    signup,
    requestPasswordReset,
    confirmPasswordReset,
    changePassword,
    logout,
  } = useCloudSync()

  const [mode, setMode] = useState<AuthMode>(initialMode)

  // Campos de formulário
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [name, setName] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  // Visibilidade de senhas
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)

  // Recupera e-mail memorizado e verifica se há token de redefinição na URL
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(REMEMBERED_EMAIL_KEY)
        if (saved) {
          setEmail(saved)
          setRememberMe(true)
        }
      } catch {
        // ignore
      }

      // Checar se o link da URL trouxe token de redefinição de senha
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        if (token) {
          setResetToken(token)
          setMode('reset-token')
        } else if (isConnected) {
          setMode(initialMode === 'change-password' ? 'change-password' : 'login')
        } else {
          setMode(initialMode)
        }
      }
    }
  }, [isOpen, isConnected, initialMode])

  // Limpa mensagens ao trocar de modo
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    setStatusMessage(null)
    setPassword('')
    setPasswordConfirm('')
    setOldPassword('')
  }

  // 1. SUBMIT LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return

    if (rememberMe) {
      try {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim())
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY)
      } catch {
        // ignore
      }
    }

    const ok = await login(email.trim(), password)
    if (ok) {
      setPassword('')
      if (onSuccess) onSuccess()
    }
  }

  // 2. SUBMIT CADASTRO
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return

    if (password.length < 8) {
      setStatusMessage({
        type: 'error',
        text: 'A senha deve ter no mínimo 8 caracteres para garantir a segurança dos seus dados.',
      })
      return
    }

    if (password !== passwordConfirm) {
      setStatusMessage({
        type: 'error',
        text: 'A confirmação de senha não confere com a senha digitada.',
      })
      return
    }

    if (rememberMe) {
      try {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim())
      } catch {
        // ignore
      }
    }

    const ok = await signup(email.trim(), password, name.trim(), passwordConfirm)
    if (ok) {
      setPassword('')
      setPasswordConfirm('')
      if (onSuccess) onSuccess()
    }
  }

  // 3. SUBMIT ESQUECI MINHA SENHA
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    await requestPasswordReset(email.trim())
  }

  // 4. SUBMIT ALTERAR SENHA (LOGADA)
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldPassword || !password || !passwordConfirm) return
    const ok = await changePassword(oldPassword, password, passwordConfirm)
    if (ok) {
      setOldPassword('')
      setPassword('')
      setPasswordConfirm('')
    }
  }

  // 5. SUBMIT DEFINIR NOVA SENHA VIA TOKEN
  const handleResetWithToken = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetToken.trim() || !password || !passwordConfirm) return
    const ok = await confirmPasswordReset(resetToken.trim(), password, passwordConfirm)
    if (ok) {
      setPassword('')
      setPasswordConfirm('')
      setResetToken('')
      // Limpa token da URL para não reenviar ao atualizar
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        const cleanUrl = window.location.pathname
        window.history.replaceState({}, document.title, cleanUrl)
      }
      setTimeout(() => {
        setMode('login')
      }, 1600)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        aria-describedby="auth-modal-description"
        className="max-w-[420px] w-full p-0 overflow-hidden border-0 bg-transparent shadow-none"
      >
        {/* Container Glassmorphism Editorial Elegance Astral */}
        <div className="relative w-full rounded-[16px] sm:rounded-[20px] p-6 sm:p-7 backdrop-blur-2xl bg-[#18181B] border border-[#27272A] text-white shadow-2xl overflow-hidden">
          {/* Efeito Glow Roxo e Laranja Sutil de Fundo */}
          <div
            className="absolute -top-24 -left-24 w-56 h-56 rounded-full bg-[#C084FC]/15 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -right-24 w-56 h-56 rounded-full bg-[#FB923C]/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Botão Fechar no Canto Superior */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#71717A] hover:text-white rounded-[8px] hover:bg-[#0A0A14] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#C084FC] z-20"
            aria-label="Fechar janela"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Cabeçalho Visual com Monograma FAC Entrelaços */}
          <div className="flex flex-col items-center text-center mb-5 relative z-10">
            <div className="relative mb-3 group">
              <div
                className="absolute inset-0 rounded-[12px] bg-gradient-to-tr from-[#C084FC] to-[#FB923C] blur-md opacity-40 group-hover:opacity-75 transition-opacity"
                aria-hidden="true"
              />
              <div className="relative w-12 h-12 rounded-[12px] bg-[#0A0A14] border border-[#27272A] flex items-center justify-center text-[#C084FC] shadow-inner">
                <Heart className="w-6 h-6 fill-[#C084FC]/20 stroke-[2.2] text-[#C084FC]" />
              </div>
            </div>

            <DialogTitle className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-white flex items-center gap-1.5">
              {mode === 'login' && 'Bem-vinda de volta'}
              {mode === 'signup' && 'Criar sua conta FAC'}
              {mode === 'forgot' && 'Recuperar acesso'}
              {mode === 'change-password' && 'Alterar sua senha'}
              {mode === 'reset-token' && 'Definir nova senha'}
            </DialogTitle>

            <DialogDescription
              id="auth-modal-description"
              className="text-xs sm:text-[13px] text-[#A1A1AA] mt-1 max-w-[280px]"
            >
              {mode === 'login' && 'Acesse seus cenários e cálculos salvos em qualquer aparelho.'}
              {mode === 'signup' && 'Cadastre-se para sincronizar seus cálculos na nuvem segura.'}
              {mode === 'forgot' && 'Digite seu e-mail para receber as instruções de recuperação.'}
              {mode === 'change-password' && 'Defina uma nova senha para sua conta conectada.'}
              {mode === 'reset-token' && 'Digite sua nova senha de acesso à calculadora.'}
            </DialogDescription>
          </div>

          {/* Feedback de status (sucesso, erro ou info) */}
          {statusMessage && (
            <div
              className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2.5 transition-all relative z-10 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/70 text-emerald-200 border border-emerald-500/40'
                  : statusMessage.type === 'error'
                    ? 'bg-rose-950/70 text-rose-200 border border-rose-500/40'
                    : 'bg-purple-950/70 text-purple-200 border border-purple-500/40'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
              )}
              <span className="flex-1 font-medium leading-relaxed">{statusMessage.text}</span>
            </div>
          )}

          {/* 1. MODO: LOGIN */}
          {mode === 'login' && (
            <div className="relative z-10">
              {isConnected && currentUser ? (
                /* Sessão já conectada */
                <div className="space-y-4 py-2">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Sessão ativa
                      </span>
                      <span className="text-[11px] text-slate-400">Entrelaços Nuvem</span>
                    </div>
                    <p className="text-sm font-medium text-white truncate">{currentUser.email}</p>
                    {currentUser.name && (
                      <p className="text-xs text-slate-400">{currentUser.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => switchMode('change-password')}
                      className="min-h-[44px] gap-1.5 border-white/15 text-white bg-white/5 hover:bg-white/10 text-xs font-medium"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-purple-300" />
                      Alterar senha
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={logout}
                      className="min-h-[44px] gap-1.5 border-rose-500/30 text-rose-300 bg-rose-950/20 hover:bg-rose-950/40 text-xs font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sair da conta
                    </Button>
                  </div>

                  <Button
                    type="button"
                    onClick={onClose}
                    className="w-full min-h-[44px] bg-[#C084FC] hover:bg-[#a855f7] text-[#0A0A14] font-semibold rounded-[8px] shadow-lg shadow-[#C084FC]/20 font-mono text-xs"
                  >
                    Continuar na Calculadora
                  </Button>
                </div>
              ) : (
                /* Formulário de Login */
                <form onSubmit={handleLogin} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="auth-login-email"
                      className="text-xs font-medium text-slate-300"
                    >
                      E-mail
                    </Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <Input
                        id="auth-login-email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="seu.email@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9.5 h-11 text-sm bg-[#0A0A14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#C084FC] focus:ring-[#C084FC] rounded-[8px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="auth-login-password"
                        className="text-xs font-mono text-[#A1A1AA]"
                      >
                        Senha
                      </Label>
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-xs font-mono text-[#C084FC] hover:underline"
                      >
                        Esqueci minha senha
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <Input
                        id="auth-login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9.5 pr-10 h-11 text-sm bg-[#0A0A14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#C084FC] focus:ring-[#C084FC] rounded-[8px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                        className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors p-0.5 rounded"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Lembrar-me */}
                  <div className="flex items-center space-x-2 pt-0.5">
                    <Checkbox
                      id="auth-remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                      className="border-white/20 data-[state=checked]:bg-[#5B3A8E] data-[state=checked]:border-[#5B3A8E]"
                    />
                    <label
                      htmlFor="auth-remember-me"
                      className="text-xs text-slate-300 cursor-pointer select-none"
                    >
                      Lembrar meu e-mail neste navegador
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full min-h-[44px] gap-2 bg-[#C084FC] hover:bg-[#a855f7] text-[#0A0A14] font-semibold rounded-[8px] shadow-lg shadow-[#C084FC]/20 mt-1 transition-all font-mono text-xs focus:ring-2 focus:ring-[#C084FC]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        <span>Entrar</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  {/* Rodapé Alternar Cadastro */}
                  <div className="pt-3 text-center text-xs text-slate-400 border-t border-white/10 mt-3">
                    Não tem uma conta?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className="text-purple-300 hover:text-purple-200 font-semibold underline-offset-4 hover:underline"
                    >
                      Criar conta
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 2. MODO: CRIAÇÃO DE CREDENCIAIS (CADASTRO) */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3 relative z-10">
              <div className="space-y-1">
                <Label htmlFor="auth-signup-name" className="text-xs font-medium text-slate-300">
                  Nome completo ou como prefere ser chamada
                </Label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="auth-signup-name"
                    type="text"
                    placeholder="Ex: Dra. Juliana Santos"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9.5 h-10.5 text-sm bg-[#0A0A14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#FB923C] focus:ring-[#FB923C] rounded-[8px]"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="auth-signup-email" className="text-xs font-mono text-[#A1A1AA]">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="auth-signup-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9.5 h-10.5 text-sm bg-[#0A0A14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#FB923C] focus:ring-[#FB923C] rounded-[8px]"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="auth-signup-password" className="text-xs font-mono text-[#A1A1AA]">
                  Senha (mínimo de 8 caracteres)
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="auth-signup-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9.5 pr-10 h-10.5 text-sm bg-[#0A0A14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#FB923C] focus:ring-[#FB923C] rounded-[8px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors p-0.5 rounded"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="auth-signup-password-confirm"
                  className="text-xs font-medium text-slate-300"
                >
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="auth-signup-password-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="pl-9.5 pr-10 h-10.5 text-sm bg-[#0A0A14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#FB923C] focus:ring-[#FB923C] rounded-[8px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? 'Ocultar confirmação de senha'
                        : 'Ver confirmação de senha'
                    }
                    className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors p-0.5 rounded"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[44px] gap-2 bg-[#C084FC] hover:bg-[#a855f7] text-[#0A0A14] font-semibold rounded-[8px] shadow-lg transition-all font-mono text-xs focus:ring-2 focus:ring-[#C084FC]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#0A0A14]" />
                    Redefinindo...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#0A0A14]" />
                    <span>REDEFINIR E CONECTAR</span>
                  </>
                )}
              </Button>{' '}
              <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/10 mt-2">
                Já possui uma conta?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-purple-300 hover:text-purple-200 font-semibold underline-offset-4 hover:underline"
                >
                  Entrar
                </button>
              </div>
            </form>
          )}

          {/* 3. MODO: ESQUECI MINHA SENHA */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4 relative z-10">
              <div className="space-y-1.5">
                <Label htmlFor="auth-forgot-email" className="text-xs font-medium text-slate-300">
                  E-mail cadastrado
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="auth-forgot-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9.5 h-11 text-sm bg-[#0A0A14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#FB923C] focus:ring-[#FB923C] rounded-[8px]"
                  />
                </div>
                <p className="text-[11px] text-[#A1A1AA] leading-relaxed pt-1">
                  Enviaremos as orientações oficiais para redefinir sua credencial. Verifique também
                  a caixa de spam/promoções.
                </p>
              </div>

              {/* Opção para inserir token se já recebeu link por e-mail */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center justify-between">
                <span className="text-slate-300">Já recebeu o código/token?</span>
                <button
                  type="button"
                  onClick={() => switchMode('reset-token')}
                  className="text-purple-300 hover:text-purple-200 font-semibold underline-offset-4 hover:underline"
                >
                  Inserir token
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[44px] gap-2 bg-[#FB923C] hover:bg-[#ea580c] text-[#0A0A14] font-semibold rounded-[8px] shadow-lg transition-all font-mono text-xs focus:ring-2 focus:ring-[#FB923C]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando solicitação...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Enviar link de recuperação</span>
                  </>
                )}
              </Button>

              <div className="pt-2 text-center text-xs">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Voltar para o login
                </button>
              </div>
            </form>
          )}

          {/* 4. MODO: ALTERAÇÃO DE SENHA (USUÁRIA LOGADA) */}
          {mode === 'change-password' && (
            <form onSubmit={handleChangePassword} className="space-y-3.5 relative z-10">
              <div className="space-y-1">
                <Label htmlFor="auth-old-password" className="text-xs font-medium text-slate-300">
                  Senha atual
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="auth-old-password"
                    type={showOldPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="pl-9.5 pr-10 h-11 text-sm bg-[#0A0A14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#C084FC] focus:ring-[#C084FC] rounded-[8px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    aria-label={showOldPassword ? 'Ocultar senha atual' : 'Ver senha atual'}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors p-0.5 rounded"
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="auth-new-password" className="text-xs font-mono text-[#A1A1AA]">
                  Nova senha (mínimo 8 caracteres)
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="auth-new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9.5 pr-10 h-11 text-sm bg-[#0A0A14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#C084FC] focus:ring-[#C084FC] rounded-[8px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar nova senha' : 'Ver nova senha'}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors p-0.5 rounded"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="auth-new-password-confirm"
                  className="text-xs font-mono text-[#A1A1AA]"
                >
                  Confirmar nova senha
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="auth-new-password-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="pl-9.5 pr-10 h-11 text-sm bg-[#0A0A14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#C084FC] focus:ring-[#C084FC] rounded-[8px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? 'Ocultar confirmação de nova senha'
                        : 'Ver confirmação de nova senha'
                    }
                    className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors p-0.5 rounded"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[44px] gap-2 bg-[#C084FC] hover:bg-[#a855f7] text-[#0A0A14] font-semibold rounded-[8px] shadow-lg transition-all font-mono text-xs focus:ring-2 focus:ring-[#C084FC]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#0A0A14]" />
                    Atualizando senha...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-[#0A0A14]" />
                    <span>SALVAR NOVA SENHA</span>
                  </>
                )}
              </Button>

              <div className="pt-2 text-center text-xs">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Voltar para os detalhes da conta
                </button>
              </div>
            </form>
          )}

          {/* 5. MODO: REDEFINIÇÃO COM TOKEN DO LINK DE E-MAIL */}
          {mode === 'reset-token' && (
            <form onSubmit={handleResetWithToken} className="space-y-3.5 relative z-10">
              <div className="space-y-1">
                <Label
                  htmlFor="auth-reset-token-input"
                  className="text-xs font-medium text-slate-300"
                >
                  Token ou Código de redefinição
                </Label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="auth-reset-token-input"
                    type="text"
                    required
                    placeholder="Cole aqui o token do e-mail"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="pl-9.5 h-11 text-xs font-mono bg-[#0A0A14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#C084FC] focus:ring-[#C084FC] rounded-[8px]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="auth-reset-new-password"
                  className="text-xs font-mono text-[#A1A1AA]"
                >
                  Nova senha (mínimo 8 caracteres)
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="auth-reset-new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9.5 pr-10 h-11 text-sm bg-[#0A0A14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#C084FC] focus:ring-[#C084FC] rounded-[8px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar nova senha' : 'Ver nova senha'}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors p-0.5 rounded"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="auth-reset-confirm" className="text-xs font-mono text-[#A1A1AA]">
                  Confirmar nova senha
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="auth-reset-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="pl-9.5 pr-10 h-11 text-sm bg-[#0A0A14] border-[#27272A] text-white placeholder:text-[#71717A] focus:border-[#C084FC] focus:ring-[#C084FC] rounded-[8px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? 'Ocultar confirmação de nova senha'
                        : 'Ver confirmação de nova senha'
                    }
                    className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors p-0.5 rounded"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[44px] gap-2 bg-[#C084FC] hover:bg-[#a855f7] text-[#0A0A14] font-semibold rounded-[8px] shadow-lg transition-all font-mono text-xs focus:ring-2 focus:ring-[#C084FC]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#0A0A14]" />
                    Redefinindo senha...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#0A0A14]" />
                    <span>CONCLUIR REDEFINIÇÃO</span>
                  </>
                )}
              </Button>

              <div className="pt-2 text-center text-xs">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Voltar para o login
                </button>
              </div>
            </form>
          )}

          {/* Nota LGPD Ética & Segurança */}
          <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-start gap-2 leading-relaxed relative z-10">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>
              <strong>LGPD & Privacidade Ética:</strong> Conexão segura ponta a ponta. Nenhum dado
              de pacientes é armazenado.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
