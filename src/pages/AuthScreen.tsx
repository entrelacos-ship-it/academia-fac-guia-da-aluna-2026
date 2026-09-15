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
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#080C16] text-white relative overflow-hidden select-none">
      {/* Background radial effects Editorial Elegance */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#5B3A8E]/30 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#16746E]/25 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#482B75]/15 blur-[150px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Grid Pattern Subtil */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Cartão Central Glassmorphism */}
      <div className="relative w-full max-w-[430px] rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-2xl bg-[#0F111E]/90 border border-white/10 shadow-[0_25px_60px_-15px_rgba(91,58,142,0.4)] z-10 transition-all">
        {/* Glow de Borda Interior */}
        <div
          className="absolute -top-24 -left-24 w-52 h-52 rounded-full bg-[#5B3A8E]/35 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -right-24 w-52 h-52 rounded-full bg-[#16746E]/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Cabeçalho Visual com Monograma FAC Entrelaços */}
        <div className="flex flex-col items-center text-center mb-6 relative z-10">
          <div className="relative mb-3 group cursor-default">
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#5B3A8E] to-[#16746E] blur-md opacity-75 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5B3A8E] via-[#482B75] to-[#25173E] border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Heart className="w-7 h-7 fill-white/25 stroke-[2.2] text-white" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold uppercase tracking-wider text-purple-300 mb-2">
            <span>Método FAC</span>
            <span className="text-white/40">•</span>
            <span>Entrelaços</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {mode === 'login' && 'Entrar no Sistema'}
            {mode === 'signup' && 'Criar Conta FAC'}
            {mode === 'forgot' && 'Recuperar Acesso'}
            {mode === 'reset-token' && 'Definir Nova Senha'}
          </h1>

          <p className="text-xs sm:text-[13px] text-slate-300/80 mt-1.5 max-w-[310px] leading-relaxed">
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
          <form onSubmit={handleLogin} className="space-y-3.5 relative z-10">
            <div className="space-y-1.5">
              <Label htmlFor="gate-login-email" className="text-xs font-medium text-slate-300">
                E-mail de acesso
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <Input
                  id="gate-login-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9.5 h-11 text-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#5B3A8E] focus:ring-[#5B3A8E] rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="gate-login-password" className="text-xs font-medium text-slate-300">
                  Senha
                </Label>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-xs text-purple-300 hover:text-purple-200 transition-colors underline-offset-4 hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <Input
                  id="gate-login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9.5 pr-10 h-11 text-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#5B3A8E] focus:ring-[#5B3A8E] rounded-xl"
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

            {/* Lembrar e-mail */}
            <div className="flex items-center space-x-2 pt-0.5">
              <Checkbox
                id="gate-remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                className="border-white/20 data-[state=checked]:bg-[#5B3A8E] data-[state=checked]:border-[#5B3A8E]"
              />
              <label
                htmlFor="gate-remember-me"
                className="text-xs text-slate-300 cursor-pointer select-none"
              >
                Lembrar meu e-mail neste navegador
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] gap-2 bg-gradient-to-r from-[#5B3A8E] to-[#452A6F] hover:from-[#6B46A3] hover:to-[#503282] text-white font-medium rounded-xl shadow-lg shadow-purple-950/50 mt-1 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando no sistema...
                </>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <div className="pt-3 text-center text-xs text-slate-400 border-t border-white/10 mt-3">
              Primeiro acesso?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="text-purple-300 hover:text-purple-200 font-semibold underline-offset-4 hover:underline"
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
              <Label htmlFor="gate-signup-name" className="text-xs font-medium text-slate-300">
                Nome completo ou como prefere ser chamada
              </Label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <Input
                  id="gate-signup-name"
                  type="text"
                  placeholder="Ex: Dra. Mariana Costa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9.5 h-10.5 text-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#5B3A8E] focus:ring-[#5B3A8E] rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="gate-signup-email" className="text-xs font-medium text-slate-300">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <Input
                  id="gate-signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9.5 h-10.5 text-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#5B3A8E] focus:ring-[#5B3A8E] rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="gate-signup-password" className="text-xs font-medium text-slate-300">
                Senha (mínimo de 8 caracteres)
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <Input
                  id="gate-signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9.5 pr-10 h-10.5 text-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#5B3A8E] focus:ring-[#5B3A8E] rounded-xl"
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
                htmlFor="gate-signup-password-confirm"
                className="text-xs font-medium text-slate-300"
              >
                Confirmar senha
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <Input
                  id="gate-signup-password-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="pl-9.5 pr-10 h-10.5 text-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#5B3A8E] focus:ring-[#5B3A8E] rounded-xl"
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
              className="w-full min-h-[46px] gap-2 bg-gradient-to-r from-[#16746E] to-[#0f5450] hover:from-[#1b8c85] hover:to-[#16746E] text-white font-medium rounded-xl shadow-lg shadow-teal-950/40 mt-1 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando sua conta...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Cadastrar e Acessar Sistema</span>
                </>
              )}
            </Button>

            <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/10 mt-2">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-purple-300 hover:text-purple-200 font-semibold underline-offset-4 hover:underline"
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
              <Label htmlFor="gate-forgot-email" className="text-xs font-medium text-slate-300">
                E-mail cadastrado
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <Input
                  id="gate-forgot-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9.5 h-11 text-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#5B3A8E] focus:ring-[#5B3A8E] rounded-xl"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Enviaremos um link oficial de redefinição para o e-mail cadastrado.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center justify-between">
              <span className="text-slate-300">Já recebeu o código por e-mail?</span>
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
              className="w-full min-h-[46px] gap-2 bg-[#5B3A8E] hover:bg-[#4d3079] text-white font-medium rounded-xl shadow-lg transition-all"
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

        {/* 4. MODO: RESET TOKEN */}
        {mode === 'reset-token' && (
          <form onSubmit={handleResetWithToken} className="space-y-3.5 relative z-10">
            <div className="space-y-1">
              <Label
                htmlFor="gate-reset-token-input"
                className="text-xs font-medium text-slate-300"
              >
                Token de redefinição
              </Label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <Input
                  id="gate-reset-token-input"
                  type="text"
                  required
                  placeholder="Cole aqui o token do e-mail"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="pl-9.5 h-11 text-xs font-mono bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#5B3A8E] focus:ring-[#5B3A8E] rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="gate-reset-new-password"
                className="text-xs font-medium text-slate-300"
              >
                Nova senha (mínimo 8 caracteres)
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <Input
                  id="gate-reset-new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9.5 pr-10 h-11 text-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#5B3A8E] focus:ring-[#5B3A8E] rounded-xl"
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
              <Label htmlFor="gate-reset-confirm" className="text-xs font-medium text-slate-300">
                Confirmar nova senha
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <Input
                  id="gate-reset-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="pl-9.5 pr-10 h-11 text-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#5B3A8E] focus:ring-[#5B3A8E] rounded-xl"
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
              className="w-full min-h-[46px] gap-2 bg-[#5B3A8E] hover:bg-[#4d3079] text-white font-medium rounded-xl shadow-lg transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
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
                className="text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Voltar para o login
              </button>
            </div>
          </form>
        )}

        {/* Rodapé LGPD & Segurança Ética */}
        <div className="mt-6 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-start gap-2 leading-relaxed relative z-10">
          <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
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
