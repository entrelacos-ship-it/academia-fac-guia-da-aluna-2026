import React, { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

export const ManifestoTeoriaBloco: React.FC = () => {
  const [aberto, setAberto] = useState<boolean>(false)

  return (
    <div className="rounded-[16px] border border-purple-200/90 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20 overflow-hidden transition-all">
      {/* Botão de recolher/expandir o material de apoio */}
      <button
        type="button"
        onClick={() => setAberto((prev) => !prev)}
        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-purple-100/50 dark:hover:bg-purple-950/40 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed]"
        aria-expanded={aberto}
        aria-controls="conteudo-teoria-manifesto"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/80 text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                Material de apoio · Cartão 3
              </span>
              <span className="text-xs text-editorial-secondary font-mono">
                {aberto ? '(toque para recolher)' : '(toque para ler o guia completo)'}
              </span>
            </div>
            <h4 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary truncate">
              O que é um manifesto da marca · Por Tati Ribeiro
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#7c3aed] dark:text-[#C084FC] shrink-0">
          <span className="hidden sm:inline">{aberto ? 'Recolher' : 'Expandir texto'}</span>
          {aberto ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Conteúdo integral verbatim do manifesto com tabelas adaptadas para celular sem rolagem horizontal */}
      {aberto && (
        <div
          id="conteudo-teoria-manifesto"
          className="p-5 sm:p-7 lg:p-8 space-y-7 border-t border-purple-200/80 dark:border-purple-900/40 bg-white dark:bg-[#121216] text-xs sm:text-sm text-editorial-secondary leading-relaxed font-light"
        >
          {/* Introdução */}
          <div className="space-y-4">
            <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">
              Tati,{' '}
              <strong className="font-semibold text-editorial-primary">
                o manifesto da marca é uma declaração das convicções que orientam um negócio: o que
                ele acredita, por que existe, que realidade deseja transformar e como escolhe agir.
              </strong>{' '}
              Ele dá linguagem a algo que muitas vezes a fundadora sente, mas ainda não conseguiu
              organizar.
            </p>

            <p>
              Na psicologia, isso tem uma força especial: o trabalho envolve confiança, cuidado e
              responsabilidade. Quem chega até uma clínica, uma comunidade ou uma formação precisa
              compreender, além dos serviços disponíveis,{' '}
              <strong className="font-semibold text-editorial-primary">
                qual visão de cuidado e de desenvolvimento sustenta aquele negócio.
              </strong>{' '}
              🧠
            </p>

            <p>
              Vou aprofundar o conceito e mostrar como ele pode se tornar uma ferramenta prática.
            </p>
          </div>

          {/* 1. O que um manifesto de marca realmente contém */}
          <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-[#27272A]">
            <h5 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
              1. O que um manifesto de marca realmente contém
            </h5>

            <p>Um manifesto bem construído articula cinco elementos:</p>

            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-[#7c3aed] dark:text-[#C084FC] font-bold">•</span>
                <span>
                  <strong className="font-semibold text-editorial-primary">
                    Uma leitura da realidade:
                  </strong>{' '}
                  qual problema a marca percebe no mundo ou em seu mercado?
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7c3aed] dark:text-[#C084FC] font-bold">•</span>
                <span>
                  <strong className="font-semibold text-editorial-primary">Uma convicção:</strong> o
                  que ela acredita que precisa ser defendido?
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7c3aed] dark:text-[#C084FC] font-bold">•</span>
                <span>
                  <strong className="font-semibold text-editorial-primary">Uma posição:</strong> de
                  quais práticas ela discorda e quais alternativas propõe?
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7c3aed] dark:text-[#C084FC] font-bold">•</span>
                <span>
                  <strong className="font-semibold text-editorial-primary">
                    Uma contribuição:
                  </strong>{' '}
                  o que seus serviços, produtos e relações ajudam a construir?
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7c3aed] dark:text-[#C084FC] font-bold">•</span>
                <span>
                  <strong className="font-semibold text-editorial-primary">Um compromisso:</strong>{' '}
                  como ela pretende agir para sustentar esse posicionamento?
                </span>
              </li>
            </ul>

            <p>
              Imagine uma marca de formação para psicólogas que identifica uma distância entre o
              conhecimento adquirido e as condições concretas de exercício da profissão.
            </p>

            <p>
              Seu manifesto pode defender que desenvolver uma carreira exige formação, troca
              profissional e estrutura para trabalhar. Essa convicção passa a orientar o que a
              empresa ensina, quais produtos oferece e como acompanha suas alunas.
            </p>

            <div className="p-4 rounded-[12px] bg-purple-50/70 dark:bg-purple-950/30 border-l-3 border-[#7c3aed] dark:border-[#C084FC] text-editorial-primary">
              <strong className="font-semibold font-sans">
                O texto expressa o posicionamento; as decisões tornam esse posicionamento
                verdadeiro.
              </strong>
            </div>

            <p>Um manifesto também pode ter dois formatos complementares:</p>

            {/* Tabela 1: Formatos complementares em cartões empilhados para leitura fluida no celular */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                  Documento estratégico interno
                </span>
                <p className="text-xs text-editorial-primary">
                  <strong className="font-medium text-editorial-secondary">O que contém:</strong>{' '}
                  Identidade, público, crenças, diferenciação, voz, compromissos e critérios de
                  decisão.
                </p>
                <p className="text-xs text-editorial-secondary pt-1 border-t border-slate-200/70 dark:border-[#27272A]">
                  <strong className="font-medium text-editorial-primary">Principal uso:</strong>{' '}
                  Orientar equipe, produtos, comunicação e experiência.
                </p>
              </div>

              <div className="p-4 rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] block">
                  Texto público do manifesto
                </span>
                <p className="text-xs text-editorial-primary">
                  <strong className="font-medium text-editorial-secondary">O que contém:</strong>{' '}
                  Uma síntese envolvente das principais convicções da marca.
                </p>
                <p className="text-xs text-editorial-secondary pt-1 border-t border-slate-200/70 dark:border-[#27272A]">
                  <strong className="font-medium text-editorial-primary">Principal uso:</strong>{' '}
                  Apresentar a marca no site, em vídeos, eventos e campanhas.
                </p>
              </div>
            </div>

            <p>
              Essa distinção ajuda bastante. O documento interno pode ser aprofundado; o texto
              público precisa ser compreensível e relevante para quem está conhecendo o negócio.
            </p>
          </div>

          {/* 2. Como ele se relaciona com missão, visão e valores */}
          <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-[#27272A]">
            <h5 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
              2. Como ele se relaciona com missão, visão e valores
            </h5>

            <p>Esses elementos se complementam, mas cumprem funções diferentes:</p>

            {/* Tabela 2: Relação entre elementos em grade responsiva */}
            <div className="space-y-2.5">
              {[
                {
                  elemento: 'Missão',
                  pergunta: 'Por que existimos e qual contribuição oferecemos?',
                },
                {
                  elemento: 'Visão',
                  pergunta: 'Que futuro queremos construir?',
                },
                {
                  elemento: 'Valores',
                  pergunta: 'Quais princípios orientam nossa conduta?',
                },
                {
                  elemento: 'Posicionamento',
                  pergunta: 'Para quem somos relevantes e por que escolher nossa proposta?',
                },
                {
                  elemento: 'Manifesto',
                  pergunta:
                    'O que defendemos, por que isso importa e como nos comprometemos com essa visão?',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-[10px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/50 dark:bg-[#0c0914] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                >
                  <span className="font-mono text-xs font-bold text-[#7c3aed] dark:text-[#C084FC] w-36 shrink-0">
                    {item.elemento}
                  </span>
                  <span className="text-xs sm:text-sm text-editorial-primary flex-1">
                    {item.pergunta}
                  </span>
                </div>
              ))}
            </div>

            <p>
              Por exemplo, &ldquo;acolhimento&rdquo; pode aparecer como valor de uma clínica. O
              manifesto aprofunda o significado disso: como aquela clínica compreende o acolhimento,
              por que ele importa e quais atitudes expressam esse compromisso.
            </p>

            <p>
              <strong className="font-semibold text-editorial-primary">
                Minha opinião: um manifesto ganha qualidade quando transforma palavras abstratas em
                escolhas reconhecíveis.
              </strong>{' '}
              &ldquo;Humanização&rdquo;, &ldquo;excelência&rdquo; e &ldquo;transformação&rdquo;
              precisam ter um significado concreto naquele negócio.
            </p>
          </div>

          {/* 3. Por que ele importa para um negócio da psicologia */}
          <div className="space-y-3.5 pt-4 border-t border-slate-200/80 dark:border-[#27272A]">
            <h5 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
              3. Por que ele importa para um negócio da psicologia
            </h5>

            <p>
              <strong className="font-semibold text-editorial-primary">
                Ajuda a construir uma identidade reconhecível.
              </strong>{' '}
              Muitos negócios utilizam expressões semelhantes: atendimento humanizado, escuta
              acolhedora, desenvolvimento profissional. O manifesto permite explicar a perspectiva
              específica que sustenta essas entregas.
            </p>

            <p>
              A diferenciação pode estar na forma de compreender uma questão, de organizar a
              experiência ou de integrar conhecimentos: sem precisar afirmar superioridade sobre
              outros profissionais.
            </p>

            <p>
              <strong className="font-semibold text-editorial-primary">
                Dá coerência à comunicação.
              </strong>{' '}
              Quando as convicções estão claras, os conteúdos começam a compartilhar uma mesma
              direção. Um post educativo, uma apresentação comercial e uma aula podem abordar temas
              distintos, mas expressam uma visão consistente.
            </p>

            <p>
              <strong className="font-semibold text-editorial-primary">
                Favorece identificação e confiança.
              </strong>{' '}
              Um possível paciente pode reconhecer afinidade com a maneira como a clínica apresenta
              o cuidado. Uma psicóloga pode perceber que determinada comunidade compreende os
              desafios que ela vive. Essa identificação ajuda a qualificar a aproximação, embora não
              garanta contratação.
            </p>

            <p>
              <strong className="font-semibold text-editorial-primary">
                Orienta o crescimento.
              </strong>{' '}
              Com o surgimento de oportunidades, o manifesto ajuda a avaliar novos cursos, serviços,
              parcerias e canais. Ele oferece critérios para distinguir uma expansão coerente de uma
              iniciativa que dispersa a marca.
            </p>

            <p>
              <strong className="font-semibold text-editorial-primary">
                Alinha quem trabalha no negócio.
              </strong>{' '}
              A identidade deixa de depender apenas da presença da fundadora. Atendimento, docentes,
              parceiros e equipe de comunicação passam a ter uma referência compartilhada.
            </p>

            <div className="p-4 rounded-[12px] bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-amber-950 dark:text-amber-200">
              <strong className="font-semibold font-sans text-amber-900 dark:text-amber-100">
                Na psicologia, há ainda um cuidado essencial:
              </strong>{' '}
              o manifesto precisa expressar compromissos que o negócio consegue sustentar. Promessas
              absolutas de resultados clínicos ou profissionais enfraquecem a confiança e não são
              necessárias para comunicar uma proposta forte.
            </div>
          </div>

          {/* 4. Como podemos usar na prática */}
          <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-[#27272A]">
            <h5 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
              4. Como podemos usar na prática
            </h5>

            <p>O maior valor aparece quando o manifesto entra na rotina:</p>

            {/* Tabela 3: Área x Como usar (cartões responsivos) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  area: 'Conteúdo',
                  como: 'Transformar crenças da marca em temas, perguntas, argumentos e séries editoriais',
                },
                {
                  area: 'Site e apresentação institucional',
                  como: 'Explicar a visão que conecta os serviços e a razão de existir do negócio',
                },
                {
                  area: 'Produtos e serviços',
                  como: 'Avaliar se cada oferta responde a um problema coerente com o posicionamento',
                },
                {
                  area: 'Atendimento',
                  como: 'Traduzir valores em linguagem, procedimentos e expectativas claras',
                },
                {
                  area: 'Equipe e parceiros',
                  como: 'Compartilhar critérios de comunicação, entrega e relacionamento',
                },
                {
                  area: 'Experiência do público',
                  como: 'Conferir se a pessoa encontra, na prática, aquilo que a marca declara',
                },
                {
                  area: 'IA',
                  como: 'Fornecer contexto para produzir conteúdos e materiais alinhados à identidade, com revisão humana',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-[12px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-1 ${
                    idx === 6 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                    {item.area}
                  </span>
                  <p className="text-xs text-editorial-primary leading-relaxed">{item.como}</p>
                </div>
              ))}
            </div>

            <p>
              Para a Entrelaços, considerando sua proposta de educação, comunidade e tecnologia,{' '}
              <strong className="font-semibold text-editorial-primary">
                eu usaria o manifesto como o elo entre essas frentes.
              </strong>{' '}
              Ele pode mostrar qual transformação profissional faz com que cursos, supervisão,
              ferramentas e comunidade pertençam ao mesmo ecossistema.
            </p>

            <p>
              Como exemplo hipotético, uma convicção sobre a importância da troca profissional
              poderia gerar:
            </p>

            <ul className="space-y-1.5 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-[#7c3aed] dark:text-[#C084FC] font-bold">•</span>
                <span>Um conteúdo sobre os efeitos do isolamento na construção da carreira.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7c3aed] dark:text-[#C084FC] font-bold">•</span>
                <span>Um espaço de discussão de casos e dúvidas na comunidade.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7c3aed] dark:text-[#C084FC] font-bold">•</span>
                <span>Uma formação com oportunidades reais de interação.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7c3aed] dark:text-[#C084FC] font-bold">•</span>
                <span>
                  Um processo de acolhimento que apresente como participar desses espaços.
                </span>
              </li>
            </ul>

            <p>
              Perceba o encadeamento:{' '}
              <strong className="font-semibold text-editorial-primary">
                a crença inspira a comunicação e também exige uma entrega.
              </strong>
            </p>
          </div>

          {/* 5. Como transformar o manifesto em um instrumento de decisão */}
          <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-[#27272A]">
            <h5 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
              5. Como transformar o manifesto em um instrumento de decisão
            </h5>

            <p>Sugiro trabalhar com uma sequência simples:</p>

            <div className="p-3.5 rounded-[10px] bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/40 text-center font-mono text-xs sm:text-sm font-semibold text-[#7c3aed] dark:text-[#C084FC]">
              Convicção → compromisso → comportamento → evidência.
            </div>

            <p>Veja um exemplo ilustrativo para um negócio de formação:</p>

            {/* Tabela 4: Etapa x Exemplo */}
            <div className="space-y-2.5">
              {[
                {
                  etapa: 'Convicção',
                  exemplo:
                    'A aprendizagem precisa se conectar aos desafios reais da prática profissional',
                },
                {
                  etapa: 'Compromisso',
                  exemplo: 'Aproximar conhecimento e aplicação',
                },
                {
                  etapa: 'Comportamento',
                  exemplo: 'Incluir casos, exercícios e discussão de decisões nas formações',
                },
                {
                  etapa: 'Evidência',
                  exemplo: 'A aluna encontra essas atividades na experiência oferecida',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-[10px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/50 dark:bg-[#0c0914] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                >
                  <span className="font-mono text-xs font-bold text-[#7c3aed] dark:text-[#C084FC] w-36 shrink-0">
                    {item.etapa}
                  </span>
                  <span className="text-xs sm:text-sm text-editorial-primary flex-1">
                    {item.exemplo}
                  </span>
                </div>
              ))}
            </div>

            <p>Essa tradução permite revisar a marca com perguntas úteis:</p>

            <div className="space-y-1.5 pl-3 border-l-2 border-[#7c3aed]/40 italic text-editorial-primary text-xs sm:text-sm">
              <p>&ldquo;Nosso conteúdo expressa essa convicção?&rdquo;</p>
              <p>&ldquo;Nosso produto entrega esse compromisso?&rdquo;</p>
              <p>&ldquo;Nossa experiência permite perceber isso?&rdquo;</p>
            </div>

            <p>
              🌟{' '}
              <strong className="font-semibold text-editorial-primary">
                O manifesto fica mais poderoso quando também nos cobra coerência.
              </strong>{' '}
              Ele ajuda a reconhecer tanto o que já está bem construído quanto o que ainda precisa
              amadurecer.
            </p>
          </div>

          {/* 6. O que costuma enfraquecer um manifesto */}
          <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-[#27272A]">
            <h5 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
              6. O que costuma enfraquecer um manifesto
            </h5>

            <p>Alguns problemas são recorrentes:</p>

            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-[#ea580c] dark:text-[#FB923C] font-bold">•</span>
                <span>
                  <strong className="font-semibold text-editorial-primary">Generalidade:</strong>{' '}
                  frases que poderiam pertencer a qualquer empresa.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ea580c] dark:text-[#FB923C] font-bold">•</span>
                <span>
                  <strong className="font-semibold text-editorial-primary">
                    Excesso de grandiosidade:
                  </strong>{' '}
                  declarações difíceis de sustentar na experiência.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ea580c] dark:text-[#FB923C] font-bold">•</span>
                <span>
                  <strong className="font-semibold text-editorial-primary">
                    Distância da fundadora e da equipe:
                  </strong>{' '}
                  linguagem bonita, mas pouco autêntica.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ea580c] dark:text-[#FB923C] font-bold">•</span>
                <span>
                  <strong className="font-semibold text-editorial-primary">
                    Público pouco compreendido:
                  </strong>{' '}
                  convicções que não dialogam com situações reais.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ea580c] dark:text-[#FB923C] font-bold">•</span>
                <span>
                  <strong className="font-semibold text-editorial-primary">
                    Ausência de aplicação:
                  </strong>{' '}
                  o documento existe, mas ninguém o consulta para decidir.
                </span>
              </li>
            </ul>

            <p>
              Também considero importante escolher bem o que a marca combate. Em psicologia, é mais
              produtivo questionar práticas, condições e ideias: por exemplo, a romantização do
              esgotamento: do que transformar pessoas ou abordagens em adversários.
            </p>
          </div>

          {/* 7. Minha recomendação para a Entrelaços */}
          <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-[#27272A]">
            <h5 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
              7. Minha recomendação para a Entrelaços
            </h5>

            <p>
              Eu trataria o manifesto como uma{' '}
              <strong className="font-semibold text-editorial-primary">
                base estratégica compartilhada
              </strong>
              , da qual derivam três materiais:
            </p>

            <ol className="space-y-2 pl-2 list-decimal list-inside">
              <li>
                <strong className="font-semibold text-editorial-primary">
                  Uma versão aprofundada
                </strong>
                , para orientar posicionamento, ofertas e decisões.
              </li>
              <li>
                <strong className="font-semibold text-editorial-primary">Uma versão pública</strong>
                , para apresentar a visão da Entrelaços com clareza e emoção.
              </li>
              <li>
                <strong className="font-semibold text-editorial-primary">
                  Um guia de aplicação
                </strong>
                , com exemplos de linguagem, conteúdo, atendimento e entrega.
              </li>
            </ol>

            <p>
              O ponto central é fazer com que o público consiga reconhecer a mesma Entrelaços em uma
              publicação, em uma aula, na comunidade e no atendimento.
            </p>

            <div className="p-4 sm:p-5 rounded-[14px] bg-purple-50/70 dark:bg-purple-950/25 border-l-4 border-l-[#7c3aed] dark:border-l-[#C084FC] border-y border-r border-purple-100 dark:border-purple-900/30">
              <p className="font-serif-editorial text-base sm:text-lg text-editorial-primary italic leading-relaxed">
                &ldquo;Um bom manifesto permite que a marca diga quem é: e oferece critérios para
                agir de acordo com isso.&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
