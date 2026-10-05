// Hook de administração para controle de liberação das peças do hub principal
// Endpoint: POST /backend/v1/fac/admin/hub/toggle-status
// Altera o estado (ativo / inativo / rotulo_badge) de uma peça do hub e grava trilha na fac_auditoria

routerAdd(
  'POST',
  '/backend/v1/fac/admin/hub/toggle-status',
  (e) => {
    const authUser = e.auth
    if (!authUser || authUser.get('role') !== 'admin') {
      return e.json(403, {
        success: false,
        message: 'Apenas administradoras podem alterar a liberação de peças.',
      })
    }

    const body = e.requestInfo().body || {}
    const chave = (body.chave || '').toString().trim()
    const temAtivo = typeof body.ativo === 'boolean'
    const novoAtivo = body.ativo === true
    const novoRotulo = body.rotulo_badge !== undefined ? String(body.rotulo_badge).trim() : null

    if (!chave) {
      return e.json(400, { success: false, message: 'Chave da peça é obrigatória.' })
    }

    try {
      const item = $app.findFirstRecordByData('fac_hub_items', 'chave', chave)
      const ativoAntigo = item.getBool('ativo')
      const rotuloAntigo = item.getString('rotulo_badge')

      if (temAtivo) {
        item.set('ativo', novoAtivo)
      }
      if (novoRotulo !== null) {
        item.set('rotulo_badge', novoRotulo)
      }

      $app.save(item)

      // Registrar auditoria
      try {
        const auditCol = $app.findCollectionByNameOrId('fac_auditoria')
        const auditRec = new Record(auditCol)
        auditRec.set('operador', authUser.getString('email') || 'admin')
        auditRec.set('acao', 'hub_item_toggle')
        auditRec.set('alvo', chave)
        auditRec.set(
          'motivo',
          `Alterou liberação da peça ${chave}: ativo=${item.getBool('ativo')}, badge="${item.getString('rotulo_badge')}"`,
        )
        auditRec.set('detalhes', {
          chave: chave,
          titulo: item.getString('titulo'),
          ativo_anterior: ativoAntigo,
          ativo_novo: item.getBool('ativo'),
          rotulo_anterior: rotuloAntigo,
          rotulo_novo: item.getString('rotulo_badge'),
        })
        $app.save(auditRec)
      } catch (auditErr) {
        // Falha no log de auditoria não impede a atualização
      }

      return e.json(200, {
        success: true,
        message: `Peça ${chave} atualizada com sucesso.`,
        item: {
          id: item.id,
          chave: item.getString('chave'),
          titulo: item.getString('titulo'),
          descricao: item.getString('descricao'),
          bloco: item.getString('bloco'),
          ativo: item.getBool('ativo'),
          rotulo_badge: item.getString('rotulo_badge'),
          ordem: item.getInt('ordem'),
          icone: item.getString('icone'),
          url: item.getString('url'),
          exclusivo_alunas: item.getBool('exclusivo_alunas'),
        },
      })
    } catch (err) {
      return e.json(500, {
        success: false,
        message: 'Erro ao atualizar liberação da peça: ' + err,
      })
    }
  },
  $apis.requireAuth(),
)
