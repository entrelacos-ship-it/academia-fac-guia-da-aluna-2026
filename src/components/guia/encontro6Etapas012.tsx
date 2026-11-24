// ═════════════════════════════════════════════════════════════
// Etapas 0 a 2 do Encontro 6 · Crenças (conteúdo verbatim).
// Visual calmo: espaço em branco, frases curtas, destaque em
// laranja, nada de vermelho de alerta.
// ═════════════════════════════════════════════════════════════
import React from 'react'
import {
  CHECKLIST_ETAPA0,
  CHECKLIST_ETAPAS_1_3,
  TERRITORIOS,
  MITOS_FATOS,
  CAMINHO_VIRADA_PASSOS,
} from '@/config/encontro6Content'
import { Checklist, Callout, type ChecklistValues } from '@/components/guia/encontro4Shared'
import {
  CartoesTerritorio,
  CartaoMitoFato,
  CaminhoVirada,
} from '@/components/guia/encontro6Elements'

// Etapa 0 · Antes de começar
export const Etapa0Conteudo: React.FC<{
  valores: ChecklistValues
  onChange: (v: ChecklistValues) => void
}> = ({ valores, onChange }) => (
  <div className="space-y-6">
    <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">
      Você já tem Manifesto, preço calculado, perfil pronto e marca com rosto e voz. Mesmo assim, é
      bem provável que alguma coisa tenha ficado parada: um post que não saiu, um preço que não foi
      dito, uma indicação que não foi pedida. Hoje a gente olha para o que trava por dentro. Não
      para se culpar, para entender.
    </p>

    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold mb-2">
        Tenho em mãos
      </p>
      <Checklist itens={CHECKLIST_ETAPA0} valores={valores} onChange={onChange} />
    </div>

    <Callout tipo="etica">
      <p className="font-semibold text-editorial-primary mb-1">Nosso combinado</p>
      <p>
        Ninguém é obrigada a compartilhar nada. O que for dito no encontro fica no encontro. Este é
        um laboratório profissional, não um espaço de terapia: a gente olha para como as crenças
        aparecem no seu trabalho. Se algo pessoal mais profundo surgir, ele merece um espaço
        próprio, na sua análise pessoal.
      </p>
    </Callout>
  </div>
)

// Etapa 1 · O que é uma crença
export const Etapa1Conteudo: React.FC = () => (
  <div className="space-y-8">
    {/* A pergunta incômoda */}
    <div className="rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] p-5 sm:p-7 text-center">
      <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold mb-3">
        A pergunta incômoda
      </p>
      <p className="font-serif text-lg sm:text-xl text-editorial-primary leading-relaxed max-w-xl mx-auto">
        Você já sabe o que fazer. Então por que ainda não faz?
      </p>
    </div>

    {/* Uma frase que virou lente */}
    <div className="space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
        Uma frase que virou lente
      </p>
      <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">
        Uma crença é uma frase aprendida que virou lente. Ela não é verdade, nem defeito. É história.
        A gente não escolhe as primeiras crenças sobre dinheiro e trabalho: herda da família, da
        faculdade, da profissão. Elas funcionam como óculos. Quem usa não percebe a lente, só vê o
        mundo daquele jeito.
      </p>
    </div>

    {/* Os três territórios */}
    <div className="space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
        Os três territórios
      </p>
      <CartoesTerritorio territorios={TERRITORIOS} />
    </div>

    {/* De onde elas vêm */}
    <div className="space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
        De onde elas vêm
      </p>
      <div className="flex flex-wrap gap-2">
        {ORIGENS.map((o) => (
          <span
            key={o}
            className="rounded-full border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] px-3 py-1.5 text-xs text-editorial-primary"
          >
            {o}
         span>
        ))}
      </div>
      <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">
        Quantas aulas sobre dinheiro você teve na graduação? A formação ensina a cuidar e silencia
        sobre como viver disso. Esse silêncio também ensina: ensina que falar de dinheiro é sujo.
      </p>
    </div>

    {/* Não é falha sua */}
    <div className="space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
        Não é falha sua
      </p>
      <div className="space-y-1.5 font-serif text-base sm:text-lg text-editorial-primary">
        <p>Exaustão vira vocação. Cobrar barato vira humildade. Prosperar vira falha moral.</p>
      </div>
      <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">
        Essa é a precarização naturalizada da psicologia. Ela não é um problema individual seu. É
        uma estrutura que faz a profissional acreditar que se sacrificar é ser boa. Nomear isso já
        tira parte do peso.
 </div>
    </div>

    {/* Os sinais no comportamento */}
    <div className="space-y-3">
      <p className="font-como text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
        Os sinais no comportamento
        <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">
          A crença não aparece falando. Ela aparece agindo. Por isso a gente começa pelos
          comportamentos: eles são a pista.
        </p>
      </p>
    </div>
    <SinaisTabela />
    <div className="space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
        O custo invisível
      </p>
      <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">
        Toda crença tem um preço: em dinheiro, em energia, em pacientes que não chegam até você. Se
        a crença 'não posso cobrar de quem sofre' faz você cobrar R$ 40 a menos por sessão, em 60
        sessões por mês são R$ 2.400 que saem de você. E não é só dinheiro: é cansaço, é a
        supervisão que você não paga, em energia. Toda crença tem um preço.
      </p>
    </div>

    {/* O caminho da virada */}
    <div className="space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-supper text-editorial-secondary font-semibold">
        O caminho da virada
      </p>
      <CaminhoVirada passos={CAMINHO_VIRADA_PASSOS} />
      <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">
        A gente não arranca a crença à força. A gente nomeia, entende de onde veio, vê quanto ela
        custa, procura evidências de que ela não é tão verdadeira quanto parece, escreve uma nova
        frase e dá um passo pequeno na direção dela.
      </p>
    </div>

    {/* Virada não é afirmação positiva */}
    <div className="space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
        Virada não é afirmação positiva
      </p>
      <AntesDepois
        rotuloAntes="Evite"
        rotuloDepois="Prefira"
        antes={...}
        depois={...}
      />
      <p className="text-sm sm:text props
      <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">
        A frase de virada precisa ser verdadeira, ética e ancorada no seu Manifesto. Ela não nega a
        dúvida, ela oferece um novo ângulo.
      </p>
    </div>
  </div>
)
