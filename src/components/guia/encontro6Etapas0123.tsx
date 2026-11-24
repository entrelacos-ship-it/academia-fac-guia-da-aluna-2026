import React from 'react'
import {
  ETAPA0_ABERTURA,
  CHECKLIST_ETAPA0,
  ETAPA0_ETICA_TITULO,
  ETAPA0_ETICA,
  ETAPA1_PERGUNTA,
  ETAPA1_BLOCO_LENSE_TITULO,
  ETAPA1_BLOCO_LENSE,
  TERRITORIOS,
  ETAPA1_ORIGENS_LABELS,
  ETAPA1_ORIGENS_TEXTO,
  ETAPA1_FALHA_TITULO,
  ETAPA1_FALHA_LINHAS,
  ETAPA1_FALHA_TEXTO,
  ETAPA1_SINAIS_TITULO,
  ETAPA1_SINAIS_TEXTO,
  ETAPA1_SINAIS_COLUNAS,
  ETAPA1_SINAIS,
  ETAPA1_CUSTO_TITULO,
  ETAPA1_CUSTO,
  ETAPA1_CAMINHO_PASSOS,
  ETAPA1_CAMINHO_TEXTO,
  ETAPA1_VIRADA_TITULO,
  ETAPA1_VIRADA_EVITE,
  ETAPA1_VIRADA_PREFIRA,
  ETAPA1_VIRADA_TEXTO,
  ETAPA2_ABERTURA,
  MITOS_FATOS,
  ETAPA2_ATENCAO,
  ETAPA3_ABERTURA,
  FRASES_DINAMICA,
  ETAPA3_DEPOIS_TITULO,
  ETAPA3_DEPOIS_PASSOS,
  ETAPA3_DICA,
  CHECKLIST_ETAPAS_1_A_3,
} from '@/config/encontro6Content'
import {
  CartoesTerritorio,
  CartoesMitoFato,
  CaminhoVirada,
  GrupoFrasesDinamica,
} from '@/components/guia/encontro6Elements'
import { Callout, Checklist, type ChecklistValues } from '@/components/guia/encontro4Shared'
import { AntesDepois } from '@/components/guia/encontro5Elements'

// ─────────────────────────────────────────────────────────────
// Etapas 0 a 3 do Encontro 6 · Crenças sobre dinheiro, venda e
// exposição. Conteúdo verbatim da Tati; zero travessões; visual
// calmo (roxo/laranja, sem vermelho de alerta).
// ─────────────────────────────────────────────────────────────

// Bloco de leitura com título e corpo
const Bloco: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => (
  <div className="space-y-2">
    <p className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">{titulo}</p>
    <div className="text-sm text-editorial-primary leading-relaxed">{children}</div>
  </div>
)

// Rótulo pequeno dos blocos sem corpo (igual aos demais cadernos)
const RotuloBloco: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
    {children}
  </p>
)

// ─────────────────────────────────────────────────────────────
// Etapa 0 · Antes de começar
// ─────────────────────────────────────────────────────────────
export const Etapa0ConteudoE6: React.FC<{
  valores: ChecklistValues
  onChange: (v: ChecklistValues) => void
}> = ({ valores, onChange }) => (
  <div className="space-y-5">
    <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">{ETAPA0_ABERTURA}</p>

    <div className="space-y-3">
      <p className="font-sans font-semibold text-sm text-editorial-primary">Tenho em mãos</p>
      <Checklist itens={CHECKLIST_ETAPA0} valores={valores} onChange={onChange} />
    </div>

    <Callout tipo="etica">
      <span className="font-semibold">{ETAPA0_ETICA_TITULO}: </span>
      {ETAPA0_ETICA}
    </Callout>
  </div>
)

// ─────────────────────────────────────────────────────────────
// Etapa 1 · O que é uma crença
// ─────────────────────────────────────────────────────────────

