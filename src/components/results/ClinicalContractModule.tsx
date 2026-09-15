import React, { useState, useEffect, useMemo } from 'react'
import {
  FileText,
  Printer,
  Copy,
  Check,
  Send,
  Download,
  RotateCcw,
  ShieldCheck,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CurrencyInput } from '@/components/CurrencyInput'
import { useToast } from '@/hooks/use-toast'
import { formatBRL } from '@/lib/currency'
import {
  ClinicalContractData,
  DEFAULT_CONTRACT_DATA,
  DEFAULT_POLITICA_FALTAS,
  generateContractText,
  generateProposalText,
} from '@/lib/clinicalContractMath'

const STORAGE_KEY_CONTRATO = 'entrelacos_fac_contrato_v1'

interface ClinicalContractModuleProps {
  initialPisoFac: number
  precoAtual: number
  taxaFaltaPct: number
}

export const ClinicalContractModule: React.FC<ClinicalContractModuleProps> = ({
  initialPisoFac,
  precoAtual,
  taxaFaltaPct,
}) => {
  const { toast } = useToast()
  const [activeDocTab, setActiveDocTab] = useState<'contrato' | 'proposta'>('contrato')
  const [copied, setCopied] = useState(false)

  // Estado inicial carregado do localStorage
  const [formData, setFormData] = useState<ClinicalContractData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONTRATO)
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          ...DEFAULT_CONTRACT_DATA,
          ...parsed,
          valorSessao: parsed.valorSessao ?? (initialPisoFac > 0 ? initialPisoFac : 180),
        }
      }
    } catch (e) {
      console.warn('Erro ao restaurar contrato clínico:', e)
    }
    return {
      ...DEFAULT_CONTRACT_DATA,
      valorSessao: initialPisoFac > 0 ? initialPisoFac : 180,
    }
  })

  // Sincroniza se o piso FAC mudar e o formulário ainda estiver com o padrão
  useEffect(() => {
    if (initialPisoFac > 0 && formData.valorSessao === DEFAULT_CONTRACT_DATA.valorSessao) {
      setFormData((prev) => ({
        ...prev,
        valorSessao: initialPisoFac,
      }))
    }
  }, [initialPisoFac, formData.valorSessao])

  // Persistência
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONTRATO, JSON.stringify(formData))
    } catch (e) {
      console.warn('Erro ao salvar contrato clínico:', e)
    }
  }, [formData])

  // Geração reativa dos documentos
  const contractText = useMemo(() => generateContractText(formData), [formData])
  const proposalText = useMemo(() => generateProposalText(formData), [formData])

  const activeText = activeDocTab === 'contrato' ? contractText : proposalText

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(activeText)
      setCopied(true)
      toast({
        title: `${activeDocTab === 'contrato' ? 'Contrato' : 'Proposta'} copiado(a)!`,
        description: 'Texto integral copiado para a área de transferência.',
      })
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error('Erro ao copiar:', err)
      toast({
        variant: 'destructive',
        title: 'Não foi possível copiar',
        description: 'Selecione o texto e utilize Ctrl+C / Cmd+C.',
      })
    }
  }

  // Impressão limpa via janela dedicada com cabeçalho Entrelaços e formatação editorial
  const handlePrintDocument = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast({
        variant: 'destructive',
        title: 'Bloqueador de pop-ups ativo',
        description: 'Autorize pop-ups para gerar a impressão ou PDF.',
      })
      return
    }

    const title =
      activeDocTab === 'contrato'
        ? 'Contrato de Prestação de Serviços Psicológicos — Entrelaços'
        : 'Proposta de Honorários e Atendimento Clínico — Entrelaços'

    printWindow.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 18mm 20mm 18mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      font-size: 11pt;
      margin: 0;
      padding: 0;
    }
    .header {
      border-bottom: 2px solid #5B3A8E;
      padding-bottom: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand {
      font-size: 16pt;
      font-weight: 700;
      color: #5B3A8E;
      font-family: Georgia, Cambria, serif;
    }
    .subbrand {
      font-size: 8.5pt;
      color: #64748b;
      margin-top: 2px;
    }
    .doc-title {
      text-align: center;
      font-family: Georgia, Cambria, serif;
      font-size: 13pt;
      font-weight: 700;
      margin: 20px 0 24px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
    }
    .content {
      white-space: pre-wrap;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 10.5pt;
      text-align: justify;
      color: #1e293b;
    }
    .footer {
      margin-top: 40px;
      padding-top: 10px;
      border-top: 1px solid #cbd5e1;
      font-size: 8pt;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Entrelaços Psicologia</div>
      <div class="subbrand">Precificação Clínica Ética · Método FAC</div>
    </div>
    <div style="font-size: 8.5pt; color: #64748b;">
      Emitido em: ${new Date().toLocaleDateString('pt-BR')}
    </div>
  </div>

  <div class="content">${activeText}</div>

  <div class="footer">
    <span>Documento gerado pela Calculadora de Precificação do Método FAC</span>
    <span>Entrelaços Psicologia © ${new Date().getFullYear()}</span>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`)
    printWindow.document.close()
  }

  const handleResetDefaults = () => {
    setFormData({
      ...DEFAULT_CONTRACT_DATA,
      valorSessao: initialPisoFac > 0 ? initialPisoFac : 180,
    })
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Módulo Astral */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-[#27272A] bg-[#0A0A14] text-[#C084FC] font-mono font-semibold text-[10px]"
            >
              MÓDULO 3 · FORMALIZAÇÃO ÉTICA
            </Badge>
            <span className="text-xs font-mono text-[#71717A]">
              Contrato Formal & Proposta de Honorários
            </span>
          </div>
          <h3 className="font-sans text-xl sm:text-2xl font-semibold text-white mt-1.5">
            Exportação de Proposta de Honorários e Contrato Clínico
          </h3>
          <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-2xl mt-0.5">
            Gere minutas prontas para uso profissional com cláusulas de sigilo (CFP), política de
            faltas (24h), reajuste anual por inflação e forma de pagamento, com exportação para
            impressão/PDF ou cópia.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetDefaults}
          className="gap-1.5 border-[#27272A] bg-[#18181B] text-[#A1A1AA] hover:text-white self-start sm:self-auto shrink-0 font-mono text-xs rounded-[8px]"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#71717A]" />
          Restaurar Padrão
        </Button>
      </div>

      {/* Formulário de Personalização (2 Colunas) Astral */}
      <Card className="bg-[#18181B] border-[#27272A] shadow-xl rounded-[16px]">
        <CardHeader className="pb-3">
          <CardTitle className="font-sans text-base font-semibold text-white">
            1. Dados da Profissional e do Atendimento
          </CardTitle>
          <CardDescription className="text-xs text-[#A1A1AA]">
            Preencha seus dados para que todas as cláusulas do contrato e proposta sejam geradas
            automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Nome da Psicóloga */}
            <div className="space-y-1.5">
              <Label
                htmlFor="contrato-nome-prof"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Nome Completo da Profissional
              </Label>
              <Input
                id="contrato-nome-prof"
                placeholder="Ex: Dra. Juliana Fernandes"
                value={formData.nomeProfissional}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nomeProfissional: e.target.value }))
                }
                className="h-10 text-sm"
              />
            </div>

            {/* CRP */}
            <div className="space-y-1.5">
              <Label
                htmlFor="contrato-crp"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Registro CRP
              </Label>
              <Input
                id="contrato-crp"
                placeholder="Ex: CRP 06/123456"
                value={formData.crp}
                onChange={(e) => setFormData((prev) => ({ ...prev, crp: e.target.value }))}
                className="h-10 text-sm font-mono"
              />
            </div>

            {/* Cidade e UF */}
            <div className="space-y-1.5">
              <Label
                htmlFor="contrato-cidade"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cidade / UF do Consultório ou Foro
              </Label>
              <Input
                id="contrato-cidade"
                placeholder="Ex: São Paulo - SP"
                value={formData.cidadeUf}
                onChange={(e) => setFormData((prev) => ({ ...prev, cidadeUf: e.target.value }))}
                className="h-10 text-sm"
              />
            </div>

            {/* Nome do Paciente */}
            <div className="space-y-1.5">
              <Label
                htmlFor="contrato-paciente"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Nome do Paciente (ou deixar em branco)
              </Label>
              <Input
                id="contrato-paciente"
                placeholder="Ex: Maria Clara Silva (ou em branco)"
                value={formData.nomePaciente}
                onChange={(e) => setFormData((prev) => ({ ...prev, nomePaciente: e.target.value }))}
                className="h-10 text-sm"
              />
            </div>

            {/* Valor da Sessão */}
            <div className="space-y-1.5">
              <CurrencyInput
                id="contrato-valor"
                label="Valor Acordado por Sessão"
                value={formData.valorSessao}
                onChange={(val) => setFormData((prev) => ({ ...prev, valorSessao: val }))}
                helperText="Pré-preenchido com o Piso Mínimo FAC."
              />
            </div>

            {/* Duração da Sessão */}
            <div className="space-y-1.5">
              <Label
                htmlFor="contrato-duracao"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Duração da Sessão (minutos)
              </Label>
              <Input
                id="contrato-duracao"
                type="number"
                min={30}
                max={120}
                value={formData.duracaoMinutos}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duracaoMinutos: parseInt(e.target.value, 10) || 50,
                  }))
                }
                className="h-10 text-sm font-mono"
              />
            </div>

            {/* Forma de Pagamento */}
            <div className="space-y-1.5">
              <Label
                htmlFor="contrato-forma-pagto"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Forma de Pagamento
              </Label>
              <Input
                id="contrato-forma-pagto"
                placeholder="Ex: PIX ou Transferência"
                value={formData.formaPagamento}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, formaPagamento: e.target.value }))
                }
                className="h-10 text-sm"
              />
            </div>

            {/* Dia de Vencimento Mensal */}
            <div className="space-y-1.5">
              <Label
                htmlFor="contrato-vencimento"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Dia de Vencimento / Fechamento
              </Label>
              <Input
                id="contrato-vencimento"
                type="number"
                min={1}
                max={31}
                value={formData.diaVencimento}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    diaVencimento: parseInt(e.target.value, 10) || 5,
                  }))
                }
                className="h-10 text-sm font-mono"
              />
            </div>

            {/* Reajuste Anual (Índice e Mês) */}
            <div className="space-y-1.5">
              <Label
                htmlFor="contrato-reajuste-indice"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Índice e Mês de Reajuste
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="contrato-reajuste-indice"
                  placeholder="Ex: IPCA"
                  value={formData.indiceReajusteNome}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, indiceReajusteNome: e.target.value }))
                  }
                  className="h-10 text-sm"
                />
                <Input
                  placeholder="Mês (Ex: Janeiro)"
                  value={formData.mesReajusteAnual}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, mesReajusteAnual: e.target.value }))
                  }
                  className="h-10 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Política de Faltas e Cancelamentos */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="contrato-politica-faltas"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cláusula de Faltas, Desmarcações e Cancelamentos (editável)
              </Label>
              <span className="text-[11px] text-slate-400">Padrão ético: antecedência de 24h</span>
            </div>
            <Textarea
              id="contrato-politica-faltas"
              rows={3}
              value={formData.politicaFaltas}
              onChange={(e) => setFormData((prev) => ({ ...prev, politicaFaltas: e.target.value }))}
              className="text-xs leading-relaxed bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            />
          </div>
        </CardContent>
      </Card>

      {/* Visualização e Ações de Exportação */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-2xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5B3A8E] dark:text-purple-400" />
                2. Visualização e Exportação do Documento
              </CardTitle>
              <CardDescription className="text-xs">
                Selecione o formato desejado, imprima diretamente em PDF ou copie o texto.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyText}
                className="gap-1.5 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Texto
                  </>
                )}
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handlePrintDocument}
                className="gap-1.5 bg-[#5B3A8E] hover:bg-[#452A6F] text-white text-xs shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir / Salvar em PDF
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs
            value={activeDocTab}
            onValueChange={(val) => setActiveDocTab(val as 'contrato' | 'proposta')}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 max-w-sm mb-4">
              <TabsTrigger value="contrato" className="text-xs font-semibold">
                Contrato Clínico Completo
              </TabsTrigger>
              <TabsTrigger value="proposta" className="text-xs font-semibold">
                Proposta Simplificada
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contrato" className="m-0">
              <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                {contractText}
              </div>
            </TabsContent>

            <TabsContent value="proposta" className="m-0">
              <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                {proposalText}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/40 text-xs text-purple-900 dark:text-purple-200">
            <ShieldCheck className="w-4 h-4 text-[#5B3A8E] dark:text-purple-400 shrink-0" />
            <span>
              Cláusulas alinhadas à Resolução CFP nº 010/2005 (Código de Ética Profissional do
              Psicólogo) e às boas práticas de acolhimento do Método FAC.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
