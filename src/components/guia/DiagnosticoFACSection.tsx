import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  CheckCircle2,
  Download,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Shield,
  FileText,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DIAGNOSTICO_24_PERGUNTAS,
  PILARES_DEFINITIONS,
  PilarId,
  calcularResultadoDiagnostico,
  ResultadoDiagnostico,
} from '@/config/guiaContent'

const STORAGE_KEY_DIAGNOSTICO = 'entrelacos_fac_diagnostico_v2_draft'

export const DiagnosticoFACSection: React.FC = () => {
  // Respostas (id pergunta => valor 1 a 4)
  const [respostas, setRespostas] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DIAGNOSTICO)
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return {}
  })

  // Pergunta atual no modo guiado ou visão geral
  const [perguntaAtual, setPerguntaAtual] = useState<number>(1)
  const [mostrarResultado, setMostrarResultado] = useState<boolean>(false)

  // Persistir rascunho apenas no navegador da usuária (conforme decisão de privacidade)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DIAGNOSTICO, JSON.stringify(respostas))
    } catch {
      // ignore
    }
  }, [respostas])

  const totalRespondidas = Object.keys(respostas).length
  const totalPerguntas = DIAGNOSTICO_24_PERGUNTAS.length
  const estaCompleto = totalRespondidas === totalPerguntas

  const handleSelectOpcao = (perguntaId: number, valor: number) => {
    setRespostas((prev) => ({ ...prev, [perguntaId]: valor }))
    if (perguntaId < totalPerguntas) {
      setPerguntaAtual(perguntaId + 1)
    }
  }

  const handleLimparRascunho = () => {
    if (
      window.confirm(
        'Deseja reiniciar as respostas do diagnóstico? Os dados anteriores serão apagados deste navegador.',
      )
    ) {
      setRespostas({})
      setPerguntaAtual(1)
      setMostrarResultado(false)
      try {
        localStorage.removeItem(STORAGE_KEY_DIAGNOSTICO)
      } catch {
        // ignore
      }
    }
  }

  const resultado: ResultadoDiagnostico = calcularResultadoDiagnostico(respostas)

  // Gerador de PDF de 1 página (impressão limpa focada no relatório)
  const handleGerarPDF = () => {
    window.print()
  }

  const perguntaObj =
    DIAGNOSTICO_24_PERGUNTAS.find((p) => p.id === perguntaAtual) || DIAGNOSTICO_24_PERGUNTAS[0]

  return (
    <div className="space-y-8">
      {/* Aviso obrigatório de privacidade e aviso ético */}
      <div className="p-4 rounded-[12px] bg-purple-50/60 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200">
          <Shield className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC] shrink-0" />
          <span>
            <strong>Privacidade Local:</strong> Seu rascunho e histórico ficam neste navegador.
            Baixe o PDF para guardar o resultado.
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-mono text-slate-600 dark:text-[#A1A1AA] border-slate-300 dark:border-[#3f3f46] shrink-0"
        >
          24 Perguntas · 3 Pilares FAC
        </Badge>
      </div>

      {/* Se completou ou optou por ver o resultado */}
      {mostrarResultado || estaCompleto ? (
        <div className="space-y-8 print:m-0 print:p-0">
          {/* Cartão Principal do Resultado */}
          <div className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#27272A]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
                  Diagnóstico FAC Aprofundado v2 · Retrato Clínico
                </span>
                <h3 className="font-sans text-2xl font-semibold text-slate-900 dark:text-white">
                  {resultado.diagnosticoCombinacao.titulo}
                </h3>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGerarPDF}
                  className="gap-1.5 font-mono text-xs border-slate-200 dark:border-[#27272A] rounded-[8px]"
                >
                  <Download className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                  <span>Baixar Relatório (PDF)</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLimparRascunho}
                  className="text-xs font-mono text-slate-500 hover:text-rose-600"
                  title="Reiniciar respostas"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Tríade de Pontuação (Fundação, Atração, Conexão) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['fundacao', 'atracao', 'conexao'] as PilarId[]).map((pilarKey) => {
                const def = PILARES_DEFINITIONS[pilarKey]
                const sc = resultado.scores[pilarKey]
                const isMais = resultado.pilarMaisDesenvolvido === pilarKey
                const isMenos = resultado.pilarMenosDesenvolvido === pilarKey

                return (
                  <div
                    key={pilarKey}
                    className={`p-4 rounded-[12px] border transition-all ${
                      isMais
                        ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-300 dark:border-[#7c3aed]/50'
                        : isMenos
                          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/50'
                          : 'bg-slate-50/60 dark:bg-[#121216] border-slate-200 dark:border-[#27272A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans font-semibold text-sm text-slate-900 dark:text-white">
                        {def.nome}
                      </span>
                      {isMais && (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                          Mais Desenvolvido
                        </Badge>
                      )}
                      {isMenos && (
                        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] font-mono">
                          Ponto de Atenção
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                        {sc.pontos}
                      </span>
                      <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
                        / {sc.maximo} pts ({sc.porcentagem}%)
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-[#27272A] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isMais
                            ? 'bg-[#7c3aed] dark:bg-[#C084FC]'
                            : isMenos
                              ? 'bg-[#ea580c] dark:bg-[#FB923C]'
                              : 'bg-slate-400 dark:text-[#71717A]'
                        }`}
                        style={{ width: `${sc.porcentagem}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-[#A1A1AA] mt-2.5 leading-relaxed">
                      {def.descricaoCurta}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Análise Narrativa da Combinação */}
            <div className="p-5 rounded-[12px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] block mb-1">
                  O que esta combinação revela sobre sua clínica
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {resultado.diagnosticoCombinacao.analise}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-[#27272A]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
                  Orientação Estratégica na Academia Método FAC
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {resultado.diagnosticoCombinacao.orientacaoAcademia}
                </p>
              </div>
            </div>

            {/* Rodapé ético obrigatório */}
            <div className="text-center pt-2">
              <p className="text-xs font-mono text-slate-500 dark:text-[#71717A] italic">
                Esta é uma ferramenta de reflexão profissional. Não é avaliação psicológica.
              </p>
            </div>
          </div>

          <div className="text-center print:hidden">
            <Button
              variant="outline"
              onClick={() => setMostrarResultado(false)}
              className="text-xs font-mono border-slate-200 dark:border-[#27272A]"
            >
              Revisar ou alterar respostas
            </Button>
          </div>
        </div>
      ) : (
        /* Modo Pergunta a Pergunta */
        <div className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-6">
          {/* Barra de progresso */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 dark:text-[#A1A1AA]">
                Pergunta {perguntaAtual} de {totalPerguntas} ({totalRespondidas} respondidas)
              </span>
              <span className="text-[#7c3aed] dark:text-[#C084FC] font-semibold">
                Pilar: {PILARES_DEFINITIONS[perguntaObj.pilar].nome}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#0A0A14] overflow-hidden">
              <div
                className="h-full bg-[#7c3aed] dark:bg-[#C084FC] transition-all duration-300 rounded-full"
                style={{ width: `${Math.round((totalRespondidas / totalPerguntas) * 100)}%` }}
              />
            </div>
          </div>

          {/* Enunciado */}
          <div className="space-y-2 pt-2">
            <Badge className="bg-purple-100 dark:bg-[#27272A] text-[#7c3aed] dark:text-[#C084FC] border-purple-200 dark:border-transparent font-mono text-[11px]">
              {PILARES_DEFINITIONS[perguntaObj.pilar].nome}
            </Badge>
            <h4 className="font-sans text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-snug">
              {perguntaObj.enunciado}
            </h4>
          </div>

          {/* Alternativas 1 a 4 */}
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

          {/* Navegação entre perguntas */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-[#27272A]">
            <Button
              variant="outline"
              size="sm"
              disabled={perguntaAtual === 1}
              onClick={() => setPerguntaAtual((prev) => Math.max(1, prev - 1))}
              className="gap-1 font-mono text-xs rounded-[8px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </Button>

            <div className="flex items-center gap-2">
              {estaCompleto && (
                <Button
                  onClick={() => setMostrarResultado(true)}
                  className="bg-[#ea580c] hover:bg-[#c2410c] dark:bg-[#FB923C] dark:hover:bg-[#f97316] text-white dark:text-[#0A0A14] font-semibold text-xs rounded-[8px]"
                >
                  Ver Resultado Completo
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                disabled={perguntaAtual === totalPerguntas}
                onClick={() => setPerguntaAtual((prev) => Math.min(totalPerguntas, prev + 1))}
                className="gap-1 font-mono text-xs rounded-[8px]"
              >
                <span>Próxima</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
