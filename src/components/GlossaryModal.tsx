import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Coins, Percent, CalendarX, Scale, PiggyBank, Receipt, BookOpen } from 'lucide-react'

interface GlossaryModalProps {
  isOpen: boolean
  onClose: () => void
}

const GLOSSARY_ITEMS = [
  {
    id: 'pro-labore',
    icon: Coins,
    title: 'Pró-labore vs. Faturamento Bruto vs. Lucro',
    content:
      'O Faturamento Bruto é o total de dinheiro que entra no consultório. O Pró-labore é a sua remuneração mensal regular e planejada como profissional (seu salário clínico para cobrir vida pessoal). O Lucro é o excedente que permanece no negócio após pagar despesas, impostos, reservas e o próprio pró-labore.',
  },
  {
    id: 'markup-divisor',
    icon: Percent,
    title: 'Markup Divisor (Fórmula de Formação de Preço)',
    content:
      'Técnica matemática que calcula o preço de venda para que os tributos e a reserva incidam sobre a receita bruta total, e não apenas sobre os custos. É dado por 1 - (Reserva% + Tributos%)/100. Impede a ilusão contábil de calcular porcentagens sobre uma base menor e perder margem.',
  },
  {
    id: 'taxa-falta',
    icon: CalendarX,
    title: 'Taxa de Falta e Absenteísmo Clínico',
    content:
      'Representa a porcentagem histórica de atendimentos cancelados, desmarcados ou não comparecidos sem remuneração, além de recessos e feriados. Considerar 10% a 15% de perda é essencial para não precificar assumindo uma agenda irreal de 100% de ocupação e presença.',
  },
  {
    id: 'tabela-cfp',
    icon: Scale,
    title: 'Tabela de Honorários do CFP (Resolução CFP)',
    content:
      'Tabela referencial elaborada pelo Conselho Federal de Psicologia em conjunto com o DIEESE e FENAPSI. Estabelece valores médios, mínimos e superiores para balizar o mercado, valorizar a categoria e evitar a aviltação da profissão psicológica.',
  },
  {
    id: 'reserva-tecnica',
    icon: PiggyBank,
    title: 'Reserva Técnica / Fundo de Manejo',
    content:
      'Provisão mensal (recomendado 10%) destinada a cobrir o período de férias, 13º salário da(o) psicóloga(o), quedas sazonais de demanda (como janeiro e julho) e fundos de emergência da prática clínica. Garante estabilidade emocional e financeira.',
  },
  {
    id: 'tributacao',
    icon: Receipt,
    title: 'Simples Nacional vs. Carnê-Leão (Livro Caixa)',
    content:
      'Como Pessoa Física autônoma, recolhe-se IRPF via Carnê-Leão mensal (alíquotas de até 27,5% com dedução do Livro Caixa) mais INSS e ISS. Como Pessoa Jurídica (PJ), pode-se optar pelo Simples Nacional (Anexo III via Fator R a partir de 6%, ou Anexo V a 15,5%), geralmente gerando grande economia tributária a partir de certo faturamento.',
  },
]

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#18181B] border-[#27272A] text-white rounded-[16px] shadow-2xl focus:outline-hidden focus:ring-2 focus:ring-[#C084FC]">
        <DialogHeader className="border-b border-[#27272A] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-[8px] bg-[#0A0A14] border border-[#27272A] text-[#C084FC]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="font-sans text-xl font-semibold text-white tracking-tight">
                Glossário Clínico e Financeiro
              </DialogTitle>
              <DialogDescription className="text-xs text-[#A1A1AA] mt-0.5 font-mono">
                CONCEITOS DO MÉTODO FAC · DIRETRIZES ASTRAL
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2">
          <Accordion
            type="single"
            collapsible
            defaultValue="pro-labore"
            className="w-full space-y-1"
          >
            {GLOSSARY_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-[#27272A] rounded-[10px] px-2 transition-colors data-[state=open]:bg-[#0A0A14]/60"
                >
                  <AccordionTrigger className="text-left py-3 hover:no-underline group focus:outline-hidden focus:ring-2 focus:ring-[#C084FC] rounded-[8px] px-2">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-[6px] bg-[#0A0A14] border border-[#27272A] text-[#C084FC] group-hover:border-[#C084FC]/50 group-hover:text-[#FB923C] transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-sans font-medium text-white group-hover:text-[#C084FC] transition-colors text-sm">
                        {item.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#A1A1AA] pl-11 pr-3 text-xs leading-relaxed pb-3 font-sans">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>

        <div className="pt-3 border-t border-[#27272A] text-[11px] font-mono text-[#71717A] text-center">
          Pressione{' '}
          <kbd className="px-1.5 py-0.5 bg-[#0A0A14] border border-[#27272A] rounded-[4px] text-[10px] text-white">
            ESC
          </kbd>{' '}
          para fechar a qualquer momento.
        </div>
      </DialogContent>
    </Dialog>
  )
}
