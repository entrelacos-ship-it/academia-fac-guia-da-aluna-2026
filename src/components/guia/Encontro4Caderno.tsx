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
  type ChecklistValues,
} from './encontro4Shared'
import {
  IlustracaoCelularManifesto,
  IlustracaoTresAssistentes,
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
  IlustracaoConexaoMeta,
  IlustracaoWhatsAppBusiness,
  IlustracaoInstalarWhatsApp,
  IlustracaoPerfilComercial,
  IlustracaoSaudacao,
  IlustracaoRespostasRapidas,
  IlustracaoEtiquetas,
  IlustracaoTimer,
} from './encontro4IlustracoesB'
import {
  GPT_BIO_MANIFESTO,
  GPT_ARQUITETA_VITRINE,
  GPT_ROTEIRISTA_WHATSAPP,
  PROMPT_BIO_MANIFESTO,
  PROMPT_ARQUITETA_VITRINE,
  PROMPT_ROTEIRISTA_WHATSAPP,
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
  { id: 'e0-1', texto: 'Tenho em mãos meu Manifesto da Marca escrito no Encontro 2' },
  { id: 'e0-2', texto: 'Tenho em mãos meu número de WhatsApp de atendimento' },
  { id: 'e0-3', texto: 'Tenho em mãos uma foto de rosto atual, com boa luz' },
  { id: 'e0-4', texto: 'Tenho em mãos meu e-mail e uma senha que eu lembre' },
  { id: 'e0-5', texto: 'Tenho em mãos meu CRP para preencher o perfil' },
  { id: 'e0-6', texto: 'Estou em um lugar tranquilo, sem pressa' },
  { id: 'e0-7', texto: 'Vou fazer uma etapa por vez, sem pular passos' },
]

export const CHECKLIST_ETAPA_2 = [
  {
    id: 'e2-1',
    texto: 'Meu perfil pessoal está criado e com a autenticação de dois fatores ligada',
  },
  {
    id: 'e2-2',
    texto:
      'Minha Página profissional está criada com o nome Marina Alves | Psicóloga Online (no meu caso, meu nome)',
  },
  { id: 'e2-3', texto: 'O botão de WhatsApp está funcionando na minha Página' },
  { id: 'e2-4', texto: 'Minha Página tem foto de perfil e capa' },
  { id: 'e2-5', texto: 'A Etapa 2 está pronta para o Encontro 5' },
]

export const CHECKLIST_ETAPA_3 = [
  { id: 'e3-1', texto: 'Minha conta do Instagram está criada e com foto' },
  { id: 'e3-2', texto: 'Minha conta virou conta profissional' },
  { id: 'e3-3', texto: 'Meu campo Nome está completo (nome + o que eu faço)' },
  { id: 'e3-4', texto: 'Minha bio está escrita e salva' },
  { id: 'e3-5', texto: 'O link do WhatsApp está no perfil e abre a conversa' },
  { id: 'e3-6', texto: 'Meus seis destaques estão criados' },
  { id: 'e3-7', texto: 'Meus três posts fixados estão publicados e fixados' },
  { id: 'e3-8', texto: 'Minha grade está organizada' },
  { id: 'e3-9', texto: 'A autenticação de dois fatores está ligada' },
]

export const CHECKLIST_ETAPA_4 = [
  { id: 'e4-1', texto: 'Minha Página do Facebook está conectada ao meu Instagram' },
  { id: 'e4-2', texto: 'A Central de Contas está configurada com o mesmo e-mail' },
  { id: 'e4-3', texto: 'Publicar no Instagram já aparece também na minha Página' },
]

