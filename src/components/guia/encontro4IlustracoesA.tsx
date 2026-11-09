import React from 'react'

// ─────────────────────────────────────────────────────────────
// Ilustrações I-00 a I-11 do Encontro 4. SVG inline, sem
// imagens externas, sem logotipos oficiais (apenas ícones
// genéricos: câmera para Instagram, página com bandeira para
// Facebook, balão de conversa com maleta para WhatsApp
// Business). Perfil fictício: Marina Alves | Psicóloga Online,
// @marinaalves.psi, CRP 06/000000.
// ─────────────────────────────────────────────────────────────

const COR_ROXO = '#7c3aed'
const COR_LARANJA = '#ea580c'
const COR_LINHA = '#e2e8f0'
const COR_TEXTO = '#334155'
const COR_TEXTO_SUAVE = '#94a3b8'
const COR_FUNDO = '#f8fafc'

interface Props {
  id?: string
}

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
const CameraIcon: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g
    transform={`translate(${x}, ${y}) scale(${s})`}
    stroke={COR_ROXO}
    strokeWidth="1.8"
    fill="none"
  >
    <rect x="-9" y="-7" width="18" height="14" rx="4" />
    <circle cx="0" cy="0" r="3.5" />
    <circle cx="6" cy="-4" r="0.8" fill={COR_ROXO} stroke="none" />
  </g>
)

const FlagIcon: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g
    transform={`translate(${x}, ${y}) scale(${s})`}
    stroke={COR_ROXO}
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
  >
    <path d="M -6 -10 v 20" />
    <path d="M -6 -10 h 12 l -3 4 3 4 h -12" fill="#ede9fe" />
  </g>
)

const WhatsIcon: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g
    transform={`translate(${x}, ${y}) scale(${s})`}
    stroke={COR_ROXO}
    strokeWidth="1.8"
    fill="none"
  >
    <path d="M -11 -8 h 22 a 5 5 0 0 1 5 5 v 9 a 5 5 0 0 1 -5 5 h -12 l -6 5 v -5 h -4 a 5 5 0 0 1 -5 -5 v -9 a 5 5 0 0 1 5 -5 z" />
    <rect x="-5" y="-6" width="10" height="8" rx="1.5" />
    <path d="M -2.5 -6 v -2 a 2 2 0 0 1 2 -2 h 1 a 2 2 0 0 1 2 2 v 2" />
  </g>
)

const Grade: React.FC<{
  x: number
  y: number
  w: number
  cols?: number
  linhas?: number
  startY?: number
}> = ({ x, y, w, cols = 3, linhas = 3 }) => {
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
// I-00: celular com o Manifesto na tela
// ─────────────────────────────────────────────────────────────
export const IlustracaoCelularManifesto: React.FC<Props> = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de um celular mostrando na tela o texto do Manifesto da Marca, pronto para a IA ler"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <rect
      x="70"
      y="30"
      width="100"
      height="360"
      rx="18"
      fill="#fff"
      stroke={COR_ROXO}
      strokeWidth="2"
    />
    <rect x="104" y="38" width="32" height="5" rx="2.5" fill="#e9d5ff" />
    <text x="120" y="70" textAnchor="middle" fontSize="11" fontWeight="700" fill={COR_TEXTO}>
      Meu Manifesto
    </text>
    <line x1="86" y1="82" x2="154" y2="82" stroke={COR_LINHA} strokeWidth="1" />
    {[94, 106, 118, 130, 142, 154, 166, 178].map((y, i) => (
      <rect key={y} x="86" y={y} width={i % 3 === 2 ? 48 : 68} height="6" rx="3" fill="#ddd6fe" />
    ))}
    <rect x="86" y="200" width="68" height="20" rx="10" fill={COR_ROXO} />
    <text x="120" y="213" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="monospace">
      copiar
    </text>
    <circle cx="120" cy="240" r="6" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="120" cy="240" r="11" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-01: três assistentes de IA
// ─────────────────────────────────────────────────────────────
export const IlustracaoTresAssistentes: React.FC<Props> = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de três cartões de assistentes de IA: Bio do Manifesto, Arquiteta da Vitrine e Roteirista do WhatsApp"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    {[
      { x: 20, cor: '#7c3aed', nome: 'Bio do' },
      { x: 86, cor: '#8b5cf6', nome: 'Arquiteta' },
      { x: 152, cor: '#a78bfa', nome: 'Roteirista' },
    ].map((c) => (
      <g key={c.nome}>
        <rect
          x={c.x}
          y="140"
          width="68"
          height="100"
          rx="12"
          fill="#fff"
          stroke={c.cor}
          strokeWidth="2"
        />
        <circle cx={c.x + 34} cy="170" r="12" fill={c.cor} />
        <text x={c.x + 34} y="174" fontSize="10" fill="#fff" textAnchor="middle" fontWeight="700">
          AI
        </text>
        <rect x={c.x + 12} y="196" width="44" height="6" rx="3" fill="#ddd6fe" />
        <rect x={c.x + 12} y="208" width="32" height="6" rx="3" fill="#ede9fe" />
        <text x={c.x + 34} y="230" textAnchor="middle" fontSize="8" fill={COR_TEXTO}>
          {c.nome}
        </text>
      </g>
    ))}
    <text x="120" y="110" textAnchor="middle" fontSize="11" fontWeight="700" fill={COR_TEXTO}>
      Suas assistentes
    </text>
    <circle cx="120" cy="280" r="6" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="120" cy="280" r="11" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-02: página com bandeira (Facebook genérico)
