import React, { useState } from 'react'
import {
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlunaGuiaService, AlunaSession } from '@/services/alunaGuiaService'

interface ValidarEmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (aluna: AlunaSession) => void
  defaultEmail?: string
}

export const ValidarEmailModal: React.FC<ValidarEmailModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultEmail = '',
}) => {
  const [step, setStep] = useState<'email' | 'codigo'>('email')
  const [email, setEmail] = useState(defaultEmail)
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    text: string
    type: 'info' | 'error' | 'success'
  } | null>(null)

  if (!isOpen) return null

  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setMessage({ text: 'Por favor, informe um e-mail válido.', type: 'error' })
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const res = await AlunaGuiaService.solicitarCodigo(cleanEmail)
      setMessage({
        text: res.message || 'Código enviado! Verifique sua caixa de entrada e a pasta de spam.',
        type: 'info',
      })
      setStep('codigo')
    } catch (err: unknown) {
      setMessage({
        text:
          (err as { message?: string })?.message ||
          'Não foi possível solicitar o código no momento. Tente novamente.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmarCodigo = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCode = codigo.trim()
    if (!cleanCode || cleanCode.length < 4) {
      setMessage({ text: 'Informe o código numérico recebido por e-mail.', type: 'error' })
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const res = await AlunaGuiaService.confirmarCodigo(email, cleanCode)
      if (res.success && res.aluna) {
        AlunaGuiaService.saveLocalSession(res.aluna)
        setMessage({ text: 'Matrícula validada com sucesso!', type: 'success' })
        setTimeout(() => {
          onSuccess(res.aluna!)
          onClose()
        }, 800)
      } else {
        setMessage({
          text: res.message || 'Código inválido ou matrícula não encontrada.',
          type: 'error',
        })
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string; status?: string }; message?: string }
      const backendMsg =
        errorObj.data?.message || errorObj.message || 'Código incorreto ou expirado.'
      setMessage({ text: backendMsg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-background rounded-2xl border border-border/80 shadow-lg overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Cabeçalho Editorial */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
              Guia da Aluna · Acesso
            </span>
            <h3 className="font-serif-editorial text-2xl font-normal text-foreground mt-0.5">
              Validar E-mail de Matrícula
            </h3>
            <p className="text-xs text-muted-foreground font-light mt-1">
              Exclusivo para alunas matriculadas na Academia Método FAC
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground text-lg rounded-lg"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        {/* Mensagem descritiva */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
          {step === 'email'
            ? 'Digite o mesmo endereço de e-mail utilizado na sua inscrição da Academia. Enviaremos um código temporário de 6 dígitos para confirmar sua matrícula ativa.'
            : `Digite o código de 6 dígitos enviado para ${email}. Se não encontrar em alguns minutos, verifique a pasta de spam.`}
        </p>

        {/* Alerta de feedback */}
        {message && (
          <div
            className={`p-3.5 rounded-[8px] text-xs leading-relaxed flex items-start gap-2 ${
              message.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
                : message.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800'
            }`}
          >
            {message.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Formulário Etapa 1: E-mail */}
        {step === 'email' && (
          <form onSubmit={handleSolicitarCodigo} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                E-mail de compra do curso
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] rounded-[8px] min-h-[44px] h-11"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold min-h-[44px] rounded-[8px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Enviando código...
                  </>
                ) : (
                  <>
                    <span>Receber código por e-mail</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-xs font-mono text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}

        {/* Formulário Etapa 2: Código */}
        {step === 'codigo' && (
          <form onSubmit={handleConfirmarCodigo} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Código de verificação (6 dígitos)</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setMessage(null)
                  }}
                  className="text-[11px] text-[#7c3aed] dark:text-[#C084FC] hover:underline"
                >
                  Trocar e-mail
                </button>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Ex: 123456"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                  className="pl-9 text-base tracking-widest font-mono font-semibold bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] rounded-[8px] h-11 text-center"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                type="submit"
                disabled={loading || codigo.length < 4}
                className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold min-h-[44px] rounded-[8px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Validando matrícula...
                  </>
                ) : (
                  <>
                    <span>Confirmar e Liberar Cadernos</span>
                    <CheckCircle2 className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleSolicitarCodigo}
                disabled={loading}
                className="text-xs font-mono text-slate-500 hover:text-slate-800 dark:hover:text-white gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reenviar código</span>
              </Button>
            </div>
          </form>
        )}

        {/* Rodapé ético */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#27272A] text-[11px] font-mono text-slate-500 dark:text-[#71717A] flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Comprou com outro e-mail? Fale com suporte@entrelacospsicologia.com.br</span>
        </div>
      </div>
    </div>
  )
}
