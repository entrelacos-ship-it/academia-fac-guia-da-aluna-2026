/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import { AuthModal, AuthMode } from '@/components/AuthModal'

// ONLY IMPORT AND RENDER WORKING PAGES, NEVER ADD PLACEHOLDER COMPONENTS OR PAGES IN THIS FILE
// AVOID REMOVING ANY CONTEXT PROVIDERS FROM THIS FILE (e.g. TooltipProvider, Toaster, Sonner)

const AppRoutes = () => {
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('login')

  // Detecta se a rota atual é /login, /cadastro ou se veio com ?token= de recuperação
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase()
      const search = window.location.search
      const params = new URLSearchParams(search)

      if (params.get('token')) {
        setAuthMode('reset-token')
        setAuthOpen(true)
      } else if (path === '/login' || path === '/entrar') {
        setAuthMode('login')
        setAuthOpen(true)
      } else if (path === '/cadastro' || path === '/cadastrar') {
        setAuthMode('signup')
        setAuthOpen(true)
      } else if (path === '/esqueci-minha-senha' || path === '/recuperar-senha') {
        setAuthMode('forgot')
        setAuthOpen(true)
      }
    }
  }, [])

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Index />} />
          <Route path="/entrar" element={<Index />} />
          <Route path="/cadastro" element={<Index />} />
          <Route path="/cadastrar" element={<Index />} />
          <Route path="/esqueci-minha-senha" element={<Index />} />
          <Route path="/redefinir-senha" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES MUST BE ADDED HERE */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      <AuthModal
        isOpen={authOpen}
        onClose={() => {
          setAuthOpen(false)
          // Se o usuário entrou por uma rota explícita de login/cadastro, normaliza a URL
          if (
            typeof window !== 'undefined' &&
            window.history?.replaceState &&
            window.location.pathname !== '/'
          ) {
            window.history.replaceState({}, document.title, '/')
          }
        }}
        initialMode={authMode}
      />
    </>
  )
}

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppRoutes />
    </TooltipProvider>
  </BrowserRouter>
)

export default App
