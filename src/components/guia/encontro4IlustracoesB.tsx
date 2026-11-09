import React from 'react'

// ─────────────────────────────────────────────────────────────
// Ilustrações I-12 a I-22 do Encontro 4. SVG inline, sem
// imagens externas, sem logotipos oficiais (apenas ícones
// genéricos). Perfil fictício: Marina Alves | Psicóloga Online,
// @marinaalves.psi, CRP 06/000000.
// ─────────────────────────────────────────────────────────────

const COR_ROXO = '#7c3aed'
const COR_LARANJA = '#ea580c'
const COR_LINHA = '#e2e8f0'
const COR_TEXTO = '#334155'
const COR_TEXTO_SUAVE = '#94a3b8'
const COR_FUNDO = '#f8fafc'

const Avatar: React.FC<{ cx?: number | string; cy?: number | string; r?: number | string }> = ({
  cx: rawCx = 50,
  cy: rawCy = 40,
  r: rawR = 16,
}) => {
  const cx = Number(rawCx) || 50
  const cy = Number(rawCy) || 40
  const r = Number(rawR) || 16
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#ede9fe" />
      <circle cx={cx} cy={cy - r * 0.35} r={r * 0.38} fill={COR_ROXO} />
      <path
        d={`M ${cx - r * 0.7} ${cy + r * 0.8} Q ${cx} ${cy + r * 0.2} ${cx + r * 0.7} ${cy + r * 0.8}`}
        fill={COR_ROXO}
      />
    </g>
  )
}
const Grade: React.FC<{ x: number; y: number; w: number; cols?: number; linhas?: number }> = ({
  x,
  y,
  w,
  cols = 3,
  linhas = 3,
}) => {
  const cel = w / cols
  const tiles: React.ReactNode[] = []
  for (let l = 0; l < linhas; l++) {
    for (let c = 0; c < cols; c++) {
      tiles.push(
        <rect
          key={`${l}-${c}`}
          x={x + c * cel + 2}
          y={y + l * cel + 2}
          width={cel - 4}
          height={cel - 4}
          rx="5"
          fill={['#ede9fe', '#f5f3ff', '#faede4'][(l + c) % 3]}
        />,
      )
    }
  }
  return <g>{tiles}</g>
}

