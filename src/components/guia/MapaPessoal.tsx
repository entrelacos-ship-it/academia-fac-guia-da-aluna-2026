import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Copy,
  Download,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Check,
  Compass,
  ArrowRight,
} from 'lucide-react'
import { calcularDiagnosticoV2 } from '@/lib/diagnosticoFacEngine'

const STORAGE_KEY_MAPA_PESSOAL = 'entrelacos_fac_mapa_pessoal_e1'
const STORAGE_KEY_DIAGNOSTICO_V2 = 'entrelacos_fac_diagnostico_v2_data'

export interface MapaPessoalState {
  nome: string
  data: string
  percentuais: string
  pilarPrimeiro: 'Fundação' | 'Atração' | 'Conexão' | ''
  oQueAconteceHoje: string
  assunto1: string
  assunto2: string
  assunto3: string
  resultadoObservavel: string
  obstaculoProvavel: string
  acaoMinimaRetomada: string
  horasReservadas: string
  diaHorarioProtegido: string
  primeiraAcao: string
  primeiraAcaoDataHora: string
}

const DEFAULT_MAPA: MapaPessoalState = {
  nome: '',
  data: '',
  percentuais: '',
  pilarPrimeiro: '',
  oQueAconteceHoje: '',
  assunto1: '',
  assunto2: '',
  assunto3: '',
  resultadoObservavel: '',
  obstaculoProvavel: '',
  acaoMinimaRetomada: '',
  horasReservadas: '',
  diaHorarioProtegido: '',
  primeiraAcao: '',
  primeiraAcaoDataHora: '',
}

interface MapaPessoalProps {
  onAbrirDiagnostico?: () => void
}

