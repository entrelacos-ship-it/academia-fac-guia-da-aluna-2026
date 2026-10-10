import React, { useState, useEffect, useRef } from 'react'
import {
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Copy,
  Download,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertTriangle,
  RotateCcw,
  Printer,
  Maximize2,
  Minimize2,
  Check,
  HelpCircle,
  Search,
  Target,
  FileCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  getUserStorageItem,
  setUserStorageItem,
  removeUserStorageItem,
} from '@/services/userStorage'

const STORAGE_KEY_ENCONTRO_2_DATA = 'entrelacos_fac_encontro_2_respostas_v1'
const STORAGE_KEY_ENCONTRO_2_STEP = 'entrelacos_fac_encontro_2_estacao_v1'

export interface Encontro2State {
  fraseDirecao: string // Estação 0 (até 280)
  chatGptProntoChecked: boolean // Estação 1
  skillsProntasChecked: boolean // Estação 2
  // Estação 4
  detetiveOfereceParaQuem: string
  detetiveComoProcuram: string
  detetiveProfissionaisConhecidos: string
  raioXNicho: string
  nivelConcorrentesMaisFalam: string
  nivelNinguemAtende: string
  // Estação 5
  brechaEscolhida: string
  motivoBrecha: string
  // Estação 6
  publicoFaixasEtarias: string[]
  publicoMacroareas: string[]
  publicoTiposAtendimento: string[]
  publicoContextoEspecifico: string
  publicoFraseTrabalho: string // até 200
  testeRespondiEmUmaFrase: boolean
  testeNaoEscreviTodoMundo: boolean
  testeLiEmVozAlta: boolean
  // Estação 7
  relatorioPosicionamento: string
}

export const INITIAL_ENCONTRO_2_STATE: Encontro2State = {
  fraseDirecao: '',
  chatGptProntoChecked: false,
  skillsProntasChecked: false,
  detetiveOfereceParaQuem: '',
  detetiveComoProcuram: '',
  detetiveProfissionaisConhecidos: '',
  raioXNicho: '',
  nivelConcorrentesMaisFalam: '',
  nivelNinguemAtende: '',
  brechaEscolhida: '',
  motivoBrecha: '',
  publicoFaixasEtarias: [],
  publicoMacroareas: [],
  publicoTiposAtendimento: [],
  publicoContextoEspecifico: '',
  publicoFraseTrabalho: '',
  testeRespondiEmUmaFrase: false,
  testeNaoEscreviTodoMundo: false,
  testeLiEmVozAlta: false,
  relatorioPosicionamento: '',
}

export const ESTACOES_CONFIG = [
  { id: 0, label: 'Porta de entrada', short: 'Entrada' },
  { id: 1, label: 'Sua conta no ChatGPT', short: 'ChatGPT' },
  { id: 2, label: 'Baixe e importe as skills', short: 'Skills' },
  { id: 3, label: 'A lente do dia', short: 'Teoria' },
  { id: 4, label: 'Detetive de Nicho', short: 'Detetive' },
  { id: 5, label: 'Escolha a sua brecha', short: 'Brecha' },
  { id: 6, label: 'Ficha de público-alvo', short: 'Público' },
  { id: 7, label: 'Relatório de posicionamento', short: 'Relatório' },
  { id: 8, label: 'Caderno de erros', short: 'Erros' },
  { id: 9, label: 'Fechamento', short: 'Fechamento' },
]

interface Encontro2CadernoProps {
  isAlunaValidada: boolean
  onValidarEmail: () => void
}

