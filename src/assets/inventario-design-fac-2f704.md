Inventário do design implementado em 04/10/2026. Este documento descreve o que está no código e nas páginas locais da Academia FAC. Ele serve como referência para continuar a LP, o Guia da Aluna e os próximos encontros sem perder a identidade visual. Não estabelece uma nova paleta nem publica conteúdo editorial.
Experiência
Rota
Direção
Papel
LP da Academia
/academia
Clara, lavanda e violeta, com cartões luminosos e CTA de alto contraste
Apresentar a oferta e conduzir à inscrição
Guia da Aluna
/guia-academia
Preta, editorial, com ameixa, violeta e laranja
Organizar o percurso de 19 encontros
Caderno do encontro
/guia-academia/encontro/01 quando publicado; prévia local em /guia-academia/previa/encontro/01
Mesma base do guia, com cartões de estudo, prompts e exercício
Preparar, estudar, construir e guardar a entrega
As duas experiências compartilham a marca Entrelaços e o cubo FAC como metáfora visual das três dimensões Fundação, Atração e Conexão. A LP usa a linguagem visual clara do site comercial. O guia usa uma variação escura para leitura prolongada e construção das peças. As paletas e os estilos ainda vivem em arquivos diferentes; não existe hoje um pacote único de tokens para toda a Academia.
Valores definidos sobretudo em tailwind.config.js e src/index.css.
Função
Valor
Uso observado
Fundo lavanda
#F5F2FB
Fundo geral da LP
Superfície
#FFFFFF, #FBFAFD
Cartões e campos
Texto principal
#0B1533
Títulos e conteúdo forte
Texto de apoio
#54658A
Parágrafos e descrições
Texto discreto
#8A97B4
Metadados
Violeta principal
#6D28D9
Links, etiquetas e chamadas
Violeta de destaque
#8B5CF6
Gradientes, brilho, ícones e foco
Violeta profundo
#2E1065, #220C52, #190841, #0D0522
Painéis escuros e CTA
Lavanda suave
#EFE7FA, #E7DCFA, #F4EEFB
Etiquetas, halos e áreas de apoio
Linha clara
#E9E3F3, #DDD0F5
Bordas e divisórias
Laranja de Atração
#F28A2E
Código visual do pilar Atração
Turquesa de Conexão
#0EA5A5
Código visual do pilar Conexão
Na LP e nos componentes ligados ao Diagnóstico, os pilares têm codificação própria: Fundação #8B5CF6, Atração #F28A2E e Conexão #0EA5A5. Os fundos suaves correspondentes estão em src/lib/questions.ts.
Variáveis efetivas de .ag-shell em AcademiaGuide.css:

```css
--ag-bg: #000;
--ag-surface: #0a0a0a;
--ag-raised: #111214;
--ag-line: rgba(255, 255, 255, 0.1);
--ag-text: #f0f0f0;
--ag-muted: #a1a4a5;
--ag-quiet: #7d8588;
--ag-plum: #1b1024;
--ag-orange: #ff9b32;
--ag-orange-muted: #cf842f;
```

