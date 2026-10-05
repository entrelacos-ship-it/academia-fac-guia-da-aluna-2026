migrate(
  (app) => {
    // 1. Coleção fac_matriculas
    // Regras: apenas admin (superusuário ou admin autenticado) lê/escreve via SDK; aluna comum não lista
    const matriculas = new Collection({
      name: 'fac_matriculas',
      type: 'base',
      listRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      viewRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'nome', type: 'text' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['ativa', 'suspensa', 'expirada'],
          maxSelect: 1,
        },
        { name: 'ciclo', type: 'text' },
        { name: 'inicio', type: 'date' },
        { name: 'fim', type: 'date' },
        { name: 'origem', type: 'text' },
        { name: 'anotacao', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_fac_matriculas_email ON fac_matriculas (email)',
        'CREATE INDEX idx_fac_matriculas_status ON fac_matriculas (status)',
      ],
    })
    app.save(matriculas)

    // 2. Coleção fac_guia_encontros (encontros 2 a 19; o Encontro 1 é estático/público)
    // Regras: superusuário / admin edita diretamente. Alunas leem via endpoint / hook que valida matrícula ativa em cada pedido
    const encontros = new Collection({
      name: 'fac_guia_encontros',
      type: 'base',
      listRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      viewRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      fields: [
        { name: 'numero', type: 'number', required: true, onlyInt: true, min: 2, max: 19 },
        { name: 'titulo', type: 'text', required: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['rascunho', 'publicado'],
          maxSelect: 1,
        },
        { name: 'data_prevista', type: 'text' },
        { name: 'conteudo', type: 'json' },
        { name: 'recursos', type: 'json' },
        { name: 'gravacao_url', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_fac_encontros_numero ON fac_guia_encontros (numero)',
        'CREATE INDEX idx_fac_encontros_status ON fac_guia_encontros (status)',
      ],
    })
    app.save(encontros)

    // 3. Coleção fac_acesso_codigos (códigos temporários de validação por e-mail)
    // Regras: null (gerenciado somente server-side via pb_hooks)
    const codigos = new Collection({
      name: 'fac_acesso_codigos',
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'codigo', type: 'text', required: true },
        { name: 'expira_em', type: 'date', required: true },
        { name: 'tentativas', type: 'number', onlyInt: true },
        { name: 'usado', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_fac_codigos_email ON fac_acesso_codigos (email)',
        'CREATE INDEX idx_fac_codigos_expira ON fac_acesso_codigos (expira_em)',
      ],
    })
    app.save(codigos)

    // 4. Coleção fac_auditoria (trilha mínima de ações administrativas e eventos de acesso)
    // Regras: list/view para admin, create/update/delete null
    const auditoria = new Collection({
      name: 'fac_auditoria',
      type: 'base',
      listRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      viewRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'operador', type: 'text', required: true },
        { name: 'acao', type: 'text', required: true },
        { name: 'alvo', type: 'text' },
        { name: 'motivo', type: 'text' },
        { name: 'detalhes', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_fac_auditoria_acao ON fac_auditoria (acao)',
        'CREATE INDEX idx_fac_auditoria_created ON fac_auditoria (created DESC)',
      ],
    })
    app.save(auditoria)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('fac_auditoria'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('fac_acesso_codigos'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('fac_guia_encontros'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('fac_matriculas'))
    } catch (_) {}
  },
)