export const Encontro2Caderno: React.FC<Encontro2CadernoProps> = ({
  isAlunaValidada,
  onValidarEmail,
}) => {
  // Estado de respostas salvo no localStorage isolado por usuária
  const [data, setData] = useState<Encontro2State>(() => {
    return getUserStorageItem<Encontro2State>(STORAGE_KEY_ENCONTRO_2_DATA, INITIAL_ENCONTRO_2_STATE)
  })

  // Estação liberada/atual (avanço sequencial: só a primeira aberta inicialmente)
  const [currentEstacao, setCurrentEstacao] = useState<number>(() => {
    const saved = getUserStorageItem<number>(STORAGE_KEY_ENCONTRO_2_STEP, 0)
    return typeof saved === 'number' && saved >= 0 && saved <= 9 ? saved : 0
  })

  // Modo aula (aumenta tipografia e esconde elementos secundários)
  const [modoAula, setModoAula] = useState<boolean>(false)

  // Estados de cópia com feedback
  const [copiedPromptDetetive, setCopiedPromptDetetive] = useState(false)
  const [copiedPromptPosicionamento, setCopiedPromptPosicionamento] = useState(false)
  const [copiedEntrega, setCopiedEntrega] = useState(false)
  const [copiedSkillDetetive, setCopiedSkillDetetive] = useState(false)
  const [copiedSkillPosicionamento, setCopiedSkillPosicionamento] = useState(false)

  // Controle de confirmação inline de exclusão
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // Bloco recolhido do Claude na Estação 2
  const [claudeGuideOpen, setClaudeGuideOpen] = useState(false)

  // Status de disponibilidade dos arquivos públicos de skill
  const [skillFilesAvailability, setSkillFilesAvailability] = useState<{
    detetiveZipGpt: boolean
    detetiveZipClaude: boolean
    posicionamentoZipGpt: boolean
    posicionamentoZipClaude: boolean
    detetiveSkillMd: boolean
    posicionamentoSkillMd: boolean
  }>({
    detetiveZipGpt: false,
    detetiveZipClaude: false,
    posicionamentoZipGpt: false,
    posicionamentoZipClaude: false,
    detetiveSkillMd: false,
    posicionamentoSkillMd: false,
  })

  // Salvar alterações de respostas de forma silenciosa e segura
  useEffect(() => {
    try {
      setUserStorageItem(STORAGE_KEY_ENCONTRO_2_DATA, data)
    } catch (err) {
      console.warn('Erro ao salvar respostas do Encontro 2:', err)
    }
  }, [data])

  // Salvar estação atual
  useEffect(() => {
    try {
      setUserStorageItem(STORAGE_KEY_ENCONTRO_2_STEP, currentEstacao)
    } catch (err) {
      console.warn('Erro ao salvar estação do Encontro 2:', err)
    }
  }, [currentEstacao])

  // Checar disponibilidade dos arquivos na pasta public/skills/encontro-2/
  useEffect(() => {
    let isMounted = true
    const checkFile = async (url: string): Promise<boolean> => {
      try {
        const res = await fetch(url, { method: 'HEAD' })
        if (!res.ok) return false
        // Se retornar HTML da SPA (index.html fallback 200 do Vite), não é o arquivo real
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('text/html')) {
          return false
        }
        return true
      } catch {
        return false
      }
    }

    const checkAll = async () => {
      const [
        detetiveZipGpt,
        detetiveZipClaude,
        posicionamentoZipGpt,
        posicionamentoZipClaude,
        detetiveSkillMd,
        posicionamentoSkillMd,
      ] = await Promise.all([
        checkFile('/skills/encontro-2/detetive-de-nicho-chatgpt.zip'),
        checkFile('/skills/encontro-2/detetive-de-nicho-claude.zip'),
        checkFile('/skills/encontro-2/posicionamento-chatgpt.zip'),
        checkFile('/skills/encontro-2/posicionamento-claude.zip'),
        checkFile('/skills/encontro-2/detetive-de-nicho-skill.md'),
        checkFile('/skills/encontro-2/posicionamento-skill.md'),
      ])

      if (isMounted) {
        setSkillFilesAvailability({
          detetiveZipGpt,
          detetiveZipClaude,
          posicionamentoZipGpt,
          posicionamentoZipClaude,
          detetiveSkillMd,
          posicionamentoSkillMd,
        })
      }
    }

    checkAll()
    return () => {
      isMounted = false
    }
  }, [])

  const updateField = <K extends keyof Encontro2State>(field: K, value: Encontro2State[K]) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  // Avançar estação com rolagem suave para a nova estação aberta
  const avancarParaEstacao = (proximaEstacao: number) => {
    setCurrentEstacao(proximaEstacao)
    setTimeout(() => {
      const el = document.getElementById(`estacao-${proximaEstacao}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  // Validações de avanço para cada estação
  const podeAvancarEstacao0 = data.fraseDirecao.trim().length > 0
  const podeAvancarEstacao1 = data.chatGptProntoChecked
  const podeAvancarEstacao2 = data.skillsProntasChecked
  const podeAvancarEstacao3 = true // Teoria sempre permite avançar
  const podeAvancarEstacao4 = data.raioXNicho.trim().length > 0
  const podeAvancarEstacao5 =
    data.brechaEscolhida.trim().length > 0 && data.motivoBrecha.trim().length > 0

  // Estação 6: pelo menos duas categorias preenchidas e a frase escrita
  const categoriasContadas = [
    data.publicoFaixasEtarias.length > 0,
    data.publicoMacroareas.length > 0,
    data.publicoTiposAtendimento.length > 0,
    data.publicoContextoEspecifico.trim().length > 0,
  ].filter(Boolean).length

  const podeAvancarEstacao6 = categoriasContadas >= 2 && data.publicoFraseTrabalho.trim().length > 0

  const podeAvancarEstacao7 = data.relatorioPosicionamento.trim().length > 0
  const podeAvancarEstacao8 = true

  // Montar Prompt da Estação 4 (sem colchetes no texto montado; omitir campos vazios)
  const buildPromptDetetive = (): string => {
    const linhas: string[] = ['Quero investigar o meu nicho.']

    if (data.fraseDirecao.trim()) {
      linhas.push(`Minha frase de direção: ${data.fraseDirecao.trim()}`)
    }
    if (data.detetiveOfereceParaQuem.trim()) {
      linhas.push(`O que eu ofereço e para quem: ${data.detetiveOfereceParaQuem.trim()}`)
    }
    if (data.detetiveComoProcuram.trim()) {
      linhas.push(`Como o meu mercado procura e contrata: ${data.detetiveComoProcuram.trim()}`)
    }
    if (data.detetiveProfissionaisConhecidos.trim()) {
      linhas.push(
        `Profissionais que eu já conheço nesse espaço: ${data.detetiveProfissionaisConhecidos.trim()}`,
      )
    }

    return linhas.join('\n')
  }

  // Montar Prompt da Estação 7 (sem colchetes no texto montado; omitir seções/campos vazios)
  const buildPromptPosicionamento = (): string => {
    const blocos: string[] = ['Quero o meu relatório de posicionamento.']

    if (data.fraseDirecao.trim()) {
      blocos.push(`MINHA FRASE DE DIREÇÃO\n${data.fraseDirecao.trim()}`)
    }

    if (data.raioXNicho.trim()) {
      blocos.push(`MEU RAIO X DO NICHO\n${data.raioXNicho.trim()}`)
    }

    const linhasLeitura: string[] = []
    if (data.nivelConcorrentesMaisFalam.trim()) {
      linhasLeitura.push(
        `Meus concorrentes falam mais com: ${data.nivelConcorrentesMaisFalam.trim()}`,
      )
    }
    if (data.nivelNinguemAtende.trim()) {
      linhasLeitura.push(`Ninguém atende: ${data.nivelNinguemAtende.trim()}`)
    }
    if (linhasLeitura.length > 0) {
      blocos.push(`A LEITURA COM OS NÍVEIS DE CONSCIÊNCIA\n${linhasLeitura.join('\n')}`)
    }

    const brechaTxt = data.brechaEscolhida.trim()
    const motivoTxt = data.motivoBrecha.trim()
    if (brechaTxt || motivoTxt) {
      if (brechaTxt && motivoTxt) {
        blocos.push(`A BRECHA QUE EU ESCOLHI\n${brechaTxt} porque ${motivoTxt}`)
      } else {
        blocos.push(`A BRECHA QUE EU ESCOLHI\n${brechaTxt || motivoTxt}`)
      }
    }

    const catDesc: string[] = []
    if (data.publicoFaixasEtarias.length > 0) {
      catDesc.push(`Faixa etária: ${data.publicoFaixasEtarias.join(', ')}`)
    }
    if (data.publicoMacroareas.length > 0) {
      catDesc.push(`Macroárea: ${data.publicoMacroareas.join(', ')}`)
    }
    if (data.publicoTiposAtendimento.length > 0) {
      catDesc.push(`Tipo de atendimento: ${data.publicoTiposAtendimento.join(', ')}`)
    }
    if (data.publicoContextoEspecifico.trim()) {
      catDesc.push(`Contexto específico: ${data.publicoContextoEspecifico.trim()}`)
    }
    if (data.publicoFraseTrabalho.trim()) {
      catDesc.push(`Meu trabalho é para: ${data.publicoFraseTrabalho.trim()}`)
    }

    if (catDesc.length > 0) {
      blocos.push(`MEU PÚBLICO-ALVO\n${catDesc.join('\n')}`)
    }

    return blocos.join('\n\n')
  }

  // Copiar prompt do Detetive
  const handleCopyPromptDetetive = async () => {
    const text = buildPromptDetetive()
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPromptDetetive(true)
      setTimeout(() => setCopiedPromptDetetive(false), 2400)
    } catch (err) {
      console.warn('Erro ao copiar:', err)
    }
  }

  // Copiar prompt de Posicionamento
  const handleCopyPromptPosicionamento = async () => {
    const text = buildPromptPosicionamento()
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPromptPosicionamento(true)
      setTimeout(() => setCopiedPromptPosicionamento(false), 2400)
    } catch (err) {
      console.warn('Erro ao copiar:', err)
    }
  }

  // Copiar skill do Plano B (via fetch de public/skills/encontro-2/)
  const handleCopySkillPlanoB = async (tipo: 'detetive' | 'posicionamento', url: string) => {
    try {
      const res = await fetch(url)
      if (!res.ok) {
        return
      }
      const text = await res.text()
      if (!text || text.includes('<!DOCTYPE html>')) {
        return
      }
      await navigator.clipboard.writeText(text)
      if (tipo === 'detetive') {
        setCopiedSkillDetetive(true)
        setTimeout(() => setCopiedSkillDetetive(false), 2400)
      } else {
        setCopiedSkillPosicionamento(true)
        setTimeout(() => setCopiedSkillPosicionamento(false), 2400)
      }
    } catch (err) {
      console.warn('Erro ao copiar arquivo de skill:', err)
    }
  }

  // Copiar entrega da semana (brecha, motivo e frase do público)
  const handleCopyEntrega = async () => {
    const partes: string[] = []
    if (data.brechaEscolhida.trim()) {
      partes.push(`Brecha escolhida: ${data.brechaEscolhida.trim()}`)
    }
    if (data.motivoBrecha.trim()) {
      partes.push(`Motivo da escolha: ${data.motivoBrecha.trim()}`)
    }
    if (data.publicoFraseTrabalho.trim()) {
      partes.push(`Meu trabalho é para: ${data.publicoFraseTrabalho.trim()}`)
    }
    const txt = partes.join('\n\n')
    try {
      await navigator.clipboard.writeText(txt)
      setCopiedEntrega(true)
      setTimeout(() => setCopiedEntrega(false), 2400)
    } catch (err) {
      console.warn('Erro ao copiar entrega:', err)
    }
  }

  // Gerar e baixar arquivo .txt com o resumo completo do Encontro 2
  // Regras estritas: sem colchetes e sem nenhum caractere de travessão (— ou –)
  const handleDownloadTxt = () => {
    const sanitizeSemTravessao = (str: string) => {
      return str.replace(/[—–]/g, ':').replace(/[[\]]/g, '')
    }

    const agora = new Date()
    const dataFormatada = `${String(agora.getDate()).padStart(2, '0')}/${String(
      agora.getMonth() + 1,
    ).padStart(2, '0')}/${agora.getFullYear()}`

    const catDesc: string[] = []
    if (data.publicoFaixasEtarias.length > 0) {
      catDesc.push(`Faixa etaria: ${data.publicoFaixasEtarias.join(', ')}`)
    }
    if (data.publicoMacroareas.length > 0) {
      catDesc.push(`Macroarea: ${data.publicoMacroareas.join(', ')}`)
    }
    if (data.publicoTiposAtendimento.length > 0) {
      catDesc.push(`Tipo de atendimento: ${data.publicoTiposAtendimento.join(', ')}`)
    }
    if (data.publicoContextoEspecifico.trim()) {
      catDesc.push(`Contexto especifico: ${data.publicoContextoEspecifico.trim()}`)
    }

    const linhas = [
      'ACADEMIA METODO FAC : PILAR FUNDACAO : ENCONTRO 2',
      'Tema: Do sentido ao mercado',
      `Data do registro: ${dataFormatada}`,
      '='.repeat(60),
      '',
      '1. FRASE DE DIRECAO',
      sanitizeSemTravessao(data.fraseDirecao || '(Nao preenchida)'),
      '',
      '2. INVESTIGACAO COM O DETETIVE DE NICHO',
      `O que oferece e para quem: ${sanitizeSemTravessao(data.detetiveOfereceParaQuem || '(Nao preenchido)')}`,
      `Como o mercado procura e contrata: ${sanitizeSemTravessao(data.detetiveComoProcuram || '(Nao preenchido)')}`,
      `Profissionais conhecidos no espaco: ${sanitizeSemTravessao(data.detetiveProfissionaisConhecidos || '(Nao preenchido)')}`,
      '',
      '3. LEITURA COM OS NIVEIS DE CONSCIENCIA',
      `Nivel com que concorrentes mais falam: ${sanitizeSemTravessao(data.nivelConcorrentesMaisFalam || '(Nao preenchido)')}`,
      `Nivel que ninguem atende: ${sanitizeSemTravessao(data.nivelNinguemAtende || '(Nao preenchido)')}`,
      '',
      '4. RAIO X DO NICHO',
      sanitizeSemTravessao(data.raioXNicho || '(Nao preenchido)'),
      '',
      '5. BRECHA ESCOLHIDA',
      `Brecha: ${sanitizeSemTravessao(data.brechaEscolhida || '(Nao preenchida)')}`,
      `Motivo: ${sanitizeSemTravessao(data.motivoBrecha || '(Nao preenchido)')}`,
      '',
      '6. FICHA DE PUBLICO-ALVO',
      catDesc.length > 0
        ? sanitizeSemTravessao(catDesc.join('\n'))
        : '(Categorias nao preenchidas)',
      `Frase do publico: ${sanitizeSemTravessao(data.publicoFraseTrabalho || '(Nao preenchida)')}`,
      '',
      '7. RELATORIO DE POSICIONAMENTO',
      sanitizeSemTravessao(data.relatorioPosicionamento || '(Nao preenchido)'),
      '',
      '='.repeat(60),
      'Metodo FAC : Entrelacos Psicologia : Registro confidencial salvo no navegador.',
    ]

    const conteudo = linhas.join('\n')
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Encontro-2-Do-sentido-ao-mercado-${agora.getFullYear()}-${String(
      agora.getMonth() + 1,
    ).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Imprimir folha limpa
  const handlePrint = () => {
    window.print()
  }

  // Apagar respostas com confirmação inline
  const handleApagarRespostas = () => {
    removeUserStorageItem(STORAGE_KEY_ENCONTRO_2_DATA)
    removeUserStorageItem(STORAGE_KEY_ENCONTRO_2_STEP)
    setData(INITIAL_ENCONTRO_2_STATE)
    setCurrentEstacao(0)
    setConfirmingDelete(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Se aluna não for validada, tela de bloqueio acolhedora padrão do Guia
  if (!isAlunaValidada) {
    return (
      <div className="p-8 sm:p-12 lg:p-14 rounded-[20px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-lg text-center space-y-7 max-w-3xl mx-auto">
        <div className="w-14 h-14 rounded-[12px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] mx-auto flex items-center justify-center">
          <Lock className="w-7 h-7 text-[#ea580c] dark:text-[#FB923C]" />
        </div>

        <div className="space-y-3">
          <Badge className="bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] border-purple-200 dark:border-purple-800 text-xs font-mono">
            Academia Método FAC · Fundação · Encontro 2
          </Badge>
          <h2 className="h-section font-medium text-editorial-primary">
            Do sentido ao{' '}
            <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
              mercado
            </em>
          </h2>
          <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed max-w-lg mx-auto font-light">
            O Encontro 2 é exclusivo para alunas matriculadas na Academia Método FAC. Valide o seu
            e-mail de matrícula para liberar este caderno e as ferramentas de investigação de
            mercado.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            type="button"
            onClick={onValidarEmail}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-xs sm:text-sm rounded-[8px] min-h-[44px] px-6 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            <span>Validar meu e-mail de compra</span>
          </Button>
        </div>
      </div>
    )
  }

  // Componente de badge discreto para trechos marcados para revisão da Tati
  const BlocoRevisaoTati = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-amber-100/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-mono font-medium">
      <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
      <span>{children}</span>
    </span>
  )

  // Caixa fixa de cuidado ético e privacidade nas estações 4 a 7
  const CaixaCuidadoFixa = () => (
    <div className="p-4 sm:p-5 rounded-[12px] bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs sm:text-sm text-amber-950 dark:text-amber-200 flex items-start gap-3">
      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <strong className="font-semibold block font-sans text-amber-900 dark:text-amber-100">
          Cuidado ético com dados:
        </strong>
        <p className="font-light leading-relaxed">
          Não escreva nome nem detalhe que identifique quem você atende. Suas respostas não saem do
          seu navegador.
        </p>
      </div>
    </div>
  )

  return (
    <article
      className={`space-y-12 sm:space-y-16 w-full ${
        modoAula ? 'text-lg sm:text-xl space-y-16 sm:space-y-20' : ''
      }`}
    >
      {/* BARRA FIXA SUPERIOR COM PROGRESSO EM PONTOS */}
      <section
        aria-label="Progresso das estações do Encontro 2"
        className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 px-4 sm:px-6 lg:px-8 xl:px-10 py-3 bg-white/95 dark:bg-[#0A0A14]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#27272A] print:hidden shadow-2xs"
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] shrink-0">
              Encontro 2
            </span>
            <span className="text-editorial-tertiary hidden sm:inline">•</span>
            <span className="text-xs font-mono text-editorial-secondary truncate font-medium">
              Estação {currentEstacao}: {ESTACOES_CONFIG[currentEstacao]?.label}
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Pontos de avanço sequencial */}
            <div
              className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 max-w-full"
              role="tablist"
              aria-label="Estações do Encontro 2"
            >
              {ESTACOES_CONFIG.map((est) => {
                const isLiberada = est.id <= currentEstacao
                const isAtual = est.id === currentEstacao

                return (
                  <button
                    key={est.id}
                    type="button"
                    role="tab"
                    aria-selected={isAtual}
                    aria-label={`Estação ${est.id}: ${est.label}${isLiberada ? '' : ' (bloqueada)'}`}
                    disabled={!isLiberada}
                    onClick={() => {
                      if (isLiberada) {
                        const el = document.getElementById(`estacao-${est.id}`)
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-[11px] font-bold transition-all cursor-pointer ${
                      isAtual
                        ? 'bg-[#7c3aed] text-white ring-2 ring-[#7c3aed]/40 scale-105'
                        : isLiberada
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-200'
                          : 'bg-slate-100 dark:bg-[#18181B] text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                    }`}
                    title={`Estação ${est.id}: ${est.label}`}
                  >
                    {est.id}
                  </button>
                )
              })}
            </div>

            {/* Alternador de Modo Aula */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModoAula((prev) => !prev)}
              className={`min-h-[38px] h-9 px-2.5 text-xs font-mono font-semibold gap-1.5 rounded-[8px] border transition-colors shrink-0 ${
                modoAula
                  ? 'bg-purple-100 dark:bg-purple-950/50 border-[#7c3aed] text-[#7c3aed] dark:text-[#C084FC]'
                  : 'bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-slate-300'
              }`}
              title={
                modoAula
                  ? 'Sair do Modo aula (retornar tamanho padrão)'
                  : 'Ativar Modo aula (amplia a tipografia para leitura em aula)'
              }
            >
              {modoAula ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Modo normal</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Modo aula</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* ESTAÇÃO 0 · PORTA DE ENTRADA */}
      <section
        id="estacao-0"
        className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-11 lg:p-14 space-y-8 shadow-xs scroll-mt-36"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-[#27272A] pb-5">
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-[13px] font-mono">
            <Badge className="bg-purple-500/15 text-[#7c3aed] dark:text-[#C084FC] border-[#7c3aed]/30 text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5">
              Academia Método FAC · Fundação · Encontro 2
            </Badge>
            <span className="text-editorial-tertiary">•</span>
            <span className="text-editorial-secondary font-semibold">
              Terça, 13/10/2026, às 19h (ao vivo)
            </span>
          </div>

          <Badge
            variant="outline"
            className="text-[11px] font-mono border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5"
          >
            Aluna Validada
          </Badge>
        </div>

        <div className="space-y-4">
          <h1 className="h-display font-medium tracking-tight text-editorial-primary leading-[1.05]">
            Encontro 2: Do sentido ao{' '}
            <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
              mercado
            </em>
          </h1>{' '}
          <p className="text-base sm:text-lg md:text-xl text-editorial-secondary leading-relaxed font-light max-w-4xl">
            Hoje você investiga o seu mercado com buscas reais, escolhe a sua brecha, define o seu
            público e sai com o seu relatório de posicionamento.
          </p>
        </div>

        {/* Blocos Você vai sair com e Traga */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
              Você vai sair com:
            </span>
            <p className="text-sm sm:text-base text-editorial-primary font-medium leading-relaxed">
              Raio X do nicho · brecha escolhida · público-alvo · relatório de posicionamento.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-[14px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200/80 dark:border-[#27272A] space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-editorial-secondary block">
              Traga:
            </span>
            <p className="text-sm sm:text-base text-editorial-primary font-medium leading-relaxed">
              A sua frase de direção do app Meu IKIGAI.
            </p>
          </div>
        </div>

        {/* Campo da Frase de Direção */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="campo-frase-direcao"
              className="font-sans font-semibold text-sm sm:text-base text-editorial-primary"
            >
              Cole aqui a sua frase de direção (até 280 caracteres):
            </label>
            <span className="text-xs font-mono text-editorial-secondary">
              {data.fraseDirecao.length}/280
            </span>
          </div>

          <Textarea
            id="campo-frase-direcao"
            maxLength={280}
            rows={3}
            value={data.fraseDirecao}
            onChange={(e) => updateField('fraseDirecao', e.target.value)}
            placeholder="Ex: Ajudo mulheres em transição de carreira a construir rotas clínicas viáveis com escuta ética..."
            className="resize-none font-sans text-sm sm:text-base bg-white dark:bg-[#0c0914] border-slate-200 dark:border-[#27272A] focus:border-[#7c3aed]"
          />
          <p className="text-xs text-editorial-secondary font-light">
            Ela será usada nas próximas estações para confrontar e orientar a investigação.
          </p>

          <div className="pt-2 flex items-center gap-2">
            <a
              href="/ikigai"
              className="text-xs font-mono text-[#7c3aed] dark:text-[#C084FC] hover:underline inline-flex items-center gap-1.5"
            >
              <span>Ainda não fiz no app Meu IKIGAI? Acesse o app</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Botão de avanço da Estação 0 */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-mono text-editorial-secondary">
            {podeAvancarEstacao0
              ? 'Frase preenchida. Pronta para começar!'
              : 'Preencha a sua frase de direção para liberar o avanço.'}
          </p>
          <Button
            type="button"
            disabled={!podeAvancarEstacao0}
            onClick={() => {
              if (currentEstacao < 1) setCurrentEstacao(1)
              avancarParaEstacao(1)
            }}
            className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-sm rounded-[8px] min-h-[44px] px-6 cursor-pointer"
          >
            <span>Começar</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* ESTAÇÃO 1 · SUA CONTA NO CHATGPT */}
      {currentEstacao >= 1 && (
        <section
          id="estacao-1"
          className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7 shadow-xs scroll-mt-36"
        >
          <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              ESTAÇÃO 1
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1">
              Estação 1 · Crie sua conta no{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                ChatGPT
              </em>
            </h2>
          </div>

          {/* Passo a passo numerado — orientações de texto oficiais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Passo 1 */}
            <div className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h3 className="text-xs font-mono font-semibold text-editorial-secondary uppercase">
                    Passo 1 — Acesse o ChatGPT
                  </h3>
                </div>
                <p className="text-sm sm:text-[15px] text-editorial-primary leading-relaxed font-light">
                  No computador, abra{' '}
                  <a
                    href="https://chatgpt.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#7c3aed] dark:text-[#C084FC] hover:underline"
                  >
                    chatgpt.com
                  </a>
                  . No celular, baixe o aplicativo <strong>ChatGPT</strong>, publicado pela{' '}
                  <strong>OpenAI</strong>, na loja oficial do seu aparelho. Confira o nome da
                  desenvolvedora antes de instalar.
                </p>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h3 className="text-xs font-mono font-semibold text-editorial-secondary uppercase">
                    Passo 2 — Comece o cadastro
                  </h3>
                </div>
                <p className="text-sm sm:text-[15px] text-editorial-primary leading-relaxed font-light">
                  Selecione <strong>Criar conta</strong>. Dependendo do idioma e da versão da tela,
                  o botão pode aparecer como <strong>Cadastre-se</strong> ou{' '}
                  <strong>Sign up</strong>. Se você já tem uma conta, escolha{' '}
                  <strong>Entrar</strong> e use seu cadastro existente.
                </p>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h3 className="text-xs font-mono font-semibold text-editorial-secondary uppercase">
                    Passo 3 — Escolha como entrar
                  </h3>
                </div>
                <div className="space-y-2 text-sm sm:text-[15px] text-editorial-primary leading-relaxed font-light">
                  <p>
                    Você pode informar seu <strong>e-mail</strong> ou escolher uma das opções
                    exibidas na sua tela, como <strong>Continuar com Google</strong>,{' '}
                    <strong>Continuar com Microsoft</strong> ou <strong>Continuar com Apple</strong>
                    . As opções podem variar conforme o aparelho.
                  </p>
                  <p>Guarde o método escolhido: nas próximas vezes, entre da mesma forma.</p>
                </div>
              </div>
            </div>

            {/* Passo 4 */}
            <div className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <h3 className="text-xs font-mono font-semibold text-editorial-secondary uppercase">
                    Passo 4 — Conclua as informações solicitadas
                  </h3>
                </div>
                <p className="text-sm sm:text-[15px] text-editorial-primary leading-relaxed font-light">
                  Siga as instruções na tela. Se receber um pedido de confirmação por e-mail, abra
                  sua caixa de entrada e conclua a verificação. Informe seu nome e sua data de
                  nascimento <strong>se esses dados forem solicitados</strong>.
                </p>
              </div>
            </div>

            {/* Passo 5 */}
            <div className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    5
                  </span>
                  <h3 className="text-xs font-mono font-semibold text-editorial-secondary uppercase">
                    Passo 5 — Abra uma conversa
                  </h3>
                </div>
                <p className="text-sm sm:text-[15px] text-editorial-primary leading-relaxed font-light">
                  Quando o cadastro terminar, você verá o campo onde pode escrever uma mensagem para
                  o ChatGPT. Sua conta está pronta para começar a atividade.
                </p>
              </div>
            </div>

            {/* Passo 6 */}
            <div className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] flex flex-col justify-between gap-4 md:col-span-2">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    6
                  </span>
                  <h3 className="text-xs font-mono font-semibold text-editorial-secondary uppercase">
                    Passo 6 — Confira a busca na internet
                  </h3>
                </div>
                <div className="space-y-2.5 text-sm sm:text-[15px] text-editorial-primary leading-relaxed font-light">
                  <p>
                    A investigação de hoje usa informações encontradas na web. Em uma conversa, abra
                    o menu de ferramentas junto ao campo de mensagem e procure{' '}
                    <strong>Buscar</strong> ou <strong>Search</strong>. Você também pode digitar{' '}
                    <strong>/</strong> no campo de mensagem e selecionar a opção de busca, se ela
                    aparecer.
                  </p>
                  <p>
                    Para testar, escreva:{' '}
                    <strong>
                      &ldquo;Pesquise na internet o site oficial do Conselho Federal de Psicologia e
                      mostre o link da fonte.&rdquo;
                    </strong>{' '}
                    Confira se a resposta traz um link para a fonte consultada.
                  </p>
                  <p>
                    A busca na web está disponível no plano gratuito, sujeita aos limites de uso da
                    conta. Se a opção não aparecer, tente abrir uma nova conversa, atualizar o
                    aplicativo ou acessar{' '}
                    <a
                      href="https://chatgpt.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#7c3aed] dark:text-[#C084FC] hover:underline"
                    >
                      chatgpt.com
                    </a>{' '}
                    pelo navegador.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Caixa "gratuito ou pago?" */}
          <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 space-y-2.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
              Gratuito ou pago?
            </span>
            <div className="space-y-2 text-sm sm:text-base text-editorial-primary leading-relaxed font-light">
              <p>
                <strong>
                  A conta gratuita serve para começar o encontro de hoje e usar a busca na internet.
                </strong>{' '}
                A importação de <em>skills</em> tem regras diferentes: no ChatGPT, ela está
                disponível para contas e espaços de trabalho elegíveis, conforme as permissões
                concedidas. Ter um plano pessoal pago não garante que o botão de importação apareça.
              </p>
              <p>
                Se a sua conta não oferecer essa opção, siga o <strong>Plano B da Estação 2</strong>
                . Você poderá continuar a atividade sem importar a <em>skill</em>.
              </p>
            </div>
          </div>

          {/* Item marcável e botão de avanço */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={data.chatGptProntoChecked}
                onChange={(e) => updateField('chatGptProntoChecked', e.target.checked)}
                className="w-5 h-5 rounded-[4px] accent-[#7c3aed] text-white cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-medium text-editorial-primary">
                Estou com o ChatGPT aberto e logado.
              </span>
            </label>

            <Button
              type="button"
              disabled={!podeAvancarEstacao1}
              onClick={() => {
                if (currentEstacao < 2) setCurrentEstacao(2)
                avancarParaEstacao(2)
              }}
              className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-sm rounded-[8px] min-h-[44px] px-6 cursor-pointer"
            >
              <span>Minha conta está pronta</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      )}

      {/* ESTAÇÃO 2 · BAIXE E IMPORTE AS SKILLS */}
      {currentEstacao >= 2 && (
        <section
          id="estacao-2"
          className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-8 shadow-xs scroll-mt-36"
        >
          <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              ESTAÇÃO 2
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1">
              Estação 2 · Baixe e importe as{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                skills
              </em>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed font-light">
            Skills são ferramentas prontas que ensinam o ChatGPT a fazer um trabalho do jeito da
            Entrelaços. Hoje você vai usar duas.
          </p>

          {/* Dois cartões de skill lado a lado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cartão 1: Detetive de Nicho */}
            <div className="p-6 sm:p-7 rounded-[16px] border border-slate-200 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#7c3aed] dark:text-[#C084FC]" />
                  <h3 className="font-sans font-semibold text-lg text-editorial-primary">
                    Cartão 1 · Detetive de Nicho
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm text-editorial-secondary font-light leading-relaxed">
                  <p>
                    <strong className="font-semibold text-editorial-primary font-sans">
                      O que é:
                    </strong>{' '}
                    um investigador de mercado que faz buscas reais na internet, narra o que
                    encontra nas Notas do detetive e entrega o Raio X do nicho.
                  </p>
                  <p>
                    <strong className="font-semibold text-editorial-primary font-sans">
                      O que entrega:
                    </strong>{' '}
                    quem manda no seu mercado, quanto cobram, o que o público sente, 3 brechas, 3
                    ângulos de ataque e os temas quentes. Todo dado etiquetado. O que não achou, ele
                    diz.
                  </p>
                  <p>
                    <strong className="font-semibold text-editorial-primary font-sans">
                      Quando usar:
                    </strong>{' '}
                    primeiro, antes da skill de posicionamento.
                  </p>
                </div>
              </div>

              {/* Botões de download da Skill 1 */}
              <div className="space-y-2.5 pt-3 border-t border-slate-200/80 dark:border-[#27272A]">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!skillFilesAvailability.detetiveZipGpt}
                    onClick={() => {
                      if (skillFilesAvailability.detetiveZipGpt) {
                        window.open('/skills/encontro-2/detetive-de-nicho-chatgpt.zip', '_blank')
                      }
                    }}
                    className="font-mono text-xs rounded-[8px] min-h-[42px] flex-1 justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {skillFilesAvailability.detetiveZipGpt
                        ? 'Baixar para o ChatGPT'
                        : 'ChatGPT: Disponível em breve'}
                    </span>
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!skillFilesAvailability.detetiveZipClaude}
                    onClick={() => {
                      if (skillFilesAvailability.detetiveZipClaude) {
                        window.open('/skills/encontro-2/detetive-de-nicho-claude.zip', '_blank')
                      }
                    }}
                    className="font-mono text-xs rounded-[8px] min-h-[42px] flex-1 justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {skillFilesAvailability.detetiveZipClaude
                        ? 'Baixar para o Claude'
                        : 'Claude: Disponível em breve'}
                    </span>
                  </Button>
                </div>
                <BlocoRevisaoTati>
                  [TATI PREENCHE: nomes dos arquivos .zip da skill no formato de plugin]
                </BlocoRevisaoTati>
              </div>
            </div>

            {/* Cartão 2: Posicionamento */}
            <div className="p-6 sm:p-7 rounded-[16px] border border-slate-200 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#ea580c] dark:text-[#FB923C]" />
                  <h3 className="font-sans font-semibold text-lg text-editorial-primary">
                    Cartão 2 · Posicionamento{' '}
                    <BlocoRevisaoTati>[TATI PREENCHE: nome final da skill]</BlocoRevisaoTati>
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm text-editorial-secondary font-light leading-relaxed">
                  <p>
                    <strong className="font-semibold text-editorial-primary font-sans">
                      O que é:
                    </strong>{' '}
                    uma mentoria rápida de mercado que usa a sua frase de direção e o seu Raio X
                    para confrontar o que estiver vago e entregar a sua direção.
                  </p>
                  <p>
                    <strong className="font-semibold text-editorial-primary font-sans">
                      O que entrega:
                    </strong>{' '}
                    o Relatório de posicionamento, com quem você é, para quem fala, a sua tese, onde
                    você entra no mercado, o que oferecer primeiro e um plano com data.
                  </p>
                  <p>
                    <strong className="font-semibold text-editorial-primary font-sans">
                      Quando usar:
                    </strong>{' '}
                    depois do Detetive de Nicho.
                  </p>
                </div>
              </div>

              {/* Botões de download da Skill 2 */}
              <div className="space-y-2.5 pt-3 border-t border-slate-200/80 dark:border-[#27272A]">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!skillFilesAvailability.posicionamentoZipGpt}
                    onClick={() => {
                      if (skillFilesAvailability.posicionamentoZipGpt) {
                        window.open('/skills/encontro-2/posicionamento-chatgpt.zip', '_blank')
                      }
                    }}
                    className="font-mono text-xs rounded-[8px] min-h-[42px] flex-1 justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {skillFilesAvailability.posicionamentoZipGpt
                        ? 'Baixar para o ChatGPT'
                        : 'ChatGPT: Disponível em breve'}
                    </span>
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!skillFilesAvailability.posicionamentoZipClaude}
                    onClick={() => {
                      if (skillFilesAvailability.posicionamentoZipClaude) {
                        window.open('/skills/encontro-2/posicionamento-claude.zip', '_blank')
                      }
                    }}
                    className="font-mono text-xs rounded-[8px] min-h-[42px] flex-1 justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {skillFilesAvailability.posicionamentoZipClaude
                        ? 'Baixar para o Claude'
                        : 'Claude: Disponível em breve'}
                    </span>
                  </Button>
                </div>
                <BlocoRevisaoTati>
                  [TATI PREENCHE: nomes dos arquivos .zip de posicionamento]
                </BlocoRevisaoTati>
              </div>
            </div>
          </div>

          {/* Como importar no ChatGPT */}
          <div className="space-y-4 pt-2">
            <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
              Como importar no ChatGPT
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  n: '1',
                  txt: "Baixe o arquivo 'para o ChatGPT' no seu computador. Não abra nem descompacte o arquivo.",
                  rev: null,
                },
                {
                  n: '2',
                  txt: 'No ChatGPT, abra a área de plugins',
                  rev: '[A CONFERIR NA TELA: caminho exato no menu]',
                },
                {
                  n: '3',
                  txt: 'Escolha adicionar um novo plugin e selecione o arquivo .zip que você baixou.',
                  rev: null,
                },
                {
                  n: '4',
                  txt: 'Repita para a segunda skill.',
                  rev: null,
                },
                {
                  n: '5',
                  txt: 'Confira se as duas aparecem na sua lista',
                  rev: '[A CONFERIR NA TELA]',
                },
              ].map((p) => (
                <div
                  key={p.n}
                  className="p-4 sm:p-5 rounded-[12px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/50 dark:bg-[#0c0914] space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-[11px] font-bold flex items-center justify-center">
                      {p.n}
                    </span>
                    <span className="text-xs font-mono font-semibold text-editorial-secondary">
                      Passo {p.n}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-editorial-primary font-light">{p.txt}</p>
                  {p.rev && <BlocoRevisaoTati>{p.rev}</BlocoRevisaoTati>}
                  <div className="p-2.5 rounded-[8px] border border-dashed border-slate-300 dark:border-[#3f3f46] text-center text-[11px] font-mono text-editorial-secondary">
                    Captura de tela <BlocoRevisaoTati>[TATI PREENCHE as imagens]</BlocoRevisaoTati>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-[12px] bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs sm:text-sm text-amber-950 dark:text-amber-200">
              <strong>Aviso:</strong> A importação funciona melhor pelo computador. Pelo celular,
              use o Plano B.
            </div>
          </div>

          {/* Como importar no Claude (Bloco recolhido) */}
          <div className="border border-slate-200 dark:border-[#27272A] rounded-[14px] overflow-hidden">
            <button
              type="button"
              onClick={() => setClaudeGuideOpen((prev) => !prev)}
              className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-[#0c0914] flex items-center justify-between text-left cursor-pointer hover:bg-slate-100 dark:hover:bg-[#18181B] transition-colors"
            >
              <span className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
                Como importar no Claude
              </span>
              {claudeGuideOpen ? (
                <ChevronUp className="w-4 h-4 text-editorial-secondary" />
              ) : (
                <ChevronDown className="w-4 h-4 text-editorial-secondary" />
              )}
            </button>

            {claudeGuideOpen && (
              <div className="p-5 sm:p-6 space-y-3 bg-white dark:bg-[#121216] border-t border-slate-200 dark:border-[#27272A] text-xs sm:text-sm font-light text-editorial-secondary">
                <p>
                  1. Baixe o arquivo 'para o Claude' no seu computador.{' '}
                  <BlocoRevisaoTati>[A CONFERIR NA TELA: passos exatos no Claude]</BlocoRevisaoTati>
                </p>
                <p>
                  2. No Claude, crie um novo Projeto ou abra as configurações de instruções
                  personalizadas. <BlocoRevisaoTati>[A CONFERIR NA TELA]</BlocoRevisaoTati>
                </p>
                <p>
                  3. Adicione o arquivo de skill aos arquivos do projeto.{' '}
                  <BlocoRevisaoTati>[A CONFERIR NA TELA]</BlocoRevisaoTati>
                </p>
              </div>
            )}
          </div>

          {/* Plano B (bloco destacado) */}
          <div className="p-6 sm:p-7 rounded-[16px] bg-purple-50/70 dark:bg-purple-950/25 border border-purple-200 dark:border-[#7c3aed]/40 space-y-4">
            <div className="space-y-1">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                Plano B, funciona em qualquer conta e no celular
              </span>
              <p className="text-sm sm:text-base text-editorial-primary leading-relaxed font-light">
                Se a importação não funcionar, use a skill colando o texto dela direto na conversa.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                disabled={!skillFilesAvailability.detetiveSkillMd}
                onClick={() =>
                  handleCopySkillPlanoB('detetive', '/skills/encontro-2/detetive-de-nicho-skill.md')
                }
                className="font-mono text-xs rounded-[8px] min-h-[42px] gap-1.5 border-purple-300 dark:border-purple-800 text-[#7c3aed] dark:text-[#C084FC] bg-white dark:bg-[#18181B]"
              >
                {copiedSkillDetetive ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Skill Detetive copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>
                      {skillFilesAvailability.detetiveSkillMd
                        ? 'Copiar a skill Detetive de Nicho'
                        : 'Disponível em breve'}
                    </span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={!skillFilesAvailability.posicionamentoSkillMd}
                onClick={() =>
                  handleCopySkillPlanoB(
                    'posicionamento',
                    '/skills/encontro-2/posicionamento-skill.md',
                  )
                }
                className="font-mono text-xs rounded-[8px] min-h-[42px] gap-1.5 border-purple-300 dark:border-purple-800 text-[#7c3aed] dark:text-[#C084FC] bg-white dark:bg-[#18181B]"
              >
                {copiedSkillPosicionamento ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Skill Posicionamento copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>
                      {skillFilesAvailability.posicionamentoSkillMd
                        ? 'Copiar a skill de Posicionamento'
                        : 'Disponível em breve'}
                    </span>
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs font-mono text-editorial-secondary">
              Instrução: Abra uma conversa nova, cole o texto e escreva em seguida: Siga estas
              instruções.
            </p>
          </div>

          {/* Item marcável e avanço */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={data.skillsProntasChecked}
                onChange={(e) => updateField('skillsProntasChecked', e.target.checked)}
                className="w-5 h-5 rounded-[4px] accent-[#7c3aed] text-white cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-medium text-editorial-primary">
                As duas skills estão prontas para usar (importadas ou com o Plano B à mão).
              </span>
            </label>

            <Button
              type="button"
              disabled={!podeAvancarEstacao2}
              onClick={() => {
                if (currentEstacao < 3) setCurrentEstacao(3)
                avancarParaEstacao(3)
              }}
              className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-sm rounded-[8px] min-h-[44px] px-6 cursor-pointer"
            >
              <span>Skills instaladas</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      )}

      {/* ESTAÇÃO 3 · A LENTE DO DIA */}
      {currentEstacao >= 3 && (
        <section
          id="estacao-3"
          className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7 shadow-xs scroll-mt-36"
        >
          <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              ESTAÇÃO 3
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1">
              Estação 3 · A{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                lente
              </em>{' '}
              do dia
            </h2>{' '}
          </div>

          <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed font-light">
            Resumo curto da teoria do encontro, para consulta.
          </p>

          <div className="space-y-4">
            <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
              Os 5 níveis de consciência
            </h3>

            <div className="space-y-3">
              {[
                { n: '1', nome: 'Inconsciente', frase: 'Eu só sou assim.' },
                { n: '2', nome: 'Consciente do problema', frase: 'Não consigo mais dormir.' },
                { n: '3', nome: 'Consciente da solução', frase: 'Acho que terapia pode ajudar.' },
                {
                  n: '4',
                  nome: 'Consciente do serviço',
                  frase: 'Vi o perfil dela, mas não sei se é para mim.',
                },
                { n: '5', nome: 'Totalmente consciente', frase: 'Qual o valor e o horário?' },
              ].map((nv) => (
                <div
                  key={nv.n}
                  className="p-4 sm:p-4.5 rounded-[12px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] flex items-start gap-3.5"
                >
                  <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {nv.n}
                  </span>
                  <div>
                    <h4 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
                      {nv.nome}
                    </h4>
                    <p className="text-xs sm:text-sm text-editorial-secondary italic font-serif-editorial">
                      "{nv.frase}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/60 dark:bg-purple-950/20 border-l-4 border-l-[#7c3aed] dark:border-l-[#C084FC] border-y border-r border-purple-100 dark:border-purple-900/30 space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              DESTAQUE
            </span>
            <p className="font-serif-editorial text-base sm:text-lg md:text-xl text-editorial-primary font-normal italic leading-relaxed">
              "Ao ler o seu Raio X, pergunte: com qual nível os meus concorrentes falam? O nível que
              ninguém atende costuma ser a sua brecha."
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200/80 dark:border-[#27272A] flex justify-end">
            <Button
              type="button"
              disabled={!podeAvancarEstacao3}
              onClick={() => {
                if (currentEstacao < 4) setCurrentEstacao(4)
                avancarParaEstacao(4)
              }}
              className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-sm rounded-[8px] min-h-[44px] px-6 cursor-pointer"
            >
              <span>Investigar o meu nicho</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      )}

      {/* ESTAÇÃO 4 · DETETIVE DE NICHO */}
      {currentEstacao >= 4 && (
        <section
          id="estacao-4"
          className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-8 shadow-xs scroll-mt-36"
        >
          <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              ESTAÇÃO 4
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1">
              Estação 4 · Detetive de{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                Nicho
              </em>
            </h2>{' '}
          </div>

          <CaixaCuidadoFixa />

          <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed font-light">
            O Detetive vai fazer buscas reais e pode levar alguns minutos. Responda às três
            perguntas abaixo para preparar a investigação.
          </p>

          {/* Três perguntas preparatórias */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="campo-detetive-1"
                className="font-sans font-semibold text-xs sm:text-sm text-editorial-primary"
              >
                1. O que você oferece e para quem?
              </label>
              <Textarea
                id="campo-detetive-1"
                rows={2}
                value={data.detetiveOfereceParaQuem}
                onChange={(e) => updateField('detetiveOfereceParaQuem', e.target.value)}
                placeholder="Ex: Psicoterapia individual online para mulheres adultas vivenciando sobrecarga profissional..."
                className="text-xs sm:text-sm bg-white dark:bg-[#0c0914] border-slate-200 dark:border-[#27272A]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="campo-detetive-2"
                className="font-sans font-semibold text-xs sm:text-sm text-editorial-primary"
              >
                2. Como as pessoas do seu mercado costumam procurar e contratar esse cuidado?
              </label>
              <Textarea
                id="campo-detetive-2"
                rows={2}
                value={data.detetiveComoProcuram}
                onChange={(e) => updateField('detetiveComoProcuram', e.target.value)}
                placeholder="Ex: Busca orgânica no Google, indicação de amigas, busca no Instagram por relatos do cotidiano..."
                className="text-xs sm:text-sm bg-white dark:bg-[#0c0914] border-slate-200 dark:border-[#27272A]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="campo-detetive-3"
                className="font-sans font-semibold text-xs sm:text-sm text-editorial-primary"
              >
                3. Quais profissionais ou perfis você já conhece nesse espaço?
              </label>
              <Textarea
                id="campo-detetive-3"
                rows={2}
                value={data.detetiveProfissionaisConhecidos}
                onChange={(e) => updateField('detetiveProfissionaisConhecidos', e.target.value)}
                placeholder="Ex: Clínicas gerais, perfis de divulgação sobre saúde mental da mulher..."
                className="text-xs sm:text-sm bg-white dark:bg-[#0c0914] border-slate-200 dark:border-[#27272A]"
              />
            </div>
          </div>

          {/* Caixa de prompt montada na hora */}
          <div className="p-5 sm:p-6 rounded-[14px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200/80 dark:border-[#27272A] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                Prompt montado para o Detetive de Nicho:
              </span>
              <Button
                type="button"
                size="sm"
                onClick={handleCopyPromptDetetive}
                className="font-mono text-xs gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-[8px] min-h-[38px] self-start sm:self-auto cursor-pointer"
              >
                {copiedPromptDetetive ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar para o Detetive</span>
                  </>
                )}
              </Button>
            </div>

            <pre className="p-3.5 rounded-[8px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-xs font-mono text-editorial-secondary whitespace-pre-wrap overflow-x-auto max-h-48">
              {buildPromptDetetive()}
            </pre>

            <p className="text-xs text-editorial-secondary font-light">
              Instrução: Abra uma conversa nova com a skill Detetive de Nicho (ou com o Plano B),
              cole o texto e acompanhe as Notas do detetive.
            </p>
          </div>

          {/* Campo grande para colar o Raio X do nicho */}
          <div className="space-y-2">
            <label
              htmlFor="campo-raio-x"
              className="font-sans font-semibold text-sm sm:text-base text-editorial-primary block"
            >
              Cole aqui o seu Raio X do nicho:
            </label>
            <Textarea
              id="campo-raio-x"
              rows={8}
              value={data.raioXNicho}
              onChange={(e) => updateField('raioXNicho', e.target.value)}
              placeholder="Cole aqui a resposta completa entregue pelo Detetive de Nicho..."
              className="text-xs sm:text-sm font-sans bg-white dark:bg-[#0c0914] border-slate-200 dark:border-[#27272A]"
            />
            <p className="text-xs text-editorial-secondary font-light">
              Ele é usado na Estação 7 para alimentar a skill de posicionamento.
            </p>
          </div>

          {/* Leitura com a lente */}
          <div className="space-y-4 pt-2 border-t border-slate-200/80 dark:border-[#27272A]">
            <h3 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
              Leitura com a lente dos níveis de consciência
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="campo-nivel-concorrentes"
                  className="text-xs sm:text-sm font-medium text-editorial-primary block"
                >
                  Com qual nível de consciência os meus concorrentes mais falam?
                </label>
                <Input
                  id="campo-nivel-concorrentes"
                  value={data.nivelConcorrentesMaisFalam}
                  onChange={(e) => updateField('nivelConcorrentesMaisFalam', e.target.value)}
                  placeholder="Ex: Nível 3 (Consciente da solução)..."
                  className="text-xs sm:text-sm bg-white dark:bg-[#0c0914] border-slate-200 dark:border-[#27272A]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="campo-nivel-ninguem"
                  className="text-xs sm:text-sm font-medium text-editorial-primary block"
                >
                  Qual nível ninguém está atendendo?
                </label>
                <Input
                  id="campo-nivel-ninguem"
                  value={data.nivelNinguemAtende}
                  onChange={(e) => updateField('nivelNinguemAtende', e.target.value)}
                  placeholder="Ex: Nível 2 (Consciente do problema)..."
                  className="text-xs sm:text-sm bg-white dark:bg-[#0c0914] border-slate-200 dark:border-[#27272A]"
                />
              </div>
            </div>
          </div>

          {/* Botão de avanço da Estação 4 */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs font-mono text-editorial-secondary">
              {podeAvancarEstacao4
                ? 'Raio X colado com sucesso.'
                : 'Cole o seu Raio X do nicho acima para liberar o avanço.'}
            </p>
            <Button
              type="button"
              disabled={!podeAvancarEstacao4}
              onClick={() => {
                if (currentEstacao < 5) setCurrentEstacao(5)
                avancarParaEstacao(5)
              }}
              className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-sm rounded-[8px] min-h-[44px] px-6 cursor-pointer"
            >
              <span>Ler o meu Raio X</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      )}

      {/* ESTAÇÃO 5 · ESCOLHA A SUA BRECHA */}
      {currentEstacao >= 5 && (
        <section
          id="estacao-5"
          className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-8 shadow-xs scroll-mt-36"
        >
          <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              ESTAÇÃO 5
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1">
              Estação 5 · Escolha a sua{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                brecha
              </em>
            </h2>{' '}
          </div>

          <CaixaCuidadoFixa />

          <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed font-light">
            O seu Raio X trouxe 3 brechas. Escolha UMA. Ela precisa conversar com a sua frase de
            direção.
          </p>

          {/* Frase de direção em destaque no topo para comparação */}
          <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/70 dark:bg-purple-950/20 border-l-4 border-l-[#7c3aed] dark:border-l-[#C084FC] border-y border-r border-purple-100 dark:border-purple-900/30 space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
              Sua frase de direção (para comparação):
            </span>
            <p className="font-serif-editorial text-base sm:text-lg text-editorial-primary italic leading-relaxed">
              "{data.fraseDirecao || '(Nenhuma frase de direção preenchida na Estação 0)'}"
            </p>
          </div>

          {/* Campos da brecha */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="campo-brecha"
                className="font-sans font-semibold text-xs sm:text-sm text-editorial-primary"
              >
                A brecha que eu escolhi:
              </label>
              <Textarea
                id="campo-brecha"
                rows={2}
                value={data.brechaEscolhida}
                onChange={(e) => updateField('brechaEscolhida', e.target.value)}
                placeholder="Ex: Mulheres que já tentaram terapia breve focada em produtividade e agora procuram escuta aprofundada..."
                className="text-xs sm:text-sm bg-white dark:bg-[#0c0914] border-slate-200 dark:border-[#27272A]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="campo-motivo-brecha"
                className="font-sans font-semibold text-xs sm:text-sm text-editorial-primary"
              >
                Escolho esta brecha porque...
              </label>
              <Textarea
                id="campo-motivo-brecha"
                rows={3}
                value={data.motivoBrecha}
                onChange={(e) => updateField('motivoBrecha', e.target.value)}
                placeholder="Ex: Conversa diretamente com a minha formação clínica e com a queixa mais recorrente que recebo..."
                className="text-xs sm:text-sm bg-white dark:bg-[#0c0914] border-slate-200 dark:border-[#27272A]"
              />
            </div>
          </div>

          {/* Caixa de aviso caso nenhuma brecha converse */}
          <div className="p-4 sm:p-5 rounded-[12px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200 dark:border-[#27272A] text-xs text-editorial-secondary space-y-1">
            <p className="font-semibold text-editorial-primary font-sans">
              E se nenhuma brecha conversar com a sua frase?
            </p>
            <p className="font-light leading-relaxed">
              Se nenhuma brecha conversa com a sua frase, anote isso. Também é informação. Veja o
              Caderno de erros (Estação 8).
            </p>
          </div>

          {/* Botão de avanço da Estação 5 */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs font-mono text-editorial-secondary">
              {podeAvancarEstacao5
                ? 'Brecha e justificativa preenchidas.'
                : 'Preencha a brecha escolhida e o motivo para avançar.'}
            </p>
            <Button
              type="button"
              disabled={!podeAvancarEstacao5}
              onClick={() => {
                if (currentEstacao < 6) setCurrentEstacao(6)
                avancarParaEstacao(6)
              }}
              className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-sm rounded-[8px] min-h-[44px] px-6 cursor-pointer"
            >
              <span>Definir o meu público</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      )}

      {/* ESTAÇÃO 6 · FICHA DE PÚBLICO-ALVO */}
      {currentEstacao >= 6 && (
        <section
          id="estacao-6"
          className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-8 shadow-xs scroll-mt-36"
        >
          <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              ESTAÇÃO 6
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1">
              Estação 6 · Ficha de{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                público-alvo
              </em>
            </h2>{' '}
          </div>

          <CaixaCuidadoFixa />

          <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed font-light">
            Defina o seu público em quatro categorias. Responda pelo menos duas.
          </p>

          {/* Quatro categorias */}
          <div className="space-y-6">
            {/* Categoria 1: Faixa etária */}
            <div className="space-y-2">
              <span className="font-sans font-semibold text-xs sm:text-sm text-editorial-primary block">
                Faixa etária:
              </span>
              <div className="flex flex-wrap gap-2">
                {['crianças e adolescentes', 'adultos jovens', 'adultos', 'pessoas idosas'].map(
                  (opcao) => {
                    const sel = data.publicoFaixasEtarias.includes(opcao)
                    return (
                      <button
                        key={opcao}
                        type="button"
                        onClick={() => {
                          const next = sel
                            ? data.publicoFaixasEtarias.filter((o) => o !== opcao)
                            : [...data.publicoFaixasEtarias, opcao]
                          updateField('publicoFaixasEtarias', next)
                        }}
                        className={`px-3 py-1.5 rounded-[8px] text-xs font-mono font-medium transition-colors cursor-pointer border ${
                          sel
                            ? 'bg-[#7c3aed] text-white border-[#7c3aed]'
                            : 'bg-white dark:bg-[#18181B] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#27272A] hover:bg-slate-50'
                        }`}
                      >
                        {opcao}
                      </button>
                    )
                  },
                )}
              </div>
            </div>

            {/* Categoria 2: Macroárea */}
            <div className="space-y-2">
              <span className="font-sans font-semibold text-xs sm:text-sm text-editorial-primary block">
                Macroárea:
              </span>
              <div className="flex flex-wrap gap-2">
                {['saúde emocional', 'relacionamentos', 'carreira e trabalho'].map((opcao) => {
                  const sel = data.publicoMacroareas.includes(opcao)
                  return (
                    <button
                      key={opcao}
                      type="button"
                      onClick={() => {
                        const next = sel
                          ? data.publicoMacroareas.filter((o) => o !== opcao)
                          : [...data.publicoMacroareas, opcao]
                        updateField('publicoMacroareas', next)
                      }}
                      className={`px-3 py-1.5 rounded-[8px] text-xs font-mono font-medium transition-colors cursor-pointer border ${
                        sel
                          ? 'bg-[#7c3aed] text-white border-[#7c3aed]'
                          : 'bg-white dark:bg-[#18181B] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#27272A] hover:bg-slate-50'
                      }`}
                    >
                      {opcao}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Categoria 3: Tipo de atendimento */}
            <div className="space-y-2">
              <span className="font-sans font-semibold text-xs sm:text-sm text-editorial-primary block">
                Tipo de atendimento:
              </span>
              <div className="flex flex-wrap gap-2">
                {['individual', 'casal', 'família', 'grupo'].map((opcao) => {
                  const sel = data.publicoTiposAtendimento.includes(opcao)
                  return (
                    <button
                      key={opcao}
                      type="button"
                      onClick={() => {
                        const next = sel
                          ? data.publicoTiposAtendimento.filter((o) => o !== opcao)
                          : [...data.publicoTiposAtendimento, opcao]
                        updateField('publicoTiposAtendimento', next)
                      }}
                      className={`px-3 py-1.5 rounded-[8px] text-xs font-mono font-medium transition-colors cursor-pointer border ${
                        sel
                          ? 'bg-[#7c3aed] text-white border-[#7c3aed]'
                          : 'bg-white dark:bg-[#18181B] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#27272A] hover:bg-slate-50'
                      }`}
                    >
                      {opcao}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Categoria 4: Contexto específico (campo livre) */}
            <div className="space-y-1.5">
              <label
                htmlFor="campo-contexto-especifico"
                className="font-sans font-semibold text-xs sm:text-sm text-editorial-primary block"
              >
                Contexto específico (campo livre):
              </label>
              <Input
                id="campo-contexto-especifico"
                value={data.publicoContextoEspecifico}
                onChange={(e) => updateField('publicoContextoEspecifico', e.target.value)}
                placeholder="Exemplos: perinatal, luto, esporte, organizacional..."
                className="text-xs sm:text-sm bg-white dark:bg-[#0c0914] border-slate-200 dark:border-[#27272A]"
              />
            </div>
          </div>

          {/* Campo "Meu trabalho é para..." */}
          <div className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-[#27272A]">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="campo-frase-trabalho"
                className="font-sans font-semibold text-sm sm:text-base text-editorial-primary"
              >
                Meu trabalho é para... (uma frase, até 200 caracteres):
              </label>
              <span className="text-xs font-mono text-editorial-secondary">
                {data.publicoFraseTrabalho.length}/200
              </span>
            </div>

            <Input
              id="campo-frase-trabalho"
              maxLength={200}
              value={data.publicoFraseTrabalho}
              onChange={(e) => updateField('publicoFraseTrabalho', e.target.value)}
              placeholder="Mulheres adultas, em sofrimento ligado ao trabalho..."
              className="text-xs sm:text-sm bg-white dark:bg-[#0c0914] border-slate-200 dark:border-[#27272A]"
            />

            {/* Exemplo em caixa */}
            <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200/80 dark:border-[#27272A] text-xs text-editorial-secondary">
              <strong className="font-semibold text-editorial-primary font-sans block mb-0.5">
                Exemplo:
              </strong>
              "Mulheres adultas, em sofrimento ligado ao trabalho, em atendimento individual e em
              grupo, no retorno da licença-maternidade."
            </div>
          </div>

          {/* O teste (três itens marcáveis) */}
          <div className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-[#27272A]">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
              O teste do público:
            </span>

            <div className="space-y-2">
              {[
                {
                  key: 'testeRespondiEmUmaFrase' as const,
                  texto: 'Respondi em uma frase.',
                },
                {
                  key: 'testeNaoEscreviTodoMundo' as const,
                  texto: "Não escrevi 'todo mundo que precisa de ajuda'.",
                },
                {
                  key: 'testeLiEmVozAlta' as const,
                  texto: 'Li em voz alta sem hesitar.',
                },
              ].map((t) => (
                <label
                  key={t.key}
                  className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-editorial-primary select-none"
                >
                  <input
                    type="checkbox"
                    checked={data[t.key]}
                    onChange={(e) => updateField(t.key, e.target.checked)}
                    className="w-4 h-4 rounded-[4px] accent-[#7c3aed] text-white cursor-pointer"
                  />
                  <span>{t.texto}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Botão de avanço da Estação 6 */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs font-mono text-editorial-secondary">
              {podeAvancarEstacao6
                ? 'Critérios atendidos (2+ categorias e frase escrita).'
                : 'Preencha pelo menos duas categorias e a frase do seu trabalho para avançar.'}
            </p>
            <Button
              type="button"
              disabled={!podeAvancarEstacao6}
              onClick={() => {
                if (currentEstacao < 7) setCurrentEstacao(7)
                avancarParaEstacao(7)
              }}
              className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-sm rounded-[8px] min-h-[44px] px-6 cursor-pointer"
            >
              <span>Gerar o meu posicionamento</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      )}

      {/* ESTAÇÃO 7 · RELATÓRIO DE POSICIONAMENTO */}
      {currentEstacao >= 7 && (
        <section
          id="estacao-7"
          className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-8 shadow-xs scroll-mt-36"
        >
          <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              ESTAÇÃO 7
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1">
              Estação 7 · Relatório de{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                posicionamento
              </em>
            </h2>{' '}
          </div>

          <CaixaCuidadoFixa />

          <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed font-light">
            Agora a skill de posicionamento junta tudo o que você construiu hoje e confronta o que
            ainda estiver vago.
          </p>

          {/* Caixa de prompt montada na hora */}
          <div className="p-5 sm:p-6 rounded-[14px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200/80 dark:border-[#27272A] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                Prompt compilado para a skill de posicionamento:
              </span>
              <Button
                type="button"
                size="sm"
                onClick={handleCopyPromptPosicionamento}
                className="font-mono text-xs gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-[8px] min-h-[38px] self-start sm:self-auto cursor-pointer"
              >
                {copiedPromptPosicionamento ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Tudo copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar tudo para a skill de posicionamento</span>
                  </>
                )}
              </Button>
            </div>

            <pre className="p-3.5 rounded-[8px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-xs font-mono text-editorial-secondary whitespace-pre-wrap overflow-x-auto max-h-56">
              {buildPromptPosicionamento()}
            </pre>

            <p className="text-xs text-editorial-secondary font-light">
              Instrução: Abra uma conversa nova com a skill de posicionamento (ou com o Plano B),
              cole o texto e responda às perguntas com sinceridade.
            </p>
          </div>

          {/* Campo grande para colar o relatório de posicionamento */}
          <div className="space-y-2">
            <label
              htmlFor="campo-relatorio"
              className="font-sans font-semibold text-sm sm:text-base text-editorial-primary block"
            >
              Cole aqui o seu relatório de posicionamento:
            </label>
            <Textarea
              id="campo-relatorio"
              rows={8}
              value={data.relatorioPosicionamento}
              onChange={(e) => updateField('relatorioPosicionamento', e.target.value)}
              placeholder="Cole aqui o relatório final entregue pela skill de posicionamento..."
              className="text-xs sm:text-sm font-sans bg-white dark:bg-[#0c0914] border-slate-200 dark:border-[#27272A]"
            />
          </div>

          {/* Cuidado ético CFP */}
          <div className="p-4 sm:p-5 rounded-[12px] bg-purple-50/70 dark:bg-purple-950/25 border border-purple-200 dark:border-purple-800 text-xs sm:text-sm text-editorial-secondary space-y-1">
            <p className="font-semibold text-editorial-primary font-sans">
              Cuidado ético na comunicação clínica:
            </p>
            <p className="font-light leading-relaxed">
              Antes de usar qualquer frase do relatório na sua divulgação, confira as orientações do
              Conselho Federal de Psicologia sobre publicidade: sem promessa de resultado e sem
              depoimentos de pacientes.
            </p>
          </div>

          {/* Botão de avanço da Estação 7 */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs font-mono text-editorial-secondary">
              {podeAvancarEstacao7
                ? 'Relatório registrado.'
                : 'Cole o seu relatório de posicionamento para avançar.'}
            </p>
            <Button
              type="button"
              disabled={!podeAvancarEstacao7}
              onClick={() => {
                if (currentEstacao < 8) setCurrentEstacao(8)
                avancarParaEstacao(8)
              }}
              className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-sm rounded-[8px] min-h-[44px] px-6 cursor-pointer"
            >
              <span>Ver o Caderno de erros</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      )}

      {/* ESTAÇÃO 8 · CADERNO DE ERROS */}
      {currentEstacao >= 8 && (
        <section
          id="estacao-8"
          className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7 shadow-xs scroll-mt-36"
        >
          <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              ESTAÇÃO 8
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1">
              Estação 8 · Caderno de{' '}
              <em className="font-serif-anchor not-italic text-[#ea580c] dark:text-[#FB923C]">
                erros
              </em>
            </h2>{' '}
          </div>

          <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed font-light">
            Cartões "Se acontecer isto, faça isto":
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                se: 'A busca não funcionou.',
                faca: 'Confira se a busca na internet está disponível na sua conta. Se não estiver, avise no grupo: a Tati roda o seu Raio X ao vivo.',
              },
              {
                se: 'O Raio X trouxe dado sem fonte.',
                faca: "Peça: 'Mostre a fonte de cada dado e marque o que você não encontrou.'",
              },
              {
                se: 'A importação da skill deu erro.',
                faca: 'Use o Plano B da Estação 2.',
              },
              {
                se: 'A skill decidiu por você.',
                faca: "Responda: 'Me devolva as opções e os critérios. A decisão é minha.'",
              },
              {
                se: 'Nenhuma brecha conversa com a sua frase.',
                faca: 'Rode o Detetive de novo, trocando a descrição do público na pergunta 1.',
              },
              {
                se: 'O relatório ficou genérico.',
                faca: "Responda: 'Use as minhas palavras e o meu Raio X. Aponte o que ainda está vago em mim.'",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ea580c] dark:bg-[#FB923C]" />
                  <h4 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
                    {card.se}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-editorial-secondary font-light leading-relaxed pl-4 border-l border-slate-200 dark:border-[#27272A]">
                  → {card.faca}
                </p>
              </div>
            ))}
          </div>

          {/* Botão de avanço da Estação 8 */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-[#27272A] flex justify-end">
            <Button
              type="button"
              disabled={!podeAvancarEstacao8}
              onClick={() => {
                if (currentEstacao < 9) setCurrentEstacao(9)
                avancarParaEstacao(9)
              }}
              className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-sm rounded-[8px] min-h-[44px] px-6 cursor-pointer"
            >
              <span>Concluir o Encontro 2</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      )}

      {/* ESTAÇÃO 9 · FECHAMENTO */}
      {currentEstacao >= 9 && (
        <section
          id="estacao-9"
          className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-8 shadow-xs scroll-mt-36"
        >
          <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
              ESTAÇÃO 9
            </span>
            <h2 className="h-section font-medium text-editorial-primary mt-1">
              Fechamento · O que você{' '}
              <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
                leva
              </em>{' '}
              de hoje
            </h2>
          </div>
          {/* Item 1: Baixar e Imprimir */}
          <div className="p-6 rounded-[16px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] space-y-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-[#7c3aed] dark:text-[#C084FC]" />
              <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                1. Guarde o seu registro
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-editorial-secondary font-light leading-relaxed">
              Gere um arquivo de texto limpo com as suas respostas e o relatório completo, ou
              imprima a síntese para a sua pasta da Academia.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={handleDownloadTxt}
                className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-xs sm:text-sm rounded-[8px] min-h-[44px] px-5 gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Baixar o meu Encontro 2 (.txt)</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handlePrint}
                className="border-slate-200 dark:border-[#27272A] text-slate-800 dark:text-white font-mono text-xs rounded-[8px] min-h-[44px] px-4 gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir síntese</span>
              </Button>
            </div>
          </div>

          {/* Item 2: Entrega da semana */}
          <div className="p-6 rounded-[16px] border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/60 dark:bg-purple-950/20 space-y-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#7c3aed] dark:text-[#C084FC]" />
              <h3 className="font-sans font-semibold text-base sm:text-lg text-editorial-primary">
                2. Entrega da semana
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-editorial-primary font-light leading-relaxed">
              Poste na comunidade: a brecha que você escolheu, a frase do seu público e o seu
              relatório de posicionamento.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://comunidade.entrelacos.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[8px] bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs font-mono min-h-[42px]"
              >
                <span>Acessar Comunidade</span>
                <BlocoRevisaoTati>[TATI PREENCHE o link]</BlocoRevisaoTati>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>

              <Button
                type="button"
                variant="outline"
                onClick={handleCopyEntrega}
                className="font-mono text-xs rounded-[8px] min-h-[42px] gap-1.5 border-purple-300 dark:border-purple-800 text-[#7c3aed] dark:text-[#C084FC] bg-white dark:bg-[#18181B] cursor-pointer"
              >
                {copiedEntrega ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Entrega copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar a minha entrega</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Item 3: Próximo encontro */}
          <div className="p-6 rounded-[16px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] block">
              3. Próximo encontro
            </span>
            <p className="text-xs sm:text-sm text-editorial-primary font-light leading-relaxed">
              Encontro 3: manifesto da marca e PVU. Traga o seu relatório de posicionamento. Ele é a
              matéria-prima.
            </p>
          </div>

          {/* Item 4: Link discreto "Apagar as minhas respostas" com confirmação inline */}
          <div className="pt-6 border-t border-slate-200/80 dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-editorial-secondary">
              Suas respostas ficam salvas exclusivamente no navegador deste computador.
            </div>

            {!confirmingDelete ? (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="text-xs font-mono text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 underline cursor-pointer transition-colors"
              >
                Apagar as minhas respostas
              </button>
            ) : (
              <div className="p-3 rounded-[10px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2.5">
                <span className="text-xs font-mono text-rose-700 dark:text-rose-300 font-medium">
                  Tem certeza? Isso limpa todas as respostas do Encontro 2.
                </span>
                <button
                  type="button"
                  onClick={handleApagarRespostas}
                  className="px-2.5 py-1 rounded-[6px] bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-semibold cursor-pointer"
                >
                  Sim, apagar tudo
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="px-2 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 font-mono text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </article>
  )
}

export default Encontro2Caderno
