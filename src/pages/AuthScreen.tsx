import React, { useState, useEffect } from 'react'
import {
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
  ChevronLeft,
} from 'lucide-react'
import { FACSymbol } from '@/components/FACLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useCloudSync } from '@/hooks/useCloudSync'
import { useNavigate } from 'react-router-dom'

export type AuthViewMode = 'login' | 'signup' | 'forgot' | 'reset-token'

const REMEMBERED_EMAIL_KEY = 'entrelacos_fac_remembered_email'

interface AuthScreenProps {
  initialMode?: AuthViewMode
  redirectPath?: string
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'login',
  redirectPath: defaultRedirect = '/',
}) => {
  const navigate = useNavigate()
  const [targetRedirect, setTargetRedirect] = useState(defaultRedirect)
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
  } = useCloudSync()

  const [mode, setMode] = useState<AuthViewMode>(initialMode)

  // Formulário
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [name, setName] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  // Visibilidade de senhas
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Recupera e-mail memorizado e parâmetros de query (?token=, ?redirect=)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBERED_EMAIL_KEY)
      if (saved) {
        setEmail(saved)
        setRememberMe(true)
      }
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')
      const redirect = params.get('redirect')
      if (redirect && redirect.startsWith('/')) {
        setTargetRedirect(redirect)
      }
      if (token) {
        setResetToken(token)
        setMode('reset-token')
      } else {
        setMode(initialMode)
      }
    }
  }, [initialMode])

  // Se já estiver conectada, redireciona para a aplicação imediatamente
  useEffect(() => {
    if (isConnected && currentUser) {
      navigate(targetRedirect, { replace: true })
    }
  }, [isConnected, currentUser, navigate, targetRedirect])

  const switchMode = (newMode: AuthViewMode) => {
    setMode(newMode)
    setStatusMessage(null)
    setPassword('')
    setPasswordConfirm('')
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
      navigate(targetRedirect, { replace: true })
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
      navigate(targetRedirect, { replace: true })
    }
  }

  // 3. SUBMIT ESQUECI MINHA SENHA
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    await requestPasswordReset(email.trim())
  }

  // 4. SUBMIT DEFINIR NOVA SENHA VIA TOKEN
  const handleResetWithToken = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetToken.trim() || !password || !passwordConfirm) return
    const ok = await confirmPasswordReset(resetToken.trim(), password, passwordConfirm)
    if (ok) {
      setPassword('')
      setPasswordConfirm('')
      setResetToken('')
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        window.history.replaceState({}, document.title, '/login')
      }
      setTimeout(() => {
        setMode('login')
      }, 1600)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-background text-foreground relative overflow-hidden select-none">
      {/* Cartão Central Editorial com respiro e linhas finas */}
      <div className="relative w-full max-w-[440px] rounded-2xl p-6 sm:p-10 bg-white/90 dark:bg-[#0c0914] border border-slate-200/80 dark:border-zinc-800/80 shadow-xs z-10 transition-all">
        {/* Cabeçalho Visual Editorial */}
        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <div className="relative mb-3 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-[#7c3aed]/20 dark:border-[#C084FC]/30 flex items-center justify-center text-[#7c3aed] dark:text-[#C084FC]">
              <FACSymbol size={30} />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/10 border border-[#7c3aed]/20 text-[10px] font-mono uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] mb-2">
            <span>Método FAC</span>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <span>Entrelaços</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-[32px] font-normal tracking-tight text-slate-900 dark:text-zinc-100 leading-tight">
            {mode === 'login' && 'Entrar na Conta'}
            {mode === 'signup' && 'Criar Conta FAC'}
            {mode === 'forgot' && 'Recuperar Acesso'}
            {mode === 'reset-token' && 'Definir Nova Senha'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-2 max-w-[330px] font-light leading-relaxed">
            {mode === 'login' && 'Acesse suas aplicações e mantenha seus cálculos sincronizados.'}
            {mode === 'signup' && 'Cadastre-se para acessar o ecossistema da Academia FAC.'}
            {mode === 'forgot' &&
              'Digite seu e-mail cadastrado para receber instruções de redefinição.'}
            {mode === 'reset-token' && 'Digite sua nova senha de acesso à conta.'}
          </p>
        </div>

        {/* Feedback de status */}
        {statusMessage && (
          <div
            role="alert"
            className={`mb-5 p-3.5 rounded-xl text-xs flex items-start gap-2.5 transition-all relative z-10 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/30'
                : statusMessage.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-500/30'
                  : 'bg-purple-50 dark:bg-[#0A0A14] text-[#7c3aed] dark:text-[#C084FC] border border-purple-200 dark:border-[#C084FC]/30'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#7c3aed] dark:text-[#C084FC]" />
            )}
            <span className="flex-1 font-medium leading-relaxed">{statusMessage.text}</span>
          </div>
        )}

        {/* 1. MODO: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <Label
                htmlFor="gate-login-email"
                className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block"
              >
                E-mail de acesso
              </Label>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-400"
                  aria-hidden="true"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                </div>
                <Input
                  id="gate-login-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="!pl-11 !pr-4 h-12 text-[15px] bg-slate-50/80 dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-[#0A0A14] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-2 focus:ring-[#7c3aed]/20 dark:focus:ring-[#C084FC]/25 rounded-xl font-normal transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="gate-login-password"
                  className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block"
                >
                  Senha
                </Label>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-xs text-[#7c3aed] dark:text-[#C084FC] hover:text-[#6d28d9] dark:hover:text-purple-300 hover:underline transition-colors font-medium"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-400"
                  aria-hidden="true"
                >
                  <Lock className="w-4 h-4 shrink-0" />
                </div>
                <Input
                  id="gate-login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="!pl-11 !pr-11 h-12 text-[15px] bg-slate-50/80 dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-[#0A0A14] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-2 focus:ring-[#7c3aed]/20 dark:focus:ring-[#C084FC]/25 rounded-xl font-normal transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <span className="p-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </span>
                </button>
              </div>
            </div>

            {/* Lembrar e-mail */}
            <div className="flex items-center space-x-2.5 pt-1">
              <Checkbox
                id="gate-remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                className="border-slate-300 dark:border-[#27272A] data-[state=checked]:bg-[#7c3aed] dark:data-[state=checked]:bg-[#C084FC] data-[state=checked]:border-[#7c3aed] dark:data-[state=checked]:border-[#C084FC] data-[state=checked]:text-white dark:data-[state=checked]:text-[#0A0A14] rounded-md h-4 w-4"
              />
              <label
                htmlFor="gate-remember-me"
                className="text-xs sm:text-[13px] text-slate-600 dark:text-[#A1A1AA] cursor-pointer select-none font-medium"
              >
                Lembrar meu e-mail neste navegador
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] dark:active:bg-[#9333ea] text-white dark:text-[#0A0A14] text-[15px] font-semibold rounded-xl shadow-lg shadow-[#7c3aed]/25 dark:shadow-[#C084FC]/20 mt-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white dark:text-[#0A0A14]" />
                  Entrando no sistema...
                </>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <div className="pt-4 text-center text-xs sm:text-[13px] text-slate-600 dark:text-[#A1A1AA] border-t border-slate-200 dark:border-[#27272A] mt-4">
              Primeiro acesso?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="text-[#7c3aed] dark:text-[#C084FC] hover:text-[#6d28d9] dark:hover:text-purple-300 hover:underline font-semibold ml-1 transition-colors"
              >
                Criar uma conta
              </button>
            </div>
          </form>
        )}

        {/* 2. MODO: CADASTRO */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3.5 relative z-10">
            <div className="space-y-1.5">
              <Label
                htmlFor="gate-signup-name"
                className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block"
              >
                Nome completo ou como prefere ser chamada
              </Label>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-400"
                  aria-hidden="true"
                >
                  <User className="w-4 h-4 shrink-0" />
                </div>
                <Input
                  id="gate-signup-name"
                  type="text"
                  placeholder="Ex: Dra. Mariana Costa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="!pl-11 !pr-4 h-11.5 text-[15px] bg-slate-50/80 dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-[#0A0A14] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-2 focus:ring-[#7c3aed]/20 dark:focus:ring-[#C084FC]/25 rounded-xl font-normal transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="gate-signup-email"
                className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block"
              >
                E-mail
              </Label>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-400"
                  aria-hidden="true"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                </div>
                <Input
                  id="gate-signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="!pl-11 !pr-4 h-11.5 text-[15px] bg-slate-50/80 dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-[#0A0A14] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-2 focus:ring-[#7c3aed]/20 dark:focus:ring-[#C084FC]/25 rounded-xl font-normal transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="gate-signup-password"
                className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block"
              >
                Senha (mínimo de 8 caracteres)
              </Label>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-400"
                  aria-hidden="true"
                >
                  <Lock className="w-4 h-4 shrink-0" />
                </div>
                <Input
                  id="gate-signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="!pl-11 !pr-11 h-11.5 text-[15px] bg-slate-50/80 dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-[#0A0A14] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-2 focus:ring-[#7c3aed]/20 dark:focus:ring-[#C084FC]/25 rounded-xl font-normal transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <span className="p-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="gate-signup-password-confirm"
                className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block"
              >
                Confirmar senha
              </Label>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-400"
                  aria-hidden="true"
                >
                  <Lock className="w-4 h-4 shrink-0" />
                </div>
                <Input
                  id="gate-signup-password-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="!pl-11 !pr-11 h-11.5 text-[15px] bg-slate-50/80 dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-[#0A0A14] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-2 focus:ring-[#7c3aed]/20 dark:focus:ring-[#C084FC]/25 rounded-xl font-normal transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? 'Ocultar confirmação de senha'
                      : 'Ver confirmação de senha'
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <span className="p-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors">
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </span>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] gap-2 bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] dark:bg-[#FB923C] dark:hover:bg-[#ea580c] text-white dark:text-[#0A0A14] text-[15px] font-semibold rounded-xl shadow-lg shadow-[#ea580c]/25 dark:shadow-[#FB923C]/20 mt-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white dark:text-[#0A0A14]" />
                  Criando sua conta...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Cadastrar e Acessar Sistema</span>
                </>
              )}
            </Button>

            <div className="pt-3 text-center text-xs sm:text-[13px] text-slate-600 dark:text-[#A1A1AA] border-t border-slate-200 dark:border-[#27272A] mt-3">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-[#7c3aed] dark:text-[#C084FC] hover:text-[#6d28d9] dark:hover:text-purple-300 hover:underline font-semibold ml-1 transition-colors"
              >
                Fazer login
              </button>
            </div>
          </form>
        )}

        {/* 3. MODO: ESQUECI MINHA SENHA */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <Label
                htmlFor="gate-forgot-email"
                className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block"
              >
                E-mail cadastrado
              </Label>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-400"
                  aria-hidden="true"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                </div>
                <Input
                  id="gate-forgot-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="!pl-11 !pr-4 h-12 text-[15px] bg-slate-50/80 dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-[#0A0A14] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-2 focus:ring-[#7c3aed]/20 dark:focus:ring-[#C084FC]/25 rounded-xl font-normal transition-all"
                />
              </div>
              <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                Enviaremos um link oficial de redefinição para o e-mail cadastrado.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] text-xs sm:text-[13px] flex items-center justify-between gap-2">
              <span className="text-slate-600 dark:text-[#A1A1AA]">
                Já recebeu o código por e-mail?
              </span>
              <button
                type="button"
                onClick={() => switchMode('reset-token')}
                className="text-[#7c3aed] dark:text-[#C084FC] hover:underline font-semibold shrink-0"
              >
                Inserir token
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] text-[15px] font-semibold rounded-xl shadow-lg shadow-[#7c3aed]/25 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white dark:text-[#0A0A14]" />
                  Enviando solicitação...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Enviar link de recuperação</span>
                </>
              )}
            </Button>

            <div className="pt-2 text-center text-xs sm:text-[13px]">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 transition-colors font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar para o login
              </button>
            </div>
          </form>
        )}

        {/* 4. MODO: RESET TOKEN */}
        {mode === 'reset-token' && (
          <form onSubmit={handleResetWithToken} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <Label
                htmlFor="gate-reset-token-input"
                className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block"
              >
                Token de redefinição
              </Label>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-400"
                  aria-hidden="true"
                >
                  <KeyRound className="w-4 h-4 shrink-0" />
                </div>
                <Input
                  id="gate-reset-token-input"
                  type="text"
                  required
                  placeholder="Cole aqui o token do e-mail"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="!pl-11 !pr-4 h-12 text-xs sm:text-[13px] font-mono bg-slate-50/80 dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-[#0A0A14] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-2 focus:ring-[#7c3aed]/20 dark:focus:ring-[#C084FC]/25 rounded-xl transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="gate-reset-new-password"
                className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block"
              >
                Nova senha (mínimo 8 caracteres)
              </Label>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-400"
                  aria-hidden="true"
                >
                  <Lock className="w-4 h-4 shrink-0" />
                </div>
                <Input
                  id="gate-reset-new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="!pl-11 !pr-11 h-12 text-[15px] bg-slate-50/80 dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-[#0A0A14] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-2 focus:ring-[#7c3aed]/20 dark:focus:ring-[#C084FC]/25 rounded-xl font-normal transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar nova senha' : 'Ver nova senha'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <span className="p-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="gate-reset-confirm"
                className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block"
              >
                Confirmar nova senha
              </Label>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-400"
                  aria-hidden="true"
                >
                  <Lock className="w-4 h-4 shrink-0" />
                </div>
                <Input
                  id="gate-reset-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="!pl-11 !pr-11 h-12 text-[15px] bg-slate-50/80 dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-[#0A0A14] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-2 focus:ring-[#7c3aed]/20 dark:focus:ring-[#C084FC]/25 rounded-xl font-normal transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? 'Ocultar confirmação de nova senha'
                      : 'Ver confirmação de nova senha'
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <span className="p-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors">
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </span>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] text-[15px] font-semibold rounded-xl shadow-lg shadow-[#7c3aed]/25 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white dark:text-[#0A0A14]" />
                  Redefinindo senha...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Concluir Redefinição</span>
                </>
              )}
            </Button>

            <div className="pt-2 text-center text-xs sm:text-[13px]">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 transition-colors font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar para o login
              </button>
            </div>
          </form>
        )}

        {/* Rodapé LGPD & Segurança Ética */}
        <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-[#27272A] text-[11px] sm:text-xs text-slate-600 dark:text-[#A1A1AA] flex items-start gap-2.5 leading-relaxed relative z-10 bg-slate-50/50 dark:bg-transparent -mx-2 px-2 py-2 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC] shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">
              LGPD & Privacidade Ética:
            </strong>{' '}
            Acesso criptografado e seguro. Seus cálculos são protegidos e nenhum dado de pacientes é
            armazenado.
          </span>
        </div>
      </div>
    </div>
  )
}
export default AuthScreen
