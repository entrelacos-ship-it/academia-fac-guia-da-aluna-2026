/**
 * Utilitários para formatação e manipulação monetária em pt-BR (R$)
 */

export function formatBRL(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'R$ 0,00'
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatNumberBR(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0'
  }
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Converte string digitada para valor numérico float.
 * Trata formatos como "R$ 1.250,50", "1250.50", "1250,50", etc.
 */
export function parseCurrencyInput(input: string): number {
  if (!input) return 0
  const clean = input.replace(/[^\d,.-]/g, '').trim()
  if (!clean) return 0

  // Se tiver vírgula como decimal (padrão brasileiro)
  if (clean.includes(',')) {
    const normalized = clean.replace(/\./g, '').replace(',', '.')
    const parsed = parseFloat(normalized)
    return isNaN(parsed) ? 0 : parsed
  }

  const parsed = parseFloat(clean)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Formata um valor numérico para exibição simples no input (ex: "2.500,00" ou "2500")
 */
export function formatValueForInput(value: number): string {
  if (!value || value === 0) return ''
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Máscara dinâmica durante a digitação de centavos (estilo caixa eletrônico)
 * Ex: digita 250000 -> 2.500,00
 */
export function maskBRLTyping(rawInput: string): { display: string; numericValue: number } {
  const digits = rawInput.replace(/\D/g, '')
  if (!digits) {
    return { display: '', numericValue: 0 }
  }
  const numericValue = parseInt(digits, 10) / 100
  const display = formatValueForInput(numericValue)
  return { display, numericValue }
}
