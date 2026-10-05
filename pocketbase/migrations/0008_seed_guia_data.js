migrate(
  (app) => {
    // 1. Seed da matrícula da conta administrativa principal
    const matriculasCol = app.findCollectionByNameOrId('fac_matriculas')
    const adminEmail = 'entre.lacos.psi.cursos@gmail.com'

    try {
      app.findFirstRecordByData('fac_matriculas', 'email', adminEmail)
    } catch (_) {
      const adminMat = new Record(matriculasCol)
      adminMat.set('email', adminEmail)
      adminMat.set('nome', 'Admin Entrelaços')
      adminMat.set('status', 'ativa')
      adminMat.set('ciclo', 'Ciclo FAC 2026')
      adminMat.set('origem', 'Setup Inicial')
      adminMat.set('anotacao', 'Matrícula mestre de coordenação e testes')
      app.save(adminMat)
    }

    // 2. Seed dos encontros 2 a 19 em fac_guia_encontros
    const encontrosCol = app.findCollectionByNameOrId('fac_guia_encontros')

    const encontrosSeed = [
      {
        numero: 2,
        titulo: 'Encontro 2 — Retrato de Autoria & Meu IKIGAI Clínico',
        status: 'publicado',
        data_prevista: '13/10/2026',
        conteudo: {
          introducao:
            'Neste segundo encontro, mergulhamos na consolidação da identidade profissional e dos quatro círculos do IKIGAI para psicólogas.',
          secoes: [
            {
              titulo: '1. Preparar a Escuta Profissional',
              texto:
                'Revise as anotações do Encontro 1 e seu Diagnóstico FAC Aprofundado. Identifique quais pilares pedem sustentação imediata.',
            },
            {
              titulo: '2. Construção do IKIGAI Clínico',
              texto:
                'Abra a ferramenta Meu IKIGAI no hub da Academia e preencha as listas de Paixão, Vocação, Missão e Profissão, observando os vazios e a síntese em duas frases.',
            },
            {
              titulo: '3. Entrega & Mesa de Trabalho',
              texto:
                'Exporte seu painel em PDF e compartilhe suas reflexões no grupo exclusivo da turma com a equipe da Entrelaços.',
            },
          ],
        },
        recursos: [
          { rotulo: 'Ferramenta Meu IKIGAI', tipo: 'app', url: '/ikigai' },
          { rotulo: 'Retrato de Autoria (Skill)', tipo: 'guia', url: '/guia/retrato-de-autoria' },
        ],
        gravacao_url: '',
      },
      {
        numero: 3,
        titulo: 'Encontro 3 — Precificação Ética & Sustentabilidade da Sessão',
        status: 'publicado',
        data_prevista: '20/10/2026',
        conteudo: {
          introducao:
            'Construção do piso ético individual: custos de vida, formação continuada, pró-labore e capacidade clínica semanal.',
          secoes: [
            {
              titulo: '1. Desmistificar o Preço na Clínica',
              texto:
                'A precarização do trabalho da psicóloga decorre de estruturas de mercado e tabelas defasadas, não de falta de merecimento individual.',
            },
            {
              titulo: '2. Exercício na Calculadora FAC',
              texto:
                'Preencha seus 8 passos na Calculadora de Precificação do app e descubra seu piso técnico e markup divisor.',
            },
          ],
        },
        recursos: [{ rotulo: 'Calculadora de Precificação', tipo: 'app', url: '/calculadora' }],
        gravacao_url: '',
      },
    ]

    // Adicionar encontros 4 a 19 como rascunhos para a Tati e equipe publicarem
    for (let n = 4; n <= 19; n++) {
      encontrosSeed.push({
        numero: n,
        titulo: 'Encontro ' + n + ' — Tema a ser liberado',
        status: 'rascunho',
        data_prevista: 'Em breve',
        conteudo: {
          introducao: 'Conteúdo em preparação pela coordenação pedagógica.',
          secoes: [
            {
              titulo: 'Caderno em Edição',
              texto:
                'Os materiais e orientações deste encontro serão publicados pela Tati antes da data da aula.',
            },
          ],
        },
        recursos: [],
        gravacao_url: '',
      })
    }

    encontrosSeed.forEach((enc) => {
      try {
        app.findFirstRecordByData('fac_guia_encontros', 'numero', enc.numero)
      } catch (_) {
        const rec = new Record(encontrosCol)
        rec.set('numero', enc.numero)
        rec.set('titulo', enc.titulo)
        rec.set('status', enc.status)
        rec.set('data_prevista', enc.data_prevista)
        rec.set('conteudo', enc.conteudo)
        rec.set('recursos', enc.recursos)
        rec.set('gravacao_url', enc.gravacao_url)
        app.save(rec)
      }
    })
  },
  (app) => {
    // rollback seguro
  },
)
