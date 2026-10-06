import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Download,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  HeartHandshake,
  Check,
  Compass,
  FileText,
  Clock,
  TrendingUp,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DIAGNOSTICO_24_PERGUNTAS_V2,
  calcularDiagnosticoV2,
  ResultadoDiagnosticoV2,
  ContextoInicial,
  DEFAULT_CONTEXTO_INICIAL,
  RespostasAbertasPilares,
  DEFAULT_RESPOSTAS_ABERTAS,
  CuidadoClinico,
  DEFAULT_CUIDADO_CLINICO,
  PERGUNTA_CUIDADO_CONDUCAO,
  PERGUNTA_CUIDADO_SUPERVISAO,
  RESSALVA_ESCOPO,
  RESSALVA_PERCENTUAL,
  CHECKLIST_SEIS_MOVIMENTOS,
  PilarId,
} from '@/lib/diagnosticoFacEngine'
import { DiagnosticoRadar } from '@/components/guia/DiagnosticoRadar'
import { PrintableDiagnosticoReport } from '@/components/guia/PrintableDiagnosticoReport'
import { downloadDiagnosticoPdf } from '@/lib/diagnosticoPdfGenerator'

const STORAGE_KEY_DIAGNOSTICO_V2 = 'entrelacos_fac_diagnostico_v2_data'

type AbaResultado =
  | 'visao_geral'
  | 'combinacao'
  | 'por_onde_comecar'
  | 'pilares'
  | 'dimensoes'
  | 'alertas'
  | 'passos'

