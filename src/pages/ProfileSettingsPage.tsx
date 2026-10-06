import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Lock,
  KeyRound,
  Shield,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  Mail,
  Calendar,
  Clock,
  Loader2,
} from 'lucide-react'
import { FACLogo } from '@/components/FACLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCloudSync } from '@/hooks/useCloudSync'
import { AlunaGuiaService } from '@/services/alunaGuiaService'

const STORAGE_KEY_THEME = 'entrelacos_fac_theme_mode'

export const ProfileSettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, isConnected, isAdmin, logout, changePassword } = useCloudSync()

  // Sessão da aluna
  const [alunaSession] = useState(() => AlunaGuiaService.getLocalSession())

  // Formulário de troca de senha
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Tema
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME)
      if (saved === 'light' || saved === 'dark') return saved
    } catch {
      // ignore
    }
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme)
    } catch {
      // ignore
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!oldPassword.trim()) {
      setErrorMessage('Informe a senha atual cadastrada.')
      return
    }

    if (newPassword.length < 8) {
      setErrorMessage('A nova senha deve possuir pelo menos 8 caracteres.')
      return
    }

    if (newPassword !== newPasswordConfirm) {
      setErrorMessage('A confirmação da nova senha não confere.')
      return
    }

    if (newPassword === oldPassword) {
      setErrorMessage('A nova senha não pode ser idêntica à senha atual.')
      return
    }

    setIsSubmitting(true)
    try {
      const ok = await changePassword(oldPassword, newPassword, newPasswordConfirm)
      if (ok) {
        setSuccessMessage(
          'Senha atualizada com sucesso! Suas próximas conexões devem usar a nova senha.',
        )
        setOldPassword('')
        setNewPassword('')
        setNewPasswordConfirm('')
      } else {
        setErrorMessage(
          'Não foi possível alterar sua senha. Verifique se a senha atual está correta.',
        )
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar alteração de senha.'
      setErrorMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '-'
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
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      {/* Topbar Fixa */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/70 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center text-left group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC] rounded-lg p-1 transition-opacity hover:opacity-90"
              aria-label="Voltar para a página inicial da Academia Entrelaços"
            >
              <FACLogo size="md" subtitle="Academia Entrelaços" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f23] rounded-[8px] text-xs font-mono font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              <span className="hidden sm:inline">HUB DA ACADEMIA</span>
            </Button>

            {isAdmin && (
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-xs font-mono font-semibold bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/50 transition-colors"
                title="Painel de Administração FAC"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
                <span className="hidden sm:inline">ADMIN</span>
              </a>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#18181B] rounded-[8px]"
              aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-[#FB923C]" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout()
                window.location.href = '/login'
              }}
              className="min-h-[44px] sm:min-h-0 sm:h-9 text-xs font-mono font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1 px-2.5 hidden md:inline-flex rounded-[8px]"
              title="Encerrar sessão e voltar ao login"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>SAIR</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Cabeçalho da Página Editorial */}
        <div className="border-b border-border/70 pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-medium text-[#7c3aed] dark:text-[#C084FC] uppercase tracking-wider">
              Configurações da Conta
            </span>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <span className="text-xs font-mono text-muted-foreground">Perfil & Segurança</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-foreground">
            Meu Perfil & Segurança
          </h1>
          <p className="text-sm text-muted-foreground font-light max-w-2xl">
            Gerencie as credenciais da sua conta, consulte sua identificação na Academia Método FAC
            e altere sua senha no primeiro acesso ou sempre que necessário.
          </p>
        </div>

        {/* Banner de Administradora (se aplicável) */}
        {isAdmin && (
          <div className="p-4 sm:p-5 rounded-[16px] bg-gradient-to-r from-purple-50 via-purple-100/50 to-orange-50/50 dark:from-purple-950/40 dark:via-[#18181B] dark:to-orange-950/20 border border-purple-200 dark:border-[#7c3aed]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#7c3aed] text-white flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-[#FB923C]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-sans font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                    Perfil com Privilégios de Administradora
                  </h3>
                  <Badge className="bg-[#7c3aed] text-white text-[10px] font-mono">ADMIN</Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#A1A1AA] mt-0.5">
                  Você possui acesso de supervisão completa a matrículas, encontros e auditoria da
                  Academia.
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/admin')}
              className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-mono text-xs rounded-[8px] gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FB923C]" />
              <span>Abrir Painel Administrativo</span>
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Card Esquerdo: Dados da Conta */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px] shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                  <span>Identificação da Conta</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Dados de registro vinculados ao seu login na nuvem.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-500 dark:text-[#71717A] block mb-1">
                    Nome
                  </label>
                  <div className="p-3 rounded-[8px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] text-sm font-medium text-slate-900 dark:text-white">
                    {currentUser?.name || 'Psicóloga / Aluna'}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-500 dark:text-[#71717A] block mb-1">
                    E-mail de Acesso (Não editável)
                  </label>
                  <div className="p-3 rounded-[8px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] text-xs font-mono text-slate-700 dark:text-[#A1A1AA] flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{currentUser?.email || 'Não informado'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-[#71717A] mt-1">
                    O e-mail é a chave única da conta para sincronização dos cálculos e histórico.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-500 dark:text-[#71717A] block mb-1">
                      Papel
                    </label>
                    <div className="p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] text-xs font-mono capitalize">
                      {currentUser?.role === 'admin' ? 'Administradora' : 'Usuária / Aluna'}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-500 dark:text-[#71717A] block mb-1">
                      Status da Conta
                    </label>
                    <div className="p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Ativa</span>
                    </div>
                  </div>
                </div>

                {/* Vínculo de Aluna do Guia */}
                {alunaSession && alunaSession.status === 'ativa' && (
                  <div className="p-3.5 rounded-[10px] bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Matrícula do Guia Validada</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-[#A1A1AA]">
                      E-mail de compra: <strong className="font-mono">{alunaSession.email}</strong>
                      <br />
                      Ciclo: <span className="font-mono">{alunaSession.ciclo}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card Dica Primeiro Acesso */}
            <Card className="bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20 dark:to-transparent border-purple-200 dark:border-[#27272A] rounded-[16px]">
              <CardContent className="p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#7c3aed] dark:text-[#C084FC]">
                  <Sparkles className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
                  <span className="font-mono text-xs font-bold uppercase">Primeiro Acesso?</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                  Se você recebeu uma senha provisória da Entrelaços, recomendamos alterá-la para
                  uma senha pessoal forte e exclusiva com no mínimo 8 caracteres.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Card Direito: Troca de Senha */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px] shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                  <span>Alteração de Senha</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Atualize sua senha de acesso. A alteração passa a valer imediatamente na sua conta
                  do Skip Cloud.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mensagens de Feedback */}
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-[10px] bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-500/40 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <span className="flex-1 font-medium">{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-3 rounded-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-500/40 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="flex-1 font-medium">{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  {/* Senha Atual */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="profile-old-password"
                      className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                    >
                      Senha Atual*
                    </Label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <Input
                        id="profile-old-password"
                        type={showOldPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        placeholder="Digite sua senha atual"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="pl-9 pr-10 h-10 text-xs bg-slate-50 dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] rounded-[8px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        aria-label={showOldPassword ? 'Ocultar senha' : 'Ver senha'}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      >
                        {showOldPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Nova Senha */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="profile-new-password"
                      className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                    >
                      Nova Senha (Mínimo 8 caracteres)*
                    </Label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <Input
                        id="profile-new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        placeholder="Nova senha pessoal (8+ caracteres)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-9 pr-10 h-10 text-xs bg-slate-50 dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] rounded-[8px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? 'Ocultar senha' : 'Ver senha'}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirmação Nova Senha */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="profile-confirm-password"
                      className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                    >
                      Confirmar Nova Senha*
                    </Label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <Input
                        id="profile-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        placeholder="Repita a nova senha exatamente igual"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        className="pl-9 pr-10 h-10 text-xs bg-slate-50 dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] rounded-[8px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Ocultar senha' : 'Ver senha'}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Checklist visual de regras */}
                  <div className="p-3 rounded-[8px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] space-y-1 text-[11px] font-mono">
                    <div
                      className={`flex items-center gap-1.5 ${
                        newPassword.length >= 8
                          ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>Pelo menos 8 caracteres ({newPassword.length}/8)</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 ${
                        newPasswordConfirm.length > 0 && newPassword === newPasswordConfirm
                          ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>Confirmação idêntica à nova senha</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[44px] bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold font-mono text-xs rounded-[8px] gap-2 shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Atualizando senha na nuvem...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Salvar Nova Senha</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="border-t border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] py-4 px-4 text-center text-xs text-slate-600 dark:text-[#A1A1AA] print:hidden mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px]">
          <p className="text-slate-800 dark:text-white font-medium">
            Entrelaços Psicologia · Academia Método FAC © 2026
          </p>
          <p className="text-slate-400 dark:text-[#71717A]">
            Proteção e integridade de credenciais no Skip Cloud.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default ProfileSettingsPage
