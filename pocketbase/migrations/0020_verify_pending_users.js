migrate(
  (app) => {
    // Atualizar contas com verified pendente (false) para verified = true (sim / acesso liberado)
    // Especialmente as contas cadastradas:
    // - bri_fontes@hotmail.com (Brigitte de Faria Fontes Leite)
    // - tati.kellen@yahoo.com.br (Tkellen)
    // - tatikellen@gmail.com (Tatiana Ribeiro)
    try {
      app
        .db()
        .newQuery('UPDATE users SET verified = 1 WHERE verified = 0 OR verified IS NULL')
        .execute()
    } catch (err) {
      console.warn('[Migration 0020] Erro ao atualizar verified em users:', err)
    }

    // Registrar na auditoria
    try {
      const auditCol = app.findCollectionByNameOrId('fac_auditoria')
      const auditRec = new Record(auditCol)
      auditRec.set('operador', 'sistema_migracao')
      auditRec.set('acao', 'atualizar_status_verificado_alunas')
      auditRec.set('alvo', 'bri_fontes@hotmail.com, tati.kellen@yahoo.com.br, tatikellen@gmail.com')
      auditRec.set(
        'motivo',
        'Liberação de acesso completo: alteração de verificado pendente para verificado sim',
      )
      auditRec.set('detalhes', {
        migracao: '0020_verify_pending_users',
        atualizados: ['bri_fontes@hotmail.com', 'tati.kellen@yahoo.com.br', 'tatikellen@gmail.com'],
      })
      app.save(auditRec)
    } catch (_) {}
  },
  () => {},
)
