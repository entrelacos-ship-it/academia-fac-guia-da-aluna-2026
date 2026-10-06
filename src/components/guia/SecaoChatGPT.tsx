import React from 'react'
import { LINKS_CHATGPT_OFICIAIS } from '@/config/encontro1Verbatim'
import { ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const SecaoChatGPT: React.FC = () => {
  return (
    <div className="rounded-[16px] border border-slate-200/90 dark:border-[#27272A] bg-white dark:bg-[#121216] p-6 sm:p-8 space-y-7">
      {/* Cabeçalho */}
      <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
          PREPARE SUA FERRAMENTA
        </span>
        <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-slate-900 dark:text-white mt-1">
          ChatGPT: acesso pronto, sem complicação.
        </h3>
        <p className="text-sm text-slate-600 dark:text-[#A1A1AA] mt-1.5 leading-relaxed font-light">
          Nesta abertura, a tarefa é conseguir entrar e testar uma conversa segura. O navegador já
          basta; instalar um aplicativo é opcional. Uma conta gratuita permite começar, e você não
          precisa decidir sobre assinatura agora.
        </p>
      </div>

      {/* Passos 01 a 06 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            num: '01',
            titulo: 'Abra o endereço oficial',
            texto:
              'No celular ou computador, acesse chatgpt.com. Para este encontro, não é necessário instalar nada. Se preferir aplicativo, use somente o caminho oficial de download da OpenAI.',
          },
          {
            num: '02',
            titulo: 'Entre ou crie sua conta',
            texto:
              'Escolha a opção de entrar ou cadastrar-se mostrada na tela e siga as instruções. Estar conectada permite guardar conversas e usar GPTs compartilhados aos quais sua conta tenha acesso.',
          },
          {
            num: '03',
            titulo: 'Comece pelo plano gratuito',
            texto:
              'Ele basta para o teste deste encontro. Planos pagos oferecem limites e recursos diferentes, que podem mudar. Compare na página oficial somente se uma necessidade concreta surgir; nenhuma assinatura é exigida para começar o Mapa.',
          },
          {
            num: '04',
            titulo: 'Faça um teste sem dados sensíveis',
            texto:
              'Abra uma conversa nova e escreva: "Oi, quero conhecer o que você faz. Responda em uma frase." Se receber uma resposta, seu acesso básico está funcionando.',
          },
          {
            num: '05',
            titulo: 'Revise seus controles de dados',
            texto:
              'No perfil, abra Configurações → Controles de dados e escolha se novas conversas podem ser usadas para melhorar os modelos. Essa escolha não substitui a regra de nunca inserir dados de pacientes.',
          },
          {
            num: '06',
            titulo: 'Guarde seu primeiro teste',
            texto:
              'Salve a conversa de teste e volte aos prompts deste caderno quando quiser explorar seu resultado. Revise sempre as respostas da IA com seu próprio critério.',
          },
        ].map((passo) => (
          <div
            key={passo.num}
            className="p-4 rounded-[12px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#7c3aed] dark:text-[#C084FC]">
                {passo.num}
              </span>
              <h4 className="font-sans font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                {passo.titulo}
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed font-light">
              {passo.texto}
            </p>
          </div>
        ))}
      </div>

      {/* Regra de Cuidado (Destaque) */}
      <div className="p-4 sm:p-5 rounded-[12px] bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-rose-950 dark:text-rose-200 leading-relaxed font-light">
          <strong className="font-semibold block text-rose-900 dark:text-rose-100 font-sans">
            Regra fundamental de cuidado ético com IA:
          </strong>
          <p>
            Nunca envie à IA nome, contato, prontuário, fala de sessão ou história reconhecível de uma
            pessoa atendida. Trabalhe com dados da própria gestão profissional ou com personagens
            inventados. A revisão e a decisão final são suas.
          </p>
        </div>
      </div>

      {/* Links Oficiais */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-[#27272A] space-y-2.5">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-[#A1A1AA] block">
          Links Oficiais da Ferramenta
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {LINKS_CHATGPT_OFICIAIS.map((link) => (
            <a
              key={link.rotulo}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-[10px] border border-slate-200/90 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#18181B] hover:border-[#7c3aed]/50 dark:hover:border-[#C084FC]/50 transition-colors flex flex-col justify-between gap-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[#7c3aed] dark:text-[#C084FC] group-hover:underline">
                  {link.rotulo}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#7c3aed]" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#71717A] leading-tight">
                {link.descricao}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
