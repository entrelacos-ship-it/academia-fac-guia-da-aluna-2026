migrate(
  (app) => {
    // Coleção fac_skills para upload e download de skills (arquivos .zip, .md etc.) pelas alunas
    const collection = new Collection({
      name: 'fac_skills',
      type: 'base',
      // Regras de acesso RLS:
      // - Listar / Visualizar: qualquer aluna autenticada ou admin, ou alunas ativas
      // - Criar / Atualizar / Excluir: apenas administradoras
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      fields: [
        { name: 'titulo', type: 'text', required: true },
        { name: 'descricao', type: 'text' },
        {
          name: 'arquivo',
          type: 'file',
          required: true,
          maxSelect: 1,
          maxSize: 52428800, // 50 MB
          mimeTypes: [
            'application/zip',
            'application/x-zip-compressed',
            'text/markdown',
            'text/plain',
            'application/json',
            'application/octet-stream',
          ],
        },
        { name: 'categoria', type: 'text' },
        { name: 'ordem', type: 'number' },
        { name: 'ativo', type: 'bool' }, // visível ou não para alunas
        { name: 'versao', type: 'text' },
        { name: 'rotulo_badge', type: 'text' },
        { name: 'instrucoes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_fac_skills_ativo ON fac_skills (ativo)',
        'CREATE INDEX idx_fac_skills_ordem ON fac_skills (ordem)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('fac_skills')
      app.delete(collection)
    } catch (_) {}
  },
)
