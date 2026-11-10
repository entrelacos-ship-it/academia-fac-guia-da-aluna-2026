import React from 'react'
import {
  StepCard,
  PhoneIllustration,
  MenuPath,
  CopyPromptBox,
  GPTButton,
  Callout,
  StuckBox,
  Checklist,
  LinkButton,
  FiveSecondTimer,
  ExemploBox,
  type ChecklistValues,
} from './encontro4Shared'
import {
  IlustracaoFacebookPagina,
  IlustracaoCriarPaginaPC,
  IlustracaoBotaoWhatsappPagina,
  IlustracaoConversaChegando,
  IlustracaoMenuContaProfissional,
  IlustracaoMudarParaProfissional,
  IlustracaoAnatomiaPerfil,
  IlustracaoFotoENome,
  IlustracaoBio,
  IlustracaoLinkWhatsapp,
} from './encontro4IlustracoesA'
import {
  IlustracaoDestaques,
  IlustracaoPostsFixados,
  IlustracaoPerfilComercial,
  IlustracaoSaudacao,
  IlustracaoRespostasRapidas,
  IlustracaoEtiquetas,
} from './encontro4IlustracoesB'
import {
  IlustracaoMesaAntesDeComecar,
  IlustracaoIaTrabalhaParaVoce,
  IlustracaoPonteCentralDeContas,
  IlustracaoWhatsappComumVsBusiness,
  IlustracaoMigracaoNumeroWhatsApp,
  IlustracaoCronometroTresBaloes,
} from './encontro4IlustracoesNovas'
import {
  GPT_BIO_MANIFESTO,
  GPT_ARQUITETA_VITRINE,
  GPT_ROTEIRISTA_WHATSAPP,
  PROMPT_BIO_MANIFESTO,
  PROMPT_ARQUITETA_VITRINE,
  PROMPT_ROTEIRISTA_WHATSAPP,
  EXEMPLOS_BIOS_INSPIRACAO,
  type ExemploBioDef,
} from '../../config/encontro4Content'

export const ENCONTRO4_STORAGE_KEY = 'academia-fac:encontro4-checklists'

// ─────────────────────────────────────────────────────────────
// Etapas
// ─────────────────────────────────────────────────────────────
export interface EtapaDef {
  id: string
  numero: string
  titulo: string
  tempo?: string
}

