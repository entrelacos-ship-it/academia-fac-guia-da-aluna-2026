/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import HubPage from './pages/HubPage'
import GuiaPage from './pages/GuiaPage'
import IkigaiPage from './pages/IkigaiPage'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import AuthScreen from './pages/AuthScreen'
import AdminDashboard from './pages/AdminDashboard'
import ProfileSettingsPage from './pages/ProfileSettingsPage'
import { useCloudSync } from './hooks/useCloudSync'
import { AlunaGuiaService } from './services/alunaGuiaService'

// Componente de proteção de rota: apenas usuárias autenticadas passam
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected } = useCloudSync()
  const location = useLocation()

  if (!isConnected) {
    // Redireciona para o login e memoriza de onde a usuária veio se não for a home
    const redirectUrl =
      location.pathname && location.pathname !== '/'
        ? `?redirect=${encodeURIComponent(location.pathname)}`
        : ''
    return <Navigate to={`/login${redirectUrl}`} replace />
  }

  return <>{children}</>
}

// Componente de proteção para APPs exclusivos de alunas (Calculadora, Meu IKIGAI)
// Exige conta conectada E (matrícula de aluna validada, usuário com verified ou perfil de admin)
const AlunaRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected, isAdmin, currentUser } = useCloudSync()
  const location = useLocation()

  if (!isConnected) {
    const redirectUrl =
      location.pathname && location.pathname !== '/'
        ? `?redirect=${encodeURIComponent(location.pathname)}`
        : ''
    return <Navigate to={`/login${redirectUrl}`} replace />
  }

  // Se for admin, sempre tem acesso de supervisão
  if (isAdmin) {
    return <>{children}</>
  }

  // Se a conta de usuária já estiver verificada (ex: após fluxo Já sou aluna)
  if (currentUser?.verified) {
    return <>{children}</>
  }

  // Verifica se possui sessão de aluna ativa no navegador (token de matrícula ativa)
  const aluna = AlunaGuiaService.getLocalSession()
  if (!aluna || aluna.status !== 'ativa') {
    // Redireciona acolhedoramente para o Hub inicial com flag para abrir o modal de validação
    const nomeRecurso = location.pathname.includes('ikigai') ? 'ikigai' : 'calculadora'
    return <Navigate to={`/?motivo=exclusivo_aluna&recurso=${nomeRecurso}`} replace />
  }

  return <>{children}</>
}

// Componente de proteção exclusiva para a rota /admin
const AdminRoute: React.FC = () => {
  const { isConnected, isAdmin } = useCloudSync()

  if (!isConnected) {
    return <Navigate to="/login?redirect=/admin" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <AdminDashboard />
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Rotas Públicas de Autenticação */}
      <Route path="/login" element={<AuthScreen initialMode="login" />} />
      <Route path="/entrar" element={<AuthScreen initialMode="login" />} />
      <Route path="/cadastro" element={<AuthScreen initialMode="signup" />} />
      <Route path="/cadastrar" element={<AuthScreen initialMode="signup" />} />
      <Route path="/esqueci-minha-senha" element={<AuthScreen initialMode="forgot" />} />
      <Route path="/recuperar-senha" element={<AuthScreen initialMode="forgot" />} />
      <Route path="/redefinir-senha" element={<AuthScreen initialMode="reset-token" />} />

      {/* 2. Área Administrativa Exclusiva */}
      <Route path="/admin" element={<AdminRoute />} />

      {/* 3. Rotas Protegidas do Sistema Principal (Hub da Academia, Calculadora e Guia) */}
      <Route element={<Layout />}>
        {/* Rota inicial: Hub da Academia */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HubPage />
            </ProtectedRoute>
          }
        />
        {/* Calculadora de Precificação FAC (Exclusiva para alunas da Academia) */}
        <Route
          path="/calculadora"
          element={
            <AlunaRoute>
              <Index />
            </AlunaRoute>
          }
        />
        {/* Guia da Aluna da Academia Método FAC (Acesso aberto para Aula 1 / validação para alunas) */}
        <Route path="/guia" element={<GuiaPage />} />
        {/* App Meu IKIGAI da Academia Método FAC (Exclusivo para alunas da Academia) */}
        <Route
          path="/ikigai"
          element={
            <AlunaRoute>
              <IkigaiPage />
            </AlunaRoute>
          }
        />
        <Route
          path="/ikigai/*"
          element={
            <AlunaRoute>
              <IkigaiPage />
            </AlunaRoute>
          }
        />
        {/* Configurações da Conta & Troca de Senha */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfileSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracoes"
          element={
            <ProtectedRoute>
              <ProfileSettingsPage />
            </ProtectedRoute>
          }
        />
        {/* ADD ALL CUSTOM ROUTES MUST BE ADDED HERE */}
      </Route>

      {/* 4. Fallback 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
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
