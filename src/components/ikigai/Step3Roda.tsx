import React, { useState } from 'react'
import { SkigaiDataModel, NecessidadeItem, Escala0a3 } from '@/types/skigai'
import { NECESSIDADES_DEFINICOES, calcularMetricasSkigai } from '@/lib/skigaiEngine'
import { ArrowRight, ArrowLeft, Pause, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SkigaiRadar } from './SkigaiRadar'
import { detectarDadoDePaciente } from '@/lib/skigaiCareEthics'

interface Step3RodaProps {
  model: SkigaiDataModel
  onAtualizar: (novosDados: Partial<SkigaiDataModel>) => void
  onAvancar: () => void
  onVoltar: () => void
  onPausar: () => void
}

export const Step3Roda: React.FC<Step3RodaProps> = ({
  model,
  onAtualizar,
  onAvancar,
  onVoltar,
  onPausar,
}) => {
  const [etapaEixo, setEtapaEixo] = useState(0) // 0 a 6 (as 7 necessidades)
  const [avisoPaciente, setAvisoPaciente] = useState<string | null>(null)
  const [reflexaoPulada, setReflexaoPulada] = useState(false)

  const necessidades = model.necessidades || []
  const atual = necessidades[etapaEixo] || {
    id: etapaEixo + 1,
    nome: NECESSIDADES_DEFINICOES[etapaEixo]?.nome || '',
    abreviacao: NECESSIDADES_DEFINICOES[etapaEixo]?.abreviacao || '',
    nutricao: 0,
    importancia: 0,
    interesse: 0,
    habilidade: 0,
    reflexao: '',
  }

  // Perguntas reflexivas acolhedoras por necessidade
  const perguntasReflexao: Record<number, string> = {
    1: 'No seu dia a dia clínico, o quanto você se sente nutrida e satisfeita com a vida que este trabalho possibilita?',
    2: 'Você tem sentido espaço para experimentar novidades, estudar o que gosta e crescer sem asfixia?',
    3: 'Como é olhar para os próximos 6 a 12 meses? Há perspectiva clara ou insegurança constante?',
    4: 'Com quem você compartilha suas dores e descobertas clínicas? Há ressonância e acolhimento mútuo?',
    5: 'Você se sente livre para dizer não a certos horários ou demandas, ou sente que está sempre à mercê de terceiros?',
    6: 'O quanto você consegue colocar o seu olhar autoral nos atendimentos, sem apenas reproduzir roteiros pré-fabricados?',
    7: 'No fim de uma semana exaustiva, você ainda sente que a sua escuta tem valor e faz diferença real?',
  }

  const perguntaAtual =
    perguntasReflexao[atual.id] || 'Como esta necessidade se expressa no seu momento?'

  const atualizarNecessidade = (campo: Partial<NecessidadeItem>) => {
    const atualizadas = necessidades.map((n, i) => (i === etapaEixo ? { ...n, ...campo } : n))
    onAtualizar({ necessidades: atualizadas })
  }

  const handleTextoReflexao = (texto: string) => {
    const checagem = detectarDadoDePaciente(texto)
    if (checagem.detectado) {
      setAvisoPaciente(checagem.motivo || 'Vamos voltar para você e para o seu próprio sentir.')
    } else {
      setAvisoPaciente(null)
    }
    atualizarNecessidade({ reflexao: texto })
  }

  // Radar parcial crescente (apenas até o eixo atual já preenchido)
  const necessidadesParciais: NecessidadeItem[] = necessidades.map((n, idx) => {
    if (idx <= etapaEixo) return n
    return {
      ...n,
      nutricao: 0 as Escala0a3,
      importancia: 0 as Escala0a3,
      interesse: 0 as Escala0a3,
      habilidade: 0 as Escala0a3,
    }
  })

  const proximoEixo = () => {
    if (etapaEixo < 6) {
      setEtapaEixo(etapaEixo + 1)
      setReflexaoPulada(false)
      setAvisoPaciente(null)
    } else {
      onAvancar()
    }
  }

  const anteriorEixo = () => {
    if (etapaEixo > 0) {
      setEtapaEixo(etapaEixo - 1)
      setReflexaoPulada(false)
      setAvisoPaciente(null)
    } else {
      onVoltar()
    }
  }

  const liberadaPontuacao = atual.reflexao?.trim().length > 0 || reflexaoPulada

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-left animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
            Fase 3 de 8 · A Roda das 7 Necessidades (Eixo {etapaEixo + 1} de 7)
          </span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-foreground">
            {atual.id}. {atual.nome}
          </h2>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPausar}
          className="text-xs font-mono gap-1.5"
        >
          <Pause className="w-3.5 h-3.5" />
          <span>Pausar aqui e salvar cápsula</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lado Esquerdo: Reflexão e 4 Notas */}
        <div className="lg:col-span-7 space-y-6">
          {/* Caixa de Reflexão Prévia */}
          <div className="p-6 rounded-[16px] border border-border bg-card space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                1. Escreva primeiro, pontue depois
              </span>
              <p className="text-sm font-medium text-foreground leading-relaxed">{perguntaAtual}</p>
            </div>

            <Textarea
              rows={4}
              value={atual.reflexao}
              onChange={(e) => handleTextoReflexao(e.target.value)}
              placeholder="Use as suas palavras, mesmo que pareçam simples. Este campo é livre e opcional..."
              className="text-xs font-sans leading-relaxed resize-none"
            />

            {avisoPaciente && (
              <div className="p-3 rounded-[8px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
                {avisoPaciente}
              </div>
            )}

            {!liberadaPontuacao && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setReflexaoPulada(true)}
                  className="text-xs font-mono text-muted-foreground hover:text-foreground"
                >
                  Pular reflexão e ir direto às notas
                </Button>
              </div>
            )}
          </div>

          {/* 4 Notas de 0 a 3 (Nutrição, Importância, Interesse, Habilidade) */}
          <div
            className={`p-6 rounded-[16px] border border-border bg-card space-y-5 transition-opacity ${
              liberadaPontuacao ? 'opacity-100' : 'opacity-40 pointer-events-none'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary block">
              2. As 4 Notas do Eixo (0 a 3)
            </span>

            {/* Nutrição */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-foreground">
                  Nutrição (o quanto você se sente nutrida hoje):
                </span>
                <span className="text-primary font-bold">{atual.nutricao} / 3</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((val) => (
                  <button
                    key={`n-${val}`}
                    type="button"
                    onClick={() => atualizarNecessidade({ nutricao: val as Escala0a3 })}
                    className={`py-2 rounded-[8px] text-xs font-mono transition-all ${
                      atual.nutricao === val
                        ? 'bg-[#F28A2E] text-white font-bold'
                        : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {val} {val === 0 ? '(nada)' : val === 3 ? '(muito)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Importância */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-foreground">
                  Importância (o quanto isso pesa para você):
                </span>
                <span className="text-[#6D28D9] dark:text-[#A78BFA] font-bold">
                  {atual.importancia} / 3
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((val) => (
                  <button
                    key={`i-${val}`}
                    type="button"
                    onClick={() => atualizarNecessidade({ importancia: val as Escala0a3 })}
                    className={`py-2 rounded-[8px] text-xs font-mono transition-all ${
                      atual.importancia === val
                        ? 'bg-[#6D28D9] text-white font-bold'
                        : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {val} {val === 0 ? '(baixa)' : val === 3 ? '(essencial)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Interesse */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-foreground">
                  Interesse (vontade de mexer nisto agora):
                </span>
                <span className="text-[#0EA5A5] font-bold">{atual.interesse} / 3</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((val) => (
                  <button
                    key={`int-${val}`}
                    type="button"
                    onClick={() => atualizarNecessidade({ interesse: val as Escala0a3 })}
                    className={`py-2 rounded-[8px] text-xs font-mono transition-all ${
                      atual.interesse === val
                        ? 'bg-[#0EA5A5] text-white font-bold'
                        : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {val} {val === 0 ? '(nenhum)' : val === 3 ? '(alta vontade)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Habilidade */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-foreground">
                  Habilidade (segurança prática para agir):
                </span>
                <span className="text-[#0EA5A5] font-bold">{atual.habilidade} / 3</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((val) => (
                  <button
                    key={`h-${val}`}
                    type="button"
                    onClick={() => atualizarNecessidade({ habilidade: val as Escala0a3 })}
                    className={`py-2 rounded-[8px] text-xs font-mono transition-all ${
                      atual.habilidade === val
                        ? 'bg-[#0EA5A5] text-white font-bold'
                        : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {val} {val === 0 ? '(insegura)' : val === 3 ? '(pleno domínio)' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Prévia do Radar que cresce eixo a eixo */}
        <div className="lg:col-span-5 p-4 rounded-[16px] border border-border bg-card flex flex-col items-center">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
            Prévia Progressiva do Radar
          </span>
          <SkigaiRadar
            necessidades={necessidadesParciais}
            termometro={model.termometro}
            tamanho={340}
          />
        </div>
      </div>

      {/* Navegação Eixo a Eixo */}
      <div className="flex items-center justify-between pt-4 border-t border-border/70">
        <Button
          type="button"
          variant="ghost"
          onClick={anteriorEixo}
          className="text-xs font-mono gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{etapaEixo === 0 ? 'Voltar às fontes' : 'Eixo anterior'}</span>
        </Button>

        <Button
          type="button"
          onClick={proximoEixo}
          className="min-h-[44px] px-6 text-xs font-mono font-semibold rounded-[8px] bg-primary text-primary-foreground gap-1.5"
        >
          <span>{etapaEixo === 6 ? 'Concluir Roda e Ver Leitura' : 'Próxima Necessidade'}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
