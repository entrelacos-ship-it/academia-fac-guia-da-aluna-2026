import { describe, it, expect } from 'vitest'
import {
  parseFimDate,
  getMatriculaExpiration,
  shouldForceExpiredStatus,
} from './matriculaExpiration'

describe('matriculaExpiration engine', () => {
  const baseNow = new Date('2026-05-15T12:00:00.000Z')

  it('retorna ilimitado quando não há data de fim informada', () => {
    const res = getMatriculaExpiration('ativa', null, baseNow)
    expect(res.isExpired).toBe(false)
    expect(res.daysRemaining).toBeNull()
    expect(res.statusEfetivo).toBe('ativa')
    expect(res.badgeText).toBe('Acesso ilimitado')
  })

  it('detecta corretamente data vencida no passado', () => {
    // Venceu em 2026-05-10
    const res = getMatriculaExpiration('ativa', '2026-05-10', baseNow)
    expect(res.isExpired).toBe(true)
    expect(res.statusEfetivo).toBe('expirada')
    expect(res.daysRemaining).toBeLessThan(0)
    expect(res.badgeVariant).toBe('destructive')
    expect(res.badgeText).toContain('Vencida')
  })

  it('detecta expiração próxima (<= 15 dias)', () => {
    // Vence em 2026-05-20 (5 dias restantes)
    const res = getMatriculaExpiration('ativa', '2026-05-20', baseNow)
    expect(res.isExpired).toBe(false)
    expect(res.isExpiringSoon).toBe(true)
    expect(res.statusEfetivo).toBe('ativa')
    expect(res.daysRemaining).toBeGreaterThan(0)
    expect(res.daysRemaining).toBeLessThanOrEqual(15)
    expect(res.badgeVariant).toBe('warning')
    expect(res.badgeText).toContain('Expira em')
  })

  it('calcula dias restantes com folga (> 15 dias)', () => {
    // Vence em 2026-12-31
    const res = getMatriculaExpiration('ativa', '2026-12-31', baseNow)
    expect(res.isExpired).toBe(false)
    expect(res.isExpiringSoon).toBe(false)
    expect(res.daysRemaining).toBeGreaterThan(15)
    expect(res.badgeText).toContain('restantes')
  })

  it('respeita status suspensa manual mesmo se prazo for futuro', () => {
    const res = getMatriculaExpiration('suspensa', '2026-12-31', baseNow)
    expect(res.statusEfetivo).toBe('suspensa')
    expect(res.badgeText).toBe('Suspensa manual')
  })

  it('shouldForceExpiredStatus recomenda status expirada se a data de fim estiver vencida', () => {
    const forceExpired = shouldForceExpiredStatus('ativa', '2026-05-10', baseNow)
    expect(forceExpired).toBe(true)

    const notForced = shouldForceExpiredStatus('ativa', '2026-06-01', baseNow)
    expect(notForced).toBe(false)
  })
})
