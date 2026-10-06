// Rota para listar os encontros do Guia da Aluna
// Retorna índice para renderizar o mapa do percurso:
// - Encontro 1: aula aberta
// - Demais encontros da turma: numero, titulo, data_prevista, status (publicado/rascunho)
// SEM o conteúdo dos cadernos pagos

routerAdd('GET', '/backend/v1/fac/guia/encontros', (e) => {
  const lista = [
    {
      numero: 1,
      titulo: 'Aula Magna: Aula Aberta da Academia Método FAC',
      status: 'publicado',
      data_prevista: '06/10/2026',
      is_publico: true,
    },
  ]

  try {
    const records = $app.findRecordsByFilter('fac_guia_encontros', '', 'numero', 100, 0)

    for (let i = 0; i < records.length; i++) {
      const rec = records[i]
      lista.push({
        numero: rec.getInt('numero'),
        titulo: rec.getString('titulo'),
        status: rec.getString('status'),
        data_prevista: rec.getString('data_prevista'),
        is_publico: false,
      })
    }
  } catch (err) {
    console.warn('[FAC Guia] Erro ao listar encontros:', err)
  }

  return e.json(200, {
    success: true,
    encontros: lista,
  })
})
