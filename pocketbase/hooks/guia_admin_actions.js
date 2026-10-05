// Rotas administrativas exclusivas para o Guia da Aluna
// - /api/fac/admin/matriculas (listar, cadastrar, atualizar status, importar CSV)
// - /api/fac/admin/encontros/toggle-status (publicar / reverter rascunho com auditoria)
// - /api/fac/admin/auditoria (listar logs)

routerAdd(
  'POST',
  '/backend/v1/fac/admin/encontros/toggle-status',
  (e) => {
    const authUser = e.auth
    if (!authUser || authUser.get('role') !== 'admin') {
      return e.json(403, {
        success: false,
        message: 'Apenas administradoras podem publicar encontros.',
      })
    }

    const body = e.requestInfo().body || {}
    const numero = parseInt(body.numero, 10)
    const novoStatus = (body.status || '').toString().trim() // "publicado" ou "rascunho"

    if (isNaN(numero) || (novoStatus !== 'publicado' && novoStatus !== 'rascunho')) {
      return e.json(400, { success: false, message: 'Parâmetros inválidos.' })
    }

    try {
      const enc = $app.findFirstRecordByData('fac_guia_encontros', 'numero', numero)
      const statusAntigo = enc.getString('status')
      enc.set('status', novoStatus)
      $app.save(enc)

      // Auditoria
      try {
        const auditCol = $app.findCollectionByNameOrId('fac_auditoria')
        const auditRec = new Record(auditCol)
        auditRec.set('operador', authUser.email())
        auditRec.set('acao', 'alterar_status_encontro')
        auditRec.set('alvo', 'Encontro ' + numero)
        auditRec.set('motivo', 'Alteração de status de ' + statusAntigo + ' para ' + novoStatus)
        auditRec.set('detalhes', { numero: numero, de: statusAntigo, para: novoStatus })
        $app.save(auditRec)
      } catch (_) {}

      return e.json(200, {
        success: true,
        message: 'Status do Encontro ' + numero + ' alterado para ' + novoStatus + '.',
        encontro: {
          numero: numero,
          status: novoStatus,
        },
      })
    } catch (err) {
      return e.json(500, { success: false, message: 'Erro ao atualizar encontro: ' + err })
    }
  },
  $apis.requireAuth(),
)
