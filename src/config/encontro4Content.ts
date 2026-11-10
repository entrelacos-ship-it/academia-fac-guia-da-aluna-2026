// ─────────────────────────────────────────────────────────────
// Encontro 4 · Aula 5 · Canais: Facebook, Instagram e WhatsApp Business
// Constantes dos GPTs e os três prompts completos da aula.
//
// As constantes abaixo serão preenchidas pela Tati com os links
// reais dos GPTs. Enquanto estiverem no valor padrão, o botão
// "Abrir no ChatGPT" fica oculto e só o prompt na tela aparece.
// ─────────────────────────────────────────────────────────────

export const GPT_BIO_MANIFESTO = 'COLE_AQUI_O_LINK_DO_GPT'
export const GPT_ARQUITETA_VITRINE = 'COLE_AQUI_O_LINK_DO_GPT'
export const GPT_ROTEIRISTA_WHATSAPP = 'COLE_AQUI_O_LINK_DO_GPT'

// Caixa 1 · Bio do Manifesto: texto oficial verbatim fornecido pela usuária.
export const PROMPT_BIO_MANIFESTO = `### 🎯 OBJETIVO

Criar **biografias otimizadas para Instagram**, com foco em:

* Aumentar o número de seguidores
* Fortalecer o posicionamento de marca pessoal
* Atrair clientes em potencial
* Gerar mais engajamento e faturamento

---

### 🧠 MINHA EXPERTISE

Sou um especialista com:

* Mais de **8 anos de experiência** em copywriting, social media e SEO.
* Criação de **+5000 biografias personalizadas**.
* Resultados comprovados: aumento de seguidores e faturamento dos clientes.

---

### ✍️ FORMATO PADRÃO DA BIOGRAFIA

**Cada biografia é composta por 3 linhas, com até 9 palavras cada, seguindo esta estrutura:**

1️⃣ **Linha 1 – O que eu faço / Minha especialidade**
🟢 Direto ao ponto. Sem clichês. Mostra com clareza o que você entrega.

2️⃣ **Linha 2 – O que eu prometo / Geração de Desejo**
🟢 Mostra a transformação que você gera. Foco no benefício principal.

3️⃣ **Linha 3 – CTA Estratégico**
🟢 Um convite claro para ação, sem usar termos genéricos como "siga-me".

> Cada linha começa com um **emoji**, tornando a bio mais escaneável e visual.

---

### 🧪 EXEMPLO DE BIO:

**Nome:** Bruno Francisco
📌 Linha 1: Especialista em Criação de Conteúdo com ChatGPT.
🚀 Linha 2: Te mostro como dobrar seu engajamento usando essa IA.
👉 Linha 3: Quer aprender isso hoje de graça? Clique em seguir!

---

### ✅ APÓS A ENTREGA DAS 3 BIOGRAFIAS, SEMPRE EXIBO ESTAS OPÇÕES:

{
1 - Gostou de alguma BIOGRAFIA ESPECÍFICA dos 3 exemplos acima?

2 - Quero melhorar a BIO (Selecione a opção)

3 - Dê a sua visão como COPYWRITER apontando erros na bio de número (Selecione a opção)

4 - Vamos trabalhar um refinamento na BIOGRAFIA (Selecione a opção)
}

---

### 💬 AGORA É COM VOCÊ!

Me envie a sua **PROPOSTA DE VALOR** e vamos criar juntos a biografia perfeita para o seu Instagram.`

// Caixas 2 e 3 continuam aguardando o texto verbatim definitivo da usuária.
export const PROMPT_ARQUITETA_VITRINE = ''
export const PROMPT_ROTEIRISTA_WHATSAPP = ''

// ─────────────────────────────────────────────────────────────
// Exemplos de Bio de Inspiração (para Etapa 3.5 e Etapa 6)
// Estrutura de 3 linhas do método FAC:
// Linha 1: Para quem e qual transformação
// Linha 2: Autoridade (formação, abordagem, CRP, formato)
// Linha 3: Convite ético para o próximo passo
// Limite estrito: até 150 caracteres (regra nativa do Instagram).
// Zero travessões (regra editorial do projeto).
// ─────────────────────────────────────────────────────────────
export interface ExemploBioDef {
  id: string
  foco: string
  publicoAbordagem: string
  linha1: string
  linha2: string
  linha3: string
  explicacao: string
}

export const EXEMPLOS_BIOS_INSPIRACAO: ExemploBioDef[] = [
  {
    id: 'bio-ansiedade-exaustao',
    foco: 'Ansiedade e sobrecarga em mulheres',
    publicoAbordagem: 'Mulheres adultas, TCC e Terapia Focada na Compaixão',
    linha1: 'Para mulheres exaustas que querem voltar a ter paz',
    linha2: 'Psicóloga Clínica · TCC · CRP 06/000000 · Online',
    linha3: 'Agende sua conversa inicial 👇',
    explicacao: 'Foco em aliviar o cansaço mental e a sensação de carregar tudo sozinha.',
  },
  {
    id: 'bio-terapia-casais',
    foco: 'Relacionamento e terapia de casal',
    publicoAbordagem: 'Casais e vínculos, Abordagem Sistêmica',
    linha1: 'Ajudando casais a conversarem sem brigar e se ferir',
    linha2: 'Psicóloga · Terapia de Casal · CRP 06/000000 · Online',
    linha3: 'Dê o primeiro passo no link 👇',
    explicacao: 'Diálogo sem acusação e reconstrução de parceria afetiva.',
  },
  {
    id: 'bio-luto-perdas',
    foco: 'Acolhimento no luto e transições de vida',
    publicoAbordagem: 'Adultos enlutados, Fenomenologia Existencial',
    linha1: 'Acolho quem vive a dor de uma perda ou despedida',
    linha2: 'Psicóloga · Luto e Vínculos · CRP 06/000000 · Online',
    linha3: 'Converse comigo no WhatsApp 👇',
    explicacao: 'Linguagem respeitosa, sem pressa de curar e acolhendo o tempo de cada pessoa.',
  },
  {
    id: 'bio-terapia-homens',
    foco: 'Terapia para homens e saúde emocional masculina',
    publicoAbordagem: 'Homens adultos, Psicanálise e Clínica Ampliada',
    linha1: 'Espaço seguro para homens falarem sobre angústias e peso',
    linha2: 'Psicóloga Clínica · CRP 06/000000 · Atendimento Online',
    linha3: 'Agende seu horário aqui 👇',
    explicacao:
      'Quebra a barreira de que homem não faz terapia com acolhimento direto e confidencial.',
  },
  {
    id: 'bio-adolescentes-pais',
    foco: 'Adolescentes e orientação de pais',
    publicoAbordagem: 'Jovens e famílias, Psicologia do Desenvolvimento',
    linha1: 'Apoio para adolescentes e ponte de escuta com os pais',
    linha2: 'Psicóloga · CRP 06/000000 · Consultas Online e Presencial',
    linha3: 'Fale comigo no WhatsApp 👇',
    explicacao: 'Mostra cuidado tanto com o jovem quanto com os responsáveis que contratam.',
  },
  {
    id: 'bio-autoestima-limites',
    foco: 'Autoestima, limites e perfeccionismo',
    publicoAbordagem: 'Adultos com cobrança interna alta, Abordagem Humanista',
    linha1: 'Para quem cansa de agradar a todos e se deixar por último',
    linha2: 'Psicóloga · Humanista · CRP 06/000000 · Terapia Online',
    linha3: 'Inicie sua psicoterapia 👇',
    explicacao: 'Identificação imediata de quem tem dificuldade de dizer não sem culpa.',
  },
]