Função
Tratamento atual
Fundo
Preto quase absoluto com gradientes escuros discretos
Superfícies
Preto elevado e ameixa, bordas finas de baixo contraste
Texto
Branco suave; cinzas frios para apoio e metadados
Estrutura editorial
Laranja #FF9B32 em índices, sobrelinhas, títulos de partes e chamadas do cubo
Ênfase emocional e profundidade
Violeta e ameixa em trechos destacados, avisos e painéis
Ação principal
Botão branco #F0F0F0, texto escuro; ação secundária transparente
O laranja do guia marca navegação, sequência e ação. Os pilares do método aparecem no explorador como faces do cubo, sem aplicar o código violeta/laranja/turquesa da LP a todos os cartões. Esta diferença é parte do estado atual, não uma equivalência automática entre tema e pilar.
A skill de design system usa a estrutura primitivo → semântico → componente. No projeto atual, a LP já concentra muitos valores primitivos no Tailwind; o guia define variáveis semânticas em .ag-shell e ainda usa alguns valores diretos nos componentes.
Camada
LP
Guia
Primitivos
colors.purple, lavender, ink, line em tailwind.config.js
Hexadecimais e rgba() em AcademiaGuide.css, EncounterStudy.css, AuthorPortrait.css
Semânticos
Classes como bg-lavender, text-ink, text-body
--ag-bg, --ag-text, --ag-muted, --ag-plum, --ag-orange
Componentes
.cta-frame, .cta-inner, shadow-card, rounded-card
.ag-button, .ag-tile, .ag-study-chapter, .ag-prompt-card, .ag-map-question
Ao criar uma peça nova, usar primeiro a camada da experiência onde ela será exibida. Não aplicar diretamente o CTA roxo em formato de pílula da LP dentro do caderno escuro, nem importar o laranja editorial do guia como cor primária de toda a LP.
Elemento
LP
Guia e caderno
Títulos
Geist com fallback Manrope; pesos 700 e 800
Georgia, serifada, peso 400
Corpo
Manrope, fallback system-ui
CSS declara Hanken Grotesk, fallback system-ui
Sobrelinhas, números funcionais
Geist, caixa alta, espaçamento entre letras
Fonte monoespaçada do sistema, em geral 10–11 px, caixa alta, espaçamento de aproximadamente .13em
Título principal
LP: clamp(32px, 4.2vw, 52px), peso 700
Início do guia: clamp(54px, 6.2vw, 92px); encontro: clamp(48px, 6vw, 78px)
Título de seção
LP: clamp(28px, 3.6vw, 42px)
Guia: aproximadamente 42–65 px; caderno: clamp(31px, 3.4vw, 46px)
Corpo de leitura
LP: em geral 14–17 px, entrelinha 1.65–1.75
Guia: base 16 px/1.55; parágrafos do caderno 15 px/1.75
Os títulos do guia têm espaçamento negativo entre letras, em torno de -.04em a -.045em. O contraste entre serifada ampla e microtipografia monoespaçada é uma assinatura do caderno.
Lacuna observada: index.html carrega Geist e Manrope do Google Fonts. Não há carregamento de Hanken Grotesk no código inspecionado. Assim, o corpo do guia usa o fallback system-ui quando a fonte não está instalada no dispositivo. Antes de declarar Hanken como fonte oficial ou reproduzir exatamente a página em outro meio, resolver ou confirmar essa dependência.
Regra
LP
Guia
Largura máxima
1200 px
1200 px
Respiro lateral
24 px; 28 px a partir de sm
24 px; 16 px em telas até 680 px
Organização principal
Grade responsiva, cards e seções de 2 a 3 colunas
Abertura editorial; encontros em grade; página do encontro com texto e barra de materiais
Cartões
Raios predominantes de 18–24 px, por vezes 30 px
Raios discretos de 5–9 px
Bordas
Lavanda clara, com sombra difusa
Linhas finas e superfícies quase pretas
Seções
Respiros recorrentes próximos de 64–80 px
Página inicial próxima de 95–100 px; caderno dividido por linhas e pausas de 44–55 px
No encontro, a área principal usa minmax(0, 1fr) 335px com espaço de 65 px no desktop. Abaixo de 680 px, a coluna de materiais sobe para antes do conteúdo principal. No caderno, o percurso visual passa de cinco colunas para três até 850 px e duas até 680 px. Caminhos de instalação lado a lado passam para uma coluna até 680 px.
Os breakpoints principais do guia são 1000, 950, 850 e 680 px, conforme o componente. A LP usa os breakpoints do Tailwind, especialmente sm e lg.

- Cabeçalho: logotipo horizontal, fundo lavanda translúcido, borda inferior e desfoque suave. Etiqueta “ACADEMIA FAC” em pílula lavanda.
- Título de seção: SectionHeading reúne sobrelinha, ponto, título forte e descrição, com alinhamento central ou à esquerda.
- CTA principal: CtaButton é uma pílula violeta profunda com borda luminosa animada, selo circular à esquerda e seta à direita. Há tamanhos sm, md e lg, além de estados hover e active.
- Cards: superfície branca, borda lavanda, sombra difusa e elevação discreta no hover. Raios entre 18 e 24 px.
- Faixas escuras: gradiente violeta profundo, texto branco e luminosidade radial.
- Revelação ao rolar: Reveal mostra blocos quando entram no campo de visão.
- Cabeçalho: logotipo Entrelaços à esquerda, identificação Academia FAC, navegação curta e etiqueta “GUIA DA ALUNA”. No celular, a marca ocupa menos espaço.
- Hero: título serifado e cubo mágico 3D. Na página inicial, as 27 peças começam soltas e se juntam conforme a rolagem. Os rótulos “ROLE PARA MONTAR” e “F / A / C” usam laranja.
- Índice: 19 encontros agrupados em Fundação, Atração e Conexão. Card futuro mostra número, data e “Em breve”; card liberado mostra título e acesso. A prévia local do Encontro 1 tem estado visual próprio em laranja, sem contar como publicação.
- Contador: “X / 19 encontros publicados” indica disponibilidade de conteúdo, não progresso individual da aluna.
- Página de encontro: cabeçalho editorial, pergunta orientadora, arte com cubo 3D, preparação, passos, caderno, entrega e materiais em barra lateral.
- Caderno de estudo: percurso visual de cinco etapas; capítulos como cartões de leitura; quadro FAC interativo com três faces; instalação da ferramenta em passos; prompts expansíveis com botão de cópia; Mapa Pessoal editável.
- Retrato de Autoria: seções numeradas, caminhos de instalação lado a lado, espaço para captura de tela, Plano B, caixa de avisos e botão de download.
- Mapa Pessoal: campos de escrita em cartões, foco com contorno violeta, rascunho salvo no navegador, ações de copiar, baixar e limpar.
  Elemento
  Estados observados
  Card de encontro
  Futuro, liberado, atual e prévia local de desenvolvimento
  Cubo do início do guia
  Peças soltas, montagem durante a rolagem, montado; movimento reduzido mostra o cubo montado
  Cubo do encontro
  Rotação de volume, breve afastamento e reencontro das peças; imóvel com movimento reduzido
  Exploração FAC
  Face F, A ou C selecionada; aria-pressed informa a seleção
  Prompt
  Fechado ou aberto por <details>; retorno “Copiado” após copiar
  Mapa
  Escrita, salvamento local, confirmação de cópia/download e limpeza com confirmação
  Links e campos
  Foco visível; o formulário usa contorno violeta
  O cubo é o principal recurso de movimento. Ele representa peças que compõem uma prática sustentável, portanto o efeito deve manter legibilidade e não competir com o texto.
  Onde
  Implementação atual
  LP
  Cubo em Rubik3DCanvas, com montagem ligada à rolagem da hero
  Início do guia
  AcademiaCube em CSS 3D, 27 peças, montagem reversível pela rolagem
  Encontro 1
  Mesmo cubo em modo ambient: rotação de 20 s, ciclo de aproximação/afastamento de peças de 11 s e brilho suave de 9 s
  Cards e botões
  Elevação pequena, mudança de borda/fundo entre aproximadamente .2 e .3 s
  Revelação da LP
  Entrada de .7 s com deslocamento vertical de 20 px
  Em prefers-reduced-motion: reduce, o cubo do guia fica montado; o cubo do encontro fica estático em perspectiva; animações e transições da LP são reduzidas. Este comportamento é parte do componente, não um detalhe opcional.
