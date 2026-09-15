import React, { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCloudSync } from '@/hooks/useCloudSync'
import pb from '@/lib/pocketbase/client'

interface UserRecord {
  id: string
  name?: string
  email: string
  role?: string
  created: string
  updated: string
  verified?: boolean
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
        'Não foi possível carregar a lista de usuários. Verifique se sua conta possui permissão de Administrador.',
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

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase().trim()
    if (!q) return true
    return (
      u.email?.toLowerCase().includes(q) ||
      u.name?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    )
  })

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
            GESTÃO ADMINISTRATIVA
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mt-1">
            Visão Geral de Usuárias & Backups
          </h1>
          <p className="text-sm text-slate-600 dark:text-[#A1A1AA] mt-1">
            Gestão de contas cadastradas e monitoramento de sincronizações na nuvem do Método FAC.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-[8px] bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-500/40 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Cards de Métricas Astral */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <div className="text-4xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                {loading ? '...' : users.length}
              </div>
              <p className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA] mt-1.5 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#7c3aed] dark:bg-[#C084FC]" />
                <UserCheck className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC]" />
                {users.filter((u) => u.role === 'admin').length} com acesso admin
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl rounded-[16px] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ea580c]/40 dark:hover:border-[#FB923C]/40 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[11px] font-mono font-semibold text-slate-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                Contas com Backup
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A] flex items-center justify-center text-[#ea580c] dark:text-[#FB923C] group-hover:border-[#ea580c]/50 dark:group-hover:border-[#FB923C]/50 transition-colors">
                <Database className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                {loading ? '...' : backupStat.uniqueUsersWithBackup}
              </div>
              <p className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA] mt-1.5 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#ea580c] dark:bg-[#FB923C]" />
                {backupStat.totalBackups} snapshots registrados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl rounded-[16px] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7c3aed]/40 dark:hover:border-[#C084FC]/40 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[11px] font-mono font-semibold text-slate-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                Último Backup na Nuvem
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] flex items-center justify-center text-[#7c3aed] dark:text-[#C084FC] group-hover:border-[#7c3aed]/50 dark:group-hover:border-[#C084FC]/50 transition-colors">
                <HardDrive className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-mono font-bold text-slate-900 dark:text-white truncate tracking-tight">
                {loading ? '...' : formatDate(backupStat.latestBackupDate)}
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-[#71717A] mt-1.5 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                Instância Skip Cloud ativa
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Contas Cadastradas Astral */}
        <div className="p-4 sm:p-6 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#27272A]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
                  Contas Cadastradas
                </h2>
                <Badge className="bg-purple-50 dark:bg-[#0A0A14] text-[#7c3aed] dark:text-[#C084FC] border-purple-200 dark:border-[#27272A] font-mono text-[11px] rounded-full px-2.5 py-0.5">
                  {filteredUsers.length} total
                </Badge>
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-[#A1A1AA] mt-1">
                Lista de psicólogas e administradoras com acesso ao sistema
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 dark:text-[#71717A] absolute left-3 top-2.5" />
              <Input
                type="text"
                placeholder="Buscar por nome, e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white rounded-[8px] focus:border-[#7c3aed] dark:focus:border-[#C084FC] focus:ring-1 focus:ring-[#7c3aed] dark:focus:ring-[#C084FC]"
              />
            </div>
          </div>

          {/* Superfície interna */}
          <div className="bg-slate-50 dark:bg-[#0A0A14] rounded-[12px] border border-slate-200 dark:border-[#27272A] overflow-hidden">
            {loading ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-[#A1A1AA]">
                <Loader2 className="w-6 h-6 animate-spin text-[#7c3aed] dark:text-[#C084FC]" />
                <span className="text-xs font-mono">Carregando usuárias...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 dark:text-[#71717A] font-mono">
                Nenhuma usuária encontrada para o termo pesquisado.
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
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#27272A]">
                    {filteredUsers.map((u) => {
                      const isCurrentAdmin = u.id === currentUser?.id
                      const isRoleAdmin = u.role === 'admin'

                      return (
                        <tr
                          key={u.id}
                          className="hover:bg-slate-100/70 dark:hover:bg-[#18181B]/80 transition-colors"
                        >
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold text-white shrink-0 ${
                                  isRoleAdmin
                                    ? 'bg-[#7c3aed] dark:bg-[#C084FC] text-white dark:text-[#0A0A14] font-bold shadow-xs'
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

                          <td className="py-3.5 px-4 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              ATIVA
                            </span>
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
            Políticas de Acesso & Privacidade
          </p>
          <p className="leading-relaxed">
            As contas comuns possuem restrição de acesso por RLS (Row Level Security), impedindo a
            leitura de dados ou backups de terceiros. Apenas contas com a role{' '}
            <code className="text-[#7c3aed] dark:text-[#C084FC] font-mono">admin</code> possuem
            privilégio para visualizar a listagem geral de contas.
          </p>
        </div>
      </main>
    </div>
  )
}
export default AdminDashboard
