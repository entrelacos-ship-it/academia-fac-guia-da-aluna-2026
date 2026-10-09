import React, { useState } from 'react'
import { SkigaiDataModel, FonteItem, Escala0a3 } from '@/types/skigai'
import { calcularMetricasFontes, NECESSIDADES_DEFINICOES } from '@/lib/skigaiEngine'
import { ArrowRight, ArrowLeft, Plus, Trash2, HelpCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Step2FontesProps {
  model: SkigaiDataModel
  onAtualizar: (novosDados: Partial<SkigaiDataModel>) => void
  onAvancar: () => void
  onVoltar: () => void
}

export const Step2Fontes: React.FC<Step2FontesProps> = ({
  model,
  onAtualizar,
  onAvancar,
  onVoltar,
}) => {
  const fontes = model.fontes || []
  const [soaComoEu, setSoaComoEu] = useState<boolean | null>(null)

  const adicionarFonte = () => {
    if (fontes.length >= 6) return
    const nova: FonteItem = {
      id: `fonte-${Date.now()}`,
      nome: '',
      tipo: 'atividade',
      rendimento: 1,
      fragilidade: 1,
      alimenta: [1, 1, 1, 1, 1, 1, 1],
    }
    onAtualizar({ fontes: [...fontes, nova] })
  }

  const removerFonte = (id: string) => {
    if (fontes.length <= 2) return
    onAtualizar({ fontes: fontes.filter((f) => f.id !== id) })
  }

  const atualizarFonte = (id: string, campo: Partial<FonteItem>) => {
    const atualizadas = fontes.map((f) => (f.id === id ? { ...f, ...campo } : f))
    onAtualizar({ fontes: atualizadas })
  }

  const metricasFontes = calcularMetricasFontes(fontes)

  return (
    <div className="space-y-8 max-w-3xl mx-auto text-left animate-fade-in">
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
          Fase 2 de 8 · Mapa de Fontes
        </span>
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-foreground">
          De onde vem a sua energia e sustento?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Cadastre de 2 a 6 fontes do seu trabalho (atendimentos particulares, convênios, docência,
          supervisões, etc.) e avalie o rendimento financeiro, a fragilidade e como cada uma
          alimenta as 7 necessidades.
        </p>
      </div>

      {/* Lista de Fontes */}
      <div className="space-y-4">
        {fontes.map((fonte, idx) => (
          <div key={fonte.id} className="p-5 rounded-[16px] border border-border bg-card space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 w-full">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-mono text-xs flex items-center justify-center font-bold">
                  0{idx + 1}
                </span>
                <Input
                  type="text"
                  placeholder="Nome da fonte (ex: Consultório particular, Plantão...)"
                  value={fonte.nome}
                  onChange={(e) => atualizarFonte(fonte.id, { nome: e.target.value })}
                  className="font-medium text-sm flex-1"
                />
              </div>

              {fontes.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removerFonte(fonte.id)}
                  className="text-xs font-mono text-rose-500 hover:text-rose-600 gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remover</span>
                </Button>
              )}
            </div>

            {/* Rendimento e Fragilidade (0 a 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Rendimento Financeiro:</span>
                  <span className="font-bold text-foreground">{fonte.rendimento} / 3</span>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((val) => (
                    <button
                      key={`rend-${val}`}
                      type="button"
                      onClick={() => atualizarFonte(fonte.id, { rendimento: val as Escala0a3 })}
                      className={`flex-1 py-1.5 rounded-[6px] text-xs font-mono transition-all ${
                        fonte.rendimento === val
                          ? 'bg-primary text-primary-foreground font-bold'
                          : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Fragilidade (risco de sumir):</span>
                  <span className="font-bold text-foreground">{fonte.fragilidade} / 3</span>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((val) => (
                    <button
                      key={`frag-${val}`}
                      type="button"
                      onClick={() => atualizarFonte(fonte.id, { fragilidade: val as Escala0a3 })}
                      className={`flex-1 py-1.5 rounded-[6px] text-xs font-mono transition-all ${
                        fonte.fragilidade === val
                          ? 'bg-amber-600 text-white font-bold'
                          : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Matriz rápida de alimentação das 7 necessidades */}
            <div className="space-y-2 pt-2 border-t border-border/70">
              <span className="text-[11px] font-mono text-muted-foreground block">
                Quanto esta fonte alimenta cada necessidade? (0 = nada, 3 = muito)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                {NECESSIDADES_DEFINICOES.map((def, k) => {
                  const nivel = fonte.alimenta?.[k] ?? 0
                  return (
                    <div
                      key={`alim-${def.id}`}
                      className="p-2 rounded-[8px] bg-muted/30 text-center space-y-1"
                    >
                      <span
                        className="text-[10px] font-mono text-muted-foreground block truncate"
                        title={def.nome}
                      >
                        {def.abreviacao}
                      </span>
                      <select
                        value={nivel}
                        onChange={(e) => {
                          const novoArray = [...(fonte.alimenta || [0, 0, 0, 0, 0, 0, 0])] as [
                            number,
                            number,
                            number,
                            number,
                            number,
                            number,
                            number,
                          ]
                          novoArray[k] = parseInt(e.target.value, 10)
                          atualizarFonte(fonte.id, { alimenta: novoArray })
                        }}
                        className="w-full text-center text-xs font-mono font-bold bg-background border border-input rounded-[6px] p-1"
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}

        {fontes.length < 6 && (
          <Button
            type="button"
            variant="outline"
            onClick={adicionarFonte}
            className="w-full min-h-[44px] text-xs font-mono gap-1.5 border-dashed"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar outra fonte (máx 6)</span>
          </Button>
        )}
      </div>

      {/* Resultado Imediato: Concentração e Fragilidade */}
      <div className="p-6 rounded-[16px] border border-border bg-card space-y-4">
        <h3 className="font-serif-editorial text-xl font-medium text-foreground">
          Leitura imediata da sua ecologia de trabalho
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3.5 rounded-[10px] bg-muted/40 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground block uppercase">
              Concentração de Renda
            </span>
            <span className="text-xl font-bold font-mono text-foreground">
              {metricasFontes.concentracao !== null
                ? `${metricasFontes.concentracao}%`
                : 'Sem dados'}
            </span>
          </div>

          <div className="p-3.5 rounded-[10px] bg-muted/40 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground block uppercase">
              Fragilidade Média
            </span>
            <span className="text-xl font-bold font-mono text-foreground">
              {metricasFontes.fragilidadeMedia !== null
                ? `${metricasFontes.fragilidadeMedia} / 3`
                : 'Sem dados'}
            </span>
          </div>

          <div className="p-3.5 rounded-[10px] bg-muted/40 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground block uppercase">
              Sem Fonte Direta
            </span>
            <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {metricasFontes.necessidadesSemFonte.length} de 7
            </span>
          </div>
        </div>

        {/* Leitura reflexiva */}
        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
          {metricasFontes.concentracao && metricasFontes.concentracao > 70
            ? 'A maior parte da sua sustentação depende de uma única fonte. Isso é muito comum na clínica e pede cuidado com autonomia e reserva.'
            : 'Sua sustentação está dividida entre diferentes fontes, o que dilui o risco imediato.'}
        </p>

        {/* Validação: "Isso soa como eu?" */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs font-mono text-foreground font-semibold">
            Isso soa como você?
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={soaComoEu === true ? 'default' : 'outline'}
              onClick={() => setSoaComoEu(true)}
              className="text-xs font-mono h-8 px-3"
            >
              Sim
            </Button>
            <Button
              type="button"
              size="sm"
              variant={soaComoEu === false ? 'default' : 'outline'}
              onClick={() => setSoaComoEu(false)}
              className="text-xs font-mono h-8 px-3"
            >
              Em parte / Não
            </Button>
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
          <span>Voltar ao mito</span>
        </Button>

        <Button
          type="button"
          onClick={onAvancar}
          className="min-h-[44px] px-6 text-xs font-mono font-semibold rounded-[8px] bg-primary text-primary-foreground gap-1.5"
        >
          <span>Avançar para a Roda das 7 Necessidades</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
