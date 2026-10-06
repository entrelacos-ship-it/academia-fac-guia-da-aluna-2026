import React, { useState, useRef } from 'react'
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Eye,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { IkigaiState, CircleId } from '@/types/ikigai'
import {
  CIRCLE_DEFINITIONS,
  FICTITIOUS_FACILITATOR_EXAMPLE,
  INITIAL_EMPTY_IKIGAI_STATE,
} from '@/config/ikigaiContent'
import { IkigaiSvgDiagram } from './IkigaiSvgDiagram'

interface PresentationModeProps {
  onClose: () => void
}

export const PresentationMode: React.FC<PresentationModeProps> = ({ onClose }) => {
  // Estado local e ISOLADO para não afetar os dados reais da aluna
  const [sessionState, setSessionState] = useState<IkigaiState>(() =>
    JSON.parse(JSON.stringify(FICTITIOUS_FACILITATOR_EXAMPLE)),
  )

  const [activeTab, setActiveTab] = useState<'circles' | 'diagram'>('circles')
  const [currentCircleIndex, setCurrentCircleIndex] = useState(0) // 0 a 3
  const [newItemText, setNewItemText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const circleKeys: CircleId[] = ['love', 'goodAt', 'worldNeeds', 'paidFor']
  const currentCircleKey = circleKeys[currentCircleIndex]
  const currentDef = CIRCLE_DEFINITIONS[currentCircleKey]
  const currentItems = sessionState.circles[currentCircleKey]

  const handleLoadExample = () => {
    setSessionState(JSON.parse(JSON.stringify(FICTITIOUS_FACILITATOR_EXAMPLE)))
  }

  const handleClearSession = () => {
    setSessionState(JSON.parse(JSON.stringify(INITIAL_EMPTY_IKIGAI_STATE)))
  }

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newItemText.trim()) return

    setSessionState((prev) => {
      const newItem = {
        id: `pres-${Date.now()}`,
        text: newItemText.trim(),
        starred: false,
        createdAt: new Date().toISOString(),
      }
      return {
        ...prev,
        circles: {
          ...prev.circles,
          [currentCircleKey]: [...prev.circles[currentCircleKey], newItem],
        },
      }
    })
    setNewItemText('')
  }

  const handleRemoveItem = (id: string) => {
    setSessionState((prev) => ({
      ...prev,
      circles: {
        ...prev.circles,
        [currentCircleKey]: prev.circles[currentCircleKey].filter((i) => i.id !== id),
      },
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as IkigaiState
        if (parsed.circles && parsed.intersections) {
          setSessionState(parsed)
          setActiveTab('diagram')
        } else {
          alert('Arquivo JSON inválido.')
        }
      } catch {
        alert('Erro ao ler o arquivo JSON da aluna.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-sans overflow-y-auto">
      {/* Topbar Discreta de Apresentação */}
      <header className="min-h-16 py-2 border-b border-slate-800 px-3 sm:px-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 bg-slate-900/95 backdrop-blur-md">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <Badge className="bg-[#7c3aed]/20 text-[#C084FC] border-[#7c3aed]/40 text-xs font-mono uppercase tracking-wider">
            Modo Apresentação · Facilitadora
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="sm:hidden min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-white hover:bg-slate-800"
            title="Sair do modo apresentação"
            aria-label="Fechar modo apresentação"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleLoadExample}
            className="min-h-[44px] sm:min-h-0 sm:h-9 text-xs font-mono border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white flex-1 sm:flex-initial"
          >
            Exemplo
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleClearSession}
            className="min-h-[44px] sm:min-h-0 sm:h-9 text-xs font-mono border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white flex-1 sm:flex-initial"
          >
            Limpar
          </Button>

          <label className="min-h-[44px] sm:min-h-0 sm:h-9 px-3 rounded-[6px] border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Abrir painel de aluna (JSON)</span>
            <span className="sm:hidden">Abrir JSON</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="hidden sm:inline-flex min-h-[44px] min-w-[44px] sm:min-h-0 sm:h-9 text-slate-400 hover:text-white hover:bg-slate-800"
            title="Sair do modo apresentação"
            aria-label="Fechar modo apresentação"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Navegação entre Círculos e Diagrama Completo */}
      <div className="max-w-6xl w-full mx-auto px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {circleKeys.map((k, idx) => {
            const active = activeTab === 'circles' && currentCircleIndex === idx
            return (
              <button
                key={k}
                onClick={() => {
                  setActiveTab('circles')
                  setCurrentCircleIndex(idx)
                }}
                className={`px-3 py-2 min-h-[44px] sm:min-h-[36px] sm:py-1.5 rounded-[8px] text-xs font-mono font-medium transition-colors cursor-pointer shrink-0 ${
                  active
                    ? 'bg-[#7c3aed] text-white shadow-xs'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Círculo 0{idx + 1}
              </button>
            )
          })}

          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-2 min-h-[44px] sm:min-h-[36px] sm:py-1.5 rounded-[8px] text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'diagram'
                ? 'bg-[#ea580c] text-white shadow-xs'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Diagrama Completo</span>
          </button>
        </div>

        {activeTab === 'circles' && (
          <div className="flex items-center gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              disabled={currentCircleIndex === 0}
              onClick={() => setCurrentCircleIndex((prev) => prev - 1)}
              className="min-h-[44px] sm:min-h-0 sm:h-8 border-slate-700 text-slate-300 flex-1 sm:flex-initial"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Anterior</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentCircleIndex === 3}
              onClick={() => setCurrentCircleIndex((prev) => prev + 1)}
              className="min-h-[44px] sm:min-h-0 sm:h-8 border-slate-700 text-slate-300 flex-1 sm:flex-initial"
            >
              <span>Próximo</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Conteúdo Principal do Modo Apresentação */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center">
        {activeTab === 'circles' ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Header do Círculo com Tipografia Grande */}
            <div className="space-y-3">
              <span className="font-mono text-sm uppercase tracking-wider text-[#C084FC] block font-bold">
                CÍRCULO 0{currentDef.number} · {currentDef.badgeText}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white">
                {currentDef.title}
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                {currentDef.description}
              </p>
            </div>

            {/* Perguntas-guia em destaque para leitura em grupo */}
            <div className="p-5 rounded-[12px] bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-mono text-xs uppercase text-slate-400 block font-bold">
                Perguntas para a turma:
              </span>
              <ul className="space-y-1.5 text-base text-slate-200">
                {currentDef.questions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#C084FC] font-mono">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Input Rápido para Preencher ao Vivo */}
            <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-2">
              <Input
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder={`Digitar exemplo ao vivo para o ${currentDef.title}...`}
                className="h-12 bg-slate-900 border-slate-700 text-sm sm:text-base text-white focus:border-[#C084FC]"
              />
              <Button
                type="submit"
                disabled={!newItemText.trim()}
                className="min-h-[48px] sm:h-12 px-6 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm rounded-[8px] w-full sm:w-auto shrink-0"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Adicionar ao vivo</span>
              </Button>
            </form>

            {/* Lista dos Itens com Tipografia Grande e Confortável */}
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase text-slate-400 block">
                Itens neste círculo ({currentItems.length}):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-[10px] bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-base"
                  >
                    <span className="text-slate-100 font-medium">
                      {item.starred && <span className="text-amber-400 mr-2">★</span>}
                      {item.text}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-[8px] transition-colors p-1 shrink-0"
                      title="Excluir item do exemplo"
                      aria-label="Excluir item do exemplo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Visualização de Diagrama Completo em Tela Cheia */
          <div className="space-y-6 flex flex-col items-center w-full">
            <div className="w-full max-w-3xl bg-slate-900 p-3 sm:p-6 rounded-[16px] border border-slate-800 shadow-xl overflow-x-auto">
              <div className="min-w-[320px] sm:min-w-0 flex justify-center">
                <IkigaiSvgDiagram state={sessionState} />
              </div>
            </div>

            <div className="text-center max-w-2xl px-2">
              <span className="font-mono text-xs uppercase text-[#C084FC] block">
                Declaração de Missão
              </span>
              <p className="text-lg sm:text-xl font-medium text-white italic mt-1 break-words">
                "{sessionState.missionStatement || 'Em construção'}"
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
