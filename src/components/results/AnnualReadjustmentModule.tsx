import React, { useState, useEffect, useMemo } from 'react'
import {
  TrendingUp,
  Copy,
  Check,
  Calendar,
  Percent,
  Sparkles,
  Info,
  RotateCcw,
  ArrowUpRight,
  MessageSquare,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { CurrencyInput } from '@/components/CurrencyInput'
import { useToast } from '@/hooks/use-toast'
import { formatBRL, formatNumberBR } from '@/lib/currency'
import {
  calculateAnnualReadjustment,
  AnnualReadjustmentInputs,
  INFLATION_PRESETS,
  InflationIndexPreset,
} from '@/lib/readjustmentMath'

const STORAGE_KEY_REAJUSTE = 'entrelacos_fac_reajuste_v1'

interface AnnualReadjustmentModuleProps {
  initialHonorario: number // V_min ou precoAtual do FAC
  sessoesEfetivas: number
  precoAtualCadastrado?: number
}

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export const AnnualReadjustmentModule: React.FC<AnnualReadjustmentModuleProps> = ({
  initialHonorario,
  sessoesEfetivas,
  precoAtualCadastrado = 0,
}) => {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // Estado inicial recuperado do localStorage
  const [inputs, setInputs] = useState<AnnualReadjustmentInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REAJUSTE)
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          honorarioAtual:
            parsed.honorarioAtual ??
            (precoAtualCadastrado > 0 ? precoAtualCadastrado : initialHonorario || 180),
          tipoIndice: parsed.tipoIndice ?? 'IPCA',
          indicePct: parsed.indicePct ?? 4.83, // IPCA 2024
          anoReferenciaPreset: parsed.anoReferenciaPreset ?? 'ipca-2024',
          numeroPeriodos: parsed.numeroPeriodos ?? 1,
          mesReajuste: parsed.mesReajuste ?? 'Janeiro',
          nomeProfissional: parsed.nomeProfissional ?? '',
          nomePaciente: parsed.nomePaciente ?? '',
        }
      }
    } catch (e) {
      console.warn('Erro ao restaurar reajuste anual:', e)
    }
    return {
      honorarioAtual: precoAtualCadastrado > 0 ? precoAtualCadastrado : initialHonorario || 180,
      tipoIndice: 'IPCA',
      indicePct: 4.83,
      anoReferenciaPreset: 'ipca-2024',
      numeroPeriodos: 1,
      mesReajuste: 'Janeiro',
      nomeProfissional: '',
      nomePaciente: '',
    }
  })

  // Sincroniza honorário se o usuário mudar de cenário/cálculo e o valor atual estiver zerado
  useEffect(() => {
    if (initialHonorario > 0 && (!inputs.honorarioAtual || inputs.honorarioAtual === 0)) {
      setInputs((prev) => ({
        ...prev,
        honorarioAtual: precoAtualCadastrado > 0 ? precoAtualCadastrado : initialHonorario,
      }))
    }
  }, [initialHonorario, precoAtualCadastrado, inputs.honorarioAtual])

  // Persistência
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REAJUSTE, JSON.stringify(inputs))
    } catch (e) {
      console.warn('Erro ao salvar reajuste anual:', e)
    }
  }, [inputs])

  // Cálculo reativo
  const result = useMemo(() => {
    return calculateAnnualReadjustment(inputs, sessoesEfetivas)
  }, [inputs, sessoesEfetivas])

  // Aplica preset com 1 clique
  const handleApplyPreset = (preset: InflationIndexPreset) => {
    setInputs((prev) => ({
      ...prev,
      tipoIndice: preset.indice,
      indicePct: preset.taxaPct,
      anoReferenciaPreset: preset.id,
    }))
  }

  // Copia mensagem para a área de transferência
  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(result.mensagemComunicado)
      setCopied(true)
      toast({
        title: 'Mensagem copiada!',
        description: 'Texto pronto para enviar pelo WhatsApp ou e-mail ao paciente.',
      })
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error('Falha ao copiar:', err)
      toast({
        variant: 'destructive',
        title: 'Não foi possível copiar',
        description: 'Selecione o texto e copie manualmente.',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-[#16746E] text-[#16746E] dark:border-emerald-400 dark:text-emerald-300 font-semibold"
            >
              Módulo 2 · Manutenção Contratual
            </Badge>
            <span className="text-xs text-slate-500">IPCA (IBGE) · IGP-M (FGV) · Acumulado</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Reajuste Anual por Índice de Inflação (IPCA / IGP-M)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-0.5">
            Atualize o valor dos atendimentos em contratos clínicos existentes para proteger seu
            poder de compra contra a inflação, com comunicação ética e transparente ao paciente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {precoAtualCadastrado > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setInputs((prev) => ({ ...prev, honorarioAtual: precoAtualCadastrado }))
              }
              className="text-xs border-slate-300 dark:border-slate-700"
            >
              Preço Atual ({formatBRL(precoAtualCadastrado)})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setInputs((prev) => ({ ...prev, honorarioAtual: initialHonorario || 180 }))
            }
            className="text-xs border-slate-300 dark:border-slate-700"
          >
            Piso FAC ({formatBRL(initialHonorario)})
          </Button>
        </div>
      </div>

      {/* Destaque Astral: Antes e Depois */}
      <div className="p-6 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Valor Anterior */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-[#71717A] block">
              Honorário Anterior / Atual
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-slate-400 dark:text-[#71717A] line-through">
              {formatBRL(result.honorarioAtual)}
            </div>
            <span className="text-xs text-slate-500 dark:text-[#71717A]">por atendimento</span>
          </div>

          {/* Seta e Variação */}
          <div className="flex flex-col items-center justify-center p-3 rounded-[12px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] text-center font-mono">
            <div className="inline-flex items-center gap-1 text-[#ea580c] dark:text-[#FB923C] font-bold text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>+{formatNumberBR(result.deltaPercentualTotal, 2)}%</span>
            </div>
            <span className="text-[11px] text-slate-600 dark:text-[#A1A1AA] mt-0.5">
              +{formatBRL(result.deltaAbsolutoSessao)} por sessão
            </span>
            <span className="text-[10px] text-slate-500 dark:text-[#71717A] mt-1 font-medium">
              ({inputs.tipoIndice} {result.indiceEfetivoPct.toFixed(2)}% · {inputs.numeroPeriodos}{' '}
              ano(s))
            </span>
          </div>

          {/* Novo Valor Reajustado */}
          <div className="space-y-1 md:text-right">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
              Novo Honorário Reajustado
            </span>
            <div className="font-mono text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white">
              {formatBRL(result.novoHonorario)}
            </div>
            <span className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]">
              por atendimento
            </span>
          </div>
        </div>

        {/* Impacto Mensal e Anual no Faturamento da Clínica */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-[#27272A] text-xs font-mono">
          <div>
            <span className="text-slate-500 dark:text-[#71717A] text-[10px] uppercase font-bold block">
              Sessões Efetivas / Mês
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {result.sessoesEfetivasMes}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-[#71717A] text-[10px] uppercase font-bold block">
              Faturamento Atual
            </span>
            <span className="text-base font-medium text-slate-700 dark:text-[#A1A1AA]">
              {formatBRL(result.faturamentoMensalAntes)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-[#71717A] text-[10px] uppercase font-bold block">
              Novo Faturamento Mensal
            </span>
            <span className="text-base font-bold text-[#ea580c] dark:text-[#FB923C]">
              {formatBRL(result.faturamentoMensalDepois)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-[#71717A] text-[10px] uppercase font-bold block">
              Ganho Anual Protegido
            </span>
            <span className="text-base font-bold text-[#7c3aed] dark:text-[#C084FC]">
              +{formatBRL(result.deltaAnual)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabela de Referência de Índices Históricos Oficiais */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="py-3 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-[#16746E]" />
                Tabela de Referência Rápida: Índices Oficiais de Inflação
              </CardTitle>
              <CardDescription className="text-xs">
                Clique em qualquer índice oficial para preencher o cálculo instantaneamente.
              </CardDescription>
            </div>
            <span className="text-[11px] text-slate-500">Fontes: IBGE / SIDRA e FGV / IBRE</span>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {INFLATION_PRESETS.map((preset) => {
              const isSelected =
                inputs.tipoIndice === preset.indice && inputs.indicePct === preset.taxaPct

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#16746E] bg-emerald-50 dark:bg-emerald-950/60 shadow-xs ring-2 ring-[#16746E]/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span>{preset.indice}</span>
                    <span className="text-[#16746E] dark:text-emerald-400">{preset.ano}</span>
                  </div>
                  <div className="font-mono text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {preset.taxaPct > 0
                      ? `+${preset.taxaPct.toFixed(2)}%`
                      : `${preset.taxaPct.toFixed(2)}%`}
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                    {preset.fonte}
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configurações do Reajuste */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-2xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
            Parâmetros do Reajuste
          </CardTitle>
          <CardDescription className="text-xs">
            Personalize o índice, o número de períodos acumulados e os dados da comunicação.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Honorário Base */}
            <CurrencyInput
              id="honorario-atual"
              label="Honorário Atual por Sessão"
              value={inputs.honorarioAtual}
              onChange={(val) => setInputs((prev) => ({ ...prev, honorarioAtual: val }))}
              helperText="Valor acordado no contrato antes do reajuste."
            />

            {/* Índice Personalizado */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="indice-pct"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Índice de Reajuste (%)
                </Label>
                <span className="text-[#16746E] dark:text-emerald-400 font-mono font-bold text-xs">
                  {inputs.indicePct.toFixed(2)}%
                </span>
              </div>
              <Input
                id="indice-pct"
                type="number"
                step="0.01"
                min={-10}
                max={50}
                value={inputs.indicePct}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    indicePct: parseFloat(e.target.value) || 0,
                    tipoIndice: 'PERSONALIZADO',
                  }))
                }
                className="font-mono text-base h-11"
              />
              <p className="text-[11px] text-slate-500">
                Ou selecione na tabela acima para preenchimento automático.
              </p>
            </div>

            {/* Número de Períodos (Anos Acumulados) */}
            <div className="space-y-1.5">
              <Label
                htmlFor="periodos"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Períodos Acumulados
              </Label>
              <Input
                id="periodos"
                type="number"
                min={1}
                max={10}
                value={inputs.numeroPeriodos}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    numeroPeriodos: Math.max(1, parseInt(e.target.value, 10) || 1),
                  }))
                }
                className="font-mono text-base h-11"
              />
              <p className="text-[11px] text-slate-500">
                1 para reajuste anual regular, ou 2+ se o valor ficou sem reajuste em anos
                anteriores.
              </p>
            </div>

            {/* Mês do Reajuste */}
            <div className="space-y-1.5">
              <Label
                htmlFor="mes-reajuste"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Mês de Vigência
              </Label>
              <select
                id="mes-reajuste"
                value={inputs.mesReajuste}
                onChange={(e) => setInputs((prev) => ({ ...prev, mesReajuste: e.target.value }))}
                className="w-full h-11 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#16746E]"
              >
                {MESES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                Geralmente o mês de aniversário do início da psicoterapia.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gerador de Mensagem Pronta para o Paciente */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-2xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#16746E]" />
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Mensagem Ética Pronta para o Paciente
              </CardTitle>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleCopyMessage}
              className="gap-1.5 bg-[#16746E] hover:bg-[#125e59] text-white text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copiar Mensagem
                </>
              )}
            </Button>
          </div>
          <CardDescription className="text-xs">
            Texto acolhedor, profissional e fundamentado no contrato terapêutico e no Código de
            Ética.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label
                htmlFor="nome-paciente"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Nome do Paciente (opcional)
              </Label>
              <Input
                id="nome-paciente"
                placeholder="Ex: Mariana"
                value={inputs.nomePaciente}
                onChange={(e) => setInputs((prev) => ({ ...prev, nomePaciente: e.target.value }))}
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="nome-profissional"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Seu Nome / Assinatura
              </Label>
              <Input
                id="nome-profissional"
                placeholder="Ex: Dra. Ana Paula (Psicóloga CRP 06/12345)"
                value={inputs.nomeProfissional}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, nomeProfissional: e.target.value }))
                }
                className="h-10 text-sm"
              />
            </div>
          </div>

          <div className="relative">
            <Textarea
              readOnly
              rows={9}
              value={result.mensagemComunicado}
              className="font-sans text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 leading-relaxed resize-none text-slate-800 dark:text-slate-200 p-4"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
