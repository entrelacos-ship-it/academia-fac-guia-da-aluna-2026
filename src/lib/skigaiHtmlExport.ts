import { SkigaiDataModel } from '@/types/skigai'
import { exportarJsonCompativelSkill } from './skigaiSchema'

/**
 * Gera documento HTML autônomo offline completo:
 * - CSP estrito: default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'
 * - Nenhuma requisição de rede externa
 * - JSON dos dados embutido em <script id="skigai-dados" type="application/json">
 * - Estilização completa e responsiva pronta para visualização e impressão
 */
export function gerarHtmlAutonomoSkigai(modelo: SkigaiDataModel): string {
  const jsonCompativel = exportarJsonCompativelSkill(modelo)
  const resumo = modelo.resumo || ['', '', '', '', '']

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SKIGAI · Mapa do seu Ikigai-kan</title>
  <style>
    :root {
      --sk-fundo: #F8F6F8;
      --sk-superficie: #FFFFFF;
      --sk-texto: #261B2B;
      --sk-borda: #E5E7EB;
      --sk-primaria: #6D28D9;
      --sk-nutri: #F28A2E;
      --sk-lacuna: #8E3B73;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--sk-fundo);
      color: var(--sk-texto);
      margin: 0;
      padding: 24px;
      line-height: 1.5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: var(--sk-superficie);
      padding: 36px;
      border-radius: 16px;
      border: 1px solid var(--sk-borda);
    }
    h1, h2, h3 {
      font-family: Georgia, serif;
      font-weight: 500;
      margin-top: 0;
    }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: bold;
      background: #EDE9FE;
      color: #6D28D9;
    }
    .section { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--sk-borda); }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    th, td { border: 1px solid var(--sk-borda); padding: 8px 12px; text-align: left; }
    th { background: #F3F4F6; }
    .card { background: #FAFAFA; border: 1px solid var(--sk-borda); border-radius: 10px; padding: 16px; margin-top: 12px; }
    @media print {
      body { background: #fff; padding: 0; }
      .container { border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <span class="badge mono">SKIGAI · MAPA DE IKIGAI-KAN</span>
        <h1 style="margin-top: 8px; font-size: 28px;">Relatório de Sentido e Sustentação Clínica</h1>
        <p style="color: #6B7280; font-size: 14px; margin: 0;">Profissional: ${modelo.nome || 'Não informada'} · Data: ${modelo.data || 'Hoje'}</p>
      </div>
      <div style="text-align: right;">
        <span class="mono" style="font-size: 12px; color: #6B7280; display: block;">Termômetro:</span>
        <span style="font-size: 28px; font-weight: bold; color: var(--sk-primaria);">${modelo.termometro} / 10</span>
      </div>
    </div>

    <div class="section">
      <h2>1. Resumo em 5 Linhas de Orientação</h2>
      <ul style="padding-left: 20px; font-size: 14px; color: #374151;">
        ${resumo.map((linha) => `<li style="margin-bottom: 8px;">${linha}</li>`).join('')}
      </ul>
    </div>

    <div class="section">
      <h2>2. As 7 Necessidades Vitais</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Necessidade</th>
            <th>Nutrição (N)</th>
            <th>Importância (I)</th>
            <th>Interesse</th>
            <th>Habilidade</th>
          </tr>
        </thead>
        <tbody>
          ${(modelo.necessidades || [])
            .map(
              (n) => `
            <tr>
              <td class="mono">${n.id}</td>
              <td><strong>${n.nome}</strong></td>
              <td class="mono">${n.nutricao} / 3</td>
              <td class="mono">${n.importancia} / 3</td>
              <td class="mono">${n.interesse} / 3</td>
              <td class="mono">${n.habilidade} / 3</td>
            </tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>3. Plano de 4 Semanas de Sustentação</h2>
      ${(modelo.plano || [])
        .map(
          (p) => `
        <div class="card">
          <div style="display: flex; justify-content: space-between;">
            <strong class="mono">Semana ${p.semana} (${p.dia || 'Sem dia fixo'}) · Forma: ${p.tipo}</strong>
            <span style="font-size: 12px; color: #059669;">4 testes confirmados</span>
          </div>
          <p style="margin: 8px 0 0 0; font-size: 14px;"><strong>Micro-ação:</strong> ${p.acao || 'A definir'}</p>
          ${p.ikigai_kan ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #6B7280;"><em>Sentido: ${p.ikigai_kan}</em></p>` : ''}
        </div>`,
        )
        .join('')}
    </div>

    <div class="section">
      <h2>4. Bússola de Direção e Carta</h2>
      <div class="card" style="border-left: 4px solid var(--sk-primaria);">
        <span class="mono" style="font-size: 11px; text-transform: uppercase; color: var(--sk-primaria); font-weight: bold;">
          Versão Escolhida: ${modelo.frases?.escolhida || 'autoral'}
        </span>
        <p style="font-size: 15px; margin-top: 6px; font-weight: 500;">
          "${modelo.frases?.direcao?.find((f) => f.versao === (modelo.frases?.escolhida || 'autoral'))?.texto || modelo.frases?.sintese || 'Não definida'}"
        </p>
        ${modelo.frases?.sintese ? `<p class="mono" style="font-size: 12px; color: #6B7280; margin: 4px 0 0 0;">Síntese: ${modelo.frases.sintese}</p>` : ''}
      </div>

      ${
        modelo.carta
          ? `
      <div class="card" style="margin-top: 16px;">
        <strong class="mono" style="font-size: 11px; text-transform: uppercase;">Carta-Âncora para Si Mesma:</strong>
        <p style="font-size: 13px; font-style: italic; margin-top: 6px; white-space: pre-line;">${modelo.carta}</p>
      </div>`
          : ''
      }
    </div>

    <div class="section" style="font-size: 12px; color: #6B7280; text-align: center;">
      <p>SKIGAI · Academia FAC · Entrelaços Psicologia · Base conceitual: Kamiya (1966), Zuzunaga (2011), Mogi (2017).</p>
      <p>Canais de Apoio no Brasil: CVV 188 (24h) · SAMU 192.</p>
    </div>
  </div>

  <script id="skigai-dados" type="application/json">
${jsonCompativel}
  </script>
</body>
</html>`
}
