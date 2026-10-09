import React from 'react'
import { SkigaiDataModel } from '@/types/skigai'
import { ArrowRight, ArrowLeft, HeartHandshake, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'

interface Step0TermometroProps {
  model: SkigaiDataModel
  onAtualizar: (novosDados: Partial<SkigaiDataModel>) => void
  onAvancar: () => void
  onVoltar: () => void
}

export const Step0Termometro: React.FC<Step0TermometroProps> = ({
  model,
  onAtualizar,
  onAvancar,
  onVoltar,
}) => {
  const notaTermometro = model.termometro ?? 5
  const palavra = model.palavraDeHoje || ''
  const nome = model.nome || ''

  const isBaixo = notaTermometro <= 2

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-left animate-fade-in">
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
          Fase 0 de 8 · Termômetro e Intenção
        </span>
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-foreground">
          Como o seu trabalho se faz presente hoje?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Uma pausa breve para registrar o seu ponto de partida, sem julgamento e sem cobrança por
          um número ideal.
        </p>
      </div>

      {/* Controle do Termômetro 0 a 10 */}
      <div className="p-6 rounded-[16px] border border-border bg-card space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">
            De 0 a 10, o quanto o seu trabalho vale a pena hoje?
          </label>

          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-1">
            <span>0 (nada)</span>
            <span className="text-2xl font-serif-editorial font-bold text-primary">
              {notaTermometro}
            </span>
            <span>10 (muito)</span>
          </div>

          <Slider
            value={[notaTermometro]}
            onValueChange={(vals) => onAtualizar({ termometro: vals[0] })}
            min={0}
            max={10}
            step={1}
            className="py-4"
          />
        </div>

        {/* Mensagem Acolhedora se 0 a 2 */}
        {isBaixo && (
          <div className="p-4 rounded-[12px] bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2 text-xs text-rose-800 dark:text-rose-300">
            <div className="flex items-center gap-2 font-mono font-semibold">
              <HeartHandshake className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Acolhendo o cansaço do momento</span>
            </div>
            <p className="leading-relaxed">
              Obrigada pela franqueza. Reconhecer o peso do trabalho exige coragem. Se o desgaste
              estiver pesado, lembre-se de buscar apoio humano na sua terapia ou rede de confiança.
              Você pode pausar quando quiser.
            </p>
          </div>
        )}
      </div>

      {/* Campo Livre: Palavra de Hoje */}
      <div className="p-6 rounded-[16px] border border-border bg-card space-y-3">
        <label className="text-sm font-medium text-foreground block">
          Se tivesse que escolher uma palavra para o seu trabalho hoje, qual seria?
        </label>
        <Input
          type="text"
          value={palavra}
          onChange={(e) => onAtualizar({ palavraDeHoje: e.target.value })}
          placeholder="Ex: semeadura, travessia, peso, fôlego, recomeço..."
          className="h-11 text-sm font-mono"
        />
        <p className="text-[11px] font-mono text-muted-foreground">
          Uma palavra simples basta. Ela acompanhará a capa do seu relatório.
        </p>
      </div>

      {/* Campo Opcional: Como quer ser chamada */}
      <div className="p-6 rounded-[16px] border border-border bg-card space-y-3">
        <label className="text-sm font-medium text-foreground block">
          Como você quer ser chamada no relatório final? (Opcional)
        </label>
        <Input
          type="text"
          value={nome}
          onChange={(e) => onAtualizar({ nome: e.target.value })}
          placeholder="Seu nome ou como preferir"
          className="h-11 text-sm font-mono"
        />
        <p className="text-[11px] font-mono text-muted-foreground">
          Fica salvo apenas neste aparelho para personalizar a impressão e exportação.
        </p>
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
          <span>Voltar ao início</span>
        </Button>

        <Button
          type="button"
          onClick={onAvancar}
          className="min-h-[44px] px-6 text-xs font-mono font-semibold rounded-[8px] bg-primary text-primary-foreground gap-1.5"
        >
          <span>Avançar para a Fase 1</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
