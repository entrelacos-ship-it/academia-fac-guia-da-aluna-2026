import React, { useState } from 'react'
import { ArrowRight, ArrowLeft, BookOpen, CheckCircle2, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Step1MitoProps {
  onAvancar: () => void
  onVoltar: () => void
}

export const Step1Mito: React.FC<Step1MitoProps> = ({ onAvancar, onVoltar }) => {
  const [cartaAtiva, setCartaAtiva] = useState(0)
  const [respostaQuiz, setRespostaQuiz] = useState<number | null>(null)
  const [feedbackVisivel, setFeedbackVisivel] = useState(false)

  const cartas = [
    {
      id: 0,
      titulo: 'Ikigai contra Ikigai-kan',
      corpo:
        'Ikigai costuma ser traduzido como a fonte de sentido (a atividade, a causa, a pessoa). Já o ikigai-kan é o sentimento interior e encarnado de que viver e trabalhar vale a pena. O mapa foca no seu ikigai-kan.',
    },
    {
      id: 1,
      titulo: 'O diagrama dos 4 círculos não é o ikigai tradicional',
      corpo:
        'A mandala de 4 círculos que viralizou no ocidente foi criada por Andrés Zuzunaga em 2011 sobre propósito de vida. A palavra "ikigai" só foi acrescentada ao centro em 2014 por Marc Winn. Não é uma tradição milenar japonesa fechada.',
    },
    {
      id: 2,
      titulo: 'As 7 necessidades de Mieko Kamiya (1966)',
      corpo:
        'A psiquiatra Mieko Kamiya dedicou a vida a entender quem mantinha a chama acesa mesmo em contextos de isolamento severo. Ela observou 7 necessidades vitais para o ikigai-kan, que investigaremos na Fase 3.',
    },
    {
      id: 3,
      titulo: 'Fonte contra sentimento',
      corpo:
        'Uma fonte pode ser rica, mas se não nutre o seu sentimento interno, há desgaste. Da mesma forma, pequenos gestos do cotidiano podem ser gigantescos para alimentar o seu sentimento de valor.',
    },
  ]

  const opcoesQuiz = [
    {
      id: 0,
      texto:
        'O ikigai-kan é o sentimento interior de que o trabalho vale a pena, enquanto o ikigai é a fonte.',
      correta: true,
      explicacao:
        'Exatamente! O ikigai-kan é a experiência emocional viva, que nenhuma fórmula rígida substitui.',
    },
    {
      id: 1,
      texto: 'O diagrama dos quatro círculos é uma filosofia ancestral imutável criada no Japão.',
      correta: false,
      explicacao:
        'Na verdade, o diagrama nasceu na Espanha com Zuzunaga em 2011 e recebeu o termo ikigai em 2014 por Marc Winn.',
    },
    {
      id: 2,
      texto: 'O ikigai exige que você mude de profissão se não estiver perfeitamente alinhada.',
      correta: false,
      explicacao:
        'Pelo contrário! O método foca no redesenho cuidadoso e na sustentação do que já existe, sem rupturas abruptas.',
    },
  ]

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-left animate-fade-in">
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
          Fase 1 de 8 · O Mito e o Vocabulário
        </span>
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-foreground">
          Desfazendo o mito dos quatro círculos
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Quatro cartas breves para libertar a sua prática das promessas fáceis da internet.
        </p>
      </div>

      {/* Cartas Deslizantes / Seletor */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {cartas.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCartaAtiva(i)}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-mono transition-all cursor-pointer ${
                cartaAtiva === i
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'bg-muted/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              Carta 0{i + 1}
            </button>
          ))}
        </div>

        <div className="p-6 rounded-[16px] border border-border bg-card space-y-3 min-h-[160px] flex flex-col justify-center">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
            Carta 0{cartaAtiva + 1} de 04
          </span>
          <h3 className="font-serif-editorial text-xl font-medium text-foreground">
            {cartas[cartaAtiva].titulo}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {cartas[cartaAtiva].corpo}
          </p>
        </div>
      </div>

      {/* Pergunta de Verificação Gentil (Sem nota e sem erro punitivo) */}
      <div className="p-6 rounded-[16px] border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/20 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="font-serif-editorial text-lg font-medium text-foreground">
            Uma checagem gentil do que vimos até aqui
          </h3>
        </div>

        <p className="text-xs text-muted-foreground">
          Qual afirmação melhor resume a distinção entre a mandala da internet e o ikigai real?
        </p>

        <div className="space-y-2">
          {opcoesQuiz.map((op) => (
            <button
              key={op.id}
              type="button"
              onClick={() => {
                setRespostaQuiz(op.id)
                setFeedbackVisivel(true)
              }}
              className={`w-full p-3.5 rounded-[10px] border text-left text-xs font-mono transition-all cursor-pointer ${
                respostaQuiz === op.id
                  ? 'border-primary bg-primary/10 text-foreground font-semibold'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {op.texto}
            </button>
          ))}
        </div>

        {feedbackVisivel && respostaQuiz !== null && (
          <div className="p-3.5 rounded-[10px] bg-background border border-border text-xs text-muted-foreground space-y-1 animate-fade-in">
            <span className="font-mono font-semibold text-primary block">
              Devolutiva reflexiva:
            </span>
            <p className="leading-relaxed">{opcoesQuiz[respostaQuiz].explicacao}</p>
          </div>
        )}
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
          <span>Voltar ao termômetro</span>
        </Button>

        <Button
          type="button"
          onClick={onAvancar}
          className="min-h-[44px] px-6 text-xs font-mono font-semibold rounded-[8px] bg-primary text-primary-foreground gap-1.5"
        >
          <span>Avançar para o Mapa de Fontes</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
