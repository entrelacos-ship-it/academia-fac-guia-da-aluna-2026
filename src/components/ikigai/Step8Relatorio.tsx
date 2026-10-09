import React, { useState } from 'react'
import { SkigaiDataModel } from '@/types/skigai'
import {
  processarCalculoSkigaiCompleto,
  gerarResumoPorRegras,
  NECESSIDADES_DEFINICOES,
  PILARES_MOGI_DEFINICOES,
} from '@/lib/skigaiEngine'
import { SkigaiRadar } from './SkigaiRadar'
import { exportarCapsulaSkigai, exportarJsonCompativelSkill } from '@/lib/skigaiSchema'
import { gerarHtmlAutonomoSkigai } from '@/lib/skigaiHtmlExport'
import {
  Printer,
  Download,
  Copy,
  Check,
  RefreshCw,
  HeartHandshake,
  ShieldCheck,
  Star,
  FileCode,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Step8RelatorioProps {
  model: SkigaiDataModel
  onAtualizar: (novosDados: Partial<SkigaiDataModel>) => void
  onIniciarRevisao: () => void
  onVoltar: () => void
}

export const Step8Relatorio: React.FC<Step8RelatorioProps> = ({
  model,
  onAtualizar,
  onIniciarRevisao,
  onVoltar,
}) => {
  const [copiado, setCopiado] = useState(false)
  const [soaComoEu, setSoaComoEu] = useState<'sim' | 'em_parte' | 'nao' | null>(null)

  const calculo = processarCalculoSkigaiCompleto(model)
  const resumoLinhas = gerarResumoPorRegras(model, calculo)

  // Atualizar resumo no modelo se estiver vazio
  if (!model.resumo || !model.resumo[0]) {
    model.resumo = resumoLinhas
  }

  // Baixar JSON compatível
  const handleDownloadJson = () => {
    const jsonStr = exportarJsonCompativelSkill(model)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `skigai-mapa-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Baixar HTML autônomo offline
  const handleDownloadHtml = () => {
    const htmlStr = gerarHtmlAutonomoSkigai(model)
    const blob = new Blob([htmlStr], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `skigai-relatorio-autonomo-${new Date().toISOString().slice(0, 10)}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Copiar dados para revisão / backup
  const handleCopiarCapsula = () => {
    const capsula = exportarCapsulaSkigai(model)
    navigator.clipboard.writeText(capsula)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 3000)
  }

  // Imprimir Relatório (dispara janela nativa de impressão com CSS @media print)
  const handleImprimir = () => {
    window.print()
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto text-left animate-fade-in print:p-0 print:max-w-none">
      {/* Barra Superior de Ações de Exportação */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-[16px] border border-border bg-card shadow-xs print:hidden">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onVoltar}
          className="text-xs font-mono gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para direção</span>
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleImprimir}
            className="text-xs font-mono gap-1.5 bg-primary text-primary-foreground"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleDownloadHtml}
            className="text-xs font-mono gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Baixar HTML Autônomo</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleDownloadJson}
            className="text-xs font-mono gap-1.5"
          >
            <FileCode className="w-4 h-4" />
            <span>Exportar JSON</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCopiarCapsula}
            className="text-xs font-mono gap-1.5"
          >
            {copiado ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copiado ? 'Cápsula copiada!' : 'Copiar Cápsula'}</span>
          </Button>
        </div>
      </div>

      {/* SEÇÃO 1: Capa */}
      <div className="p-8 rounded-[20px] border border-border bg-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
              Relatório Final · Fase 8 de 8
            </span>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-foreground">
              Meu Mapa de Ikigai-kan
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Profissional: {model.nome || 'Não informada'} · Data: {model.data} · Palavra do dia:{' '}
              <strong className="text-foreground">{model.palavraDeHoje || 'Não informada'}</strong>
            </p>
          </div>

          <div className="p-4 rounded-[14px] bg-primary/10 border border-primary/20 text-center shrink-0">
            <span className="text-[10px] font-mono text-primary font-semibold block uppercase">
              O trabalho vale a pena
            </span>
            <span className="text-3xl font-serif-editorial font-bold text-primary">
              {model.termometro} / 10
            </span>
          </div>
        </div>

        {model.frases?.sintese && (
          <div className="pt-2 text-xs font-mono italic text-muted-foreground">
            &quot;{model.frases.sintese}&quot;
          </div>
        )}
      </div>

      {/* SEÇÃO 2: Radar das 7 Necessidades com Legenda e Tabela */}
      <div className="p-8 rounded-[20px] border border-border bg-card space-y-6">
        <h2 className="font-serif-editorial text-2xl font-medium text-foreground">
          2. O Radar das 7 Necessidades
        </h2>

        <SkigaiRadar
          necessidades={model.necessidades}
          termometro={model.termometro}
          termometroAnterior={model.anterior?.termometro}
          necessidadesAnteriores={model.anterior?.necessidades}
          tamanho={480}
        />
      </div>

      {/* SEÇÃO 3: Resumo em 5 Linhas por Regras */}
      <div className="p-6 rounded-[16px] border border-border bg-card space-y-4">
        <h2 className="font-serif-editorial text-xl font-medium text-foreground">
          3. Resumo de Orientação em 5 Linhas
        </h2>

        <div className="space-y-2.5 text-xs text-muted-foreground">
          {resumoLinhas.map((linha, idx) => (
            <div
              key={`resumo-lin-${idx}`}
              className="p-3 rounded-[8px] bg-muted/30 border border-border flex items-start gap-2"
            >
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-mono text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                0{idx + 1}
              </span>
              <p className="leading-relaxed text-foreground">{linha}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO 4 & 5: Recursos e Prioridades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recursos */}
        <div className="p-6 rounded-[16px] border border-border bg-card space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="font-serif-editorial text-xl font-medium text-foreground">
              4. Recursos (Suas Forças)
            </h3>
          </div>
          {calculo.recursos.map((rec) => (
            <div
              key={`rec-rep-${rec.id}`}
              className="p-3 rounded-[8px] bg-muted/40 text-xs space-y-1"
            >
              <strong>{rec.nome}</strong> (Força {rec.forca} · Nutrição {rec.nutricao})
              {rec.reflexao && (
                <p className="italic text-muted-foreground">&quot;{rec.reflexao}&quot;</p>
              )}
            </div>
          ))}
        </div>

        {/* Prioridades */}
        <div className="p-6 rounded-[16px] border border-border bg-card space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#8E3B73] text-white flex items-center justify-center font-mono text-xs font-bold">
              !
            </span>
            <h3 className="font-serif-editorial text-xl font-medium text-foreground">
              5. Prioridades de Cuidado
            </h3>
          </div>
          {calculo.prioridades.map((pri) => (
            <div
              key={`pri-rep-${pri.id}`}
              className="p-3 rounded-[8px] bg-muted/40 text-xs space-y-1"
            >
              <strong>{pri.nome}</strong> (Lacuna {pri.lacuna} · Alavanca {pri.alavanca})
              {pri.reflexao && (
                <p className="italic text-muted-foreground">&quot;{pri.reflexao}&quot;</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO 6: Mapa de Fontes */}
      <div className="p-6 rounded-[16px] border border-border bg-card space-y-4">
        <h3 className="font-serif-editorial text-xl font-medium text-foreground">
          6. Mapa de Fontes e Concentração
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
          <div className="p-3 bg-muted/30 rounded-[8px]">
            <span className="text-muted-foreground block text-[10px]">Concentração:</span>
            <span className="font-bold text-base">
              {calculo.concentracaoFontes ?? 'Sem dados'}%
            </span>
          </div>
          <div className="p-3 bg-muted/30 rounded-[8px]">
            <span className="text-muted-foreground block text-[10px]">Fragilidade:</span>
            <span className="font-bold text-base">
              {calculo.fragilidadeMediaFontes ?? 'Sem dados'} / 3
            </span>
          </div>
          <div className="p-3 bg-muted/30 rounded-[8px]">
            <span className="text-muted-foreground block text-[10px]">Sem Fonte Direta:</span>
            <span className="font-bold text-base text-amber-600">
              {calculo.necessidadesSemFonte.length} de 7
            </span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 7: Estrutura contra Escolha */}
      <div className="p-6 rounded-[16px] border border-border bg-card space-y-4">
        <h3 className="font-serif-editorial text-xl font-medium text-foreground">
          7. Estrutura contra Escolha
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-[10px] bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/50 space-y-1">
            <strong className="text-rose-700 dark:text-rose-300 font-mono block">
              Fora do meu controle:
            </strong>
            {model.estrutura?.fora_do_meu_controle?.map((f, i) => (
              <p key={i}>• {f}</p>
            ))}
          </div>
          <div className="p-4 rounded-[10px] bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 space-y-1">
            <strong className="text-emerald-700 dark:text-emerald-300 font-mono block">
              Onde posso mexer:
            </strong>
            {model.estrutura?.posso_mexer?.map((m, i) => (
              <p key={i}>• {m}</p>
            ))}
          </div>
        </div>
      </div>

      {/* SEÇÃO 8: Cinco Pilares */}
      <div className="p-6 rounded-[16px] border border-border bg-card space-y-4">
        <h3 className="font-serif-editorial text-xl font-medium text-foreground">
          8. Cinco Pilares de Ken Mogi
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
          {model.pilares?.map((pil) => (
            <div key={`p-card-${pil.id}`} className="p-3 rounded-[8px] bg-muted/30 space-y-1">
              <span className="text-[10px] font-mono text-muted-foreground block">{pil.nome}</span>
              <span className="font-bold font-mono text-[#0EA5A5] text-sm">{pil.presenca} / 3</span>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO 9: Plano de 4 Semanas */}
      <div className="p-6 rounded-[16px] border border-border bg-card space-y-4">
        <h3 className="font-serif-editorial text-xl font-medium text-foreground">
          9. Plano de 4 Semanas
        </h3>
        <div className="space-y-2 text-xs">
          {model.plano?.map((pl) => (
            <div
              key={`pl-rep-${pl.semana}`}
              className="p-3.5 rounded-[10px] bg-muted/30 border border-border flex flex-col sm:flex-row justify-between gap-2"
            >
              <div>
                <strong>
                  Semana {pl.semana} ({pl.dia}):
                </strong>{' '}
                {pl.acao}
                {pl.ikigai_kan && (
                  <span className="block text-muted-foreground italic mt-0.5">
                    Sentido: {pl.ikigai_kan}
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 shrink-0">
                4 testes ok
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO 10: Frase de Direção */}
      <div className="p-6 rounded-[16px] border border-primary/20 bg-primary/5 space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
          10. Frase de Direção ({model.frases?.escolhida})
        </span>
        <p className="font-serif-editorial text-lg text-foreground italic">
          &quot;
          {model.frases?.direcao?.find((f) => f.versao === model.frases?.escolhida)?.texto ||
            model.frases?.sintese}
          &quot;
        </p>
      </div>

      {/* SEÇÃO 11: Carta-Âncora para Si Mesma */}
      <div className="p-6 rounded-[16px] border border-border bg-card space-y-3">
        <h3 className="font-serif-editorial text-xl font-medium text-foreground">
          11. Carta-Âncora para Si Mesma
        </h3>
        <Textarea
          rows={5}
          value={model.carta}
          onChange={(e) => onAtualizar({ carta: e.target.value })}
          placeholder="O que você gostaria de lembrar a si mesma daqui a 30 dias quando o cansaço bater?"
          className="text-xs font-sans leading-relaxed resize-none"
        />
      </div>

      {/* SEÇÃO 12: Revisão em 30 Dias */}
      <div className="p-6 rounded-[16px] border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/10 space-y-4 print:hidden">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-primary" />
          <h3 className="font-serif-editorial text-xl font-medium text-foreground">
            12. Revisão em 30 Dias com Radar Sobreposto
          </h3>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          O ikigai-kan é um sentimento vivo. Daqui a 30 dias, você poderá revisitar o seu mapa. O
          aplicativo guardará este momento como &quot;antes&quot; (contorno cinza no radar) e você
          atualizará apenas o termômetro e as 4 notas por necessidade, observando o que subiu, ficou
          ou desceu.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={onIniciarRevisao}
            className="text-xs font-mono font-semibold bg-primary text-primary-foreground gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Fazer a revisão agora</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCopiarCapsula}
            className="text-xs font-mono gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar dados da revisão</span>
          </Button>
        </div>
      </div>

      {/* SEÇÃO 13: Rodapé Permanente de Cuidado e Ética */}
      <div className="p-6 rounded-[16px] border border-border bg-card space-y-3 text-xs text-muted-foreground text-center">
        <div className="flex items-center justify-center gap-2 font-mono font-semibold text-foreground">
          <HeartHandshake className="w-4 h-4 text-primary" />
          <span>Apoio e Cuidado: CVV 188 (24h gratuito) · SAMU 192</span>
        </div>
        <p className="leading-relaxed">
          SKIGAI · Academia FAC · Entrelaços Psicologia. Este mapa não é avaliação, teste
          psicométrico nem diagnóstico. Base conceitual: Kamiya (1966), Zuzunaga (2011), Mogi
          (2017).
        </p>
      </div>
    </div>
  )
}
