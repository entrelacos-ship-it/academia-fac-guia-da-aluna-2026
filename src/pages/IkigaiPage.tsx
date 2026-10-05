import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Compass,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Moon,
  Sun,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from 'lucide-react'
import { FACLogo } from '@/components/FACLogo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GlossaryModal } from '@/components/GlossaryModal'
import { CloudStatusIcon } from '@/components/CloudStatusIcon'
import { useCloudSync } from '@/hooks/useCloudSync'
import { IkigaiWorkflow } from '@/components/ikigai/IkigaiWorkflow'

const STORAGE_KEY_THEME = 'entrelacos_fac_theme_mode'

export const IkigaiPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, isConnected, isSyncing, logout } = useCloudSync()
  const [glossaryOpen, setGlossaryOpen] = useState(false)

  // Tema Astral
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#03000A] text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-200 astral-glow-bg">
      {/* Topbar Astral Integrada */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0A0A14]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#27272A] shadow-xs dark:shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center text-left group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC] rounded-[8px] p-1 transition-opacity hover:opacity-90"
              aria-label="Voltar ao Hub da Academia Entrelaços"
            >
              <FACLogo size="md" subtitle="Academia Entrelaços" />
            </Link>

            <span className="text-slate-300 dark:text-[#27272A] hidden sm:inline">|</span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="hidden sm:inline-flex gap-1.5 text-xs font-mono text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white h-8 px-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>HUB DA ACADEMIA</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Indicador Nuvem da Conta */}
            <div
              className="inline-flex items-center min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 px-2.5 py-1.5 border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-800 dark:text-white rounded-[8px] select-none"
              title={
                isSyncing
                  ? 'Sincronizando com a sua conta na nuvem...'
                  : isConnected
                    ? `Salvo na sua conta (${currentUser?.email || 'Conectada'})`
                    : 'Desconectada da nuvem'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSyncing
                    ? 'bg-[#ea580c] dark:bg-[#FB923C] animate-ping'
                    : isConnected
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                }`}
              />
              <CloudStatusIcon
                status={isSyncing ? 'syncing' : isConnected ? 'connected' : 'disconnected'}
                size={16}
                strokeWidth={1.75}
                className="text-[#7c3aed] dark:text-[#C084FC]"
              />
              <span className="hidden sm:inline font-mono text-xs font-semibold">
                {isSyncing ? 'Sincronizando' : 'Salvo na Conta'}
              </span>
            </div>

            {/* Atalho Perfil e Senha */}
            <Link
              to="/perfil"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-xs font-mono font-semibold bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/50 transition-colors"
              title="Acessar Perfil e Alterar Senha"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
              <span className="hidden sm:inline">PERFIL & SENHA</span>
            </Link>

            {/* Glossário */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGlossaryOpen(true)}
              className="min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f23] rounded-[8px]"
              aria-label="Abrir Glossário"
            >
              <BookOpen className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              <span className="hidden sm:inline font-mono text-xs font-semibold">GLOSSÁRIO</span>
            </Button>

            {/* Tema */}
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

            {/* Sair */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout()
                window.location.href = '/login'
              }}
              className="min-h-[44px] sm:min-h-0 sm:h-9 text-xs font-mono font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1 px-2.5 hidden md:inline-flex rounded-[8px]"
              title="Encerrar sessão"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>SAIR</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal do Fluxo IKIGAI */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <IkigaiWorkflow />
      </main>

      {/* Rodapé Astral */}
      <footer className="border-t border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] py-4 px-4 text-center text-xs text-slate-600 dark:text-[#A1A1AA] print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px]">
          <p className="text-slate-800 dark:text-white font-medium">
            Entrelaços Psicologia, Academia & Método FAC · Astral System © 2026
          </p>
          <p className="text-slate-400 dark:text-[#71717A]">
            Ferramenta pedagógica do Encontro 2. Dados sincronizados com a nuvem da sua conta.
          </p>
        </div>
      </footer>

      <GlossaryModal isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  )
}

export default IkigaiPage
