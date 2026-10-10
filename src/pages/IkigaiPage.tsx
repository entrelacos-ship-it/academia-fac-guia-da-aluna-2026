import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSkigaiManager } from '@/hooks/useSkigaiManager'
import { useCloudSync } from '@/hooks/useCloudSync'
import { AlunaGuiaService, AlunaSession } from '@/services/alunaGuiaService'
import { StepAIntro } from '@/components/ikigai/StepAIntro'
import { Step0Termometro } from '@/components/ikigai/Step0Termometro'
import { Step1Mito } from '@/components/ikigai/Step1Mito'
import { Step2Fontes } from '@/components/ikigai/Step2Fontes'
import { Step3Roda } from '@/components/ikigai/Step3Roda'
import { Step4Leitura } from '@/components/ikigai/Step4Leitura'
import { Step5Pilares } from '@/components/ikigai/Step5Pilares'
import { Step6Redesenho } from '@/components/ikigai/Step6Redesenho'
import { Step7Direcao } from '@/components/ikigai/Step7Direcao'
import { Step8Relatorio } from '@/components/ikigai/Step8Relatorio'
import { CareModal } from '@/components/ikigai/CareModal'
import { FACLogo } from '@/components/FACLogo'
import { ValidarEmailModal } from '@/components/guia/ValidarEmailModal'
import {
  ArrowLeft,
  Pause,
  Download,
  Upload,
  Lock,
  HeartHandshake,
  Sparkles,
  HelpCircle,
  AlertCircle,
  FileDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const IkigaiPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useCloudSync()
  const [modalEmailAberto, setModalEmailAberto] = useState(false)
  const [alunaSession, setAlunaSession] = useState<AlunaSession | null>(() =>
    AlunaGuiaService.getLocalSession(),
  )

  const isAlunaValidada =
    currentUser?.role === 'admin' ||
    currentUser?.verified === true ||
    (!!alunaSession && alunaSession.status === 'ativa')

  // Gerenciador central de dados e estado com autosave local
  const {
    model,
    updateModel,
    fase,
    setFase,
    lastSavedTime,
    isStorageAvailable,
    importData,
    apagarMapaLocal,
    iniciarRevisao30Dias,
    gerarCapsula,
  } = useSkigaiManager()

  // Estados de modal de cuidado e pausa
  const [careModalAberto, setCareModalAberto] = useState(false)
  const [careMotivo, setCareMotivo] = useState<'risco' | 'total' | 'ressonancia_liberdade' | null>(
    null,
  )
  const [modalPausaAberto, setModalPausaAberto] = useState(false)
  const [modalAjudaAberto, setModalAjudaAberto] = useState(false)
  const [modalResetAberto, setModalResetAberto] = useState(false)

  // Gate de aluna validada (mesmo do Encontro 2+ e Mentora-FAC)
  if (!isAlunaValidada) {
    return (
      <div className="min-h-screen bg-[#F8F6F8] dark:bg-black text-[#261B2B] dark:text-[#F0F0F0] flex flex-col justify-between p-6">
        <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4">
          <FACLogo size="md" />
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-xs font-mono gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Hub</span>
          </Button>
        </header>

        <main className="max-w-xl w-full mx-auto text-center space-y-6 my-auto py-12">
          <div className="w-16 h-16 rounded-[20px] bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary">
              Aplicação Exclusiva para Alunas FAC
            </span>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-foreground">
              SKIGAI · O Mapa do seu Ikigai-kan
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O SKIGAI é uma ferramenta reservada a alunas matriculadas na Formação em Atendimento
              Clínico. Se você já é aluna, confirme o seu e-mail cadastrado para ter acesso
              imediato.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              type="button"
              onClick={() => setModalEmailAberto(true)}
              className="min-h-[46px] px-8 text-sm font-semibold rounded-[10px] bg-primary text-primary-foreground shadow-sm cursor-pointer"
            >
              Já sou aluna: Validar e-mail de matrícula
            </Button>
          </div>
        </main>

        <footer className="max-w-4xl w-full mx-auto text-center text-xs text-muted-foreground font-mono py-4 border-t border-border/70">
          Academia FAC · Entrelaços Psicologia · Apoio e Acolhimento: CVV 188 · SAMU 192
        </footer>

        <ValidarEmailModal
          isOpen={modalEmailAberto}
          onClose={() => setModalEmailAberto(false)}
          onSuccess={() => setModalEmailAberto(false)}
        />
      </div>
    )
  }

  // Se o contrato pedagógico inicial ainda não foi aceito, exibe Tela A
  const mostrarTelaA = !model.app?.contratoAceito && fase === 0

  const handleIniciarAbertura = () => {
    updateModel((prev) => ({
      ...prev,
      app: {
        ...prev.app,
        contratoAceito: true,
      },
    }))
  }

  const handleImportar = (conteudo: string) => {
    const res = importData(conteudo)
    if (!res.sucesso) {
      throw new Error(res.erro)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F6F8] dark:bg-black text-[#261B2B] dark:text-[#F0F0F0] flex flex-col justify-between selection:bg-primary/20">
      {/* Barra Superior Fixa: Progresso, Voltar, Pausar, Ajuda */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border shadow-xs px-4 sm:px-8 py-3 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-xs font-mono gap-1 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Hub</span>
            </Button>

            <div className="h-4 w-px bg-border" />

            <div className="flex items-center gap-2">
              <FACLogo size="sm" />
              <span className="font-serif-editorial text-sm font-semibold hidden md:inline text-foreground">
                SKIGAI
              </span>
            </div>
          </div>

          {/* Barra de Progresso "Fase X de 8" */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-mono font-bold text-foreground">
              {mostrarTelaA ? 'Abertura e Contrato' : `Fase ${fase} de 8`}
            </span>
            <div className="w-32 sm:w-48 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${mostrarTelaA ? 5 : ((fase + 1) / 9) * 100}%` }}
              />
            </div>
          </div>

          {/* Ações: Pausar, Ajuda, Status */}
          <div className="flex items-center gap-2">
            {lastSavedTime && (
              <span className="text-[10px] font-mono text-muted-foreground hidden lg:inline">
                Salvo às {lastSavedTime}
              </span>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalPausaAberto(true)}
              className="text-xs font-mono gap-1.5 h-8"
              title="Pausar e exportar backup"
            >
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pausar</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setModalAjudaAberto(true)}
              className="text-xs font-mono h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              title="Ajuda e Conceitos"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal de Cada Tela / Fase */}
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
        {mostrarTelaA && (
          <StepAIntro model={model} onIniciar={handleIniciarAbertura} onImportar={handleImportar} />
        )}

        {!mostrarTelaA && fase === 0 && (
          <Step0Termometro
            model={model}
            onAtualizar={updateModel}
            onAvancar={() => setFase(1)}
            onVoltar={() => {
              updateModel((prev) => ({
                ...prev,
                app: { ...prev.app, contratoAceito: false },
              }))
            }}
          />
        )}

        {!mostrarTelaA && fase === 1 && (
          <Step1Mito onAvancar={() => setFase(2)} onVoltar={() => setFase(0)} />
        )}

        {!mostrarTelaA && fase === 2 && (
          <Step2Fontes
            model={model}
            onAtualizar={updateModel}
            onAvancar={() => setFase(3)}
            onVoltar={() => setFase(1)}
          />
        )}

        {!mostrarTelaA && fase === 3 && (
          <Step3Roda
            model={model}
            onAtualizar={updateModel}
            onAvancar={() => setFase(4)}
            onVoltar={() => setFase(2)}
            onPausar={() => setModalPausaAberto(true)}
          />
        )}

        {!mostrarTelaA && fase === 4 && (
          <Step4Leitura
            model={model}
            onAtualizar={updateModel}
            onAvancar={() => setFase(5)}
            onVoltar={() => setFase(3)}
            onAbrirCuidado={() => {
              setCareMotivo('ressonancia_liberdade')
              setCareModalAberto(true)
            }}
          />
        )}

        {!mostrarTelaA && fase === 5 && (
          <Step5Pilares
            model={model}
            onAtualizar={updateModel}
            onAvancar={() => setFase(6)}
            onVoltar={() => setFase(4)}
            onDispararRisco={() => {
              setCareMotivo('risco')
              setCareModalAberto(true)
            }}
          />
        )}

        {!mostrarTelaA && fase === 6 && (
          <Step6Redesenho
            model={model}
            onAtualizar={updateModel}
            onAvancar={() => setFase(7)}
            onVoltar={() => setFase(5)}
          />
        )}

        {!mostrarTelaA && fase === 7 && (
          <Step7Direcao
            model={model}
            onAtualizar={updateModel}
            onAvancar={() => setFase(8)}
            onVoltar={() => setFase(6)}
          />
        )}

        {!mostrarTelaA && fase === 8 && (
          <Step8Relatorio
            model={model}
            onAtualizar={updateModel}
            onIniciarRevisao={() => {
              iniciarRevisao30Dias()
              setFase(3) // vai direto para a revisão das 7 necessidades
            }}
            onVoltar={() => setFase(7)}
          />
        )}
      </main>

      {/* Rodapé de Sustentação Ética */}
      <footer className="border-t border-border bg-card/60 px-4 sm:px-8 py-4 text-xs text-muted-foreground font-mono flex flex-col sm:flex-row items-center justify-between gap-2 print:hidden">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-primary" />
          <span>Protocolo de Cuidado: CVV 188 (24h) · SAMU 192</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setModalResetAberto(true)}
            className="hover:text-rose-500 transition-colors"
          >
            Apagar meu mapa deste aparelho
          </button>
          <span>SKIGAI · Método FAC</span>
        </div>
      </footer>

      {/* Modal de Cuidado e Acolhimento */}
      <CareModal
        aberto={careModalAberto}
        motivo={careMotivo}
        onContinuar={() => setCareModalAberto(false)}
        onPausar={() => {
          setCareModalAberto(false)
          setModalPausaAberto(true)
        }}
      />

      {/* Modal de Pausa e Cápsula */}
      {modalPausaAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-[20px] border border-border bg-card p-6 space-y-5 text-left">
            <h3 className="font-serif-editorial text-2xl font-medium text-foreground">
              Pausa de Respiração
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              O seu mapa já está salvo automaticamente na memória deste aparelho. Para guardar uma
              cópia externa ou transferir para outro computador ou celular, copie a sua cápsula
              abaixo:
            </p>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-muted-foreground block">
                Sua Cápsula SKIGAI1:
              </label>
              <textarea
                readOnly
                value={gerarCapsula()}
                rows={3}
                className="w-full p-2.5 rounded-[8px] border border-input bg-muted/40 font-mono text-[11px] select-all resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(gerarCapsula())
                }}
                className="text-xs font-mono"
              >
                Copiar Cápsula
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setModalPausaAberto(false)}
                className="text-xs font-mono bg-primary text-primary-foreground"
              >
                Continuar Mapa
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ajuda e Conceitos */}
      {modalAjudaAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-[20px] border border-border bg-card p-6 space-y-4 text-left max-h-[85vh] overflow-y-auto">
            <h3 className="font-serif-editorial text-2xl font-medium text-foreground">
              Guia Rápido do Método SKIGAI
            </h3>
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <p>
                <strong>Ikigai-kan:</strong> O sentimento de que o trabalho vale a pena. Diferente
                de uma busca abstrata por propósito, foca na experiência real do cotidiano.
              </p>
              <p>
                <strong>Lacunas:</strong> São os pontos que pedem cuidado e não defeitos pessoais.
                Calculadas pela fórmula: <code>Importância × (3 − Nutrição)</code>.
              </p>
              <p>
                <strong>Alavanca:</strong> A combinação de Interesse e Habilidade{' '}
                <code>(Int + H) / 2</code>, indicando onde você tem mais facilidade para agir agora.
              </p>
              <p>
                <strong>Estrutura vs Escolha:</strong> Desgastes clínicos raramente são falhas
                individuais. Cobranças financeiras e planos tiram a liberdade e a ressonância.
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                type="button"
                size="sm"
                onClick={() => setModalAjudaAberto(false)}
                className="text-xs font-mono"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação: Apagar Mapa deste aparelho */}
      {modalResetAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[20px] border border-rose-300 dark:border-rose-900 bg-card p-6 space-y-4 text-left">
            <h3 className="font-serif-editorial text-xl font-medium text-rose-600 dark:text-rose-400">
              Apagar meu mapa deste aparelho?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Isto remove o seu mapa deste aparelho. Se você não exportou o arquivo de backup nem
              guardou a sua cápsula, não há como recuperar os dados.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setModalResetAberto(false)}
                className="text-xs font-mono"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  apagarMapaLocal()
                  setModalResetAberto(false)
                }}
                className="text-xs font-mono bg-rose-600 text-white hover:bg-rose-700"
              >
                Confirmar e Apagar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IkigaiPage