export const DiagnosticoFACSection: React.FC = () => {
  // Estado local completo: respostas (1-24), contexto, abertas e cuidado clínico
  const [respostas, setRespostas] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DIAGNOSTICO_V2)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.respostas) return parsed.respostas
      }
    } catch {
      // ignore
    }
    return {}
  })

  const [contexto, setContexto] = useState<ContextoInicial>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DIAGNOSTICO_V2)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.contexto) return parsed.contexto
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONTEXTO_INICIAL
  })

  const [respostasAbertas, setRespostasAbertas] = useState<RespostasAbertasPilares>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DIAGNOSTICO_V2)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.respostasAbertas) return parsed.respostasAbertas
      }
    } catch {
      // ignore
    }
    return DEFAULT_RESPOSTAS_ABERTAS
  })

  const [cuidadoClinico, setCuidadoClinico] = useState<CuidadoClinico>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DIAGNOSTICO_V2)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.cuidadoClinico) return parsed.cuidadoClinico
      }
    } catch {
      // ignore
    }
    return DEFAULT_CUIDADO_CLINICO
  })

  // Modo: 'contexto_inicial' | 'perguntas' | 'cuidado_clinico' | 'resultado'
  const [etapaFluxo, setEtapaFluxo] = useState<
    'contexto_inicial' | 'perguntas' | 'cuidado_clinico' | 'resultado'
  >('contexto_inicial')
  const [perguntaAtual, setPerguntaAtual] = useState<number>(1)
  const [abaResultado, setAbaResultado] = useState<AbaResultado>('visao_geral')
  const [copiadoComunidade, setCopiadoComunidade] = useState(false)
  const [isGerandoPdf, setIsGerandoPdf] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [pdfSuccess, setPdfSuccess] = useState(false)

  // Salvar no navegador da usuária (100% local)
  useEffect(() => {
    try {
      const payload = {
        instrumentVersion: 2,
        respostas,
        contexto,
        respostasAbertas,
        cuidadoClinico,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY_DIAGNOSTICO_V2, JSON.stringify(payload))
    } catch {
      // ignore
    }
  }, [respostas, contexto, respostasAbertas, cuidadoClinico])

  const totalRespondidas = Object.keys(respostas).filter(
    (k) => respostas[Number(k)] >= 1 && respostas[Number(k)] <= 4,
  ).length
  const totalPerguntas = 24
  const perguntasCompletas = totalRespondidas === totalPerguntas
  const cuidadoPreenchido =
    cuidadoClinico.conducaoClinica !== null && cuidadoClinico.supervisaoRegular !== null

  // Se já tinha tudo completo antes ao abrir
  useEffect(() => {
    if (perguntasCompletas && cuidadoPreenchido) {
      setEtapaFluxo('resultado')
    }
  }, [])

  const resultado: ResultadoDiagnosticoV2 | null = calcularDiagnosticoV2(
    respostas,
    contexto,
    respostasAbertas,
    cuidadoClinico,
  )

  const handleSelectOpcao = (perguntaId: number, valor: number) => {
    setRespostas((prev) => ({ ...prev, [perguntaId]: valor }))
    if (perguntaId < 24) {
      setPerguntaAtual(perguntaId + 1)
    } else {
      // Chegou ao fim das 24 questões: vai para o bloco de cuidado clínico
      setEtapaFluxo('cuidado_clinico')
    }
  }

  const handleLimparRascunho = () => {
    if (
      window.confirm(
        'Deseja reiniciar as respostas do diagnóstico? Os dados anteriores serão apagados deste navegador.',
      )
    ) {
      setRespostas({})
      setContexto(DEFAULT_CONTEXTO_INICIAL)
      setRespostasAbertas(DEFAULT_RESPOSTAS_ABERTAS)
      setCuidadoClinico(DEFAULT_CUIDADO_CLINICO)
      setPerguntaAtual(1)
      setEtapaFluxo('contexto_inicial')
      try {
        localStorage.removeItem(STORAGE_KEY_DIAGNOSTICO_V2)
      } catch {
        // ignore
      }
    }
  }

  const handleCopiarResumoComunidade = () => {
    if (!resultado) return
    const texto = `Diagnóstico FAC (Versão 2):\nOrdem dos Pilares: ${resultado.pilaresOrdenados.map((p) => p.nome).join(' → ')}\nLeitura: "${resultado.tituloLeitura}"`
    navigator.clipboard.writeText(texto)
    setCopiadoComunidade(true)
    setTimeout(() => setCopiadoComunidade(false), 3000)
  }

  const handleBaixarPdf = async () => {
    if (!resultado) {
      setPdfError('Conclua as perguntas antes de gerar o PDF.')
      return
    }

    setIsGerandoPdf(true)
    setPdfError(null)
    setPdfSuccess(false)

    try {
      const res = await downloadDiagnosticoPdf(resultado)
      if (res.success) {
        setPdfSuccess(true)
        setTimeout(() => setPdfSuccess(false), 4000)
      } else {
        setPdfError(
          res.error || 'Não foi possível gerar o PDF. Você também pode usar Imprimir na tela.',
        )
      }
    } catch (err) {
      console.error('[DiagnosticoFAC] Falha inesperada ao baixar PDF:', err)
      setPdfError(
        err instanceof Error
          ? err.message
          : 'Erro inesperado na geração do PDF. Tente novamente ou use a impressão do navegador.',
      )
    } finally {
      setIsGerandoPdf(false)
    }
  }

  const handleImprimirNavegador = () => {
    window.print()
  }

  const perguntaObj =
    DIAGNOSTICO_24_PERGUNTAS_V2.find((p) => p.id === perguntaAtual) ||
    DIAGNOSTICO_24_PERGUNTAS_V2[0]

  return (
    <div className="space-y-6">
      {/* Aviso obrigatório de privacidade editorial */}
      <div className="p-4 rounded-[12px] bg-purple-50/70 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs print:hidden">
        <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200">
          <Shield className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC] shrink-0" />
          <span>
            <strong>Privacidade Local Absoluta:</strong> Seus dados e respostas ficam SOMENTE neste
            navegador. Baixe o PDF para guardar o resultado.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-[10px] font-mono text-purple-800 dark:text-purple-300 border-purple-300 dark:border-[#7c3aed]/50 shrink-0"
          >
            Versão 2 · 04/10/2026
          </Badge>
          <span className="text-[11px] font-mono text-slate-500">24 Perguntas · 3 Pilares FAC</span>
        </div>
      </div>

      {/* RENDERIZADOR DAS ETAPAS */}
      {etapaFluxo === 'contexto_inicial' && (
        <div className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-6 print:hidden">
          <div className="border-b border-slate-200 dark:border-[#27272A] pb-4">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
              Etapa Preparatória · Antes das 24 Perguntas
            </span>
            <h3 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-slate-900 dark:text-white">
              Contexto da sua Prática Clínica Atual
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#A1A1AA] mt-1">
              Essas respostas complementares não alteram a nota FAC. Elas enriquecem a
              contextualização e alimentam alertas sobre sua agenda.
            </p>
          </div>

          <div className="space-y-5 text-xs sm:text-sm">
            {/* Momento de Carreira */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-white block">
                1. Momento de carreira:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Início da clínica (até 2 anos de formada)',
                  'Transição de carreira / CLT para o consultório',
                  'Clínica em consolidação (3 a 7 anos)',
                  'Clínica madura (mais de 7 anos)',
                ].map((momento) => (
                  <button
                    key={momento}
                    type="button"
                    onClick={() => setContexto((prev) => ({ ...prev, momentoCarreira: momento }))}
                    className={`p-3 rounded-[8px] border text-left cursor-pointer transition-all ${
                      contexto.momentoCarreira === momento
                        ? 'border-[#7c3aed] bg-purple-50 dark:bg-purple-950/40 font-semibold text-[#7c3aed] dark:text-[#C084FC]'
                        : 'border-slate-200 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#121216] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {momento}
                  </button>
                ))}
              </div>
            </div>

            {/* Formas Atuais de Atendimento */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-white block">
                2. Formas atuais de atendimento (marque todas que você usa hoje):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'online', label: 'Online' },
                  { id: 'presencial', label: 'Presencial' },
                  { id: 'plataforma', label: 'Plataformas (Zenklub, etc.)' },
                  { id: 'convenio', label: 'Convênio / Planos' },
                ].map((item) => {
                  const checked = contexto.formasAtendimento.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setContexto((prev) => {
                          const existe = prev.formasAtendimento.includes(item.id)
                          return {
                            ...prev,
                            formasAtendimento: existe
                              ? prev.formasAtendimento.filter((x) => x !== item.id)
                              : [...prev.formasAtendimento, item.id],
                          }
                        })
                      }}
                      className={`p-3 rounded-[8px] border text-left cursor-pointer transition-all ${
                        checked
                          ? 'border-[#7c3aed] bg-purple-50 dark:bg-purple-950/40 font-semibold text-[#7c3aed] dark:text-[#C084FC]'
                          : 'border-slate-200 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#121216] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${checked ? 'bg-[#7c3aed] text-white' : 'border-slate-400'}`}
                        >
                          {checked && '✓'}
                        </span>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sessões por semana (Atual e Desejado) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900 dark:text-white block">
                  3. Sessões particulares por semana ATUAL:
                </label>
                <input
                  type="number"
                  min="0"
                  max="80"
                  value={contexto.sessoesAtuais ?? ''}
                  onChange={(e) =>
                    setContexto((prev) => ({
                      ...prev,
                      sessoesAtuais: e.target.value === '' ? null : Number(e.target.value),
                    }))
                  }
                  placeholder="Ex: 12"
                  className="w-full p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#121216] text-slate-900 dark:text-white font-mono text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900 dark:text-white block">
                  4. Sessões particulares por semana DESEJADO:
                </label>
                <input
                  type="number"
                  min="0"
                  max="80"
                  value={contexto.sessoesDesejadas ?? ''}
                  onChange={(e) =>
                    setContexto((prev) => ({
                      ...prev,
                      sessoesDesejadas: e.target.value === '' ? null : Number(e.target.value),
                    }))
                  }
                  placeholder="Ex: 16"
                  className="w-full p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#121216] text-slate-900 dark:text-white font-mono text-sm"
                />
              </div>
            </div>

            {/* Origens dos últimos 5 pacientes */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-900 dark:text-white block">
                5. Origens dos seus últimos cinco pacientes particulares:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'indicacao_colegas', label: 'Indicação de colegas' },
                  { id: 'indicacao_pacientes', label: 'Indicação de pacientes' },
                  { id: 'instagram', label: 'Instagram / Redes' },
                  { id: 'google_site', label: 'Google / Site próprio' },
                  { id: 'plataforma', label: 'Plataforma intermediadora' },
                  { id: 'outros', label: 'Outras origens' },
                ].map((item) => {
                  const checked = contexto.origensUltimosPacientes.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setContexto((prev) => {
                          const existe = prev.origensUltimosPacientes.includes(item.id)
                          return {
                            ...prev,
                            origensUltimosPacientes: existe
                              ? prev.origensUltimosPacientes.filter((x) => x !== item.id)
                              : [...prev.origensUltimosPacientes, item.id],
                          }
                        })
                      }}
                      className={`p-2.5 rounded-[8px] border text-left cursor-pointer transition-all ${
                        checked
                          ? 'border-[#7c3aed] bg-purple-50 dark:bg-purple-950/40 font-semibold text-[#7c3aed] dark:text-[#C084FC]'
                          : 'border-slate-200 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#121216] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-xs">
                        <span
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${checked ? 'bg-[#7c3aed] text-white' : 'border-slate-400'}`}
                        >
                          {checked && '✓'}
                        </span>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* O que mais trava a prática */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-900 dark:text-white block">
                  6. Em texto livre, o que mais trava a sua prática clínica hoje?
                </label>
                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                  Lembrete: Não insira dados de pacientes.
                </span>
              </div>
              <textarea
                value={contexto.oQueMaisTrava}
                onChange={(e) =>
                  setContexto((prev) => ({ ...prev, oQueMaisTrava: e.target.value }))
                }
                placeholder="Ex: Sinto dificuldade em divulgar, receio de cobrar o reajuste anual e horários ociosos na agenda..."
                rows={3}
                className="w-full p-3 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#121216] text-slate-900 dark:text-white text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-[#27272A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500 text-center sm:text-left">
              Pronta para iniciar as 24 perguntas do Diagnóstico.
            </span>
            <Button
              onClick={() => setEtapaFluxo('perguntas')}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold gap-1.5 rounded-[8px] min-h-[44px] justify-center"
            >
              <span>Iniciar 24 Perguntas</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ETAPA DAS 24 PERGUNTAS */}
      {etapaFluxo === 'perguntas' && (
        <div className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-6 print:hidden">
          {/* Barra de progresso das 24 perguntas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 dark:text-[#A1A1AA]">
                Pergunta {perguntaAtual} de 24 ({totalRespondidas} respondidas)
              </span>
              <span className="text-[#7c3aed] dark:text-[#C084FC] font-semibold">
                Pilar: {perguntaObj.pilar.toUpperCase()} · Dimensão: {perguntaObj.dimensaoCodigo} (
                {perguntaObj.dimensaoNome})
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#0A0A14] overflow-hidden">
              <div
                className="h-full bg-[#7c3aed] dark:bg-[#C084FC] transition-all duration-300 rounded-full"
                style={{ width: `${Math.round((totalRespondidas / 24) * 100)}%` }}
              />
            </div>
          </div>

          {/* Enunciado da pergunta */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 dark:bg-[#27272A] text-[#7c3aed] dark:text-[#C084FC] border-purple-200 dark:border-transparent font-mono text-[11px]">
                {perguntaObj.codigo} · {perguntaObj.dimensaoNome}
              </Badge>
              {perguntaObj.id === 18 && (
                <span
                  className="text-[11px] font-mono text-slate-500"
                  title="Diferencia ausência de dados de perda observada"
                >
                  (Mapeamento de agendamentos)
                </span>
              )}
            </div>
            <h4 className="font-sans text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-snug">
              {perguntaObj.enunciado}
            </h4>
          </div>

          {/* Alternativas de 1 a 4 */}
          <div className="space-y-2.5">
            {perguntaObj.opcoes.map((opcao) => {
              const selecionada = respostas[perguntaObj.id] === opcao.valor
              return (
                <button
                  key={opcao.valor}
                  type="button"
                  onClick={() => handleSelectOpcao(perguntaObj.id, opcao.valor)}
                  className={`w-full p-4 rounded-[10px] text-left text-xs sm:text-sm border transition-all flex items-start gap-3.5 cursor-pointer ${
                    selecionada
                      ? 'bg-purple-50/80 dark:bg-purple-950/40 border-[#7c3aed] dark:border-[#C084FC] text-slate-900 dark:text-white shadow-xs'
                      : 'bg-slate-50/60 dark:bg-[#121216] border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-[#3f3f46]'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                      selecionada
                        ? 'bg-[#7c3aed] text-white dark:bg-[#C084FC] dark:text-[#0A0A14]'
                        : 'bg-white dark:bg-[#18181B] border border-slate-300 dark:border-[#27272A] text-slate-500'
                    }`}
                  >
                    {opcao.valor}
                  </span>
                  <span className="leading-relaxed flex-1">{opcao.texto}</span>
                </button>
              )
            })}
          </div>

          {/* Pergunta Aberta ao fim de cada pilar (Perguntas 8, 16 e 24) */}
          {perguntaAtual === 8 && (
            <div className="p-4 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Pergunta aberta do Pilar Fundação:
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400">
                  Não insira dados de pacientes.
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                "O que você já tentou organizar na sua Fundação e não foi adiante?"
              </p>
              <textarea
                value={respostasAbertas.fundacao}
                onChange={(e) =>
                  setRespostasAbertas((prev) => ({ ...prev, fundacao: e.target.value }))
                }
                placeholder="Escreva sua resposta..."
                rows={2}
                className="w-full p-2.5 rounded-[6px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs text-slate-900 dark:text-white"
              />
            </div>
          )}

          {perguntaAtual === 16 && (
            <div className="p-4 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Pergunta aberta do Pilar Atração:
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400">
                  Não insira dados de pacientes.
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                "Qual canal já trouxe paciente para você, mesmo que poucas vezes?"
              </p>
              <textarea
                value={respostasAbertas.atracao}
                onChange={(e) =>
                  setRespostasAbertas((prev) => ({ ...prev, atracao: e.target.value }))
                }
                placeholder="Escreva sua resposta..."
                rows={2}
                className="w-full p-2.5 rounded-[6px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs text-slate-900 dark:text-white"
              />
            </div>
          )}

          {perguntaAtual === 24 && (
            <div className="p-4 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Pergunta aberta do Pilar Conexão:
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400">
                  Não insira dados de pacientes.
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                "Em que momento você mais perde pessoas: antes de agendar, entre o agendamento e a
                primeira sessão, ou nas primeiras sessões? Conte o que percebe."
              </p>
              <textarea
                value={respostasAbertas.conexao}
                onChange={(e) =>
                  setRespostasAbertas((prev) => ({ ...prev, conexao: e.target.value }))
                }
                placeholder="Escreva sua resposta..."
                rows={2}
                className="w-full p-2.5 rounded-[6px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* Navegação entre perguntas */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-200 dark:border-[#27272A]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (perguntaAtual === 1) {
                  setEtapaFluxo('contexto_inicial')
                } else {
                  setPerguntaAtual((prev) => Math.max(1, prev - 1))
                }
              }}
              className="min-h-[44px] px-3 gap-1 font-mono text-xs rounded-[8px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </Button>

            <div className="flex items-center gap-2">
              {perguntasCompletas && (
                <Button
                  onClick={() => setEtapaFluxo(cuidadoPreenchido ? 'resultado' : 'cuidado_clinico')}
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold text-xs rounded-[8px] min-h-[44px] px-3"
                >
                  {cuidadoPreenchido ? 'Ver Resultado' : 'Cuidado Clínico →'}
                </Button>
              )}

              {perguntaAtual < 24 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPerguntaAtual((prev) => Math.min(24, prev + 1))}
                  className="min-h-[44px] px-3 gap-1 font-mono text-xs rounded-[8px]"
                >
                  <span>Próxima</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setEtapaFluxo('cuidado_clinico')}
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs rounded-[8px]"
                >
                  <span>Cuidado Clínico</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ETAPA OBRIGATÓRIA DE CUIDADO CLÍNICO */}
      {etapaFluxo === 'cuidado_clinico' && (
        <div className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-6 print:hidden">
          <div className="border-b border-slate-200 dark:border-[#27272A] pb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
              Bloco Obrigatório · Fora da Nota FAC
            </span>
            <h3 className="font-sans text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
              Cuidado Clínico & Sustentação Ética
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#A1A1AA] mt-1">
              Essas duas perguntas não somam nem diminuem sua pontuação FAC. Elas registram sua
              sustentação técnica e ativam avisos de apoio quando você indicar sobrecarga.
            </p>
          </div>

          <div className="space-y-6">
            {/* Pergunta 1: Condução Clínica */}
            <div className="space-y-3">
              <label className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white block">
                1. {PERGUNTA_CUIDADO_CONDUCAO.enunciado}
              </label>
              <div className="space-y-2">
                {PERGUNTA_CUIDADO_CONDUCAO.opcoes.map((op) => {
                  const sel = cuidadoClinico.conducaoClinica === op.valor
                  return (
                    <button
                      key={op.valor}
                      type="button"
                      onClick={() =>
                        setCuidadoClinico((prev) => ({ ...prev, conducaoClinica: op.valor }))
                      }
                      className={`w-full p-3.5 rounded-[10px] text-left text-xs sm:text-sm border transition-all flex items-start gap-3 cursor-pointer ${
                        sel
                          ? 'bg-purple-50/80 dark:bg-purple-950/40 border-[#7c3aed] text-slate-900 dark:text-white'
                          : 'bg-slate-50/60 dark:bg-[#121216] border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 ${sel ? 'bg-[#7c3aed] text-white' : 'border border-slate-300'}`}
                      >
                        {op.valor}
                      </span>
                      <span>{op.texto}</span>
                    </button>
                  )
                })}
              </div>

              {(cuidadoClinico.conducaoClinica === 1 || cuidadoClinico.conducaoClinica === 2) && (
                <div className="p-3.5 rounded-[10px] bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Aviso de Apoio Clínico:</strong> Você sinalizou insegurança ou
                    sobrecarga na condução clínica. A Academia FAC recomenda buscar supervisão
                    clínica e acompanhamento psicoterapêutico individual em paralelo.
                  </span>
                </div>
              )}
            </div>

            {/* Pergunta 2: Supervisão Regular */}
            <div className="space-y-3">
              <label className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white block">
                2. {PERGUNTA_CUIDADO_SUPERVISAO.enunciado}
              </label>
              <div className="space-y-2">
                {PERGUNTA_CUIDADO_SUPERVISAO.opcoes.map((op) => {
                  const sel = cuidadoClinico.supervisaoRegular === op.valor
                  return (
                    <button
                      key={op.valor}
                      type="button"
                      onClick={() =>
                        setCuidadoClinico((prev) => ({ ...prev, supervisaoRegular: op.valor }))
                      }
                      className={`w-full p-3.5 rounded-[10px] text-left text-xs sm:text-sm border transition-all flex items-start gap-3 cursor-pointer ${
                        sel
                          ? 'bg-purple-50/80 dark:bg-purple-950/40 border-[#7c3aed] text-slate-900 dark:text-white'
                          : 'bg-slate-50/60 dark:bg-[#121216] border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 ${sel ? 'bg-[#7c3aed] text-white' : 'border border-slate-300'}`}
                      >
                        {op.valor}
                      </span>
                      <span>{op.texto}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-[#27272A] flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEtapaFluxo('perguntas')}
              className="gap-1 font-mono text-xs rounded-[8px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar às 24 Perguntas</span>
            </Button>

            <Button
              disabled={!perguntasCompletas || !cuidadoPreenchido}
              onClick={() => setEtapaFluxo('resultado')}
              className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-semibold gap-1.5 rounded-[8px]"
            >
              <span>Gerar Resultado Completo</span>
              <Check className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ETAPA DO RESULTADO: 7 TELAS EM ABAS / SEÇÕES */}
      {etapaFluxo === 'resultado' && resultado && (
        <div className="space-y-6">
          {/* Barra superior de Ações e Exportações */}
          <div className="p-5 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                  Diagnóstico FAC Aprofundado
                </span>
                <Badge
                  variant="outline"
                  className="text-[9px] font-mono border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                >
                  Versão 2 · 04/10/2026
                </Badge>
              </div>
              <h3 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-slate-900 dark:text-white">
                {resultado.tituloLeitura}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopiarResumoComunidade}
                className="min-h-[44px] sm:min-h-0 sm:h-9 flex-1 sm:flex-none gap-1.5 font-mono text-xs border-purple-200 dark:border-[#7c3aed]/40 text-[#7c3aed] dark:text-[#C084FC] rounded-[8px]"
                title="Compartilhar apenas ordem dos pilares e título"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="truncate">
                  {copiadoComunidade ? 'Copiado!' : 'Resumo Comunidade'}
                </span>
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={handleBaixarPdf}
                disabled={isGerandoPdf}
                className="min-h-[44px] sm:min-h-0 sm:h-9 flex-1 sm:flex-none gap-1.5 font-mono text-xs bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-[8px] shadow-sm disabled:opacity-60 cursor-pointer"
                title="Gera o arquivo diagnostico-fac-aprofundado.pdf em A4 com gráficos vetoriais"
              >
                {isGerandoPdf ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                    <span>Gerando PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 shrink-0" />
                    <span>{pdfSuccess ? 'PDF Baixado!' : 'Baixar PDF'}</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleImprimirNavegador}
                className="min-h-[44px] sm:min-h-0 sm:h-9 gap-1.5 font-mono text-xs border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-slate-300 rounded-[8px]"
                title="Abre a tela de impressão rápida do navegador (Ctrl+P / Cmd+P)"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Imprimir</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLimparRascunho}
                className="min-h-[44px] min-w-[44px] text-xs font-mono text-slate-500 hover:text-rose-600 rounded-[8px]"
                title="Reiniciar respostas"
                aria-label="Reiniciar respostas do questionário"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mensagem de Erro Clara caso a geração de PDF falhe */}
          {pdfError && (
            <div className="p-4 rounded-[12px] bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-200 print:hidden animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <strong className="font-semibold block">
                  Não foi possível baixar o PDF diretamente:
                </strong>
                <p>{pdfError}</p>
                <div className="pt-2 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBaixarPdf}
                    className="h-7 text-xs border-rose-300 text-rose-800 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/50"
                  >
                    Tentar Novamente
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleImprimirNavegador}
                    className="h-7 text-xs text-rose-700 dark:text-rose-300 hover:underline"
                  >
                    Usar Impressão / Salvar como PDF
                  </Button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPdfError(null)}
                className="text-rose-500 hover:text-rose-700 text-sm font-bold ml-2 cursor-pointer"
                title="Fechar alerta"
              >
                ✕
              </button>
            </div>
          )}

          {/* Notificação de Sucesso */}
          {pdfSuccess && (
            <div className="p-3.5 rounded-[12px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200 print:hidden animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>Download iniciado com sucesso!</strong> O arquivo{' '}
                <code className="font-mono bg-emerald-100 dark:bg-emerald-900/60 px-1 py-0.5 rounded">
                  diagnostico-fac-aprofundado.pdf
                </code>{' '}
                foi gerado com gráficos vetoriais em formato A4.
              </span>
            </div>
          )}

          {/* Navegação entre as 7 Telas */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none print:hidden">
            {[
              { id: 'visao_geral' as const, label: '1. Visão Geral' },
              { id: 'combinacao' as const, label: '2. Leitura da Combinação' },
              { id: 'por_onde_comecar' as const, label: '3. Por Onde Começar' },
              { id: 'pilares' as const, label: '4. Análise dos 3 Pilares' },
              { id: 'dimensoes' as const, label: '5. As 12 Dimensões' },
              { id: 'alertas' as const, label: `6. Alertas (${resultado.alertas.length})` },
              { id: 'passos' as const, label: '7. Suas Palavras & Passos' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAbaResultado(tab.id)}
                className={`px-3 py-2 rounded-[8px] text-xs font-mono font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  abaResultado === tab.id
                    ? 'bg-[#7c3aed] text-white shadow-xs'
                    : 'bg-white dark:bg-[#18181B] text-slate-600 dark:text-[#A1A1AA] border border-slate-200 dark:border-[#27272A] hover:bg-purple-50 dark:hover:bg-[#27272A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TELA 1: VISÃO GERAL */}
          {abaResultado === 'visao_geral' && (
            <div className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md space-y-6 print:hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Coluna Esquerda: Anel da Média FAC */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-[12px] bg-purple-50/50 dark:bg-[#121216] border border-purple-200 dark:border-[#27272A] text-center space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                    Média FAC Global (0 a 100%)
                  </span>

                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        className="stroke-slate-200 dark:stroke-[#27272A]"
                        strokeWidth="10"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        className="stroke-[#7c3aed] dark:stroke-[#C084FC] transition-all duration-1000 ease-out"
                        strokeWidth="10"
                        strokeDasharray={314}
                        strokeDashoffset={314 - (314 * resultado.mediaFac) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-3xl font-mono font-bold text-slate-900 dark:text-white">
                        {resultado.mediaFac}%
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block">
                        {resultado.somaTotal}/96 pts
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-[#A1A1AA] max-w-xs leading-relaxed">
                    A Média FAC utiliza a soma bruta das 24 respostas, sem pesos extras.
                  </p>
                </div>

                {/* Coluna Direita: Radar FAC e Ordem dos Pilares */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-sans font-semibold text-base text-slate-900 dark:text-white">
                      Radar da Tríade Clínica
                    </h4>
                    <span className="text-xs font-mono text-[#7c3aed] dark:text-[#C084FC]">
                      Ordem: {resultado.pilaresOrdenados.map((p) => p.nome).join(' → ')}
                    </span>
                  </div>

                  <DiagnosticoRadar
                    fundacao={resultado.pilares.fundacao.percentual}
                    atracao={resultado.pilares.atracao.percentual}
                    conexao={resultado.pilares.conexao.percentual}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    {resultado.pilaresOrdenados.map((p, idx) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-[8px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] text-center flex sm:flex-col items-center sm:justify-center justify-between"
                      >
                        <div className="text-left sm:text-center">
                          <span className="text-[10px] font-mono text-slate-500 block">
                            {idx + 1}º Lugar
                          </span>
                          <strong className="text-xs text-slate-900 dark:text-white block mt-0.5">
                            {p.nome}
                          </strong>
                        </div>
                        <span className="text-base sm:text-sm font-mono font-bold text-[#7c3aed] dark:text-[#C084FC]">
                          {p.percentual}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ressalva obrigatória */}
              <div className="p-3.5 rounded-[8px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] text-xs text-slate-500 italic text-center">
                {RESSALVA_PERCENTUAL}
              </div>
            </div>
          )}

          {/* TELA 2: LEITURA DA COMBINAÇÃO */}
          {abaResultado === 'combinacao' && (
            <div className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md space-y-6 print:hidden">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] block mb-1">
                  Leitura da Combinação Verbatim
                </span>
                <h3 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-slate-900 dark:text-white">
                  {resultado.tituloLeitura}
                </h3>{' '}
              </div>

              <div className="p-5 rounded-[12px] bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-[#7c3aed]/40 space-y-3">
                <span className="text-xs font-mono font-bold text-[#7c3aed] dark:text-[#C084FC] uppercase block">
                  Descrição da Prática
                </span>
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  "{resultado.leituraPratica}"
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-sans font-semibold text-sm text-slate-900 dark:text-white">
                  Relação entre os Pilares & Nuances de Proximidade
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                  {resultado.relacaoEntrePilares}
                </p>
                <p className="text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-[#27272A]">
                  Esta análise descreve fielmente as respostas assinaladas, sem atribuir causa
                  individual e sem prometer resultado imediato de captação ou permanência de
                  pacientes.
                </p>
              </div>
            </div>
          )}

          {/* TELA 3: POR ONDE COMEÇAR */}
          {abaResultado === 'por_onde_comecar' && (
            <div className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md space-y-6 print:hidden">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
                  Direcionamento Prioritário FAC
                </span>
                <h3 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-slate-900 dark:text-white">
                  Por Onde Começar
                </h3>
              </div>

              {/* Card do Pilar Inicial */}
              <div className="p-5 rounded-[12px] bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-[#7c3aed]/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#7c3aed] dark:text-[#C084FC]">
                    Pilar Inicial de Partida:{' '}
                    {resultado.pilares[resultado.porOndeComecar.pilarInicial].nome} (
                    {resultado.pilares[resultado.porOndeComecar.pilarInicial].percentual}%)
                  </span>
                  <Badge className="bg-purple-200 text-purple-900 text-[10px] font-mono">
                    Prioridade Metodológica
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {resultado.porOndeComecar.motivoPilar}
                </p>
              </div>

              {/* Os dois primeiros movimentos nas dimensões */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-[12px] bg-white dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#7c3aed] uppercase">
                      1º Movimento · Dimensão Prioritária
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Média {resultado.porOndeComecar.dimensaoPrioritaria.media}
                    </Badge>
                  </div>
                  <h4 className="font-sans font-semibold text-sm text-slate-900 dark:text-white">
                    {resultado.porOndeComecar.dimensaoPrioritaria.codigo} —{' '}
                    {resultado.porOndeComecar.dimensaoPrioritaria.nome}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                    {resultado.porOndeComecar.dimensaoPrioritaria.interpretacao}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-[#27272A] text-xs">
                    <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
                      Ação sugerida ({resultado.porOndeComecar.dimensaoPrioritaria.tipoAcao}):
                    </strong>
                    <span className="text-[#7c3aed] dark:text-[#C084FC]">
                      {resultado.porOndeComecar.dimensaoPrioritaria.acao}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-[12px] bg-white dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-[#A1A1AA] uppercase">
                      2º Movimento · Dimensão Seguinte
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Média {resultado.porOndeComecar.dimensaoSeguinte.media}
                    </Badge>
                  </div>
                  <h4 className="font-sans font-semibold text-sm text-slate-900 dark:text-white">
                    {resultado.porOndeComecar.dimensaoSeguinte.codigo} —{' '}
                    {resultado.porOndeComecar.dimensaoSeguinte.nome}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                    {resultado.porOndeComecar.dimensaoSeguinte.interpretacao}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-[#27272A] text-xs">
                    <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
                      Ação sugerida ({resultado.porOndeComecar.dimensaoSeguinte.tipoAcao}):
                    </strong>
                    <span className="text-slate-700 dark:text-slate-300">
                      {resultado.porOndeComecar.dimensaoSeguinte.acao}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 italic">
                {resultado.porOndeComecar.motivoDimensoes}
              </p>
            </div>
          )}

          {/* TELA 4: ANÁLISE DOS 3 PILARES */}
          {abaResultado === 'pilares' && (
            <div className="space-y-4 print:hidden">
              {(['fundacao', 'atracao', 'conexao'] as PilarId[]).map((pid) => {
                const p = resultado.pilares[pid]
                return (
                  <div
                    key={pid}
                    className="p-6 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#27272A]">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-sans text-xl font-semibold text-slate-900 dark:text-white">
                            Pilar {p.nome}
                          </h4>
                          <Badge className="bg-purple-100 text-[#7c3aed] text-[10px] font-mono">
                            {p.nivel.rotulo}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {p.nivel.descricao} · {p.soma}/32 pontos
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-mono font-bold text-[#7c3aed] dark:text-[#C084FC]">
                          {p.percentual}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-1">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-[11px] uppercase font-mono">
                          ✓ Dimensão Mais Firme
                        </span>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {p.dimensaoMaisFirme.codigo} ({p.dimensaoMaisFirme.nome}) ·{' '}
                          {p.dimensaoMaisFirme.percentual}% (méd. {p.dimensaoMaisFirme.media})
                        </p>
                        <p className="text-slate-600 dark:text-[#A1A1AA] text-[11px]">
                          {p.dimensaoMaisFirme.interpretacao}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-1">
                        <span className="font-bold text-amber-700 dark:text-amber-400 block text-[11px] uppercase font-mono">
                          ⚠ Dimensão Menos Firme (Prioritária)
                        </span>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {p.dimensaoMenosFirme.codigo} ({p.dimensaoMenosFirme.nome}) ·{' '}
                          {p.dimensaoMenosFirme.percentual}% (méd. {p.dimensaoMenosFirme.media})
                        </p>
                        <p className="text-slate-600 dark:text-[#A1A1AA] text-[11px]">
                          {p.dimensaoMenosFirme.interpretacao}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* TELA 5: AS 12 DIMENSÕES */}
          {abaResultado === 'dimensoes' && (
            <div className="space-y-4 print:hidden">
              <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A]">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Interpretação e Ações das 12 Dimensões FAC
                </span>
                <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                  Médias abaixo de 3 indicam fragilidade e pedem ações de{' '}
                  <strong>construção</strong>. Médias a partir de 3 indicam força; a partir de 3,5,
                  ações de <strong>refinamento</strong>.
                </p>
              </div>

              {(['fundacao', 'atracao', 'conexao'] as PilarId[]).map((pid) => {
                const p = resultado.pilares[pid]
                return (
                  <div key={pid} className="space-y-3">
                    <h4 className="font-mono text-xs font-bold uppercase text-[#7c3aed] px-1">
                      Dimensões de {p.nome}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {p.dimensoes.map((d) => (
                        <div
                          key={d.codigo}
                          className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900 dark:text-white text-sm">
                              {d.codigo} · {d.nome}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-mono ${
                                d.tipoLeitura === 'forca'
                                  ? 'border-emerald-300 text-emerald-700 dark:text-emerald-400'
                                  : 'border-amber-300 text-amber-700 dark:text-amber-400'
                              }`}
                            >
                              {d.percentual}% (méd. {d.media})
                            </Badge>
                          </div>

                          <p className="text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                            {d.interpretacao}
                          </p>

                          <div className="pt-2 border-t border-slate-100 dark:border-[#27272A] space-y-1">
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">
                              Alternativas marcadas:
                            </span>
                            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                              1. "{d.alternativasTextos[0]}"
                            </p>
                            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                              2. "{d.alternativasTextos[1]}"
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-[#27272A]">
                            <span className="text-[10px] font-mono text-[#7c3aed] block font-bold uppercase">
                              Ação ({d.tipoAcao}):
                            </span>
                            <p className="text-xs text-slate-800 dark:text-slate-200 font-medium mt-0.5">
                              {d.acao}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* TELA 6: ALERTAS CONDICIONAIS */}
          {abaResultado === 'alertas' && (
            <div className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md space-y-6 print:hidden">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                  Cruzamento das Respostas · Hipóteses de Observação
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  Alertas da Prática Clínica ({resultado.alertas.length})
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A1A1AA] mt-1">
                  Alertas são hipóteses de observação clínica baseadas nas suas respostas, nunca um
                  diagnóstico causal ou culpa individual.
                </p>
              </div>

              {resultado.alertas.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-[#121216] rounded-[12px] border border-slate-200 dark:border-[#27272A] space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                    Nenhum alerta crítico disparado
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                    Suas respostas mostram consistência entre as rotas de chegada, os critérios de
                    valor e os processos de continuidade.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resultado.alertas.map((alerta, idx) => (
                    <div
                      key={alerta.id}
                      className="p-4 rounded-[12px] bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="font-sans font-semibold text-sm text-amber-900 dark:text-amber-300">
                          {alerta.titulo}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-7">
                        {alerta.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TELA 7: SUAS PALAVRAS E PRÓXIMOS PASSOS */}
          {abaResultado === 'passos' && (
            <div className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md space-y-6 print:hidden">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
                  Encerramento do Diagnóstico
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  Suas Palavras & Checklist de Seis Movimentos
                </h3>
              </div>

              {/* Respostas Abertas Literais */}
              <div className="p-5 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-3 text-xs">
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300 uppercase block">
                  Respostas Abertas Registradas (Devolvidas literalmente)
                </span>
                <div className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong>Fundação (o que já tentou organizar e não foi adiante):</strong>{' '}
                    <span className="italic">
                      {resultado.respostasAbertas.fundacao || 'Não preenchido.'}
                    </span>
                  </p>
                  <p>
                    <strong>Atração (qual canal já trouxe paciente):</strong>{' '}
                    <span className="italic">
                      {resultado.respostasAbertas.atracao || 'Não preenchido.'}
                    </span>
                  </p>
                  <p>
                    <strong>Conexão (momento em que mais percebe perdas):</strong>{' '}
                    <span className="italic">
                      {resultado.respostasAbertas.conexao || 'Não preenchido.'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Destaque do Aviso de Cuidado Clínico (quando cabível) */}
              {resultado.avisoCuidadoClinico && (
                <div className="p-4 rounded-[12px] bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-[#7c3aed]/50 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-semibold">
                    <HeartHandshake className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                    <span>Destaque Separado da Nota: Cuidado Clínico</span>
                  </div>
                  <p className="text-purple-900 dark:text-purple-200 leading-relaxed">
                    {resultado.avisoCuidadoClinico}
                  </p>
                </div>
              )}

              {/* Checklist de Seis Movimentos */}
              <div className="space-y-3">
                <h4 className="font-sans font-semibold text-sm text-slate-900 dark:text-white">
                  Checklist dos Seis Movimentos Recomendados
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CHECKLIST_SEIS_MOVIMENTOS.map((mov, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-[8px] bg-white dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-[#7c3aed] dark:bg-purple-900/40 dark:text-purple-300 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{mov}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer de Escopo Final */}
              <div className="pt-4 border-t border-slate-200 dark:border-[#27272A] text-center space-y-1">
                <p className="text-xs text-slate-500 italic">{RESSALVA_ESCOPO}</p>
                <p className="text-[11px] font-mono text-slate-400">
                  Seu rascunho e histórico ficam neste navegador. Baixe o PDF para guardar o
                  resultado.
                </p>
              </div>
            </div>
          )}

          {/* BOTÃO PARA REVISAR RESPOSTAS */}
          <div className="text-center pt-2 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEtapaFluxo('perguntas')
                setPerguntaAtual(1)
              }}
              className="text-xs font-mono border-slate-200 dark:border-[#27272A]"
            >
              Revisar ou alterar respostas das 24 perguntas
            </Button>
          </div>

          {/* COMPONENTE EXCLUSIVO DE IMPRESSÃO / SALVAMENTO EM PDF */}
          <PrintableDiagnosticoReport resultado={resultado} />
        </div>
      )}
    </div>
  )
}
