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
  ChevronLeft,
} from 'lucide-react'
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-[#03000A] text-slate-900 dark:text-white relative overflow-hidden select-none">
      {/* Astral Atmospheric Subtle Glow Layer */}
      <div
        className="absolute top-1/4 -left-32 w-[420px] h-[420px] rounded-full bg-purple-400/20 dark:bg-[#C084FC]/15 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -right-32 w-[380px] h-[380px] rounded-full bg-orange-400/15 dark:bg-[#FB923C]/10 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-300/15 dark:bg-[#C084FC]/08 blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Grid sutil Astral */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e125_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e125_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272A15_1px,transparent_1px),linear-gradient(to_bottom,#27272A15_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Cartão Central Astral Surface com suporte claro/escuro */}
      <div className="relative w-full max-w-[430px] rounded-[16px] p-6 sm:p-8 bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-10 transition-all">
        {/* Cabeçalho Visual Astral */}
        <div className="flex flex-col items-center text-center mb-6 relative z-10">
          <div className="relative mb-3 group cursor-default">
            <div
              className="absolute inset-0 rounded-[12px] bg-purple-400/30 dark:bg-[#C084FC]/30 blur-md opacity-60 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            />
            <div className="relative w-12 h-12 rounded-[12px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] flex items-center justify-center text-[#7c3aed] dark:text-[#C084FC] shadow-inner">
              <Heart className="w-6 h-6 fill-[#7c3aed]/20 dark:fill-[#C084FC]/20 stroke-[2] text-[#7c3aed] dark:text-[#C084FC]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[10px] font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] mb-2">
            <span>Método FAC</span>
            <span className="text-slate-400 dark:text-[#A1A1AA]/50">•</span>
            <span>Entrelaços</span>
          </div>

          <h1 className="font-sans text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900 dark:text-white leading-tight">
            {mode === 'login' && 'Entrar no Sistema'}
            {mode === 'signup' && 'Criar Conta FAC'}
            {mode === 'forgot' && 'Recuperar Acesso'}
            {mode === 'reset-token' && 'Definir Nova Senha'}
          </h1>

          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-[#A1A1AA] mt-1.5 max-w-[310px] leading-relaxed">
            {mode === 'login' &&
              'Acesse a Calculadora de Precificação Ética com suas credenciais seguras.'}
            {mode === 'signup' &&
              'Cadastre-se para acessar a calculadora e manter seus cálculos protegidos.'}
            {mode === 'forgot' &&
              'Digite seu e-mail cadastrado para receber as instruções de redefinição.'}
            {mode === 'reset-token' && 'Digite sua nova senha de acesso à calculadora.'}
          </p>
        </div>

        {/* Feedback de status */}
        {statusMessage && (
          <div
            className={`mb-4 p-3 rounded-[8px] text-xs flex items-start gap-2.5 transition-all relative z-10 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-500/30'
                : statusMessage.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-500/30'
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
          <form onSubmit={handleLogin} className="space-y-3.5 relative z-10">
            <div className="space-y-1.5">
              <Label
                htmlFor="gate-login-email"
                className="text-xs font-mono font-medium text-slate-600 dark:text-[#A1A1AA] uppercase tracking-wider"
              >
                E-mail de acesso
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-[#A1A1AA] absolute left-3 top-3.5" />
                <Input
                  id="gate-login-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9.5 h-11 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#71717A] focus:border-[#7c3aed] dark:focus:border-[#C084FC] rounded-[8px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="gate-login-password"
                  className="text-xs font-mono font-medium text-slate-600 dark:text-[#A1A1AA] uppercase tracking-wider"
                >
                  Senha
                </Label>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-xs text-[#7c3aed] dark:text-[#C084FC] hover:underline transition-colors font-medium"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-[#A1A1AA] absolute left-3 top-3.5" />
                <Input
                  id="gate-login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9.5 pr-10 h-11 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#71717A] focus:border-[#7c3aed] dark:focus:border-[#C084FC] rounded-[8px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  className="absolute right-3 top-3 text-slate-400 dark:text-[#A1A1AA] hover:text-slate-700 dark:hover:text-white transition-colors p-0.5 rounded"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Lembrar e-mail */}
            <div className="flex items-center space-x-2 pt-0.5">
              <Checkbox
                id="gate-remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                className="border-slate-300 dark:border-[#27272A] data-[state=checked]:bg-[#7c3aed] dark:data-[state=checked]:bg-[#C084FC] data-[state=checked]:border-[#7c3aed] dark:data-[state=checked]:border-[#C084FC] data-[state=checked]:text-white dark:data-[state=checked]:text-[#0A0A14] rounded-[4px]"
              />
              <label
                htmlFor="gate-remember-me"
                className="text-xs text-slate-600 dark:text-[#A1A1AA] cursor-pointer select-none"
              >
                Lembrar meu e-mail neste navegador
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] shadow-md shadow-[#7c3aed]/20 dark:shadow-[#C084FC]/20 mt-1 transition-all"
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

            <div className="pt-3 text-center text-xs text-slate-600 dark:text-[#A1A1AA] border-t border-slate-200 dark:border-[#27272A] mt-3">
              Primeiro acesso?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="text-[#7c3aed] dark:text-[#C084FC] hover:underline font-semibold"
              >
                Criar uma conta
              </button>
            </div>
          </form>
        )}

        {/* 2. MODO: CADASTRO */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3 relative z-10">
            <div className="space-y-1">
              <Label
                htmlFor="gate-signup-name"
                className="text-xs font-mono font-medium text-slate-600 dark:text-[#A1A1AA] uppercase tracking-wider"
              >
                Nome completo ou como prefere ser chamada
              </Label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 dark:text-[#A1A1AA] absolute left-3 top-3.5" />
                <Input
                  id="gate-signup-name"
                  type="text"
                  placeholder="Ex: Dra. Mariana Costa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9.5 h-10.5 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#71717A] focus:border-[#7c3aed] dark:focus:border-[#C084FC] rounded-[8px]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="gate-signup-email"
                className="text-xs font-mono font-medium text-slate-600 dark:text-[#A1A1AA] uppercase tracking-wider"
              >
                E-mail
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-[#A1A1AA] absolute left-3 top-3.5" />
                <Input
                  id="gate-signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9.5 h-10.5 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#71717A] focus:border-[#7c3aed] dark:focus:border-[#C084FC] rounded-[8px]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="gate-signup-password"
                className="text-xs font-mono font-medium text-slate-600 dark:text-[#A1A1AA] uppercase tracking-wider"
              >
                Senha (mínimo de 8 caracteres)
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-[#A1A1AA] absolute left-3 top-3.5" />
                <Input
                  id="gate-signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9.5 pr-10 h-10.5 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#71717A] focus:border-[#7c3aed] dark:focus:border-[#C084FC] rounded-[8px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  className="absolute right-3 top-3 text-slate-400 dark:text-[#A1A1AA] hover:text-slate-700 dark:hover:text-white transition-colors p-0.5 rounded"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="gate-signup-password-confirm"
                className="text-xs font-mono font-medium text-slate-600 dark:text-[#A1A1AA] uppercase tracking-wider"
              >
                Confirmar senha
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-[#A1A1AA] absolute left-3 top-3.5" />
                <Input
                  id="gate-signup-password-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="pl-9.5 pr-10 h-10.5 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#71717A] focus:border-[#7c3aed] dark:focus:border-[#C084FC] rounded-[8px]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? 'Ocultar confirmação de senha'
                      : 'Ver confirmação de senha'
                  }
                  className="absolute right-3 top-3 text-slate-400 dark:text-[#A1A1AA] hover:text-slate-700 dark:hover:text-white transition-colors p-0.5 rounded"
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
              className="w-full min-h-[46px] gap-2 bg-[#ea580c] hover:bg-[#c2410c] dark:bg-[#FB923C] dark:hover:bg-[#ea580c] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] shadow-md shadow-[#ea580c]/20 dark:shadow-[#FB923C]/20 mt-1 transition-all"
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

            <div className="pt-2 text-center text-xs text-slate-600 dark:text-[#A1A1AA] border-t border-slate-200 dark:border-[#27272A] mt-2">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-[#7c3aed] dark:text-[#C084FC] hover:underline font-semibold"
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
                className="text-xs font-mono font-medium text-slate-600 dark:text-[#A1A1AA] uppercase tracking-wider"
              >
                E-mail cadastrado
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-[#A1A1AA] absolute left-3 top-3.5" />
                <Input
                  id="gate-forgot-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9.5 h-11 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#71717A] focus:border-[#7c3aed] dark:focus:border-[#C084FC] rounded-[8px]"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#A1A1AA] leading-relaxed pt-1">
                Enviaremos um link oficial de redefinição para o e-mail cadastrado.
              </p>
            </div>

            <div className="p-3 rounded-[8px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] text-xs flex items-center justify-between">
              <span className="text-slate-600 dark:text-[#A1A1AA]">
                Já recebeu o código por e-mail?
              </span>
              <button
                type="button"
                onClick={() => switchMode('reset-token')}
                className="text-[#7c3aed] dark:text-[#C084FC] hover:underline font-semibold"
              >
                Inserir token
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] shadow-md transition-all"
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

            <div className="pt-2 text-center text-xs">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Voltar para o login
              </button>
            </div>
          </form>
        )}

        {/* 4. MODO: RESET TOKEN */}
        {mode === 'reset-token' && (
          <form onSubmit={handleResetWithToken} className="space-y-3.5 relative z-10">
            <div className="space-y-1">
              <Label
                htmlFor="gate-reset-token-input"
                className="text-xs font-mono font-medium text-slate-600 dark:text-[#A1A1AA] uppercase tracking-wider"
              >
                Token de redefinição
              </Label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 dark:text-[#A1A1AA] absolute left-3 top-3.5" />
                <Input
                  id="gate-reset-token-input"
                  type="text"
                  required
                  placeholder="Cole aqui o token do e-mail"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="pl-9.5 h-11 text-xs font-mono bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#71717A] focus:border-[#7c3aed] dark:focus:border-[#C084FC] rounded-[8px]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="gate-reset-new-password"
                className="text-xs font-mono font-medium text-slate-600 dark:text-[#A1A1AA] uppercase tracking-wider"
              >
                Nova senha (mínimo 8 caracteres)
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-[#A1A1AA] absolute left-3 top-3.5" />
                <Input
                  id="gate-reset-new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9.5 pr-10 h-11 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#71717A] focus:border-[#7c3aed] dark:focus:border-[#C084FC] rounded-[8px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar nova senha' : 'Ver nova senha'}
                  className="absolute right-3 top-3 text-slate-400 dark:text-[#A1A1AA] hover:text-slate-700 dark:hover:text-white transition-colors p-0.5 rounded"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="gate-reset-confirm"
                className="text-xs font-mono font-medium text-slate-600 dark:text-[#A1A1AA] uppercase tracking-wider"
              >
                Confirmar nova senha
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-[#A1A1AA] absolute left-3 top-3.5" />
                <Input
                  id="gate-reset-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="pl-9.5 pr-10 h-11 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#71717A] focus:border-[#7c3aed] dark:focus:border-[#C084FC] rounded-[8px]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? 'Ocultar confirmação de nova senha'
                      : 'Ver confirmação de nova senha'
                  }
                  className="absolute right-3 top-3 text-slate-400 dark:text-[#A1A1AA] hover:text-slate-700 dark:hover:text-white transition-colors p-0.5 rounded"
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
              className="w-full min-h-[46px] gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] shadow-md transition-all"
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

            <div className="pt-2 text-center text-xs">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Voltar para o login
              </button>
            </div>
          </form>
        )}

        {/* Rodapé LGPD & Segurança Ética */}
        <div className="mt-6 pt-3 border-t border-slate-200 dark:border-[#27272A] text-[11px] text-slate-600 dark:text-[#A1A1AA] flex items-start gap-2 leading-relaxed relative z-10">
          <ShieldCheck className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC] shrink-0 mt-0.5" />
          <span>
            <strong>LGPD & Privacidade Ética:</strong> Acesso criptografado e seguro. Seus cálculos
            são protegidos e nenhum dado de pacientes é armazenado.
          </span>
        </div>
      </div>
    </div>
  )
}
export default AuthScreen
