export interface MatriculaExpirationInfo {
  isExpired: boolean
  isExpiringSoon: boolean // faltam 15 dias ou menos
  daysRemaining: number | null // positivo = faltam N dias; negativo = venceu há N dias; null = sem data
  statusEfetivo: 'ativa' | 'suspensa' | 'expirada'
  badgeText: string
  badgeVariant: 'default' | 'success' | 'warning' | 'destructive' | 'outline'
}

/**
 * Normaliza uma data de término (string YYYY-MM-DD ou ISO) para o fim do dia local ou UTC
 */
export function parseFimDate(fimIso?: string | null): Date | null {
  if (!fimIso || !fimIso.trim()) return null
  const trimmed = fimIso.trim()
  // Se for apenas data YYYY-MM-DD, interpreta no fim do dia (23:59:59.999)
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-').map(Number)
    return new Date(y, m - 1, d, 23, 59, 59, 999)
  }
  const parsed = new Date(trimmed)
  return isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Calcula a situação de expiração de uma matrícula considerando seu status e data fim.
 */
export function getMatriculaExpiration(
  status: 'ativa' | 'suspensa' | 'expirada',
  fimIso?: string | null,
  referenceDate: Date = new Date(),
): MatriculaExpirationInfo {
  const fimDate = parseFimDate(fimIso)

  if (!fimDate) {
    return {
      isExpired: status === 'expirada',
      isExpiringSoon: false,
      daysRemaining: null,
      statusEfetivo: status,
      badgeText:
        status === 'ativa' ? 'Acesso ilimitado' : status === 'suspensa' ? 'Suspensa' : 'Expirada',
      badgeVariant:
        status === 'ativa' ? 'success' : status === 'suspensa' ? 'warning' : 'destructive',
    }
  }

  const diffMs = fimDate.getTime() - referenceDate.getTime()
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  const isExpired = daysRemaining < 0
  const isExpiringSoon = !isExpired && daysRemaining <= 15

  let statusEfetivo: 'ativa' | 'suspensa' | 'expirada' = status
  if (isExpired) {
    statusEfetivo = 'expirada'
  }

  let badgeText = ''
  let badgeVariant: MatriculaExpirationInfo['badgeVariant'] = 'default'

  if (status === 'suspensa') {
    badgeText = 'Suspensa manual'
    badgeVariant = 'warning'
  } else if (isExpired) {
    const absDays = Math.abs(daysRemaining)
    badgeText = absDays === 0 ? 'Venceu hoje' : `Vencida há ${absDays}d`
    badgeVariant = 'destructive'
  } else if (isExpiringSoon) {
    badgeText =
      daysRemaining === 0
        ? 'Vence hoje'
        : daysRemaining === 1
          ? 'Vence amanhã'
          : `Expira em ${daysRemaining}d`
    badgeVariant = 'warning'
  } else {
    badgeText = `${daysRemaining}d restantes`
    badgeVariant = 'outline'
  }

  return {
    isExpired,
    isExpiringSoon,
    daysRemaining,
    statusEfetivo,
    badgeText,
    badgeVariant,
  }
}

/**
 * Validação prévia ao salvar matrícula: se a data estiver no passado e o status pretendido for 'ativa',
 * retorna recomendação para converter em 'expirada' ou bloqueio.
 */
export function shouldForceExpiredStatus(
  statusPretendido: 'ativa' | 'suspensa' | 'expirada',
  fimIso?: string | null,
  referenceDate: Date = new Date(),
): boolean {
  if (statusPretendido !== 'ativa') return false
  const exp = getMatriculaExpiration(statusPretendido, fimIso, referenceDate)
  return exp.isExpired
}
