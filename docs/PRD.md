# Product Requirements Document (PRD) — Academia FAC

**Produto:** Academia FAC — Guia da Aluna & Hub de Aplicações Clínicas  
**Metodologia e Marca:** Método FAC (Fundação, Atração e Conexão) · Entrelaços Psicologia  
**Data:** Março de 2025  
**Versão do Documento:** 1.0.0 (Alinhada ao release da aplicação v0.0.81)  
**Status:** Documento Vivo / Produto em Produção  
**Autor:** Documentação de Produto & Engenharia (Skip Cloud / Entrelaços Psicologia)

---

## Sumário Navegável

1. [Visão Geral e Contexto](#1-visão-geral-e-contexto)
   - 1.1 Proposta de Valor e Propósito
   - 1.2 Público-Alvo e Persona Clínica
   - 1.3 A Lógica Invertida de Precificação do Método FAC
   - 1.4 A Tríade Metodológica: Fundação, Atração e Conexão
2. [Arquitetura de Produto, Acesso e Autenticação](#2-arquitetura-de-produto-acesso-e-autenticação)
   - 2.1 Modelo de Ciclo de Vida da Conta (Ativação Imediata)
   - 2.2 Política de Acesso Escalonado (Aula Magna Aberta vs. Aluna Validada)
   - 2.3 Fluxo de Validação de Matrícula ("Já sou aluna?")
   - 2.4 Matriz de Liberação Dinâmica de Peças (`fac_hub_items`)
   - 2.5 Mapa de Rotas do Produto
   - 2.6 Persistência Híbrida: Local, Namespaced e Sincronização em Nuvem
3. [Módulos Funcionais e Especificações Detalhadas](#3-módulos-funcionais-e-especificações-detalhadas)
   - 3.1 Hub Central (`/`)
   - 3.2 Guia da Aluna & Caderno do Encontro 1 (`/guia`)
   - 3.3 Diagnóstico FAC v2
   - 3.4 Calculadora de Precificação Clínica FAC (`/calculadora`)
   - 3.5 Meu IKIGAI (`/ikigai`)
   - 3.6 Skills & Agentes Clínicos (Mentora-FAC)
   - 3.7 Painel Administrativo (`/admin`)
   - 3.8 Perfil, Segurança e Gestão de Credenciais (`/perfil`)
4. [Design System e Princípios de UX/UI](#4-design-system-e-princípios-de-uxui)
   - 4.1 Direção de Arte Editorial ("Astral")
   - 4.2 Tipografia Oficial e Hierarquia Escalar
   - 4.3 Paleta Cromática e Uso Intencional do Roxo
   - 4.4 Superfícies, Divisórias Hairline e Rolagem Minimalista
   - 4.5 Modos Claro e Escuro (WCAG AA)
   - 4.6 Responsividade e Filosofia Mobile-First
5. [Diretrizes Éticas e Regras de Conteúdo](#5-diretrizes-éticas-e-regras-de-conteúdo)
   - 5.1 Regra Fundamental de Contagem Dinâmica (Anti-Hardcoding)
   - 5.2 Integridade Verbatim dos Textos Metodológicos
   - 5.3 Blindagem e Sigilo de Pacientes (Sem Dados Clínicos na IA/Nuvem)
   - 5.4 Disclaimers Pedagógicos e Éticos Mandatórios
6. [Stack Técnica e Arquitetura de Backend](#6-stack-técnica-e-arquitetura-de-backend)
   - 6.1 Frontend (SPA)
   - 6.2 Backend: PocketBase / Skip Cloud
   - 6.3 Coleções de Banco de Dados Ativas
   - 6.4 Server-Side Logic: pb_hooks e Automações
   - 6.5 Ativos de Marca, Logotipos e Favicon
7. [Métricas de Sucesso e Critérios de Aceite](#7-métricas-de-sucesso-e-critérios-de-aceite)
   - 7.1 Indicadores Globais de Sucesso (KPIs)
   - 7.2 Critérios de Aceite por Módulo
8. [Roadmap, Limitações e Pendências Conhecidas](#8-roadmap-limitações-e-pendências-conhecidas)

---

## 1. Visão Geral e Contexto

### 1.1 Proposta de Valor e Propósito

A **Academia FAC** é o ambiente digital integrado de formação e suporte operacional continuado para psicólogas e psicólogos clínicos, desenvolvido pela **Entrelaços Psicologia** sob a condução metodológica da mentora Tati.

O produto nasceu para superar a histórica vulnerabilidade financeira e operacional de terapeutas autônomas, oferecendo ferramentas de tomada de decisão baseadas em matemática transparente, modelos éticos alinhados às diretrizes do Conselho Federal de Psicologia (CFP) e uma trilha de encontros ao longo do ciclo de formação.

### 1.2 Público-Alvo e Persona Clínica

- **Público Principal:** Psicólogas(os) autônomas(os), em transição de carreira (saída de regime CLT ou plataformas de intermediação para consultório próprio) ou com consultórios estabelecidos que buscam consolidação, previsibilidade financeira e sustentabilidade ética.
- **Dores Centrais:**
  - Insegurança ao precificar a sessão clínica, praticando honorários insuficientes para o próprio custo de vida.
  - Sobrecarga de trabalho e risco iminente de burnout por atender excesso de pacientes sem margem de descanso ou reserva técnica.
  - Insegurança na comunicação e negociação com pacientes ao reajustar honorários anualmente ou cobrar faltas.
  - Dificuldade em definir nicho e propósito clínico autoral sem recorrer a fórmulas genéricas de marketing digital.

### 1.3 A Lógica Invertida de Precificação do Método FAC

A precificação tradicional de mercado parte de uma pesquisa genérica de concorrentes ("quanto cobram na minha região?") ou tabelas orientativas sem lastro no custo real da profissional.

O **Método FAC inverte essa lógica:**

1. **Ponto de Partida:** O custo real e digno de vida pessoal da psicóloga somado aos custos fixos e variáveis de funcionamento do seu consultório e formação contínua.
2. **Definição do Pró-Labore:** Quanto a profissional precisa retirar mensalmente para ter qualidade de vida e remuneração justa.
3. **Margens Técnicas:** Aplicação de Provisão de Reserva Técnica (capital de giro, 13º salário, férias e capacitação) e Provisão Tributária real (Carnê-Leão PF ou Simples Nacional PJ com Fator R).
4. **Capacidade Clínica Humana:** Consideração do teto de atendimentos semanais sustentáveis, descontando matematicamente o absenteísmo clínico (taxa de no-show/faltas).
5. **Resultado Final:** O **Piso Ético FAC por Sessão**, abaixo do qual a clínica opera em subsídio pessoal ou déficit estrutural.

### 1.4 A Tríade Metodológica: Fundação, Atração e Conexão

Toda a arquitetura da Academia se apoia no cubo tridimensional FAC:

- **F — Fundação:** A base estrutural do consultório. Precificação ética, reserva de segurança, enquadramento fiscal, rotinas financeiras, contratos de atendimento e organização operacional.
- **A — Atração:** O posicionamento ético e a clareza de mensagem. Como a psicóloga se apresenta, seus canais de escuta, autoria, comunicação e chegada de novos pacientes sem sensacionalismo.
- **C — Conexão:** A sustentabilidade do vínculo terapêutico. Contrato de trabalho, política de faltas e férias, manejo de reajustes anuais, adesão ao processo e alinhamento de expectativas clínicas.

---

## 2. Arquitetura de Produto, Acesso e Autenticação

### 2.1 Modelo de Ciclo de Vida da Conta (Ativação Imediata)

Diferente de sistemas legados que deixavam novos cadastros com status "pendente", na Academia FAC **toda conta recém-criada nasce ATIVA (`is_active = true`)** de forma obrigatória e auditável.

- **Regra de Backend (`on_user_before_create_active.js`):** Qualquer tentativa de inserção na coleção `users` tem o campo `is_active` forçado para `true`.
- **Regra de Autenticação (`on_user_auth_check_active.js`):** Na autenticação via senha ou token (`authWithPassword`), o backend valida se a conta está ativa. Caso `is_active === false` (desativação manual prévia por uma administradora), o login é bloqueado com erro 403 amigável.
- **Experiência da Usuária:** Uma nova visitante que se cadastra acessa a plataforma de imediato, sem atritos ou necessidade de aprovação humana manual para conhecer o ecossistema.

### 2.2 Política de Acesso Escalonado (Aula Magna Aberta vs. Aluna Validada)

A plataforma opera um modelo de acesso progressivo:

1. **Nível Visitante / Conta Inicial Ativa:**
   - Acesso liberado ao Hub inicial (`/`).
   - Acesso integral ao **Encontro 1 (Aula Magna)** no Guia da Aluna (`/guia`), concebido como caderno editorial rico e aberto.
   - Realização e emissão do **Diagnóstico FAC v2** com radar, notas e geração de PDF.
   - Navegação em materiais públicos e tutoriais.
2. **Nível Aluna Validada (Matrícula Ativa no Guia):**
   - Desbloqueio dos encontros seguintes da trilha (Encontro 2 em diante).
   - Desbloqueio e acesso à **Calculadora de Precificação Clínica FAC** (`/calculadora`).
   - Desbloqueio do aplicativo **Meu IKIGAI** (`/ikigai`).
   - Desbloqueio para download e cópia das **Skills de IA (Mentora-FAC)**.

### 2.3 Fluxo de Validação de Matrícula ("Já sou aluna?")

Para alunas regularmente matriculadas na turma da Academia FAC, a ativação dos recursos restritos ocorre por meio de verificação via código de e-mail transacional (OTP):

```
[ Usuária no Hub ou Guia ]
         │
         ▼
[ Clica em "Já sou aluna? Validar e-mail" ]
         │
         ▼
[ Digita o e-mail da matrícula ] ──► POST /api/guia/solicitar-codigo
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         [ E-mail NÃO matriculado ]                      [ Matrícula Encontrada Ativa ]
                      │                                               │
             Retorna erro 404:                               Gera código de 6 dígitos
        "E-mail não encontrado entre                        Expira em 30 minutos
          as alunas matriculadas"                            Salva em fac_matriculas
                                                             Dispara e-mail via Brevo/SMTP
                                                                      │
                                                                      ▼
                                                         [ Usuária recebe o código ]
                                                                      │
                                                                      ▼
                                                         [ Digita no modal do app ]
                                                                      │
                                                                      ▼
                                                         POST /api/guia/confirmar-codigo
                                                                      │
                                       ┌──────────────────────────────┴──────────────────────────────┐
                                       ▼                                                             ▼
                           [ Código incorreto ]                                         [ Código correto & válido ]
                                       │                                                             │
                            Incrementa tentativas                                         Limpa código e expiração
                            (Máximo de 5 tentativas)                                      Registra log de auditoria
                            Se > 5: bloqueia código                                       Gera sessão local:
                                                                                          - aluna_guia_sessao_v1
                                                                                          - Libera Calculadora e IKIGAI
```

### 2.4 Matriz de Liberação Dinâmica de Peças (`fac_hub_items`)

Cada funcionalidade exibida nos blocos e abas do Hub Central é gerenciada dinamicamente pela coleção de banco `fac_hub_items`:

- **Campos da Peça:** `chave` (ID único, ex.: `calculadora`, `ikigai`, `mentora_fac`), `titulo`, `descricao`, `categoria` (`aplicativos`, `skills`, etc.), `rota`, `ordem`, `ativo` (boolean), `rotulo_badge` (texto editável), `exclusivo_alunas` (boolean).
- **Peça Ativa (`ativo = true`):** Exibida com card interativo clicável. Se `exclusivo_alunas === true` e a usuária não for aluna validada, o card exibe o selo dourado "Exclusivo alunas" e, ao clicar, abre o modal de validação com feedback contextual.
- **Peça Inativa (`ativo = false`):** Exibida em tom atenuado com o selo editorial cinza **"Em breve"**, impossibilitando acesso acidental antes da homologação da mentora.

### 2.5 Mapa de Rotas do Produto

| Rota           | Componente                | Descrição / Finalidade                                                 | Nível de Acesso                                  |
| -------------- | ------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------ |
| `/`            | `HubPage.tsx`             | Hub Central: Guia em destaque, aplicativos, skills, checkout Kirvano   | Aberto / Visitante                               |
| `/guia`        | `GuiaPage.tsx`            | Guia da Aluna: Caderno do Encontro 1, Trilha dinâmica de encontros     | Encontro 1 aberto; Encontros 2+ exigem matrícula |
| `/calculadora` | `Index.tsx`               | Calculadora de Precificação Clínica do Método FAC (Wizard em 8 passos) | Aluna Validada                                   |
| `/ikigai`      | `IkigaiPage.tsx`          | Meu IKIGAI da Psicóloga: Descoberta autoral em 3 momentos              | Aluna Validada                                   |
| `/perfil`      | `ProfileSettingsPage.tsx` | Perfil da usuária, dados cadastrais e alteração segura de senha        | Usuária Autenticada                              |
| `/admin`       | `AdminDashboard.tsx`      | Gestão de Matrículas, Peças, Encontros, Contas e Auditoria             | Administradora (`role = admin`)                  |
| `/login`       | `AuthScreen.tsx`          | Tela de autenticação direta da conta                                   | Aberto                                           |
| `*`            | `NotFound.tsx`            | Página 404 com redirecionamento amigável para o Hub                    | Aberto                                           |

### 2.6 Persistência Híbrida: Local, Namespaced e Sincronização em Nuvem

O produto implementa uma arquitetura robusta de armazenamento em 3 níveis:

1. **Isolamento Namespaced por Conta (`userStorage.ts`):** Para evitar contaminação de dados quando mais de uma pessoa utiliza o mesmo navegador, cada chave local é prefixada com o ID da usuária ativa (`fac_u_${userId}_${key}`).
2. **Sincronização em Nuvem (`fac_backups`):** Quando a usuária está autenticada, alterações na Calculadora e no IKIGAI são sincronizadas na coleção de backups da conta, permitindo restauração transparente entre dispositivos.
3. **Privacidade Estrita do Diagnóstico FAC:** Conforme preceito metodológico inegociável, as respostas do Diagnóstico FAC v2 **nunca são enviadas para o servidor**, permanecendo estritamente no armazenamento local do navegador da profissional (`localStorage`).

---

## 3. Módulos Funcionais e Especificações Detalhadas

### 3.1 Hub Central (`/`)

O Hub é a página inicial e porta de entrada da Academia:

- **Cabeçalho Editorial:** Identificação da Academia FAC e Entrelaços Psicologia, indicador de status da nuvem, alternador de tema (claro/escuro), atalhos de perfil e botão de validação de aluna ("Já sou aluna?").
- **Card Hero — Guia da Aluna em Destaque:** Bloco editorial com visual nobre em degradê ametista, apresentando a trilha formativa do ciclo, botão de acesso direto ao caderno do Encontro 1 e cubo 3D representativo da tríade.
- **Bloco "Aplicativos e Recursos Clínicos":**
  - Navegação por abas dinâmicas: **"Aplicativos"** e **"Skills"** (arquitetura extensível para novas categorias).
  - Cards launcher das ferramentas:
    - _Calculadora de Precificação Clínica FAC_ (Passo a passo, piso ético, simuladores e contratos).
    - _Meu IKIGAI da Psicóloga_ (4 círculos, 4 encontros, declaração de missão autoral).
    - _Mentora do FAC (Skill de IA)_ (Prompt mestre e diretrizes completas em Markdown).
  - Estados dos cards:
    - Selo _"Exclusivo alunas"_ para peças restritas a matrículas ativas.
    - Selo _"Em breve"_ e desativação de clique para peças com `ativo = false` no banco.
- **Seção de Conversão / Convite Institucional:**
  - Bloco de fechamento da página: _"Pronta para continuar seu percurso?"_.
  - Botão de ação em destaque: **"Entrar na Academia FAC"**, direcionando externamente para o checkout oficial da Kirvano em nova aba (`target="_blank"`, `rel="noopener noreferrer"`):
    `https://pay.kirvano.com/36c1a314-0dc2-4bc8-9287-79fb1e804b06`.

### 3.2 Guia da Aluna & Caderno do Encontro 1 (`/guia`)

O Guia organiza o percurso formativo da psicóloga:

- **Estrutura de Navegação:**
  - Topo com atalho rápido direto para a âncora do Diagnóstico FAC (`#diagnostico-fac`).
  - Trilha lateral de encontros (menu expansível/ocultável no desktop, com preferência gravada no navegador; gaveta drawer otimizada no mobile).
  - Exibição dinâmica de status dos encontros: _Publicado (Aberto ou Restrito)_, _Em breve_ e _Rascunho_.
- **Caderno da Aula Magna (Encontro 1) — Experiência Editorial Completa:**
  1. _Abertura Editorial & Pergunta Norteadora:_ "Como construir uma clínica sustentável, ética e alinhada ao meu propósito de vida?".
  2. _Antes de Começar:_ Preparação mental, espaço de estudo e contrato de presença.
  3. _Percurso em 5 Passos:_ Roteiro visual da experiência de aprendizagem.
  4. _O Método FAC e o Cubo Interativo:_ Seletor visual das faces **F** (Fundação), **A** (Atração) e **C** (Conexão), com texto conceitual e detalhamento das 3 dimensões clínicas.
  5. _Seção Integrada do Diagnóstico FAC v2:_ Questionário completo incorporado no corpo da aula.
  6. _Guia Prático do ChatGPT:_ Recomendações de uso seguro de modelos de linguagem na rotina clínica, com regras rígidas de anonimização e proteção ética.
  7. _Biblioteca de Prompts Copiáveis:_ Prompts estruturados para reflexão autoral, com botão de cópia em um clique e feedback visual imediato.
  8. _Mapa Pessoal Interativo:_
     - Campos de síntese para a aluna redigir suas conclusões sobre Fundação, Atração e Conexão.
     - Botão inteligente para **puxar percentuais e leituras diretamente do Diagnóstico FAC v2** concluído.
     - Ações de copiar texto consolidado e baixar arquivo `.txt` localmente.
  9. _Encerramento & Critério de Pronto:_ Definição clara do entregável prático que a aluna deve possuir ao término da aula.
  10. _FAQ do Encontro 1:_ Dúvidas frequentes sobre o método, ferramentas e acesso.
- **Caderno do Encontro 2 ("Do sentido ao mercado") — 10 Estações Didáticas:**
  Estrutura pedagógica completa para alunas validadas, sem qualquer vínculo com o aplicativo Meu IKIGAI:
  1. _Estação 0 — Porta de entrada:_ Frase de direção da Peça 3 (com validação de avanço condicional).
  2. _Estação 1 — Sua conta no ChatGPT:_ Instruções passo a passo de configuração e uso clínico seguro.
  3. _Estação 2 — Baixe e importe as skills:_ Download de Detetive de Nicho e Posicionamento (com botões "Disponível em breve" e Plano B com SKILL.md copiado).
  4. _Estação 3 — A lente do dia:_ Mapeamento dos 5 níveis de consciência de Eugene Schwartz adaptados à clínica de psicologia.
  5. _Estação 4 — Detetive de Nicho:_ Investigação de dor latente, sintomas e montagem dinâmica de prompt limpo e copiável (sem colchetes nem travessões).
  6. _Estação 5 — Escolha a sua brecha:_ Identificação de brecha de mercado desassistida no nicho.
  7. _Estação 6 — Ficha de público-alvo:_ Seleção de pelo menos duas categorias clínicas e redação da frase de trabalho.
  8. _Estação 7 — Relatório de posicionamento:_ Geração estruturada de diretrizes de autoridade e posicionamento.
  9. _Estação 8 — Caderno de erros:_ Armadilhas comuns de comunicação clínica para evitar.
  10. _Estação 9 — Fechamento:_ Resumo exportável em `.txt`, impressão formatada de sistema, entrega da semana e opção segura "Apagar as minhas respostas".
  - _Regras de Blindagem do Encontro 2:_ Privacidade total (nenhuma resposta sai do navegador da psicóloga), caixas de cuidado clínico nas Estações 4 a 7 alertando para não identificar pacientes, suporte a Modo Aula em tela cheia e conformidade estrita de vocabulário editorial.

### 3.3 Diagnóstico FAC v2

Instrumento de autoavaliação diagnóstica clínica sem juízo de valor punitivo:

- **Estrutura do Questionário:**
  - **24 perguntas obrigatórias** distribuídas rigorosamente em 3 pilares:
    - 8 perguntas de Fundação (dimensões F1, F2, F3, F4).
    - 8 perguntas de Atração (dimensões A1, A2, A3, A4).
    - 8 perguntas de Conexão (dimensões C1, C2, C3, C4).
  - **Alternativas pontuadas de 1 a 4**, elaboradas verbatim conforme documentação metodológica.
  - **Perguntas complementares contextuais:** Momento de carreira, modalidades de atendimento, agenda de sessões atuais e desejadas.
  - **Questões abertas literais:** Reflexões sobre histórico de organização, canais de captação e pontos de perda de pacientes.
  - **Bloco Ético de Cuidado Clínico:** Perguntas reflexivas sobre condução clínica e supervisão regular.
- **Motor Analítico (`diagnosticoFacEngine.ts`):**
  - Cálculo da Média FAC Global (soma linear de pontos de 0 a 100%).
  - Ordenação combinatória dos 3 pilares (ex.: _Fundação → Conexão → Atração_ gerando 6 combinações canônicas possíveis).
  - Detalhamento escalar nas 12 dimensões da clínica.
  - Motor de alertas condicionais disparados por padrões de desequilíbrio na prática.
- **Resultado em 7 Telas / Seções:**
  1. _Visão Geral:_ Anel de progresso da Média FAC, Radar tridimensional e ordem dos pilares.
  2. _Combinação:_ Leitura editorial aprofundada da tríade específica da aluna.
  3. _Por Onde Começar:_ Pilar de partida prioritário e os dois primeiros movimentos práticos sugeridos.
  4. _Os 3 Pilares:_ Decomposição profunda de Fundação, Atração e Conexão.
  5. _12 Dimensões:_ Diagnóstico de cada uma das 12 sub-áreas clínicas com ações imediatas.
  6. _Alertas Clínicos:_ Hipóteses de observação clínica identificadas.
  7. _Síntese & Ação:_ Devolutiva literal das respostas abertas e o **Checklist dos Seis Movimentos**.
- **Geração de PDF de 1 Página (`diagnosticoPdfGenerator.ts`):**
  - Documento profissional com cabeçalho Entrelaços, anel da média, radar gráfico vetorial renderizado e checklist dos movimentos.
  - Geração instantânea pelo navegador via SVG/Canvas e PDFKit/jsPDF, com fallback para impressão de sistema.
- **Ponte Final para Skills:**
  - Ao concluir o diagnóstico, a usuária recebe direcionamento para aprofundar seu plano de 90 dias com a Mentora-FAC (com verificação de matrícula para alunas).

### 3.4 Calculadora de Precificação Clínica FAC

O principal aplicativo quantitativo da Academia, organizado em um wizard de 8 etapas:

- **Passo 0: Boas-Vindas & Tour Guiado:** Apresentação da filosofia do piso ético e onboarding interativo.
- **Passo 1: Custos Pessoais:** Levantamento de despesas de moradia, alimentação, saúde, dependentes e dignidade pessoal, com categorias personalizadas.
- **Passo 2: Custos Profissionais:** Levantamento de aluguel/sublocação, CRP, anuidade de conselhos, supervisão clínica, psicoterapia pessoal, educação continuada, softwares e ferramentas.
- **Passo 3: Retirada Desejada:** Pró-labore mensal almejado para sustento pessoal e remuneração do trabalho.
- **Passo 4: Reserva Técnica & Tributos:**
  - Percentual de Reserva Técnica FAC (habitualmente 10% a 20%) para férias remuneradas, 13º salário e segurança contra imprevistos.
  - Percentual de provisão fiscal (IRPF autônomo ou Simples Nacional).
- **Passo 5: Capacidade Clínica Sustentável:**
  - Número de sessões semanais planejadas.
  - Semanas de trabalho por mês (padrão: 4,33 semanas).
  - **Taxa de falta / absenteísmo (no-show):** Desconto estatístico das ausências sem reposição.
  - Preço atual praticado por sessão (para análise comparativa de déficit).
  - Comparativo de referência com a Tabela de Honorários do CFP (níveis inferior, médio e superior).
- **Fórmula Canônica do Método FAC:**
  $$\text{Sessões Efetivas Mensais} = (\text{Sessões Semanais} \times \text{Semanas Mês}) \times (1 - \text{Taxa Falta})$$
  $$\text{Markup Divisor} = 1 - (\text{Reserva \%} + \text{Tributos \%})$$
  $$\text{Custo Operacional Total} = \frac{\text{Custos Profissionais} + \text{Retirada Desejada}}{\text{Markup Divisor}}$$
  $$\text{Piso Ético Mínimo por Sessão} = \frac{\text{Custo Operacional Total}}{\text{Sessões Efetivas Mensais}}$$
- **Passo 6: Painel Central de Resultados (5 Submenus Especializados):**
  1. _Visão Geral:_ Piso FAC calculado, diagnóstico de lacuna de honorários (Gap Analysis), déficit mensal e anual projetado, gráfico donut de decomposição do valor da sessão.
  2. _Análises & Modelos:_ Análise de sensibilidade (matriz de preço vs. sessões necessárias) e comparativo de modelos clínicos.
  3. _Planejamento Financeiro da Psicóloga:_
     - Consolidação de Fluxo de Caixa Mensal (superávit/déficit).
     - Estruturação de Reserva de Emergência (3, 6 ou 12 meses de despesas essenciais).
     - Gestor de Metas Financeiras (aportes mensais, prioridades e prazos).
     - Projeção de Crescimento Patrimonial em 12 e 24 meses com aplicação de inflação.
  4. _Ferramentas de Formalização Clínica:_
     - _Simulador Tributário PF vs. PJ:_ Comparação detalhada entre Carnê-Leão (com Livro-Caixa) e Simples Nacional (com benefício do Fator R no Anexo III ~6% vs. Anexo V ~15,5%), calculando a economia mensal e anual do momento ideal de abertura de empresa.
     - _Módulo de Reajuste Anual por Inflação:_ Atualização de contratos clínicos existentes com índices oficiais históricos pré-configurados (IPCA 2024 a 4,83%, IGP-M, etc.), cálculo de ganho protegido e gerador de mensagem ética para envio via WhatsApp ou e-mail.
     - _Exportador de Contrato e Proposta de Honorários:_ Gerador de minutas formais completas com cláusulas do CFP, política de faltas com aviso prévio de 24h, periodicidade de pagamentos e impressão limpa formatada.
  5. _Consultor Heurístico Inteligente:_ Insights estratégicos priorizados gerados por heurística com base nas respostas da psicóloga, identificando gargalos e sugerindo ações imediatas.
- **Passo 7: Comparativo dos 4 Modelos Clínicos:**
  Comparação lado a lado entre os modelos: _Clínica Tradicional Autônoma_, _Clínica de Nicho Especializada_, _Clínica com Grupos/Oficinas_ e _Clínica de Produtos Digitais & Supervisão_.

### 3.5 Meu IKIGAI (`/ikigai`)

Aplicativo independente do Hub (bloco "Aplicativos e recursos", aba Aplicativos) para direcionamento existencial e autoral na prática clínica (não faz parte do fluxo do Encontro 2):

- **Independência em relação ao Encontro 2:** O aplicativo Meu IKIGAI é acessado de forma autônoma pelo bloco de Aplicativos do Hub, não se misturando com o caderno de 10 estações do Encontro 2 (que é dedicado ao Detetive de Nicho, skills do ChatGPT, brecha de mercado, público-alvo e relatório de posicionamento).
- **Fluxo em 3 Momentos Práticos:**
  - **Momento 1 — Escrever (Os 4 Círculos):**
    Preenchimento em tela única dos círculos fundamentais:
    1. _O que você ama fazer_ (paixão e inclinações naturais).
    2. _No que você é boa_ (habilidades clínicas consolidadas e talentos).
    3. _Do que o mundo precisa_ (demandas reais da sociedade e sofrimentos contemporâneos).
    4. _Pelo que podem te pagar_ (serviços viáveis no mercado clínico).
    - Suporte a itens favoritos (estrelas), ordenação e banco de sugestões contextuais clicáveis.
  - **Momento 2 — Conectar (As 4 Interseções):**
    Construção reflexiva dos pontos de contato:
    - _Paixão_ (Amor + Habilidade).
    - _Missão_ (Amor + Necessidade do Mundo).
    - _Vocação_ (Necessidade do Mundo + Remuneração).
    - _Profissão_ (Habilidade + Remuneração).
  - **Momento 3 — Painel & Entregáveis:**
    - Diagrama vetorial SVG interativo do IKIGAI com círculos semitransparentes e destaque de nós.
    - Redação da **Declaração de Missão Autoral** da psicóloga, com histórico de versões e restauração.
    - Exportações completas: download do diagrama em imagem PNG de alta resolução (`safeHtmlToImage`), download de resumo em texto para compartilhamento na comunidade e exportação/importação em JSON para backup.
- **Modo Apresentação:**
  - Tela limpa em tela cheia voltada para projetores ou compartilhamento de tela em mentorias ao vivo.
  - **Exemplo Fictício da Marina:** Disponível **exclusivamente no Modo Apresentação** como recurso didático para a facilitadora, sem contaminar os campos de escrita da aluna no fluxo de trabalho regular.

### 3.6 Skills & Agentes Clínicos (Mentora-FAC)

Módulo de distribuição de agentes de Inteligência Artificial personalizados para alunas:

- **Card da Mentora-FAC no Hub:**
  - Exibição na aba "Skills" do Hub Central.
  - Conteúdo em Markdown (`Mentora-FAC.md`) disponibilizado **verbatim**, conforme formulado pela coordenação do método.
- **Regras de Acesso e Gating:**
  - O download do arquivo `.md` e a cópia integral do texto são **exclusivos para alunas com matrícula validada**.
  - Usuárias sem validação visualizam a descrição do recurso e são convidadas a validar seu e-mail de matrícula.
- **Finalidade Pedagógica:**
  Instruir agentes em ferramentas como ChatGPT Plus (Custom GPTs), Claude Projects ou Cursor, permitindo que a IA atue como uma copiloto de negócios treinada especificamente na metodologia e nos valores éticos da Academia FAC.

### 3.7 Painel Administrativo (`/admin`)

Ambiente de controle restrito a usuárias com papel administrativo (`currentUser.role === 'admin'`). A interface prioriza o **Guia da Aluna em primeiro lugar** e está organizada em 5 abas operacionais:

1. **Aba "Liberação de Peças" (`fac_hub_items`):**
   - Listagem de todas as ferramentas e recursos do Hub.
   - Controle de interruptor (liga/desliga) para cada peça. Ao desligar uma peça, exige confirmação para evitar ocultação acidental.
   - Edição e gravação em tempo real dos rótulos dos badges promocionais/informativos.
   - Registro de auditoria automática a cada alteração.
2. **Aba "Matrículas" (`fac_matriculas`):**
   - CRUD completo de alunas matriculadas: criação manual, edição cadastral e exclusão.
   - Importação em lote via arquivo CSV com pré-visualização, deduplicação automática e validação de e-mails.
   - Exportação completa da base em arquivo `.csv`.
   - Gestão de status de acesso: `ativa`, `suspensa` e `expirada`.
   - Tratamento de expiração de vigência: se a data limite de acesso estiver vencida, o sistema força visualmente e operacionalmente o status `expirada`.
   - Ações em lote: suspender ou reativar múltiplas alunas com um clique.
   - **Exclusão Segura:** Modal com exigência de digitação da palavra `EXCLUIR` (validação case-insensitive com trim) antes de apagar qualquer matrícula do banco.
3. **Aba "Encontros" (`fac_guia_encontros`):**
   - Gestão da trilha de encontros do Guia da Aluna.
   - Publicação e despublicação manual de encontros (`publicado` vs. `rascunho`).
   - **Contador Dinâmico:** O contador exibe dinamicamente o número real de encontros existentes no banco (ex.: `X / N encontros publicados`), respeitando a regra de nunca fixar valores estáticos como "19 encontros".
4. **Aba "Contas" (`users`):**
   - CRUD administrativo de contas do Skip Cloud: criação de contas com senha e papel (`admin` ou `user`), edição de nome e e-mail.
   - Ativação e desativação de contas (`is_active`).
   - Redefinição manual de senha de usuárias por administradora.
   - Exclusão permanente de contas com confirmação por digitação case-insensitive de `EXCLUIR` (com proteção contra auto-exclusão da conta logada).
   - Estatísticas em tempo real de backups em nuvem gerados por usuárias.
5. **Aba "Auditoria" (`fac_auditoria`):**
   - Trilha imutável de registros operacionais com timestamp, operador, ação realizada, alvo e payload de detalhes (valores anteriores e novos).
   - Rastreamento de tentativas e falhas no envio de e-mails de validação de matrícula.

### 3.8 Perfil, Segurança e Gestão de Credenciais (`/perfil`)

- Exibição de dados da conta logada (nome, e-mail, papel de acesso e identificador).
- Formulário de alteração de senha com validação de força mínima e confirmação.
- Visualização do status da matrícula no Guia (ativa, ciclo vigente e validade).

---

## 4. Design System e Princípios de UX/UI

### 4.1 Direção de Arte Editorial ("Astral")

A identidade visual da Academia FAC rejeita deliberadamente o aspecto de "dashboard SaaS genérico", repleto de caixas pesadas, cards volumosos e sombras plásticas. A interface adota um **tom editorial sofisticado, calmo e acolhedor**, remetendo a um livro-caderno de alta qualidade onde a psicóloga estuda e toma notas sobre sua própria prática.

### 4.2 Tipografia Oficial e Hierarquia Escalar

A tipografia expressa o rigor intelectual e o cuidado humanizado da psicologia clínica:

- **Newsreader (Editorial Display / Serifada):** Empregada em títulos de seções, cabeçalhos de aulas, valores monetários principais e grandes números reflexivos. Transmite tradição acadêmica, maturidade e conforto de leitura.
- **Inter (Interface & Texto de Leitura / Sem Serifa):** Empregada em parágrafos, rótulos de formulários, botões, modais e textos de instrução. Proporciona máxima legibilidade em qualquer resolução.
- **JetBrains Mono (Monoespaçada de Apoio):** Empregada em dados tabulares, badges, códigos, indicadores de progresso (`01 / 07`), taxas percentuais e rótulos técnicos em caixa alta.

### 4.3 Paleta Cromática e Uso Intencional do Roxo

- **O Roxo como Acento Pontual:** O roxo característico da marca Entrelaços (`#7c3aed` / `#C084FC`) é utilizado de forma contida e cirúrgica — em anéis de destaque, botões de ação primária, estados ativos de navegação e halos sutis de iluminação. Nunca é utilizado como fundo massivo que sobrecarregue a visão.
- **Laranja de Atração:** `#ea580c` / `#FB923C` empregado em tags de destaque metodológico, alertas energéticos e indicadores de ação.
- **Cores Semânticas da Tríade:**
  - Fundação: Violeta / Ametista (`#8B5CF6`).
  - Atração: Âmbar / Laranja Suave (`#F28A2E`).
  - Conexão: Turquesa / Esmeralda Clínico (`#0EA5A5`).

### 4.4 Superfícies, Divisórias Hairline e Rolagem Minimalista

- **Divisórias Hairline:** As seções são delimitadas por linhas ultraleves de 1px com transparência suave (`border-border/70` ou `border-slate-200/80`), permitindo que a hierarquia seja conduzida pelo respiro em branco e pela escala tipográfica, e não pelo acúmulo de caixas sobre caixas.
- **Barras de Rolagem Minimalistas:** O CSS global implementa scrollbars discretas e ultrafinas (largura de 6px com cantos arredondados e cor semitransparente), eliminando barras cinzas pesadas nativas do navegador.

### 4.5 Modos Claro e Escuro (WCAG AA)

- **Modo Claro (Padrão):** Fundo limpo e suave em lavanda acinzentada (`#F6F6F9`), cartões brancos com contorno sutil e texto em ardósia profunda (`#0F172A` / `#18181B`), garantindo taxa de contraste superior a 8.5:1 nos textos principais e 5.5:1 nos textos secundários.
- **Modo Escuro (Astral Dark):** Ativado manualmente pela usuária, com fundo em preto ametista profundo (`#03000A`), superfícies em carvão suave (`#18181B`) e tipografia em branco puro e cinza neutro, sem causar reflexos cansativos em leituras noturnas.

### 4.6 Responsividade e Filosofia Mobile-First

- Todas as áreas de clique e toque em dispositivos móveis atendem à recomendação ergonômica mínima de **44px a 48px** de altura.
- Menus laterais extensos se convertem em gavetas inferiores (drawers) ou abas de rolagem horizontal suave no celular, evitando perda de espaço útil de leitura.
- Gráficos vetoriais (Radar, Recharts e SVG do IKIGAI) contam com regras de redimensionamento responsivo para nunca ultrapassar a largura da tela.

---

## 5. Diretrizes Éticas e Regras de Conteúdo

### 5.1 Regra Fundamental de Contagem Dinâmica (Anti-Hardcoding)

- **Proibição Estrita:** É terminantemente proibido inserir no código ou na interface números fixos para a trilha formativa (como _"19 encontros"_ ou _"19 semanas"_).
- **Comportamento Obrigatório:** A contagem de encontros deve refletir dinamicamente os registros existentes e publicados no banco de dados (`encontros.length + 1` considerando a Aula Magna). O ciclo de estudos é vivo e adaptável pela coordenação pedagógica.

### 5.2 Integridade Verbatim dos Textos Metodológicos

As 24 perguntas do Diagnóstico FAC v2, as alternativas de resposta (níveis 1 a 4), os textos das leituras combinatórias, os avisos de cuidado clínico e o conteúdo da Skill Mentora-FAC devem ser reproduzidos **verbatim**, exatamente conforme a redação oficial formulada pela mentoria da Entrelaços Psicologia.

### 5.3 Blindagem e Sigilo de Pacientes (Sem Dados Clínicos na IA/Nuvem)

- O Código de Ética Profissional do Psicólogo (Resolução CFP nº 010/2005) e a LGPD exigem sigilo absoluto sobre prontuários e identidades de pacientes.
- **Regra de Produto:** Nenhuma funcionalidade da Academia FAC (calculadoras, geradores de contrato, prompts ou integrações com IA) armazena nomes reais, históricos ou dados sensíveis de pacientes em servidores externos. No gerador de contratos, os campos de identificação são preenchidos temporariamente no navegador da psicóloga e a minuta é gerada em memória local.

### 5.4 Disclaimers Pedagógicos e Éticos Mandatórios

Todos os módulos quantitativos e avaliativos exibem ressalvas claras e visíveis:

- _Diagnóstico FAC:_ _"Instrumento de auto-observação pedagógica. O percentual descreve o padrão das respostas assinaladas, sem atribuir causa individual ou garantir resultados comerciais imediatos."_
- _Calculadora FAC:_ _"Ferramenta de planejamento orçamentário e pedagógico. Os valores calculados representam pisos matemáticos sugeridos a partir dos custos informados pela profissional, cabendo a ela a decisão final e ética sobre a cobrança de honorários."_

---

## 6. Stack Técnica e Arquitetura de Backend

### 6.1 Frontend (SPA)

- **Core:** React 18 + TypeScript + Vite.
- **Roteamento:** React Router DOM (Single Page Application com rotas cliente).
- **Estilização:** Tailwind CSS + Radix UI (shadcn/ui completo).
- **Visualização de Dados:** Recharts (gráficos de barras e linha) + SVGs nativos matemáticos (Radar FAC e IKIGAI).
- **Geração de Imagens e Documentos:** `html-to-image` (com wrapper seguro `safeHtmlToImage`), manipulação de Canvas para PDF em alta resolução e impressão via CSS `@page` / `window.print()`.

### 6.2 Backend: PocketBase / Skip Cloud

- Instância gerenciada Skip Cloud com banco de dados SQLite embarcado de altíssima performance.
- SDK cliente oficial: `pocketbase/client.ts`.
- Migrações de esquema versionadas em JavaScript (`pocketbase/migrations/`).
- Lógica servidora segura implementada em JavaScript com `pb_hooks/`.

### 6.3 Coleções de Banco de Dados Ativas

1. `users` (Coleção nativa de autenticação):
   - Contas de usuárias do sistema (`email`, `name`, `role: 'user' | 'admin'`, `is_active: bool`, `verified: bool`).
2. `fac_matriculas`:
   - Registro oficial de alunas matriculadas (`email`, `nome`, `status: 'ativa' | 'suspensa' | 'expirada'`, `ciclo`, `inicio`, `fim`, `origem`, `anotacao`, `codigo_validacao`, `codigo_expira_em`, `tentativas_codigo`).
3. `fac_hub_items`:
   - Catálogo de peças e ferramentas do Hub (`chave`, `titulo`, `descricao`, `categoria`, `rota`, `ordem`, `ativo: bool`, `rotulo_badge`, `exclusivo_alunas: bool`).
4. `fac_guia_encontros`:
   - Estrutura de encontros da trilha (`numero`, `titulo`, `subtitulo`, `status: 'publicado' | 'rascunho'`, `ordem`, `data_liberacao`).
5. `fac_backups`:
   - Backups sincronizados na nuvem por usuária (`user_id`, `data: json` contendo estado da calculadora, cenários e dados do IKIGAI).
6. `fac_auditoria`:
   - Trilha de auditoria administrativa (`operador`, `acao`, `alvo`, `motivo`, `detalhes: json`).

### 6.4 Server-Side Logic: pb_hooks e Automações

- **`on_user_before_create_active.js`:** Garante que todo novo registro de usuário seja salvo com `is_active = true`.
- **`on_user_auth_check_active.js`:** Valida no momento do login se `is_active === true`, bloqueando contas suspensas pela administração.
- **`guia_solicitar_codigo.js`:**
  - Endpoint POST `/api/guia/solicitar-codigo`.
  - Recebe e-mail, busca em `fac_matriculas` (apenas com `status === 'ativa'`).
  - Gera código OTP de 6 dígitos numéricos.
  - Define janela de validade estrita de **30 minutos**.
  - Zera contador de tentativas (`tentativas_codigo = 0`).
  - Dispara e-mail transacional estilizado em HTML via Brevo / SMTP do PocketBase.
- **`guia_confirmar_codigo.js`:**
  - Endpoint POST `/api/guia/confirmar-codigo`.
  - Valida código fornecido contra `codigo_validacao` e `codigo_expira_em`.
  - Controle de segurança de até **5 tentativas**; excedido o limite, o código é invalidado.
  - Ao validar com sucesso: apaga o código do banco, registra auditoria e retorna confirmação para liberação da sessão do navegador.
- **`hub_admin_toggle.js`:** Endpoint seguro para ligar/desligar itens do hub e atualizar rótulos de badges com autorização de administradora.

### 6.5 Ativos de Marca, Logotipos e Favicon

- **Identidade Visual:** Logotipo oficial horizontal Entrelaços e símbolo da borboleta/cubo FAC implementados no componente `FACLogo.tsx`.
- **Favicon:** Configurado com os ativos oficiais da marca no cabeçalho do `index.html`.

---

## 7. Métricas de Sucesso e Critérios de Aceite

### 7.1 Indicadores Globais de Sucesso (KPIs)

- **Tempo de Ativação Inicial (Time-to-Value):** Uma nova visitante se cadastra e acessa a Aula Magna do Encontro 1 em **menos de 60 segundos**, sem fricção de aprovação manual.
- **Confiabilidade da Validação de Aluna:** Taxa de entrega e validação de código OTP superior a **98%** para e-mails cadastrados.
- **Integridade de Isolamento de Dados:** 100% de separação dos dados locais entre usuárias distintas que compartilhem o mesmo dispositivo (`userStorage`).
- **Estabilidade de Geração do Diagnóstico:** Emissão do PDF de 1 página do Diagnóstico FAC concluída em **menos de 3 segundos** no navegador da usuária.

### 7.2 Critérios de Aceite por Módulo

| Módulo          | Cenário de Teste / Critério de Aceite                                       | Resultado Esperado                                                                                                                       |
| --------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Cadastro**    | Visitante cria nova conta na tela de autenticação                           | A conta é criada com status ativo imediatamente; login automático; acesso liberado ao Hub e Encontro 1.                                  |
| **Hub**         | Aluna matriculada clica em "Já sou aluna" e digita seu e-mail               | Recebe código de 6 dígitos por e-mail; digita o código correto; Calculadora, IKIGAI e Skills são liberados imediatamente.                |
| **Gating**      | Visitante não validada tenta acessar `/calculadora` ou baixar a Mentora-FAC | Visualiza modal informativo com opção de validar e-mail de aluna ou conhecer a matrícula na Academia FAC.                                |
| **Encontro 1**  | Qualquer pessoa acessa a rota `/guia`                                       | O Caderno completo do Encontro 1 carrega integralmente, com Cubo FAC, Seção ChatGPT, Mapa Pessoal e Prompts copiáveis.                   |
| **Diagnóstico** | Usuária responde as 24 perguntas e conclui o questionário                   | O cálculo combinatório classifica os pilares; exibe as 7 telas de resultado; gera e baixa o arquivo PDF com gráficos vetoriais.          |
| **Calculadora** | Usuária simula custos e atinge o Passo 6 (Resultados)                       | O Piso Ético Mínimo por Sessão é exibido com fórmulas exatas (Markup Divisor e No-show); simulador tributário indica economia PF vs. PJ. |
| **IKIGAI**      | Usuária preenche círculos, encontros e missão                               | O diagrama SVG interativo reflete as entradas; permite exportar PNG nítido e resumo textual; dados persistem na nuvem da conta.          |
| **Admin**       | Administradora desliga uma peça do Hub em `/admin`                          | O Hub inicial reflete a alteração instantaneamente, exibindo a peça com o selo cinza "Em breve" e clique bloqueado.                      |
| **Admin**       | Administradora tenta excluir conta ou matrícula sem confirmação             | A exclusão só é processada se a palavra `EXCLUIR` for digitada exatamente (sem distinção entre maiúsculas e minúsculas).                 |

---

## 8. Roadmap, Limitações e Pendências Conhecidas

### 8.1 Limitações Técnicas e Arquiteturais do Estado Atual

- **Diagnóstico FAC 100% no Cliente:** Como as respostas do diagnóstico residem no `localStorage` do navegador por razões de privacidade ética, a troca de computador sem exportação prévia do PDF exige que a usuária refaça a autoavaliação para visualizar os gráficos no novo dispositivo.
- **Envio Transacional de E-mails Dependente do Provedor:** A entrega do código OTP depende da saúde operacional do provedor SMTP configurado (Brevo / Skip Cloud). Falhas temporárias de entrega são registradas na tabela `fac_auditoria`.

### 8.2 Pendências e Oportunidades Mapeadas (Backlog Estruturado)

1. **Revisão e Otimização Mobile do Painel Administrativo:** O `/admin` foi concebido primordialmente para telas desktop e notebooks. Uma refatoração de UX para telas compactas facilitará o gerenciamento de matrículas e status por smartphones.
2. **Replicação do Molde Rico da Aula Magna para Encontros 2+:** Expandir a estrutura do caderno de estudo (abertura editorial, passos, prompts copiáveis e entregáveis de síntese) para os próximos encontros do ciclo conforme forem publicados pela mentoria.
3. **Novas Aplicações e Skills no Hub:** Incorporação de novos módulos clínicos nas abas de Aplicativos e Skills (ex.: agentes especializados em contratos terapêuticos específicos, supervisão heurística e gestão de agenda).
4. **Expansão Dinâmica da Trilha de Encontros:** Cadastro progressivo de novos cadernos de aula no banco de dados `fac_guia_encontros`, mantendo a contagem fluida e sem limites artificiais de quantidade.

---

_Documento homologado em conformidade com o código-fonte em produção da Academia FAC._
