import React, { useState, useEffect, useRef } from 'react'
import { Sparkles, Send, Heart, Bot, User, HelpCircle, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CalculationResult } from '@/types/pricing'
import {
  ChatMessage,
  generateInitialDiagnostic,
  answerHeuristicQuestion,
} from '@/lib/aiAdvisorEngine'

interface AIAdvisorProps {
  calculation: CalculationResult
}

const QUICK_QUESTIONS = [
  'Como reajustar pacientes antigos?',
  'Como captar pacientes particulares?',
  'Estou abaixo do piso — o que fazer?',
  'Como organizar minha reserva?',
]

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ calculation }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const diag = generateInitialDiagnostic(calculation)
    return [
      {
        id: 'msg_init',
        sender: 'advisor',
        text: diag.text,
        bullets: diag.bullets,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]
  })

  const [inputVal, setInputVal] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Scroll automático para última mensagem
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputVal).trim()
    if (!query || isTyping) return

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputVal('')
    setIsTyping(true)

    // Simulação viva de digitação (400ms) sem chamadas de rede (QA-07)
    setTimeout(() => {
      const response = answerHeuristicQuestion(query, calculation)
      const advisorMsg: ChatMessage = {
        id: 'adv_' + Date.now(),
        sender: 'advisor',
        text: response.text,
        bullets: response.bullets,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, advisorMsg])
      setIsTyping(false)
    }, 400)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[520px]">
      {/* Header do Chat */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5B3A8E] text-white flex items-center justify-center shadow-xs">
            <Heart className="w-4 h-4 fill-white/20" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              Consultor Clínico Inteligente
              <span className="text-[10px] font-sans font-semibold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-[#5B3A8E] dark:bg-purple-950 dark:text-purple-300">
                Local FAC
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Orientações éticas e financeiras baseadas no Método FAC e Código do CFP
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Offline / 100% Privado
        </div>
      </div>

      {/* Área de Mensagens Scrollável */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user'

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs shadow-2xs ${
                  isUser
                    ? 'bg-[#5B3A8E] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-[#5B3A8E] dark:text-purple-300'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Bolha */}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-2 leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-[#5B3A8E] text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-tl-none'
                }`}
              >
                <p className="font-medium">{msg.text}</p>

                {msg.bullets && msg.bullets.length > 0 && (
                  <ul className="space-y-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    {msg.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#5B3A8E] dark:text-purple-300 font-bold shrink-0">
                          •
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div
                  className={`text-[9px] text-right pt-0.5 ${
                    isUser ? 'text-purple-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          )
        })}

        {/* Indicador de Digitação (Bouncing dots) */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
              <span
                className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
              <span className="text-[10px] ml-1 text-slate-500">Analisando diretrizes...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chips de Perguntas Rápidas */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-2">
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <Lightbulb className="w-3 h-3 text-[#5B3A8E]" />
          <span>Perguntas frequentes:</span>
        </div>
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              disabled={isTyping}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-950/60 hover:text-[#5B3A8E] transition-colors border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Livre */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2 pt-1"
        >
          <Input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Digite uma dúvida sobre precificação, enquadre ou faltas..."
            disabled={isTyping}
            className="h-10 text-xs bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700"
          />
          <Button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="h-10 px-4 bg-[#5B3A8E] hover:bg-[#452A6F] text-white shrink-0"
            aria-label="Enviar pergunta ao consultor"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
