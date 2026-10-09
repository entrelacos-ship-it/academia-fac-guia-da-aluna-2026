import React, { useState } from 'react'
import { SkigaiDataModel } from '@/types/skigai'
import { processarCalculoSkigaiCompleto } from '@/lib/skigaiEngine'
import { SkigaiRadar } from './SkigaiRadar'
import { ArrowRight, ArrowLeft, Star, AlertCircle, HeartHandshake, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Step4LeituraProps {
  model: SkigaiDataModel
  onAtualizar: (novosDados: Partial<SkigaiDataModel>) => void
  onAvancar: () => void
  onVoltar: () => void
  onAbrirCuidado: () => void
}

export const Step4Leitura: React.FC<Step4LeituraProps> = ({
  model,
  onAtualizar,
  onAvancar,
  onVoltar,
  onAbrirCuidado,
}) => {
  const calculo = processarCalculoSkigaiCompleto(model)
  const [focoRadar, setFocoRadar] = useState<'todos' | 'recursos' | 'prioridades'>('todos')
  const [novoFatorFora, setNovoFatorFora] = useState('')
  const [novoFatorMexer, setNovoFatorMexer] = useState('')

  const estrutura = model.estrutura || { fora_do_meu_controle: [], posso_mexer: [] }

  const adicionarForaControle = () => {
    if (!novoFatorFora.trim()) return
    const atualizados = [...(estrutura.fora_do_meu_controle || []), novoFatorFora.trim()]
    onAtualizar({ estrutura: { ...estrutura, fora_do_meu_controle: atualizados } })
    setNovoFatorFora('')
  }

  const removerForaControle = (idx: number) => {
    const atualizados = estrutura.fora_do_meu_controle.filter((_, i) => i !== idx)
    onAtualizar({ estrutura: { ...estrutura, fora_do_meu_controle: atualizados } })
  }

  const adicionarPossoMexer = () => {
    if (!novoFatorMexer.trim()) return
    const atualizados = [...(estrutura.posso_mexer || []), novoFatorMexer.trim()]
    onAtualizar({ estrutura: { ...estrutura, posso_mexer: atualizados } })
    setNovoFatorMexer('')
  }

  const removerPossoMexer = (idx: number) => {
    const atualizados = estrutura.posso_mexer.filter((_, i) => i !== idx)
    onAtualizar({ estrutura: { ...estrutura, posso_mexer: atualizados } })
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-left animate-fade-in">
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
          Fase 4 de 8 · A Leitura do Mapa
        </span>
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-foreground">
          O desenho do seu sentimento de valor
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          O radar completo revela a relação entre o que você nutre e o que considera importante.
        </p>
      </div>

      {/* Caixa de Cuidado Automática (Ressonância e Liberdade <= 1) */}
      {calculo.cuidadoGatilho && (
        <div className="p-5 rounded-[14px] bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-3 text-xs text-rose-800 dark:text-rose-300">
          <div className="flex items-center gap-2 font-mono font-semibold">
            <HeartHandshake className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>Alerta de Cuidado: Ressonância e Liberdade em nível delicado</span>
          </div>
          <p className="leading-relaxed">
            Seus índices em Ressonância e Liberdade estão simultaneamente baixos (≤ 1). Sentir-se
            isolada na prática clínica enquanto lida com falta de autonomia é uma fonte intensa de
            esgotamento. Isto não é falha sua. Convênios, plataformas e exigências financeiras
            costumam apertar exatamente essas duas áreas.
          </p>
          <Button
            type="button"
            size="sm"
            onClick={onAbrirCuidado}
            className="text-xs font-mono bg-rose-600 text-white hover:bg-rose-700"
          >
            Abrir canais e orientações de acolhimento
          </Button>
        </div>
      )}

      {/* Seletor de Modo Foco e Radar Central */}
      <div className="p-6 rounded-[20px] border border-border bg-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
          <span className="text-xs font-mono text-muted-foreground font-semibold">
            Modo de visualização do radar:
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={focoRadar === 'todos' ? 'default' : 'outline'}
              onClick={() => setFocoRadar('todos')}
              className="text-xs font-mono h-8"
            >
              Todos os Eixos
            </Button>
            <Button
              type="button"
              size="sm"
              variant={focoRadar === 'recursos' ? 'default' : 'outline'}
              onClick={() => setFocoRadar('recursos')}
              className="text-xs font-mono h-8 gap-1.5"
            >
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Só Recursos</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant={focoRadar === 'prioridades' ? 'default' : 'outline'}
              onClick={() => setFocoRadar('prioridades')}
              className="text-xs font-mono h-8 gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#8E3B73]" />
              <span>Só Prioridades</span>
            </Button>
          </div>
        </div>

        <SkigaiRadar
          necessidades={model.necessidades}
          termometro={model.termometro}
          modoFoco={focoRadar}
          tamanho={480}
        />
      </div>

      {/* Cartões: Recursos (Forças N >= 2) e Prioridades (Lacunas >= 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cartão de Recursos */}
        <div className="p-6 rounded-[16px] border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="font-serif-editorial text-xl font-medium text-foreground">
              Seus Recursos (Maior Nutrição)
            </h3>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            As necessidades com N ≥ 2 que sustentam o seu sentir positivo hoje:
          </p>

          {calculo.recursos.length > 0 ? (
            <div className="space-y-3">
              {calculo.recursos.map((rec) => (
                <div
                  key={`rec-${rec.id}`}
                  className="p-3.5 rounded-[10px] bg-background border border-border space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">
                      {rec.id}. {rec.nome}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      Força {rec.forca} (N{rec.nutricao} × I{rec.importancia})
                    </span>
                  </div>
                  {rec.reflexao && (
                    <p className="text-xs text-muted-foreground italic">
                      &quot;{rec.reflexao}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-[10px] bg-background border border-border text-xs text-muted-foreground">
              Hoje nenhuma necessidade está bem nutrida. Isso pede cuidado e não é falha sua.
            </div>
          )}
        </div>

        {/* Cartão de Prioridades */}
        <div className="p-6 rounded-[16px] border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#8E3B73] text-white flex items-center justify-center font-mono text-xs font-bold">
              !
            </span>
            <h3 className="font-serif-editorial text-xl font-medium text-foreground">
              Prioridades de Cuidado (Lacunas)
            </h3>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Áreas de alta importância com nutrição defasada (lacuna ≥ 3):
          </p>

          {calculo.prioridades.length > 0 ? (
            <div className="space-y-3">
              {calculo.prioridades.map((pri) => (
                <div
                  key={`pri-${pri.id}`}
                  className="p-3.5 rounded-[10px] bg-background border border-border space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">
                      {pri.id}. {pri.nome}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#8E3B73] dark:text-[#E08BC0]">
                      Lacuna {pri.lacuna} · Alavanca {pri.alavanca}
                    </span>
                  </div>
                  {pri.reflexao && (
                    <p className="text-xs text-muted-foreground italic">
                      &quot;{pri.reflexao}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-[10px] bg-background border border-border text-xs text-muted-foreground">
              Nada pede movimento urgente agora. O momento favorece sustentar os recursos atuais.
            </div>
          )}
        </div>
      </div>

      {/* Seção Estrutura ou Escolha */}
      <div className="p-6 rounded-[16px] border border-border bg-card space-y-4">
        <div className="space-y-1">
          <h3 className="font-serif-editorial text-xl font-medium text-foreground">
            Estrutura ou Escolha: o que é seu e o que é do sistema?
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Nota baixa aqui raramente é falha sua. Convênio, plataforma e pressão financeira tiram
            exatamente isso. Separe o que está além do seu controle do que você tem autonomia real
            para mexer esta semana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Fora do meu controle */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 block">
              Fora do meu controle (pressões estruturais):
            </span>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ex: atraso no repasse do convênio..."
                value={novoFatorFora}
                onChange={(e) => setNovoFatorFora(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && adicionarForaControle()}
                className="text-xs"
              />
              <Button type="button" size="sm" onClick={adicionarForaControle} className="text-xs">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-1.5 min-h-[60px]">
              {estrutura.fora_do_meu_controle.map((item, idx) => (
                <div
                  key={`fora-${idx}`}
                  className="p-2 rounded-[6px] bg-muted/40 text-xs flex items-center justify-between text-muted-foreground"
                >
                  <span>• {item}</span>
                  <button
                    type="button"
                    onClick={() => removerForaControle(idx)}
                    className="hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Posso mexer */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 block">
              Posso mexer (minha autonomia e limites):
            </span>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ex: fechar a agenda às sextas às 17h..."
                value={novoFatorMexer}
                onChange={(e) => setNovoFatorMexer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && adicionarPossoMexer()}
                className="text-xs"
              />
              <Button type="button" size="sm" onClick={adicionarPossoMexer} className="text-xs">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-1.5 min-h-[60px]">
              {estrutura.posso_mexer.map((item, idx) => (
                <div
                  key={`mexer-${idx}`}
                  className="p-2 rounded-[6px] bg-muted/40 text-xs flex items-center justify-between text-foreground"
                >
                  <span>• {item}</span>
                  <button
                    type="button"
                    onClick={() => removerPossoMexer(idx)}
                    className="hover:text-muted-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onVoltar}
          className="text-xs font-mono gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à roda</span>
        </Button>

        <Button
          type="button"
          onClick={onAvancar}
          className="min-h-[44px] px-6 text-xs font-mono font-semibold rounded-[8px] bg-primary text-primary-foreground gap-1.5"
        >
          <span>Avançar para os Cinco Pilares de Mogi</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
