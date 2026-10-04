import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Compass,
  ArrowLeft,
  Moon,
  Sun,
  BookOpen,
  Sparkles,
  LogOut,
  Layers,
  ChevronRight,
  Calculator,
} from 'lucide-react'
import { FACLogo } from '@/components/FACLogo'
import { Button } from '@/components/ui/button'
import { RetratoDeAutoriaSection } from '@/components/RetratoDeAutoriaSection'
import { GlossaryModal } from '@/components/GlossaryModal'
import { useCloudSync } from '@/hooks/useCloudSync'

const STORAGE_KEY_THEME = 'entrelacos_fac_theme_mode'

export const GuiaPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, logout } = useCloudSync()
  const [glossaryOpen, setGlossaryOpen] = useState(false)

  // Tema Astral Claro/Escuro (persistido em localStorage)
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
      {/* Topbar Fixa Astral */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0A0A14]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#27272A] shadow-xs dark:shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center text-left group focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC] rounded-[8px] p-1 transition-opacity hover:opacity-90"
              aria-label="Voltar para a página inicial da Academia"
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/calculadora')}
              className="min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f23] rounded-[8px] text-xs font-mono font-semibold"
            >
              <Calculator className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              <span className="hidden sm:inline">CALCULADORA</span>
            </Button>

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

      {/* Breadcrumb e sub-navegação */}
      <div className="border-b border-slate-200 dark:border-[#27272A] bg-white/60 dark:bg-[#0A0A14]/60 backdrop-blur-xs py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#A1A1AA]">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Academia
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#7c3aed] dark:text-[#C084FC] font-semibold">
              Guia Metodológico · Retrato de Autoria
            </span>
          </div>

          <span className="hidden sm:inline-block text-slate-500 dark:text-[#71717A]">
            {currentUser?.email}
          </span>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <RetratoDeAutoriaSection />
      </main>

      {/* Footer Astral */}
      <footer className="border-t border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] py-4 px-4 text-center text-xs text-slate-600 dark:text-[#A1A1AA] print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px]">
          <p className="text-slate-800 dark:text-white font-medium">
            Entrelaços Psicologia — Academia & Método FAC · Astral System © 2026
          </p>
          <p className="text-slate-400 dark:text-[#71717A]">
            Materiais pedagógicos de autoria e precificação para psicólogas.
          </p>
        </div>
      </footer>

      <GlossaryModal isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  )
}
export default GuiaPage
