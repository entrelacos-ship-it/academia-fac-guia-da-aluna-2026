import React from 'react'
import { SkigaiDataModel, FrasesDirecaoState, FraseDirecaoItem } from '@/types/skigai'
import { ArrowRight, ArrowLeft, Compass, ShieldCheck, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

interface Step7DirecaoProps {
  model: SkigaiDataModel
  onAtualizar: (novosDados: Partial<SkigaiDataModel>) => void
  onAvancar: () => void
  onVoltar: () => void
}

export const Step7Direcao: React.FC<Step7DirecaoProps> = ({
  model,
  onAtualizar,
  onAvancar,
  onVoltar,
}) => {
  const frases: FrasesDirecaoState = model.frases || {
    escolhida: 'autoral',
    direcao: [
      { versao: 'segura', texto: '' },
      { versao: 'autoral', texto: '' },
      { versao: 'ousada', texto: '' },
    ],
    sintese: '',
    ancora: '',
  }

  const atualizarVersao = (versao: 'segura' | 'autoral' | 'ousada', texto: string) => {
    const lista = frases.direcao.map((f) => (f.versao === versao ? { ...f, texto } : f))
    onAtualizar({ frases: { ...frases, direcao: lista } })
  }

  const escolherPrincipal = (versao: 'segura' | 'autoral' | 'ousada') => {
    onAtualizar({ frases: { ...frases, escolhida: versao } })
  }

  const getTextoVersao = (versao: 'segura' | 'autoral' | 'ousada'): string => {
    return frases.direcao.find((f) => f.versao === versao)?.texto || ''
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto text-left animate-fade-in">
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
          Fase 7 de 8 · A Direção
        </span>
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-foreground">
          Sua bússola interna de posicionamento
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A frase de hoje é a de hoje. Ela não é definitiva. Construa três versões da sua direção
          clínica e escolha a que melhor ecoa no seu momento atual.
        </p>
      </div>

      {/* Lembrete Ético do CFP */}
      <div className="p-4 rounded-[12px] bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 font-mono font-semibold text-foreground">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Lembrete ético e regulatório</span>
        </div>
        <p className="leading-relaxed">
          Esta frase é para a sua bússola interna. Antes de qualquer divulgação pública, lembre-se
          de conferir as orientações do CFP sobre publicidade profissional, assegurando comunicação
          sóbria e sem promessa de resultado.
        </p>
      </div>

      {/* Três Versões da Frase de Direção */}
      <div className="space-y-4">
        {/* Versão Segura */}
        <div
          className={`p-5 rounded-[16px] border bg-card space-y-3 transition-all ${
            frases.escolhida === 'segura'
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Versão Segura (ancorada no familiar)
            </span>
            <Button
              type="button"
              size="sm"
              variant={frases.escolhida === 'segura' ? 'default' : 'ghost'}
              onClick={() => escolherPrincipal('segura')}
              className="text-xs font-mono h-7 px-3"
            >
              {frases.escolhida === 'segura' ? 'Versão Principal' : 'Escolher esta'}
            </Button>
          </div>
          <Textarea
            rows={2}
            value={getTextoVersao('segura')}
            onChange={(e) => atualizarVersao('segura', e.target.value)}
            placeholder="Ex: Ofereço escuta clínica consistente para adultos em transições de carreira..."
            className="text-xs font-sans leading-relaxed resize-none"
          />
        </div>

        {/* Versão Autoral */}
        <div
          className={`p-5 rounded-[16px] border bg-card space-y-3 transition-all ${
            frases.escolhida === 'autoral'
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              Versão Autoral (seu olhar único)
            </span>
            <Button
              type="button"
              size="sm"
              variant={frases.escolhida === 'autoral' ? 'default' : 'ghost'}
              onClick={() => escolherPrincipal('autoral')}
              className="text-xs font-mono h-7 px-3"
            >
              {frases.escolhida === 'autoral' ? 'Versão Principal' : 'Escolher esta'}
            </Button>
          </div>
          <Textarea
            rows={2}
            value={getTextoVersao('autoral')}
            onChange={(e) => atualizarVersao('autoral', e.target.value)}
            placeholder="Ex: Acolho profissionais desgastados para reconstruir o sentimento de valor sem rupturas destrutivas..."
            className="text-xs font-sans leading-relaxed resize-none"
          />
        </div>

        {/* Versão Ousada */}
        <div
          className={`p-5 rounded-[16px] border bg-card space-y-3 transition-all ${
            frases.escolhida === 'ousada'
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Versão Ousada (vislumbre de futuro)
            </span>
            <Button
              type="button"
              size="sm"
              variant={frases.escolhida === 'ousada' ? 'default' : 'ghost'}
              onClick={() => escolherPrincipal('ousada')}
              className="text-xs font-mono h-7 px-3"
            >
              {frases.escolhida === 'ousada' ? 'Versão Principal' : 'Escolher esta'}
            </Button>
          </div>
          <Textarea
            rows={2}
            value={getTextoVersao('ousada')}
            onChange={(e) => atualizarVersao('ousada', e.target.value)}
            placeholder="Ex: Criar um espaço de sustentação ética onde a clínica seja viva, humana e economicamente viável..."
            className="text-xs font-sans leading-relaxed resize-none"
          />
        </div>
      </div>

      {/* Frase-Síntese da Semana (uma linha) */}
      <div className="p-6 rounded-[16px] border border-border bg-card space-y-3">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-foreground block">
          Frase-síntese da semana (uma linha que cabe no seu bolso):
        </label>
        <Input
          type="text"
          value={frases.sintese}
          onChange={(e) => onAtualizar({ frases: { ...frases, sintese: e.target.value } })}
          placeholder="Ex: Menos urgência, mais presença no que já sustenta."
          className="text-xs font-mono h-11"
        />
      </div>

      {/* Navegação */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onVoltar}
          className="text-xs font-mono gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao redesenho</span>
        </Button>

        <Button
          type="button"
          onClick={onAvancar}
          className="min-h-[44px] px-6 text-xs font-mono font-semibold rounded-[8px] bg-primary text-primary-foreground gap-1.5"
        >
          <span>Avançar para o Fechamento e Relatório</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
