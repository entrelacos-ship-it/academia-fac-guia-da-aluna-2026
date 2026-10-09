import React, { useState } from 'react'
import { SkigaiDataModel } from '@/types/skigai'
import { ShieldCheck, HeartHandshake, Upload, ArrowRight, Lock, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface StepAIntroProps {
  model: SkigaiDataModel
  onIniciar: () => void
  onImportar: (conteudo: string) => void
}

export const StepAIntro: React.FC<StepAIntroProps> = ({ model, onIniciar, onImportar }) => {
  const [c1, setC1] = useState(false)
  const [c2, setC2] = useState(false)
  const [c3, setC3] = useState(false)
  const [importInput, setImportInput] = useState('')
  const [mostrandoImportador, setMostrandoImportador] = useState(false)
  const [erroImport, setErroImport] = useState<string | null>(null)

  const todosMarcados = c1 && c2 && c3

  const handleSubmeterImport = () => {
    if (!importInput.trim()) return
    try {
      onImportar(importInput.trim())
    } catch (err: any) {
      setErroImport(err.message || 'Falha ao importar mapa.')
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto text-left animate-fade-in">
      {/* Cabeçalho */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SKIGAI · O MAPA DO SEU IKIGAI-KAN</span>
        </div>

        <h1 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-tight">
          O sentimento de que o seu trabalho vale a pena.
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Este é o mapa do seu ikigai-kan, a experiência viva de sentido e sustentação no seu
          cotidiano clínico. Leva de 90 a 120 minutos e você pode dividir em duas sessões com
          salvamento automático neste aparelho.
        </p>
      </div>

      {/* Três Blocos Informativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bloco 1: O que você leva */}
        <div className="p-5 rounded-[14px] border border-border bg-card space-y-2">
          <div className="w-8 h-8 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center font-mono text-xs font-bold">
            01
          </div>
          <h3 className="font-serif-editorial text-lg font-medium text-foreground">
            O que você leva
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Um radar de 7 necessidades, mapa de fontes, identificação de forças, alavancas e um
            plano de 4 semanas.
          </p>
        </div>

        {/* Bloco 2: O que ela não é */}
        <div className="p-5 rounded-[14px] border border-border bg-card space-y-2">
          <div className="w-8 h-8 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center font-mono text-xs font-bold">
            02
          </div>
          <h3 className="font-serif-editorial text-lg font-medium text-foreground">
            O que ela não é
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Não é avaliação nem teste psicométrico. Não rotula, não diagnostica e não substitui
            psicoterapia pessoal ou supervisão.
          </p>
        </div>

        {/* Bloco 3: Privacidade */}
        <div className="p-5 rounded-[14px] border border-border bg-card space-y-2">
          <div className="w-8 h-8 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center font-mono text-xs font-bold">
            03
          </div>
          <h3 className="font-serif-editorial text-lg font-medium text-foreground">
            Privacidade estrita
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Seus textos e notas ficam salvos no seu aparelho. Nenhum dado ou reflexão pessoal é
            enviado em claro.
          </p>
        </div>
      </div>

      {/* Contrato Pedagógico de Cuidado (3 caixas obrigatórias) */}
      <div className="p-6 rounded-[16px] border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-950/20 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h3 className="font-serif-editorial text-xl font-medium text-foreground">
            Acordo prévio para o seu percurso
          </h3>
        </div>

        <p className="text-xs text-muted-foreground">
          Para garantir um espaço seguro, ético e proveitoso, assinale as três confirmações antes de
          iniciar:
        </p>

        <div className="space-y-3 text-xs">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={c1} onCheckedChange={(val) => setC1(!!val)} className="mt-0.5" />
            <span className="text-foreground leading-relaxed">
              <strong>(1) Vou falar de mim e não de pacientes:</strong> este mapa é dedicado à minha
              relação com o trabalho, sem identificação clínica de terceiros.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={c2} onCheckedChange={(val) => setC2(!!val)} className="mt-0.5" />
            <span className="text-foreground leading-relaxed">
              <strong>(2) Posso pular qualquer pergunta e pausar quando quiser:</strong> respeito
              meu próprio ritmo e necessidades do dia.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={c3} onCheckedChange={(val) => setC3(!!val)} className="mt-0.5" />
            <span className="text-foreground leading-relaxed">
              <strong>(3) Entendo que isto não é avaliação nem terapia:</strong> utilizo esta
              ferramenta como bússola de reflexão para o meu fazer clínico.
            </span>
          </label>
        </div>
      </div>

      {/* Ações: Começar ou Importar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Button
          type="button"
          onClick={onIniciar}
          disabled={!todosMarcados}
          className="w-full sm:w-auto min-h-[46px] px-8 text-sm font-semibold rounded-[10px] bg-primary text-primary-foreground disabled:opacity-50 gap-2 cursor-pointer"
        >
          <span>Começar meu mapa</span>
          <ArrowRight className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setMostrandoImportador((prev) => !prev)}
          className="w-full sm:w-auto min-h-[46px] px-5 text-xs font-mono rounded-[10px] gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>Importar um mapa que já fiz</span>
        </Button>
      </div>

      {/* Caixa de Importação de Cápsula / JSON */}
      {mostrandoImportador && (
        <div className="p-5 rounded-[14px] border border-border bg-card space-y-3 animate-fade-in">
          <label className="text-xs font-mono font-semibold text-foreground block">
            Cole aqui a sua cápsula (SKIGAI1|F...|...) ou o arquivo JSON:
          </label>
          <textarea
            value={importInput}
            onChange={(e) => {
              setImportInput(e.target.value)
              setErroImport(null)
            }}
            placeholder="SKIGAI1|F3|{...} ou { 'versao': '1.0', ... }"
            rows={4}
            className="w-full p-3 rounded-[8px] border border-input bg-background font-mono text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
          />
          {erroImport && <p className="text-xs text-rose-600 font-mono">{erroImport}</p>}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setMostrandoImportador(false)}
              className="text-xs font-mono"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmeterImport}
              className="text-xs font-mono bg-primary text-primary-foreground"
            >
              Validar e Restaurar
            </Button>
          </div>
        </div>
      )}

      {/* Rodapé Permanente de Cuidado */}
      <div className="pt-6 border-t border-border/70 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
        <span className="flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-primary" />
          <span>Em momentos difíceis: CVV 188 (24h gratuito) · SAMU 192</span>
        </span>
        <span>Entrelaços Psicologia · Método FAC</span>
      </div>
    </div>
  )
}
function Sparkles(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  )
}