// ─────────────────────────────────────────────────────────────
export const IlustracaoFacebookPagina: React.FC<Props> = () => (
  <svg
    viewBox="0 0 320 220"
    className="w-full max-w-[420px]"
    role="img"
    aria-label="Dois cartões lado a lado: perfil pessoal com cadeado que administra a Página com vitrine e bandeira que o paciente vê"
  >
    <rect width="320" height="220" rx="20" fill={COR_FUNDO} />

    {/* Cartão 1: Perfil pessoal */}
    <g>
      <rect
        x="20"
        y="30"
        width="118"
        height="150"
        rx="14"
        fill="#ffffff"
        stroke={COR_LINHA}
        strokeWidth="1.5"
      />
      <circle cx="79" cy="62" r="20" fill="#ede9fe" />
      <circle cx="79" cy="56" r="8" fill={COR_ROXO} />
      <path d="M 64 74 q 15 -12 30 0 z" fill={COR_ROXO} />

      {/* Cadeado */}
      <g transform="translate(86, 68)">
        <circle cx="6" cy="6" r="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
        <rect x="2" y="5" width="8" height="6" rx="1.5" fill="#f59e0b" />
        <path d="M 4 5 v -2 a 2 2 0 0 1 4 0 v 2" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
      </g>

      <text x="79" y="100" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={COR_TEXTO}>
        Perfil pessoal
      </text>
      <text x="79" y="118" textAnchor="middle" fontSize="8" fill={COR_TEXTO_SUAVE}>
        quem administra
      </text>
      <text x="79" y="132" textAnchor="middle" fontSize="8" fill={COR_TEXTO_SUAVE}>
        pode ser privado
      </text>
      <rect x="34" y="146" width="90" height="18" rx="9" fill="#f1f5f9" />
      <text x="79" y="158" textAnchor="middle" fontSize="7.5" fill="#64748b" fontWeight="600">
        Uso pessoal
      </text>
    </g>

    {/* Seta do perfil para a página: "administra" */}
    <g>
      <path
        d="M 144 105 L 174 105"
        stroke={COR_LARANJA}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <polygon points="174,101 180,105 174,109" fill={COR_LARANJA} />
      <text
        x="162"
        y="96"
        textAnchor="middle"
        fontSize="8"
        fontFamily="monospace"
        fontWeight="700"
        fill={COR_LARANJA}
      >
        administra
      </text>
    </g>

    {/* Cartão 2: Página profissional */}
    <g>
      <rect
        x="182"
        y="30"
        width="118"
        height="150"
        rx="14"
        fill="#ffffff"
        stroke={COR_ROXO}
        strokeWidth="1.5"
      />
      {/* Vitrine / banner com bandeira */}
      <rect x="182" y="30" width="118" height="34" rx="14" fill="#ede9fe" />
      <rect x="182" y="50" width="118" height="14" fill="#ede9fe" />
      <FlagIcon x={202} y={48} s={0.8} />

      <circle cx="241" cy="74" r="16" fill="#f5f3ff" stroke={COR_ROXO} strokeWidth="1.2" />
      <Avatar cx={241} cy={74} r={14} />

      <text x="241" y="104" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={COR_TEXTO}>
        Página
      </text>
      <text x="241" y="120" textAnchor="middle" fontSize="8" fill={COR_ROXO} fontWeight="600">
        o que o paciente vê
      </text>
      <text x="241" y="134" textAnchor="middle" fontSize="7.5" fill={COR_TEXTO_SUAVE}>
        vitrine profissional
      </text>
      <rect x="194" y="146" width="94" height="20" rx="10" fill={COR_ROXO} />
      <text x="241" y="159" textAnchor="middle" fontSize="7.5" fill="#fff" fontWeight="600">
        Pública para todos
      </text>
    </g>

    {/* Ponto de toque sutil */}
    <circle cx="282" cy="156" r="4.5" fill={COR_LARANJA} opacity="0.9" />
    <circle cx="282" cy="156" r="9" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-03: criar Página pelo computador
// ─────────────────────────────────────────────────────────────
export const IlustracaoCriarPaginaPC: React.FC<Props> = () => (
  <svg
    viewBox="0 0 320 220"
    className="w-full max-w-[420px]"
    role="img"
    aria-label="Tela de computador com o formulário de criação de Página preenchido com nome Marina Alves | Psicóloga Online, categoria Psicólogo, bio de duas linhas e botão Criar Página com ponto de toque"
  >
    <rect width="320" height="220" rx="20" fill={COR_FUNDO} />

    {/* Monitor / Moldura de computador */}
    <rect
      x="24"
      y="20"
      width="272"
      height="164"
      rx="12"
      fill="#ffffff"
      stroke="#334155"
      strokeWidth="3"
    />
    {/* Barra de título do navegador */}
    <rect x="25.5" y="21.5" width="269" height="18" rx="10" fill="#f1f5f9" />
    <rect x="25.5" y="32" width="269" height="8" fill="#f1f5f9" />
    <circle cx="36" cy="30" r="3" fill="#f87171" />
    <circle cx="45" cy="30" r="3" fill="#fbbf24" />
    <circle cx="54" cy="30" r="3" fill="#34d399" />
    <text x="160" y="33" textAnchor="middle" fontSize="7.5" fill="#64748b" fontFamily="monospace">
      facebook.com/pages/create
    </text>

    {/* Base do monitor */}
    <rect x="136" y="184" width="48" height="14" fill="#cbd5e1" />
    <rect x="110" y="198" width="100" height="8" rx="4" fill="#94a3b8" />

    {/* Formulário interno */}
    <text x="42" y="56" fontSize="10" fontWeight="700" fill={COR_TEXTO}>
      Criar uma Página
    </text>

    {/* Campo: Nome da Página */}
    <text x="42" y="72" fontSize="7.5" fontWeight="600" fill={COR_TEXTO}>
      Nome da Página (obrigatório)
    </text>
    <rect
      x="42"
      y="76"
      width="236"
      height="18"
      rx="4"
      fill="#f8fafc"
      stroke={COR_ROXO}
      strokeWidth="1.2"
    />
    <text x="48" y="88" fontSize="8" fill={COR_TEXTO}>
      Marina Alves | Psicóloga Online
    </text>

    {/* Campo: Categoria */}
    <text x="42" y="104" fontSize="7.5" fontWeight="600" fill={COR_TEXTO}>
      Categoria (obrigatório)
    </text>
    <rect
      x="42"
      y="108"
      width="236"
      height="18"
      rx="4"
      fill="#f8fafc"
      stroke={COR_LINHA}
      strokeWidth="1"
    />
    <rect x="46" y="111" width="58" height="12" rx="3" fill="#ede9fe" />
    <text x="50" y="120" fontSize="7.5" fill={COR_ROXO} fontWeight="600">
      Psicólogo ×
    </text>

    {/* Campo: Bio (duas linhas) */}
    <text x="42" y="136" fontSize="7.5" fontWeight="600" fill={COR_TEXTO}>
      Bio (opcional)
    </text>
    <rect
      x="42"
      y="140"
      width="150"
      height="24"
      rx="4"
      fill="#f8fafc"
      stroke={COR_LINHA}
      strokeWidth="1"
    />
    <text x="46" y="149" fontSize="6.5" fill={COR_TEXTO_SUAVE}>
      Psicologia clínica online para mulheres.
    </text>
    <text x="46" y="158" fontSize="6.5" fill={COR_TEXTO_SUAVE}>
      Acolhimento e autoria. CRP 06/000000.
    </text>

    {/* Botão: Criar Página com ponto de toque */}
    <rect x="204" y="142" width="74" height="22" rx="6" fill={COR_ROXO} />
    <text x="241" y="156" textAnchor="middle" fontSize="8" fontWeight="600" fill="#ffffff">
      Criar Página
    </text>
    <circle cx="264" cy="153" r="5" fill={COR_LARANJA} opacity="0.9" />
    <circle cx="264" cy="153" r="10" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-04: botão de WhatsApp na Página
// ─────────────────────────────────────────────────────────────
export const IlustracaoBotaoWhatsappPagina: React.FC<Props> = () => (
  <svg
    viewBox="0 0 320 220"
    className="w-full max-w-[420px]"
    role="img"
    aria-label="Página da Marina aberta num celular com foto, capa, Atendimento online e botão Enviar mensagem pelo WhatsApp com ponto de toque, ao lado de lista de opções de botão com WhatsApp selecionado e campo de número"
  >
    <rect width="320" height="220" rx="20" fill={COR_FUNDO} />

    {/* Tela 1: Página aberta no celular */}
    <g>
      <rect
        x="18"
        y="16"
        width="132"
        height="188"
        rx="16"
        fill="#ffffff"
        stroke="#334155"
        strokeWidth="2.5"
      />
      {/* Capa com frase de posicionamento */}
      <rect x="19.5" y="17.5" width="129" height="42" rx="14" fill="#ede9fe" />
      <text x="84" y="36" textAnchor="middle" fontSize="6" fill={COR_ROXO} fontWeight="600">
        Psicologia com autoria
      </text>
      <text x="84" y="46" textAnchor="middle" fontSize="5.5" fill="#6d28d9">
        para a sua vida
      </text>

      {/* Foto de perfil */}
      <circle cx="48" cy="62" r="14" fill="#ffffff" stroke="#ede9fe" strokeWidth="2" />
      <Avatar cx="48" cy="62" r="12" />

      {/* Nome e subtítulo */}
      <text x="68" y="60" fontSize="8" fontWeight="700" fill={COR_TEXTO}>
        Marina Alves
      </text>
      <text x="68" y="70" fontSize="6.5" fill={COR_TEXTO_SUAVE}>
        Psicóloga
      </text>

      {/* Informação: Atendimento online */}
      <rect x="28" y="80" width="88" height="14" rx="4" fill="#f1f5f9" />
      <circle cx="34" cy="87" r="2.5" fill="#22c55e" />
      <text x="40" y="90.5" fontSize="6.5" fill="#334155" fontWeight="500">
        Atendimento online
      </text>

      {/* Botão WhatsApp em destaque */}
      <rect x="26" y="104" width="116" height="26" rx="7" fill="#22c55e" />
      <text x="84" y="120" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#ffffff">
        Enviar mensagem pelo WhatsApp
      </text>

      {/* Ponto de toque laranja pulsante no botão */}
      <circle cx="124" cy="117" r="5" fill={COR_LARANJA} opacity="0.9" />
      <circle cx="124" cy="117" r="10" fill={COR_LARANJA} opacity="0.25" />

      {/* Mini feed de publicações da Página */}
      <rect x="26" y="140" width="116" height="50" rx="6" fill="#f8fafc" stroke={COR_LINHA} />
      <text x="32" y="152" fontSize="6" fill={COR_TEXTO_SUAVE}>
        Publicações profissionais
      </text>
    </g>

    {/* Seta ligando as duas telas */}
    <g>
      <path
        d="M 154 100 L 166 100"
        stroke={COR_LARANJA}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <polygon points="166,97 172,100 166,103" fill={COR_LARANJA} />
    </g>

    {/* Tela 2: Lista de opções de botão com WhatsApp selecionado */}
    <g>
      <rect
        x="170"
        y="16"
        width="132"
        height="188"
        rx="16"
        fill="#ffffff"
        stroke="#334155"
        strokeWidth="2.5"
      />
      <text x="236" y="34" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={COR_TEXTO}>
        Escolher botão de ação
      </text>

      {/* Opção: Enviar mensagem */}
      <rect x="178" y="44" width="116" height="20" rx="5" fill="#f8fafc" stroke={COR_LINHA} />
      <text x="186" y="57" fontSize="7" fill={COR_TEXTO_SUAVE}>
        Enviar mensagem
      </text>

      {/* Opção: WhatsApp (selecionada) */}
      <rect
        x="178"
        y="68"
        width="116"
        height="24"
        rx="5"
        fill="#f0fdf4"
        stroke="#22c55e"
        strokeWidth="1.5"
      />
      <circle cx="188" cy="80" r="5" fill="#22c55e" />
      <path
        d="M 186 80 l 1.5 1.5 l 3 -3"
        stroke="#fff"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <text x="198" y="83" fontSize="7.5" fontWeight="700" fill="#15803d">
        WhatsApp
      </text>

      {/* Opção: Ligar agora */}
      <rect x="178" y="96" width="116" height="20" rx="5" fill="#f8fafc" stroke={COR_LINHA} />
      <text x="186" y="109" fontSize="7" fill={COR_TEXTO_SUAVE}>
        Ligar agora
      </text>

      {/* Campo de número */}
      <text x="178" y="132" fontSize="6.5" fontWeight="600" fill={COR_TEXTO}>
        Número do WhatsApp:
      </text>
      <rect
        x="178"
        y="136"
        width="116"
        height="20"
        rx="4"
        fill="#f8fafc"
        stroke={COR_ROXO}
        strokeWidth="1.2"
      />
      <text x="184" y="149" fontSize="7" fill={COR_TEXTO} fontFamily="monospace">
        +55 11 99999-9999
      </text>

      {/* Botão Salvar com ponto de toque */}
      <rect x="178" y="164" width="116" height="22" rx="5" fill={COR_ROXO} />
      <text x="236" y="178" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#ffffff">
        Salvar
      </text>
      <circle cx="270" cy="175" r="4.5" fill={COR_LARANJA} opacity="0.9" />
      <circle cx="270" cy="175" r="9" fill={COR_LARANJA} opacity="0.25" />
    </g>
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-05: conversa chegando pelo botão
// ─────────────────────────────────────────────────────────────
export const IlustracaoConversaChegando: React.FC<Props> = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de um celular com o WhatsApp aberto recebendo a primeira mensagem de uma paciente"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <rect
      x="40"
      y="60"
      width="160"
      height="230"
      rx="16"
      fill="#ecfdf5"
      stroke="#bbf7d0"
      strokeWidth="1.5"
    />
    <rect x="40" y="60" width="160" height="34" rx="16" fill="#d1fae5" />
    <rect x="40" y="80" width="160" height="14" fill="#d1fae5" />
    <circle cx="56" cy="77" r="10" fill="#ede9fe" />
    <text x="72" y="74" fontSize="8" fontWeight="600" fill={COR_TEXTO}>
      Marina Alves
    </text>
    <text x="72" y="85" fontSize="7" fill="#22c55e">
      online
    </text>
    <rect x="52" y="110" width="120" height="34" rx="10" fill="#fff" />
    <text x="60" y="124" fontSize="8" fill={COR_TEXTO}>
      Oi, vi sua página!
    </text>
    <text x="60" y="136" fontSize="8" fill={COR_TEXTO}>
      Como funciona?
    </text>
    <rect x="76" y="156" width="112" height="34" rx="10" fill="#d9fdd3" />
    <text x="84" y="170" fontSize="8" fill={COR_TEXTO}>
      Olá! Que alegria
    </text>
    <text x="84" y="182" fontSize="8" fill={COR_TEXTO}>
      receber você.
    </text>
    <text x="120" y="312" textAnchor="middle" fontSize="9" fill={COR_TEXTO_SUAVE}>
      Primeira mensagem
    </text>
    <circle cx="120" cy="340" r="6" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="120" cy="340" r="11" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-06: menu do Instagram com Tipo de conta
// ─────────────────────────────────────────────────────────────
export const IlustracaoMenuContaProfissional: React.FC<Props> = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de um celular com o menu do Instagram aberto, destacando a opção Tipo de conta e ferramentas"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <Avatar cx={70} cy={80} r={20} />
    <text x="98" y="76" fontSize="10" fontWeight="700" fill={COR_TEXTO}>
      Marina Alves
    </text>
    <text x="98" y="90" fontSize="8" fill={COR_TEXTO_SUAVE}>
      @marinaalves.psi
    </text>
    {['Configurações', 'Tipo de conta e ferramentas', 'Sua atividade', 'Salvar'].map((rot, i) => (
      <g key={rot}>
        <rect
          x="30"
          y={130 + i * 44}
          width="180"
          height="34"
          rx="9"
          fill={i === 1 ? '#f5f3ff' : '#fff'}
          stroke={i === 1 ? COR_ROXO : COR_LINHA}
          strokeWidth={i === 1 ? 2 : 1.5}
        />
        <text x={42} y={151 + i * 44} fontSize="9" fill={i === 1 ? COR_ROXO : '#64748b'}>
          {rot}
        </text>
      </g>
    ))}
    <circle cx="120" cy="330" r="6" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="120" cy="330" r="11" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-07: escolha Criador ou Comercial
// ─────────────────────────────────────────────────────────────
export const IlustracaoMudarParaProfissional: React.FC<Props> = () => (
  <svg
    viewBox="0 0 340 220"
    className="w-full max-w-[440px]"
    role="img"
    aria-label="Três telas de celular em sequência: perfil com ícone ☰ tocado; menu aberto com Tipo de conta e ferramentas destacado; cartões Criador de conteúdo com selo Recomendado e Comercial acima da busca com Psicólogo"
  >
    <rect width="340" height="220" rx="20" fill={COR_FUNDO} />

    {/* Tela 1: Perfil com ☰ tocado */}
    <g>
      <rect
        x="14"
        y="16"
        width="94"
        height="188"
        rx="14"
        fill="#ffffff"
        stroke="#334155"
        strokeWidth="2"
      />
      <text x="24" y="34" fontSize="6.5" fontWeight="700" fill={COR_TEXTO}>
        marinaalves.psi
      </text>
      {/* Ícone ☰ no canto superior direito */}
      <rect x="88" y="26" width="12" height="12" rx="2.5" fill="#ede9fe" />
      <line
        x1="90"
        y1="29"
        x2="98"
        y2="29"
        stroke={COR_ROXO}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="90"
        y1="32"
        x2="98"
        y2="32"
        stroke={COR_ROXO}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="90"
        y1="35"
        x2="98"
        y2="35"
        stroke={COR_ROXO}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Ponto de toque no ☰ */}
      <circle cx="94" cy="32" r="4.5" fill={COR_LARANJA} opacity="0.9" />
      <circle cx="94" cy="32" r="8" fill={COR_LARANJA} opacity="0.25" />

      <Avatar cx="38" cy="56" r="14" />
      <text x="24" y="80" fontSize="6" fontWeight="700" fill={COR_TEXTO}>
        Marina Alves
      </text>
      <text x="24" y="89" fontSize="5" fill={COR_TEXTO_SUAVE}>
        Psicóloga
      </text>
      <rect x="24" y="98" width="74" height="14" rx="4" fill="#f1f5f9" />
      <text x="61" y="107" textAnchor="middle" fontSize="5.5" fill={COR_TEXTO}>
        Editar perfil
      </text>
      {/* Mini grade */}
      <rect x="24" y="120" width="22" height="22" rx="3" fill="#f5f3ff" />
      <rect x="50" y="120" width="22" height="22" rx="3" fill="#ede9fe" />
      <rect x="76" y="120" width="22" height="22" rx="3" fill="#faede4" />
      <text x="61" y="180" textAnchor="middle" fontSize="6" fill={COR_TEXTO_SUAVE}>
        1. Toque em ☰
      </text>
    </g>

    {/* Seta 1 -> 2 */}
    <path
      d="M 112 110 L 118 110"
      stroke={COR_LARANJA}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Tela 2: Menu com Tipo de conta e ferramentas */}
    <g>
      <rect
        x="122"
        y="16"
        width="94"
        height="188"
        rx="14"
        fill="#ffffff"
        stroke="#334155"
        strokeWidth="2"
      />
      <text x="169" y="34" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={COR_TEXTO}>
        Configurações
      </text>
      <rect x="130" y="44" width="78" height="16" rx="4" fill="#f8fafc" stroke={COR_LINHA} />
      <text x="136" y="55" fontSize="5.5" fill={COR_TEXTO_SUAVE}>
        Central de Contas
      </text>

      {/* Item destacado: Tipo de conta e ferramentas */}
      <rect
        x="128"
        y="66"
        width="82"
        height="24"
        rx="5"
        fill="#f5f3ff"
        stroke={COR_ROXO}
        strokeWidth="1.5"
      />
      <text x="133" y="78" fontSize="5" fontWeight="700" fill={COR_ROXO}>
        Tipo de conta
      </text>
      <text x="133" y="86" fontSize="5" fontWeight="700" fill={COR_ROXO}>
        e ferramentas
      </text>
      {/* Ponto de toque */}
      <circle cx="198" cy="78" r="4.5" fill={COR_LARANJA} opacity="0.9" />
      <circle cx="198" cy="78" r="8" fill={COR_LARANJA} opacity="0.25" />

      <rect x="130" y="96" width="78" height="16" rx="4" fill="#f8fafc" stroke={COR_LINHA} />
      <text x="136" y="107" fontSize="5.5" fill={COR_TEXTO_SUAVE}>
        Notificações
      </text>
      <rect x="130" y="118" width="78" height="16" rx="4" fill="#f8fafc" stroke={COR_LINHA} />
      <text x="136" y="129" fontSize="5.5" fill={COR_TEXTO_SUAVE}>
        Privacidade
      </text>
      <text x="169" y="180" textAnchor="middle" fontSize="6" fill={COR_TEXTO_SUAVE}>
        2. Ferramentas
      </text>
    </g>

    {/* Seta 2 -> 3 */}
    <path
      d="M 220 110 L 226 110"
      stroke={COR_LARANJA}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Tela 3: Busca categoria e Escolha Criador / Comercial */}
    <g>
      <rect
        x="230"
        y="16"
        width="96"
        height="188"
        rx="14"
        fill="#ffffff"
        stroke="#334155"
        strokeWidth="2"
      />
      {/* Busca categoria */}
      <rect
        x="238"
        y="28"
        width="80"
        height="16"
        rx="4"
        fill="#f8fafc"
        stroke={COR_ROXO}
        strokeWidth="1"
      />
      <text x="244" y="39" fontSize="5.5" fill={COR_ROXO} fontWeight="600">
        🔍 Psicólogo
      </text>

      {/* Cartão Criador de conteúdo (SELECIONADO + RECOMENDADO) */}
      <rect
        x="238"
        y="52"
        width="80"
        height="54"
        rx="6"
        fill="#f5f3ff"
        stroke={COR_ROXO}
        strokeWidth="1.5"
      />
      <rect x="244" y="56" width="48" height="10" rx="3" fill="#ede9fe" />
      <text x="268" y="63.5" textAnchor="middle" fontSize="4.8" fontWeight="700" fill={COR_ROXO}>
        ★ Recomendado
      </text>
      <text x="244" y="76" fontSize="6.5" fontWeight="700" fill={COR_ROXO}>
        Criador de
      </text>
      <text x="244" y="84" fontSize="6.5" fontWeight="700" fill={COR_ROXO}>
        conteúdo
      </text>
      <circle cx="304" cy="74" r="5" fill="#22c55e" />
      <path
        d="M 302 74 l 1.5 1.5 l 3 -3"
        stroke="#fff"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      {/* Ponto de toque */}
      <circle cx="278" cy="94" r="4.5" fill={COR_LARANJA} opacity="0.9" />
      <circle cx="278" cy="94" r="8" fill={COR_LARANJA} opacity="0.25" />

      {/* Cartão Comercial */}
      <rect
        x="238"
        y="112"
        width="80"
        height="42"
        rx="6"
        fill="#ffffff"
        stroke={COR_LINHA}
        strokeWidth="1"
      />
      <text x="244" y="126" fontSize="6" fontWeight="600" fill="#64748b">
        Comercial
      </text>
      <text x="244" y="136" fontSize="4.5" fill={COR_TEXTO_SUAVE}>
        Para clínicas com equipe
      </text>

      {/* Botão Avançar */}
      <rect x="238" y="160" width="80" height="16" rx="5" fill={COR_ROXO} />
      <text x="278" y="171" textAnchor="middle" fontSize="6" fontWeight="600" fill="#ffffff">
        Avançar
      </text>
      <text x="278" y="188" textAnchor="middle" fontSize="5.5" fill={COR_TEXTO_SUAVE}>
        3. Escolha Criador
      </text>
    </g>
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-08: anatomia do perfil
// ─────────────────────────────────────────────────────────────
export const IlustracaoAnatomiaPerfil: React.FC<Props> = () => (
  <svg
    viewBox="0 0 320 440"
    className="w-full max-w-[400px]"
    role="img"
    aria-label="Perfil completo de Marina Alves num celular grande com nove marcadores numerados de 1 a 9 ligados por linhas finas aos itens: 1 Foto, 2 @usuário, 3 Campo Nome, 4 Categoria, 5 Bio, 6 Links, 7 Destaques, 8 Posts fixados, 9 Grade"
  >
    <rect width="320" height="440" rx="22" fill={COR_FUNDO} />

    {/* Celular central */}
    <rect
      x="50"
      y="18"
      width="220"
      height="404"
      rx="20"
      fill="#ffffff"
      stroke="#334155"
      strokeWidth="2.5"
    />

    {/* Barra de topo */}
    <rect x="130" y="24" width="60" height="4" rx="2" fill="#cbd5e1" />

    {/* 2. @usuario (topo) */}
    <text x="160" y="44" textAnchor="middle" fontSize="10" fontWeight="700" fill={COR_TEXTO}>
      @marinaalves.psi
    </text>
    {/* Marcador 2 */}
    <line
      x1="210"
      y1="41"
      x2="280"
      y2="41"
      stroke={COR_LARANJA}
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <circle cx="292" cy="41" r="9" fill={COR_LARANJA} />
    <text x="292" y="44.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffffff">
      2
    </text>

    {/* 1. Foto */}
    <circle cx="86" cy="74" r="22" fill="#ede9fe" stroke={COR_ROXO} strokeWidth="1.5" />
    <Avatar cx="86" cy="74" r="18" />
    {/* Marcador 1 */}
    <line
      x1="64"
      y1="74"
      x2="26"
      y2="74"
      stroke={COR_LARANJA}
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <circle cx="18" cy="74" r="9" fill={COR_LARANJA} />
    <text x="18" y="77.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffffff">
      1
    </text>

    {/* Contadores ao lado da foto */}
    <text x="140" y="70" textAnchor="middle" fontSize="9" fontWeight="700" fill={COR_TEXTO}>
      128
    </text>
    <text x="140" y="80" textAnchor="middle" fontSize="6.5" fill={COR_TEXTO_SUAVE}>
      posts
    </text>
    <text x="182" y="70" textAnchor="middle" fontSize="9" fontWeight="700" fill={COR_TEXTO}>
      1.420
    </text>
    <text x="182" y="80" textAnchor="middle" fontSize="6.5" fill={COR_TEXTO_SUAVE}>
      seguidores
    </text>
    <text x="224" y="70" textAnchor="middle" fontSize="9" fontWeight="700" fill={COR_TEXTO}>
      340
    </text>
    <text x="224" y="80" textAnchor="middle" fontSize="6.5" fill={COR_TEXTO_SUAVE}>
      seguindo
    </text>

    {/* 3. Campo Nome */}
    <text x="64" y="112" fontSize="9" fontWeight="700" fill={COR_TEXTO}>
      Marina Alves | Psicóloga Online
    </text>
    {/* Marcador 3 */}
    <line
      x1="220"
      y1="109"
      x2="280"
      y2="109"
      stroke={COR_LARANJA}
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <circle cx="292" cy="109" r="9" fill={COR_LARANJA} />
    <text x="292" y="112.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffffff">
      3
    </text>

    {/* 4. Categoria */}
    <rect x="64" y="118" width="52" height="13" rx="3" fill="#ede9fe" />
    <text x="90" y="127" textAnchor="middle" fontSize="7" fontWeight="600" fill={COR_ROXO}>
      Psicólogo
    </text>
    {/* Marcador 4 */}
    <line
      x1="64"
      y1="124"
      x2="26"
      y2="124"
      stroke={COR_LARANJA}
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <circle cx="18" cy="124" r="9" fill={COR_LARANJA} />
    <text x="18" y="127.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffffff">
      4
    </text>

    {/* 5. Bio */}
    <text x="64" y="142" fontSize="7.5" fill={COR_TEXTO}>
      Ajudo mulheres exaustas a voltarem a caber na própria vida
    </text>
    <text x="64" y="153" fontSize="7" fill={COR_TEXTO_SUAVE}>
      Psicóloga · Psicanálise · CRP 06/000000 · Online
    </text>
    <text x="64" y="164" fontSize="7" fontWeight="600" fill={COR_TEXTO}>
      Agende sua conversa inicial 👇
    </text>
    {/* Marcador 5 */}
    <line
      x1="230"
      y1="152"
      x2="280"
      y2="152"
      stroke={COR_LARANJA}
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <circle cx="292" cy="152" r="9" fill={COR_LARANJA} />
    <text x="292" y="155.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffffff">
      5
    </text>

    {/* 6. Links */}
    <rect
      x="64"
      y="172"
      width="138"
      height="18"
      rx="5"
      fill="#f0fdf4"
      stroke="#22c55e"
      strokeWidth="1"
    />
    <text x="72" y="184" fontSize="7.5" fontWeight="600" fill="#15803d">
      🔗 wa.me/5511999999999
    </text>
    {/* Marcador 6 */}
    <line
      x1="64"
      y1="181"
      x2="26"
      y2="181"
      stroke={COR_LARANJA}
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <circle cx="18" cy="181" r="9" fill={COR_LARANJA} />
    <text x="18" y="184.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffffff">
      6
    </text>

    {/* 7. Destaques */}
    <g>
      {['Comece', 'Quem sou', 'Como', 'Dúvidas', 'Bastidores', 'Agendar'].map((nome, i) => (
        <g key={nome}>
          <circle
            cx={76 + i * 28}
            cy="212"
            r="11"
            fill="#f5f3ff"
            stroke={COR_ROXO}
            strokeWidth="1.2"
          />
          <circle cx={76 + i * 28} cy="212" r="5" fill="#c4b5fd" />
          <text x={76 + i * 28} y="230" textAnchor="middle" fontSize="5" fill={COR_TEXTO_SUAVE}>
            {nome}
          </text>
        </g>
      ))}
    </g>
    {/* Marcador 7 */}
    <line
      x1="228"
      y1="214"
      x2="280"
      y2="214"
      stroke={COR_LARANJA}
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <circle cx="292" cy="214" r="9" fill={COR_LARANJA} />
    <text x="292" y="217.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffffff">
      7
    </text>

    {/* 8. Posts fixados (primeira linha da grade) */}
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x={64 + i * 66}
            y="244"
            width="60"
            height="58"
            rx="5"
            fill="#ede9fe"
            stroke={COR_ROXO}
            strokeWidth="1.2"
          />
          {/* Mini alfinete */}
          <circle cx={72 + i * 66} cy="252" r="2.5" fill={COR_LARANJA} />
          <line
            x1={72 + i * 66}
            y1="254"
            x2={72 + i * 66}
            y2="259"
            stroke={COR_LARANJA}
            strokeWidth="1"
          />
        </g>
      ))}
      <text x="94" y="278" textAnchor="middle" fontSize="6.5" fill={COR_ROXO} fontWeight="600">
        Para quem
      </text>
      <text x="160" y="278" textAnchor="middle" fontSize="6.5" fill={COR_ROXO} fontWeight="600">
        Como funciona
      </text>
      <text x="226" y="278" textAnchor="middle" fontSize="6.5" fill={COR_ROXO} fontWeight="600">
        Quem sou
      </text>
    </g>
    {/* Marcador 8 */}
    <line
      x1="64"
      y1="272"
      x2="26"
      y2="272"
      stroke={COR_LARANJA}
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <circle cx="18" cy="272" r="9" fill={COR_LARANJA} />
    <text x="18" y="275.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffffff">
      8
    </text>

    {/* 9. Grade (linhas seguintes) */}
    <g>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={64 + i * 66}
          y="310"
          width="60"
          height="54"
          rx="5"
          fill="#f8fafc"
          stroke={COR_LINHA}
          strokeWidth="1"
        />
      ))}
      {[0, 1, 2].map((i) => (
        <rect
          key={`b-${i}`}
          x={64 + i * 66}
          y="370"
          width="60"
          height="40"
          rx="5"
          fill="#f8fafc"
          stroke={COR_LINHA}
          strokeWidth="1"
        />
      ))}
    </g>
    {/* Marcador 9 */}
    <line
      x1="228"
      y1="337"
      x2="280"
      y2="337"
      stroke={COR_LARANJA}
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <circle cx="292" cy="337" r="9" fill={COR_LARANJA} />
    <text x="292" y="340.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffffff">
      9
    </text>
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-09: foto e campo Nome
// ─────────────────────────────────────────────────────────────
export const IlustracaoFotoENome: React.FC<Props> = () => (
  <svg
    viewBox="0 0 320 240"
    className="w-full max-w-[440px]"
    role="img"
    aria-label="Comparativo em três linhas: foto com logo distante contra rosto visível; @marina_alves.psi.2019 contra @marinaalves.psi; nome com flor contra Marina Alves | Psicóloga Online. Coluna Evite em cinza com X, coluna Prefira em roxo com check"
  >
    <rect width="320" height="240" rx="20" fill={COR_FUNDO} />

    {/* Cabeçalhos das colunas */}
    <g>
      <circle cx="58" cy="34" r="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
      <path
        d="M 54 30 l 8 8 M 62 30 l -8 8"
        stroke="#64748b"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text x="58" y="56" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">
        Evite
      </text>
    </g>
    <g>
      <circle cx="240" cy="34" r="10" fill="#f5f3ff" stroke={COR_ROXO} strokeWidth="1.5" />
      <path
        d="M 235 34 l 4 4 l 7 -8"
        stroke={COR_ROXO}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="240" y="56" textAnchor="middle" fontSize="9" fontWeight="700" fill={COR_ROXO}>
        Prefira
      </text>
    </g>

    {/* Linha 1: Foto */}
    <rect x="16" y="66" width="288" height="46" rx="10" fill="#ffffff" stroke={COR_LINHA} />
    <text x="24" y="78" fontSize="6.5" fontWeight="700" fill={COR_TEXTO_SUAVE}>
      FOTO
    </text>
    {/* Evite: logo pequeno e distante */}
    <circle cx="58" cy="94" r="15" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
    <rect x="52" y="89" width="12" height="10" rx="2" fill="#cbd5e1" />
    <text x="82" y="97" fontSize="7.5" fill="#64748b">
      Logo distante
    </text>
    {/* Prefira: rosto visível ocupando boa parte do círculo */}
    <circle cx="210" cy="92" r="16" fill="#ede9fe" stroke={COR_ROXO} strokeWidth="1.5" />
    <circle cx="210" cy="87" r="7" fill={COR_ROXO} />
    <path d="M 199 101 q 11 -8 22 0 z" fill={COR_ROXO} />
    <text x="234" y="95" fontSize="7.5" fontWeight="600" fill={COR_ROXO}>
      Rosto visível
    </text>

    {/* Linha 2: @usuário */}
    <rect x="16" y="118" width="288" height="46" rx="10" fill="#ffffff" stroke={COR_LINHA} />
    <text x="24" y="130" fontSize="6.5" fontWeight="700" fill={COR_TEXTO_SUAVE}>
      @USUÁRIO
    </text>
    {/* Evite: @ com pontos e ano */}
    <text x="58" y="148" textAnchor="middle" fontSize="7.5" fill="#64748b" fontFamily="monospace">
      @marina_alves.psi.2019
    </text>
    {/* Prefira: @ limpo */}
    <text
      x="240"
      y="148"
      textAnchor="middle"
      fontSize="8"
      fontWeight="700"
      fill={COR_ROXO}
      fontFamily="monospace"
    >
      @marinaalves.psi
    </text>

    {/* Linha 3: Campo Nome */}
    <rect x="16" y="170" width="288" height="54" rx="10" fill="#ffffff" stroke={COR_LINHA} />
    <text x="24" y="182" fontSize="6.5" fontWeight="700" fill={COR_TEXTO_SUAVE}>
      CAMPO NOME
    </text>
    {/* Evite: só primeiro nome com flor */}
    <text x="58" y="202" textAnchor="middle" fontSize="8" fill="#64748b">
      Marina 🌸
    </text>
    {/* Prefira: nome + nicho */}
    <text x="240" y="202" textAnchor="middle" fontSize="8" fontWeight="700" fill={COR_ROXO}>
      Marina Alves | Psicóloga Online
    </text>
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-10: a bio
// ─────────────────────────────────────────────────────────────
export const IlustracaoBio: React.FC<Props> = () => (
  <svg
    viewBox="0 0 320 200"
    className="w-full max-w-[440px]"
    role="img"
    aria-label="Bio da Marina ampliada em três linhas com rótulos ao lado: Para quem e transformação, Autoridade, Convite, e no canto um contador 128/150"
  >
    <rect width="320" height="200" rx="18" fill={COR_FUNDO} />

    {/* Cartão de edição de bio */}
    <rect
      x="18"
      y="16"
      width="284"
      height="168"
      rx="14"
      fill="#ffffff"
      stroke={COR_ROXO}
      strokeWidth="1.5"
    />

    {/* Topo do cartão */}
    <text x="32" y="36" fontSize="10" fontWeight="700" fill={COR_TEXTO}>
      Bio
    </text>
    {/* Contador no canto */}
    <rect x="242" y="24" width="48" height="16" rx="4" fill="#ede9fe" />
    <text
      x="266"
      y="35.5"
      textAnchor="middle"
      fontSize="7.5"
      fontWeight="700"
      fill={COR_ROXO}
      fontFamily="monospace"
    >
      128/150
    </text>

    {/* Linha 1 */}
    <rect x="30" y="50" width="260" height="34" rx="6" fill="#f8fafc" stroke={COR_LINHA} />
    <text x="38" y="65" fontSize="7.5" fontWeight="600" fill={COR_TEXTO}>
      Ajudo mulheres exaustas a voltarem a caber na própria vida
    </text>
    <rect x="38" y="70" width="118" height="10" rx="2" fill="#fef3c7" />
    <text x="97" y="77.5" textAnchor="middle" fontSize="6" fontWeight="700" fill="#b45309">
      Linha 1 · Para quem e transformação
    </text>

    {/* Linha 2 */}
    <rect x="30" y="90" width="260" height="34" rx="6" fill="#f8fafc" stroke={COR_LINHA} />
    <text x="38" y="105" fontSize="7.5" fill={COR_TEXTO}>
      Psicóloga · Psicanálise · CRP 06/000000 · Online
    </text>
    <rect x="38" y="110" width="70" height="10" rx="2" fill="#ede9fe" />
    <text x="73" y="117.5" textAnchor="middle" fontSize="6" fontWeight="700" fill={COR_ROXO}>
      Linha 2 · Autoridade
    </text>

    {/* Linha 3 */}
    <rect x="30" y="130" width="260" height="34" rx="6" fill="#f8fafc" stroke={COR_LINHA} />
    <text x="38" y="145" fontSize="7.5" fontWeight="600" fill={COR_TEXTO}>
      Agende sua conversa inicial 👇
    </text>
    <rect x="38" y="150" width="60" height="10" rx="2" fill="#f0fdf4" />
    <text x="68" y="157.5" textAnchor="middle" fontSize="6" fontWeight="700" fill="#15803d">
      Linha 3 · Convite
    </text>

    {/* Ponto de toque no botão concluir */}
    <circle cx="280" cy="170" r="4.5" fill={COR_LARANJA} opacity="0.9" />
    <circle cx="280" cy="170" r="9" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-11: link para o WhatsApp
// ─────────────────────────────────────────────────────────────
export const IlustracaoLinkWhatsapp: React.FC<Props> = () => (
  <svg
    viewBox="0 0 320 220"
    className="w-full max-w-[420px]"
    role="img"
    aria-label="Tela Adicionar link externo com o campo URL preenchido com wa.me/5511999999999 e o campo Título com Agende sua conversa inicial"
  >
    <rect width="320" height="220" rx="18" fill={COR_FUNDO} />

    {/* Celular estilizado / modal */}
    <rect
      x="36"
      y="16"
      width="248"
      height="188"
      rx="14"
      fill="#ffffff"
      stroke="#334155"
      strokeWidth="2.5"
    />

    <text x="160" y="38" textAnchor="middle" fontSize="10" fontWeight="700" fill={COR_TEXTO}>
      Adicionar link externo
    </text>

    {/* Campo URL */}
    <text x="52" y="60" fontSize="7.5" fontWeight="600" fill={COR_TEXTO}>
      URL
    </text>
    <rect
      x="52"
      y="64"
      width="216"
      height="26"
      rx="6"
      fill="#f8fafc"
      stroke={COR_ROXO}
      strokeWidth="1.5"
    />
    <circle cx="64" cy="77" r="5" fill="#22c55e" />
    <text x="74" y="80.5" fontSize="8" fontWeight="600" fill={COR_ROXO} fontFamily="monospace">
      https://wa.me/5511999999999
    </text>

    {/* Campo Título */}
    <text x="52" y="106" fontSize="7.5" fontWeight="600" fill={COR_TEXTO}>
      Título
    </text>
    <rect
      x="52"
      y="110"
      width="216"
      height="26"
      rx="6"
      fill="#f8fafc"
      stroke={COR_LINHA}
      strokeWidth="1.2"
    />
    <text x="62" y="126.5" fontSize="8" fill={COR_TEXTO}>
      Agende sua conversa inicial
    </text>

    {/* Botão Concluir com ponto de toque */}
    <rect x="52" y="152" width="216" height="26" rx="8" fill={COR_ROXO} />
    <text x="160" y="168.5" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#ffffff">
      Concluir
    </text>
    <circle cx="240" cy="165" r="5" fill={COR_LARANJA} opacity="0.9" />
    <circle cx="240" cy="165" r="10" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)
