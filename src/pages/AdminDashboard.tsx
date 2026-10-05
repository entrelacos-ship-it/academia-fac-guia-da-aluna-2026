import React, { useState, useEffect, useMemo, useRef } from 'react'
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
  ShieldCheck,
  HardDrive,
  Loader2,
  Download,
  UserX,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  BookOpen,
  Plus,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  History,
  Lock,
  Unlock,
  Eye,
  EyeOff,
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
import { AlunaGuiaService } from '@/services/alunaGuiaService'

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

export interface MatriculaRecord {
  id: string
  email: string
  nome?: string
  status: 'ativa' | 'suspensa' | 'expirada'
  ciclo?: string
  inicio?: string
  fim?: string
  origem?: string
  anotacao?: string
  created: string
  updated: string
}

export interface GuiaEncontroAdmin {
  id: string
  numero: number
  titulo: string
  status: 'rascunho' | 'publicado'
  data_prevista: string
  created: string
  updated: string
}

export interface AuditoriaRecord {
  id: string
  operador: string
  acao: string
  alvo?: string
  motivo?: string
  detalhes?: unknown
  created: string
}

interface BackupStat {
  totalBackups: number
  uniqueUsersWithBackup: number
  latestBackupDate: string | null
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, isConnected, isAdmin, logout } = useCloudSync()

  // Aba selecionada: 'calculadora_usuarios' ou 'guia_matriculas' ou 'guia_encontros' ou 'auditoria'
  const [activeTab, setActiveTab] = useState<'usuarios' | 'matriculas' | 'encontros' | 'auditoria'>(
    'matriculas',
  )

  // Estado Usuárias
  const [users, setUsers] = useState<UserRecord[]>([])
  const [backupStat, setBackupStat] = useState<BackupStat>({
    totalBackups: 0,
    uniqueUsersWithBackup: 0,
    latestBackupDate: null,
  })

  // Estado Matrículas do Guia
  const [matriculas, setMatriculas] = useState<MatriculaRecord[]>([])
  const [searchMatricula, setSearchMatricula] = useState('')
  const [matriculaStatusFilter, setMatriculaStatusFilter] = useState<
    'todas' | 'ativa' | 'suspensa' | 'expirada'
  >('todas')

  // Estado Encontros do Guia
  const [encontros, setEncontros] = useState<GuiaEncontroAdmin[]>([])

  // Estado Auditoria
  const [auditorias, setAuditorias] = useState<AuditoriaRecord[]>([])

  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successActionMessage, setSuccessActionMessage] = useState<string | null>(null)

  // Gerenciamento de Usuária / Status
  const [targetUser, setTargetUser] = useState<UserRecord | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Formulário Nova Matrícula Individual
  const [showNovaMatriculaModal, setShowNovaMatriculaModal] = useState(false)
  const [novoEmail, setNovoEmail] = useState('')
  const [novoNome, setNovoNome] = useState('')
  const [novoCiclo, setNovoCiclo] = useState('Ciclo FAC 2026')
  const [novoFim, setNovoFim] = useState('')
  const [novaAnotacao, setNovaAnotacao] = useState('')
  const [salvandoMatricula, setSalvandoMatricula] = useState(false)

  // Importação CSV Matrículas
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [csvPreview, setCsvPreview] = useState<{
    aceitas: Array<{ email: string; nome?: string; ciclo?: string }>
    rejeitadas: Array<{ linha: number; email: string; motivo: string }>
  } | null>(null)
  const [importandoCsv, setImportandoCsv] = useState(false)

  // Matrícula selecionada para ação de status
  const [targetMatricula, setTargetMatricula] = useState<{
    mat: MatriculaRecord
    novoStatus: 'ativa' | 'suspensa' | 'expirada'
  } | null>(null)

  const loadAllAdminData = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      // 1. Usuárias da coleção users
      const usersList = await pb.collection('users').getFullList<UserRecord>({
        sort: '-created',
      })
      setUsers(usersList)

      // 2. Backups
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
        console.warn('Estatísticas de backup:', backupErr)
      }

      // 3. Matrículas do Guia
      try {
        const matsList = await pb.collection('fac_matriculas').getFullList<MatriculaRecord>({
          sort: '-created',
        })
        setMatriculas(matsList)
      } catch (matErr) {
        console.warn('Erro ao carregar fac_matriculas:', matErr)
      }

      // 4. Encontros do Guia
      try {
        const encsList = await pb.collection('fac_guia_encontros').getFullList<GuiaEncontroAdmin>({
          sort: 'numero',
        })
        setEncontros(encsList)
      } catch (encErr) {
        console.warn('Erro ao carregar fac_guia_encontros:', encErr)
      }

      // 5. Auditoria
      try {
        const audList = await pb.collection('fac_auditoria').getList<AuditoriaRecord>(1, 30, {
          sort: '-created',
        })
        setAuditorias(audList.items)
      } catch (audErr) {
        console.warn('Erro ao carregar fac_auditoria:', audErr)
      }
    } catch (err) {
      console.error('Erro ao carregar dados do admin:', err)
      setErrorMessage(
        'Não foi possível carregar todos os dados. Verifique suas credenciais de Administradora.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && isAdmin) {
      loadAllAdminData()
    }
  }, [isConnected, isAdmin])

  // Alternar status da conta de usuária
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
          ? `Conta de ${targetUser.name || targetUser.email} foi reativada.`
          : `Conta de ${targetUser.name || targetUser.email} foi desativada.`,
      )
      setTargetUser(null)
    } catch (err) {
      setErrorMessage(`Erro ao alterar status: ${getErrorMessage(err)}`)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Criar matrícula individual
  const handleCriarMatricula = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanEmail = novoEmail.trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      alert('Informe um e-mail válido.')
      return
    }

    setSalvandoMatricula(true)
    try {
      const novaRec = await pb.collection('fac_matriculas').create<MatriculaRecord>({
        email: cleanEmail,
        nome: novoNome.trim() || undefined,
        status: 'ativa',
        ciclo: novoCiclo.trim() || 'Ciclo FAC 2026',
        fim: novoFim || undefined,
        origem: 'Cadastro Manual Painel',
        anotacao: novaAnotacao.trim() || undefined,
      })

      // Registrar auditoria
      try {
        await pb.collection('fac_auditoria').create({
          operador: currentUser?.email || 'admin',
          acao: 'cadastrar_matricula_individual',
          alvo: cleanEmail,
          motivo: 'Cadastro de matrícula no painel',
          detalhes: { ciclo: novoCiclo },
        })
      } catch {
        /* intentionally ignored */
      }

      setMatriculas((prev) => [novaRec, ...prev])
      setSuccessActionMessage(`Matrícula de ${cleanEmail} cadastrada com sucesso!`)
      setShowNovaMatriculaModal(false)
      setNovoEmail('')
      setNovoNome('')
      setNovaAnotacao('')
      setNovoFim('')
    } catch (err) {
      alert(`Erro ao cadastrar matrícula: ${getErrorMessage(err)}`)
    } finally {
      setSalvandoMatricula(false)
    }
  }

  // Alterar status de matrícula (ativa / suspensa / expirada) com auditoria
  const handleConfirmarStatusMatricula = async () => {
    if (!targetMatricula) return
    const { mat, novoStatus } = targetMatricula
    setIsUpdatingStatus(true)
    try {
      await pb.collection('fac_matriculas').update(mat.id, {
        status: novoStatus,
      })

      // Auditoria
      try {
        await pb.collection('fac_auditoria').create({
          operador: currentUser?.email || 'admin',
          acao: 'alterar_status_matricula',
          alvo: mat.email,
          motivo: `Status alterado de ${mat.status} para ${novoStatus}`,
          detalhes: { de: mat.status, para: novoStatus },
        })
      } catch {
        /* intentionally ignored */
      }

      setMatriculas((prev) => prev.map((m) => (m.id === mat.id ? { ...m, status: novoStatus } : m)))
      setSuccessActionMessage(`Matrícula de ${mat.email} atualizada para ${novoStatus}.`)
      setTargetMatricula(null)
    } catch (err) {
      alert(`Erro ao atualizar status: ${getErrorMessage(err)}`)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Publicar ou reverter status de encontro
  const handleToggleEncontroStatus = async (enc: GuiaEncontroAdmin) => {
    const novoStatus = enc.status === 'publicado' ? 'rascunho' : 'publicado'
    try {
      const res = await AlunaGuiaService.adminToggleEncontroStatus(enc.numero, novoStatus)
      if (res.success) {
        setEncontros((prev) =>
          prev.map((e) => (e.id === enc.id ? { ...e, status: novoStatus } : e)),
        )
        setSuccessActionMessage(
          `Encontro ${enc.numero} agora está marcado como ${novoStatus.toUpperCase()}.`,
        )
      }
    } catch (err) {
      alert(`Erro ao alterar status do encontro: ${getErrorMessage(err)}`)
    }
  }

  // Processar arquivo CSV de Matrículas com prévia e deduplicação
  const handleProcessarCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = (event.target?.result as string) || ''
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)

      const aceitas: Array<{ email: string; nome?: string; ciclo?: string }> = []
      const rejeitadas: Array<{ linha: number; email: string; motivo: string }> = []
      const emailsVistos = new Set<string>()

      // Pular cabeçalho se houver "email" na primeira linha
      const startIndex = lines[0]?.toLowerCase().includes('email') ? 1 : 0

      for (let i = startIndex; i < lines.length; i++) {
        const rawLine = lines[i]
        // Suporta separador por vírgula ou ponto-e-vírgula
        const parts = rawLine.split(/[;,]/).map((p) => p.replace(/"/g, '').trim())
        const email = (parts[0] || '').toLowerCase()
        const nome = parts[1] || ''
        const ciclo = parts[2] || 'Ciclo FAC 2026'

        if (!email || !email.includes('@')) {
          rejeitadas.push({ linha: i + 1, email: email || '(vazio)', motivo: 'E-mail inválido' })
          continue
        }

        if (emailsVistos.has(email)) {
          rejeitadas.push({
            linha: i + 1,
            email,
            motivo: 'E-mail duplicado no próprio arquivo CSV',
          })
          continue
        }

        // Checar se já existe no banco
        const jaExiste = matriculas.find((m) => m.email.toLowerCase() === email)
        if (jaExiste) {
          rejeitadas.push({
            linha: i + 1,
            email,
            motivo: `Já cadastrado no banco (status: ${jaExiste.status}) - importar lote não altera suspensas nem prazos sem confirmação`,
          })
          continue
        }

        emailsVistos.add(email)
        aceitas.push({ email, nome, ciclo })
      }

      setCsvPreview({ aceitas, rejeitadas })
    }
    reader.readAsText(file, 'UTF-8')
  }

  // Confirmar importação do lote aceito
  const handleConfirmarImportacaoLote = async () => {
    if (!csvPreview || csvPreview.aceitas.length === 0) return
    setImportandoCsv(true)
    let sucessos = 0

    try {
      for (const item of csvPreview.aceitas) {
        try {
          const rec = await pb.collection('fac_matriculas').create<MatriculaRecord>({
            email: item.email,
            nome: item.nome || undefined,
            status: 'ativa',
            ciclo: item.ciclo || 'Ciclo FAC 2026',
            origem: 'Importação CSV',
          })
          setMatriculas((prev) => [rec, ...prev])
          sucessos++
        } catch (itemErr) {
          console.warn('Erro ao importar linha:', item.email, itemErr)
        }
      }

      // Auditoria
      try {
        await pb.collection('fac_auditoria').create({
          operador: currentUser?.email || 'admin',
          acao: 'importar_lote_csv_matriculas',
          alvo: `${sucessos} alunas`,
          motivo: 'Importação em lote de alunas matriculadas',
          detalhes: { totalAceitas: sucessos, rejeitadas: csvPreview.rejeitadas.length },
        })
      } catch {
        /* intentionally ignored */
      }

      setSuccessActionMessage(`Lote importado: ${sucessos} novas matrículas ativadas com sucesso!`)
      setCsvPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } finally {
      setImportandoCsv(false)
    }
  }

  // Exportar lista de matrículas em CSV
  const handleExportarMatriculasCSV = () => {
    const headers = ['E-mail', 'Nome', 'Status', 'Ciclo', 'Término', 'Origem', 'Data Cadastro']
    const rows = matriculas.map((m) => {
      const escape = (val?: string | null) => `"${(val || '').replace(/"/g, '""')}"`
      return [
        escape(m.email),
        escape(m.nome || ''),
        escape(m.status),
        escape(m.ciclo || ''),
        escape(m.fim || ''),
        escape(m.origem || ''),
        escape(m.created),
      ].join(';')
    })

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `matriculas_academia_fac_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Métricas de Matrículas
  const metricasMatriculas = useMemo(() => {
    const total = matriculas.length
    const ativas = matriculas.filter((m) => m.status === 'ativa').length
    const suspensas = matriculas.filter((m) => m.status === 'suspensa').length
    const expiradas = matriculas.filter((m) => m.status === 'expirada').length
    return { total, ativas, suspensas, expiradas }
  }, [matriculas])

  // Filtragem de Matrículas
  const matriculasFiltradas = useMemo(() => {
    return matriculas.filter((m) => {
      const q = searchMatricula.toLowerCase().trim()
      const matchSearch =
        !q || m.email.toLowerCase().includes(q) || m.nome?.toLowerCase().includes(q)

      const matchStatus =
        matriculaStatusFilter === 'todas' ? true : m.status === matriculaStatusFilter

      return matchSearch && matchStatus
    })
  }, [matriculas, searchMatricula, matriculaStatusFilter])

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

  if (!isConnected || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#03000A] text-slate-900 dark:text-white flex items-center justify-center p-6 select-none">
        <div className="max-w-md w-full p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-[12px] bg-rose-50 dark:bg-[#0A0A14] border border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="font-sans text-2xl font-semibold text-slate-900 dark:text-white">
            Acesso Restrito ao Painel
          </h1>
          <p className="text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
            Esta área é exclusiva para administradoras do sistema. Sua conta atual (
            <span className="text-[#7c3aed] dark:text-[#C084FC] font-mono">
              {currentUser?.email || 'anônima'}
            </span>
            ) não possui permissão administrativa.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Button
              onClick={() => navigate('/')}
              className="bg-[#7c3aed] text-white font-semibold min-h-[44px] rounded-[8px]"
            >
              Voltar ao Hub da Academia
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="border-slate-200 dark:border-[#27272A] min-h-[44px] rounded-[8px]"
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
      {/* Topbar Admin */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0A0A14]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#27272A] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-1.5 text-xs font-mono text-slate-600 hover:text-slate-900 dark:text-[#A1A1AA] dark:hover:text-white rounded-[8px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ACADEMIA</span>
            </Button>
            <div className="h-4 w-px bg-slate-200 dark:bg-[#27272A]" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[8px] bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
              </div>
              <span className="font-sans font-semibold text-base text-slate-900 dark:text-white">
                Painel Administrativo FAC
              </span>
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
              onClick={loadAllAdminData}
              disabled={loading}
              className="gap-1.5 text-xs font-mono min-h-[38px] rounded-[8px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">ATUALIZAR</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
            GESTÃO COMPLETA · ACADEMIA MÉTODO FAC
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mt-1">
            Matrículas do Guia, Encontros & Gestão do Sistema
          </h1>
        </div>

        {/* Notificações de Sucesso e Erro */}
        {errorMessage && (
          <div className="p-4 rounded-[8px] bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-500/40 text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setErrorMessage(null)}
              className="text-xs h-7 hover:bg-rose-100"
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
              className="text-xs h-7 hover:bg-emerald-100"
            >
              Fechar
            </Button>
          </div>
        )}

        {/* Abas Superiores de Navegação */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-[#27272A] pb-3">
          <Button
            variant={activeTab === 'matriculas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('matriculas')}
            className={`font-mono text-xs rounded-[8px] gap-1.5 ${
              activeTab === 'matriculas'
                ? 'bg-[#7c3aed] text-white dark:bg-[#C084FC] dark:text-[#0A0A14]'
                : ''
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Matrículas da Academia ({matriculas.length})</span>
          </Button>

          <Button
            variant={activeTab === 'encontros' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('encontros')}
            className={`font-mono text-xs rounded-[8px] gap-1.5 ${
              activeTab === 'encontros'
                ? 'bg-[#7c3aed] text-white dark:bg-[#C084FC] dark:text-[#0A0A14]'
                : ''
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Encontros do Guia (19)</span>
          </Button>

          <Button
            variant={activeTab === 'usuarios' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('usuarios')}
            className={`font-mono text-xs rounded-[8px] gap-1.5 ${
              activeTab === 'usuarios'
                ? 'bg-[#7c3aed] text-white dark:bg-[#C084FC] dark:text-[#0A0A14]'
                : ''
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Contas do App & Nuvem ({users.length})</span>
          </Button>

          <Button
            variant={activeTab === 'auditoria' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('auditoria')}
            className={`font-mono text-xs rounded-[8px] gap-1.5 ${
              activeTab === 'auditoria'
                ? 'bg-[#7c3aed] text-white dark:bg-[#C084FC] dark:text-[#0A0A14]'
                : ''
            }`}
          >
            <History className="w-4 h-4" />
            <span>Auditoria & Logs</span>
          </Button>
        </div>

        {/* ================= ABA 1: MATRÍCULAS DO GUIA ================= */}
        {activeTab === 'matriculas' && (
          <div className="space-y-6">
            {/* Cards de Métricas de Matrículas */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-mono uppercase text-slate-500">
                    Total de Matrículas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-mono font-bold">{metricasMatriculas.total}</div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-mono uppercase text-emerald-600 dark:text-emerald-400">
                    Matrículas Ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {metricasMatriculas.ativas}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-mono uppercase text-amber-600 dark:text-amber-400">
                    Suspensas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-mono font-bold text-amber-600 dark:text-amber-400">
                    {metricasMatriculas.suspensas}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-mono uppercase text-rose-600 dark:text-rose-400">
                    Expiradas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-mono font-bold text-rose-600 dark:text-rose-400">
                    {metricasMatriculas.expiradas}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Painel de Ações: Cadastro Manual & Importar CSV */}
            <div className="p-4 sm:p-6 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#27272A]">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
                    Gestão de Matrículas da Aluna
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-[#A1A1AA] mt-0.5">
                    Cadastre individualmente, importe em lote com conferência prévia e controle
                    suspensões.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setShowNovaMatriculaModal(true)}
                    className="gap-1.5 font-mono text-xs bg-[#7c3aed] text-white hover:bg-[#6d28d9] rounded-[8px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nova Matrícula</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-1.5 font-mono text-xs rounded-[8px]"
                  >
                    <Upload className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
                    <span>Importar CSV</span>
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={handleProcessarCSV}
                  />

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportarMatriculasCSV}
                    className="gap-1.5 font-mono text-xs rounded-[8px]"
                  >
                    <Download className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                    <span>Exportar CSV</span>
                  </Button>
                </div>
              </div>

              {/* Prévia de Importação CSV (quando selecionado arquivo) */}
              {csvPreview && (
                <div className="p-4 rounded-[12px] bg-purple-50/60 dark:bg-[#121216] border border-purple-200 dark:border-[#27272A] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-[#7c3aed] dark:text-[#C084FC]" />
                      <span className="font-sans font-semibold text-sm">
                        Relatório de Pré-Validação do Lote CSV
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCsvPreview(null)}
                      className="text-xs font-mono"
                    >
                      Cancelar
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200">
                      <strong>Linhas Aceitas ({csvPreview.aceitas.length}):</strong>
                      <p className="mt-1 text-[11px] truncate">
                        Novos e-mails válidos prontos para inclusão imediata.
                      </p>
                    </div>

                    <div className="p-3 rounded-[8px] bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200">
                      <strong>Linhas Rejeitadas/Ignoradas ({csvPreview.rejeitadas.length}):</strong>
                      <p className="mt-1 text-[11px] truncate">
                        E-mails duplicados ou já existentes no banco (não reativa suspensas).
                      </p>
                    </div>
                  </div>

                  {csvPreview.rejeitadas.length > 0 && (
                    <div className="max-h-28 overflow-y-auto bg-white dark:bg-[#18181B] p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] text-[11px] font-mono space-y-1">
                      {csvPreview.rejeitadas.map((rej, idx) => (
                        <p key={idx} className="text-slate-600 dark:text-[#A1A1AA]">
                          • Linha {rej.linha}: <span className="font-semibold">{rej.email}</span> (
                          {rej.motivo})
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      disabled={csvPreview.aceitas.length === 0 || importandoCsv}
                      onClick={handleConfirmarImportacaoLote}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs rounded-[8px]"
                    >
                      {importandoCsv ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                          Importando...
                        </>
                      ) : (
                        `Confirmar Importação de ${csvPreview.aceitas.length} Matrículas`
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Filtros e Busca */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <Input
                    type="text"
                    placeholder="Buscar por e-mail ou nome..."
                    value={searchMatricula}
                    onChange={(e) => setSearchMatricula(e.target.value)}
                    className="pl-9 h-9 text-xs bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] rounded-[8px]"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-50 dark:bg-[#0A0A14] p-1 rounded-[8px] border border-slate-200 dark:border-[#27272A]">
                  {(['todas', 'ativa', 'suspensa', 'expirada'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setMatriculaStatusFilter(st)}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded-[6px] capitalize transition-colors ${
                        matriculaStatusFilter === st
                          ? 'bg-white dark:bg-[#18181B] text-slate-900 dark:text-white shadow-xs font-semibold'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabela de Matrículas */}
              <div className="bg-slate-50 dark:bg-[#0A0A14] rounded-[12px] border border-slate-200 dark:border-[#27272A] overflow-hidden">
                {matriculasFiltradas.length === 0 ? (
                  <div className="p-8 text-center text-xs font-mono text-slate-500">
                    Nenhuma matrícula localizada para os filtros selecionados.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-[#121216] text-slate-600 dark:text-[#A1A1AA] uppercase font-mono tracking-wider font-semibold border-b border-slate-200 dark:border-[#27272A]">
                        <tr>
                          <th className="py-3 px-4">Aluna / E-mail</th>
                          <th className="py-3 px-4">Ciclo</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Término</th>
                          <th className="py-3 px-4">Origem</th>
                          <th className="py-3 px-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-[#27272A]">
                        {matriculasFiltradas.map((mat) => (
                          <tr
                            key={mat.id}
                            className="hover:bg-slate-100/70 dark:hover:bg-[#18181B]/80"
                          >
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {mat.email}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-[#71717A]">
                                  {mat.nome || 'Sem nome cadastrado'}
                                </p>
                              </div>
                            </td>

                            <td className="py-3 px-4 font-mono text-slate-600 dark:text-[#A1A1AA]">
                              {mat.ciclo || 'Ciclo FAC 2026'}
                            </td>

                            <td className="py-3 px-4">
                              {mat.status === 'ativa' && (
                                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                                  Ativa
                                </Badge>
                              )}
                              {mat.status === 'suspensa' && (
                                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] font-mono">
                                  Suspensa
                                </Badge>
                              )}
                              {mat.status === 'expirada' && (
                                <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[10px] font-mono">
                                  Expirada
                                </Badge>
                              )}
                            </td>

                            <td className="py-3 px-4 font-mono text-slate-600 dark:text-[#A1A1AA]">
                              {mat.fim ? formatDate(mat.fim) : 'Sem expiração'}
                            </td>

                            <td className="py-3 px-4 text-[11px] font-mono text-slate-500">
                              {mat.origem || 'Painel'}
                            </td>

                            <td className="py-3 px-4 text-right space-x-1">
                              {mat.status !== 'ativa' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setTargetMatricula({ mat, novoStatus: 'ativa' })}
                                  className="text-[11px] font-mono text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 h-7 px-2"
                                >
                                  Reativar
                                </Button>
                              )}
                              {mat.status === 'ativa' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setTargetMatricula({ mat, novoStatus: 'suspensa' })
                                  }
                                  className="text-[11px] font-mono text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 h-7 px-2"
                                >
                                  Suspender
                                </Button>
                              )}
                              {mat.status !== 'expirada' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setTargetMatricula({ mat, novoStatus: 'expirada' })
                                  }
                                  className="text-[11px] font-mono text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 h-7 px-2"
                                >
                                  Expirar
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 2: ENCONTROS DO GUIA ================= */}
        {activeTab === 'encontros' && (
          <div className="space-y-6">
            <div className="p-4 sm:p-6 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#27272A]">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
                    Publicação dos 19 Encontros do Guia
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-[#A1A1AA] mt-0.5">
                    O calendário NUNCA publica automaticamente: a liberação é ação manual no painel.
                  </p>
                </div>
                <Badge className="bg-purple-50 dark:bg-[#0A0A14] text-[#7c3aed] border-purple-200 font-mono text-xs">
                  Encontro 1 sempre público
                </Badge>
              </div>

              <div className="space-y-3">
                {/* Encontro 1 (Fixo) */}
                <div className="p-4 rounded-[12px] bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      Encontro 1 · Aula Aberta Gratuita (06/10/2026)
                    </span>
                    <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                      Aula Magna com Diagnóstico FAC Aprofundado aberto a todas as visitantes.
                    </p>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs font-mono">
                    Aberto Permanente
                  </Badge>
                </div>

                {/* Encontros 2 a 19 */}
                {encontros.map((enc) => {
                  const isPub = enc.status === 'publicado'
                  return (
                    <div
                      key={enc.id}
                      className="p-4 rounded-[12px] bg-slate-50/80 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            Encontro {enc.numero}: {enc.titulo}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            ({enc.data_prevista || 'Em breve'})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-[#71717A] mt-0.5">
                          Status atual: <strong className="uppercase">{enc.status}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant={isPub ? 'outline' : 'default'}
                          onClick={() => handleToggleEncontroStatus(enc)}
                          className={`font-mono text-xs rounded-[8px] gap-1.5 ${
                            !isPub
                              ? 'bg-[#7c3aed] text-white hover:bg-[#6d28d9]'
                              : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                          }`}
                        >
                          {isPub ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Reverter para Rascunho</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Publicar Encontro</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 3: USUÁRIAS DO APP & NUVEM ================= */}
        {activeTab === 'usuarios' && (
          <div className="space-y-6">
            {/* Tabela de Contas Cadastradas */}
            <div className="p-4 sm:p-6 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#27272A]">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
                    Contas Cadastradas no Skip Cloud
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-[#A1A1AA] mt-0.5">
                    Usuárias com login e sincronização de backup da Calculadora e IKIGAI.
                  </p>
                </div>
                <Badge className="font-mono text-xs bg-purple-50 dark:bg-[#0A0A14] text-[#7c3aed] border-purple-200">
                  {users.length} contas
                </Badge>
              </div>

              <div className="bg-slate-50 dark:bg-[#0A0A14] rounded-[12px] border border-slate-200 dark:border-[#27272A] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-[#121216] text-slate-600 uppercase font-mono border-b border-slate-200 dark:border-[#27272A]">
                      <tr>
                        <th className="py-3 px-4">Usuária</th>
                        <th className="py-3 px-4">E-mail</th>
                        <th className="py-3 px-4">Papel</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#27272A]">
                      {users.map((u) => {
                        const isRoleAdmin = u.role === 'admin'
                        const isActive = u.is_active !== false
                        return (
                          <tr key={u.id}>
                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                              {u.name || 'Sem nome'}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600 dark:text-[#A1A1AA]">
                              {u.email}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="text-[10px] font-mono uppercase">
                                {u.role || 'user'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              {isActive ? (
                                <span className="text-emerald-600 font-mono text-[11px] font-medium">
                                  Ativa
                                </span>
                              ) : (
                                <span className="text-rose-600 font-mono text-[11px] font-medium">
                                  Desativada
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {!isRoleAdmin && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setTargetUser(u)}
                                  className="text-[11px] font-mono h-7"
                                >
                                  {isActive ? 'Desativar' : 'Reativar'}
                                </Button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 4: AUDITORIA & LOGS ================= */}
        {activeTab === 'auditoria' && (
          <div className="space-y-6">
            <div className="p-4 sm:p-6 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#27272A]">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
                    Trilha de Auditoria do Guia da Aluna
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-[#A1A1AA] mt-0.5">
                    Registro de ações administrativas e eventos de acesso (sem respostas íntimas do
                    diagnóstico).
                  </p>
                </div>
                <Badge className="font-mono text-xs bg-purple-50 dark:bg-[#0A0A14] text-[#7c3aed] border-purple-200">
                  {auditorias.length} eventos
                </Badge>
              </div>

              <div className="bg-slate-50 dark:bg-[#0A0A14] rounded-[12px] border border-slate-200 dark:border-[#27272A] overflow-hidden">
                {auditorias.length === 0 ? (
                  <div className="p-8 text-center text-xs font-mono text-slate-500">
                    Nenhum evento registrado ainda.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-100 dark:bg-[#121216] text-slate-600 uppercase border-b border-slate-200 dark:border-[#27272A]">
                        <tr>
                          <th className="py-3 px-4">Data/Hora</th>
                          <th className="py-3 px-4">Operador</th>
                          <th className="py-3 px-4">Ação</th>
                          <th className="py-3 px-4">Alvo</th>
                          <th className="py-3 px-4">Motivo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-[#27272A]">
                        {auditorias.map((aud) => (
                          <tr
                            key={aud.id}
                            className="hover:bg-slate-100/70 dark:hover:bg-[#18181B]/80"
                          >
                            <td className="py-3 px-4 text-slate-500">{formatDate(aud.created)}</td>
                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                              {aud.operador}
                            </td>
                            <td className="py-3 px-4 text-[#7c3aed] dark:text-[#C084FC]">
                              {aud.acao}
                            </td>
                            <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                              {aud.alvo || '-'}
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-[11px]">
                              {aud.motivo || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Nova Matrícula */}
      {showNovaMatriculaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#18181B] rounded-[16px] border border-slate-200 dark:border-[#27272A] p-6 space-y-4">
            <h3 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
              Cadastrar Nova Matrícula
            </h3>
            <form onSubmit={handleCriarMatricula} className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium">E-mail da aluna (compra)*</label>
                <Input
                  type="email"
                  required
                  placeholder="aluna@exemplo.com"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-medium">Nome completo (opcional)</label>
                <Input
                  type="text"
                  placeholder="Nome da aluna"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-mono font-medium">Ciclo / Turma</label>
                  <Input
                    type="text"
                    value={novoCiclo}
                    onChange={(e) => setNovoCiclo(e.target.value)}
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-medium">Data Término (opcional)</label>
                  <Input
                    type="date"
                    value={novoFim}
                    onChange={(e) => setNovoFim(e.target.value)}
                    className="mt-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-medium">Anotação interna</label>
                <Input
                  type="text"
                  placeholder="Ex: Pagamento confirmado via Hotmart"
                  value={novaAnotacao}
                  onChange={(e) => setNovaAnotacao(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNovaMatriculaModal(false)}
                  className="text-xs font-mono"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={salvandoMatricula}
                  className="text-xs font-mono bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
                >
                  {salvandoMatricula ? 'Salvando...' : 'Salvar Matrícula'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmação Alterar Status Matrícula */}
      <AlertDialog
        open={!!targetMatricula}
        onOpenChange={(open) => !open && setTargetMatricula(null)}
      >
        <AlertDialogContent className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans text-lg font-semibold">
              Confirmar alteração de matrícula
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600 dark:text-[#A1A1AA] pt-1">
              Deseja alterar o status da matrícula de{' '}
              <strong className="text-slate-900 dark:text-white">
                {targetMatricula?.mat.email}
              </strong>{' '}
              para <strong className="uppercase">{targetMatricula?.novoStatus}</strong>?
              {targetMatricula?.novoStatus === 'suspensa' &&
                ' A aluna perderá imediatamente o acesso aos cadernos pagos na próxima requisição.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs font-mono">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarStatusMatricula}
              className="text-xs font-mono bg-[#7c3aed] text-white"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmação Desativar Conta de Usuária */}
      <AlertDialog open={!!targetUser} onOpenChange={(open) => !open && setTargetUser(null)}>
        <AlertDialogContent className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans text-lg font-semibold">
              Alterar status da conta
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600 dark:text-[#A1A1AA]">
              Deseja alterar o acesso da conta de {targetUser?.email}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs font-mono">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleUserStatus}
              className="text-xs font-mono bg-[#7c3aed] text-white"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminDashboard
