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
      <div className="min-h-screen bg-[#080C16] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#0F111E] border border-rose-500/30 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold">Acesso Restrito</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Esta área é exclusiva para administradoras do sistema. Sua conta atual (
            <span className="text-purple-300">{currentUser?.email || 'anônima'}</span>) não possui
            papel de administrador.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Button
              onClick={() => navigate('/')}
              className="bg-[#5B3A8E] hover:bg-[#4d3079] text-white min-h-[44px]"
            >
              Voltar para a Calculadora
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="border-white/10 text-slate-300 hover:text-white min-h-[44px]"
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
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#080C16] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Topbar Admin */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0d1322]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-[#5B3A8E] dark:hover:text-purple-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar à Calculadora</span>
            </Button>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#5B3A8E] text-white flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                Painel Administrativo
              </span>
              <Badge className="bg-purple-100 text-[#5B3A8E] dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-[10px]">
                FAC Entrelaços
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {currentUser?.name || 'Administradora'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser?.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadAdminData}
              disabled={loading}
              className="gap-1.5 text-xs min-h-[38px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner de Boas-Vindas & Métricas */}
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Visão Geral de Usuárias & Backups
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Gestão de contas cadastradas e monitoramento de sincronizações na nuvem do Método FAC.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total de Contas
              </CardTitle>
              <Users className="w-4 h-4 text-[#5B3A8E] dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {loading ? '...' : users.length}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                {users.filter((u) => u.role === 'admin').length} com acesso admin
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Contas com Backup
              </CardTitle>
              <Database className="w-4 h-4 text-[#16746E] dark:text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {loading ? '...' : backupStat.uniqueUsersWithBackup}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {backupStat.totalBackups} snapshots registrados
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Último Backup na Nuvem
              </CardTitle>
              <HardDrive className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold font-mono text-slate-900 dark:text-white truncate">
                {loading ? '...' : formatDate(backupStat.latestBackupDate)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Instância Skip Cloud ativa
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Contas Cadastradas */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="font-serif text-lg text-slate-900 dark:text-white">
                Contas Cadastradas ({filteredUsers.length})
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Lista de psicólogas e administradoras com acesso ao sistema
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <Input
                type="text"
                placeholder="Buscar por nome, e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-2 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-[#5B3A8E]" />
                <span className="text-xs">Carregando usuárias cadastradas...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                Nenhuma usuária encontrada para o termo pesquisado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4 sm:px-6">Usuária / Identificação</th>
                      <th className="py-3 px-4">E-mail</th>
                      <th className="py-3 px-4">Papel</th>
                      <th className="py-3 px-4">Data de Cadastro</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.map((u) => {
                      const isCurrentAdmin = u.id === currentUser?.id
                      const isRoleAdmin = u.role === 'admin'

                      return (
                        <tr
                          key={u.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                                  isRoleAdmin
                                    ? 'bg-linear-to-br from-[#5B3A8E] to-[#452A6F]'
                                    : 'bg-slate-500 dark:bg-slate-700'
                                }`}
                              >
                                {(u.name || u.email || 'P')[0].toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-white truncate">
                                  {u.name || 'Sem nome informado'}
                                  {isCurrentAdmin && (
                                    <span className="ml-2 text-[10px] text-purple-600 dark:text-purple-300 font-normal">
                                      (você)
                                    </span>
                                  )}
                                </p>
                                <p className="text-[10px] text-slate-500 font-mono">ID: {u.id}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-1.5 truncate">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{u.email}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {isRoleAdmin ? (
                              <Badge className="bg-purple-100 text-[#5B3A8E] dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-[10px] font-semibold">
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-[10px] text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                              >
                                Psicóloga (user)
                              </Badge>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{formatDate(u.created)}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Ativa
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Informativo sobre Políticas e LGPD */}
        <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#5B3A8E] dark:text-purple-400" />
            Políticas de Acesso & Privacidade
          </p>
          <p className="leading-relaxed">
            As contas comuns possuem restrição de acesso por RLS (Row Level Security), impedindo a
            leitura de dados ou backups de terceiros. Apenas contas com a role <code>
              admin
            </code>{' '}
            possuem privilégio para visualizar a listagem geral de contas.
          </p>
        </div>
      </main>
    </div>
  )
}
export default AdminDashboard