export const CHECKLIST_ETAPA_5 = [
  { id: 'e5-1', texto: 'O WhatsApp Business está instalado com meu número de atendimento' },
  {
    id: 'e5-2',
    texto: 'Meu perfil comercial está completo (foto, categoria, descrição e horário)',
  },
  { id: 'e5-3', texto: 'Minha mensagem de saudação está ligada' },
  {
    id: 'e5-4',
    texto: 'Minha mensagem de ausência está pronta para os horários que eu não atendo',
  },
  { id: 'e5-5', texto: 'Minhas respostas rápidas estão salvas' },
  { id: 'e5-6', texto: 'Minhas etiquetas estão criadas' },
  { id: 'e5-7', texto: 'Meu link curto wa.me está funcionando e colado no Instagram' },
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
const TABELA_ANATOMIA: { item: string; oQueEscrever: string }[] = [
  { item: 'Foto', oQueEscrever: 'Sua foto de rosto, com boa luz e fundo limpo' },
  {
    item: 'Nome',
    oQueEscrever: 'Marina Alves | Psicóloga Online (no meu caso, meu nome e o que eu faço)',
  },
  { item: '@ (usuário)', oQueEscrever: '@marinaalves.psi (no meu caso, meu usuário)' },
  { item: 'Bio', oQueEscrever: 'Três linhas: quem você atende, como você ajuda, como agendar' },
  { item: 'Link', oQueEscrever: 'O link curto do WhatsApp, com o rótulo Agende sua sessão' },
  { item: 'Destaques', oQueEscrever: 'Seis pastas fixas abaixo da bio' },
  { item: 'Posts fixados', oQueEscrever: 'Três publicações que apresentam seu trabalho' },
  { item: 'Grade', oQueEscrever: 'Suas publicações organizadas em colunas' },
  { item: 'Seguidores e seguindo', oQueEscrever: 'Números que crescem com o tempo, sem pressa' },
]

const TABELA_DESTAQUES: { titulo: string; conteudo: string }[] = [
  { titulo: 'Sobre mim', conteudo: 'Quem é você, sua abordagem e o que acredita' },
  { titulo: 'Como funciona', conteudo: 'Como é uma sessão, duração, online ou presencial' },
  { titulo: 'Agenda', conteudo: 'Como você organiza seus horários e sua disponibilidade' },
  { titulo: 'Valores', conteudo: 'Como falar de investimento sem preço público' },
  { titulo: 'Perguntas', conteudo: 'As dúvidas mais comuns respondidas com carinho' },
  { titulo: 'Agendar', conteudo: 'O passo a passo para começar, com o link do WhatsApp' },
]

const TABELA_POSTS_FIXADOS: { ordem: string; tema: string }[] = [
  { ordem: 'Post 1', tema: 'Quem eu sou e como eu trabalho' },
  { ordem: 'Post 2', tema: 'Como funciona a primeira sessão' },
  { ordem: 'Post 3', tema: 'Como agendar e o que perguntar antes' },
]

const TABELA_ATALHOS: { atalho: string; mensagem: string }[] = [
  {
    atalho: '/agenda',
    mensagem:
      'Meus horários livres desta semana são terça e quinta, às 10h. Qual funciona melhor para você?',
  },
  {
    atalho: '/valor',
    mensagem:
      'Meu investimento para sessão individual é de R$ (coloque aqui o valor da sua regra de preço). Posso te contar como funciona?',
  },
  {
    atalho: '/local',
    mensagem:
      'Os atendimentos são online, por videochamada segura. Você precisa apenas de um lugar tranquilo.',
  },
  {
    atalho: '/primeira',
    mensagem:
      'A primeira conversa dura cerca de 20 minutos, para nos conhecermos e ver se faz sentido seguir.',
  },
  {
    atalho: '/contrato',
    mensagem: 'Depois de agendarmos, te envio o contrato e os dados para o pagamento.',
  },
  { atalho: '/obrigada', mensagem: 'Obrigada pelo seu contato! Fico à disposição. 💜' },
]

const TABELA_ETIQUETAS: { etiqueta: string; cor: string; uso: string }[] = [
  { etiqueta: 'Nova paciente', cor: 'roxo', uso: 'Chegou agora pelo link ou pela Página' },
  {
    etiqueta: 'Aguardando retorno',
    cor: 'laranja',
    uso: 'Você respondeu e está esperando a resposta dela',
  },
  { etiqueta: 'Agendada', cor: 'verde', uso: 'Já tem dia e horário marcados' },
  { etiqueta: 'Aguardando pagamento', cor: 'amarelo', uso: 'Confirmou e vai enviar o comprovante' },
  { etiqueta: 'Ativa', cor: 'azul', uso: 'Já é sua paciente em acompanhamento' },
  {
    etiqueta: 'Sem encaixe agora',
    cor: 'cinza',
    uso: 'Sem horário no momento, para retomar depois',
  },
]

// ─────────────────────────────────────────────────────────────
// Prompts resumidos para os cartões da Etapa 1 (a versão
// completa fica na Etapa 6).
// ─────────────────────────────────────────────────────────────
const PROMPTS_CARTOES = [
  {
    nome: 'Bio do Manifesto',
    descricao: 'A IA lê o seu Manifesto da Marca e escreve a sua bio do Instagram.',
    gpt: GPT_BIO_MANIFESTO,
    prompt: PROMPT_BIO_MANIFESTO,
    anchor: 'prompt-bio-manifesto',
  },
  {
    nome: 'Arquiteta da Vitrine',
    descricao: 'A IA organiza sua vitrine: destaques, posts fixados e o que postar primeiro.',
    gpt: GPT_ARQUITETA_VITRINE,
    prompt: PROMPT_ARQUITETA_VITRINE,
    anchor: 'prompt-arquiteta-vitrine',
  },
  {
    nome: 'Roteirista do WhatsApp',
    descricao: 'A IA escreve suas mensagens de saudação, ausência e respostas rápidas.',
    gpt: GPT_ROTEIRISTA_WHATSAPP,
    prompt: PROMPT_ROTEIRISTA_WHATSAPP,
    anchor: 'prompt-roteirista-whatsapp',
  },
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

      {/* Navegação mobile: Anterior / Próxima */}
      <div className="flex items-center justify-between gap-3 mb-6 md:hidden">
        <button
          type="button"
          onClick={() => irPara(Math.max(0, etapaAtual - 1))}
          disabled={etapaAtual === 0}
          className="rounded-[8px] border border-slate-200 dark:border-[#27272A] px-3.5 py-2 min-h-[40px] text-xs font-mono font-semibold text-editorial-primary disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          ← Anterior
        </button>
        <span className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary">
          Etapa {etapa.numero}/7
        </span>
        <button
          type="button"
          onClick={() => irPara(Math.min(ETAPAS_ENCONTRO_4.length - 1, etapaAtual + 1))}
          disabled={etapaAtual === ETAPAS_ENCONTRO_4.length - 1}
          className="rounded-[8px] bg-[#7c3aed] dark:bg-[#C084FC] px-3.5 py-2 min-h-[40px] text-xs font-mono font-semibold text-white dark:text-[#0A0A14] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          Próxima →
        </button>
      </div>

      <div className="md:grid md:grid-cols-[minmax(0,1fr)_240px] md:gap-10">
        {/* Conteúdo da etapa */}
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#ff9b32] mb-2">
            Etapa {etapa.numero} de 7
          </p>
          <h3 className="font-serif text-2xl sm:text-3xl text-editorial-primary mb-6 tracking-tight">
            {etapa.titulo}
          </h3>

          <div className="space-y-5">
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
              />
            )}
          </div>

          {/* Navegação inferior (mobile e desktop) */}
          <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-[#27272A]">
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
      <IlustracaoCelularManifesto />
    </div>
    <div className="space-y-4 text-sm text-editorial-primary leading-relaxed">
      <p>
        Nesta aula, você vai configurar os seus três canais: Facebook, Instagram e WhatsApp
        Business. Parece muito, mas não é: vamos passo a passo, uma ação por vez, e cada etapa
        termina com um checklist.
      </p>
      <p>
        Ao final, qualquer pessoa que encontrar o seu perfil entende em segundos o que você faz,
        para quem e como agendar. E a melhor parte: a IA escreve a partir do seu Manifesto, então
        você não começa do zero.
      </p>
      <p className="font-medium">Antes de começar, confira se você tem tudo em mãos:</p>
    </div>
    <div className="mt-4">
      <p className="font-sans font-semibold text-sm text-editorial-primary mb-3">Tenho em mãos</p>
      <Checklist itens={CHECKLIST_ETAPA_0} valores={checklist} onChange={onChange} />
    </div>
    <div className="mt-5 space-y-3">
      <Callout tipo="dica">
        Separe entre 40 e 60 minutos para esta aula. Você não precisa terminar tudo hoje: pode
        pausar em qualquer etapa e voltar depois, o seu progresso fica salvo neste navegador.
      </Callout>
      <Callout tipo="atencao">
        Nesta aula, vamos usar os nomes dos menus como estão hoje. Se algum nome estiver diferente
        no seu aplicativo, procure a opção mais parecida: os apps mudam de vez em quando.
      </Callout>
    </div>
  </>
)

