import React, { useState, useEffect, useMemo } from 'react'
import {
  Users,
  Shield,
  Database,
  ArrowLeft,
  RefreshCw,
  Search,
  CheckCircle2,
  Calendar,
  Mail,
  UserCheck,
  ShieldAlert,
  HardDrive,
  Loader2,
  Download,
  UserX,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useCloudSync } from '@/hooks/useCloudSync'
import pb from '@/lib/pocketbase/client'
import { getErrorMessage } from '@/lib/pocketbase/errors'

export interface UserRecord {
  id: string
  name?: string
  email: string
  role?: string
  created: string
  updated: string
  verified?: boolean
  is_active?: boolean
}

interface BackupStat {
  totalBackups: number
  uniqueUsersWithBackup: number
  latestBackupDate: string | null
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, isConnected, isAdmin, logout } = useCloudSync()

  const [users, setUsers] = useState<UserRecord[]>([])
  const [backupStat, setBackupStat] = useState<BackupStat>({
    totalBackups: 0,
    uniqueUsersWithBackup: 0,
    latestBackupDate: null,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successActionMessage, setSuccessActionMessage] = useState<string | null>(null)

  // Gerenciamento de desativação / reativação com confirmação
  const [targetUser, setTargetUser] = useState<UserRecord | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const loadAdminData = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      // 1. Listar usuários da coleção users
      const usersList = await pb.collection('users').getFullList<UserRecord>({
        sort: '-created',
      })
      setUsers(usersList)

      // 2. Coletar estatísticas da coleção fac_backups
      try {
        const backupsList = await pb.collection('fac_backups').getFullList({
          sort: '-updated',
          fields: 'id,user_id,updated',
        })
        const uniqueUsers = new Set(
          backupsList.map((b) => (b as { user_id?: string }).user_id).filter(Boolean),
        )
        setBackupStat({
          totalBackups: backupsList.length,
          uniqueUsersWithBackup: uniqueUsers.size,
          latestBackupDate: backupsList[0]?.updated || null,
        })
      } catch (backupErr) {
        console.warn('Não foi possível carregar estatísticas de backup:', backupErr)
      }
    } catch (err) {
      console.error('Erro ao carregar dados do admin:', err)
      setErrorMessage(
        'Não foi possível carregar a lista de usuárias. Verifique se sua conta possui permissão de Administrador.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && isAdmin) {
      loadAdminData()
    }
  }, [isConnected, isAdmin])

  // Alternar status ativo / inativo no backend (PocketBase)
  const handleToggleUserStatus = async () => {
    if (!targetUser) return
    setIsUpdatingStatus(true)
    setErrorMessage(null)
    setSuccessActionMessage(null)

    const newStatus = targetUser.is_active === false ? true : false
    try {
      await pb.collection('users').update(targetUser.id, {
        is_active: newStatus,
      })

      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, is_active: newStatus } : u)),
      )

      setSuccessActionMessage(
        newStatus
          ? `Conta de ${targetUser.name || targetUser.email} foi reativada com sucesso.`
          : `Conta de ${targetUser.name || targetUser.email} foi desativada. O acesso foi revogado.`,
      )
      setTargetUser(null)
    } catch (err) {
      console.error('Erro ao alterar status da conta:', err)
      setErrorMessage(
        `Erro ao alterar status: ${getErrorMessage(err) || 'Verifique as permissões de admin.'}`,
      )
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Métricas de uso da calculadora agregadas
  const metrics = useMemo(() => {
    const total = users.length
    const active = users.filter((u) => u.is_active !== false).length
    const inactive = users.filter((u) => u.is_active === false).length
    const admins = users.filter((u) => u.role === 'admin').length

    const now = Date.now()
    const ms7Days = 7 * 24 * 60 * 60 * 1000
    const ms30Days = 30 * 24 * 60 * 60 * 1000

    const createdLast7Days = users.filter((u) => {
      try {
        return now - new Date(u.created).getTime() <= ms7Days
      } catch {
        return false
      }
    }).length

    const createdLast30Days = users.filter((u) => {
      try {
        return now - new Date(u.created).getTime() <= ms30Days
      } catch {
        return false
      }
    }).length

    const adoptionRate =
      total > 0 ? Math.round((backupStat.uniqueUsersWithBackup / total) * 100) : 0

    return {
      total,
      active,
      inactive,
      admins,
      createdLast7Days,
      createdLast30Days,
      adoptionRate,
    }
  }, [users, backupStat.uniqueUsersWithBackup])

  // Filtragem de usuárias
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchTerm.toLowerCase().trim()
      const matchSearch =
        !q ||
        u.email?.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)

      const isActive = u.is_active !== false
      const matchStatus =
        statusFilter === 'all' ? true : statusFilter === 'active' ? isActive : !isActive

      const isUserAdmin = u.role === 'admin'
      const matchRole =
        roleFilter === 'all' ? true : roleFilter === 'admin' ? isUserAdmin : !isUserAdmin

      return matchSearch && matchStatus && matchRole
    })
  }, [users, searchTerm, statusFilter, roleFilter])

  // Exportação CSV via Blob no navegador respeitando os filtros atuais
  const handleExportCSV = () => {
    if (filteredUsers.length === 0) return

    const headers = [
      'ID',
      'Nome',
      'E-mail',
      'Papel',
      'Status',
      'Data de Cadastro',
      'Última Atualização',
    ]

    const rows = filteredUsers.map((u) => {
      const escape = (val?: string | null) => `"${(val || '').replace(/"/g, '""')}"`
      return [
        escape(u.id),
        escape(u.name || 'Sem nome informado'),
        escape(u.email),
        escape(u.role === 'admin' ? 'Administradora' : 'Usuária'),
        escape(u.is_active !== false ? 'Ativa' : 'Desativada'),
        escape(formatDate(u.created)),
        escape(formatDate(u.updated)),
      ].join(';')
    })

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const dateStr = new Date().toISOString().split('T')[0]
    link.setAttribute('href', url)
    link.setAttribute('download', `entrelacos_fac_usuarias_${dateStr}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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

  // Se não estiver logada ou não for admin
  if (!isConnected || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#03000A] text-slate-900 dark:text-white flex items-center justify-center p-6 select-none">
        <div className="max-w-md w-full p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-[12px] bg-rose-50 dark:bg-[#0A0A14] border border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="font-sans text-2xl font-semibold text-slate-900 dark:text-white">
            Acesso Restrito
          </h1>
          <p className="text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
            Esta área é exclusiva para administradoras do sistema. Sua conta atual (
            <span className="text-[#7c3aed] dark:text-[#C084FC] font-mono">
              {currentUser?.email || 'anônima'}
            </span>
            ) não possui papel de administrador.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Button
              onClick={() => navigate('/')}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold min-h-[44px] rounded-[8px]"
            >
              Voltar para a Calculadora
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white min-h-[44px] rounded-[8px]"
            >
              Entrar com outra conta
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#03000A] text-slate-900 dark:text-white font-sans transition-colors">
      {/* Topbar Admin Astral */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0A0A14]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#27272A] shadow-xs dark:shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-1.5 text-xs font-mono text-slate-600 hover:text-slate-900 dark:text-[#A1A1AA] dark:hover:text-white rounded-[8px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>CALCULADORA</span>
            </Button>
            <div className="h-4 w-px bg-slate-200 dark:bg-[#27272A]" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[8px] bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
              </div>
              <span className="font-sans font-semibold text-base text-slate-900 dark:text-white">
                Painel Administrativo
              </span>
              <Badge className="bg-purple-100 dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] border-purple-200 dark:border-[#27272A] text-[10px] font-mono">
                ASTRAL · FAC
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {currentUser?.name || 'Administradora'}
              </p>
              <p className="text-[10px] font-mono text-slate-500 dark:text-[#A1A1AA]">
                {currentUser?.email}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadAdminData}
              disabled={loading}
              className="gap-1.5 text-xs font-mono min-h-[38px] border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-800 dark:text-white hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/50 rounded-[8px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">ATUALIZAR</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal Astral */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner de Boas-Vindas & Métricas */}
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
            GESTÃO ADMINISTRATIVA · MÉTODO FAC
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mt-1">
            Visão Geral de Usuárias, Métricas & Gestão de Acessos
          </h1>
          <p className="text-sm text-slate-600 dark:text-[#A1A1AA] mt-1">
            Controle seguro de contas cadastradas, estatísticas de uso da calculadora e exportação
            de dados em conformidade com as diretrizes da Entrelaços Psicologia.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-[8px] bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-500/40 text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setErrorMessage(null)}
              className="text-xs h-7 hover:bg-rose-100 dark:hover:bg-rose-900/40"
            >
              Fechar
            </Button>
          </div>
        )}

        {successActionMessage && (
          <div className="p-4 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-500/40 text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {successActionMessage}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSuccessActionMessage(null)}
              className="text-xs h-7 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
            >
              Fechar
            </Button>
          </div>
        )}

        {/* Cards de Métricas de Uso da Calculadora Astral */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total & Status */}
          <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl rounded-[16px] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7c3aed]/40 dark:hover:border-[#C084FC]/40 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[11px] font-mono font-semibold text-slate-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                Total de Contas
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] flex items-center justify-center text-[#7c3aed] dark:text-[#C084FC] group-hover:border-[#7c3aed]/50 dark:group-hover:border-[#C084FC]/50 transition-colors">
                <Users className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                {loading ? '...' : metrics.total}
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA] mt-2 space-y-1">
                <p className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                    Ativas:
                  </span>
                  <strong className="text-slate-900 dark:text-white">{metrics.active}</strong>
                </p>
                <p className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-500" />
                    Desativadas:
                  </span>
                  <strong className="text-slate-900 dark:text-white">{metrics.inactive}</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Crescimento Temporal */}
          <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl rounded-[16px] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ea580c]/40 dark:hover:border-[#FB923C]/40 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[11px] font-mono font-semibold text-slate-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                Novas Contas
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A] flex items-center justify-center text-[#ea580c] dark:text-[#FB923C] group-hover:border-[#ea580c]/50 dark:group-hover:border-[#FB923C]/50 transition-colors">
                <TrendingUp className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                {loading ? '...' : metrics.createdLast30Days}
                <span className="text-xs font-normal text-slate-500 dark:text-[#71717A] ml-1.5 font-sans">
                  nos últ. 30 dias
                </span>
              </div>
              <p className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA] mt-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
                <span>{metrics.createdLast7Days} criadas nos últimos 7 dias</span>
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Uso da Calculadora (Cálculos Salvos na Nuvem) */}
          <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl rounded-[16px] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7c3aed]/40 dark:hover:border-[#C084FC]/40 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[11px] font-mono font-semibold text-slate-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                Uso da Calculadora
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] flex items-center justify-center text-[#7c3aed] dark:text-[#C084FC] group-hover:border-[#7c3aed]/50 dark:group-hover:border-[#C084FC]/50 transition-colors">
                <Database className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                {loading ? '...' : backupStat.uniqueUsersWithBackup}
                <span className="text-xs font-normal text-slate-500 dark:text-[#71717A] ml-1.5 font-sans">
                  ({metrics.adoptionRate}% das usuárias)
                </span>
              </div>
              <p className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA] mt-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC]" />
                <span>{backupStat.totalBackups} snapshots / cenários na nuvem</span>
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Última Atividade na Nuvem */}
          <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl rounded-[16px] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7c3aed]/40 dark:hover:border-[#C084FC]/40 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[11px] font-mono font-semibold text-slate-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                Último Cálculo na Nuvem
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] flex items-center justify-center text-[#7c3aed] dark:text-[#C084FC] group-hover:border-[#7c3aed]/50 dark:group-hover:border-[#C084FC]/50 transition-colors">
                <HardDrive className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-mono font-bold text-slate-900 dark:text-white truncate tracking-tight">
                {loading ? '...' : formatDate(backupStat.latestBackupDate)}
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-[#71717A] mt-2 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                Skip Cloud · Sincronização em tempo real
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Contas Cadastradas & Filtros Astral */}
        <div className="p-4 sm:p-6 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#27272A]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
                  Contas Cadastradas
                </h2>
                <Badge className="bg-purple-50 dark:bg-[#0A0A14] text-[#7c3aed] dark:text-[#C084FC] border-purple-200 dark:border-[#27272A] font-mono text-[11px] rounded-full px-2.5 py-0.5">
                  {filteredUsers.length} de {users.length}
                </Badge>
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-[#A1A1AA] mt-1">
                Gerencie permissões, desative contas ou exporte a lista filtrada em formato CSV.
              </p>
            </div>

            {/* Ações e Filtros de Busca */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 dark:text-[#71717A] absolute left-3 top-2.5" />
                <Input
                  type="text"
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-xs bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white rounded-[8px] focus:border-[#7c3aed] dark:focus:border-[#C084FC]"
                />
              </div>

              {/* Filtro Status */}
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-[#0A0A14] p-1 rounded-[8px] border border-slate-200 dark:border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-[6px] transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-white dark:bg-[#18181B] text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('active')}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-[6px] transition-colors ${
                    statusFilter === 'active'
                      ? 'bg-white dark:bg-[#18181B] text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                      : 'text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Ativas
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('inactive')}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-[6px] transition-colors ${
                    statusFilter === 'inactive'
                      ? 'bg-white dark:bg-[#18181B] text-rose-600 dark:text-rose-400 shadow-xs font-semibold'
                      : 'text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Desativadas
                </button>
              </div>

              {/* Botão Exportar CSV */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={filteredUsers.length === 0}
                className="gap-1.5 text-xs font-mono h-9 border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-800 dark:text-white hover:border-[#7c3aed] dark:hover:border-[#C084FC] rounded-[8px]"
                title="Baixar lista em CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC]" />
                <span>EXPORTAR CSV</span>
              </Button>
            </div>
          </div>

          {/* Superfície interna da Tabela */}
          <div className="bg-slate-50 dark:bg-[#0A0A14] rounded-[12px] border border-slate-200 dark:border-[#27272A] overflow-hidden">
            {loading ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-[#A1A1AA]">
                <Loader2 className="w-6 h-6 animate-spin text-[#7c3aed] dark:text-[#C084FC]" />
                <span className="text-xs font-mono">Carregando usuárias...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 dark:text-[#71717A] font-mono">
                Nenhuma usuária encontrada para os critérios de busca selecionados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-[#121216] text-slate-600 dark:text-[#A1A1AA] uppercase font-mono tracking-wider font-semibold border-b border-slate-200 dark:border-[#27272A]">
                    <tr>
                      <th className="py-3 px-4 sm:px-6">Usuária / Identificação</th>
                      <th className="py-3 px-4">E-mail</th>
                      <th className="py-3 px-4">Papel</th>
                      <th className="py-3 px-4">Data de Cadastro</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#27272A]">
                    {filteredUsers.map((u) => {
                      const isCurrentAdmin = u.id === currentUser?.id
                      const isRoleAdmin = u.role === 'admin'
                      const isActive = u.is_active !== false

                      return (
                        <tr
                          key={u.id}
                          className={`hover:bg-slate-100/70 dark:hover:bg-[#18181B]/80 transition-colors ${
                            !isActive ? 'opacity-70 bg-rose-50/20 dark:bg-rose-950/10' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                                  isRoleAdmin
                                    ? 'bg-[#7c3aed] dark:bg-[#C084FC] text-white dark:text-[#0A0A14] font-bold shadow-xs'
                                    : !isActive
                                      ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                                      : 'bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-[#A1A1AA]'
                                }`}
                              >
                                {(u.name || u.email || 'P')[0].toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-white truncate">
                                  {u.name || 'Sem nome informado'}
                                  {isCurrentAdmin && (
                                    <span className="ml-2 text-[10px] font-mono text-[#7c3aed] dark:text-[#C084FC] font-normal">
                                      (você)
                                    </span>
                                  )}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono">
                                  ID: {u.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-[#A1A1AA]">
                            <div className="flex items-center gap-1.5 truncate">
                              <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-[#71717A] shrink-0" />
                              <span className="truncate">{u.email}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {isRoleAdmin ? (
                              <Badge className="bg-purple-100 dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] border-purple-200 dark:border-[#C084FC]/40 text-[10px] font-mono font-semibold rounded-full px-2.5 py-0.5">
                                <Shield className="w-3 h-3 mr-1 text-[#ea580c] dark:text-[#FB923C]" />
                                ADMIN
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-[10px] font-mono text-slate-600 dark:text-[#A1A1AA] border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] rounded-full px-2.5 py-0.5"
                              >
                                USER
                              </Badge>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-slate-700 dark:text-[#A1A1AA] font-mono">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-[#71717A]" />
                              <span>{formatDate(u.created)}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                                ATIVA
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 px-2.5 py-0.5 rounded-full">
                                <UserX className="w-3 h-3" />
                                DESATIVADA
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            {isCurrentAdmin || isRoleAdmin ? (
                              <span
                                className="text-[10px] font-mono text-slate-400 dark:text-[#71717A] italic"
                                title="Contas de administração não podem ser desativadas nesta interface"
                              >
                                Protegida
                              </span>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTargetUser(u)}
                                className={`text-[11px] font-mono h-7 px-2.5 rounded-[6px] ${
                                  isActive
                                    ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700'
                                    : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700'
                                }`}
                              >
                                {isActive ? (
                                  <>
                                    <UserX className="w-3 h-3 mr-1" />
                                    Desativar
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-3 h-3 mr-1" />
                                    Reativar
                                  </>
                                )}
                              </Button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Card Informativo sobre Políticas e LGPD Astral */}
        <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-xs text-slate-600 dark:text-[#A1A1AA] space-y-1 shadow-xs">
          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
            Políticas de Acesso & Desativação Ética
          </p>
          <p className="leading-relaxed">
            Ao desativar uma conta, o acesso ao login é imediatamente bloqueado com uma mensagem
            informativa e amigável. Os cálculos, histórico e dados de sincronização permanecem
            preservados de forma íntegra no banco de dados e podem ser reativados a qualquer momento
            por uma administradora.
          </p>
        </div>
      </main>

      {/* Diálogo de Confirmação (AlertDialog) para Desativação / Reativação */}
      <AlertDialog open={!!targetUser} onOpenChange={(open) => !open && setTargetUser(null)}>
        <AlertDialogContent className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white rounded-[16px] max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${
                  targetUser?.is_active === false
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {targetUser?.is_active === false ? (
                  <UserCheck className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <AlertDialogTitle className="font-sans text-lg font-semibold">
                {targetUser?.is_active === false
                  ? 'Reativar Conta de Usuária'
                  : 'Desativar Conta de Usuária'}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed pt-1">
              {targetUser?.is_active === false ? (
                <>
                  Deseja reativar o acesso de{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {targetUser?.name || targetUser?.email}
                  </strong>
                  ? A psicóloga voltará a conseguir realizar login e sincronizar seus cálculos
                  normalmente.
                </>
              ) : (
                <>
                  Tem certeza de que deseja desativar a conta de{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {targetUser?.name || targetUser?.email}
                  </strong>
                  ? A usuária não conseguirá mais entrar na plataforma, mas todos os seus dados e
                  cálculos salvos permanecerão preservados com segurança.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel
              disabled={isUpdatingStatus}
              className="border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-[#A1A1AA] hover:bg-slate-100 dark:hover:bg-[#0A0A14] text-xs font-mono rounded-[8px]"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isUpdatingStatus}
              onClick={handleToggleUserStatus}
              className={`text-xs font-mono rounded-[8px] font-semibold text-white ${
                targetUser?.is_active === false
                  ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
                  : 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600'
              }`}
            >
              {isUpdatingStatus ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Atualizando...
                </>
              ) : targetUser?.is_active === false ? (
                'Sim, reativar conta'
              ) : (
                'Sim, desativar conta'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminDashboard
