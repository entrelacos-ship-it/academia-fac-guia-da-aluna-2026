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
        <p>Crie uma senha forte e confirme o código que chegar por SMS ou e-mail.</p>
      </StepCard>
      <StepCard numero={5}>
        <p>Pule as sugestões de amigos, se preferir.</p>
      </StepCard>
      <Callout tipo="atencao">
        Proteja a conta: vá em Configurações, Central de Contas, Senha e segurança, Autenticação de
        dois fatores e ative. Quem perde o acesso ao perfil pessoal perde também a Página.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        2.2 · Criar a Página profissional
      </h4>
      <p className="text-sm text-editorial-primary leading-relaxed">
        Existem dois caminhos. Escolha um.
      </p>
      <div className="rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 sm:p-5 space-y-2 shadow-2xs">
        <p className="font-sans font-semibold text-sm text-editorial-primary">
          Caminho A · Pelo Instagram (mais simples, já cria conectado)
        </p>
        <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed">
          Faça primeiro a Etapa 3 até a conta profissional e, na Etapa 4, escolha Criar Página do
          Facebook.
        </p>
      </div>
      <div className="rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 sm:p-5 space-y-3 shadow-2xs">
        <p className="font-sans font-semibold text-sm text-editorial-primary">
          Caminho B · Pelo computador (mais completo)
        </p>
        <div className="flex justify-center py-2">
          <IlustracaoCriarPaginaPC />
        </div>
        <div className="space-y-3 pt-2">
          <StepCard numero={1}>
            <p>Acesse a página de criação.</p>
            <LinkButton href="https://www.facebook.com/pages/create">
              Criar Página no Facebook
            </LinkButton>
          </StepCard>
          <StepCard numero={2}>
            <p>
              Em <strong>Nome da Página</strong>, use o mesmo nome do campo Nome do Instagram.
              Exemplo: Marina Alves | Psicóloga Online.
            </p>
          </StepCard>
          <StepCard numero={3}>
            <p>
              Em <strong>Categoria</strong>, digite <strong>Psicólogo</strong> e selecione.
            </p>
          </StepCard>
          <StepCard numero={4}>
            <p>
              Em <strong>Bio</strong>, cole a linha 1 e a linha 2 da sua bio (a da Página é curta).
            </p>
          </StepCard>
          <StepCard numero={5}>
            <p>
              Clique em <strong>Criar Página</strong>.
            </p>
          </StepCard>
          <StepCard numero={6}>
            <p>
              Adicione a <strong>foto de perfil</strong>: a mesma do Instagram.
            </p>
          </StepCard>
          <StepCard numero={7}>
            <p>
              Adicione a <strong>foto de capa</strong>: uma imagem simples com a sua frase de
              posicionamento. Pode criar no Canva.
            </p>
          </StepCard>
          <StepCard numero={8}>
            <p>
              Preencha <strong>Contato</strong>: WhatsApp, e-mail profissional, cidade ou
              "atendimento online" e horário.
            </p>
          </StepCard>
          <StepCard numero={9}>
            <p>
              Clique em <strong>Concluído</strong>.
            </p>
          </StepCard>
        </div>
      </div>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        2.3 · Botão de WhatsApp na Página
      </h4>
      <div className="flex justify-center py-2">
        <IlustracaoBotaoWhatsappPagina />
      </div>
      <StepCard numero={1}>
        <p>
          Na sua Página, toque em <strong>Adicionar botão</strong> (ou{' '}
          <strong>Editar botão de ação</strong>).
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Escolha <strong>Enviar mensagem pelo WhatsApp</strong>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>Digite o número que vai usar com pacientes e confirme o código.</p>
      </StepCard>
      <StepCard numero={4}>
        <p>Salve. O botão aparece no topo da Página.</p>
      </StepCard>
      <Callout tipo="etica">
        Na Página não entram preço, promoção, promessa de resultado nem depoimento de paciente. O
        valor é informado na conversa, com quem te procurou.
      </Callout>
    </div>

    <div className="mt-6">
      <StuckBox
        solucoes={[
          'Não acho o botão para criar Página: no app, toque no menu (☰), depois em Páginas e Criar.',
          "A categoria Psicólogo não aparece: tente 'Psicoterapeuta' ou 'Serviço de saúde mental'.",
          'O Facebook pediu documento: isso acontece às vezes em contas novas. Siga as instruções da tela e volte depois.',
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
        O Instagram é a sua vitrine, o consultório antes do consultório. Mesmo quem chega por
        indicação abre o seu perfil antes de mandar mensagem. A regra que guia tudo aqui é a dos 5
        segundos: quem chega precisa entender o que você faz, para quem, e como agendar.
      </p>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        3.1 · Criar a conta (só se ainda não tiver)
      </h4>
      <StepCard numero={1}>
        <p>
          Baixe o Instagram na App Store ou no Google Play. No computador, acesse pelo link oficial.
        </p>
        <LinkButton href="https://www.instagram.com">Abrir o Instagram</LinkButton>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Toque em <strong>Criar nova conta</strong>.
        </p>
      </StepCard>
      <StepCard numero={3}>
        <p>Cadastre com celular ou e-mail, de preferência um e-mail só da clínica.</p>
      </StepCard>
      <StepCard numero={4}>
        <p>Informe nome, data de nascimento e uma senha forte.</p>
      </StepCard>
      <StepCard numero={5}>
        <p>
          Escolha o @: fácil de falar em voz alta, sem números aleatórios. A Bio do Manifesto sugere
          opções.
        </p>
      </StepCard>
      <Callout tipo="dica">
        Já tem um Instagram pessoal com a sua vida privada? Crie uma conta separada para a clínica:
        no perfil, toque no seu @ no topo da tela, depois em Adicionar conta do Instagram e Criar
        nova conta. Você alterna entre as duas sem sair do app.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">
        3.2 · Transformar em conta profissional
      </h4>
      <div className="py-1">
        <MenuPath passos={['☰', 'Tipo de conta e ferramentas', 'Mudar para conta profissional']} />
      </div>
      <div className="flex justify-center py-2">
        <IlustracaoMudarParaProfissional />
      </div>
      <StepCard numero={1}>
        <p>
          Vá ao seu perfil e toque nas <strong>três linhas (☰)</strong> no canto superior direito.
        </p>
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
      <StepCard numero={4}>
        <p>
          Busque a categoria <strong>Psicólogo</strong> e ative <strong>Exibir no perfil</strong>.
        </p>
      </StepCard>
      <StepCard numero={5}>
        <p>
          Escolha <strong>Criador de conteúdo</strong> e toque em <strong>Avançar</strong>.
        </p>
      </StepCard>
      <StepCard numero={6}>
        <p>Na tela de contato, pode pular: o WhatsApp vai pelo link.</p>
        <LinkButton href="https://help.instagram.com/2358103564437429">
          Central de Ajuda do Instagram
        </LinkButton>
      </StepCard>
      <Callout tipo="dica">
        Criador ou Comercial? Para psicóloga autônoma, Criador de conteúdo é o padrão do Método FAC.
        A Comercial faz sentido para clínica com equipe ou para quem quer telefone e endereço como
        botões no perfil. Dá para trocar depois.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.3 · A anatomia do perfil</h4>
      <div className="flex justify-center py-2">
        <IlustracaoAnatomiaPerfil />
      </div>
      <p className="text-sm text-editorial-primary leading-relaxed">
        Seu perfil tem nove itens, de cima para baixo, na ordem em que o olho percorre a tela. Cada
        um tem uma função.
      </p>

      {/* Cartões no celular (sm:hidden) */}
      <div className="sm:hidden space-y-2.5">
        {TABELA_ANATOMIA.map((row) => (
          <div
            key={row.item}
            className="rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-3 space-y-1 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-sans font-semibold text-xs text-editorial-primary">
                {row.item}
              </span>
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                {row.funcao}
              </span>
            </div>
            <p className="text-xs text-editorial-secondary leading-relaxed">{row.estrategia}</p>
          </div>
        ))}
      </div>

      {/* Tabela em telas maiores (hidden sm:block) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#27272A]">
              <th className="text-left py-2 pr-3 font-sans font-semibold text-editorial-primary w-1/4">
                Item
              </th>
              <th className="text-left py-2 pr-3 font-sans font-semibold text-editorial-primary w-1/4">
                Função
              </th>
              <th className="text-left py-2 font-sans font-semibold text-editorial-primary">
                Melhor estratégia
              </th>
            </tr>
          </thead>
          <tbody>
            {TABELA_ANATOMIA.map((row) => (
              <tr key={row.item} className="border-b border-slate-100 dark:border-[#18181B]">
                <td className="py-2.5 pr-3 font-mono text-editorial-primary align-top whitespace-nowrap">
                  {row.item}
                </td>
                <td className="py-2.5 pr-3 font-medium text-editorial-primary align-top">
                  {row.funcao}
                </td>
                <td className="py-2.5 text-editorial-secondary leading-relaxed">
                  {row.estrategia}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.4 · Foto, campo Nome e @</h4>
      <div className="flex justify-center py-2">
        <IlustracaoFotoENome />
      </div>
      <StepCard numero={1}>
        <p>
          No perfil, toque em <strong>Editar perfil</strong>.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>
          Toque em <strong>Editar foto</strong> e escolha a foto com o rosto visível.
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

      {/* Tabela em telas maiores */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#27272A]">
              <th className="text-left py-2 pr-3 font-sans font-semibold text-editorial-primary w-1/3">
                Destaque
              </th>
              <th className="text-left py-2 font-sans font-semibold text-editorial-primary">
                Pergunta do paciente que ele responde
              </th>
            </tr>
          </thead>
          <tbody>
            {TABELA_DESTAQUES.map((row) => (
              <tr key={row.destaque} className="border-b border-slate-100 dark:border-[#18181B]">
                <td className="py-2 pr-3 font-mono text-editorial-primary align-top whitespace-nowrap">
                  {row.destaque}
                </td>
                <td className="py-2 text-editorial-secondary leading-relaxed">"{row.pergunta}"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StepCard numero={1}>
        <p>
          Peça à <strong>Arquiteta da Vitrine</strong> a Etapa 2: ela escreve o roteiro de 3 a 5
          stories para cada destaque.
        </p>
      </StepCard>
      <StepCard numero={2}>
        <p>Publique o primeiro story do destaque "Comece por aqui".</p>
      </StepCard>
      <StepCard numero={3}>
        <p>
          Abra o story publicado e toque em <strong>Destacar</strong>.
        </p>
      </StepCard>
      <StepCard numero={4}>
        <p>
          Toque em <strong>Novo</strong>, escreva o nome do destaque e toque em{' '}
          <strong>Adicionar</strong>.
        </p>
      </StepCard>
      <StepCard numero={5}>
        <p>
          Para trocar a capa: segure o dedo sobre o destaque, toque em{' '}
          <strong>Editar destaque</strong> e depois em <strong>Editar capa</strong>.
        </p>
      </StepCard>
      <StepCard numero={6}>
        <p>Repita para os outros cinco. Use o mesmo estilo de capa em todos.</p>
      </StepCard>
      <Callout tipo="dica">
        Também dá para criar destaque com stories antigos: no perfil, toque em Novo (o círculo com
        +) abaixo da bio e escolha no seu arquivo.
      </Callout>
    </div>

    <div className="mt-6 space-y-4">
      <h4 className="font-serif text-lg text-editorial-primary">3.8 · Os três posts fixados</h4>
      <div className="flex justify-center py-2">
        <IlustracaoPostsFixados />
      </div>

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

      {/* Tabela em telas maiores */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#27272A]">
              <th className="text-left py-2 pr-3 font-sans font-semibold text-editorial-primary w-1/2">
                Fixado
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