export const MapaPessoal: React.FC<MapaPessoalProps> = ({ onAbrirDiagnostico }) => {
  const [mapa, setMapa] = useState<MapaPessoalState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MAPA_PESSOAL)
      if (saved) {
        return { ...DEFAULT_MAPA, ...JSON.parse(saved) }
      }
    } catch {
      // ignore
    }
    return DEFAULT_MAPA
  })

  const [copiado, setCopiado] = useState(false)
  const [puxadoSucesso, setPuxadoSucesso] = useState(false)
  const [mensagemPuxar, setMensagemPuxar] = useState<string | null>(null)

  // Persistir alterações no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MAPA_PESSOAL, JSON.stringify(mapa))
    } catch {
      // ignore
    }
  }, [mapa])

  // Puxar percentuais do diagnóstico concluído neste navegador
  const handlePuxarResultadoDiagnostico = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DIAGNOSTICO_V2)
      if (!raw) {
        setMensagemPuxar('Nenhum diagnóstico encontrado neste navegador ainda. Responda ao lado!')
        setTimeout(() => setMensagemPuxar(null), 4000)
        return
      }
      const parsed = JSON.parse(raw)
      const res = calcularDiagnosticoV2(
        parsed.respostas || {},
        parsed.contexto,
        parsed.respostasAbertas,
        parsed.cuidadoClinico,
      )

      if (!res) {
        setMensagemPuxar(
          'O diagnóstico ainda não está 100% concluído (24 questões + bloco de cuidado).',
        )
        setTimeout(() => setMensagemPuxar(null), 4000)
        return
      }

      const pF = res.pilares.fundacao.percentual
      const pA = res.pilares.atracao.percentual
      const pC = res.pilares.conexao.percentual
      const textoPercentuais = `Fundação ${pF}% · Atração ${pA}% · Conexão ${pC}%`

      // Pilar de partida sugerido pelo motor do diagnóstico
      const pilarSugerido =
        res.porOndeComecar.pilarInicial === 'fundacao'
          ? 'Fundação'
          : res.porOndeComecar.pilarInicial === 'atracao'
            ? 'Atração'
            : 'Conexão'

      setMapa((prev) => ({
        ...prev,
        percentuais: textoPercentuais,
        pilarPrimeiro: prev.pilarPrimeiro || pilarSugerido,
      }))
      setPuxadoSucesso(true)
      setMensagemPuxar(
        `Resultado importado: ${textoPercentuais} (Pilar sugerido: ${pilarSugerido})`,
      )
      setTimeout(() => {
        setPuxadoSucesso(false)
        setMensagemPuxar(null)
      }, 5000)
    } catch (err) {
      console.warn('Erro ao puxar resultado do diagnóstico:', err)
      setMensagemPuxar('Não foi possível ler o resultado do diagnóstico local.')
      setTimeout(() => setMensagemPuxar(null), 4000)
    }
  }

  const gerarTextoCompleto = (): string => {
    return [
      '==================================================',
      'MEU PRIMEIRO PASSO NO CICLO FAC — MAPA PESSOAL',
      'Academia Método FAC · Aula Magna (Encontro 1)',
      '==================================================',
      '',
      `Aluna: ${mapa.nome || '[Não informado]'}`,
      `Data: ${mapa.data || '[Não informada]'}`,
      `Percentuais do Diagnóstico: ${mapa.percentuais || '[Não informados]'}`,
      '',
      '--------------------------------------------------',
      '01 / POR ONDE COMEÇO?',
      '--------------------------------------------------',
      `Pilar que vou observar primeiro: ${mapa.pilarPrimeiro || '[Não preenchido]'}`,
      `O que acontece hoje que mostra isso:\n${mapa.oQueAconteceHoje || '[Não preenchido]'}`,
      '',
      '--------------------------------------------------',
      '02 / ONDE QUERO PRESTAR ATENÇÃO ESPECIAL?',
      '--------------------------------------------------',
      `1. Assunto — por quê:\n${mapa.assunto1 || '[Não preenchido]'}`,
      `2. Assunto — por quê:\n${mapa.assunto2 || '[Não preenchido]'}`,
      `3. Assunto — por quê:\n${mapa.assunto3 || '[Não preenchido]'}`,
      '',
      '--------------------------------------------------',
      '03 / O QUE QUERO CONSTRUIR EM 19 SEMANAS?',
      '--------------------------------------------------',
      `Resultado observável:\n${mapa.resultadoObservavel || '[Não preenchido]'}`,
      '',
      '--------------------------------------------------',
      '04 / COMO VOLTO SE A SEMANA ESCAPAR?',
      '--------------------------------------------------',
      `Obstáculo provável: ${mapa.obstaculoProvavel || '[Não preenchido]'}`,
      `Minha ação mínima de retomada: ${mapa.acaoMinimaRetomada || '[Não preenchido]'}`,
      '',
      '--------------------------------------------------',
      '05 / QUAL É MEU ESPAÇO REAL NA SEMANA?',
      '--------------------------------------------------',
      `Horas que consigo reservar: ${mapa.horasReservadas || '[Não preenchido]'}`,
      `Dia e horário que vou proteger: ${mapa.diaHorarioProtegido || '[Não preenchido]'}`,
      '',
      '--------------------------------------------------',
      'MINHA PRIMEIRA AÇÃO NESTA SEMANA',
      '--------------------------------------------------',
      `O que vou fazer: ${mapa.primeiraAcao || '[Não preenchido]'}`,
      `Dia e horário: ${mapa.primeiraAcaoDataHora || '[Não preenchido]'}`,
      '',
      '==================================================',
      'Nota: Respostas salvas localmente neste navegador.',
      'Não inclua dados que identifiquem pacientes.',
      '==================================================',
    ].join('\n')
  }

  const handleCopiarMapa = async () => {
    try {
      const texto = gerarTextoCompleto()
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 3000)
    } catch (err) {
      console.warn('Falha ao copiar mapa:', err)
    }
  }

  const handleBaixarTxt = () => {
    const texto = gerarTextoCompleto()
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `meu-mapa-pessoal-ciclo-fac-${mapa.data ? mapa.data.replace(/\//g, '-') : 'encontro-01'}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleLimparRascunho = () => {
    if (
      window.confirm(
        'Deseja limpar as respostas deste Mapa Pessoal? Suas anotações locais serão apagadas.',
      )
    ) {
      setMapa(DEFAULT_MAPA)
      try {
        localStorage.removeItem(STORAGE_KEY_MAPA_PESSOAL)
      } catch {
        // ignore
      }
    }
  }

  return (
    <div className="rounded-[16px] border border-slate-200/90 dark:border-[#27272A] bg-white dark:bg-[#121216] p-6 sm:p-8 space-y-8">
      {/* Cabeçalho */}
      <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
          DEPOIS DO DIAGNÓSTICO / EXERCÍCIO OPCIONAL
        </span>
        <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-slate-900 dark:text-white mt-1">
          Meu primeiro passo no Ciclo FAC.
        </h3>
        <p className="text-sm text-slate-600 dark:text-[#A1A1AA] mt-1.5 leading-relaxed font-light">
          O diagnóstico mostra uma hipótese sobre a estrutura da sua prática. Este mapa ajuda você a
          transformar o resultado em uma escolha concreta para a semana. Traga os percentuais do
          diagnóstico, confira o pilar sugerido e escreva as demais respostas com suas palavras. Não
          é um segundo diagnóstico nem precisa ser entregue.
        </p>
      </div>

      {/* Bloco: Comece pelo seu resultado */}
      <div className="p-5 rounded-[12px] bg-purple-50/70 dark:bg-purple-950/25 border border-purple-200/80 dark:border-[#7c3aed]/40 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
          <h4 className="font-sans font-semibold text-sm text-slate-900 dark:text-white">
            Comece pelo seu resultado
          </h4>
        </div>
        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-light">
          Se você concluiu o diagnóstico neste navegador, podemos trazer apenas os percentuais e o
          pilar de partida sugerido. Você decide se essa leitura faz sentido.
        </p>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <Button
            type="button"
            size="sm"
            onClick={handlePuxarResultadoDiagnostico}
            className="min-h-[38px] px-3 font-mono text-xs bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 mr-1" />
            <span>Puxar percentuais do meu diagnóstico</span>
          </Button>

          {onAbrirDiagnostico && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAbrirDiagnostico}
              className="min-h-[38px] px-3 font-mono text-xs border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] rounded-[8px] cursor-pointer"
            >
              <span>Fazer o diagnóstico</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>

        {mensagemPuxar && (
          <p
            className={`text-xs font-mono pt-1 ${puxadoSucesso ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-amber-700 dark:text-amber-400'}`}
          >
            {mensagemPuxar}
          </p>
        )}
      </div>

      {/* Dados de Identificação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block">
            Seu nome
          </label>
          <input
            type="text"
            value={mapa.nome}
            onChange={(e) => setMapa((prev) => ({ ...prev, nome: e.target.value }))}
            placeholder="Seu nome ou como prefere ser chamada"
            className="w-full p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] text-xs sm:text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block">
            Data
          </label>
          <input
            type="text"
            value={mapa.data}
            onChange={(e) => setMapa((prev) => ({ ...prev, data: e.target.value }))}
            placeholder="Ex.: 06/10/2026"
            className="w-full p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block">
              Percentuais do Diagnóstico FAC
            </label>
            <span className="text-[11px] font-mono text-slate-500 dark:text-[#71717A]">
              Use o botão acima ou copie os números do seu PDF. Você pode editar este campo.
            </span>
          </div>
          <input
            type="text"
            value={mapa.percentuais}
            onChange={(e) => setMapa((prev) => ({ ...prev, percentuais: e.target.value }))}
            placeholder="Fundação __% · Atração __% · Conexão __%"
            className="w-full p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
          />
        </div>
      </div>

      <div className="border-t border-slate-200/80 dark:border-[#27272A] pt-6 space-y-8">
        {/* Passo 01 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#7c3aed] dark:text-[#C084FC]">
              01
            </span>
            <h4 className="font-serif-editorial text-lg sm:text-xl font-normal text-slate-900 dark:text-white">
              Por onde começo?
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed font-light">
            O diagnóstico sugere um pilar de partida. Confira se ele combina com uma situação
            concreta da sua prática; você pode escolher outro com seu próprio critério.
          </p>

          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block">
                Pilar que vou observar primeiro:
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Fundação', 'Atração', 'Conexão'] as const).map((p) => {
                  const isSel = mapa.pilarPrimeiro === p
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setMapa((prev) => ({ ...prev, pilarPrimeiro: p }))}
                      className={`min-h-[38px] px-4 py-1.5 rounded-[8px] text-xs font-mono transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#7c3aed] dark:bg-[#C084FC] text-white dark:text-[#0A0A14] font-semibold shadow-xs'
                          : 'bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-slate-300 hover:border-[#7c3aed]/50'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block">
                  O que acontece hoje que mostra isso?
                </label>
                <span className="text-[11px] font-mono text-slate-500 dark:text-[#71717A]">
                  Prefira uma situação observável a "preciso melhorar tudo".
                </span>
              </div>
              <textarea
                rows={3}
                value={mapa.oQueAconteceHoje}
                onChange={(e) => setMapa((prev) => ({ ...prev, oQueAconteceHoje: e.target.value }))}
                placeholder="Ex.: Tenho dificuldade de explicar meu trabalho em uma frase."
                className="w-full p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Passo 02 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#7c3aed] dark:text-[#C084FC]">
              02
            </span>
            <h4 className="font-serif-editorial text-lg sm:text-xl font-normal text-slate-900 dark:text-white">
              Onde quero prestar atenção especial?
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed font-light">
            Liste três assuntos urgentes e por que importam. Você poderá acrescentar números dos
            encontros quando os temas forem liberados.
          </p>

          <div className="space-y-2.5 pt-1">
            {[
              { id: 'assunto1', label: '1. Assunto — por quê?', val: mapa.assunto1 },
              { id: 'assunto2', label: '2. Assunto — por quê?', val: mapa.assunto2 },
              { id: 'assunto3', label: '3. Assunto — por quê?', val: mapa.assunto3 },
            ].map((item, idx) => (
              <div key={item.id} className="space-y-1">
                <label className="text-xs font-mono text-slate-700 dark:text-slate-300 block">
                  {item.label}
                </label>
                <input
                  type="text"
                  value={item.val}
                  onChange={(e) =>
                    setMapa((prev) => ({
                      ...prev,
                      [`assunto${idx + 1}`]: e.target.value,
                    }))
                  }
                  placeholder={`Ex.: ${idx === 0 ? 'Definição do valor mínimo — para parar de negociar no susto' : idx === 1 ? 'Mensagem e bio do perfil — para que saibam quem atendo' : 'Processo de primeiro contato — para não perder quem chega'}`}
                  className="w-full p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Passo 03 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#7c3aed] dark:text-[#C084FC]">
              03
            </span>
            <h4 className="font-serif-editorial text-lg sm:text-xl font-normal text-slate-900 dark:text-white">
              O que quero construir em 19 semanas?
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed font-light">
            Escreva uma frase que você conseguirá verificar no fim do ciclo.
          </p>

          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block">
              Resultado observável
            </label>
            <input
              type="text"
              value={mapa.resultadoObservavel}
              onChange={(e) =>
                setMapa((prev) => ({ ...prev, resultadoObservavel: e.target.value }))
              }
              placeholder="Ex.: Terei meu valor mínimo calculado e uma descrição clara do meu trabalho."
              className="w-full p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] text-xs sm:text-sm text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Passo 04 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#7c3aed] dark:text-[#C084FC]">
              04
            </span>
            <h4 className="font-serif-editorial text-lg sm:text-xl font-normal text-slate-900 dark:text-white">
              Como volto se a semana escapar?
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed font-light">
            Preveja o imprevisto mais provável e defina uma ação curta para não transformar um
            atraso em desistência.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block">
                Obstáculo provável
              </label>
              <input
                type="text"
                value={mapa.obstaculoProvavel}
                onChange={(e) =>
                  setMapa((prev) => ({ ...prev, obstaculoProvavel: e.target.value }))
                }
                placeholder="Ex.: Perder a aula ao vivo."
                className="w-full p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block">
                Minha ação mínima de retomada
              </label>
              <input
                type="text"
                value={mapa.acaoMinimaRetomada}
                onChange={(e) =>
                  setMapa((prev) => ({ ...prev, acaoMinimaRetomada: e.target.value }))
                }
                placeholder="Ex.: Assistir ao capítulo da construção na quarta e preencher uma parte do mapa."
                className="w-full p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Passo 05 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#7c3aed] dark:text-[#C084FC]">
              05
            </span>
            <h4 className="font-serif-editorial text-lg sm:text-xl font-normal text-slate-900 dark:text-white">
              Qual é meu espaço real na semana?
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed font-light">
            Defina um bloco de tempo compatível com a sua rotina real, não com uma rotina
            idealizada.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block">
                Horas que consigo reservar
              </label>
              <input
                type="text"
                value={mapa.horasReservadas}
                onChange={(e) => setMapa((prev) => ({ ...prev, horasReservadas: e.target.value }))}
                placeholder="Ex.: 90 minutos por semana"
                className="w-full p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block">
                Dia e horário que vou proteger
              </label>
              <input
                type="text"
                value={mapa.diaHorarioProtegido}
                onChange={(e) =>
                  setMapa((prev) => ({ ...prev, diaHorarioProtegido: e.target.value }))
                }
                placeholder="Ex.: quarta, 20h"
                className="w-full p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Bloco final: Minha primeira ação nesta semana */}
        <div className="p-5 rounded-[12px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200/90 dark:border-[#27272A] space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[#ea580c] dark:text-[#FB923C] font-mono font-bold text-sm">
              →
            </span>
            <h4 className="font-serif-editorial text-lg sm:text-xl font-normal text-slate-900 dark:text-white">
              Minha primeira ação nesta semana
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block">
                O que vou fazer
              </label>
              <input
                type="text"
                value={mapa.primeiraAcao}
                onChange={(e) => setMapa((prev) => ({ ...prev, primeiraAcao: e.target.value }))}
                placeholder="Ex.: revisar a dimensão mais frágil do meu resultado"
                className="w-full p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block">
                Dia e horário
              </label>
              <input
                type="text"
                value={mapa.primeiraAcaoDataHora}
                onChange={(e) =>
                  setMapa((prev) => ({ ...prev, primeiraAcaoDataHora: e.target.value }))
                }
                placeholder="Ex.: quinta, 08/10, às 20h"
                className="w-full p-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopiarMapa}
            className={`min-h-[40px] px-3.5 gap-1.5 font-mono text-xs rounded-[8px] cursor-pointer ${
              copiado
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'border-purple-200 dark:border-[#7c3aed]/40 text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-50 dark:hover:bg-[#18181B]'
            }`}
          >
            {copiado ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Mapa copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar mapa</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBaixarTxt}
            className="min-h-[40px] px-3.5 gap-1.5 font-mono text-xs border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#18181B] rounded-[8px] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar .txt</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLimparRascunho}
            className="min-h-[40px] px-3 font-mono text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-[8px] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Limpar rascunho</span>
          </Button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-[#71717A]">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Suas respostas ficam neste navegador. Não inclua dados de pacientes.</span>
        </div>
      </div>
    </div>
  )
}
