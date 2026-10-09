/**
 * Lista curada de termos de risco e heurística local de dados de paciente.
 * Roda ESTRITAMENTE no navegador da usuária.
 * Nenhum texto digitado é enviado à rede.
 */

// Padrões de risco em saúde mental para pausa obrigatória e acolhimento
export const TERMOS_RISCO_CURADOS = [
  'suicidio',
  'suicídio',
  'me matar',
  'acabar com tudo',
  'tirar minha vida',
  'desespero total',
  'nao aguento mais viver',
  'não aguento mais viver',
  'vontade de morrer',
  'desaparecer para sempre',
  'automutilacao',
  'automutilação',
]

export function detectarTermoDeRisco(texto: string): boolean {
  if (!texto) return false
  const lower = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  for (const termo of TERMOS_RISCO_CURADOS) {
    const termoNorm = termo.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (lower.includes(termoNorm)) {
      return true
    }
  }
  return false
}

export interface DeteccaoDadoPacienteResultado {
  detectado: boolean
  motivo?: string
}

/**
 * Heurística suave de detecção de dado de paciente:
 * - "meu paciente" ou "minha paciente" seguido de nome
 * - CPF (formato 000.000.000-00 ou 11 dígitos)
 * - Telefone com DDD
 * - Padrões explícitos com idade ("tem 34 anos", etc.)
 */
export function detectarDadoDePaciente(texto: string): DeteccaoDadoPacienteResultado {
  if (!texto) return { detectado: false }

  // Regex para CPF
  const cpfRegex = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/
  if (cpfRegex.test(texto)) {
    return {
      detectado: true,
      motivo:
        'Identificamos um padrão semelhante a CPF. Lembre-se de não registrar dados pessoais aqui.',
    }
  }

  // Regex para telefone brasileiro (10 ou 11 dígitos)
  const telRegex = /\b(?:\(?\d{2}\)?\s?)?(?:9\d{4}|\d{4})[-\s]?\d{4}\b/
  // Apenas se tiver padrão claro com parênteses ou hífen
  const telFormatadoRegex = /\(\d{2}\)\s?9?\d{4}[-\s]?\d{4}/
  if (telFormatadoRegex.test(texto)) {
    return {
      detectado: true,
      motivo: 'Identificamos um telefone com DDD. O mapa é exclusivo para o seu sentir e reflexão.',
    }
  }

  // Menção explícita a paciente
  const pacienteNomeRegex = /\b(meu|minha)\s+paciente\s+([A-Z][a-z]+)/i
  if (pacienteNomeRegex.test(texto)) {
    return {
      detectado: true,
      motivo:
        'Identificamos menção a paciente. Vamos voltar para você e para o seu próprio sentir.',
    }
  }

  // Idade explícita de paciente
  const idadeRegex = /\b(paciente\s+tem|tem)\s+\d{1,2}\s+anos\b/i
  if (idadeRegex.test(texto)) {
    return {
      detectado: true,
      motivo:
        'Identificamos dados clínicos de terceiros. Lembre-se de que o foco aqui é a sua prática.',
    }
  }

  return { detectado: false }
}