// ─────────────────────────────────────────────────────────────
// Etapa 1 · A IA trabalha para você
// ─────────────────────────────────────────────────────────────
const PASSOS_IA = [
  'Abra o caderno do Encontro 2 e copie o texto do seu Manifesto da Marca.',
  'Na Etapa 6 desta aula, copie o prompt da Bio do Manifesto e cole no ChatGPT junto com o seu Manifesto.',
  'Leia o que a IA escreveu e ajuste as palavras que não soam como você.',
  'Repita com o prompt da Arquiteta da Vitrine para organizar destaques e posts fixados.',
  'Repita com o prompt do Roteirista do WhatsApp para as suas mensagens automáticas.',
  'Guarde tudo num lugar só, um bloco de notas simples resolve.',
]

const Etapa1: React.FC = () => (
  <>
    <div className="flex justify-center mb-6">
      <IlustracaoTresAssistentes />
    </div>
    <div className="space-y-4 text-sm text-editorial-primary leading-relaxed">
      <p>
        Antes de abrir qualquer aplicativo, vamos preparar os textos. Você já tem o mais importante:
        o seu Manifesto da Marca, escrito no Encontro 2. Agora três assistentes de IA vão
        transformar ele em bio, em vitrine e em mensagens.
      </p>
      <p>
        Você não precisa escrever nada do zero. A IA escreve, e você escolhe o que soa como você.
      </p>
    </div>

    <div className="mt-5 space-y-4">
      {PROMPTS_CARTOES.map((card) => (
        <div
          key={card.nome}
          className="rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 sm:p-5 space-y-3 shadow-2xs"
        >
          <h4 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
            {card.nome}
          </h4>
          <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed">
            {card.descricao}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <GPTButton link={card.gpt} promptAnchorId={card.anchor} />
            <LinkButton href={`#etapa-6`}>Ver o prompt na Etapa 6</LinkButton>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-6 space-y-3">
      <p className="font-sans font-semibold text-sm text-editorial-primary">
        Como funciona, em 6 passos:
      </p>
      {PASSOS_IA.map((passo, i) => (
        <StepCard key={i} numero={i + 1}>
          <p>{passo}</p>
        </StepCard>
      ))}
    </div>

    <div className="mt-6">
      <Callout tipo="dica">
        A IA acerta mais quando você cola o seu Manifesto inteiro, sem resumir. Quanto mais o seu
        texto, mais a resposta parece você.
      </Callout>
    </div>

    <div className="mt-4">
      <StuckBox
        solucoes={[
          'Se o ChatGPT não abrir, feche e abra o navegador de novo. Se persistir, use outro navegador.',
          'Se a resposta da IA sair genérica, confira se você colou o seu Manifesto completo no mesmo campo do prompt.',
          'Se você não achou o seu Manifesto, refaça o exercício do Encontro 2 antes de seguir. Em dez minutos ele está pronto.',
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
        O Facebook entra nesta aula por um motivo simples: a Página dele é o cartão de visitas
        profissional que conversa com o Instagram e com o WhatsApp. Antes dela, porém, vem o seu
        perfil pessoal.
      </p>
      <p>
        Perfil pessoal e Página são coisas diferentes. O perfil é seu, com amigos e álbum de
        família. A Página é profissional, pública, com nome da sua prática e botão de WhatsApp. Quem
        chega pela Página vê a profissional, não a pessoa.
      </p>
    </div>
    <div className="mt-4">
      <Callout tipo="dica">
        Já tem um perfil pessoal no Facebook? Ótimo, use ele. Não precisa criar nada novo nesta
        parte, só conferir se está tudo em ordem.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        2.1 · Criar (ou conferir) seu perfil pessoal
      </h4>
      <StepCard numero={1}>
        <p>
          Abra o site do Facebook. Se você já tem perfil, é só entrar. Se não tem, toque em{' '}
          <strong>Criar nova conta</strong> e siga com seu nome, e-mail e uma senha que você lembre.
        </p>
        <LinkButton href="https://www.facebook.com">Abrir o Facebook</LinkButton>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Coloque uma foto de rosto e preencha seu nome como ele está nos seus documentos. Uma foto
          simples, com boa luz, já resolve.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Ligue a <strong>autenticação de dois fatores</strong>. Ela protege sua conta com um código
          além da senha.
        </p>
      </StepCard>
      <Callout tipo="atencao">
        A autenticação de dois fatores é o que impede que alguém tome sua conta. Como sua Página e
        seu WhatsApp vão se apoiar nela, ligue antes de seguir para a Página.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        2.2 · Criar sua Página profissional
      </h4>
      <p className="text-sm text-editorial-primary leading-relaxed">
        Existem dois caminhos. Os dois criam a mesma Página: escolha o que for mais fácil para você
        hoje.
      </p>
      <div className="rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 sm:p-5 space-y-3 shadow-2xs">
        <p className="font-sans font-semibold text-sm text-editorial-primary">
          Caminho A · pelo Instagram
        </p>
        <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed">
          Se você já fez a Etapa 3, no Instagram toque no seu perfil, depois em{' '}
          <strong>Editar perfil</strong> e siga a opção de criar uma Página conectada. O Facebook
          preenche nome e foto sozinho.
        </p>
      </div>
      <div className="rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 sm:p-5 space-y-3 shadow-2xs">
        <p className="font-sans font-semibold text-sm text-editorial-primary">
          Caminho B · pelo computador
        </p>
        <div className="flex justify-center py-2">
          <IlustracaoCriarPaginaPC />
        </div>
        <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed">
          Abra o endereço abaixo, toque em <strong>Criar</strong> e preencha: nome{' '}
          <em>Marina Alves | Psicóloga Online</em> (no meu caso, meu nome e minha especialidade) e
          categoria <em>psicóloga</em>.
        </p>
        <LinkButton href="https://www.facebook.com/pages/create">
          Abrir a criação de Página
        </LinkButton>
      </div>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        2.3 · O botão de WhatsApp na Página
      </h4>
      <div className="flex justify-center py-2">
        <IlustracaoBotaoWhatsappPagina />
      </div>
      <StepCard numero={1}>
        <p>
          Na sua Página, toque em <strong>Adicionar botão</strong>.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Escolha <strong>WhatsApp</strong> e confirme o número do seu atendimento.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Toque em <strong>Salvar</strong> e teste: o botão deve abrir uma conversa com o seu
          WhatsApp Business.
        </p>
      </StepCard>
      <div className="flex justify-center py-2">
        <IlustracaoConversaChegando />
      </div>
      <Callout tipo="etica">
        Sua Página é um espaço profissional. Sem promessa de resultado, sem preço público e sem
        depoimento de paciente, mesmo que seja verdadeira e autorizada. O que fica são as
        informações de como você trabalha e como agendar.
      </Callout>
    </div>

    <div className="mt-6">
      <StuckBox
        solucoes={[
          'O botão de WhatsApp não apareceu: confira se o WhatsApp Business está instalado com o mesmo número que você informou na Página.',
          'Não encontrei Criar Página: no computador, use o link desta etapa, que leva direto à tela certa.',
          'A Página criou com outro nome: toque no nome dela, depois em Editar, e corrija. O nome pode ser ajustado quantas vezes precisar.',
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
    <div className="space-y-4 text-sm text-editorial-primary leading-relaxed">
      <p>
        O Instagram é a sua vitrine. É nele que uma paciente em potencial vai decidir, em poucos
        segundos, se ela se identifica com o seu trabalho e se sente segura para falar com você.
      </p>
      <p className="font-medium">
        A regra dos 5 segundos: alguém entra no seu perfil, olha por cinco segundos e precisa
        conseguir responder três perguntas. O que ela faz? Para quem? Como eu agendo? Vamos montar o
        seu perfil para passar nesse teste.
      </p>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.1 · Criar sua conta</h4>
      <StepCard numero={1}>
        <p>
          Abra o site do Instagram e toque em <strong>Criar conta</strong>. Use um e-mail seu e
          escolha um @ com o seu nome, como @marinaalves.psi.
        </p>
        <LinkButton href="https://www.instagram.com">Abrir o Instagram</LinkButton>
      </StepCard>
      <Callout tipo="dica">
        Prefira uma conta separada para a prática clínica, mesmo que você já use Instagram pessoal.
        As duas podem existir no mesmo aplicativo, sem sair da sua.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.2 · Conta profissional</h4>
      <div className="flex justify-center py-2">
        <IlustracaoMenuContaProfissional />
      </div>
      <StepCard numero={1}>
        <p>No seu perfil, toque no menu ☰ no canto superior.</p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Toque em <strong>Tipo de conta e ferramentas</strong>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Toque em <strong>Mudar para conta profissional</strong>.
        </p>
      </StepCard>
      <div className="py-2">
        <MenuPath passos={['☰', 'Tipo de conta e ferramentas', 'Mudar para conta profissional']} />
      </div>
      <div className="flex justify-center py-2">
        <IlustracaoMudarParaProfissional />
      </div>
      <StepCard numero={4}>
        <p>
          Escolha a categoria <em>psicóloga</em>. Entre <strong>Criador</strong> e{' '}
          <strong>Comercial</strong>, o Instagram pede a sua escolha: as duas viram conta
          profissional e liberam os dados da vitrine.
        </p>
      </StepCard>
      <div className="flex justify-center py-2">
        <PhoneIllustration
          width={200}
          height={380}
          ariaLabel="Ilustração de um celular mostrando a opção de categoria profissional destacada durante a configuração da conta"
          svg={
            <>
              <text
                x="100"
                y="46"
                textAnchor="middle"
                fontSize="9"
                fill="#6D28D9"
                fontFamily="monospace"
              >
                ESCOLHA A CATEGORIA
              </text>
              <rect
                x="30"
                y="66"
                width="140"
                height="40"
                rx="10"
                fill="#F5F3FF"
                stroke="#7C3AED"
                strokeWidth="2"
              />
              <text x="42" y="90" fontSize="9" fill="#6D28D9" fontFamily="monospace">
                Psicóloga
              </text>
              <rect
                x="30"
                y="118"
                width="140"
                height="40"
                rx="10"
                fill="#F8FAFC"
                stroke="#E2E8F0"
              />
              <text x="42" y="142" fontSize="9" fill="#64748B" fontFamily="monospace">
                Outra...
              </text>
              <circle cx="100" cy="190" r="4" fill="#F97316" />
              <text
                x="100"
                y="224"
                textAnchor="middle"
                fontSize="9"
                fill="#7C3AED"
                fontFamily="monospace"
              >
                CONTA PROFISSIONAL ATIVA
              </text>
              <text
                x="100"
                y="244"
                textAnchor="middle"
                fontSize="8"
                fill="#94A3B8"
                fontFamily="monospace"
              >
                Passo 3 de 4
              </text>
            </>
          }
        />
      </div>
      <LinkButton href="https://help.instagram.com/2358103564437429">
        Ajuda oficial do Instagram
      </LinkButton>
      <Callout tipo="dica">
        Criador ou Comercial: para a prática clínica, a conta Criador costuma ser a mais leve. Se
        algum recurso não aparecer, mude entre as duas nas configurações, sem medo, é só um ajuste.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.3 · A anatomia do seu perfil</h4>
      <div className="flex justify-center py-2">
        <IlustracaoAnatomiaPerfil />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#27272A]">
              <th className="text-left py-2 pr-3 font-sans font-semibold text-editorial-primary">
                Item
              </th>
              <th className="text-left py-2 font-sans font-semibold text-editorial-primary">
                O que escrever
              </th>
            </tr>
          </thead>
          <tbody>
            {TABELA_ANATOMIA.map((row) => (
              <tr key={row.item} className="border-b border-slate-100 dark:border-[#18181B]">
                <td className="py-2 pr-3 font-mono text-editorial-primary align-top whitespace-nowrap">
                  {row.item}
                </td>
                <td className="py-2 text-editorial-secondary leading-relaxed">
                  {row.oQueEscrever}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.4 · Sua foto e o campo Nome</h4>
      <div className="flex justify-center py-2">
        <IlustracaoFotoENome />
      </div>
      <StepCard numero={1}>
        <p>
          No seu perfil, toque em <strong>Editar perfil</strong>.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>Toque na foto para trocar. Escolha uma foto de rosto, com boa luz e fundo limpo.</p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          No campo <strong>Nome</strong>, escreva <em>Marina Alves | Psicóloga Online</em>, no meu
          caso, meu nome e o que eu faço. Esse campo é buscável: quem procura psicóloga online
          encontra você por ele.
        </p>
      </StepCard>
      <StepCard numero={4}>
        <p>O @ não precisa mudar. Ele já identifica a sua conta.</p>
      </StepCard>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.5 · A bio</h4>
      <div className="flex justify-center py-2">
        <IlustracaoBio />
      </div>
      <p className="text-sm text-editorial-primary leading-relaxed">
        Aqui entra o trabalho da IA. Com o prompt da <strong>Bio do Manifesto</strong> (Etapa 6), o
        ChatGPT lê o seu Manifesto e devolve a bio pronta. Você escolhe a versão que soa mais como
        você.
      </p>
      <div className="rounded-[14px] border border-purple-200/90 dark:border-[#3f3f46] bg-white dark:bg-[#121216] p-4 space-y-2 shadow-2xs">
        <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary">
          Exemplo de bio
        </p>
        <p className="text-sm text-editorial-primary leading-relaxed">
          Psicologia online para mulheres 💜<br />
          Atendimento por videochamada, com acolhimento e método
          <br />
          CRP 06/000000 · Agende pelo botão abaixo
        </p>
        <p className="text-xs text-editorial-secondary leading-relaxed">
          (Este é um perfil fictício. Use o seu CRP e o seu nome.)
        </p>
      </div>
      <Callout tipo="etica">
        Bio profissional: descreve para quem você atende e como você trabalha. Sem promessa de
        resultado, sem preço público e sem depoimento.
      </Callout>
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
          Toque em <strong>Adicionar link</strong> e cole o link curto do seu WhatsApp Business
          (você vai criar ele na Etapa 5).
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          No título, escreva <strong>Agende sua sessão</strong>. É esse texto que aparece em azul no
          seu perfil.
        </p>
      </StepCard>
      <Callout tipo="dica">
        O Instagram aceita até 5 links no perfil, mas aqui menos é mais: um só, o do WhatsApp, com
        um título claro. Quem quer falar com você, fala em um toque.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.7 · Os seis destaques</h4>
      <div className="flex justify-center py-2">
        <IlustracaoDestaques />
      </div>
      <p className="text-sm text-editorial-primary leading-relaxed">
        Destaques são as pastas que ficam fixas abaixo da bio, mesmo depois dos stories sumirem.
        Comece com seis:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#27272A]">
              <th className="text-left py-2 pr-3 font-sans font-semibold text-editorial-primary">
                Destaque
              </th>
              <th className="text-left py-2 font-sans font-semibold text-editorial-primary">
                O que colocar
              </th>
            </tr>
          </thead>
          <tbody>
            {TABELA_DESTAQUES.map((row) => (
              <tr key={row.titulo} className="border-b border-slate-100 dark:border-[#18181B]">
                <td className="py-2 pr-3 font-mono text-editorial-primary align-top whitespace-nowrap">
                  {row.titulo}
                </td>
                <td className="py-2 text-editorial-secondary leading-relaxed">{row.conteudo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <StepCard numero={1}>
        <p>Publique um story com o conteúdo da pasta.</p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Abra o story, toque em <strong>Destaque</strong> e escolha o nome da pasta.
        </p>
      </StepCard>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.8 · Os três posts fixados</h4>
      <div className="flex justify-center py-2">
        <IlustracaoPostsFixados />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#27272A]">
              <th className="text-left py-2 pr-3 font-sans font-semibold text-editorial-primary">
                Ordem
              </th>
              <th className="text-left py-2 font-sans font-semibold text-editorial-primary">
                Tema
              </th>
            </tr>
          </thead>
          <tbody>
            {TABELA_POSTS_FIXADOS.map((row) => (
              <tr key={row.ordem} className="border-b border-slate-100 dark:border-[#18181B]">
                <td className="py-2 pr-3 font-mono text-editorial-primary align-top whitespace-nowrap">
                  {row.ordem}
                </td>
                <td className="py-2 text-editorial-secondary leading-relaxed">{row.tema}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <StepCard numero={1}>
        <p>Publique os três posts, um por vez, no seu ritmo.</p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Abra o post, toque nos três pontinhos e escolha <strong>Fixar no perfil</strong>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Deixe os três na ordem da tabela: quem você é primeiro, como funciona depois, agendar por
          último.
        </p>
      </StepCard>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.9 · A grade</h4>
      <p className="text-sm text-editorial-primary leading-relaxed">
        A grade é o conjunto de todas as suas publicações, em colunas. Não existe grade certa:
        existe a sua, com cara da sua prática. Para começar, alterne três tipos de post: um sobre
        você, um sobre o tema que você trabalha e um sobre como agendar. Com o tempo, a vitrine
        ganha equilíbrio sozinha.
      </p>
      <Callout tipo="dica">
        Os prompts da <strong>Arquiteta da Vitrine</strong> (Etapa 6) sugerem o que postar em cada
        espaço. Use como inspiração, não como obrigação.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.10 · Segurança</h4>
      <StepCard numero={1}>
        <p>No seu perfil, toque no menu ☰.</p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Toque em <strong>Tipo de conta e ferramentas</strong> para conferir se tudo continua como
          conta profissional.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Depois, toque em <strong>Configurações e privacidade</strong>, abra{' '}
          <strong>Central de Contas</strong> e ligue a <strong>autenticação de dois fatores</strong>
          .
        </p>
      </StepCard>
      <div className="py-2">
        <MenuPath
          passos={[
            '☰',
            'Configurações e privacidade',
            'Central de Contas',
            'Senha e segurança',
            'Autenticação de dois fatores',
          ]}
        />
      </div>
      <Callout tipo="etica">
        Sua conta profissional guarda conversas e dados de pessoas reais. A autenticação de dois
        fatores protege elas junto com você.
      </Callout>
    </div>

    <div className="mt-6">
      <StuckBox
        solucoes={[
          'A opção Mudar para conta profissional não aparece: atualize o aplicativo na loja do seu celular e abra de novo.',
          'O link do WhatsApp não abre: confira na Etapa 5 se o link curto está certo, com o DDI 55 e o DDD.',
          'O destaque não salvou: o story precisa estar no ar no momento em que você toca em Destaque. Publique de novo e repita.',
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
      <IlustracaoConexaoMeta />
    </div>
    <div className="space-y-4 text-sm text-editorial-primary leading-relaxed">
      <p>
        Com a Página e o Instagram prontos, agora eles conversam entre si. Essa conexão é o que
        permite publicar nos dois lugares ao mesmo tempo e gerenciar as mensagens num só painel.
      </p>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        4.1 · Conectar a Página ao Instagram
      </h4>
      <StepCard numero={1}>
        <p>
          Na sua Página do Facebook, toque em <strong>Configurações</strong>.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Toque em <strong>Contas vinculadas</strong> e escolha <strong>Instagram</strong>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Toque em <strong>Conectar conta</strong> e entre com o seu @ do Instagram.
        </p>
      </StepCard>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">4.2 · A Central de Contas</h4>
      <StepCard numero={1}>
        <p>Abra a Central de Contas da Meta pelo link abaixo.</p>
        <LinkButton href="https://accountscenter.instagram.com">
          Abrir a Central de Contas
        </LinkButton>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Confira se o Facebook e o Instagram aparecem juntos na mesma{' '}
          <strong>Central de Contas</strong>, com o mesmo e-mail de acesso.
        </p>
      </StepCard>
      <Callout tipo="atencao">
        Uma conta do Instagram se conecta a uma única Página. Se você tem mais de uma Página,
        escolha a da sua prática clínica para conectar.
      </Callout>
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
      <IlustracaoWhatsAppBusiness />
    </div>
    <div className="space-y-4 text-sm text-editorial-primary leading-relaxed">
      <p>
        O WhatsApp Business é o aplicativo onde a conversa vira agendamento. Ele é gratuito e feito
        exatamente para isso: receber pacientes, responder com organização e manter a sua prática
        profissional.
      </p>
      <p>
        A diferença para o WhatsApp comum: ele tem mensagem de saudação, mensagem de ausência,
        respostas rápidas, etiquetas e o link curto que agenda.
      </p>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">5.1 · Instalar e usar o número</h4>
      <div className="flex justify-center py-2">
        <IlustracaoInstalarWhatsApp />
      </div>
      <StepCard numero={1}>
        <p>
          Na loja do seu celular, procure por <strong>WhatsApp Business</strong> e toque em{' '}
          <strong>Instalar</strong>. É o aplicativo da mesma empresa do WhatsApp, com um ícone
          parecido.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Abra o aplicativo e cadastre o número do seu atendimento. Se você usa um chip só, o
          WhatsApp comum fica inutilizável enquanto o Business estiver ativo nele.
        </p>
      </StepCard>
      <Callout tipo="atencao">
        Migração: se você já atende pelo WhatsApp comum neste número, ao instalar o Business ele
        pergunta se você quer transferir a sua conta e suas conversas. Toque em{' '}
        <strong>Transferir</strong> para manter o histórico. Se preferir não migrar ainda, use um
        segundo chip ou número.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">5.2 · Seu perfil comercial</h4>
      <div className="flex justify-center py-2">
        <IlustracaoPerfilComercial />
      </div>
      <StepCard numero={1}>
        <p>No WhatsApp Business, toque nos três pontinhos no canto superior.</p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Toque em <strong>Configurações</strong> e depois no nome do seu negócio.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Preencha o perfil: foto de rosto, categoria <em>psicóloga</em>, descrição curta e horário
          de atendimento.
        </p>
      </StepCard>
      <div className="py-2">
        <MenuPath passos={['⋮', 'Configurações', 'Seu perfil comercial']} />
      </div>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">5.3 · A mensagem de saudação</h4>
      <div className="flex justify-center py-2">
        <IlustracaoSaudacao />
      </div>
      <p className="text-sm text-editorial-primary leading-relaxed">
        A mensagem de saudação é enviada automaticamente para quem te chama pela primeira vez, ou
        depois de 14 dias sem conversa. Use o prompt do <strong>Roteirista do WhatsApp</strong>{' '}
        (Etapa 6) e depois cole o resultado aqui:
      </p>
      <StepCard numero={1}>
        <p>
          Toque nos três pontinhos, depois em <strong>Ferramentas comerciais</strong>.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Toque em <strong>Mensagem de saudação</strong> e ligue a chave no topo.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Cole o texto e toque em <strong>Salvar</strong>. Exemplo:
        </p>
        <div className="rounded-[12px] bg-purple-50/80 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 p-3">
          <p className="text-xs sm:text-sm text-editorial-primary leading-relaxed">
            Olá! Obrigada pelo seu contato 💜 Recebo novas pacientes neste mês. Me conta um pouco do
            que você está buscando? Respondo no mesmo dia, no horário de atendimento.
          </p>
        </div>
      </StepCard>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">5.4 · A mensagem de ausência</h4>
      <StepCard numero={1}>
        <p>
          No mesmo menu de <strong>Ferramentas comerciais</strong>, toque em{' '}
          <strong>Mensagem de ausência</strong> e ligue a chave.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Escolha o <strong>horário de envio</strong> e confira se o horário de atendimento do seu
          perfil está preenchido.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Cole o texto da sua mensagem de ausência e toque em <strong>Salvar</strong>. Exemplo:
        </p>
        <div className="rounded-[12px] bg-purple-50/80 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 p-3">
          <p className="text-xs sm:text-sm text-editorial-primary leading-relaxed">
            Recebi a sua mensagem 💜 Neste momento estou fora do horário de atendimento. Respondo no
            próximo horário comercial. Se for uma emergência, procure os serviços de emergência da
            sua cidade ou ligue 188 (CVV).
          </p>
        </div>
      </StepCard>
      <Callout tipo="etica">
        Deixe sempre claro na mensagem de ausência que o WhatsApp não é um canal de emergência.
        Indique o CVV (188) ou o serviço de emergência da cidade. Isso protege a pessoa que escreveu
        e protege você.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">5.5 · As respostas rápidas</h4>
      <div className="flex justify-center py-2">
        <IlustracaoRespostasRapidas />
      </div>
      <StepCard numero={1}>
        <p>
          Em <strong>Ferramentas comerciais</strong>, toque em <strong>Respostas rápidas</strong>.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Toque em <strong>Adicionar</strong>, escreva o atalho e cole a mensagem. Na conversa,
          digite <strong>/</strong> e o atalho aparece para escolher.
        </p>
      </StepCard>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#27272A]">
              <th className="text-left py-2 pr-3 font-sans font-semibold text-editorial-primary">
                Atalho
              </th>
              <th className="text-left py-2 font-sans font-semibold text-editorial-primary">
                Mensagem
              </th>
            </tr>
          </thead>
          <tbody>
            {TABELA_ATALHOS.map((row) => (
              <tr key={row.atalho} className="border-b border-slate-100 dark:border-[#18181B]">
                <td className="py-2 pr-3 font-mono text-[#7c3aed] dark:text-[#C084FC] align-top whitespace-nowrap">
                  {row.atalho}
                </td>
                <td className="py-2 text-editorial-secondary leading-relaxed">{row.mensagem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">5.6 · As etiquetas</h4>
      <div className="flex justify-center py-2">
        <IlustracaoEtiquetas />
      </div>
      <StepCard numero={1}>
        <p>Na lista de conversas, toque e segure uma conversa.</p>
      </StepCard>
      <StepCard numero={2}>
        <p>Toque no ícone de etiqueta e escolha uma.</p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Para criar as suas, em <strong>Ferramentas comerciais</strong> toque em{' '}
          <strong>Etiquetas</strong> e depois em <strong>Adicionar etiqueta</strong>.
        </p>
      </StepCard>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#27272A]">
              <th className="text-left py-2 pr-3 font-sans font-semibold text-editorial-primary">
                Etiqueta
              </th>
              <th className="text-left py-2 font-sans font-semibold text-editorial-primary">
                Quando usar
              </th>
            </tr>
          </thead>
          <tbody>
            {TABELA_ETIQUETAS.map((row) => (
              <tr key={row.etiqueta} className="border-b border-slate-100 dark:border-[#18181B]">
                <td className="py-2 pr-3 font-mono text-editorial-primary align-top whitespace-nowrap">
                  {row.etiqueta}
                </td>
                <td className="py-2 text-editorial-secondary leading-relaxed">{row.uso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout tipo="etica">
        Etiquetas servem para organizar o fluxo de atendimento, não para registrar conteúdo clínico.
        Nunca escreva dados de sessão, diagnóstico ou assunto da conversa no nome ou na cor de uma
        etiqueta.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">5.7 · O link curto</h4>
      <StepCard numero={1}>
        <p>
          Em <strong>Ferramentas comerciais</strong>, toque em <strong>Link curto</strong>. O seu é
          wa.me seguido do seu número com DDI e DDD.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Toque em <strong>Copiar link</strong>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Volte ao Instagram (Etapa 3.6) e cole na área de <strong>Links</strong> do seu perfil, com
          o título <strong>Agende sua sessão</strong>.
        </p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          Teste: abra o seu perfil em outro celular ou peça para alguém testar. O link deve abrir a
          conversa com você.
        </p>
      </StepCard>
    </div>

    <div className="mt-6">
      <StuckBox
        solucoes={[
          'O link curto não abre a conversa: confira o número no formato internacional, com 55 no começo, e teste em outra aba do navegador.',
          'A mensagem automática não enviou: confira se a chave no topo da ferramenta está ligada e se o horário de atendimento está preenchido.',
          'Migrei e perdi as conversas: no WhatsApp Business, abra Configurações, depois Conversas, e toque em Backup de conversas para restaurar.',
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
// Etapa 6 · Todos os prompts
// ─────────────────────────────────────────────────────────────
const Etapa6: React.FC = () => (
  <>
    <div className="space-y-4 text-sm text-editorial-primary leading-relaxed">
      <p>
        Os três prompts desta aula estão aqui, completos. Cole o seu Manifesto da Marca junto, no
        mesmo campo, e a IA escreve a partir dele. Ajuste o que não soar como você: o texto final é
        seu.
      </p>
    </div>
    <div className="mt-5 space-y-5">
      <CopyPromptBox
        titulo="Bio do Manifesto"
        prompt={PROMPT_BIO_MANIFESTO}
        idAnchor="prompt-bio-manifesto"
      />
      <CopyPromptBox
        titulo="Arquiteta da Vitrine"
        prompt={PROMPT_ARQUITETA_VITRINE}
        idAnchor="prompt-arquiteta-vitrine"
      />
      <CopyPromptBox
        titulo="Roteirista do WhatsApp"
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
}> = ({ checklists, progressoGeral, tudoMarcado }) => (
  <>
    <div className="flex justify-center mb-6">
      <IlustracaoTimer />
    </div>
    <div className="space-y-4 text-sm text-editorial-primary leading-relaxed">
      <p>
        Chegou a hora do teste da vitrine. Abra o seu perfil do Instagram, olhe por cinco segundos e
        responda:
      </p>
      <p className="font-medium">O que ela faz? Para quem? Como eu agendo?</p>
      <p>
        Se as três respostas vieram rápido, a sua vitrine está comunicando. Se alguma demorou, volte
        à etapa dela e ajuste: isso não é defeito, é o teste fazendo o trabalho dele.
      </p>
    </div>

    <div className="mt-5">
      <FiveSecondTimer />
    </div>

    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-sans font-semibold text-sm text-editorial-primary">
          Resumo dos checklists
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
        { titulo: 'Etapa 4 · Conexão', itens: CHECKLIST_ETAPA_4, id: 'etapa-4' },
        { titulo: 'Etapa 5 · WhatsApp Business', itens: CHECKLIST_ETAPA_5, id: 'etapa-5' },
      ].map((bloco) => {
        const vals = checklists[bloco.id] ?? {}
        const feitos = bloco.itens.filter((i) => vals[i.id]).length
        return (
          <div
            key={bloco.id}
            className="rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-sm font-semibold text-editorial-primary">{bloco.titulo}</p>
              <p className="font-mono text-[10px] text-editorial-secondary">
                {feitos}/{bloco.itens.length}
              </p>
            </div>
            <ul className="space-y-1">
              {bloco.itens.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-2 text-xs text-editorial-secondary leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className={
                      vals[item.id] ? 'text-emerald-600' : 'text-slate-300 dark:text-[#3f3f46]'
                    }
                  >
                    {vals[item.id] ? '✓' : '○'}
                  </span>
                  <span className={vals[item.id] ? 'line-through opacity-70' : ''}>
                    {item.texto}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>

    {tudoMarcado && (
      <div className="mt-6 rounded-[14px] bg-purple-50/80 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 p-5 text-center">
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
