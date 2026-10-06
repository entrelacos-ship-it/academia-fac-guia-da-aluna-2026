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
import { useCloudSync } from '@/hooks/useCloudSync'
import { IkigaiWorkflow } from '@/components/ikigai/IkigaiWorkflow'

const STORAGE_KEY_THEME = 'entrelacos_fac_theme_mode'

export const IkigaiPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, logout } = useCloudSync()
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
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200 overflow-x-hidden">
      {/* Topbar Editorial */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/70 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              className="flex items-center text-left group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC] rounded-lg p-1 transition-opacity hover:opacity-90"
              aria-label="Voltar ao Hub da Academia Entrelaços"
            >
              <FACLogo size="md" subtitle="Academia Entrelaços" />
            </Link>

            <span className="text-border hidden sm:inline">|</span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="hidden sm:inline-flex gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground h-8 px-2 rounded-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Hub da Academia</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Atalho Perfil e Senha */}
            <Link
              to="/perfil"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-purple-500/10 text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-500/20 transition-colors"
              title="Acessar Perfil e Alterar Senha"
              aria-label="Acessar Perfil e Alterar Senha"
            >
              <KeyRound className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
              <span className="hidden sm:inline">Perfil & Senha</span>
            </Link>

            {/* Glossário */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGlossaryOpen(true)}
              className="h-8 px-2.5 gap-1.5 border-border bg-background text-foreground hover:bg-muted/40 rounded-lg text-xs font-mono"
              aria-label="Abrir Glossário"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC]" />
              <span className="hidden sm:inline">Glossário</span>
            </Button>

            {/* Tema */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
              aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
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
              className="h-8 text-xs font-mono text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 gap-1 px-2.5 hidden md:inline-flex rounded-lg"
              title="Encerrar sessão"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal do Fluxo IKIGAI */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <IkigaiWorkflow />
      </main>

      {/* Rodapé Editorial */}
      <footer className="border-t border-border/70 bg-background/50 py-5 px-4 text-center text-xs text-muted-foreground print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px]">
          <p className="text-foreground font-light">Entrelaços Psicologia · Academia FAC</p>
          <p className="text-muted-foreground/70">
            Ferramenta pedagógica do Encontro 2. Dados sincronizados com a nuvem da sua conta.
          </p>
        </div>
      </footer>

      <GlossaryModal isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  )
}

export default IkigaiPage