- Marca: logotipo horizontal Entrelaços com borboleta violeta e laranja. O guia usa public/brand/entrelacos-logo-horizontal.png; a LP usa public/entrelacos-logo-deitado.png.
- Ícones: biblioteca lucide-react, traço fino e função clara. No guia aparecem setas, check, cadeado, cópia, download e retorno. Na LP, os pilares usam camadas, raio e coração.
- Grafismo: cubos com faces e peças, órbitas discretas, gradientes radiais e linhas finas. Evitar usar blocos chapados como substitutos do cubo tridimensional.
- Tom da interface: direto e acolhedor, com palavras como estrutura, direção, cuidado, peça e percurso. O guia orienta uma ação por vez e preserva a autonomia da aluna.

1. Escolher a variação visual pela função da página: LP clara para apresentação e conversão; guia escuro para acompanhamento e estudo.
2. Manter o cubo FAC com frente, topo e lateral perceptíveis quando apresentado como cubo mágico. Aplicar profundidade real e uma versão sem movimento.
3. Usar laranja no guia para índices, sobrelinhas e marcos de ação; usar violeta para profundidade, painéis e detalhes da marca.
4. Repetir a estrutura editorial do caderno: ideia, exemplo ou ferramenta, pergunta para a própria prática e ação concreta.
5. Marcar estados com texto e ícone além da cor. “Em breve”, “Abrir prévia” e “Encontro atual” têm significados diferentes.
6. Antes de reaproveitar o corpo tipográfico do guia em uma peça externa, confirmar o carregamento de Hanken Grotesk.
7. Ao criar novos tokens, registrar separadamente valor primitivo, função semântica e uso no componente. Os arquivos atuais ainda não seguem essa arquitetura de forma uniforme.
   Assunto
   Arquivo
   Rotas da Academia e do guia
   ../../MazyOS/metodo-fac/src/App.tsx
   Paleta e raios da LP
   ../../MazyOS/metodo-fac/tailwind.config.js
   Base, CTA e movimento da LP
   ../../MazyOS/metodo-fac/src/index.css
   LP da Academia
   ../../MazyOS/metodo-fac/src/components/diagnostic/MentoriaOfferScreen.tsx
   Cores dos pilares
   ../../MazyOS/metodo-fac/src/lib/questions.ts
   Guia, grade e estados
   ../../MazyOS/metodo-fac/src/components/guide/AcademiaGuide.css
   Cubo do guia
   ../../MazyOS/metodo-fac/src/components/guide/AcademiaCube.tsx e AcademiaCube.css
   Caderno e mapa
   ../../MazyOS/metodo-fac/src/components/guide/EncounterStudy.tsx e EncounterStudy.css
   Retrato de Autoria
   ../../MazyOS/metodo-fac/src/components/guide/AuthorPortrait.tsx e AuthorPortrait.css
   Fontes carregadas
   ../../MazyOS/metodo-fac/index.html
   Estado editorial: o Encontro 1 ainda está em prévia local. Os estados e componentes visuais documentados aqui não significam que seu conteúdo esteja publicado para as alunas.
