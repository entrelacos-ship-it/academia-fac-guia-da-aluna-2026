import React from 'react'
import { ChevronDown } from 'lucide-react'
import {
  PassoCard,
  CaminhoDeMenus,
  CaixaDePrompt,
  BotaoGPT,
  Aviso,
  CaixaTravou,
  Checklist,
  BotaoLinkOficial,
  CronometroCincoSegundos,
  type ChecklistValores,
} from './encontro5Shared'
import { IlustracaoExemplo } from './encontro5Ilustracoes'
import { GPT_BIO_MANIFESTO, PROMPT_BIO_MANIFESTO } from '../../config/encontro5Content'

export const ENCONTRO5_STORAGE_KEY = 'academia-fac:encontro5-checklists'

// ─────────────────────────────────────────────────────────────
// Etapas da Aula 5 (títulos e tempos verbatim da especificação)
// ─────────────────────────────────────────────────────────────
export interface EtapaDef {
  id: string
  numero: string
  titulo: string
  tempo: string
}

export const ETAPAS_ENCONTRO_5: EtapaDef[] = [
  { id: 'etapa-0', numero: '0', titulo: 'Antes de começar', tempo: '3 min' },
  { id: 'etapa-1', numero: '1', titulo: 'A IA trabalha para você', tempo: '15 min' },
  {
    id: 'etapa-2',
    numero: '2',
    titulo: 'Facebook: perfil pessoal e Página profissional',
    tempo: '15 min',
  },
  {
    id: 'etapa-3',
    numero: '3',
    titulo: 'Instagram: conta profissional e vitrine',
    tempo: '30 min',
  },
  { id: 'etapa-4', numero: '4', titulo: 'Conectar Instagram e Facebook', tempo: '5 min' },
  { id: 'etapa-5', numero: '5', titulo: 'WhatsApp Business', tempo: '25 min' },
  { id: 'etapa-6', numero: '6', titulo: 'Todos os prompts (consulta)', tempo: '' },
  { id: 'etapa-7', numero: '7', titulo: 'Checklist final e teste dos 5 segundos', tempo: '5 min' },
]

// ─────────────────────────────────────────────────────────────
// Checklist da Etapa 0 (único com itens neste primeiro passo;
// as demais etapas serão preenchidas nos próximos pedidos)
// ─────────────────────────────────────────────────────────────
export const CHECKLIST_ETAPA_0 = [
  { id: 'e5-0-1', texto: 'Tenho em mãos meu Manifesto da Marca escrito no Encontro 2' },
  { id: 'e5-0-2', texto: 'Tenho em mãos meu número de WhatsApp de atendimento' },
  { id: 'e5-0-3', texto: 'Tenho em mãos meu CRP para preencher o perfil' },
  { id: 'e5-0-4', texto: 'Vou fazer uma etapa por vez, sem pular passos' },
]

export const TODOS_CHECKLISTS: Record<string, { id: string }[]> = {
  'etapa-0': CHECKLIST_ETAPA_0,
}

export const TOTAL_ITENS_CHECKLIST = CHECKLIST_ETAPA_0.length

const carregarChecklists = (): Record<string, ChecklistValores> => {
  try {
    const bruto = localStorage.getItem(ENCONTRO5_STORAGE_KEY)
    return bruto ? (JSON.parse(bruto) as Record<string, ChecklistValores>) : {}
  } catch {
    return {}
  }
}

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────
interface Encontro5CadernoProps {
  className?: string
}

