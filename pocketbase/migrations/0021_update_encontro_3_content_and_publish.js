migrate(
  (app) => {
    try {
      const enc3 = app.findFirstRecordByData('fac_guia_encontros', 'numero', 3)
      enc3.set('titulo', 'Encontro 3: Princípios da Sustentabilidade Financeira da Clínica')
      enc3.set('data_prevista', '20/10/2026')
      enc3.set(
        'conteudo',
        JSON.stringify({
          introducao:
            'Cada aluna sai do encontro com o piso da sua sessão calculado e uma regra de preço escrita, que passa a guiar toda decisão financeira da clínica. Pilar: Fundação.',
          secoes: [
            {
              titulo: 'Visão geral',
              texto:
                'Quanto a sua sessão precisa custar para a sua prática se sustentar, sem consumir você? Entregável: print ou PDF do resultado da Calculadora + o cartão "Minha Regra de Preço" preenchido (5 linhas).',
            },
            {
              titulo: 'Roteiro de 90 minutos',
              texto:
                '19h00 Abertura (5 min) · 19h05 Teoria (25 min) · 19h30 Atividade 1 (25 min) · 19h55 Laboratório (15 min) · 20h10 Atividade 2 (15 min) · 20h25 Combinado da semana (5 min).',
            },
            {
              titulo: 'Atividade 1 · Meu piso por sessão',
              texto:
                'Calculadora de Precificação Clínica Ética no Guia da Aluna. Abre no navegador, nada para baixar e nenhum dado sai do aparelho.',
            },
            {
              titulo: 'Atividade 2 · Cartão "Minha Regra de Preço"',
              texto:
                'Piso por sessão, preço praticado, política de valor social, condição especial e data de revisão.',
            },
          ],
        }),
      )
      enc3.set(
        'recursos',
        JSON.stringify([
          {
            rotulo: 'Calculadora de Precificação Clínica Ética',
            tipo: 'app',
            url: '/calculadora',
          },
        ]),
      )
      // Encontro 3 publicado para turmas com alunas validadas
      enc3.set('status', 'publicado')
      app.save(enc3)
    } catch (err) {
      console.warn('[Migration 0021] Encontro 3 record update error:', err)
    }
  },
  (app) => {
    try {
      const enc3 = app.findFirstRecordByData('fac_guia_encontros', 'numero', 3)
      enc3.set('status', 'rascunho')
      app.save(enc3)
    } catch (_) {}
  },
)
