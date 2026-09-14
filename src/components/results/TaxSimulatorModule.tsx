import React, { useState, useEffect, useMemo } from 'react'
import {
  Building2,
  User,
  ArrowRight,
  TrendingDown,
  Info,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HelpCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { CurrencyInput } from '@/components/CurrencyInput'
import { formatBRL, formatNumberBR } from '@/lib/currency'
import {
  simulateTaxTransition,
  TaxSimulatorInputs,
  SALARIO_MINIMO_2025,
  TETO_INSS_2025,
} from '@/lib/taxSimulatorMath'

const STORAGE_KEY_TAXSIM = 'entrelacos_fac_taxsim_v1'

interface TaxSimulatorModuleProps {
  initialFaturamento?: number
  initialDespesasProfissionais?: number
  reservaPct?: number
}

export const TaxSimulatorModule: React.FC<TaxSimulatorModuleProps> = ({
  initialFaturamento = 9746.84,
  initialDespesasProfissionais = 1200,
  reservaPct = 10,
}) => {
  // Carrega ou inicializa entradas persistidas
  const [inputs, setInputs] = useState<TaxSimulatorInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TAXSIM)
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          faturamentoBrutoMensal:
            parsed.faturamentoBrutoMensal ?? (initialFaturamento > 0 ? initialFaturamento : 8000),
          despesasDedutiveisLivroCaixa:
            parsed.despesasDedutiveisLivroCaixa ?? (initialDespesasProfissionais || 1000),
          numeroDependentes: parsed.numeroDependentes ?? 0,
          salarioContribuicaoPf: parsed.salarioContribuicaoPf ?? SALARIO_MINIMO_2025,
          proLaborePct: parsed.proLaborePct ?? 28,
          incluirReservaFac: parsed.incluirReservaFac ?? true,
          reservaPct: parsed.reservaPct ?? reservaPct,
        }
      }
    } catch (e) {
      console.warn('Erro ao restaurar simulador tributário:', e)
    }
    return {
      faturamentoBrutoMensal: initialFaturamento > 0 ? initialFaturamento : 8000,
      despesasDedutiveisLivroCaixa: initialDespesasProfissionais || 1000,
      numeroDependentes: 0,
      salarioContribuicaoPf: SALARIO_MINIMO_2025,
      proLaborePct: 28,
      incluirReservaFac: true,
      reservaPct: reservaPct || 10,
    }
  })

  // Sincroniza faturamento/despesas se mudarem no cálculo principal e não houver customização salva
  useEffect(() => {
    if (initialFaturamento > 0) {
      setInputs((prev) => ({
        ...prev,
        faturamentoBrutoMensal: prev.faturamentoBrutoMensal || initialFaturamento,
        despesasDedutiveisLivroCaixa:
          prev.despesasDedutiveisLivroCaixa !== undefined
            ? prev.despesasDedutiveisLivroCaixa
            : initialDespesasProfissionais,
        reservaPct: reservaPct || 10,
      }))
    }
  }, [initialFaturamento, initialDespesasProfissionais, reservaPct])

  // Persistência
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TAXSIM, JSON.stringify(inputs))
    } catch (e) {
      console.warn('Erro ao salvar simulador tributário:', e)
    }
  }, [inputs])

  // Cálculo reativo
  const result = useMemo(() => {
    return simulateTaxTransition(inputs)
  }, [inputs])

  const handleResetToFacDefaults = () => {
    setInputs({
      faturamentoBrutoMensal: initialFaturamento > 0 ? initialFaturamento : 8000,
      despesasDedutiveisLivroCaixa: initialDespesasProfissionais || 1000,
      numeroDependentes: 0,
      salarioContribuicaoPf: SALARIO_MINIMO_2025,
      proLaborePct: 28,
      incluirReservaFac: true,
      reservaPct: reservaPct || 10,
    })
  }

  const { pf, pj, comparativo } = result
  const isPjWinner = comparativo.regimeVencedor === 'PJ'
  const isPfWinner = comparativo.regimeVencedor === 'PF'

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-[#5B3A8E] text-[#5B3A8E] dark:border-purple-400 dark:text-purple-300 font-semibold"
            >
              Módulo 1 · Planejamento Fiscal
            </Badge>
            <span className="text-xs text-slate-500">IRPF 2025 · Simples Nacional 2025/2026</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Simulador de Transição Tributária: PF (Carnê-Leão) vs. PJ (Simples Nacional)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-0.5">
            Compare o impacto real da tributação entre atuar como autônoma física com Livro-Caixa e
            abrir uma PJ clínica no Simples Nacional com benefício do Fator R.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetToFacDefaults}
          className="gap-1.5 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 self-start sm:self-auto shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Puxar Valores do Método FAC
        </Button>
      </div>

      {/* Veredito Estratégico em Destaque */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isPjWinner
            ? 'bg-linear-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-300 dark:border-emerald-800'
            : isPfWinner
              ? 'bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-300 dark:border-amber-800'
              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full animate-pulse ${
                  isPjWinner ? 'bg-emerald-500' : isPfWinner ? 'bg-amber-500' : 'bg-slate-400'
                }`}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Diagnóstico Tributário Recomendado
              </span>
              <Badge
                className={
                  isPjWinner
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold'
                    : isPfWinner
                      ? 'bg-amber-600 hover:bg-amber-700 text-white font-bold'
                      : 'bg-slate-600 text-white'
                }
              >
                {isPjWinner
                  ? `PJ mais vantajosa (${pj.enquadramentoAnexo})`
                  : isPfWinner
                    ? 'PF Carnê-Leão mais vantajosa'
                    : 'Cargas Equivalentes'}
              </Badge>
            </div>
            <p className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {comparativo.mensagemVeredito}
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-white dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Economia Mensal
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatBRL(comparativo.economiaMensal)}
              </span>
            </div>
            <div className="border-l border-slate-200 dark:border-slate-800 pl-6">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Economia Anual
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#5B3A8E] dark:text-purple-300">
                {formatBRL(comparativo.economiaAnual)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Controles / Parâmetros */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-2xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#5B3A8E] dark:text-purple-400" />
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              Parâmetros da sua Clínica
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Ajuste os valores para simular diferentes patamares de faturamento, despesas
            operacionais e folha de pró-labore.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Faturamento Bruto Mensal */}
            <div className="space-y-1.5">
              <CurrencyInput
                id="faturamento-mensal"
                label="Faturamento Bruto Mensal (Alvo)"
                value={inputs.faturamentoBrutoMensal}
                onChange={(val) => setInputs((prev) => ({ ...prev, faturamentoBrutoMensal: val }))}
                helperText="Pré-preenchido com o Faturamento Bruto do Método FAC."
              />
              <div className="pt-1">
                <Slider
                  value={[Math.min(30000, Math.max(1000, inputs.faturamentoBrutoMensal))]}
                  min={1000}
                  max={30000}
                  step={200}
                  onValueChange={(vals) =>
                    setInputs((prev) => ({ ...prev, faturamentoBrutoMensal: vals[0] }))
                  }
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>R$ 1.000</span>
                  <span>R$ 15.000</span>
                  <span>R$ 30.000</span>
                </div>
              </div>
            </div>

            {/* 2. Despesas Dedutíveis (Livro-Caixa PF) */}
            <CurrencyInput
              id="despesas-livro-caixa"
              label="Despesas Dedutíveis no Livro-Caixa (PF)"
              value={inputs.despesasDedutiveisLivroCaixa}
              onChange={(val) =>
                setInputs((prev) => ({ ...prev, despesasDedutiveisLivroCaixa: val }))
              }
              helperText="Aluguel de sala, internet, supervisão, CRP, softwares, contador."
            />

            {/* 3. Número de Dependentes */}
            <div className="space-y-1.5">
              <Label
                htmlFor="dependentes"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Número de Dependentes
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="dependentes"
                  type="number"
                  min={0}
                  max={10}
                  value={inputs.numeroDependentes}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      numeroDependentes: Math.max(0, parseInt(e.target.value, 10) || 0),
                    }))
                  }
                  className="font-mono text-base h-11"
                />
                <div className="text-[11px] text-slate-500 leading-tight">
                  Dedução legal de{' '}
                  <strong className="text-slate-700 dark:text-slate-300">R$ 189,59/mês</strong> por
                  dependente no IRPF.
                </div>
              </div>
            </div>

            {/* 4. Base de Contribuição INSS (PF) */}
            <div className="space-y-1.5">
              <CurrencyInput
                id="salario-inss-pf"
                label="Salário de Contribuição INSS (PF)"
                value={inputs.salarioContribuicaoPf}
                onChange={(val) => setInputs((prev) => ({ ...prev, salarioContribuicaoPf: val }))}
                helperText={`Alíquota de 20% (mín R$ ${SALARIO_MINIMO_2025.toLocaleString('pt-BR')} até teto R$ ${TETO_INSS_2025.toLocaleString('pt-BR')}).`}
              />
            </div>

            {/* 5. Percentual de Pró-Labore no Simples (Fator R) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="pro-labore-pct"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1"
                >
                  Pró-Labore no Simples (% Faturamento)
                  <span className="text-[#5B3A8E] dark:text-purple-400 font-mono font-bold">
                    {inputs.proLaborePct}%
                  </span>
                </Label>
                <Badge
                  variant="secondary"
                  className={`text-[10px] ${
                    pj.fatorR >= 0.28
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  Fator R: {(pj.fatorR * 100).toFixed(1)}% ({pj.enquadramentoAnexo})
                </Badge>
              </div>
              <Slider
                value={[inputs.proLaborePct]}
                min={10}
                max={50}
                step={1}
                onValueChange={(vals) => setInputs((prev) => ({ ...prev, proLaborePct: vals[0] }))}
                className="py-2"
              />
              <p className="text-[11px] text-slate-500">
                Pelo menos 28% garante o <strong>Anexo III (~6%)</strong>. Abaixo de 28% cai no{' '}
                <strong>Anexo V (~15,5%)</strong>.
              </p>
            </div>

            {/* 6. Opção de Reserva Técnica FAC */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5">
                <Label
                  htmlFor="toggle-reserva"
                  className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  Incluir Reserva Técnica FAC ({inputs.reservaPct}%)
                </Label>
                <p className="text-[11px] text-slate-500">
                  Subtrai a reserva do caixa líquido PJ para segurança clínica.
                </p>
              </div>
              <Switch
                id="toggle-reserva"
                checked={inputs.incluirReservaFac}
                onCheckedChange={(checked) =>
                  setInputs((prev) => ({ ...prev, incluirReservaFac: checked }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparativo Lado a Lado (Cards PF vs PJ) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD PESSOA FÍSICA (Carnê-Leão) */}
        <div
          className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-2xs flex flex-col justify-between transition-all ${
            isPfWinner
              ? 'border-2 border-amber-500 ring-2 ring-amber-500/20'
              : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                    Pessoa Física (Carnê-Leão)
                  </h4>
                  <p className="text-xs text-slate-500">Autônoma com Livro-Caixa e IRPF Mensal</p>
                </div>
              </div>
              {isPfWinner && (
                <Badge className="bg-amber-600 text-white font-bold gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> Mais Econômico
                </Badge>
              )}
            </div>

            {/* Destaque Tributos PF */}
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Total de Tributos Mensais:
                </span>
                <span className="font-mono text-2xl font-bold text-amber-700 dark:text-amber-400">
                  {formatBRL(pf.totalTributosMensal)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
                <span>Alíquota Efetiva Real:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {formatNumberBR(pf.aliquotaEfetivaPct, 2)}% do faturamento
                </span>
              </div>
            </div>

            {/* Linhas de decomposição PF */}
            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex justify-between pt-1">
                <span className="text-slate-600 dark:text-slate-400">
                  Faturamento Bruto Mensal:
                </span>
                <span className="font-mono font-medium">{formatBRL(pf.faturamento)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-600 dark:text-slate-400">
                  (-) Despesas Dedutíveis (Livro-Caixa):
                </span>
                <span className="font-mono text-rose-600 font-medium">
                  -{formatBRL(pf.despesasLivroCaixa)}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-600 dark:text-slate-400">
                  (-) INSS Autônomo (20% contribuição):
                </span>
                <span className="font-mono text-rose-600 font-medium">-{formatBRL(pf.inssPf)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-600 dark:text-slate-400">
                  Base de Cálculo IRPF Mensal:
                </span>
                <span className="font-mono font-semibold">
                  {formatBRL(pf.baseCalculoIrpf)}
                  {pf.usouSimplificado && (
                    <span className="text-[10px] text-amber-600 ml-1">(desconto simplificado)</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-600 dark:text-slate-400">
                  (-) IRPF Carnê-Leão (Tabela Progressiva 2025):
                </span>
                <span className="font-mono text-rose-600 font-medium">
                  -{formatBRL(pf.irpfMensal)}
                </span>
              </div>
              <div className="flex justify-between pt-2.5 font-bold text-sm text-slate-900 dark:text-white">
                <span>Renda Líquida Mensal:</span>
                <span className="font-mono text-slate-900 dark:text-white">
                  {formatBRL(pf.liquidoMensal)}
                </span>
              </div>
              <div className="flex justify-between pt-2 text-[11px] text-slate-500">
                <span>Total de Tributos em 12 meses:</span>
                <span className="font-mono font-semibold">{formatBRL(pf.totalTributosAnual)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed">
            * Vantajoso principalmente para quem fatura até ~R$ 5.000 ou possui despesas elevadas no
            Livro-Caixa para abater a base de IRPF.
          </div>
        </div>

        {/* CARD PESSOA JURÍDICA (Simples Nacional) */}
        <div
          className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-2xs flex flex-col justify-between transition-all ${
            isPjWinner
              ? 'border-2 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                    Pessoa Jurídica (Simples Nacional)
                  </h4>
                  <p className="text-xs text-slate-500">
                    SLU/LTDA · {pj.enquadramentoAnexo} (Fator R: {(pj.fatorR * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>
              {isPjWinner && (
                <Badge className="bg-emerald-600 text-white font-bold gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> Mais Econômico
                </Badge>
              )}
            </div>

            {/* Destaque Tributos PJ */}
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Total de Tributos Mensais:
                </span>
                <span className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  {formatBRL(pj.totalTributosMensal)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
                <span>Alíquota Efetiva Global:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {formatNumberBR(pj.aliquotaEfetivaTotalPct, 2)}% (DAS:{' '}
                  {formatNumberBR(pj.aliquotaEfetivaDasPct, 2)}%)
                </span>
              </div>
            </div>

            {/* Linhas de decomposição PJ */}
            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex justify-between pt-1">
                <span className="text-slate-600 dark:text-slate-400">
                  Faturamento Bruto Mensal:
                </span>
                <span className="font-mono font-medium">{formatBRL(pj.faturamento)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-600 dark:text-slate-400">
                  DAS Simples ({pj.enquadramentoAnexo} - Faixa {pj.faixaSimples}):
                </span>
                <span className="font-mono text-rose-600 font-medium">
                  -{formatBRL(pj.dasMensal)}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-600 dark:text-slate-400">
                  Pró-Labore ({inputs.proLaborePct}% faturamento):
                </span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {formatBRL(pj.proLaboreMensal)}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-600 dark:text-slate-400">
                  (-) INSS Pró-Labore (11% retido):
                </span>
                <span className="font-mono text-rose-600 font-medium">
                  -{formatBRL(pj.inssProLabore)}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-600 dark:text-slate-400">
                  (-) IRPF Pró-Labore (se houver):
                </span>
                <span className="font-mono text-rose-600 font-medium">
                  -{formatBRL(pj.irpfProLabore)}
                </span>
              </div>
              {inputs.incluirReservaFac && pj.reservaFacMensal > 0 && (
                <div className="flex justify-between pt-2">
                  <span className="text-slate-600 dark:text-slate-400">
                    (-) Reserva Técnica FAC ({inputs.reservaPct}%):
                  </span>
                  <span className="font-mono text-purple-600 font-medium">
                    -{formatBRL(pj.reservaFacMensal)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2.5 font-bold text-sm text-slate-900 dark:text-white">
                <span>Renda Líquida Mensal Disponível:</span>
                <span className="font-mono text-slate-900 dark:text-white">
                  {formatBRL(pj.liquidoMensal)}
                </span>
              </div>
              <div className="flex justify-between pt-2 text-[11px] text-slate-500">
                <span>Total de Tributos em 12 meses:</span>
                <span className="font-mono font-semibold">{formatBRL(pj.totalTributosAnual)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed">
            * No Simples Nacional, os lucros distribuídos após apuração contábil são 100% isentos de
            IRPF. A CPP Patronal do INSS (20%) já vem embutida na guia DAS no Anexo III e V.
          </div>
        </div>
      </div>

      {/* Tabela de Referência das Faixas de Alíquotas Simples Nacional */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="py-3 px-4 sm:px-6">
          <CardTitle className="text-xs uppercase font-bold tracking-wider text-slate-500 flex items-center justify-between">
            <span>Tabela Oficial de Referência do Simples Nacional (LC 123/2006)</span>
            <span className="text-[11px] normal-case text-slate-400">
              Receita Anual Projetada: {formatBRL(result.rbt12)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-2 pr-2">Faixa</th>
                  <th className="py-2 px-2">Receita Bruta 12 Meses (RBT12)</th>
                  <th className="py-2 px-2 text-emerald-700 dark:text-emerald-400">
                    Anexo III (Fator R ≥ 28%)
                  </th>
                  <th className="py-2 px-2 text-amber-700 dark:text-amber-400">
                    Anexo V (Fator R &lt; 28%)
                  </th>
                  <th className="py-2 pl-2">Parcela a Deduzir (Anexo III)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className={pj.faixaSimples === 1 ? 'bg-[#EDE8F5]/50 font-bold' : ''}>
                  <td className="py-2 pr-2">1ª Faixa</td>
                  <td className="py-2 px-2">Até R$ 180.000,00</td>
                  <td className="py-2 px-2 text-emerald-700 dark:text-emerald-400">6,00%</td>
                  <td className="py-2 px-2 text-amber-700 dark:text-amber-400">15,50%</td>
                  <td className="py-2 pl-2">R$ 0,00</td>
                </tr>
                <tr className={pj.faixaSimples === 2 ? 'bg-[#EDE8F5]/50 font-bold' : ''}>
                  <td className="py-2 pr-2">2ª Faixa</td>
                  <td className="py-2 px-2">R$ 180.000,01 a R$ 360.000,00</td>
                  <td className="py-2 px-2 text-emerald-700 dark:text-emerald-400">11,20%</td>
                  <td className="py-2 px-2 text-amber-700 dark:text-amber-400">18,00%</td>
                  <td className="py-2 pl-2">R$ 9.360,00</td>
                </tr>
                <tr className={pj.faixaSimples === 3 ? 'bg-[#EDE8F5]/50 font-bold' : ''}>
                  <td className="py-2 pr-2">3ª Faixa</td>
                  <td className="py-2 px-2">R$ 360.000,01 a R$ 720.000,00</td>
                  <td className="py-2 px-2 text-emerald-700 dark:text-emerald-400">13,50%</td>
                  <td className="py-2 px-2 text-amber-700 dark:text-amber-400">19,50%</td>
                  <td className="py-2 pl-2">R$ 17.640,00</td>
                </tr>
                <tr className={pj.faixaSimples === 4 ? 'bg-[#EDE8F5]/50 font-bold' : ''}>
                  <td className="py-2 pr-2">4ª Faixa</td>
                  <td className="py-2 px-2">R$ 720.000,01 a R$ 1.800.000,00</td>
                  <td className="py-2 px-2 text-emerald-700 dark:text-emerald-400">16,00%</td>
                  <td className="py-2 px-2 text-amber-700 dark:text-amber-400">20,50%</td>
                  <td className="py-2 pl-2">R$ 35.640,00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Nota Pedagógica / Disclaimer Legal */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
          <Info className="w-4 h-4 text-[#5B3A8E] dark:text-purple-400 shrink-0" />
          <span>Aviso Pedagógico e Metodológico Entrelaços Psicologia</span>
        </div>
        <p>
          Cálculos estimativos e pedagógicos baseados na legislação vigente (IRPF 2025 progressivo
          com deduções oficiais e Simples Nacional Lei Complementar 123/2006). Custos como taxa de
          abertura de CNPJ, taxas de alvará municipal, anuidade de pessoa jurídica do CRP e
          honorários contábeis devem ser ponderados na decisão. Não substituem orientação contábil
          individualizada.
        </p>
      </div>
    </div>
  )
}
