import React, { useState } from 'react'
import { SkigaiDataModel, MicroAcaoPlano } from '@/types/skigai'
import { processarCalculoSkigaiCompleto } from '@/lib/skigaiEngine'
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

interface Step6RedesenhoProps {
  model: SkigaiDataModel
  onAtualizar: (novosDados: Partial<SkigaiDataModel>) => void
  onAvancar: () => void
  onVoltar: () => void
}

export const Step6Redesenho: React.FC<Step6RedesenhoProps> = ({
  model,
  onAtualizar,
  onAvancar,
  onVoltar,
}) => {
  const calculo = processarCalculoSkigaiCompleto(model)
  const plano = model.plano || []
  const [avisoRuptura, setAvisoRuptura] = useState<string | null>(null)

  const atualizarAcao = (semana: number, campo: Partial<MicroAcaoPlano>) => {
    const atualizados = plano.map((p) => {
      if (p.semana === semana) {
        const novo = { ...p, ...campo }
        if (campo.acao && campo.acao.toLowerCase().includes('largar')) {
          setAvisoRuptura('Antes de qualquer ruptura, o que dá para redesenhar esta semana?')
        } else if (campo.acao && !campo.acao.toLowerCase().includes('largar')) {
          setAvisoRuptura(null)
        }
        return novo
      }
      return p
    })
    onAtualizar({ plano: atualizados })
  }

  const alternarRegra = (semana: number, regraIdx: number) => {
    const acao = plano.find((p) => p.semana === semana)
    if (!acao) return
    const novasRegras: [boolean, boolean, boolean, boolean] = [...acao.regras]
    novasRegras[regraIdx] = !novasRegras[regraIdx]
    atualizarAcao(semana, { regras: novasRegras })
  }

  // 4 testes obrigatórios prescritivos do PRD:
  const rotulosTestes = [
    'Cabe nesta semana',
    'Leva até 30 minutos',
    'Não depende de ninguém',
    'Dá para saber se foi feita',
  ]

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-left animate-fade-in">
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
          Fase 6 de 8 · Redesenho do Trabalho e Plano de 4 Semanas
        </span>
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-foreground">
          Micro-ações que sustentam a sua prática
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          O redesenho acontece em três formas: <strong>tarefa</strong> (o que você faz),{' '}
          <strong>relação</strong> (com quem você divide) e <strong>olhar</strong> (o sentido
          interno). Defina micro-ações para as 4 semanas seguintes e passe pelos 4 testes
          obrigatórios.
        </p>
      </div>

      {/* Aviso de Ruptura (se escrever largar) */}
      {avisoRuptura && (
        <div className="p-4 rounded-[12px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-1 text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2 font-mono font-semibold">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Redesenho em vez de ruptura brusca</span>
          </div>
          <p className="leading-relaxed">{avisoRuptura}</p>
        </div>
      )}

      {/* Quadro de 4 Semanas */}
      <div className="space-y-6">
        {plano.map((item) => {
          const todasRegrasOk = item.regras.every((r) => r === true)

          return (
            <div
              key={`semana-${item.semana}`}
              className="p-6 rounded-[16px] border border-border bg-card space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-mono text-xs flex items-center justify-center font-bold">
                    S{item.semana}
                  </span>
                  <h3 className="font-serif-editorial text-lg font-medium text-foreground">
                    Semana {item.semana}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-muted-foreground">Forma:</span>
                  <select
                    value={item.tipo}
                    onChange={(e) => atualizarAcao(item.semana, { tipo: e.target.value })}
                    className="text-xs font-mono bg-background border border-input rounded-[6px] p-1"
                  >
                    <option value="tarefa">Tarefa (fazer prático)</option>
                    <option value="relação">Relação (vínculo/supervisão)</option>
                    <option value="olhar">Olhar (sentido e presença)</option>
                  </select>
                </div>
              </div>

              {/* Descrição da Ação e Dia */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-xs font-mono font-medium text-foreground block">
                    Micro-ação concreta:
                  </label>
                  <Input
                    type="text"
                    value={item.acao}
                    onChange={(e) => atualizarAcao(item.semana, { acao: e.target.value })}
                    placeholder="Ex: bloquear a agenda quinta-feira das 14h às 14h30 para respirar..."
                    className="text-xs"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-xs font-mono font-medium text-foreground block">
                    Dia planejado:
                  </label>
                  <Input
                    type="text"
                    value={item.dia}
                    onChange={(e) => atualizarAcao(item.semana, { dia: e.target.value })}
                    placeholder="Ex: Quarta-feira"
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              {/* Como alimenta o ikigai-kan */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-muted-foreground block">
                  Como isso alimenta o seu sentimento de que o trabalho vale a pena?
                </label>
                <Input
                  type="text"
                  value={item.ikigai_kan}
                  onChange={(e) => atualizarAcao(item.semana, { ikigai_kan: e.target.value })}
                  placeholder="Ex: devolve o fôlego entre atendimentos pesados..."
                  className="text-xs"
                />
              </div>

              {/* Os 4 Testes Obrigatórios */}
              <div className="p-4 rounded-[12px] bg-muted/30 border border-border space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary block">
                  Os 4 Testes Obrigatórios da Micro-Ação
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {rotulosTestes.map((teste, tIdx) => (
                    <label
                      key={`t-${item.semana}-${tIdx}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={item.regras[tIdx]}
                        onCheckedChange={() => alternarRegra(item.semana, tIdx)}
                      />
                      <span className="text-foreground">{teste}</span>
                    </label>
                  ))}
                </div>

                {!todasRegrasOk && item.acao?.trim() && (
                  <p className="text-[11px] font-mono text-amber-600 dark:text-amber-400 pt-1">
                    Sugestão: reduza o tamanho da ação até que ela cumpra os 4 testes com leveza.
                  </p>
                )}
              </div>
            </div>
          )
        })}
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
          <span>Voltar aos pilares</span>
        </Button>

        <Button
          type="button"
          onClick={onAvancar}
          className="min-h-[44px] px-6 text-xs font-mono font-semibold rounded-[8px] bg-primary text-primary-foreground gap-1.5"
        >
          <span>Avançar para a Frase de Direção</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
