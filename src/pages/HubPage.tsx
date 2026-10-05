import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calculator,
  Compass,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  Lock,
  Moon,
  Sun,
  LogOut,
  Shield,
  Layers,
  HeartHandshake,
  ExternalLink,
} from 'lucide-react'
import { FACLogo } from '@/components/FACLogo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GlossaryModal } from '@/components/GlossaryModal'
import { CloudStatusIcon } from '@/components/CloudStatusIcon'
import { useCloudSync } from '@/hooks/useCloudSync'

const STORAGE_KEY_THEME = 'entrelacos_fac_theme_mode'

export const HubPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, isConnected, isSyncing, logout } = useCloudSync()
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
              aria-label="Página inicial da Academia Entrelaços"
            >
              <FACLogo size="md" subtitle="Academia Entrelaços" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Indicador Nuvem */}
            <div
              className="inline-flex items-center min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 px-2.5 py-1.5 border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-800 dark:text-white rounded-[8px] select-none"
              title={
                isSyncing
                  ? 'Sincronizando com a nuvem...'
                  : isConnected
                    ? `Nuvem conectada (${currentUser?.email || 'Conectada'})`
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
                {isSyncing ? 'Sincronizando' : 'Nuvem'}
              </span>
            </div>

            {/* Identificação de Usuária */}
            <div
              className="hidden xl:flex flex-col text-right pl-2 pr-1 border-l border-slate-200 dark:border-[#27272A] max-w-[160px]"
              title={`Usuária logada: ${currentUser?.email}`}
            >
              <span className="text-xs font-medium text-slate-900 dark:text-white truncate">
                {currentUser?.name || 'Psicóloga'}
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-[#A1A1AA] truncate -mt-0.5">
                {currentUser?.email}
              </span>
            </div>

            {currentUser?.role === 'admin' && (
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

      {/* Conteúdo Principal do Hub */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Hero do Hub */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-xs font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
            <span>ACADEMIA ENTRELAÇOS</span>
            <span className="text-slate-400 dark:text-[#71717A]">•</span>
            <span className="text-slate-600 dark:text-[#A1A1AA]">APLICAÇÕES & RECURSOS</span>
          </div>

          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Sua jornada integrada na{' '}
            <span className="text-[#7c3aed] dark:text-[#C084FC]">Academia FAC</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
            A Calculadora é um dos recursos que disponibilizamos para nossa academia. Aqui você
            encontra todas as frentes da sua formação, autoria profissional e sustentabilidade
            clínica.
          </p>
        </div>

        {/* Grid dos Cards de Aplicações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 0: Guia da Aluna da Academia Método FAC (Novo Destaque) */}
          <div className="astral-card-interactive p-6 flex flex-col justify-between group relative overflow-hidden border-purple-300/80 dark:border-[#7c3aed]/50 bg-gradient-to-b from-purple-50/40 to-transparent dark:from-purple-950/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-[10px] bg-purple-100/80 dark:bg-[#0A0A14] border border-purple-300 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center shadow-xs group-hover:border-[#7c3aed] transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold uppercase tracking-wider">
                  Aula 1 Aberta · 19 Encontros
                </Badge>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
                  Percurso Pedagógico
                </span>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
                  Guia da Aluna FAC
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] mt-2 leading-relaxed">
                  Aula Magna aberta com o novo Diagnóstico FAC Aprofundado (24 perguntas), índice
                  dos 19 encontros, cadernos didáticos e validação do e-mail de compra para alunas.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-500 dark:text-[#71717A]">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#121216]">
                  Diagnóstico v2
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#121216]">
                  PDF 1 página
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#121216]">
                  Acesso seguro
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#27272A]/80">
              <Button
                onClick={() => navigate('/guia')}
                className="w-full gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] min-h-[44px] cursor-pointer"
              >
                <span>Acessar Guia da Aluna</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Card A: Calculadora de Precificação FAC (Disponível) */}
          <div className="astral-card-interactive p-6 flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-[10px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center shadow-xs group-hover:border-[#7c3aed]/50 transition-colors">
                  <Calculator className="w-5 h-5" />
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold uppercase tracking-wider">
                  Disponível
                </Badge>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
                  Sustentabilidade Clínica
                </span>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
                  Calculadora de Precificação FAC
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] mt-2 leading-relaxed">
                  Calcule seu piso ético por sessão a partir do custo real de vida, pró-labore
                  justo, tributos e capacidade clínica. Inclui Central de Resultados, cenários e
                  planejamento.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-500 dark:text-[#71717A]">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#121216]">
                  8 passos guiados
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#121216]">
                  Markup divisor
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#121216]">
                  Simulador fiscal
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#27272A]/80">
              <Button
                onClick={() => navigate('/calculadora')}
                className="w-full gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] min-h-[44px] cursor-pointer"
              >
                <span>Acessar Calculadora</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Card B: Retrato de Autoria (Disponível - Nova Seção do Guia) */}
          <div className="astral-card-interactive p-6 flex flex-col justify-between group relative overflow-hidden border-purple-200/60 dark:border-[#7c3aed]/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-[10px] bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A] text-[#ea580c] dark:text-[#FB923C] flex items-center justify-center shadow-xs group-hover:border-[#ea580c]/50 transition-colors">
                  <Compass className="w-5 h-5" />
                </div>
                <Badge className="bg-[#7c3aed]/15 text-[#7c3aed] dark:text-[#C084FC] border border-[#7c3aed]/30 text-[10px] font-mono font-semibold uppercase tracking-wider">
                  Ciclo FAC · Entrega 1
                </Badge>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] block mb-1">
                  Identidade Profissional
                </span>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight group-hover:text-[#ea580c] dark:group-hover:text-[#FB923C] transition-colors">
                  Retrato de Autoria
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] mt-2 leading-relaxed">
                  Primeira entrega do Ciclo FAC. Conduz uma entrevista profunda em conversa com a
                  aluna para revelar padrão central, dom profissional, coerência e sinais de nicho.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-500 dark:text-[#71717A]">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#121216]">
                  Encontros 1 & 2
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#121216]">
                  Skill Claude / ChatGPT
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#121216]">
                  Bloco de contexto
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#27272A]/80">
              <Button
                onClick={() => navigate('/guia/retrato-de-autoria')}
                className="w-full gap-2 bg-[#ea580c] hover:bg-[#c2410c] dark:bg-[#FB923C] dark:hover:bg-[#f97316] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] min-h-[44px] cursor-pointer"
              >
                <span>Ver Guia da Skill</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Card C: Meu IKIGAI da Psicóloga (Disponível - Encontro 2 da Academia) */}
          <div className="astral-card-interactive p-6 flex flex-col justify-between group relative overflow-hidden border-purple-200 dark:border-[#7c3aed]/40">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-[10px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center shadow-xs group-hover:border-[#7c3aed]/50 transition-colors">
                  <Compass className="w-5 h-5" />
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold uppercase tracking-wider">
                  Encontro 2 · Disponível
                </Badge>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
                  Propósito & Autoria Clínica
                </span>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight group-hover:text-[#7c3aed] dark:group-hover:text-[#C084FC] transition-colors">
                  Meu IKIGAI Clínico
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] mt-2 leading-relaxed">
                  Construa seu painel dos 4 círculos, descubra os vazios e gere sua declaração de
                  missão em até duas frases. Salvo na nuvem da sua conta com exportação para IA, PNG
                  e PDF.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-500 dark:text-[#71717A]">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#121216]">
                  4 círculos
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#121216]">
                  Diagnóstico dos vazios
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#121216]">
                  Exportação PNG / PDF
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#27272A]/80">
              <Button
                onClick={() => navigate('/ikigai')}
                className="w-full gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] min-h-[44px] cursor-pointer"
              >
                <span>Acessar Meu IKIGAI</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bloco Adicional de Contexto da Academia: Guia da Aluna & Retrato de Autoria */}
        <div className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <BookOpen className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                Percurso Pedagógico Integrado
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
              Conheça as entregas e cadernos didáticos do Ciclo FAC
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] max-w-2xl leading-relaxed">
              Acesse o Guia da Aluna com a Aula Magna aberta, o Diagnóstico FAC Aprofundado versão 2
              e o passo a passo da skill Retrato de Autoria para Claude e ChatGPT.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
            <Button
              onClick={() => navigate('/guia')}
              className="w-full sm:w-auto min-h-[44px] px-5 gap-2 bg-[#7c3aed] text-white hover:bg-[#6d28d9] font-mono text-xs font-semibold rounded-[8px] shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>ABRIR GUIA DA ALUNA</span>
            </Button>
            <Button
              onClick={() => navigate('/guia/retrato-de-autoria')}
              variant="outline"
              className="w-full sm:w-auto min-h-[44px] px-4 gap-2 border-slate-300 dark:border-[#27272A] font-mono text-xs rounded-[8px] shrink-0"
            >
              <Compass className="w-4 h-4 text-[#ea580c]" />
              <span>SKILL AUTORIA</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer Astral */}
      <footer className="border-t border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] py-4 px-4 text-center text-xs text-slate-600 dark:text-[#A1A1AA] print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px]">
          <p className="text-slate-800 dark:text-white font-medium">
            Entrelaços Psicologia — Academia & Método FAC · Astral System © 2026
          </p>
          <p className="text-slate-400 dark:text-[#71717A]">
            Plataforma pedagógica exclusiva para alunas da Academia.
          </p>
        </div>
      </footer>

      <GlossaryModal isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  )
}
export default HubPage