export const Encontro5Caderno: React.FC<Encontro5CadernoProps> = ({ className }) => {
  const [etapasAbertas, setEtapasAbertas] = React.useState<boolean[]>(() =>
    ETAPAS_ENCONTRO_5.map(() => false),
  )
  const [checklists, setChecklists] = React.useState<Record<string, ChecklistValores>>(() =>
    carregarChecklists(),
  )

  React.useEffect(() => {
    try {
      localStorage.setItem(ENCONTRO5_STORAGE_KEY, JSON.stringify(checklists))
    } catch {
      // Sem espaço no navegador: a aula continua funcionando,
      // apenas o progresso não fica salvo ao voltar.
    }
  }, [checklists])

  const marcar = (etapaId: string) => (novos: ChecklistValores) =>
    setChecklists((atuais) => ({ ...atuais, [etapaId]: novos }))

  const itensMarcados = Object.values(checklists).reduce(
    (total, valores) => total + Object.values(valores).filter(Boolean).length,
    0,
  )
  const progressoGeral = Math.round((itensMarcados / TOTAL_ITENS_CHECKLIST) * 100)

  const alternarEtapa = (i: number) => {
    setEtapasAbertas((atuais) => atuais.map((aberta, j) => (j === i ? !aberta : aberta)))
  }

  const abrirEtapa = (i: number) => {
    setEtapasAbertas((atuais) => atuais.map((aberta, j) => (j === i ? true : aberta)))
  }

  return (
    <div className={className}>
      {/* Topo da aula */}
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#ff9b32] mb-2">
          AULA 5 · CANAIS
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl text-editorial-primary tracking-tight mb-3">
          Seus canais prontos para receber pacientes
        </h2>
        <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed max-w-2xl">
          Facebook, Instagram e WhatsApp Business configurados passo a passo, com a IA escrevendo a
          partir do seu Manifesto.
        </p>
      </div>

      {/* Barra de progresso geral da aula */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-editorial-secondary">
            Seu progresso na aula
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-editorial-secondary">
            {itensMarcados}/{TOTAL_ITENS_CHECKLIST} · {progressoGeral}%
          </p>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-[#27272A] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] transition-all duration-500"
            style={{ width: `${progressoGeral}%` }}
          />
        </div>
      </div>

      <div className="md:grid md:grid-cols-[minmax(0,1fr)_260px] md:gap-10">
        {/* Coluna de conteúdo: no celular, blocos que abrem e fecham ao tocar no título */}
        <div className="min-w-0">
          <div className="space-y-3">
            {ETAPAS_ENCONTRO_5.map((etapa, i) => {
              const aberta = etapasAbertas[i]
              const vals = checklists[etapa.id] ?? {}
              const totalEtapa = TODOS_CHECKLISTS[etapa.id]?.length ?? 0
              const feitos = Object.values(vals).filter(Boolean).length
              return (
                <div
                  key={etapa.id}
                  className="rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] shadow-2xs overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => alternarEtapa(i)}
                    aria-expanded={aberta}
                    className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 min-h-[56px] cursor-pointer text-left"
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                        aberta
                          ? 'bg-[#7c3aed] text-white'
                          : 'bg-slate-100 dark:bg-[#27272A] text-editorial-secondary'
                      }`}
                    >
                      {etapa.numero}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-editorial-primary leading-snug">
                        {etapa.titulo}
                      </span>
                      {etapa.tempo && (
                        <span className="block font-mono text-[10px] text-editorial-secondary mt-0.5">
                          {etapa.tempo}
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-editorial-secondary transition-transform duration-200 ${
                        aberta ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {aberta && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 space-y-5">
                      {/* Neste primeiro passo, as etapas estão vazias. Os
                          conteúdos de cada uma serão enviados nos próximos
                          pedidos. Só a Etapa 0 traz o checklist inicial. */}
                      {etapa.id === 'etapa-0' ? (
                        <Checklist
                          itens={CHECKLIST_ETAPA_0}
                          valores={vals}
                          onChange={marcar(etapa.id)}
                        />
                      ) : (
                        <p className="text-xs font-mono text-editorial-secondary italic">
                          Conteúdo em preparação pela coordenação pedagógica.
                        </p>
                      )}
                      {totalEtapa > 0 && (
                        <p className="font-mono text-[10px] text-editorial-secondary">
                          {feitos}/{totalEtapa} marcados
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Índice lateral fixo no computador */}
        <aside className="hidden md:block">
          <div className="sticky top-24 space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-editorial-secondary mb-3">
              Nesta aula
            </p>
            {ETAPAS_ENCONTRO_5.map((e, i) => {
              const aberta = etapasAbertas[i]
              const vals = checklists[e.id] ?? {}
              const totalEtapa = TODOS_CHECKLISTS[e.id]?.length ?? 0
              const feitos = Object.values(vals).filter(Boolean).length
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => (aberta ? alternarEtapa(i) : abrirEtapa(i))}
                  className={`w-full text-left rounded-[8px] px-3 py-2.5 flex items-center gap-2.5 transition-colors cursor-pointer ${
                    aberta
                      ? 'bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#3f3f46]'
                      : 'border border-transparent hover:bg-slate-50 dark:hover:bg-[#121216]'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                      aberta
                        ? 'bg-[#7c3aed] text-white'
                        : 'bg-slate-100 dark:bg-[#27272A] text-editorial-secondary'
                    }`}
                  >
                    {e.numero}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-xs leading-snug ${aberta ? 'font-semibold text-editorial-primary' : 'text-editorial-secondary'}`}
                    >
                      {e.titulo}
                    </span>
                    {e.tempo && (
                      <span className="block font-mono text-[9px] text-editorial-secondary mt-0.5">
                        {e.tempo}
                      </span>
                    )}
                    {totalEtapa > 0 && (
                      <span className="block font-mono text-[9px] text-editorial-secondary mt-0.5">
                        {feitos}/{totalEtapa} marcados
                      </span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Exemplos dos elementos repetíveis (para aprovação neste
// primeiro passo; depois são movidos para dentro das etapas)
// ─────────────────────────────────────────────────────────────
export const ExemplosElementos: React.FC = () => (
  <div className="space-y-6">
    <div className="space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-editorial-secondary">
        Exemplos dos elementos da aula
      </p>
      <PassoCard numero={1} ilustracao={<IlustracaoExemplo />}>
        <p>
          Toque no botão <strong>Editar perfil</strong> para começar.
        </p>
      </PassoCard>
      <CaminhoDeMenus
        passos={['☰', 'Tipo de conta e ferramentas', 'Mudar para conta profissional']}
      />
      <CaixaDePrompt
        titulo="Bio do Manifesto"
        prompt={PROMPT_BIO_MANIFESTO}
        idAnchor="prompt-bio-manifesto"
      />
      <BotaoGPT link={GPT_BIO_MANIFESTO} promptAnchorId="prompt-bio-manifesto" />
      <Aviso tipo="dica">Exemplo de dica: uma orientação curta e acolhedora.</Aviso>
      <Aviso tipo="atencao">Exemplo de atenção: um cuidado importante.</Aviso>
      <Aviso tipo="etica">Exemplo de aviso de ética profissional.</Aviso>
      <CaixaTravou solucoes={['Exemplo de solução curta 1.', 'Exemplo de solução curta 2.']} />
      <Checklist
        itens={[{ id: 'ex-1', texto: 'Exemplo de item do checklist' }]}
        valores={{}}
        onChange={() => {}}
      />
      <BotaoLinkOficial href="https://business.facebook.com">
        Exemplo de link oficial
      </BotaoLinkOficial>
      <CronometroCincoSegundos />
    </div>
  </div>
)
