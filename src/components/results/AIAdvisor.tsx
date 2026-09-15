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
    <div className="bg-[#18181B] rounded-[16px] p-6 border border-[#27272A] shadow-xl flex flex-col h-[540px]">
      {/* Header do Chat */}
      <div className="flex items-center justify-between pb-4 border-b border-[#27272A] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-[#0A0A14] border border-[#27272A] text-[#C084FC] flex items-center justify-center">
            <Heart className="w-4 h-4 text-[#C084FC]" />
          </div>
          <div>
            <h3 className="font-sans text-base font-semibold text-white flex items-center gap-1.5">
              Consultor Clínico Heurístico
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-[4px] bg-[#0A0A14] text-[#C084FC] border border-[#27272A]">
                Local FAC
              </span>
            </h3>
            <p className="text-[11px] text-[#A1A1AA]">
              Orientações éticas e financeiras baseadas no Método FAC e Código do CFP
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
                className={`w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 text-xs border ${
                  isUser
                    ? 'bg-[#C084FC] text-[#0A0A14] border-[#C084FC]'
                    : 'bg-[#0A0A14] text-[#C084FC] border-[#27272A]'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Bolha */}
              <div
                className={`max-w-[85%] rounded-[12px] p-3.5 text-xs space-y-2 leading-relaxed ${
                  isUser
                    ? 'bg-[#C084FC] text-[#0A0A14] font-medium rounded-tr-none'
                    : 'bg-[#121216] text-[#E4E4E7] border border-[#27272A] rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>

                {msg.bullets && msg.bullets.length > 0 && (
                  <ul className="space-y-1.5 pt-1 border-t border-[#27272A]/80">
                    {msg.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#C084FC] font-bold shrink-0">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div
                  className={`text-[9px] font-mono text-right pt-0.5 ${
                    isUser ? 'text-[#3B0764]' : 'text-[#71717A]'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          )
        })}

        {/* Indicador de Digitação */}
        {isTyping && (
          <div className="flex items-center gap-2 text-[#71717A] text-xs pl-9">
            <div className="flex items-center gap-1 bg-[#121216] border border-[#27272A] px-3 py-1.5 rounded-full">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#C084FC] animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#C084FC] animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#C084FC] animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
              <span className="text-[10px] ml-1 font-mono text-[#A1A1AA]">
                Consultando diretrizes...
              </span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chips de Perguntas Rápidas */}
      <div className="pt-2 border-t border-[#27272A] shrink-0 space-y-2">
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#71717A]">
          <Lightbulb className="w-3 h-3 text-[#FB923C]" />
          <span>Perguntas frequentes:</span>
        </div>
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              disabled={isTyping}
              onClick={() => handleSend(q)}
              className="text-[11px] font-mono px-2.5 py-1 rounded-[6px] bg-[#121216] text-[#A1A1AA] hover:text-white hover:border-[#C084FC]/50 transition-colors border border-[#27272A] disabled:opacity-50"
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
            className="h-10 text-xs bg-[#121216] border-[#27272A] text-white placeholder:text-[#71717A] rounded-[8px]"
          />
          <Button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="h-10 px-4 bg-[#C084FC] hover:bg-[#a855f7] text-[#0A0A14] font-semibold shrink-0 rounded-[8px]"
            aria-label="Enviar pergunta ao consultor"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
