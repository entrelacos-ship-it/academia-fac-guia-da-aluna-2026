migrate(
  (app) => {
    // Coleção fac_hub_items para controle de liberação das peças do hub principal
    const collection = new Collection({
      name: 'fac_hub_items',
      type: 'base',
      // Leitura pública para carregar o hub; gravação apenas por administradoras
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      fields: [
        { name: 'chave', type: 'text', required: true },
        { name: 'titulo', type: 'text', required: true },
        { name: 'descricao', type: 'text' },
        {
          name: 'bloco',
          type: 'select',
          required: true,
          values: ['hero', 'sistema', 'material'],
          maxSelect: 1,
        },
        { name: 'ativo', type: 'bool' }, // bool flag não deve ser required
        { name: 'rotulo_badge', type: 'text' },
        { name: 'ordem', type: 'number' },
        { name: 'icone', type: 'text' },
        { name: 'url', type: 'text' },
        { name: 'exclusivo_alunas', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_fac_hub_chave ON fac_hub_items (chave)',
        'CREATE INDEX idx_fac_hub_bloco ON fac_hub_items (bloco)',
        'CREATE INDEX idx_fac_hub_ordem ON fac_hub_items (ordem)',
      ],
    })
    app.save(collection)

    // Seed inicial das peças do hub
    const col = app.findCollectionByNameOrId('fac_hub_items')

    const seedItems = [
      {
        chave: 'guia_aluna',
        titulo: 'Guia da Aluna FAC',
        descricao:
          'Aula Magna aberta com o Diagnóstico FAC Aprofundado (24 perguntas), índice dos 19 encontros, cadernos didáticos e validação do e-mail de compra para alunas.',
        bloco: 'hero',
        ativo: true,
        rotulo_badge: 'Aula 1 Aberta · 19 Encontros',
        ordem: 1,
        icone: 'BookOpen',
        url: '/guia',
        exclusivo_alunas: false,
      },
      {
        chave: 'calculadora',
        titulo: 'Calculadora de Precificação FAC',
        descricao:
          'Calcule seu piso ético por sessão a partir do custo real de vida, pró-labore justo, tributos e capacidade clínica. Central de resultados, cenários e planejamento.',
        bloco: 'sistema',
        ativo: true,
        rotulo_badge: 'Exclusivo para alunas',
        ordem: 2,
        icone: 'Calculator',
        url: '/calculadora',
        exclusivo_alunas: true,
      },
      {
        chave: 'ikigai',
        titulo: 'Meu IKIGAI Clínico',
        descricao:
          'Construa seu painel dos 4 círculos, diagnostique os vazios e gere sua declaração de missão autoral. Salvo na nuvem da sua conta com exportação para IA, PNG e PDF.',
        bloco: 'sistema',
        ativo: true,
        rotulo_badge: 'Exclusivo para alunas',
        ordem: 3,
        icone: 'Compass',
        url: '/ikigai',
        exclusivo_alunas: true,
      },
      {
        chave: 'caderno_exercicios',
        titulo: 'Cadernos & Fichas de Estudo',
        descricao:
          'Compilação de fichas de campo, roteiros de reflexão e materiais complementares das aulas da Academia.',
        bloco: 'material',
        ativo: true,
        rotulo_badge: 'Em breve',
        ordem: 4,
        icone: 'FileText',
        url: '/guia',
        exclusivo_alunas: true,
      },
      {
        chave: 'tutoriais_video',
        titulo: 'Tutoriais de Prática & Plataformas',
        descricao:
          'Passo a passo em vídeo demonstrando a operação dos sistemas clínicos, organização de prontuário e enquadre de contrato.',
        bloco: 'material',
        ativo: true,
        rotulo_badge: 'Em breve',
        ordem: 5,
        icone: 'Video',
        url: '/guia',
        exclusivo_alunas: true,
      },
    ]

    for (const item of seedItems) {
      try {
        app.findFirstRecordByData('fac_hub_items', 'chave', item.chave)
      } catch (_) {
        const record = new Record(col)
        record.set('chave', item.chave)
        record.set('titulo', item.titulo)
        record.set('descricao', item.descricao)
        record.set('bloco', item.bloco)
        record.set('ativo', item.ativo)
        record.set('rotulo_badge', item.rotulo_badge)
        record.set('ordem', item.ordem)
        record.set('icone', item.icone)
        record.set('url', item.url)
        record.set('exclusivo_alunas', item.exclusivo_alunas)
        app.save(record)
      }
    }

    // Atualizar também o Encontro 2 e Encontro 3 em fac_guia_encontros para remover Retrato de Autoria / Calculadora como "matéria" do encontro
    try {
      const enc2 = app.findFirstRecordByData('fac_guia_encontros', 'numero', 2)
      enc2.set('titulo', 'Encontro 2 — Identidade Profissional & Propósito Clínico')
      enc2.set('conteudo', {
        introducao:
          'Neste segundo encontro, mergulhamos no aprofundamento da identidade profissional, nos limites da prática ética e no alinhamento de propósito na clínica de psicologia.',
        secoes: [
          {
            titulo: '1. Preparar a Escuta Profissional',
            texto:
              'Revise as anotações do Encontro 1 e seu Diagnóstico FAC Aprofundado. Identifique quais pilares pedem sustentação e reflexão inicial na sua rotina.',
          },
          {
            titulo: '2. Caderno de Identidade e Propósito Clínico',
            texto:
              'Neste caderno, refletimos sobre o papel social da psicóloga, coerência teórico-prática e limites éticos do consultório.',
          },
          {
            titulo: '3. Exercício do Caderno Didático',
            texto:
              'Preencha as reflexões guiadas em seu caderno de anotações para o momento de supervisão e partilha com a turma.',
          },
        ],
      })
      // Os aplicativos aparecem como recursos complementares do hub/bloco Sistema, e não como matéria do encontro
      enc2.set('recursos', [
        { rotulo: 'App Complementar: Meu IKIGAI', tipo: 'app', url: '/ikigai' },
      ])
      app.save(enc2)
    } catch (_) {}

    try {
      const enc3 = app.findFirstRecordByData('fac_guia_encontros', 'numero', 3)
      enc3.set('titulo', 'Encontro 3 — Princípios da Sustentabilidade Financeira da Clínica')
      enc3.set('conteudo', {
        introducao:
          'Fundamentos teóricos e éticos da precificação no exercício profissional da psicologia: custos da vida, pró-labore digno e limites de capacidade de escuta.',
        secoes: [
          {
            titulo: '1. O Chão Material do Trabalho da Psicóloga',
            texto:
              'A precarização do trabalho da psicóloga decorre da falta de formação em gestão ética. Estudamos os princípios de sustentação da clínica sem culpa.',
          },
          {
            titulo: '2. Capacidade Clínica e Saúde Mental',
            texto:
              'Estudo sobre os limites saudáveis de horas de atendimento clínico semanal para evitar o adoecimento e sustentar a escuta qualificada.',
          },
        ],
      })
      enc3.set('recursos', [
        {
          rotulo: 'App Complementar: Calculadora de Precificação',
          tipo: 'app',
          url: '/calculadora',
        },
      ])
      app.save(enc3)
    } catch (_) {}
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('fac_hub_items')
      app.delete(collection)
    } catch (_) {}
  },
)
