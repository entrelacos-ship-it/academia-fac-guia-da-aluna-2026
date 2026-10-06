// Rota para buscar conteúdo do encontro do Guia
// Garante validação estrita no servidor:
// - Se o encontro não estiver publicado: retorna metadados (número, data, título) e status "rascunho" / "Em breve" (sem conteúdo)
// - Se o encontro estiver publicado: exige token de aluna válido ou token admin;
// - Em CADA requisição, checa na coleção fac_matriculas se a matrícula continua ATIVA (se for suspensa, bloqueia imediatamente)
// - Retorna 403 se não autenticada ou suspensa/expirada

routerAdd('POST', '/backend/v1/fac/guia/encontro', (e) => {
  const body = e.requestInfo().body || {}
  const numero = parseInt(body.numero, 10)
  const token = (body.token || '').toString().trim()

  if (isNaN(numero) || numero < 1) {
    return e.json(400, { success: false, message: 'Número de encontro inválido.' })
  }

  // Encontro 1 é público por definição da Tati
  if (numero === 1) {
    return e.json(200, {
      success: true,
      encontro: {
        numero: 1,
        titulo: 'Aula Magna: Aula Aberta da Academia Método FAC',
        status: 'publicado',
        data_prevista: '06/10/2026',
        is_publico: true,
      },
    })
  }

  // 1. Buscar encontro no banco
  let encRecord = null
  try {
    encRecord = $app.findFirstRecordByData('fac_guia_encontros', 'numero', numero)
  } catch (_) {}

  if (!encRecord) {
    return e.json(404, { success: false, message: 'Encontro não encontrado.' })
  }

  const encStatus = encRecord.getString('status')
  const encTitulo = encRecord.getString('titulo')
  const encData = encRecord.getString('data_prevista')

  // Se NÃO estiver publicado (rascunho): o calendário NUNCA publica automaticamente
  if (encStatus !== 'publicado') {
    return e.json(200, {
      success: true,
      encontro: {
        numero: numero,
        titulo: encTitulo,
        status: 'rascunho',
        data_prevista: encData || 'Em breve',
        em_breve: true,
      },
    })
  }

  // 2. Se o encontro ESTÁ publicado, o conteúdo é pago.
  // Checamos a credencial da usuária: token de aluna ou autenticação admin
  let emailAluna = ''

  // Verificar se há usuário admin conectado via cookie/bearer standard do PocketBase
  const authUser = e.auth
  if (authUser && authUser.get('role') === 'admin') {
    emailAluna = authUser.email()
  } else if (token) {
    const jwtSecret =
      $secrets.get('PB_SUPERUSER_TOKEN') || 'entrelacos-fac-aluna-session-token-secret-key-2026'
    try {
      const parsed = $security.parseJWT(token, jwtSecret)
      if (parsed && parsed.email) {
        emailAluna = parsed.email
      }
    } catch (err) {
      return e.json(401, {
        success: false,
        requires_login: true,
        message: 'Sessão inválida ou expirada. Por favor, valide seu e-mail de aluna novamente.',
      })
    }
  }

  if (!emailAluna) {
    // Visitante anônima tentando ver encontro pago publicado:
    // Retorna apenas metadados e tela de convite para aluna entrar, SEM conteúdo!
    return e.json(401, {
      success: false,
      requires_login: true,
      encontro: {
        numero: numero,
        titulo: encTitulo,
        status: 'publicado',
        data_prevista: encData,
        restrito: true,
      },
      message:
        'Este encontro é exclusivo para alunas matriculadas na Academia Método FAC. Valide seu e-mail de compra para liberar o caderno.',
    })
  }

  // 3. CHECAGEM EM CADA PEDIDO: conferir se a matrícula continua 'ativa'
  // (se admin suspendeu, bloqueia na próxima requisição sem esperar novo login!)
  let matricula = null
  try {
    matricula = $app.findFirstRecordByData('fac_matriculas', 'email', emailAluna)
  } catch (_) {}

  // Se for admin geral, permitimos visualizar
  const isAdmin = authUser && authUser.get('role') === 'admin'

  if (!matricula && !isAdmin) {
    return e.json(403, {
      success: false,
      status: 'nao_encontrada',
      message:
        'Matrícula não localizada para este e-mail. Por favor, contate o suporte da Academia.',
    })
  }

  if (matricula && !isAdmin) {
    const matStatus = matricula.getString('status')
    const fimStr = matricula.getString('fim')
    let isExpiredByDate = false
    if (fimStr) {
      try {
        const fimDate = new Date(fimStr)
        if (fimDate.getTime() < Date.now()) {
          isExpiredByDate = true
        }
      } catch (_) {}
    }

    if (matStatus === 'suspensa') {
      return e.json(403, {
        success: false,
        status: 'suspensa',
        message:
          'Acesso indisponível: sua matrícula está temporariamente suspensa. Fale com o suporte da Academia.',
      })
    }

    if (matStatus === 'expirada' || isExpiredByDate) {
      return e.json(403, {
        success: false,
        status: 'expirada',
        message: 'O período de acesso da sua turma expirou. Fale com o suporte para renovação.',
      })
    }

    if (matStatus !== 'ativa') {
      return e.json(403, {
        success: false,
        status: matStatus,
        message: 'Acesso indisponível no momento.',
      })
    }
  }

  // Matrícula ativa confirmada! Entrega conteúdo completo do caderno
  return e.json(200, {
    success: true,
    encontro: {
      numero: encRecord.getInt('numero'),
      titulo: encRecord.getString('titulo'),
      status: 'publicado',
      data_prevista: encRecord.getString('data_prevista'),
      conteudo: encRecord.get('conteudo'),
      recursos: encRecord.get('recursos'),
      gravacao_url: encRecord.getString('gravacao_url'),
      autorizado: true,
    },
  })
})