export const ETAPAS_ENCONTRO_4: EtapaDef[] = [
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
// Checklists
// ─────────────────────────────────────────────────────────────
export const CHECKLIST_ETAPA_0 = [
  { id: 'e0-1', texto: 'Meu Manifesto e minha PVU copiados no bloco de notas do celular' },
  { id: 'e0-2', texto: 'Celular com Instagram e WhatsApp atualizados na loja de aplicativos' },
  {
    id: 'e0-3',
    texto: 'Computador com o ChatGPT aberto (a conta gratuita funciona, a paga funciona melhor)',
  },
  { id: 'e0-4', texto: 'Senhas do Instagram e do Facebook, se já tiver conta' },
  { id: 'e0-5', texto: 'Meu número de CRP' },
  { id: 'e0-6', texto: 'O número de celular que vou usar com pacientes' },
  { id: 'e0-7', texto: 'Uma foto minha com o rosto visível, fundo limpo e luz natural' },
]

export const CHECKLIST_ETAPA_2 = [
  { id: 'e2-1', texto: 'Perfil pessoal com autenticação de dois fatores' },
  { id: 'e2-2', texto: 'Página criada com nome, categoria e bio' },
  { id: 'e2-3', texto: 'Foto de perfil e capa' },
  { id: 'e2-4', texto: 'Contato preenchido' },
  { id: 'e2-5', texto: 'Botão de WhatsApp ativo' },
]

export const CHECKLIST_ETAPA_3 = [
  { id: 'e3-1', texto: 'Conta profissional, categoria Psicólogo' },
  { id: 'e3-2', texto: 'Foto com rosto visível' },
  { id: 'e3-3', texto: 'Campo Nome com nome e palavra-chave' },
  { id: 'e3-4', texto: '@ simples de falar' },
  { id: 'e3-5', texto: 'Bio em três linhas com CRP' },
  { id: 'e3-6', texto: 'Primeiro link levando ao WhatsApp' },
  { id: 'e3-7', texto: 'Seis destaques com capas padronizadas' },
  { id: 'e3-8', texto: 'Três posts fixados' },
  { id: 'e3-9', texto: 'Autenticação de dois fatores ativa' },
]

export const CHECKLIST_ETAPA_4 = [
  { id: 'e4-1', texto: 'Página conectada ao Instagram' },
  { id: 'e4-2', texto: 'Facebook adicionado à Central de Contas' },
  { id: 'e4-3', texto: 'Compartilhamento automático decidido' },
]

export const CHECKLIST_ETAPA_5 = [
  { id: 'e5-1', texto: 'WhatsApp Business instalado com o número da clínica' },
  { id: 'e5-2', texto: 'Perfil comercial completo' },
  { id: 'e5-3', texto: 'Mensagem de saudação ativa' },
  { id: 'e5-4', texto: 'Mensagem de ausência ativa, com caminho para emergências' },
  { id: 'e5-5', texto: 'Pelo menos 3 respostas rápidas' },
  { id: 'e5-6', texto: 'Quatro etiquetas criadas' },
  { id: 'e5-7', texto: 'Link do WhatsApp atualizado no Instagram e na Página' },
]

export const TODOS_CHECKLISTS: Record<string, { id: string }[]> = {
  'etapa-0': CHECKLIST_ETAPA_0,
  'etapa-2': CHECKLIST_ETAPA_2,
  'etapa-3': CHECKLIST_ETAPA_3,
  'etapa-4': CHECKLIST_ETAPA_4,
  'etapa-5': CHECKLIST_ETAPA_5,
}

export const TOTAL_ITENS_CHECKLIST =
  CHECKLIST_ETAPA_0.length +
  CHECKLIST_ETAPA_2.length +
  CHECKLIST_ETAPA_3.length +
  CHECKLIST_ETAPA_4.length +
  CHECKLIST_ETAPA_5.length

const carregarChecklists = (): Record<string, ChecklistValues> => {
  try {
    const bruto = localStorage.getItem(ENCONTRO4_STORAGE_KEY)
    return bruto ? (JSON.parse(bruto) as Record<string, ChecklistValues>) : {}
  } catch {
    return {}
  }
}

// ─────────────────────────────────────────────────────────────
// Tabelas de apoio
// ─────────────────────────────────────────────────────────────
const TABELA_ANATOMIA: { item: string; funcao: string; estrategia: string }[] = [
  {
    item: '1 Foto',
    funcao: 'Criar vínculo',
    estrategia: 'Rosto visível ocupando boa parte do círculo, fundo limpo, luz natural',
  },
  {
    item: '2 @usuário',
    funcao: 'Ser lembrada e indicada',
    estrategia: 'Fácil de falar em voz alta, sem números aleatórios nem pontos demais',
  },
  {
    item: '3 Campo Nome',
    funcao: 'Ser encontrada na busca',
    estrategia: 'Nome e o que você faz: Marina Alves | Psicóloga Online',
  },
  {
    item: '4 Categoria',
    funcao: 'Credibilidade imediata',
    estrategia: 'Psicólogo, exibida no perfil',
  },
  {
    item: '5 Bio',
    funcao: 'Fazer a pessoa pensar "é comigo"',
    estrategia: 'Três linhas: para quem e transformação, autoridade, convite',
  },
  {
    item: '6 Links',
    funcao: 'Levar à conversa',
    estrategia: 'O primeiro link é o WhatsApp, só ele aparece direto',
  },
  {
    item: '7 Destaques',
    funcao: 'Responder dúvidas e tirar barreiras',
    estrategia: 'Seis destaques com capas padronizadas',
  },
  {
    item: '8 Posts fixados',
    funcao: 'Contar sua história a quem chega',
    estrategia: 'Três posts na primeira linha',
  },
  {
    item: '9 Grade',
    funcao: 'Mostrar que o perfil está vivo',
    estrategia: '3 a 4 pilares de conteúdo, 2 a 3 posts por semana',
  },
]

const TABELA_DESTAQUES: { destaque: string; pergunta: string }[] = [
  { destaque: 'Comece por aqui', pergunta: 'Isso é para mim?' },
  { destaque: 'Quem sou', pergunta: 'Quem é essa pessoa?' },
  { destaque: 'Como funciona', pergunta: 'É online? Quanto tempo dura? Qual a frequência?' },
  { destaque: 'Dúvidas', pergunta: 'E se eu precisar desmarcar?' },
  { destaque: 'Bastidores', pergunta: 'Ela estuda, se atualiza? (nunca mostrar pacientes)' },
  { destaque: 'Agendar', pergunta: 'Como eu marco?' },
]

const TABELA_POSTS_FIXADOS: { fixado: string; objetivo: string }[] = [
  { fixado: 'Para quem eu sou', objetivo: 'A pessoa se reconhece na dor e na transformação' },
  {
    fixado: 'Como funciona, do contato à primeira sessão',
    objetivo: 'Tira o medo do desconhecido',
  },
  { fixado: 'Quem sou eu', objetivo: 'Formação, caminho e o porquê, com a sua assinatura' },
]

const TABELA_RESPOSTAS_RAPIDAS: { atalho: string; pergunta: string }[] = [
  { atalho: '/comofunciona', pergunta: 'Como funciona a terapia com você' },
  { atalho: '/online', pergunta: 'Se o atendimento é online e por qual plataforma' },
  {
    atalho: '/valores',
    pergunta: 'Valor da sessão e formas de pagamento (aqui pode, é conversa privada)',
  },
  { atalho: '/agendar', pergunta: 'Como marcar a primeira conversa' },
  { atalho: '/primeira', pergunta: 'O que acontece na primeira sessão' },
  { atalho: '/desmarcar', pergunta: 'Política de remarcação e faltas' },
]

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────
interface Encontro4CadernoProps {
  className?: string
}

export const Encontro4Caderno: React.FC<Encontro4CadernoProps> = ({ className }) => {
  const [etapaAtual, setEtapaAtual] = React.useState(0)
  const [checklists, setChecklists] = React.useState<Record<string, ChecklistValues>>(() =>
    carregarChecklists(),
  )

  React.useEffect(() => {
    try {
      localStorage.setItem(ENCONTRO4_STORAGE_KEY, JSON.stringify(checklists))
    } catch {
      // Sem espaço no navegador: a aula continua funcionando,
      // apenas o progresso não fica salvo ao voltar.
    }
  }, [checklists])

  const marcar = (etapaId: string) => (novos: ChecklistValues) =>
    setChecklists((atuais) => ({ ...atuais, [etapaId]: novos }))

  const itensMarcados = Object.values(checklists).reduce(
    (total, valores) => total + Object.values(valores).filter(Boolean).length,
    0,
  )
  const progressoGeral = Math.round((itensMarcados / TOTAL_ITENS_CHECKLIST) * 100)
  const tudoMarcado = itensMarcados >= TOTAL_ITENS_CHECKLIST

  const irPara = (i: number) => {
    setEtapaAtual(i)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const etapa = ETAPAS_ENCONTRO_4[etapaAtual]

  return (
    <div className={className}>
      {/* Topo do Encontro 4 */}
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#ff9b32] mb-2">
          ENCONTRO 4 · CANAIS
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl text-editorial-primary tracking-tight mb-3">
          Seus canais prontos para receber pacientes
        </h2>
        <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed max-w-2xl">
          Facebook, Instagram e WhatsApp Business configurados passo a passo, com a IA escrevendo a
          partir do seu Manifesto.
        </p>
      </div>

      {/* Barra de progresso geral no topo */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-editorial-secondary">
          <span>Progresso da aula</span>
          <span>
            {itensMarcados} de {TOTAL_ITENS_CHECKLIST} itens ({progressoGeral}%)
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-[#27272A] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] transition-all duration-300"
            style={{ width: `${progressoGeral}%` }}
          />
        </div>
      </div>

      {/* Navegação horizontal das etapas (mobile e desktop) */}
      <nav aria-label="Etapas da aula" className="mb-8 overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex items-center gap-2 min-w-max">
          {ETAPAS_ENCONTRO_4.map((e, i) => {
            const ativo = i === etapaAtual
            const checklistId = Object.keys(TODOS_CHECKLISTS).includes(e.id)
            const vals = checklists[e.id] ?? {}
            const totalEtapa = TODOS_CHECKLISTS[e.id]?.length ?? 0
            const feitos = Object.values(vals).filter(Boolean).length
            const concluida = totalEtapa > 0 && feitos === totalEtapa

            return (
              <button
                key={e.id}
                type="button"
                onClick={() => irPara(i)}
                className={`flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-xs font-mono transition-all cursor-pointer ${
                  ativo
                    ? 'bg-[#7c3aed] text-white shadow-2xs'
                    : concluida
                      ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 hover:bg-purple-200'
                      : 'bg-slate-100 dark:bg-[#18181B] text-editorial-secondary hover:bg-slate-200 dark:hover:bg-[#27272A]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    ativo
                      ? 'bg-white/20 text-white'
                      : concluida
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-[#27272A] text-editorial-primary'
                  }`}
                >
                  {concluida && !ativo ? '✓' : e.numero}
                </span>
                <span className="font-sans font-medium">{e.titulo}</span>
                {e.tempo && <span className="opacity-70 text-[10px]">({e.tempo})</span>}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Conteúdo da etapa ativa */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8 items-start">
        <div className="rounded-[16px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-5 sm:p-7 shadow-2xs">
          <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-[#18181B]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                Etapa {etapa.numero}
                {etapa.tempo && ` · ${etapa.tempo}`}
              </p>
              <h3 className="font-serif text-xl sm:text-2xl text-editorial-primary tracking-tight mt-1">
                {etapa.titulo}
              </h3>
            </div>
            <span className="font-mono text-xs text-editorial-secondary">
              {etapaAtual + 1} de {ETAPAS_ENCONTRO_4.length}
            </span>
          </div>

          {etapaAtual === 0 && (
            <Etapa0 checklist={checklists['etapa-0'] ?? {}} onChange={marcar('etapa-0')} />
          )}
          {etapaAtual === 1 && <Etapa1 />}
          {etapaAtual === 2 && (
            <Etapa2 checklist={checklists['etapa-2'] ?? {}} onChange={marcar('etapa-2')} />
          )}
          {etapaAtual === 3 && (
            <Etapa3 checklist={checklists['etapa-3'] ?? {}} onChange={marcar('etapa-3')} />
          )}
          {etapaAtual === 4 && (
            <Etapa4 checklist={checklists['etapa-4'] ?? {}} onChange={marcar('etapa-4')} />
          )}
          {etapaAtual === 5 && (
            <Etapa5 checklist={checklists['etapa-5'] ?? {}} onChange={marcar('etapa-5')} />
          )}
          {etapaAtual === 6 && <Etapa6 />}
          {etapaAtual === 7 && (
            <Etapa7
              checklists={checklists}
              progressoGeral={progressoGeral}
              tudoMarcado={tudoMarcado}
              onMarcar={marcar}
            />
          )}

          {/* Botões de avançar e voltar */}
          <div className="flex items-center justify-between gap-3 mt-8 pt-5 border-t border-slate-100 dark:border-[#18181B]">
            <button
              type="button"
              onClick={() => irPara(Math.max(0, etapaAtual - 1))}
              disabled={etapaAtual === 0}
              className="rounded-[8px] border border-slate-200 dark:border-[#27272A] px-3.5 py-2 min-h-[40px] text-xs font-mono font-semibold text-editorial-primary disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={() => irPara(Math.min(ETAPAS_ENCONTRO_4.length - 1, etapaAtual + 1))}
              disabled={etapaAtual === ETAPAS_ENCONTRO_4.length - 1}
              className="rounded-[8px] bg-[#7c3aed] dark:bg-[#C084FC] px-3.5 py-2 min-h-[40px] text-xs font-mono font-semibold text-white dark:text-[#0A0A14] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        </div>

        {/* Índice lateral fixo no desktop */}
        <aside className="hidden md:block">
          <div className="sticky top-24 space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-editorial-secondary mb-3">
              Nesta aula
            </p>
            {ETAPAS_ENCONTRO_4.map((e, i) => {
              const ativo = i === etapaAtual
              const checklistId = Object.keys(TODOS_CHECKLISTS).includes(e.id)
              const vals = checklists[e.id] ?? {}
              const totalEtapa = TODOS_CHECKLISTS[e.id]?.length ?? 0
              const feitos = Object.values(vals).filter(Boolean).length
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => irPara(i)}
                  className={`w-full text-left rounded-[8px] px-3 py-2.5 flex items-center gap-2.5 transition-colors cursor-pointer ${
                    ativo
                      ? 'bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#3f3f46]'
                      : 'border border-transparent hover:bg-slate-50 dark:hover:bg-[#121216]'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                      ativo
                        ? 'bg-[#7c3aed] text-white'
                        : 'bg-slate-100 dark:bg-[#27272A] text-editorial-secondary'
                    }`}
                  >
                    {e.numero}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-xs leading-snug ${ativo ? 'font-semibold text-editorial-primary' : 'text-editorial-secondary'}`}
                    >
                      {e.titulo}
                    </span>
                    {e.tempo && (
                      <span className="block font-mono text-[9px] text-editorial-secondary mt-0.5">
                        {e.tempo}
                      </span>
                    )}
                    {checklistId && totalEtapa > 0 && (
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
// Etapa 0 · Antes de começar
// ─────────────────────────────────────────────────────────────
const Etapa0: React.FC<{ checklist: ChecklistValues; onChange: (v: ChecklistValues) => void }> = ({
  checklist,
  onChange,
}) => (
  <>
    <div className="flex justify-center mb-6">
      <IlustracaoMesaAntesDeComecar />
    </div>
    <div className="space-y-4 text-sm text-editorial-primary leading-relaxed">
      <p>
        Essa aula é mão na massa. Você vai sair dela com o Facebook, o Instagram e o WhatsApp
        prontos para receber pacientes. Separe 1h30 com calma, ou faça uma etapa por dia.
      </p>
    </div>
    <div className="mt-4">
      <p className="font-sans font-semibold text-sm text-editorial-primary mb-3">Tenho em mãos</p>
      <Checklist itens={CHECKLIST_ETAPA_0} valores={checklist} onChange={onChange} />
    </div>
    <div className="mt-5 space-y-3">
      <Callout tipo="dica">
        Se você ainda não tem o Manifesto pronto, tudo bem. A IA consegue trabalhar a partir de três
        frases: quem você atende, qual dor essa pessoa vive e o que muda depois da terapia.
      </Callout>
      <Callout tipo="atencao">
        Um número só para a clínica é o ideal. Se usar o mesmo número pessoal, o WhatsApp Business
        vai substituir o WhatsApp comum nesse número (as conversas são transferidas).
      </Callout>
    </div>
  </>
)

// ─────────────────────────────────────────────────────────────
// Etapa 1 · A IA trabalha para você
// ─────────────────────────────────────────────────────────────
const CARTOES_IA = [
  {
    nome: 'Cartão 1 · Bio do Manifesto',
    entra: 'seu Manifesto e sua PVU.',
    sai: '3 opções de bio, campo Nome, sugestões de @ e o título do link.',
    uso: 'Use na Etapa 3.',
    gpt: GPT_BIO_MANIFESTO,
    anchor: 'prompt-bio-manifesto',
  },
  {
    nome: 'Cartão 2 · Arquiteta da Vitrine',
    entra: 'Manifesto, PVU e seus dados.',
    sai: 'o perfil inteiro do Instagram, item por item, em 4 etapas.',
    uso: 'Use na Etapa 3.',
    gpt: GPT_ARQUITETA_VITRINE,
    anchor: 'prompt-arquiteta-vitrine',
  },
  {
    nome: 'Cartão 3 · Roteirista do WhatsApp',
    entra: 'Manifesto e as perguntas que você mais recebe.',
    sai: 'descrição do perfil comercial, saudação, ausência e respostas rápidas.',
    uso: 'Use na Etapa 5.',
    gpt: GPT_ROTEIRISTA_WHATSAPP,
    anchor: 'prompt-roteirista-whatsapp',
  },
]

const Etapa1: React.FC = () => (
  <>
    <div className="flex justify-center mb-6">
      <IlustracaoIaTrabalhaParaVoce />
    </div>
    <div className="space-y-4 text-sm text-editorial-primary leading-relaxed">
      <p>
        Você não vai escrever do zero. Três assistentes de IA, treinadas com o Método FAC e com as
        regras éticas da profissão, leem o seu Manifesto e devolvem rascunhos prontos. O seu
        trabalho é escolher, ajustar e publicar. A IA rascunha, quem decide é você.
      </p>
    </div>

    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
      {CARTOES_IA.map((card) => (
        <div
          key={card.nome}
          className="rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-2xs"
        >
          <div className="space-y-2">
            <h4 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
              {card.nome}
            </h4>
            <div className="text-xs sm:text-sm text-editorial-secondary leading-relaxed space-y-1.5">
              <p>
                <strong className="text-editorial-primary">Entra:</strong> {card.entra}
              </p>
              <p>
                <strong className="text-editorial-primary">Sai:</strong> {card.sai}
              </p>
              <p className="text-purple-700 dark:text-purple-300 font-medium">{card.uso}</p>
            </div>
          </div>
          <div className="pt-2">
            <GPTButton link={card.gpt} promptAnchorId={card.anchor} />
          </div>
        </div>
      ))}
    </div>

    <div className="mt-6 space-y-3">
      <p className="font-sans font-semibold text-sm text-editorial-primary">Passos numerados:</p>
      <StepCard numero={1}>
        <p>
          Toque em <strong>Abrir no ChatGPT</strong> no cartão da Bio do Manifesto.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>Se o ChatGPT pedir, entre com a sua conta.</p>
      </StepCard>
      <StepCard numero={3}>
        <p>Cole o seu Manifesto e a sua PVU quando a assistente pedir.</p>
      </StepCard>
      <StepCard numero={4}>
        <p>Responda as perguntas, escolha uma das três bios e peça ajustes até gostar.</p>
      </StepCard>
      <StepCard numero={5}>
        <p>Copie a bio escolhida, o campo Nome e o título do link para o bloco de notas.</p>
      </StepCard>
      <StepCard numero={6}>
        <p>
          Repita com a <strong>Arquiteta da Vitrine</strong>. Hoje, faça só a Etapa 1 dela (topo do
          perfil). As outras etapas você faz durante a semana.
        </p>
      </StepCard>
    </div>

    {/* Exemplo de envio sem Manifesto completo e resposta da IA */}
    <div className="mt-6 space-y-3">
      <ExemploBox titulo="Exemplo prático · Se você ainda não tem o Manifesto">
        <p className="text-xs text-editorial-secondary">
          Veja o que você pode colar no ChatGPT caso ainda não tenha o texto completo do Manifesto:
        </p>
        <div className="rounded-[10px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200 dark:border-[#27272A] p-3 text-xs sm:text-sm font-mono leading-relaxed space-y-1">
          <p className="text-purple-700 dark:text-purple-300 font-semibold text-[11px] uppercase tracking-wider">
            O que você cola (as três frases da Marina):
          </p>
          <p className="text-editorial-primary">
            "1. Quem atendo: mulheres adultas que acumulam trabalho, casa e família e se sentem no
            limite da exaustão.
          </p>
          <p className="text-editorial-primary">
            2. Dor principal: sensação de nunca conseguir descansar a mente, culpa por parar e
            dificuldade de dizer não.
          </p>
          <p className="text-editorial-primary">
            3. O que muda depois da terapia: aprender a colocar limites sem culpa, organizar a
            rotina com espaço para si e recuperar a leveza."
          </p>
        </div>

        <div className="rounded-[10px] bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/40 p-3 text-xs sm:text-sm leading-relaxed space-y-1">
          <p className="text-purple-700 dark:text-purple-300 font-semibold text-[11px] uppercase tracking-wider font-mono">
            Exemplo de resposta curta da assistente:
          </p>
          <p className="text-editorial-primary">
            <strong>Opção de Bio gerada:</strong>
            <br />
            Ajudo mulheres exaustas a voltarem a caber na própria vida
            <br />
            Psicóloga Clínica · CRP 06/000000 · Psicoterapia Online
            <br />
            Agende sua primeira conversa 👇
          </p>
          <p className="text-editorial-secondary text-xs pt-1">
            <strong>Campo Nome sugerido:</strong> Marina Alves | Psicóloga Ansiedade e Exaustão
          </p>
        </div>
      </ExemploBox>
    </div>

    <div className="mt-6">
      <StuckBox
        solucoes={[
          'O link do GPT não abriu: use o link "Prefere copiar e colar?" e cole o prompt numa conversa nova do ChatGPT.',
          'A resposta veio muito longa: escreva "resuma em tópicos curtos".',
          'A bio passou de 150 caracteres: escreva "reduza para até 150 caracteres e mostre a contagem".',
        ]}
      />
    </div>
  </>
)

// ─────────────────────────────────────────────────────────────
// Etapa 2 · Facebook
// ─────────────────────────────────────────────────────────────
const Etapa2: React.FC<{ checklist: ChecklistValues; onChange: (v: ChecklistValues) => void }> = ({
  checklist,
  onChange,
}) => (
  <>
    <div className="flex justify-center mb-6">
      <IlustracaoFacebookPagina />
    </div>
    <div className="space-y-4 text-sm text-editorial-primary leading-relaxed">
      <p>
        No Facebook existem duas coisas diferentes. O perfil pessoal é quem administra, e pode
        continuar privado. A Página é a sua vitrine profissional, é ela que o paciente vê. Você
        precisa das duas: o perfil para administrar a Página.
      </p>
    </div>
    <div className="mt-4">
      <Callout tipo="dica">
        A Página conectada ao Instagram destrava a Central de Contas, o compartilhamento automático
        de posts e, mais para frente, o impulsionamento e os anúncios. Mesmo que você quase não use
        o Facebook, vale ter a Página pronta.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        2.1 · Criar o perfil pessoal (só se ainda não tiver)
      </h4>
      <StepCard numero={1}>
        <p>
          Acesse <strong>facebook.com</strong> ou baixe o app do Facebook.
        </p>
        <LinkButton href="https://www.facebook.com">Abrir o Facebook</LinkButton>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Toque em <strong>Criar nova conta</strong>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Informe seu nome real, data de nascimento e celular ou e-mail. O Facebook exige nome real
          no perfil pessoal.
        </p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          Crie uma senha forte e anote num lugar seguro. O navegador do celular pode guardar essa
          senha para você.
        </p>
      </StepCard>
      <StepCard numero={5}>
        <p>Confirme o código que chegar por SMS ou e-mail.</p>
      </StepCard>
      <Callout tipo="atencao">
        Segurança: ative a autenticação de dois fatores no perfil pessoal. Se você perder o perfil
        pessoal, perde o acesso à Página. O caminho é: Configurações › Central de Contas › Senha e
        segurança › Autenticação de dois fatores.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        2.2 · Criar a Página profissional
      </h4>
      <div className="flex justify-center py-2">
        <IlustracaoCriarPaginaPC />
      </div>
      <p className="text-sm text-editorial-primary leading-relaxed">
        Dica prática: criar a Página pelo computador é bem mais fácil do que pelo celular. Se puder,
        abra o Facebook no computador para esta etapa.
      </p>
      <StepCard numero={1}>
        <p>
          No celular: toque na sua foto de perfil ou no menu (três risquinhos) e depois em{' '}
          <strong>Páginas</strong>. Toque em <strong>+ Criar</strong> e depois em{' '}
          <strong>Começar</strong>.
        </p>
        <p className="mt-1 text-editorial-secondary">
          No computador: no menu da esquerda, clique em <strong>Páginas</strong> e depois em{' '}
          <strong>+ Criar nova Página</strong>.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          <strong>Nome da Página</strong>: use o seu nome profissional seguido da sua especialidade.
          Exemplo: <em>Marina Alves | Psicóloga</em>. Não use apenas o primeiro nome, e não invente
          um nome fantasia se você atende como pessoa física.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          <strong>Categoria</strong>: digite <em>Psicólogo</em> ou <em>Saúde mental</em> e selecione
          a opção que aparecer.
        </p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          <strong>Biografia</strong>: uma frase curta sobre o que você faz. Exemplo:{' '}
          <em>Psicoterapia online para mulheres adultas. CRP 06/000000.</em>
        </p>
      </StepCard>
      <StepCard numero={5}>
        <p>
          Toque em <strong>Criar Página</strong>.
        </p>
      </StepCard>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">2.3 · Foto de perfil e capa</h4>
      <StepCard numero={1}>
        <p>
          <strong>Foto de perfil</strong>: a mesma foto que você vai usar no Instagram e no
          WhatsApp. Rosto visível, fundo limpo, boa iluminação, transmitindo acolhimento. Evite foto
          de corpo inteiro (fica pequena demais no celular) e foto com óculos escuros ou outras
          pessoas.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          <strong>Foto de capa</strong>: uma imagem horizontal simples. Pode ser uma foto do seu
          espaço de atendimento, uma imagem abstrata com as cores da sua marca ou um fundo neutro
          com uma frase do seu Manifesto. O tamanho ideal é 820 por 312 pixels. Se não tiver agora,
          pode colocar depois.
        </p>
      </StepCard>

      <ExemploBox titulo="Exemplo · Frases de posicionamento para a foto de capa">
        <p className="text-xs text-editorial-secondary">
          Se você optar por uma capa com fundo neutro e texto, use uma frase curta e acolhedora:
        </p>
        <div className="rounded-[10px] bg-slate-50 dark:bg-[#18181b] p-3 text-xs sm:text-sm text-editorial-primary space-y-1.5 font-medium">
          <p>• "Espaço de escuta, acolhimento e reconstrução para mulheres."</p>
          <p>• "Cuidar de você não é egoísmo, é ponto de partida."</p>
          <p>• "Psicoterapia online com presença, respeito ao seu ritmo e ética clínica."</p>
        </div>
      </ExemploBox>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">2.4 · Informações de contato</h4>
      <StepCard numero={1}>
        <p>
          Em <strong>Contato</strong>, adicione o número do seu WhatsApp de atendimento e o seu
          e-mail profissional.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Em <strong>Localização</strong>: se você atende apenas online, deixe o endereço em branco
          e marque a opção <em>Sem endereço físico</em>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Em <strong>Horário de funcionamento</strong>: marque os dias e horários em que você
          costuma responder mensagens.
        </p>
      </StepCard>

      <ExemploBox titulo="Exemplo · Preenchimento dos dados de contato da Página">
        <div className="space-y-1.5 text-xs sm:text-sm">
          <p>
            <strong>WhatsApp:</strong> (11) 90000-0000 (número exclusivo da clínica)
          </p>
          <p>
            <strong>E-mail:</strong> contato@marinaalvespsicologia.com.br
          </p>
          <p>
            <strong>Localização:</strong> Sem endereço físico selecionado (Atendimento online em
            todo o Brasil)
          </p>
          <p>
            <strong>Horário:</strong> Segunda a sexta, das 8h às 19h
          </p>
        </div>
      </ExemploBox>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        2.5 · Conectar o botão de WhatsApp à Página
      </h4>
      <div className="flex justify-center py-2">
        <IlustracaoBotaoWhatsappPagina />
      </div>
      <p className="text-sm text-editorial-primary leading-relaxed">
        Esse botão é o que faz a pessoa que visitou a sua Página falar direto com você no WhatsApp
        com um toque.
      </p>
      <StepCard numero={1}>
        <p>
          Na sua Página, procure o botão <strong>Adicionar botão de ação</strong> (ou{' '}
          <strong>Editar botão</strong>).
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Escolha a opção <strong>Enviar mensagem pelo WhatsApp</strong>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Digite o número do seu WhatsApp de atendimento com o DDD. O Facebook vai enviar um código
          de confirmação de 5 dígitos para o seu WhatsApp.
        </p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          Digite o código na tela do Facebook para confirmar. Pronto, o botão verde do WhatsApp
          agora aparece no topo da sua Página.
        </p>
      </StepCard>
    </div>

    <div className="mt-6">
      <StuckBox
        solucoes={[
          "Não acho a opção de criar Página: no app do Facebook, toque no menu (três risquinhos) › role até 'Todas as ferramentas' › Páginas › Criar.",
          'O código do WhatsApp não chega: confira se o número foi digitado com o DDD correto (sem o zero na frente). Se ainda não chegar, aguarde 60 segundos e peça para reenviar por SMS.',
          'O Facebook diz que o nome não é permitido: evite usar termos genéricos sozinhos como apenas "Psicologia". Use seu nome real junto: "Nome Sobrenome | Psicologia".',
        ]}
      />
    </div>

    <div className="mt-6">
      <p className="font-sans font-semibold text-sm text-editorial-primary mb-3">
        Checklist da Etapa 2
      </p>
      <Checklist itens={CHECKLIST_ETAPA_2} valores={checklist} onChange={onChange} />
    </div>
  </>
)

// ─────────────────────────────────────────────────────────────
// Etapa 3 · Instagram
// ─────────────────────────────────────────────────────────────
const Etapa3: React.FC<{ checklist: ChecklistValues; onChange: (v: ChecklistValues) => void }> = ({
  checklist,
  onChange,
}) => (
  <>
    <div className="flex justify-center mb-6">
      <IlustracaoConversaChegando />
    </div>
    <div className="space-y-4 text-sm text-editorial-primary leading-relaxed">
      <p>
        O Instagram é a sua vitrine. Quando alguém ouve falar de você, é lá que essa pessoa vai
        olhar primeiro. E ela decide em 5 segundos se fica ou se sai. Nesta etapa, você vai montar
        cada pedaço dessa vitrine usando os textos que a IA preparou.
      </p>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        3.1 · Mudar para conta profissional
      </h4>
      <div className="flex justify-center py-2">
        <IlustracaoMenuContaProfissional />
      </div>
      <div className="py-1">
        <MenuPath passos={['☰', 'Configurações e privacidade', 'Tipo de conta e ferramentas']} />
      </div>
      <StepCard numero={1}>
        <p>No seu perfil do Instagram, toque nos três risquinhos (☰) no canto superior.</p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Role até <strong>Para profissionais</strong> e toque em{' '}
          <strong>Tipo de conta e ferramentas</strong>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Toque em <strong>Mudar para conta profissional</strong> e depois em{' '}
          <strong>Continuar</strong>.
        </p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          Em categoria, busque <strong>Psicólogo</strong> e marque a opção{' '}
          <strong>Exibir no perfil</strong>.
        </p>
      </StepCard>
      <StepCard numero={5}>
        <p>
          Quando perguntar se você é Criador de conteúdo ou Empresa, escolha{' '}
          <strong>Criador de conteúdo</strong> (dá acesso à biblioteca de músicas completa e a todas
          as ferramentas que você precisa).
        </p>
      </StepCard>
      <div className="flex justify-center py-2">
        <IlustracaoMudarParaProfissional />
      </div>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        3.2 · A anatomia do perfil profissional
      </h4>
      <p className="text-sm text-editorial-primary leading-relaxed">
        Antes de editar, veja os 9 elementos que formam a sua vitrine:
      </p>
      <div className="flex justify-center py-2">
        <IlustracaoAnatomiaPerfil />
      </div>

      {/* Cartões no celular */}
      <div className="sm:hidden space-y-2">
        {TABELA_ANATOMIA.map((row) => (
          <div
            key={row.item}
            className="rounded-[10px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-3 shadow-2xs"
          >
            <p className="font-sans font-semibold text-xs text-editorial-primary">{row.item}</p>
            <p className="text-xs text-editorial-secondary mt-1">
              <strong>Função:</strong> {row.funcao}
            </p>
            <p className="text-xs text-editorial-secondary mt-0.5">
              <strong>Estratégia:</strong> {row.estrategia}
            </p>
          </div>
        ))}
      </div>

      {/* Tabela no desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#27272A]">
              <th className="text-left py-2 pr-3 font-sans font-semibold text-editorial-primary">
                Item
              </th>
              <th className="text-left py-2 pr-3 font-sans font-semibold text-editorial-primary">
                Função
              </th>
              <th className="text-left py-2 font-sans font-semibold text-editorial-primary">
                Estratégia
              </th>
            </tr>
          </thead>
          <tbody>
            {TABELA_ANATOMIA.map((row) => (
              <tr key={row.item} className="border-b border-slate-100 dark:border-[#18181B]">
                <td className="py-2 pr-3 font-mono text-editorial-primary align-top whitespace-nowrap">
                  {row.item}
                </td>
                <td className="py-2 pr-3 text-editorial-secondary align-top">{row.funcao}</td>
                <td className="py-2 text-editorial-secondary leading-relaxed">{row.estrategia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.3 · Foto e @usuário</h4>
      <div className="flex justify-center py-2">
        <IlustracaoFotoENome />
      </div>
      <StepCard numero={1}>
        <p>
          Em <strong>Editar perfil</strong>, toque em <strong>Mudar foto</strong> e escolha a foto
          que você separou. Rosto visível ocupando a maior parte do círculo.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          O <strong>@usuário</strong>: se o seu @ atual tem muitos números, pontos ou traços,
          simplifique. O ideal é nome e profissão, fácil de falar numa conversa. Exemplos bons:{' '}
          <em>@marinaalves.psi</em>, <em>@psi.marinaalves</em>, <em>@marinaalvespsicologa</em>.
        </p>
      </StepCard>

      <ExemploBox titulo="Exemplo · Alternativas de @ fáceis de falar em voz alta">
        <p className="text-xs text-editorial-secondary">
          Se o seu nome exato já estiver em uso, veja 3 formatos limpos que funcionam muito bem:
        </p>
        <div className="space-y-1.5 text-xs sm:text-sm">
          <p>
            <strong className="font-mono text-purple-700 dark:text-purple-300">
              @marinaalves.psi
            </strong>
            : simples, direto e sonoro.
          </p>
          <p>
            <strong className="font-mono text-purple-700 dark:text-purple-300">
              @psi.marinaalves
            </strong>
            : destaca a profissão logo no início.
          </p>
          <p>
            <strong className="font-mono text-purple-700 dark:text-purple-300">
              @marinaalvespsicologia
            </strong>
            : opção sem nenhum ponto ou caractere especial.
          </p>
        </div>
      </ExemploBox>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.4 · O campo Nome</h4>
      <p className="text-sm text-editorial-primary leading-relaxed">
        Atenção: o campo <strong>Nome</strong> é diferente do @usuário. Ele é o que o Instagram usa
        na busca. Se você colocar só o seu nome, ninguém que busca por "psicóloga" vai te achar.
        Coloque o seu nome e o que você faz.
      </p>
      <StepCard numero={1}>
        <p>
          Abra a conversa da <strong>Bio do Manifesto</strong> no ChatGPT.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          No Instagram, vá em <strong>Editar perfil</strong>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Em <strong>Nome</strong>, cole o campo Nome que a Bio do Manifesto sugeriu.
        </p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          Em <strong>Nome de usuário</strong>, ajuste o @ se for trocar.
        </p>
      </StepCard>
      <StepCard numero={5}>
        <p>
          Confira se a <strong>Categoria</strong> aparece como Psicólogo.
        </p>
      </StepCard>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.5 · A bio</h4>
      <div className="flex justify-center py-2">
        <IlustracaoBio />
      </div>
      <p className="text-sm text-editorial-primary leading-relaxed">
        São 150 caracteres em três linhas. A linha 1 é a mais importante e não fala de você: fala da
        pessoa que você atende.
      </p>
      <div className="rounded-[12px] bg-slate-50 dark:bg-[#18181b] p-3 text-xs sm:text-sm text-editorial-secondary space-y-1">
        <p>
          <strong className="text-editorial-primary">Linha 1</strong>: Para quem e qual
          transformação
        </p>
        <p>
          <strong className="text-editorial-primary">Linha 2</strong>: Autoridade: formação,
          abordagem, CRP, formato
        </p>
        <p>
          <strong className="text-editorial-primary">Linha 3</strong>: Convite para o próximo passo
          👇
        </p>
      </div>
      <div className="rounded-[14px] border border-purple-200/90 dark:border-[#3f3f46] bg-white dark:bg-[#121216] p-4 space-y-2 shadow-2xs">
        <p className="font-mono text-[10px] uppercase tracking-wider text-purple-700 dark:text-purple-300">
          Exemplo de bio
        </p>
        <p className="text-sm font-medium text-editorial-primary leading-relaxed">
          Ajudo mulheres exaustas a voltarem a caber na própria vida
          <br />
          Psicóloga · Psicanálise · CRP 06/000000 · Online
          <br />
          Agende sua conversa inicial 👇
        </p>
      </div>

      <ExemploBox titulo="Exemplo 2 · Segunda opção de bio completa">
        <p className="text-xs text-editorial-secondary">
          Outra combinação gerada pela IA, com foco mais direto no acolhimento de crises e
          ansiedade:
        </p>
        <div className="rounded-[10px] bg-slate-50 dark:bg-[#18181b] p-3 text-xs sm:text-sm leading-relaxed font-medium text-editorial-primary space-y-0.5">
          <p>Para quem sente que carrega o peso do mundo nas costas</p>
          <p>Psicóloga Clínica · TCC e Terapia Focada na Compaixão · CRP 06/000000</p>
          <p>Atendimento online para todo o Brasil 👇</p>
        </div>
      </ExemploBox>

      <ExemploBox titulo="Mais exemplos de bios prontas para inspiração">
        <p className="text-xs text-editorial-secondary">
          Veja variações para diferentes públicos e abordagens clínicas. Cada uma segue a regra de 3
          linhas do método (quem e transformação, autoridade, convite) e fica dentro do limite de
          150 caracteres:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {EXEMPLOS_BIOS_INSPIRACAO.map((bio, index) => (
            <div
              key={bio.id}
              className="rounded-[12px] border border-purple-100 dark:border-[#27272A] bg-purple-50/40 dark:bg-[#18181b]/70 p-3 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                    Opção {index + 1} · {bio.foco}
                  </span>
                  <span className="font-mono text-[10px] text-editorial-secondary">
                    {bio.linha1.length + bio.linha2.length + bio.linha3.length + 2} carac.
                  </span>
                </div>
                <p className="text-[11px] text-editorial-secondary font-medium">
                  {bio.publicoAbordagem}
                </p>
              </div>
              <div className="rounded-[8px] bg-white dark:bg-[#0c0914] border border-purple-200/70 dark:border-[#27272A] p-2.5 text-xs font-mono leading-relaxed text-editorial-primary space-y-0.5">
                <p>{bio.linha1}</p>
                <p>{bio.linha2}</p>
                <p>{bio.linha3}</p>
              </div>
              <p className="text-[11px] text-editorial-secondary leading-normal">
                {bio.explicacao}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-editorial-secondary pt-1">
          💡 <strong>Dica ética:</strong> note que nenhuma bio traz preço, promessa mágica de cura
          ou frases do tipo "dobre seu engajamento". O tom é acolhedor, profissional e claro.
        </p>
      </ExemploBox>
      <StepCard numero={1}>
        <p>
          Em <strong>Editar perfil</strong>, toque em <strong>Bio</strong>.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>Cole a bio escolhida na Bio do Manifesto.</p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Confira as quebras de linha e toque em <strong>Concluir</strong>.
        </p>
      </StepCard>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.6 · O link para o WhatsApp</h4>
      <div className="flex justify-center py-2">
        <IlustracaoLinkWhatsapp />
      </div>
      <StepCard numero={1}>
        <p>
          Em <strong>Editar perfil</strong>, toque em <strong>Links</strong>.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Toque em <strong>Adicionar link externo</strong>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Em <strong>URL</strong>, cole o seu link de WhatsApp neste formato: https://wa.me/ seguido
          de 55, do DDD e do número, tudo junto. Exemplo: https://wa.me/5511999999999 (sem espaços,
          parênteses ou traços).
        </p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          Em <strong>Título</strong>, escreva algo como "Agende sua conversa inicial".
        </p>
      </StepCard>
      <StepCard numero={5}>
        <p>
          Toque em <strong>Concluir</strong>.
        </p>
      </StepCard>
      <Callout tipo="dica">
        O Instagram aceita até 5 links, mas só o primeiro aparece direto no perfil. Os outros ficam
        num menu. Por isso, o primeiro é sempre o caminho para conversar com você. Para reordenar,
        toque nos três pontinhos ao lado do link e arraste.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.7 · Os seis destaques</h4>
      <div className="flex justify-center py-2">
        <IlustracaoDestaques />
      </div>

      <ExemploBox titulo="Exemplo · Roteiro de 3 stories para o destaque 'Comece por aqui'">
        <p className="text-xs text-editorial-secondary">
          Veja uma sugestão simples para gravar ou postar em cards de texto:
        </p>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="rounded-[8px] bg-slate-50 dark:bg-[#18181b] p-2.5 space-y-1">
            <p className="font-semibold text-purple-700 dark:text-purple-300 text-xs">
              Story 1 (Apresentação pessoal e acolhimento):
            </p>
            <p className="text-editorial-primary italic">
              "Olá, seja muito bem-vinda ao meu perfil. Sou a Marina Alves, psicóloga clínica (CRP
              06/000000), e este espaço foi criado com muito carinho para compartilhar reflexões
              sobre saúde mental, sobrecarga e limites."
            </p>
          </div>
          <div className="rounded-[8px] bg-slate-50 dark:bg-[#18181b] p-2.5 space-y-1">
            <p className="font-semibold text-purple-700 dark:text-purple-300 text-xs">
              Story 2 (Para quem e como funciona):
            </p>
            <p className="text-editorial-primary italic">
              "Aqui atendo principalmente mulheres adultas que se sentem no limite do cansaço mental
              e buscam um lugar seguro para se escutarem. As consultas acontecem 100% online, por
              videochamada semanal sigilosa, no conforto da sua casa."
            </p>
          </div>
          <div className="rounded-[8px] bg-slate-50 dark:bg-[#18181b] p-2.5 space-y-1">
            <p className="font-semibold text-purple-700 dark:text-purple-300 text-xs">
              Story 3 (Chamada para ação acolhedora):
            </p>
            <p className="text-editorial-primary italic">
              "Se você sente que este é o momento de cuidar de você, o link da minha bio leva direto
              para o meu WhatsApp de atendimento. Me mande um 'oi' e conversamos com calma!"
            </p>
          </div>
        </div>
      </ExemploBox>

      {/* Cartões no celular */}
      <div className="sm:hidden space-y-2">
        {TABELA_DESTAQUES.map((row) => (
          <div
            key={row.destaque}
            className="rounded-[10px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-2.5 shadow-2xs"
          >
            <p className="font-sans font-semibold text-xs text-editorial-primary">{row.destaque}</p>
            <p className="text-xs text-editorial-secondary mt-0.5">"{row.pergunta}"</p>
          </div>
        ))}
      </div>

      {/* Tabela no desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#27272A]">
              <th className="text-left py-2 pr-3 font-sans font-semibold text-editorial-primary">
                Destaque
              </th>
              <th className="text-left py-2 font-sans font-semibold text-editorial-primary">
                A pergunta que ele responde
              </th>
            </tr>
          </thead>
          <tbody>
            {TABELA_DESTAQUES.map((row) => (
              <tr key={row.destaque} className="border-b border-slate-100 dark:border-[#18181B]">
                <td className="py-2 pr-3 font-mono text-editorial-primary align-top whitespace-nowrap">
                  {row.destaque}
                </td>
                <td className="py-2 text-editorial-secondary leading-relaxed">{row.pergunta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StepCard numero={1}>
        <p>
          Peça à <strong>Arquiteta da Vitrine</strong> a Etapa 2: ela gera o roteiro exato de
          stories para cada destaque.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>Grave ou escreva os stories no Instagram e publique.</p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Abra o story publicado, toque em <strong>Destacar</strong> (coração no canto inferior), dê
          o nome do destaque e salve.
        </p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          Capas: use uma cor sólida da sua paleta com o título legível, ou uma foto sua em cada
          capa. Evite ícones genéricos (aqueles desenhos de florzinha ou xícara que todo mundo usa).
        </p>
      </StepCard>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.8 · Os três posts fixados</h4>
      <div className="flex justify-center py-2">
        <IlustracaoPostsFixados />
      </div>

      <ExemploBox titulo="Exemplo · Legenda completa para o Post Fixado 2 ('Para quem eu sou')">
        <p className="text-xs text-editorial-secondary">
          Veja como a Marina escreve para acolher quem se identifica com seu trabalho:
        </p>
        <div className="rounded-[10px] bg-slate-50 dark:bg-[#18181b] p-3 text-xs sm:text-sm text-editorial-primary leading-relaxed space-y-2">
          <p className="font-semibold text-purple-700 dark:text-purple-300 text-xs">
            Título no carrossel ou imagem: "Para quem é o meu trabalho na psicoterapia?"
          </p>
          <p>
            Você sente que cuida de tudo e de todos, mas sobra quase nada de você para você mesma no
            final do dia?
          </p>
          <p>
            Meu trabalho na clínica online é dedicado a acolher mulheres que carregam uma
            autocobrança implacável, convivem com ansiedade frequente e sentem culpa profunda sempre
            que precisam dizer "não".
          </p>
          <p>
            Na psicoterapia, criamos um espaço semanal de pausa e presença, onde você pode falar sem
            medo de julgamentos, elaborar suas dores e reencontrar seu ritmo com acolhimento e
            respeito à sua história.
          </p>
          <p>
            Atendimento online para todo o Brasil. CRP 06/000000.
            <br />
            Se você se identificou, o link no perfil leva diretamente ao meu WhatsApp para
            conversarmos.
          </p>
        </div>
      </ExemploBox>

      {/* Cartões no celular */}
      <div className="sm:hidden space-y-2">
        {TABELA_POSTS_FIXADOS.map((row) => (
          <div
            key={row.fixado}
            className="rounded-[10px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-2.5 shadow-2xs"
          >
            <p className="font-sans font-semibold text-xs text-editorial-primary">{row.fixado}</p>
            <p className="text-xs text-editorial-secondary mt-0.5">{row.objetivo}</p>
          </div>
        ))}
      </div>

      {/* Tabela no desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#27272A]">
              <th className="text-left py-2 pr-3 font-sans font-semibold text-editorial-primary">
                Post fixado
              </th>
              <th className="text-left py-2 font-sans font-semibold text-editorial-primary">
                Objetivo
              </th>
            </tr>
          </thead>
          <tbody>
            {TABELA_POSTS_FIXADOS.map((row) => (
              <tr key={row.fixado} className="border-b border-slate-100 dark:border-[#18181B]">
                <td className="py-2 pr-3 font-mono text-editorial-primary align-top">
                  {row.fixado}
                </td>
                <td className="py-2 text-editorial-secondary leading-relaxed">{row.objetivo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StepCard numero={1}>
        <p>
          Peça à <strong>Arquiteta da Vitrine</strong> a Etapa 3: ela escreve título, estrutura e
          legenda dos três posts.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>Publique o post.</p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Abra o post no seu perfil e toque nos <strong>três pontinhos (⋯)</strong>.
        </p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          Toque em <strong>Fixar no seu perfil</strong>.
        </p>
      </StepCard>
      <StepCard numero={5}>
        <p>Repita até três posts.</p>
      </StepCard>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.9 · A grade</h4>
      <p className="text-sm text-editorial-primary leading-relaxed">
        Abaixo dos fixados, a grade mostra se o perfil está vivo. Não precisa postar todo dia. Peça
        à Arquiteta da Vitrine a Etapa 4: ela define de 3 a 4 pilares de conteúdo a partir do seu
        Manifesto e sugere 9 ideias de posts. Dois a três posts por semana, bem pensados, sustentam.
      </p>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.10 · Segurança</h4>
      <div className="py-1">
        <MenuPath
          passos={['☰', 'Central de Contas', 'Senha e segurança', 'Autenticação de dois fatores']}
        />
      </div>
      <StepCard numero={1}>
        <p>
          Ative a autenticação de dois fatores por aplicativo ou SMS. Perder o perfil é perder a
          vitrine.
        </p>
      </StepCard>
      <Callout tipo="etica">
        Nada de depoimento, print de agradecimento, foto de paciente, promessa de cura ou preço no
        perfil. Mostre o seu processo, não o paciente. Confira sempre a redação vigente das
        resoluções do CFP.
      </Callout>
    </div>

    <div className="mt-6">
      <StuckBox
        solucoes={[
          "Não acho 'Tipo de conta e ferramentas': atualize o Instagram na loja de aplicativos. Em algumas versões, o caminho é ☰ › Configurações e privacidade › Tipo de conta e ferramentas.",
          'Não aparece a opção de fixar post: confira se a conta já é profissional.',
          'O link do WhatsApp não abre: confira se tem 55, o DDD e o número, tudo junto, sem o zero do DDD.',
        ]}
      />
    </div>

    <div className="mt-6">
      <p className="font-sans font-semibold text-sm text-editorial-primary mb-3">
        Checklist da Etapa 3
      </p>
      <Checklist itens={CHECKLIST_ETAPA_3} valores={checklist} onChange={onChange} />
    </div>
  </>
)

// ─────────────────────────────────────────────────────────────
// Etapa 4 · Conectar Instagram e Facebook
// ─────────────────────────────────────────────────────────────
const Etapa4: React.FC<{ checklist: ChecklistValues; onChange: (v: ChecklistValues) => void }> = ({
  checklist,
  onChange,
}) => (
  <>
    <div className="flex justify-center mb-6">
      <IlustracaoPonteCentralDeContas />
    </div>

    <div className="space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        4.1 · Conectar a Página ao Instagram
      </h4>
      <StepCard numero={1}>
        <p>
          No Instagram, vá ao perfil e toque em <strong>Editar perfil</strong>.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Role até <strong>Informações do perfil</strong> (ou{' '}
          <strong>Informações públicas da empresa</strong>) e toque em <strong>Página</strong>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Toque em <strong>Conectar ou criar</strong> e entre com o seu Facebook.
        </p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          Escolha a sua Página (ou <strong>Criar Página do Facebook</strong>, se ainda não criou) e
          toque em <strong>Concluir</strong>.
        </p>
      </StepCard>
    </div>

    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-serif text-lg text-editorial-primary">4.2 · Central de Contas</h4>
        <LinkButton href="https://accountscenter.instagram.com">
          Abrir a Central de Contas
        </LinkButton>
      </div>
      <StepCard numero={1}>
        <p>
          No Instagram, toque em <strong>☰</strong> e depois em <strong>Central de Contas</strong>.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Toque em <strong>Contas</strong> e depois em <strong>Adicionar contas</strong>. Entre com
          o Facebook.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Em <strong>Compartilhamento entre perfis</strong>, ative o compartilhamento automático de
          posts e stories na Página, se quiser que ela se alimente sozinha.
        </p>
      </StepCard>
      <Callout tipo="atencao">
        Cada Instagram se conecta a uma única Página, e a Central de Contas aceita um único
        Facebook.
      </Callout>

      <ExemploBox titulo="Exemplo · Tela da Central de Contas com compartilhamento ativo">
        <p className="text-xs text-editorial-secondary">
          Veja como fica a tela de confirmação quando a integração é concluída com sucesso:
        </p>
        <div className="rounded-[10px] bg-slate-50 dark:bg-[#18181b] p-3 text-xs sm:text-sm space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272A] pb-2">
            <span className="text-editorial-secondary">Compartilhar de:</span>
            <span className="font-semibold text-editorial-primary font-mono">
              @marinaalves.psi (Instagram)
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272A] pb-2">
            <span className="text-editorial-secondary">Compartilhar para:</span>
            <span className="font-semibold text-editorial-primary font-mono">
              Marina Alves | Psicóloga (Página Facebook)
            </span>
          </div>
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span>Seus stories do Instagram</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
                ATIVADO
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Suas publicações do Instagram</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
                ATIVADO
              </span>
            </div>
          </div>
          <p className="text-[11px] text-editorial-secondary pt-1 italic">
            Assim, toda vez que Marina publicar um carrossel ou story no Instagram, ele aparecerá
            automaticamente na Página do Facebook sem retrabalho.
          </p>
        </div>
      </ExemploBox>
    </div>

    <div className="mt-6">
      <p className="font-sans font-semibold text-sm text-editorial-primary mb-3">
        Checklist da Etapa 4
      </p>
      <Checklist itens={CHECKLIST_ETAPA_4} valores={checklist} onChange={onChange} />
    </div>
  </>
)

// ─────────────────────────────────────────────────────────────
// Etapa 5 · WhatsApp Business
// ─────────────────────────────────────────────────────────────
const Etapa5: React.FC<{ checklist: ChecklistValues; onChange: (v: ChecklistValues) => void }> = ({
  checklist,
  onChange,
}) => (
  <>
    <div className="flex justify-center mb-6">
      <IlustracaoWhatsappComumVsBusiness />
    </div>
    <div className="space-y-4 text-sm text-editorial-primary leading-relaxed">
      <p>
        O WhatsApp é a porta. É onde o interesse vira agendamento. O WhatsApp Business é gratuito,
        da própria Meta, e tem o que o WhatsApp comum não tem: perfil comercial, mensagem de
        saudação, mensagem de ausência, respostas rápidas e etiquetas. Ele trabalha por você mesmo
        quando você está em sessão.
      </p>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        5.1 · Instalar e usar o seu número
      </h4>
      <div className="flex justify-center py-2">
        <IlustracaoMigracaoNumeroWhatsApp />
      </div>
      <StepCard numero={1}>
        <p>
          Baixe o <strong>WhatsApp Business</strong> na App Store ou no Google Play (o ícone tem a
          letra B).
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>Abra e aceite os termos.</p>
      </StepCard>
      <StepCard numero={3}>
        <p>Confirme o número que vai usar com pacientes.</p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          Se esse número já estiver no WhatsApp comum, o app oferece para{' '}
          <strong>transferir</strong> as conversas. Aceite.
        </p>
      </StepCard>
      <StepCard numero={5}>
        <p>Confirme o código que chegar por SMS.</p>
      </StepCard>
      <Callout tipo="atencao">
        O mesmo número não funciona no WhatsApp comum e no Business ao mesmo tempo. Ao migrar, o
        WhatsApp comum deixa de usar esse número. Faça o backup das conversas antes.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">5.2 · Perfil comercial</h4>
      <div className="py-1">
        <MenuPath passos={['Configurações (ou ⋮)', 'Ferramentas comerciais', 'Perfil comercial']} />
      </div>
      <div className="flex justify-center py-2">
        <IlustracaoPerfilComercial />
      </div>
      <StepCard numero={1}>
        <p>
          Abra <strong>Ferramentas comerciais</strong> e toque em <strong>Perfil comercial</strong>.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          <strong>Foto:</strong> a mesma do Instagram.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          <strong>Nome:</strong> o mesmo do campo Nome do Instagram.
        </p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          <strong>Categoria:</strong> busque uma de saúde, como Serviços médicos e de saúde.
        </p>
      </StepCard>
      <StepCard numero={5}>
        <p>
          <strong>Descrição:</strong> cole a descrição que a <strong>Roteirista do WhatsApp</strong>{' '}
          escrever.
        </p>
      </StepCard>
      <StepCard numero={6}>
        <p>
          <strong>Horário de funcionamento:</strong> o seu horário real de resposta.
        </p>
      </StepCard>
      <StepCard numero={7}>
        <p>
          <strong>Endereço:</strong> se atende só online, escreva na descrição "Atendimento online
          para todo o Brasil" e não coloque endereço.
        </p>
      </StepCard>
      <StepCard numero={8}>
        <p>
          <strong>E-mail e site:</strong> o e-mail profissional e o link do Instagram.
        </p>
      </StepCard>

      {/* Cartão da Roteirista do WhatsApp logo abaixo deste subtítulo */}
      <div className="rounded-[14px] border border-purple-200/90 dark:border-[#3f3f46] bg-purple-50/40 dark:bg-[#18181B] p-4 sm:p-5 space-y-2 mt-4">
        <h5 className="font-sans font-semibold text-sm text-editorial-primary">
          Assistente · Roteirista do WhatsApp
        </h5>
        <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed">
          Gere a descrição do perfil, a saudação, a mensagem de ausência e as respostas rápidas
          direto com a assistente do Método FAC.
        </p>
        <div className="pt-2">
          <GPTButton link={GPT_ROTEIRISTA_WHATSAPP} promptAnchorId="prompt-roteirista-whatsapp" />
        </div>
      </div>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">5.3 · Mensagem de saudação</h4>
      <div className="flex justify-center py-2">
        <IlustracaoSaudacao />
      </div>
      <p className="text-sm text-editorial-primary leading-relaxed">
        É a mensagem que chega automaticamente para quem fala com você pela primeira vez (ou depois
        de 14 dias sem conversa).
      </p>
      <StepCard numero={1}>
        <p>
          Em <strong>Ferramentas comerciais</strong>, toque em <strong>Mensagem de saudação</strong>
          .
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Ative <strong>Enviar mensagem de saudação</strong>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>Toque no texto (lápis) e cole a saudação que a Roteirista escreveu.</p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          Em <strong>Destinatários</strong>, escolha <strong>Todos</strong>.
        </p>
      </StepCard>
      <StepCard numero={5}>
        <p>
          Toque em <strong>Salvar</strong>.
        </p>
      </StepCard>
      <div className="rounded-[14px] border border-purple-200/90 dark:border-[#3f3f46] bg-white dark:bg-[#121216] p-4 space-y-2 shadow-2xs">
        <p className="font-mono text-[10px] uppercase tracking-wider text-purple-700 dark:text-purple-300">
          Exemplo em caixa destacada
        </p>
        <p className="text-sm font-medium text-editorial-primary leading-relaxed">
          "Olá! Que bom que você chegou até aqui 💜 Sou a Marina, psicóloga. Me conta, com calma, o
          que te trouxe? Respondo pessoalmente entre um atendimento e outro, geralmente no mesmo
          dia."
        </p>
      </div>

      <ExemploBox titulo="Exemplo 2 · Segunda opção de mensagem de saudação">
        <p className="text-xs text-editorial-secondary">
          Uma alternativa acolhedora e direta com perguntas estruturadas:
        </p>
        <p className="text-xs sm:text-sm font-medium text-editorial-primary leading-relaxed">
          "Olá! Boas-vindas ao meu WhatsApp profissional 💜 Sou a psicóloga Marina Alves (CRP
          06/000000). Que bom ter você aqui! Me conte seu nome e se você já fez terapia antes ou
          gostaria de saber mais sobre horários e como funcionam as sessões online. Respondo assim
          que sair do atendimento atual!"
        </p>
      </ExemploBox>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">5.4 · Mensagem de ausência</h4>
      <p className="text-sm text-editorial-primary leading-relaxed">
        É a mensagem que chega quando você está fora do horário ou em sessão. Ela evita que a pessoa
        ache que foi ignorada.
      </p>
      <StepCard numero={1}>
        <p>
          Em <strong>Ferramentas comerciais</strong>, toque em <strong>Mensagem de ausência</strong>
          .
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Ative <strong>Enviar mensagem de ausência</strong>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>Cole o texto que a Roteirista escreveu.</p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          Em <strong>Horário</strong>, escolha <strong>Fora do horário comercial</strong> (usa o
          horário do perfil comercial) ou <strong>Horário programado</strong>.
        </p>
      </StepCard>
      <StepCard numero={5}>
        <p>
          Toque em <strong>Salvar</strong>.
        </p>
      </StepCard>
      <div className="rounded-[14px] border border-purple-200/90 dark:border-[#3f3f46] bg-white dark:bg-[#121216] p-4 space-y-2 shadow-2xs">
        <p className="font-mono text-[10px] uppercase tracking-wider text-purple-700 dark:text-purple-300">
          Exemplo em caixa destacada
        </p>
        <p className="text-sm font-medium text-editorial-primary leading-relaxed">
          "Oi! Recebi sua mensagem 💜 Neste momento estou em atendimento ou fora do horário.
          Respondo assim que possível, no próximo horário útil. Se for uma emergência, ligue 188
          (CVV) ou 192 (SAMU)."
        </p>
      </div>
      <Callout tipo="etica">
        A mensagem de ausência deve sempre indicar um caminho para emergências, porque quem procura
        psicóloga pode estar em sofrimento intenso. Confirme os números de emergência vigentes na
        sua região.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">5.5 · Respostas rápidas</h4>
      <div className="flex justify-center py-2">
        <IlustracaoRespostasRapidas />
      </div>
      <p className="text-sm text-editorial-primary leading-relaxed">
        São atalhos para as perguntas que você responde todo dia. Você digita "/" na conversa e
        escolhe a resposta pronta. Dá para criar até 50.
      </p>
      <StepCard numero={1}>
        <p>
          Em <strong>Ferramentas comerciais</strong>, toque em <strong>Respostas rápidas</strong>.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Toque em <strong>+</strong> (adicionar).
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Em <strong>Mensagem</strong>, cole o texto da resposta.
        </p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          Em <strong>Atalho</strong>, escreva uma palavra curta, por exemplo comofunciona.
        </p>
      </StepCard>
      <StepCard numero={5}>
        <p>
          Toque em <strong>Salvar</strong>.
        </p>
      </StepCard>
      <StepCard numero={6}>
        <p>
          Para usar: numa conversa, digite <strong>/</strong> e escolha a resposta.
        </p>
      </StepCard>

      {/* Cartões no celular */}
      <div className="sm:hidden space-y-2">
        {TABELA_RESPOSTAS_RAPIDAS.map((row) => (
          <div
            key={row.atalho}
            className="rounded-[10px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-3 shadow-2xs"
          >
            <p className="font-mono font-semibold text-xs text-[#7c3aed] dark:text-[#C084FC]">
              {row.atalho}
            </p>
            <p className="text-xs text-editorial-secondary mt-1">{row.pergunta}</p>
          </div>
        ))}
      </div>

      {/* Tabela no desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#27272A]">
              <th className="text-left py-2 pr-3 font-sans font-semibold text-editorial-primary">
                Atalho
              </th>
              <th className="text-left py-2 font-sans font-semibold text-editorial-primary">
                Para quando a pessoa pergunta
              </th>
            </tr>
          </thead>
          <tbody>
            {TABELA_RESPOSTAS_RAPIDAS.map((row) => (
              <tr key={row.atalho} className="border-b border-slate-100 dark:border-[#18181B]">
                <td className="py-2 pr-3 font-mono text-[#7c3aed] dark:text-[#C084FC] align-top whitespace-nowrap">
                  {row.atalho}
                </td>
                <td className="py-2 text-editorial-secondary leading-relaxed">{row.pergunta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExemploBox titulo="Exemplo · Texto completo da resposta rápida /primeiraconsulta">
        <p className="text-xs text-editorial-secondary">
          Veja como preencher uma resposta rápida extra para explicar a primeira sessão com clareza
          e empatia:
        </p>
        <div className="rounded-[10px] bg-slate-50 dark:bg-[#18181b] p-3 text-xs sm:text-sm space-y-2">
          <p className="font-semibold text-purple-700 dark:text-purple-300">
            Atalho sugerido: <span className="font-mono">/primeiraconsulta</span>
          </p>
          <div className="text-editorial-primary leading-relaxed space-y-1.5 italic">
            <p>
              "Nossa primeira conversa dura 50 minutos e acontece por videochamada pelo Google Meet,
              em um link seguro e exclusivo."
            </p>
            <p>
              "É um momento para eu escutar com calma o que você está vivendo hoje, tirar todas as
              suas dúvidas sobre a terapia e combinarmos juntos os próximos passos, sem qualquer
              compromisso de continuar se não fizer sentido para você."
            </p>
            <p>
              "Você gostaria que eu te enviasse os horários disponíveis desta semana para
              escolhermos o seu?"
            </p>
          </div>
        </div>
      </ExemploBox>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">5.6 · Etiquetas</h4>
      <div className="flex justify-center py-2">
        <IlustracaoEtiquetas />
      </div>
      <p className="text-sm text-editorial-primary leading-relaxed">
        As etiquetas organizam as conversas por etapa, para nenhum contato ficar esquecido.
      </p>
      <StepCard numero={1}>
        <p>Na lista de conversas, segure o dedo sobre uma conversa.</p>
      </StepCard>
      <StepCard numero={2}>
        <p>Toque no ícone de etiqueta e escolha ou crie uma.</p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Crie estas quatro: <strong>Novo contato</strong>, <strong>Aguardando resposta</strong>,{' '}
          <strong>Agendado</strong>, <strong>Paciente</strong>.
        </p>
      </StepCard>
      <Callout tipo="etica">
        Etiqueta é para organizar o fluxo, nunca para registrar informação clínica. Dados clínicos
        ficam no prontuário, não no WhatsApp.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">5.7 · O seu link curto</h4>
      <StepCard numero={1}>
        <p>
          Em <strong>Ferramentas comerciais</strong>, procure <strong>Link curto</strong> (ou{' '}
          <strong>Compartilhar link</strong>).
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>Copie o link. Ele pode substituir o link wa.me no Instagram e na Página.</p>
      </StepCard>
    </div>

    <div className="mt-6">
      <StuckBox
        solucoes={[
          'Não acho "Ferramentas comerciais": no Android, toque nos três pontinhos (⋮) e em Ferramentas comerciais. No iPhone, toque em Configurações e depois em Ferramentas comerciais. Em algumas versões, as ferramentas ficam na aba Ferramentas.',
          'Perdi as conversas na migração: se fez backup antes, restaure na instalação do WhatsApp Business.',
          'A saudação não chegou no teste: ela só chega para quem não conversa com você há 14 dias. Peça para alguém novo testar.',
        ]}
      />
    </div>

    <div className="mt-6">
      <p className="font-sans font-semibold text-sm text-editorial-primary mb-3">
        Checklist da Etapa 5
      </p>
      <Checklist itens={CHECKLIST_ETAPA_5} valores={checklist} onChange={onChange} />
    </div>
  </>
)

// ─────────────────────────────────────────────────────────────
// Etapa 6 · Todos os prompts (consulta)
// ─────────────────────────────────────────────────────────────
const Etapa6: React.FC = () => (
  <>
    <div className="space-y-4 text-sm text-editorial-primary leading-relaxed">
      <p>
        Aqui estão os três prompts completos. Se o botão do GPT não funcionar, copie o prompt, abra
        uma conversa nova no ChatGPT, cole e envie. A assistente vai começar a conversar com você.
      </p>
    </div>
    <div className="mt-5 space-y-5">
      <CopyPromptBox
        titulo="Caixa 1 · Bio do Manifesto"
        prompt={PROMPT_BIO_MANIFESTO}
        idAnchor="prompt-bio-manifesto"
      />

      <ExemploBox titulo="Exemplos de bios geradas com o método (inspiração)">
        <p className="text-xs text-editorial-secondary">
          Estes exemplos mostram como a estrutura de 3 linhas do prompt oficial ganha vida na
          prática para diferentes nichos e abordagens, mantendo sempre a ética da psicologia:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {EXEMPLOS_BIOS_INSPIRACAO.map((bio, index) => (
            <div
              key={`etapa6-${bio.id}`}
              className="rounded-[10px] border border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#18181b] p-3 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="font-mono text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                  Exemplo {index + 1}
                </span>
                <span className="font-mono text-[10px] text-editorial-secondary">{bio.foco}</span>
              </div>
              <div className="rounded-[8px] bg-white dark:bg-[#0c0914] border border-slate-200 dark:border-[#27272A] p-2 text-xs font-mono leading-relaxed text-editorial-primary space-y-0.5">
                <p>{bio.linha1}</p>
                <p>{bio.linha2}</p>
                <p>{bio.linha3}</p>
              </div>
              <p className="text-[11px] text-editorial-secondary">{bio.publicoAbordagem}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-editorial-secondary pt-1">
          Atenção: estes cartões são apenas referências de apoio para alunas. O prompt acima
          permanece o texto oficial para copiar e colar no ChatGPT.
        </p>
      </ExemploBox>

      <CopyPromptBox
        titulo="Caixa 2 · Arquiteta da Vitrine"
        prompt={PROMPT_ARQUITETA_VITRINE}
        idAnchor="prompt-arquiteta-vitrine"
      />
      <CopyPromptBox
        titulo="Caixa 3 · Roteirista do WhatsApp"
        prompt={PROMPT_ROTEIRISTA_WHATSAPP}
        idAnchor="prompt-roteirista-whatsapp"
      />
    </div>
  </>
)

// ─────────────────────────────────────────────────────────────
// Etapa 7 · Checklist final e teste dos 5 segundos
// ─────────────────────────────────────────────────────────────
const Etapa7: React.FC<{
  checklists: Record<string, ChecklistValues>
  progressoGeral: number
  tudoMarcado: boolean
  onMarcar: (etapaId: string) => (valores: ChecklistValues) => void
}> = ({ checklists, progressoGeral, tudoMarcado, onMarcar }) => (
  <>
    <div className="flex justify-center mb-6">
      <IlustracaoCronometroTresBaloes />
    </div>
    <div className="space-y-4 text-sm text-editorial-primary leading-relaxed">
      <p>
        Hora do teste. Abra o seu perfil do Instagram (ou peça para alguém abrir). Toque em Iniciar.
        Quando o tempo acabar, feche e responda: o que essa psicóloga faz? Para quem? Como eu
        agendo? Se alguma resposta demorou, ajuste a bio ou o primeiro link.
      </p>
    </div>

    <div className="mt-5">
      <FiveSecondTimer />
    </div>

    <div className="mt-6">
      <ExemploBox titulo="Exemplo · Teste dos 5 segundos com o perfil da Marina">
        <p className="text-xs text-editorial-secondary">
          Veja como uma colega da Academia avaliou o perfil de Marina (@marinaalves.psi) em apenas 5
          segundos:
        </p>
        <div className="rounded-[10px] bg-slate-50 dark:bg-[#18181b] p-3 text-xs sm:text-sm space-y-2">
          <p className="text-editorial-primary">
            <strong>1. O que ela faz?</strong> "Psicoterapia online para mulheres adultas lidando
            com sobrecarga e ansiedade."
          </p>
          <p className="text-editorial-primary">
            <strong>2. Para quem?</strong> "Para quem se sente exausta e precisa aprender a se
            priorizar e colocar limites."
          </p>
          <p className="text-editorial-primary">
            <strong>3. Como eu agendo?</strong> "O primeiro link da bio leva direto para o WhatsApp
            dela com um clique."
          </p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
            ✓ Resultado: Perfil 100% aprovado no teste. Sem ruído, sem enrolação e acolhedor.
          </p>
        </div>
      </ExemploBox>
    </div>

    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-sans font-semibold text-sm text-editorial-primary">
          Resumo de todos os checklists
        </p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary">
          {progressoGeral}%
        </p>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-[#27272A] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] transition-all duration-500"
          style={{ width: `${progressoGeral}%` }}
        />
      </div>

      {[
        { titulo: 'Etapa 2 · Facebook', itens: CHECKLIST_ETAPA_2, id: 'etapa-2' },
        { titulo: 'Etapa 3 · Instagram', itens: CHECKLIST_ETAPA_3, id: 'etapa-3' },
        {
          titulo: 'Etapa 4 · Conectar Instagram e Facebook',
          itens: CHECKLIST_ETAPA_4,
          id: 'etapa-4',
        },
        { titulo: 'Etapa 5 · WhatsApp Business', itens: CHECKLIST_ETAPA_5, id: 'etapa-5' },
      ].map((bloco) => {
        const vals = checklists[bloco.id] ?? {}
        return (
          <div
            key={bloco.id}
            className="rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 shadow-2xs space-y-3"
          >
            <p className="text-sm font-semibold text-editorial-primary">{bloco.titulo}</p>
            <Checklist itens={bloco.itens} valores={vals} onChange={onMarcar(bloco.id)} />
          </div>
        )
      })}
    </div>

    {tudoMarcado && (
      <div className="mt-6 rounded-[14px] bg-purple-50/80 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 p-5 text-center animate-in fade-in duration-500">
        <p className="text-sm sm:text-base font-medium text-editorial-primary leading-relaxed">
          Seus canais estão prontos 💜 A vitrine está aberta e a porta também. Tire um print do seu
          perfil e poste no grupo da Academia.
        </p>
      </div>
    )}

    <div className="mt-8 space-y-2 border-t border-slate-200 dark:border-[#27272A] pt-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-editorial-secondary">
        Fontes consultadas
      </p>
      <ul className="text-xs text-editorial-secondary space-y-1 list-disc pl-4">
        <li>Central de Ajuda do Instagram, conta de criador</li>
        <li>Facebook, criar uma Página</li>
        <li>Central de Contas da Meta</li>
        <li>WhatsApp Business, recursos e primeira impressão</li>
      </ul>
      <p className="text-xs text-editorial-secondary italic pt-2">
        Os nomes de menus mudam com as atualizações dos aplicativos. Revisar a aula a cada seis
        meses.
      </p>
    </div>
  </>
)
