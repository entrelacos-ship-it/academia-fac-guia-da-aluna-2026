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
  Edit,
  Trash2,
  CheckSquare,
  Square,
  KeyRound,
} from 'lucide-react'
import { getMatriculaExpiration, shouldForceExpiredStatus } from '@/lib/matriculaExpiration'
import { useNavigate, Link } from 'react-router-dom'
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
import { HubService, HubItem } from '@/services/hubService'

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

  // Aba selecionada: 'pecas' ou 'matriculas' ou 'encontros' ou 'usuarios' ou 'auditoria'
  const [activeTab, setActiveTab] = useState<
    'pecas' | 'matriculas' | 'encontros' | 'usuarios' | 'auditoria'
  >('pecas')

  // Estado Peças do Hub
  const [hubItems, setHubItems] = useState<HubItem[]>([])
  const [targetToggleItem, setTargetToggleItem] = useState<{
    item: HubItem
    novoAtivo: boolean
  } | null>(null)
  const [editingBadges, setEditingBadges] = useState<Record<string, string>>({})
  const [savingBadgeChave, setSavingBadgeChave] = useState<string | null>(null)
  const [togglingChave, setTogglingChave] = useState<string | null>(null)

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

  // Edição completa de matrícula existente
  const [editingMatricula, setEditingMatricula] = useState<MatriculaRecord | null>(null)
  const [editEmail, setEditEmail] = useState('')
  const [editNome, setEditNome] = useState('')
  const [editCiclo, setEditCiclo] = useState('')
  const [editStatus, setEditStatus] = useState<'ativa' | 'suspensa' | 'expirada'>('ativa')
  const [editFim, setEditFim] = useState('')
  const [editAnotacao, setEditAnotacao] = useState('')
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)

  // Exclusão permanente de matrícula existente
  const [deletingMatricula, setDeletingMatricula] = useState<MatriculaRecord | null>(null)
  const [deleteConfirmTyped, setDeleteConfirmTyped] = useState('')
  const [excluindoMatricula, setExcluindoMatricula] = useState(false)

  // Seleção múltipla para ações em lote
  const [selectedMatriculaIds, setSelectedMatriculaIds] = useState<string[]>([])
  const [executandoAcaoLote, setExecutandoAcaoLote] = useState(false)

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

      // 5. Peças do Hub
      try {
        const hubList = await HubService.listarItens(true)
        setHubItems(hubList)
        const initialBadges: Record<string, string> = {}
        for (const it of hubList) {
          initialBadges[it.chave] = it.rotulo_badge || ''
        }
        setEditingBadges(initialBadges)
      } catch (hubErr) {
        console.warn('Erro ao carregar fac_hub_items:', hubErr)
      }

      // 6. Auditoria
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

  // Alternar status de liberação de peça do Hub
  const handleConfirmToggleItem = async () => {
    if (!targetToggleItem) return
    const { item, novoAtivo } = targetToggleItem
    setTogglingChave(item.chave)
    setErrorMessage(null)
    setSuccessActionMessage(null)

    try {
      const res = await HubService.adminToggleItem({
        chave: item.chave,
        ativo: novoAtivo,
      })

      if (res.success) {
        setSuccessActionMessage(
          novoAtivo
            ? `Peça "${item.titulo}" foi ativada e está visível no Hub.`
            : `Peça "${item.titulo}" foi desligada e está oculta das alunas.`,
        )
        // Recarregar lista imediatamente
        const updatedList = await HubService.listarItens(true)
        setHubItems(updatedList)
        setTargetToggleItem(null)
      } else {
        setErrorMessage(res.message || 'Falha ao alterar liberação da peça.')
      }
    } catch (err) {
      setErrorMessage(`Erro ao alterar liberação da peça: ${getErrorMessage(err)}`)
    } finally {
      setTogglingChave(null)
    }
  }

  // Clicou no toggle: se for DESLIGAR, pede confirmação no diálogo; se for LIGAR, liga direto
  const handleInitiateToggleItem = (item: HubItem) => {
    const novoAtivo = !item.ativo
    if (!novoAtivo) {
      // Confirmar ao desligar porque oculta de todas as alunas
      setTargetToggleItem({ item, novoAtivo: false })
    } else {
      // Ligar imediatamente
      setTogglingChave(item.chave)
      HubService.adminToggleItem({
        chave: item.chave,
        ativo: true,
      })
        .then(async (res) => {
          if (res.success) {
            setSuccessActionMessage(`Peça "${item.titulo}" foi reativada com sucesso.`)
            const updatedList = await HubService.listarItens(true)
            setHubItems(updatedList)
          } else {
            setErrorMessage(res.message || 'Erro ao reativar peça.')
          }
        })
        .catch((err) => {
          setErrorMessage(`Erro ao reativar peça: ${getErrorMessage(err)}`)
        })
        .finally(() => {
          setTogglingChave(null)
        })
    }
  }

  // Salvar novo rótulo do badge de uma peça
  const handleSaveBadge = async (item: HubItem) => {
    const novoRotulo = (editingBadges[item.chave] ?? item.rotulo_badge ?? '').trim()
    setSavingBadgeChave(item.chave)
    setErrorMessage(null)
    setSuccessActionMessage(null)

    try {
      const res = await HubService.adminToggleItem({
        chave: item.chave,
        rotulo_badge: novoRotulo,
      })

      if (res.success) {
        setSuccessActionMessage(`Rótulo da peça "${item.titulo}" atualizado para "${novoRotulo}".`)
        const updatedList = await HubService.listarItens(true)
        setHubItems(updatedList)
        setEditingBadges((prev) => ({
          ...prev,
          [item.chave]: novoRotulo,
        }))
      } else {
        setErrorMessage(res.message || 'Erro ao salvar rótulo.')
      }
    } catch (err) {
      setErrorMessage(`Erro ao salvar rótulo: ${getErrorMessage(err)}`)
    } finally {
      setSavingBadgeChave(null)
    }
  }

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

  // Abrir modal de edição com dados pré-preenchidos
  const handleOpenEditMatricula = (mat: MatriculaRecord) => {
    setEditingMatricula(mat)
    setEditEmail(mat.email || '')
    setEditNome(mat.nome || '')
    setEditCiclo(mat.ciclo || 'Ciclo FAC 2026')
    setEditStatus(mat.status || 'ativa')
    // Se a data de fim for ISO completa, pega apenas o YYYY-MM-DD para o input date
    const fimDateStr = mat.fim ? mat.fim.slice(0, 10) : ''
    setEditFim(fimDateStr)
    setEditAnotacao(mat.anotacao || '')
  }

  // Salvar edição de matrícula existente
  const handleSalvarEdicaoMatricula = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMatricula) return

    const cleanEmail = editEmail.trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      alert('Informe um e-mail válido.')
      return
    }

    // Conferir se não está criando duplicata de e-mail com outra matrícula
    const duplicata = matriculas.find(
      (m) => m.id !== editingMatricula.id && m.email.toLowerCase() === cleanEmail,
    )
    if (duplicata) {
      alert(`Já existe outra matrícula cadastrada com o e-mail "${cleanEmail}".`)
      return
    }

    // Se o prazo estiver vencido e a usuária tentar salvar como ativa, forçar 'expirada'
    let statusFinal = editStatus
    if (shouldForceExpiredStatus(statusFinal, editFim)) {
      statusFinal = 'expirada'
    }

    setSalvandoEdicao(true)
    try {
      const valoresAnteriores = {
        email: editingMatricula.email,
        nome: editingMatricula.nome,
        ciclo: editingMatricula.ciclo,
        status: editingMatricula.status,
        fim: editingMatricula.fim,
        anotacao: editingMatricula.anotacao,
      }

      const valoresNovos = {
        email: cleanEmail,
        nome: editNome.trim() || undefined,
        ciclo: editCiclo.trim() || 'Ciclo FAC 2026',
        status: statusFinal,
        fim: editFim ? `${editFim} 23:59:59.000Z` : undefined,
        anotacao: editAnotacao.trim() || undefined,
      }

      const updated = await pb
        .collection('fac_matriculas')
        .update<MatriculaRecord>(editingMatricula.id, valoresNovos)

      // Registrar auditoria detalhada com operador, valores anteriores e novos
      try {
        await pb.collection('fac_auditoria').create({
          operador: currentUser?.email || 'admin',
          acao: 'editar_matricula',
          alvo: cleanEmail,
          motivo: 'Atualização cadastral no painel administrativo',
          detalhes: {
            matricula_id: editingMatricula.id,
            anteriores: valoresAnteriores,
            novos: valoresNovos,
          },
        })
      } catch {
        /* intentionally ignored */
      }

      setMatriculas((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
      setSuccessActionMessage(`Matrícula de ${cleanEmail} atualizada com sucesso!`)
      setEditingMatricula(null)
    } catch (err) {
      alert(`Erro ao salvar edição: ${getErrorMessage(err)}`)
    } finally {
      setSalvandoEdicao(false)
    }
  }

  // Abrir diálogo de exclusão permanente
  const handleOpenDeleteMatricula = (mat: MatriculaRecord) => {
    setDeletingMatricula(mat)
    setDeleteConfirmTyped('')
  }

  // Executar exclusão permanente de matrícula com auditoria
  const handleConfirmarExclusaoMatricula = async () => {
    if (!deletingMatricula) return

    setExcluindoMatricula(true)
    try {
      const emailExcluido = deletingMatricula.email
      const backupDados = { ...deletingMatricula }

      await pb.collection('fac_matriculas').delete(deletingMatricula.id)

      // Registrar auditoria de exclusão
      try {
        await pb.collection('fac_auditoria').create({
          operador: currentUser?.email || 'admin',
          acao: 'excluir_matricula_permanente',
          alvo: emailExcluido,
          motivo: 'Exclusão definitiva solicitada no painel administrativo',
          detalhes: {
            matricula_id: deletingMatricula.id,
            dados_removidos: backupDados,
          },
        })
      } catch {
        /* intentionally ignored */
      }

      setMatriculas((prev) => prev.filter((m) => m.id !== deletingMatricula.id))
      setSelectedMatriculaIds((prev) => prev.filter((id) => id !== deletingMatricula.id))
      setSuccessActionMessage(`Matrícula de ${emailExcluido} excluída permanentemente.`)
      setDeletingMatricula(null)
    } catch (err) {
      alert(`Erro ao excluir matrícula: ${getErrorMessage(err)}`)
    } finally {
      setExcluindoMatricula(false)
    }
  }

  // Ações em lote nas matrículas selecionadas
  const handleExecutarAcaoEmLote = async (acao: 'suspender' | 'reativar') => {
    if (selectedMatriculaIds.length === 0) return
    const novoStatus = acao === 'suspender' ? 'suspensa' : 'ativa'

    const confirmMsg = `Deseja ${acao === 'suspender' ? 'suspender' : 'reativar'} as ${
      selectedMatriculaIds.length
    } matrículas selecionadas?`
    if (!window.confirm(confirmMsg)) return

    setExecutandoAcaoLote(true)
    let sucessos = 0
    try {
      for (const id of selectedMatriculaIds) {
        const mat = matriculas.find((m) => m.id === id)
        if (!mat) continue
        try {
          await pb.collection('fac_matriculas').update(id, { status: novoStatus })
          sucessos++
        } catch (itemErr) {
          console.warn('Erro ao atualizar em lote:', id, itemErr)
        }
      }

      // Trilha de auditoria da ação em lote
      try {
        await pb.collection('fac_auditoria').create({
          operador: currentUser?.email || 'admin',
          acao: `lote_${acao}_matriculas`,
          alvo: `${sucessos} alunas`,
          motivo: `Ação em lote: ${acao} matrículas selecionadas`,
          detalhes: { total: selectedMatriculaIds.length, alteradas: sucessos, novoStatus },
        })
      } catch {
        /* intentionally ignored */
      }

      // Atualizar lista local
      setMatriculas((prev) =>
        prev.map((m) => (selectedMatriculaIds.includes(m.id) ? { ...m, status: novoStatus } : m)),
      )
      setSuccessActionMessage(`${sucessos} matrículas foram atualizadas para "${novoStatus}".`)
      setSelectedMatriculaIds([])
    } finally {
      setExecutandoAcaoLote(false)
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

    // Conferir duplicata
    const jaExiste = matriculas.find((m) => m.email.toLowerCase() === cleanEmail)
    if (jaExiste) {
      alert(`Já existe matrícula para ${cleanEmail} com status: ${jaExiste.status}.`)
      return
    }

    // Se o prazo informado estiver no passado, cadastra como expirada automaticamente
    let statusInicial: 'ativa' | 'expirada' = 'ativa'
    if (shouldForceExpiredStatus('ativa', novoFim)) {
      statusInicial = 'expirada'
    }

    setSalvandoMatricula(true)
    try {
      const fimCompleto = novoFim ? `${novoFim} 23:59:59.000Z` : undefined
      const novaRec = await pb.collection('fac_matriculas').create<MatriculaRecord>({
        email: cleanEmail,
        nome: novoNome.trim() || undefined,
        status: statusInicial,
        ciclo: novoCiclo.trim() || 'Ciclo FAC 2026',
        fim: fimCompleto,
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
          detalhes: { ciclo: novoCiclo, status: statusInicial, fim: fimCompleto },
        })
      } catch {
        /* intentionally ignored */
      }

      setMatriculas((prev) => [novaRec, ...prev])
      setSuccessActionMessage(
        statusInicial === 'expirada'
          ? `Matrícula de ${cleanEmail} cadastrada com status EXPIRADA (prazo informado já vencido).`
          : `Matrícula de ${cleanEmail} cadastrada com sucesso!`,
      )
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
    let ativas = 0
    let suspensas = 0
    let expiradas = 0
    let expirandoEmBreve = 0

    for (const m of matriculas) {
      const exp = getMatriculaExpiration(m.status, m.fim)
      if (exp.statusEfetivo === 'ativa') {
        ativas++
        if (exp.isExpiringSoon) {
          expirandoEmBreve++
        }
      } else if (exp.statusEfetivo === 'suspensa') {
        suspensas++
      } else {
        expiradas++
      }
    }

    return { total, ativas, suspensas, expiradas, expirandoEmBreve }
  }, [matriculas])

  // Filtragem de Matrículas
  const matriculasFiltradas = useMemo(() => {
    return matriculas.filter((m) => {
      const q = searchMatricula.toLowerCase().trim()
      const matchSearch =
        !q || m.email.toLowerCase().includes(q) || m.nome?.toLowerCase().includes(q)

      const exp = getMatriculaExpiration(m.status, m.fim)
      const matchStatus =
        matriculaStatusFilter === 'todas' ? true : exp.statusEfetivo === matriculaStatusFilter

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
            <Link
              to="/perfil"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-xs font-mono font-semibold bg-slate-100 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:border-[#7c3aed]/40 transition-colors"
              title="Configurações e troca de senha"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC]" />
              <span className="hidden sm:inline">PERFIL & SENHA</span>
            </Link>

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
            variant={activeTab === 'pecas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('pecas')}
            className={`font-mono text-xs rounded-[8px] gap-1.5 ${
              activeTab === 'pecas'
                ? 'bg-[#7c3aed] text-white dark:bg-[#C084FC] dark:text-[#0A0A14]'
                : ''
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
            <span>Liberação de peças ({hubItems.length})</span>
          </Button>

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

        {/* ================= ABA 0: LIBERAÇÃO DE PEÇAS DO HUB ================= */}
        {activeTab === 'pecas' && (
          <div className="space-y-6">
            <div className="p-4 sm:p-6 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#27272A]">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#ea580c] dark:text-[#FB923C]" />
                    Controle de Liberação das Peças do Hub
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-[#A1A1AA] mt-0.5">
                    Ligue ou desligue módulos da Academia instantaneamente e personalize os rótulos
                    de status (ex.: &quot;Em construção&quot;, &quot;Em breve&quot;,
                    &quot;Disponível&quot;).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="font-mono text-xs bg-purple-50 dark:bg-[#0A0A14] text-[#7c3aed] border-purple-200">
                    {hubItems.filter((it) => it.ativo).length} ativas / {hubItems.length}{' '}
                    cadastradas
                  </Badge>
                </div>
              </div>

              {/* Agrupamento por Bloco: Hero / Sistema / Material */}
              {(
                [
                  {
                    blocoKey: 'hero',
                    blocoTitulo: '1. Percurso Pedagógico Principal (Hero)',
                    blocoDesc: 'Card principal de destaque no topo da página inicial do Hub.',
                  },
                  {
                    blocoKey: 'sistema',
                    blocoTitulo: '2. Bloco Sistema (Aplicações Clínicas)',
                    blocoDesc:
                      'Calculadora de Precificação, IKIGAI e aplicações interativas da aluna.',
                  },
                  {
                    blocoKey: 'material',
                    blocoTitulo: '3. Bloco Material & Tutoriais',
                    blocoDesc: 'Cadernos, vídeos de suporte e recursos de estudo continuado.',
                  },
                ] as const
              ).map(({ blocoKey, blocoTitulo, blocoDesc }) => {
                const itensDoBloco = hubItems
                  .filter((it) => it.bloco === blocoKey)
                  .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))

                return (
                  <div key={blocoKey} className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-1 border-b border-slate-100 dark:border-[#27272A]/70">
                      <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                        {blocoTitulo}
                      </h4>
                      <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
                        {blocoDesc}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {itensDoBloco.map((item) => {
                        const isToggling = togglingChave === item.chave
                        const isSavingBadge = savingBadgeChave === item.chave
                        const currentBadgeValue =
                          editingBadges[item.chave] ?? item.rotulo_badge ?? ''
                        const badgeMudou =
                          currentBadgeValue.trim() !== (item.rotulo_badge ?? '').trim()

                        return (
                          <div
                            key={item.id}
                            className={`p-4 rounded-[14px] border transition-all ${
                              item.ativo
                                ? 'bg-slate-50/70 dark:bg-[#121216] border-slate-200 dark:border-[#27272A]'
                                : 'bg-rose-50/40 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40 opacity-90'
                            }`}
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              {/* Informações da Peça */}
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-sans font-semibold text-base text-slate-900 dark:text-white">
                                    {item.titulo}
                                  </span>
                                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-[4px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-slate-500">
                                    chave:{' '}
                                    <code className="text-[#7c3aed] dark:text-[#C084FC]">
                                      {item.chave}
                                    </code>
                                  </span>
                                  {item.exclusivo_alunas && (
                                    <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[10px] font-mono gap-1">
                                      <Lock className="w-3 h-3" />
                                      <span>Exclusivo para alunas</span>
                                    </Badge>
                                  )}
                                  {item.ativo ? (
                                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono uppercase">
                                      Ligada (Visível)
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 text-[10px] font-mono uppercase">
                                      Desligada (Oculta)
                                    </Badge>
                                  )}
                                </div>

                                <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed max-w-3xl">
                                  {item.descricao || 'Sem descrição cadastrada.'}
                                </p>

                                <div className="text-[11px] font-mono text-slate-500 flex flex-wrap items-center gap-3 pt-0.5">
                                  <span>Ordem: #{item.ordem ?? '-'}</span>
                                  <span>Ícone: {item.icone || '-'}</span>
                                  {item.url && <span>Rota: {item.url}</span>}
                                </div>
                              </div>

                              {/* Ações: Edição do Rótulo do Badge e Toggle de Ativação */}
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 lg:pl-4 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-[#27272A] pt-3 lg:pt-0">
                                {/* Campo editável para o rótulo do badge */}
                                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                                      Rótulo do Badge
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <Input
                                        type="text"
                                        placeholder="Ex: Em breve"
                                        value={currentBadgeValue}
                                        onChange={(e) => {
                                          const val = e.target.value
                                          setEditingBadges((prev) => ({
                                            ...prev,
                                            [item.chave]: val,
                                          }))
                                        }}
                                        className="h-8 text-xs font-mono w-40 bg-white dark:bg-[#18181B] border-slate-300 dark:border-[#27272A] rounded-[6px]"
                                      />
                                      {badgeMudou && (
                                        <Button
                                          size="sm"
                                          disabled={isSavingBadge}
                                          onClick={() => handleSaveBadge(item)}
                                          className="h-8 px-2.5 text-xs font-mono bg-[#7c3aed] text-white hover:bg-[#6d28d9] rounded-[6px]"
                                          title="Salvar novo rótulo do badge"
                                        >
                                          {isSavingBadge ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                          ) : (
                                            'Salvar'
                                          )}
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Botão Toggle com confirmação */}
                                <div className="flex flex-col w-full sm:w-auto">
                                  <span className="text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                                    Disponibilidade
                                  </span>
                                  <Button
                                    size="sm"
                                    disabled={isToggling}
                                    variant={item.ativo ? 'outline' : 'default'}
                                    onClick={() => handleInitiateToggleItem(item)}
                                    className={`h-8 font-mono text-xs rounded-[6px] gap-1.5 min-w-[120px] ${
                                      item.ativo
                                        ? 'border-rose-300 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    }`}
                                  >
                                    {isToggling ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : item.ativo ? (
                                      <>
                                        <EyeOff className="w-3.5 h-3.5" />
                                        <span>Desligar</span>
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Ligar Peça</span>
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ================= ABA 1: MATRÍCULAS DO GUIA ================= */}
        {activeTab === 'matriculas' && (
          <div className="space-y-6">
            {/* Cards de Métricas de Matrículas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px]">
                <CardHeader className="pb-1">
                  <CardTitle className="text-[11px] font-mono uppercase text-slate-500">
                    Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-mono font-bold">
                    {metricasMatriculas.total}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px]">
                <CardHeader className="pb-1">
                  <CardTitle className="text-[11px] font-mono uppercase text-emerald-600 dark:text-emerald-400">
                    Ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {metricasMatriculas.ativas}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px]">
                <CardHeader className="pb-1">
                  <CardTitle className="text-[11px] font-mono uppercase text-amber-600 dark:text-amber-400">
                    Suspensas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-600 dark:text-amber-400">
                    {metricasMatriculas.suspensas}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px]">
                <CardHeader className="pb-1">
                  <CardTitle className="text-[11px] font-mono uppercase text-rose-600 dark:text-rose-400">
                    Expiradas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-rose-600 dark:text-rose-400">
                    {metricasMatriculas.expiradas}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px]">
                <CardHeader className="pb-1">
                  <CardTitle className="text-[11px] font-mono uppercase text-purple-600 dark:text-[#C084FC] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#ea580c] dark:text-[#FB923C]" />
                    <span>A Vencer (≤15d)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-purple-600 dark:text-[#C084FC]">
                    {metricasMatriculas.expirandoEmBreve}
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

              {/* Filtros, Busca e Barra de Ações em Lote */}
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

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Botões de Ação em Lote quando houver itens selecionados */}
                  {selectedMatriculaIds.length > 0 && (
                    <div className="flex items-center gap-1.5 p-1 rounded-[8px] bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-[#7c3aed]/50 text-xs font-mono">
                      <span className="text-[#7c3aed] dark:text-[#C084FC] font-semibold px-1.5">
                        {selectedMatriculaIds.length} selecionadas:
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={executandoAcaoLote}
                        onClick={() => handleExecutarAcaoEmLote('reativar')}
                        className="h-7 px-2 text-[11px] font-mono text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/60"
                      >
                        Ativar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={executandoAcaoLote}
                        onClick={() => handleExecutarAcaoEmLote('suspender')}
                        className="h-7 px-2 text-[11px] font-mono text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/60"
                      >
                        Suspender
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedMatriculaIds([])}
                        className="h-7 px-2 text-[11px] font-mono text-slate-500 hover:text-slate-800"
                      >
                        Limpar
                      </Button>
                    </div>
                  )}

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
              </div>

              {/* Tabela de Matrículas com CRUD Completo e Indicadores de Expiração */}
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
                          <th className="py-3 px-3 w-10 text-center">
                            <input
                              type="checkbox"
                              aria-label="Selecionar todas as matrículas visíveis"
                              checked={
                                matriculasFiltradas.length > 0 &&
                                matriculasFiltradas.every((m) =>
                                  selectedMatriculaIds.includes(m.id),
                                )
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedMatriculaIds(matriculasFiltradas.map((m) => m.id))
                                } else {
                                  setSelectedMatriculaIds([])
                                }
                              }}
                              className="rounded-[4px] border-slate-300 dark:border-[#27272A]"
                            />
                          </th>
                          <th className="py-3 px-4">Aluna / E-mail</th>
                          <th className="py-3 px-4">Ciclo</th>
                          <th className="py-3 px-4">Status & Situação</th>
                          <th className="py-3 px-4">Prazo de Vigência</th>
                          <th className="py-3 px-4">Origem / Obs</th>
                          <th className="py-3 px-4 text-right">Ações do CRUD</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-[#27272A]">
                        {matriculasFiltradas.map((mat) => {
                          const expInfo = getMatriculaExpiration(mat.status, mat.fim)
                          const isSelected = selectedMatriculaIds.includes(mat.id)

                          return (
                            <tr
                              key={mat.id}
                              className={`hover:bg-slate-100/70 dark:hover:bg-[#18181B]/80 transition-colors ${
                                isSelected ? 'bg-purple-50/40 dark:bg-purple-950/20' : ''
                              }`}
                            >
                              <td className="py-3 px-3 text-center">
                                <input
                                  type="checkbox"
                                  aria-label={`Selecionar ${mat.email}`}
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedMatriculaIds((prev) => [...prev, mat.id])
                                    } else {
                                      setSelectedMatriculaIds((prev) =>
                                        prev.filter((id) => id !== mat.id),
                                      )
                                    }
                                  }}
                                  className="rounded-[4px] border-slate-300 dark:border-[#27272A]"
                                />
                              </td>

                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <span>{mat.email}</span>
                                    {mat.anotacao && (
                                      <span
                                        title={`Anotação: ${mat.anotacao}`}
                                        className="inline-block w-2 h-2 rounded-full bg-purple-500"
                                      />
                                    )}
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
                                <div className="space-y-1">
                                  {mat.status === 'ativa' && !expInfo.isExpired && (
                                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                                      Ativa
                                    </Badge>
                                  )}
                                  {mat.status === 'suspensa' && (
                                    <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] font-mono">
                                      Suspensa
                                    </Badge>
                                  )}
                                  {(mat.status === 'expirada' || expInfo.isExpired) && (
                                    <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[10px] font-mono">
                                      Expirada
                                    </Badge>
                                  )}

                                  {/* Indicador de prazo em dias */}
                                  <div className="text-[10px] font-mono">
                                    {expInfo.isExpired && (
                                      <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        {expInfo.badgeText}
                                      </span>
                                    )}
                                    {expInfo.isExpiringSoon && (
                                      <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {expInfo.badgeText}
                                      </span>
                                    )}
                                    {!expInfo.isExpired && !expInfo.isExpiringSoon && mat.fim && (
                                      <span className="text-slate-500">{expInfo.badgeText}</span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4 font-mono text-slate-600 dark:text-[#A1A1AA]">
                                <div>
                                  <span>
                                    {mat.fim ? formatDate(mat.fim) : 'Vitalício / Sem prazo'}
                                  </span>
                                  {mat.fim && (
                                    <p className="text-[10px] text-slate-400">
                                      {mat.fim.slice(0, 10)}
                                    </p>
                                  )}
                                </div>
                              </td>

                              <td className="py-3 px-4 text-[11px] font-mono text-slate-500">
                                <div>
                                  <span>{mat.origem || 'Painel'}</span>
                                  {mat.anotacao && (
                                    <p
                                      className="text-[10px] text-slate-400 truncate max-w-[140px]"
                                      title={mat.anotacao}
                                    >
                                      Obs: {mat.anotacao}
                                    </p>
                                  )}
                                </div>
                              </td>

                              {/* Ações completas de CRUD: Editar, Excluir, Alternar Status */}
                              <td className="py-3 px-4 text-right space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenEditMatricula(mat)}
                                  className="text-[11px] font-mono text-[#7c3aed] hover:bg-purple-50 dark:hover:bg-purple-950/40 h-7 px-2 gap-1"
                                  title="Editar dados da matrícula"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>Editar</span>
                                </Button>

                                {mat.status !== 'ativa' && !expInfo.isExpired && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setTargetMatricula({ mat, novoStatus: 'ativa' })}
                                    className="text-[11px] font-mono text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 h-7 px-2"
                                    title="Reativar acesso"
                                  >
                                    Ativar
                                  </Button>
                                )}

                                {mat.status === 'ativa' && !expInfo.isExpired && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setTargetMatricula({ mat, novoStatus: 'suspensa' })
                                    }
                                    className="text-[11px] font-mono text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 h-7 px-2"
                                    title="Suspender acesso"
                                  >
                                    Suspender
                                  </Button>
                                )}

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenDeleteMatricula(mat)}
                                  className="text-[11px] font-mono text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 h-7 px-2 gap-1"
                                  title="Excluir matrícula permanentemente"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span className="hidden sm:inline">Excluir</span>
                                </Button>
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
                            <td className="py-3 px-4">
                              {aud.acao === 'envio_codigo_ok' ? (
                                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                                  envio_codigo_ok
                                </Badge>
                              ) : aud.acao === 'envio_codigo_falha' ? (
                                <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[10px] font-mono">
                                  envio_codigo_falha
                                </Badge>
                              ) : (
                                <span className="text-[#7c3aed] dark:text-[#C084FC]">
                                  {aud.acao}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                              {aud.alvo || '-'}
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-[11px]">
                              <div>{aud.motivo || '-'}</div>
                              {aud.detalhes &&
                                typeof aud.detalhes === 'object' &&
                                'remetente' in (aud.detalhes as Record<string, unknown>) && (
                                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                    remetente:{' '}
                                    {String((aud.detalhes as Record<string, unknown>).remetente)}
                                  </div>
                                )}
                              {aud.detalhes &&
                                typeof aud.detalhes === 'object' &&
                                'erro' in (aud.detalhes as Record<string, unknown>) && (
                                  <div className="text-[10px] text-rose-500 dark:text-rose-400 mt-0.5">
                                    erro: {String((aud.detalhes as Record<string, unknown>).erro)}
                                  </div>
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
                  {novoFim && shouldForceExpiredStatus('ativa', novoFim) && (
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-mono mt-1">
                      ⚠️ A data informada está no passado. A matrícula será cadastrada
                      automaticamente como <strong>EXPIRADA</strong>.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-medium">Anotação interna</label>{' '}
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

      {/* Modal Edição Completa de Matrícula (CRUD) */}
      {editingMatricula && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#18181B] rounded-[16px] border border-slate-200 dark:border-[#27272A] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272A] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-sans text-base font-semibold text-slate-900 dark:text-white">
                    Editar Matrícula da Aluna
                  </h3>
                  <p className="text-[11px] font-mono text-slate-500">ID: {editingMatricula.id}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingMatricula(null)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleSalvarEdicaoMatricula} className="space-y-3.5">
              <div>
                <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                  E-mail da aluna (normalizado)*
                </label>
                <Input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="mt-1 text-xs font-mono"
                  placeholder="aluna@exemplo.com"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Ao alterar o e-mail, a conferência de duplicatas é executada automaticamente.
                </p>
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                  Nome da aluna (opcional)
                </label>
                <Input
                  type="text"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  className="mt-1 text-xs"
                  placeholder="Nome completo da aluna"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                    Ciclo / Turma
                  </label>
                  <Input
                    type="text"
                    value={editCiclo}
                    onChange={(e) => setEditCiclo(e.target.value)}
                    className="mt-1 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                    Status Administrativo
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(e.target.value as 'ativa' | 'suspensa' | 'expirada')
                    }
                    className="mt-1 w-full h-9 px-3 rounded-[8px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-300 dark:border-[#27272A] text-xs font-mono text-slate-900 dark:text-white"
                  >
                    <option value="ativa">Ativa</option>
                    <option value="suspensa">Suspensa</option>
                    <option value="expirada">Expirada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                  Data de Fim do Acesso (Prazo de Expiração)
                </label>
                <Input
                  type="date"
                  value={editFim}
                  onChange={(e) => setEditFim(e.target.value)}
                  className="mt-1 text-xs font-mono"
                />
                {editFim ? (
                  <div className="mt-1 text-[11px] font-mono">
                    {shouldForceExpiredStatus('ativa', editFim) ? (
                      <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Data vencida no passado: o status será gravado como{' '}
                        <strong>EXPIRADA</strong>.
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Vigência válida até {editFim}.
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Deixe em branco para acesso vitalício/sem data limite.
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                  Anotação Administrativa Interna
                </label>
                <Input
                  type="text"
                  value={editAnotacao}
                  onChange={(e) => setEditAnotacao(e.target.value)}
                  placeholder="Ex: Renovação via WhatsApp em 2026 / Turma 3"
                  className="mt-1 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-[#27272A] flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingMatricula(null)}
                  className="text-xs font-mono"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={salvandoEdicao}
                  className="text-xs font-mono bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
                >
                  {salvandoEdicao ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diálogo de Exclusão Permanente de Matrícula (CRUD) */}
      <AlertDialog
        open={!!deletingMatricula}
        onOpenChange={(open) => !open && setDeletingMatricula(null)}
      >
        <AlertDialogContent className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans text-base font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span>Excluir Matrícula Definitivamente</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600 dark:text-[#A1A1AA] pt-2 space-y-2">
              <p>
                Você está prestes a excluir permanentemente a matrícula de{' '}
                <strong className="text-slate-900 dark:text-white">
                  {deletingMatricula?.email}
                </strong>
                {deletingMatricula?.nome && ` (${deletingMatricula.nome})`}.
              </p>
              <div className="p-3 rounded-[8px] bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300">
                <strong>Atenção:</strong> Esta ação é irreversível. A exclusão remove a aluna da
                base e revoga o acesso ao Guia imediatamente. Se deseja apenas bloquear
                temporariamente, use a opção <strong>Suspender</strong>.
              </div>
              <div className="pt-2">
                <label className="text-[11px] font-mono text-slate-700 dark:text-slate-300 block mb-1">
                  Digite <strong>EXCLUIR</strong> para habilitar a confirmação:
                </label>
                <Input
                  type="text"
                  placeholder="EXCLUIR"
                  value={deleteConfirmTyped}
                  onChange={(e) => setDeleteConfirmTyped(e.target.value)}
                  className="h-8 text-xs font-mono uppercase bg-slate-50 dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A]"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs font-mono">Cancelar</AlertDialogCancel>
            <Button
              type="button"
              disabled={deleteConfirmTyped.trim() !== 'EXCLUIR' || excluindoMatricula}
              onClick={handleConfirmarExclusaoMatricula}
              className="text-xs font-mono bg-rose-600 hover:bg-rose-700 text-white"
            >
              {excluindoMatricula ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Excluindo...
                </>
              ) : (
                'Confirmar Exclusão'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      {/* Confirmação Desligar Peça do Hub */}
      <AlertDialog
        open={!!targetToggleItem}
        onOpenChange={(open) => !open && setTargetToggleItem(null)}
      >
        <AlertDialogContent className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] rounded-[16px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans text-lg font-semibold flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5 text-[#ea580c] dark:text-[#FB923C]" />
              Confirmar desativação da peça
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600 dark:text-[#A1A1AA] pt-2 space-y-2">
              <p>
                Tem certeza de que deseja DESLIGAR a peça{' '}
                <strong className="text-slate-900 dark:text-white">
                  {targetToggleItem?.item.titulo}
                </strong>{' '}
                (chave:{' '}
                <code className="text-[#7c3aed] dark:text-[#C084FC]">
                  {targetToggleItem?.item.chave}
                </code>
                )?
              </p>
              <p className="p-2.5 rounded-[8px] bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                ⚠️ Ao desligar, esta peça deixará de aparecer para <strong>todas as alunas</strong>{' '}
                na página inicial do Hub imediatamente. Uma nova entrada será registrada na trilha
                de auditoria.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs font-mono">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmToggleItem}
              className="text-xs font-mono bg-rose-600 hover:bg-rose-700 text-white"
            >
              Confirmar e Desligar Peça
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmação Desativar Conta de Usuária */}
      <AlertDialog open={!!targetUser} onOpenChange={(open) => !open && setTargetUser(null)}>
        {' '}
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
