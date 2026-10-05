import React from 'react'
import {
  ResultadoDiagnosticoV2,
  RESSALVA_ESCOPO,
  RESSALVA_PERCENTUAL,
  CHECKLIST_SEIS_MOVIMENTOS,
  PERGUNTA_CUIDADO_CONDUCAO,
  PERGUNTA_CUIDADO_SUPERVISAO,
} from '@/lib/diagnosticoFacEngine'

interface PrintableDiagnosticoReportProps {
  resultado: ResultadoDiagnosticoV2
}

export const PrintableDiagnosticoReport: React.FC<PrintableDiagnosticoReportProps> = ({
  resultado,
}) => {
  const dataHoje = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const {
    pilares,
    pilaresOrdenados,
    porOndeComecar,
    alertas,
    contextoInicial,
    respostasAbertas,
    cuidadoClinico,
    avisoCuidadoClinico,
  } = resultado

  const textoConducao =
    cuidadoClinico.conducaoClinica !== null
      ? PERGUNTA_CUIDADO_CONDUCAO.opcoes.find((o) => o.valor === cuidadoClinico.conducaoClinica)
          ?.texto || 'Não informado'
      : 'Não informado'

  const textoSupervisao =
    cuidadoClinico.supervisaoRegular !== null
      ? PERGUNTA_CUIDADO_SUPERVISAO.opcoes.find((o) => o.valor === cuidadoClinico.supervisaoRegular)
          ?.texto || 'Não informado'
      : 'Não informado'

  return (
    <div
      id="printable-diagnostico-report"
      className="hidden print:block p-8 bg-white text-slate-900 font-sans max-w-4xl mx-auto space-y-8"
      style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
    >
      {/* 1. CAPA / CABEÇALHO */}
      <div className="border-b-2 border-[#7c3aed] pb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7c3aed]">
              Entrelaços Psicologia · Academia Método FAC
            </span>
            <h1 className="text-3xl font-bold text-slate-900 mt-1">
              Diagnóstico FAC Aprofundado (Versão 2)
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Retrato Estrutural da Prática Profissional da Psicóloga
            </p>
          </div>
          <div className="text-right text-xs text-slate-500 font-mono">
            <span>Data de Emissão: {dataHoje}</span>
          </div>
        </div>

        {/* Destaque da Média FAC e Tríade */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-4 gap-4 items-center">
          <div className="border-r border-slate-200 pr-4">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">
              Média FAC Global
            </span>
            <div className="text-4xl font-bold font-mono text-[#7c3aed] mt-1">
              {resultado.mediaFac}%
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Soma: {resultado.somaTotal} de 96 pts
            </span>
          </div>

          {(['fundacao', 'atracao', 'conexao'] as const).map((pid) => {
            const p = pilares[pid]
            return (
              <div key={pid} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{p.nome}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-100 text-[#7c3aed]">
                    {p.nivel.rotulo}
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900">{p.percentual}%</div>
                <p className="text-[10px] text-slate-500 leading-tight">{p.nivel.descricao}</p>
              </div>
            )
          })}
        </div>

        {/* Resumo da Combinação */}
        <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-lg">
          <span className="text-[10px] font-mono font-bold uppercase text-[#7c3aed] block mb-1">
            Combinação Editorial Verbatim: {resultado.tituloLeitura}
          </span>
          <p className="text-xs text-slate-700 leading-relaxed">{resultado.leituraPratica}</p>
        </div>
      </div>

      {/* 2. VISÃO GERAL */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b pb-1">
          1. Visão Geral & Relação Entre os Pilares
        </h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-700 block">Ordem dos Pilares:</span>
            <p className="font-mono text-sm font-semibold text-[#7c3aed]">
              {pilaresOrdenados
                .map((p, idx) => `${idx + 1}º ${p.nome} (${p.percentual}%)`)
                .join(' → ')}
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed mt-2">
              {resultado.relacaoEntrePilares}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-700 block">Por Onde Começar:</span>
            <p className="font-semibold text-slate-900">
              Pilar Inicial: {pilares[porOndeComecar.pilarInicial].nome} (
              {pilares[porOndeComecar.pilarInicial].percentual}%)
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {porOndeComecar.motivoPilar}
            </p>
            <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
              <p>
                <strong>1º Movimento:</strong> {porOndeComecar.dimensaoPrioritaria.codigo} (
                {porOndeComecar.dimensaoPrioritaria.nome}) ·{' '}
                {porOndeComecar.dimensaoPrioritaria.acao}
              </p>
              <p>
                <strong>2º Movimento:</strong> {porOndeComecar.dimensaoSeguinte.codigo} (
                {porOndeComecar.dimensaoSeguinte.nome}) · {porOndeComecar.dimensaoSeguinte.acao}
              </p>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {alertas.length > 0 && (
          <div className="p-4 bg-amber-50/60 border border-amber-300 rounded-lg space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-amber-800 block">
              Pontos de Atenção Observados (Até 3 Hipóteses)
            </span>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {alertas.map((al, idx) => (
                <div key={idx} className="p-2 bg-white border border-amber-200 rounded">
                  <p className="font-bold text-amber-900">
                    {idx + 1}. {al.titulo}
                  </p>
                  <p className="text-slate-600 text-[11px] mt-0.5">{al.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. OS TRÊS PILARES E SUAS 12 DIMENSÕES */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b pb-1">
          2. Detalhamento dos Três Pilares & 12 Dimensões
        </h2>

        {(['fundacao', 'atracao', 'conexao'] as const).map((pid) => {
          const p = pilares[pid]
          return (
            <div key={pid} className="space-y-2 border border-slate-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Pilar {p.nome} — {p.percentual}% ({p.nivel.rotulo})
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {p.nivel.descricao} · Dimensão mais firme: {p.dimensaoMaisFirme.codigo} (
                    {p.dimensaoMaisFirme.nome}) · Dimensão prioritária:{' '}
                    {p.dimensaoMenosFirme.codigo} ({p.dimensaoMenosFirme.nome})
                  </span>
                </div>
                <span className="text-sm font-bold font-mono text-[#7c3aed]">{p.soma}/32 pts</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {p.dimensoes.map((d) => (
                  <div
                    key={d.codigo}
                    className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">
                        {d.codigo} · {d.nome}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#7c3aed]">
                        {d.percentual}% (méd. {d.media})
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{d.interpretacao}</p>
                    <div className="pt-1.5 border-t border-slate-200 text-[10px] space-y-1 text-slate-500">
                      <p>
                        <strong>Alternativas marcadas:</strong>
                      </p>
                      <ul className="list-disc pl-3 space-y-0.5">
                        <li>{d.alternativasTextos[0]}</li>
                        <li>{d.alternativasTextos[1]}</li>
                      </ul>
                      <p className="text-[#7c3aed] pt-1">
                        <strong>Ação sugerida ({d.tipoAcao}):</strong> {d.acao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* 4. SUAS PALAVRAS & CONTEXTO */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b pb-1">
          3. Suas Palavras, Contexto Inicial & Cuidado Clínico
        </h2>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="font-bold text-slate-800">
              Contexto da Agenda & Formas de Trabalho
            </span>
            <p className="text-slate-600 text-[11px]">
              Momento de carreira: {contextoInicial.momentoCarreira || 'Não informado'}
            </p>
            <p className="text-slate-600 text-[11px]">
              Formas de atendimento:{' '}
              {contextoInicial.formasAtendimento.join(', ') || 'Não informado'}
            </p>
            <p className="text-slate-600 text-[11px]">
              Sessões por semana: {contextoInicial.sessoesAtuais ?? '—'} atuais ·{' '}
              {contextoInicial.sessoesDesejadas ?? '—'} desejadas
            </p>
            <p className="text-slate-600 text-[11px]">
              Origens dos últimos pacientes:{' '}
              {contextoInicial.origensUltimosPacientes.join(', ') || 'Não informado'}
            </p>
            {contextoInicial.oQueMaisTrava && (
              <p className="text-slate-700 text-[11px] pt-1 border-t italic">
                "O que mais trava: {contextoInicial.oQueMaisTrava}"
              </p>
            )}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="font-bold text-slate-800">
              Cuidado Clínico (Sem impacto na nota FAC)
            </span>
            <p className="text-slate-600 text-[11px]">
              <strong>Condução clínica:</strong> {textoConducao}
            </p>
            <p className="text-slate-600 text-[11px]">
              <strong>Supervisão/troca regular:</strong> {textoSupervisao}
            </p>
            {avisoCuidadoClinico && (
              <div className="p-2 mt-2 bg-purple-50 border border-purple-200 rounded text-purple-900 text-[10px] leading-relaxed">
                {avisoCuidadoClinico}
              </div>
            )}
          </div>
        </div>

        {/* Respostas Abertas dos Pilares */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
          <span className="font-bold text-slate-800 block">
            Respostas Abertas Registradas (Literais)
          </span>
          <div className="space-y-1.5 text-[11px] text-slate-700">
            <p>
              <strong>Fundação (o que já tentou organizar e não foi adiante):</strong>{' '}
              <span className="italic">{respostasAbertas.fundacao || 'Não preenchido'}</span>
            </p>
            <p>
              <strong>Atração (qual canal já trouxe paciente, mesmo poucas vezes):</strong>{' '}
              <span className="italic">{respostasAbertas.atracao || 'Não preenchido'}</span>
            </p>
            <p>
              <strong>Conexão (momento em que mais percebe perdas):</strong>{' '}
              <span className="italic">{respostasAbertas.conexao || 'Não preenchido'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 5. PRÓXIMOS PASSOS & RESSALVA */}
      <div className="space-y-4 pt-2">
        <h2 className="text-base font-bold text-slate-900 border-b pb-1">
          4. Checklist Final dos Seis Movimentos
        </h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {CHECKLIST_SEIS_MOVIMENTOS.map((mov, idx) => (
            <div
              key={idx}
              className="p-2 border border-slate-200 rounded bg-slate-50 flex items-start gap-2"
            >
              <span className="w-4 h-4 rounded-full bg-purple-200 text-[#7c3aed] text-[10px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-[11px] text-slate-700 leading-snug">{mov}</span>
            </div>
          ))}
        </div>

        {/* Disclaimer Metodológico Obrigatório */}
        <div className="p-4 border-t-2 border-slate-200 text-[10px] text-slate-500 space-y-1 mt-4">
          <p>
            <strong>{RESSALVA_ESCOPO}</strong>
          </p>
          <p>{RESSALVA_PERCENTUAL}</p>
          <p className="font-mono pt-1 text-slate-400">
            Entrelaços Psicologia · Academia Método FAC © 2026. Documento de uso pessoal gerado
            localmente.
          </p>
        </div>
      </div>
    </div>
  )
}