// ─────────────────────────────────────────────────────────────
// I-12: os seis destaques, carrossel de pastas arredondadas.
// ─────────────────────────────────────────────────────────────
export const IlustracaoDestaques: React.FC = () => (
  <svg
    viewBox="0 0 320 220"
    className="w-full max-w-[440px]"
    role="img"
    aria-label="À esquerda, story aberto com botão Destacar marcado por ponto de toque. À direita, fileira de seis destaques do perfil com capas no mesmo estilo e os nomes embaixo: Comece por aqui, Quem sou, Como funciona, Dúvidas, Bastidores, Agendar"
  >
    <rect width="320" height="220" rx="18" fill={COR_FUNDO} />

    {/* Lado esquerdo: Story aberto com botão Destacar */}
    <g>
      <rect
        x="18"
        y="16"
        width="112"
        height="188"
        rx="14"
        fill="#ffffff"
        stroke="#334155"
        strokeWidth="2.5"
      />
      {/* Barra de progresso do story no topo */}
      <rect x="24" y="24" width="100" height="2.5" rx="1" fill="#ede9fe" />
      <rect x="24" y="24" width="60" height="2.5" rx="1" fill={COR_ROXO} />

      <Avatar cx="34" cy="38" r="8" />
      <text x="46" y="41" fontSize="6.5" fontWeight="700" fill={COR_TEXTO}>
        marinaalves.psi
      </text>

      {/* Conteúdo do story */}
      <rect x="26" y="54" width="96" height="96" rx="8" fill="#f5f3ff" />
      <text x="74" y="92" textAnchor="middle" fontSize="7" fontWeight="600" fill={COR_ROXO}>
        Comece por aqui
      </text>
      <text x="74" y="104" textAnchor="middle" fontSize="6" fill={COR_TEXTO_SUAVE}>
        História do consultório
      </text>

      {/* Botão Destacar com coração e ponto de toque */}
      <rect
        x="26"
        y="158"
        width="96"
        height="24"
        rx="6"
        fill="#f1f5f9"
        stroke={COR_ROXO}
        strokeWidth="1.2"
      />
      <circle cx="38" cy="170" r="5" fill="#f43f5e" />
      <text x="72" y="174" textAnchor="middle" fontSize="7" fontWeight="700" fill={COR_ROXO}>
        Destacar
      </text>
      {/* Ponto de toque no botão destacar */}
      <circle cx="106" cy="170" r="4.5" fill={COR_LARANJA} opacity="0.9" />
      <circle cx="106" cy="170" r="9" fill={COR_LARANJA} opacity="0.25" />
    </g>

    {/* Seta ligando os dois lados */}
    <g>
      <path
        d="M 136 100 L 148 100"
        stroke={COR_LARANJA}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <polygon points="148,97 154,100 148,103" fill={COR_LARANJA} />
    </g>

    {/* Lado direito: Fileira dos 6 destaques */}
    <g>
      <rect
        x="158"
        y="16"
        width="144"
        height="188"
        rx="14"
        fill="#ffffff"
        stroke="#334155"
        strokeWidth="2"
      />
      <text x="230" y="34" textAnchor="middle" fontSize="8" fontWeight="700" fill={COR_TEXTO}>
        Destaques do perfil
      </text>

      {/* Grade 3x2 de destaques */}
      {[
        { nome: 'Comece por aqui', cor: '#ede9fe' },
        { nome: 'Quem sou', cor: '#ede9fe' },
        { nome: 'Como funciona', cor: '#ede9fe' },
        { nome: 'Dúvidas', cor: '#ede9fe' },
        { nome: 'Bastidores', cor: '#ede9fe' },
        { nome: 'Agendar', cor: '#ede9fe' },
      ].map((d, i) => {
        const col = i % 3
        const lin = Math.floor(i / 3)
        const cx = 182 + col * 46
        const cy = 62 + lin * 66
        return (
          <g key={d.nome}>
            <circle cx={cx} cy={cy} r="16" fill={d.cor} stroke={COR_ROXO} strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r="8" fill="#c4b5fd" />
            <text
              x={cx}
              y={cy + 24}
              textAnchor="middle"
              fontSize="5.5"
              fontWeight="600"
              fill={COR_TEXTO}
            >
              {d.nome.length > 10 ? d.nome.slice(0, 9) + '…' : d.nome}
            </text>
          </g>
        )
      })}
    </g>
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-13: os três posts fixados
// ─────────────────────────────────────────────────────────────
export const IlustracaoPostsFixados: React.FC = () => (
  <svg
    viewBox="0 0 320 220"
    className="w-full max-w-[440px]"
    role="img"
    aria-label="À esquerda, post aberto com menu de três pontinhos e a opção Fixar no seu perfil marcada com ponto de toque. À direita, grade do perfil com três posts na primeira linha, cada um com um pequeno alfinete"
  >
    <rect width="320" height="220" rx="18" fill={COR_FUNDO} />

    {/* Lado esquerdo: Post aberto com menu ⋯ */}
    <g>
      <rect
        x="18"
        y="16"
        width="120"
        height="188"
        rx="14"
        fill="#ffffff"
        stroke="#334155"
        strokeWidth="2.5"
      />
      <Avatar cx="32" cy="32" r="8" />
      <text x="44" y="35" fontSize="6.5" fontWeight="700" fill={COR_TEXTO}>
        marinaalves.psi
      </text>
      {/* Três pontinhos */}
      <circle cx="120" cy="32" r="1.5" fill="#64748b" />
      <circle cx="125" cy="32" r="1.5" fill="#64748b" />
      <circle cx="130" cy="32" r="1.5" fill="#64748b" />

      {/* Foto do post */}
      <rect x="24" y="44" width="108" height="66" rx="4" fill="#ede9fe" />
      <text x="78" y="80" textAnchor="middle" fontSize="7" fontWeight="600" fill={COR_ROXO}>
        Para quem eu sou
      </text>

      {/* Menu suspenso aberto */}
      <rect
        x="24"
        y="118"
        width="108"
        height="74"
        rx="8"
        fill="#ffffff"
        stroke={COR_ROXO}
        strokeWidth="1.5"
      />
      <rect x="28" y="124" width="100" height="20" rx="4" fill="#f5f3ff" />
      {/* Alfinete no menu */}
      <circle cx="38" cy="134" r="2.5" fill={COR_LARANJA} />
      <line x1="38" y1="136" x2="38" y2="140" stroke={COR_LARANJA} strokeWidth="1" />
      <text x="46" y="137" fontSize="6.5" fontWeight="700" fill={COR_ROXO}>
        Fixar no seu perfil
      </text>
      {/* Ponto de toque */}
      <circle cx="114" cy="134" r="4.5" fill={COR_LARANJA} opacity="0.9" />
      <circle cx="114" cy="134" r="9" fill={COR_LARANJA} opacity="0.25" />

      <text x="32" y="156" fontSize="6" fill="#64748b">
        Compartilhar…
      </text>
      <text x="32" y="172" fontSize="6" fill="#64748b">
        Editar
      </text>
    </g>

    {/* Seta ligando */}
    <g>
      <path
        d="M 144 100 L 156 100"
        stroke={COR_LARANJA}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <polygon points="156,97 162,100 156,103" fill={COR_LARANJA} />
    </g>

    {/* Lado direito: Grade com 3 posts fixados na primeira linha */}
    <g>
      <rect
        x="166"
        y="16"
        width="136"
        height="188"
        rx="14"
        fill="#ffffff"
        stroke="#334155"
        strokeWidth="2"
      />
      <text x="234" y="34" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={COR_TEXTO}>
        Grade com fixados
      </text>

      {/* Linha 1 de posts com alfinete */}
      {[0, 1, 2].map((i) => {
        const x = 172 + i * 42
        return (
          <g key={i}>
            <rect
              x={x}
              y="44"
              width="38"
              height="38"
              rx="4"
              fill="#ede9fe"
              stroke={COR_ROXO}
              strokeWidth="1.2"
            />
            {/* Alfinete laranja */}
            <circle cx={x + 30} cy="52" r="2.5" fill={COR_LARANJA} />
            <line x1={x + 30} y1="54" x2={x + 30} y2="58" stroke={COR_LARANJA} strokeWidth="1" />
          </g>
        )
      })}
      <text x="234" y="92" textAnchor="middle" fontSize="6" fontWeight="600" fill={COR_ROXO}>
        1ª linha: 3 posts fixados 📌
      </text>

      {/* Linhas seguintes da grade (normais) */}
      {[0, 1, 2].map((i) => (
        <rect
          key={`l2-${i}`}
          x={172 + i * 42}
          y="102"
          width="38"
          height="38"
          rx="4"
          fill="#f8fafc"
          stroke={COR_LINHA}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <rect
          key={`l3-${i}`}
          x={172 + i * 42}
          y="144"
          width="38"
          height="38"
          rx="4"
          fill="#f8fafc"
          stroke={COR_LINHA}
        />
      ))}
    </g>
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-14: Instagram e Facebook conectados, dois quadrados com um
// elo central.
// ─────────────────────────────────────────────────────────────
export const IlustracaoConexaoMeta: React.FC = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de dois quadrados lado a lado representando o perfil profissional do Instagram e a Página do Facebook conectados por um elo com sinal de verificado"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <rect
      x="18"
      y="120"
      width="88"
      height="88"
      rx="18"
      fill="#ede9fe"
      stroke={COR_ROXO}
      strokeWidth="1.5"
    />
    <rect x="20" y="122" width="84" height="84" rx="16" fill="#f5f3ff" />
    <rect
      x="134"
      y="120"
      width="88"
      height="88"
      rx="18"
      fill="#faede4"
      stroke={COR_LARANJA}
      strokeWidth="1.5"
    />
    <rect x="136" y="122" width="84" height="84" rx="16" fill="#fff7ed" />
    <circle cx="120" cy="164" r="18" fill={COR_ROXO} />
    <path
      d="M 112 164 l 6 6 l 11 -12"
      stroke="#fff"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text x="62" y="234" fontSize="10" fill={COR_TEXTO} textAnchor="middle">
      Instagram
    </text>
    <text x="178" y="234" fontSize="10" fill={COR_TEXTO} textAnchor="middle">
      Facebook
    </text>
    <text x="120" y="264" fontSize="10" fill={COR_TEXTO_SUAVE} textAnchor="middle">
      conectados
    </text>
    <path
      d="M 106 290 q 14 12 28 0"
      stroke={COR_LARANJA}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <text x="120" y="316" fontSize="10" fill={COR_TEXTO_SUAVE} textAnchor="middle">
      @marinaalves.psi
    </text>
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-15: WhatsApp Business, balão de conversa com maleta.
// ─────────────────────────────────────────────────────────────
export const IlustracaoWhatsAppBusiness: React.FC = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração do ícone do WhatsApp Business: balão de conversa com maleta dentro, símbolo genérico de atendimento comercial"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <circle cx="120" cy="180" r="64" fill="#ede9fe" />
    <circle cx="120" cy="180" r="52" fill="#f5f3ff" />
    <path
      d="M 88 156 h 64 a 10 10 0 0 1 10 10 v 36 a 10 10 0 0 1 -10 10 h -40 l -16 14 v -14 h -8 a 10 10 0 0 1 -10 -10 v -36 a 10 10 0 0 1 10 -10 z"
      fill="#fff"
      stroke={COR_ROXO}
      strokeWidth="2.5"
    />
    <rect
      x="106"
      y="170"
      width="28"
      height="22"
      rx="4"
      fill="none"
      stroke={COR_ROXO}
      strokeWidth="2.5"
    />
    <path
      d="M 112 170 v -6 a 4 4 0 0 1 4 -4 h 8 a 4 4 0 0 1 4 4 v 6"
      fill="none"
      stroke={COR_ROXO}
      strokeWidth="2.5"
    />
    <path
      d="M 100 224 q 20 14 40 0"
      stroke={COR_LARANJA}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    <text x="120" y="280" fontSize="12" fontWeight="600" fill={COR_TEXTO} textAnchor="middle">
      WhatsApp Business
    </text>
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-16: instalar o aplicativo e usar o número na tela de
// boas-vindas do WhatsApp Business.
// ─────────────────────────────────────────────────────────────
export const IlustracaoInstalarWhatsApp: React.FC = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração da tela de boas-vindas do WhatsApp Business com o balão de conversa com maleta e o campo para digitar o número de telefone"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <circle cx="120" cy="90" r="36" fill="#ede9fe" />
    <path
      d="M 100 74 h 40 a 7 7 0 0 1 7 7 v 22 a 7 7 0 0 1 -7 7 h -24 l -10 9 v -9 h -6 a 7 7 0 0 1 -7 -7 v -22 a 7 7 0 0 1 7 -7 z"
      fill="#fff"
      stroke={COR_ROXO}
      strokeWidth="2"
    />
    <rect
      x="110"
      y="82"
      width="20"
      height="16"
      rx="3"
      fill="none"
      stroke={COR_ROXO}
      strokeWidth="2"
    />
    <path
      d="M 115 82 v -4 a 3 3 0 0 1 3 -3 h 4 a 3 3 0 0 1 3 3 v 4"
      fill="none"
      stroke={COR_ROXO}
      strokeWidth="2"
    />
    <text x="120" y="156" fontSize="13" fontWeight="700" fill={COR_TEXTO} textAnchor="middle">
      Bem-vinda ao WhatsApp Business
    </text>
    <rect
      x="40"
      y="180"
      width="160"
      height="44"
      rx="10"
      fill="#fff"
      stroke={COR_LINHA}
      strokeWidth="1.5"
    />
    <text x="50" y="200" fontSize="9" fill={COR_TEXTO_SUAVE}>
      Número de telefone
    </text>
    <text x="50" y="215" fontSize="11" fill={COR_TEXTO}>
      +55 11 90000 0000
    </text>
    <rect x="40" y="240" width="160" height="42" rx="10" fill={COR_ROXO} />
    <text x="120" y="266" fontSize="11" fontWeight="600" fill="#fff" textAnchor="middle">
      Avançar
    </text>
    <text x="120" y="310" fontSize="9" fill={COR_TEXTO_SUAVE} textAnchor="middle">
      Use o mesmo número do
    </text>
    <text x="120" y="324" fontSize="9" fill={COR_TEXTO_SUAVE} textAnchor="middle">
      atendimento das suas pacientes
    </text>
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-17: perfil comercial do WhatsApp Business, tela com nome,
// categoria e descrição preenchidos.
// ─────────────────────────────────────────────────────────────
export const IlustracaoPerfilComercial: React.FC = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração da tela de perfil comercial do WhatsApp Business com nome Marina Alves Psicóloga, categoria Psicóloga e descrição de atendimento online"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <circle cx="120" cy="78" r="34" fill="#ede9fe" />
    <circle cx="120" cy="68" r="12" fill={COR_ROXO} />
    <path d="M 98 96 q 22 -18 44 0 z" fill={COR_ROXO} />
    <text x="120" y="136" fontSize="12" fontWeight="700" fill={COR_TEXTO} textAnchor="middle">
      Marina Alves | Psicóloga
    </text>
    <rect
      x="40"
      y="154"
      width="160"
      height="34"
      rx="8"
      fill="#fff"
      stroke={COR_LINHA}
      strokeWidth="1.5"
    />
    <text x="50" y="169" fontSize="8" fill={COR_TEXTO_SUAVE}>
      Categoria
    </text>
    <text x="50" y="182" fontSize="10" fill={COR_TEXTO}>
      Psicóloga
    </text>
    <rect
      x="40"
      y="198"
      width="160"
      height="62"
      rx="8"
      fill="#fff"
      stroke={COR_LINHA}
      strokeWidth="1.5"
    />
    <text x="50" y="214" fontSize="8" fill={COR_TEXTO_SUAVE}>
      Descrição
    </text>
    <text x="50" y="228" fontSize="9" fill={COR_TEXTO}>
      Psicologia online para mulheres.
    </text>
    <text x="50" y="242" fontSize="9" fill={COR_TEXTO}>
      Atendimento por videochamada.
    </text>
    <rect
      x="40"
      y="270"
      width="160"
      height="34"
      rx="8"
      fill="#fff"
      stroke={COR_LINHA}
      strokeWidth="1.5"
    />
    <text x="50" y="285" fontSize="8" fill={COR_TEXTO_SUAVE}>
      Horário de atendimento
    </text>
    <text x="50" y="298" fontSize="10" fill={COR_TEXTO}>
      Seg a Sex, 8h às 18h
    </text>
    <circle cx="120" cy="336" r="8" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="120" cy="336" r="14" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-19: mensagem de saudação, conversa com balão de
// boas-vindas automático.
// ─────────────────────────────────────────────────────────────
export const IlustracaoSaudacao: React.FC = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de conversa no WhatsApp Business com balão de saudação automática dando boas-vindas e sinalizando retorno no mesmo dia"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <rect
      x="16"
      y="20"
      width="208"
      height="34"
      rx="12"
      fill="#fff"
      stroke={COR_LINHA}
      strokeWidth="1.5"
    />
    <circle cx="34" cy="37" r="11" fill="#ede9fe" />
    <text x="52" y="34" fontSize="9" fontWeight="600" fill={COR_TEXTO}>
      Marina Alves | Psicóloga
    </text>
    <text x="52" y="46" fontSize="8" fill="#22c55e">
      online
    </text>
    <rect
      x="16"
      y="70"
      width="150"
      height="52"
      rx="12"
      fill="#f5f3ff"
      stroke={COR_ROXO}
      strokeWidth="1.2"
    />
    <text x="26" y="90" fontSize="9" fill={COR_TEXTO}>
      Olá! Obrigada pelo seu
    </text>
    <text x="26" y="103" fontSize="9" fill={COR_TEXTO}>
      contato 💜 Recebo novas
    </text>
    <text x="26" y="116" fontSize="9" fill={COR_TEXTO}>
      pacientes neste mês.
    </text>
    <rect x="74" y="136" width="150" height="34" rx="12" fill="#faede4" />
    <text x="84" y="150" fontSize="9" fill={COR_TEXTO}>
      Oi! Gostaria de saber
    </text>
    <text x="84" y="163" fontSize="9" fill={COR_TEXTO}>
      como funciona.
    </text>
    <rect
      x="16"
      y="184"
      width="150"
      height="34"
      rx="12"
      fill="#f5f3ff"
      stroke={COR_ROXO}
      strokeWidth="1.2"
    />
    <text x="26" y="198" fontSize="9" fill={COR_TEXTO}>
      Me conta um pouco do
    </text>
    <text x="26" y="211" fontSize="9" fill={COR_TEXTO}>
      que você está buscando?
    </text>
    <text x="120" y="250" fontSize="9" fill={COR_TEXTO_SUAVE} textAnchor="middle">
      mensagem automática
    </text>
    <circle cx="120" cy="300" r="8" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="120" cy="300" r="14" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-20: respostas rápidas, teclado com atalho "/agenda".
// ─────────────────────────────────────────────────────────────
export const IlustracaoRespostasRapidas: React.FC = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de conversa no WhatsApp Business com teclado exibindo o atalho de resposta rápida barra agenda para enviar a mensagem de agendamento"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <rect
      x="16"
      y="60"
      width="150"
      height="44"
      rx="12"
      fill="#f5f3ff"
      stroke={COR_ROXO}
      strokeWidth="1.2"
    />
    <text x="26" y="78" fontSize="9" fill={COR_TEXTO}>
      Ótimo! Meus horários livres
    </text>
    <text x="26" y="91" fontSize="9" fill={COR_TEXTO}>
      nesta semana são ter e qui, 10h.
    </text>
    <rect
      x="16"
      y="240"
      width="208"
      height="120"
      rx="14"
      fill="#fff"
      stroke={COR_LINHA}
      strokeWidth="1.5"
    />
    <rect x="26" y="252" width="188" height="30" rx="8" fill="#f1f5f9" />
    <text x="34" y="271" fontSize="10" fontFamily="monospace" fill={COR_ROXO}>
      /agenda
    </text>
    <circle cx="206" cy="267" r="4" fill={COR_LARANJA} />
    {[0, 1].map((l) => (
      <g key={l}>
        {[0, 1, 2].map((c) => (
          <rect
            key={`${l}${c}`}
            x={26 + c * 64}
            y={294 + l * 30}
            width="58"
            height="24"
            rx="5"
            fill="#f8fafc"
            stroke={COR_LINHA}
            strokeWidth="1"
          />
        ))}
      </g>
    ))}
    <text x="120" y="228" fontSize="9" fill={COR_TEXTO_SUAVE} textAnchor="middle">
      digite / e escolha a resposta
    </text>
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-21: etiquetas, lista de conversas com etiquetas coloridas.
// ─────────────────────────────────────────────────────────────
export const IlustracaoEtiquetas: React.FC = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração da lista de conversas do WhatsApp Business com etiquetas coloridas de nova paciente, agendada e aguardando retorno"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <text x="20" y="44" fontSize="12" fontWeight="700" fill={COR_TEXTO}>
      Conversas
    </text>
    {[
      { nome: 'Paciente A', etiqueta: 'Nova paciente', cor: '#c4b5fd' },
      { nome: 'Paciente B', etiqueta: 'Agendada', cor: '#fdba74' },
      { nome: 'Paciente C', etiqueta: 'Aguardando retorno', cor: '#a7f3d0' },
    ].map((row, i) => (
      <g key={i}>
        <rect
          x="16"
          y={64 + i * 66}
          width="208"
          height="54"
          rx="12"
          fill="#fff"
          stroke={COR_LINHA}
          strokeWidth="1.2"
        />
        <circle cx="38" cy={91 + i * 66} r="14" fill="#ede9fe" />
        <text x="60" y={86 + i * 66} fontSize="10" fontWeight="600" fill={COR_TEXTO}>
          {row.nome}
        </text>
        <rect x="60" y={92 + i * 66} width="90" height="15" rx="7.5" fill={row.cor} opacity="0.8" />
        <text x="66" y={103 + i * 66} fontSize="7.5" fill={COR_TEXTO}>
          {row.etiqueta}
        </text>
      </g>
    ))}
    <text x="120" y="290" fontSize="9" fill={COR_TEXTO_SUAVE} textAnchor="middle">
      toque e segure a conversa
    </text>
    <text x="120" y="304" fontSize="9" fill={COR_TEXTO_SUAVE} textAnchor="middle">
      para etiquetar
    </text>
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-22: cronômetro de 5 segundos do teste da vitrine.
// ─────────────────────────────────────────────────────────────
export const IlustracaoTimer: React.FC = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de um cronômetro com o número cinco marcando os cinco segundos do teste da vitrine"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <circle cx="120" cy="190" r="70" fill="#ede9fe" />
    <circle cx="120" cy="190" r="56" fill="#fff" stroke={COR_ROXO} strokeWidth="3" />
    <path
      d="M 120 134 a 56 56 0 0 1 48.5 28"
      fill="none"
      stroke={COR_LARANJA}
      strokeWidth="5"
      strokeLinecap="round"
    />
    <rect x="112" y="106" width="16" height="10" rx="3" fill={COR_ROXO} />
    <path d="M 114 106 h 12" stroke={COR_ROXO} strokeWidth="4" strokeLinecap="round" />
    <text
      x="120"
      y="202"
      fontSize="34"
      fontWeight="700"
      fill={COR_ROXO}
      textAnchor="middle"
      fontFamily="Georgia, serif"
    >
      5
    </text>
    <text x="120" y="292" fontSize="10" fill={COR_TEXTO_SUAVE} textAnchor="middle">
      cinco segundos
    </text>
    <text x="120" y="306" fontSize="10" fill={COR_TEXTO_SUAVE} textAnchor="middle">
      no seu perfil
    </text>
  </svg>
)