// Tabela "sinais no comportamento" que vira cartões no celular
const TabelaSinais: React.FC = () => (
  <>
    {/* Computador: tabela */}
    <div className="hidden sm:block rounded-[12px] border border-slate-200 dark:border-[#27272A] overflow-hidden shadow-2xs">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-purple-50 dark:bg-[#18181B] border-b border-slate-200 dark:border-[#27272A]">
            {ETAPA1_SINAIS_COLUNAS.map((coluna) => (
              <th
                key={coluna}
                scope="col"
                className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider font-semibold text-editorial-secondary"
              >
                {coluna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ETAPA1_SINAIS.map((sinal) => (
            <tr
              key={sinal.acao}
              className="border-b border-slate-100 dark:border-[#18181B] last:border-b-0"
            >
              <td className="px-4 py-3 text-xs sm:text-sm text-editorial-primary font-medium align-top">
                {sinal.acao}
              </td>
              <td className="px-4 py-3 text-xs sm:text-sm italic text-editorial-secondary align-top">
                "{sinal.crenca}"
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* Celular: cartões */}
    <div className="sm:hidden space-y-2">
      {ETAPA1_SINAIS.map((sinal) => (
        <div
          key={sinal.acao}
          className="rounded-[10px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-3.5 space-y-1.5 shadow-2xs"
        >
          <p className="text-xs font-medium text-editorial-primary leading-relaxed">{sinal.acao}</p>
          <p className="text-xs italic text-editorial-secondary leading-relaxed">
            "{sinal.crenca}"
          </p>
        </div>
      ))}
    </div>
  </>
)

export const Etapa1ConteudoE6: React.FC = () => (
  <div className="space-y-7">
    {/* A pergunta incômoda */}
    <div className="rounded-[14px] border border-purple-200 dark:border-purple-900/60 bg-purple-50 dark:bg-purple-950/20 p-5 sm:p-6">
      <RotuloBloco>A pergunta incômoda</RotuloBloco>
      <p className="mt-3 font-serif text-lg sm:text-2xl text-editorial-primary leading-snug tracking-tight">
        {ETAPA1_PERGUNTA}
      </p>
    </div>

    {/* Uma frase que virou lente */}
    <Bloco titulo={ETAPA1_BLOCO_LENSE_TITULO}>{ETAPA1_BLOCO_LENSE}</Bloco>

    {/* Os três territórios */}
    <div className="space-y-3">
      <RotuloBloco>Os três territórios</RotuloBloco>
      <CartoesTerritorio territorios={TERRITORIOS} />
    </div>

    {/* De onde elas vêm */}
    <Bloco titulo="De onde elas vêm">
      <div className="flex flex-wrap gap-2 pt-1">
        {ETAPA1_ORIGENS_LABELS.map((etiqueta) => (
          <span
            key={etiqueta}
            className="inline-flex items-center rounded-full border border-purple-200 dark:border-[#3f3f46] bg-purple-50 dark:bg-[#18181B] px-3 py-1 text-[11px] sm:text-xs font-medium text-editorial-primary"
          >
            {etiqueta}
          </span>
        ))}
      </div>
      <p className="pt-3">{ETAPA1_ORIGENS_TEXTO}</p>
    </Bloco>

    {/* Não é falha sua */}
    <div className="rounded-[14px] border border-purple-200 dark:border-purple-900/60 bg-purple-50 dark:bg-purple-950/20 p-5 sm:p-6 space-y-3">
      <p className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
        {ETAPA1_FALHA_TITULO}
      </p>
      <div className="space-y-1">
        {ETAPA1_FALHA_LINHAS.map((linha) => (
          <p
            key={linha}
            className="font-serif text-base sm:text-lg text-editorial-primary leading-snug"
          >
            {linha}
          </p>
        ))}
      </div>
      <p className="text-sm text-editorial-primary leading-relaxed">{ETAPA1_FALHA_TEXTO}</p>
    </div>

    {/* Os sinais no comportamento */}
    <Bloco titulo={ETAPA1_SINAIS_TITULO}>
      <p>{ETAPA1_SINAIS_TEXTO}</p>
      <TabelaSinais />
    </Bloco>

    {/* O custo invisível */}
    <Bloco titulo={ETAPA1_CUSTO_TITULO}>{ETAPA1_CUSTO}</Bloco>

    {/* O caminho da virada */}
    <div className="space-y-3">
      <RotuloBloco>O caminho da virada</RotuloBloco>
      <CaminhoVirada passos={ETAPA1_CAMINHO_PASSOS} />
      <p className="text-sm text-editorial-primary leading-relaxed">{ETAPA1_CAMINHO_TEXTO}</p>
    </div>

    {/* Virada não é afirmação positiva: comparativo Evite / Prefira */}
    <div className="space-y-3">
      <RotuloBloco>{ETAPA1_VIRADA_TITULO}</RotuloBloco>
      <AntesDepois
        tituloExemplo=""
        antes={`"${ETAPA1_VIRADA_EVITE}"`}
        depois={`"${ETAPA1_VIRADA_PREFIRA}"`}
        rotuloAntes="Evite"
        rotuloDepois="Prefira"
      />
      <p className="text-sm text-editorial-primary leading-relaxed">{ETAPA1_VIRADA_TEXTO}</p>
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────
// Etapa 2 · Mito e Fato sobre a ética
// ─────────────────────────────────────────────────────────────
export const Etapa2ConteudoE6: React.FC<{ aoVirarTodos: () => void }> = ({ aoVirarTodos }) => {
  // Detecta quando os três cartões ficam virados, para o checklist
  // das Etapas 1 a 3 se marcar automaticamente.
  const [virados, setVirados] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    const todos = MITOS_FATOS.every((m) => virados[m.id])
    if (todos) aoVirarTodos()
  }, [virados, aoVirarTodos])

  return (
    <div className="space-y-5">
      <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">
        {ETAPA2_ABERTURA}
      </p>

      {/* Cartões locais com detecção de "todos virados" */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MITOS_FATOS.map((item) => (
          <CartaoMitoFatoControlado
            key={item.id}
            item={item}
            onVirar={(v) => setVirados((atual) => ({ ...atual, [item.id]: v }))}
          />
        ))}
      </div>

      <Callout tipo="atencao">{ETAPA2_ATENCAO}</Callout>
    </div>
  )
}

// Cartão Mito e Fato que avisa a etapa quando é virado
const CartaoMitoFatoControlado: React.FC<{
  item: (typeof MITOS_FATOS)[number]
  onVirar: (virado: boolean) => void
}> = ({ item, onVirar }) => {
  const [virado, setVirado] = React.useState(false)

  const alternar = () => {
    const novo = !virado
    setVirado(novo)
    onVirar(novo)
  }

  // Reaproveita o visual do elemento existente
  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={alternar}
        aria-pressed={virado}
        className="block w-full text-left cursor-pointer [perspective:1200px]"
      >
        <div
          className={`relative min-h-[9rem] w-full transition-transform duration-500 [transform-style:preserve-3d] ${
            virado ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          <div className="absolute inset-0 flex flex-col rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 sm:p-5 shadow-2xs [backface-visibility:hidden]">
            <span className="font-mono text-[10px] uppercase tracking-wider font-semibold text-editorial-secondary">
              Mito
            </span>
            <p className="mt-2 text-sm sm:text-base text-editorial-primary leading-relaxed">
              {item.mito}
            </p>
          </div>
          <div className="absolute inset-0 flex flex-col rounded-[14px] border border-purple-200 dark:border-purple-900/60 bg-purple-50 dark:bg-purple-950/20 p-4 sm:p-5 shadow-2xs [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider font-semibold text-[#7c3aed] dark:text-[#C084FC]">
              Fato
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 8.5l3 3 7-7" />
              </svg>
            </span>
            <p className="mt-2 text-sm sm:text-base text-editorial-primary leading-relaxed">
              {item.fato}
            </p>
          </div>
        </div>
      </button>
      <p className="text-center text-[10px] font-mono text-editorial-secondary">toque para virar</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Etapa 3 · Dinâmica: complete a frase
// ─────────────────────────────────────────────────────────────
export const Etapa3ConteudoE6: React.FC<{
  valores: ChecklistValues
  onChange: (v: ChecklistValues) => void
}> = ({ valores, onChange }) => {
  let numero = 1
  const grupos = FRASES_DINAMICA.map((grupo) => {
    const comNumero = { grupo, numeroInicial: numero }
    numero += grupo.frases.length
    return comNumero
  })

  return (
    <div className="space-y-5">
      <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">
        {ETAPA3_ABERTURA}
      </p>

      <div className="space-y-4">
        {grupos.map(({ grupo, numeroInicial }) => (
          <GrupoFrasesDinamica key={grupo.id} grupo={grupo} numeroInicial={numeroInicial} />
        ))}
      </div>

      {/* Depois de escrever */}
      <div className="space-y-3">
        <p className="font-sans font-semibold text-sm text-editorial-primary">
          {ETAPA3_DEPOIS_TITULO}
        </p>
        <ol className="space-y-2">
          {ETAPA3_DEPOIS_PASSOS.map((passo, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#7c3aed] dark:bg-[#C084FC] text-white dark:text-[#0A0A14] font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-xs sm:text-sm text-editorial-primary leading-relaxed">{passo}</p>
            </li>
          ))}
        </ol>
      </div>

      <Callout tipo="dica">{ETAPA3_DICA}</Callout>

      {/* Checklist das Etapas 1 a 3 */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-[#18181B]">
        <p className="font-sans font-semibold text-sm text-editorial-primary">
          Checklist das Etapas 1 a 3
        </p>
        <Checklist itens={CHECKLIST_ETAPAS_1_A_3} valores={valores} onChange={onChange} />
      </div>
    </div>
  )
}
