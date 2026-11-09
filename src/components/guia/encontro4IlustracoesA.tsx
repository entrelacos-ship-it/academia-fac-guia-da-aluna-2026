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

const Avatar: React.FC<{ cx?: number; cy?: number; r?: number }> = ({
  cx = 36,
  cy = 36,
  r = 20,
}) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill="#ede9fe" />
    <circle cx={cx} cy={cy - r * 0.35} r={r * 0.38} fill={COR_ROXO} />
    <path
      d={`M ${cx - r * 0.62} ${cy + r * 0.55} q ${r * 0.62} ${-r * 0.5} ${r * 1.24} 0 z`}
      fill={COR_ROXO}
    />
  </g>
)

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
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de um celular com uma página profissional: cartão com foto, nome Marina Alves | Psicóloga Online e botão de WhatsApp"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <rect
      x="40"
      y="50"
      width="160"
      height="200"
      rx="16"
      fill="#fff"
      stroke={COR_LINHA}
      strokeWidth="1.5"
    />
    <rect x="40" y="50" width="160" height="50" rx="16" fill="#ddd6fe" />
    <rect x="40" y="80" width="160" height="20" fill="#ddd6fe" />
    <rect x="52" y="58" width="22" height="16" fill="#8b5cf6" opacity="0.6" />
    <path d="M 74 58 v 16 h -22 z" fill="#fff" opacity="0.9" />
    <Avatar cx={68} cy={130} r={22} />
    <text x="98" y="122" fontSize="11" fontWeight="700" fill={COR_TEXTO}>
      Marina Alves
    </text>
    <text x="98" y="137" fontSize="9" fill={COR_TEXTO_SUAVE}>
      Psicóloga Online
    </text>
    <rect x="56" y="170" width="70" height="22" rx="11" fill={COR_ROXO} />
    <text x="91" y="184" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="monospace">
      WhatsApp
    </text>
    <rect x="132" y="170" width="54" height="22" rx="11" fill="#fff" stroke="#c4b5fd" />
    <text x="159" y="184" textAnchor="middle" fontSize="8" fill={COR_ROXO} fontFamily="monospace">
      Mensagem
    </text>
    <text x="120" y="290" textAnchor="middle" fontSize="10" fill={COR_TEXTO_SUAVE}>
      Página profissional
    </text>
    <circle cx="120" cy="320" r="6" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="120" cy="320" r="11" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-03: criar Página pelo computador
// ─────────────────────────────────────────────────────────────
export const IlustracaoCriarPaginaPC: React.FC<Props> = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de um computador com a tela de criar uma nova Página, com campo de nome e botão continuar"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <rect
      x="34"
      y="110"
      width="172"
      height="112"
      rx="10"
      fill="#fff"
      stroke={COR_ROXO}
      strokeWidth="2"
    />
    <rect x="20" y="230" width="200" height="12" rx="5" fill="#ddd6fe" />
    <text x="120" y="134" textAnchor="middle" fontSize="9" fill={COR_ROXO} fontFamily="monospace">
      CRIAR PÁGINA
    </text>
    <rect x="50" y="148" width="140" height="18" rx="6" fill={COR_FUNDO} stroke={COR_LINHA} />
    <text x="58" y="160" fontSize="8" fill={COR_TEXTO_SUAVE}>
      Marina Alves | Psicóloga Online
    </text>
    <rect x="50" y="174" width="140" height="18" rx="6" fill={COR_FUNDO} stroke={COR_LINHA} />
    <text x="58" y="186" fontSize="8" fill={COR_TEXTO_SUAVE}>
      Categoria: Psicóloga
    </text>
    <rect x="74" y="200" width="92" height="18" rx="9" fill={COR_ROXO} />
    <text x="120" y="212" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="monospace">
      Continuar
    </text>
    <circle cx="120" cy="280" r="6" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="120" cy="280" r="11" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-04: botão de WhatsApp na Página
// ─────────────────────────────────────────────────────────────
export const IlustracaoBotaoWhatsappPagina: React.FC<Props> = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de um celular mostrando a Página com o botão de adicionar o WhatsApp em destaque"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <rect
      x="40"
      y="60"
      width="160"
      height="190"
      rx="16"
      fill="#fff"
      stroke={COR_LINHA}
      strokeWidth="1.5"
    />
    <Avatar cx={68} cy={110} r={20} />
    <text x="96" y="104" fontSize="10" fontWeight="700" fill={COR_TEXTO}>
      Marina Alves
    </text>
    <text x="96" y="118" fontSize="8" fill={COR_TEXTO_SUAVE}>
      Psicóloga Online
    </text>
    <rect
      x="56"
      y="150"
      width="128"
      height="36"
      rx="10"
      fill="#fff"
      stroke={COR_LARANJA}
      strokeWidth="2"
    />
    <circle cx="74" cy="168" r="9" fill="#22c55e" />
    <text x="120" y="172" textAnchor="middle" fontSize="8" fill={COR_TEXTO}>
      Adicionar botão
    </text>
    <text x="120" y="272" textAnchor="middle" fontSize="9" fill={COR_TEXTO_SUAVE}>
      Quem tocar fala com você
    </text>
    <circle cx="120" cy="300" r="6" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="120" cy="300" r="11" fill={COR_LARANJA} opacity="0.25" />
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
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de um celular com as opções Criador e Comercial destacadas ao mudar para conta profissional"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <text x="120" y="76" textAnchor="middle" fontSize="11" fontWeight="700" fill={COR_TEXTO}>
      Escolha o tipo de conta
    </text>
    <rect
      x="40"
      y="100"
      width="160"
      height="70"
      rx="12"
      fill="#f5f3ff"
      stroke={COR_ROXO}
      strokeWidth="2"
    />
    <text x="54" y="128" fontSize="10" fontWeight="600" fill={COR_ROXO}>
      Criador
    </text>
    <rect x="54" y="140" width="120" height="6" rx="3" fill="#ddd6fe" />
    <rect x="54" y="152" width="84" height="6" rx="3" fill="#ede9fe" />
    <rect
      x="40"
      y="186"
      width="160"
      height="70"
      rx="12"
      fill="#fff"
      stroke="#c4b5fd"
      strokeWidth="1.5"
    />
    <text x="54" y="214" fontSize="10" fontWeight="600" fill="#64748b">
      Comercial
    </text>
    <rect x="54" y="226" width="120" height="6" rx="3" fill="#e2e8f0" />
    <rect x="54" y="238" width="84" height="6" rx="3" fill="#f1f5f9" />
    <text x="120" y="290" textAnchor="middle" fontSize="9" fill={COR_TEXTO_SUAVE}>
      Os dois viram conta profissional
    </text>
    <circle cx="120" cy="320" r="6" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="120" cy="320" r="11" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-08: anatomia do perfil
// ─────────────────────────────────────────────────────────────
export const IlustracaoAnatomiaPerfil: React.FC<Props> = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de um celular com o perfil do Instagram anotado, mostrando foto, nome, bio, link e destaques"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <rect
      x="30"
      y="50"
      width="180"
      height="280"
      rx="16"
      fill="#fff"
      stroke={COR_LINHA}
      strokeWidth="1.5"
    />
    <Avatar cx={62} cy={100} r={20} />
    <text x="90" y="94" fontSize="9" fontWeight="700" fill={COR_TEXTO}>
      Marina Alves | Psicóloga
    </text>
    <text x="90" y="108" fontSize="8" fill={COR_TEXTO_SUAVE}>
      @marinaalves.psi
    </text>
    <text x="46" y="150" fontSize="8" fill={COR_TEXTO}>
      Psicologia online para mulheres
    </text>
    <text x="46" y="163" fontSize="8" fill={COR_TEXTO}>
      Atendimento por videochamada
    </text>
    <text x="46" y="176" fontSize="8" fill={COR_TEXTO}>
      Agende pelo WhatsApp 💜
    </text>
    <rect x="46" y="190" width="90" height="18" rx="9" fill="#dbeafe" />
    <text x="91" y="202" textAnchor="middle" fontSize="7.5" fill="#1d4ed8" fontFamily="monospace">
      Agendar sessão
    </text>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <circle
          cx={62 + i * 56}
          cy="240"
          r="15"
          fill="#f5f3ff"
          stroke="#c4b5fd"
          strokeWidth="1.5"
        />
        <circle cx={62 + i * 56} cy="240" r="7" fill="#e9d5ff" />
      </g>
    ))}
    {[0, 1, 2].map((i) => (
      <rect
        key={i}
        x={46 + i * 52}
        y="268"
        width="44"
        height="44"
        rx="6"
        fill="#f5f3ff"
        stroke="#ddd6fe"
      />
    ))}
    <circle cx="120" cy="360" r="6" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="120" cy="360" r="11" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-09: foto e campo Nome
// ─────────────────────────────────────────────────────────────
export const IlustracaoFotoENome: React.FC<Props> = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de um celular com a edição do perfil, destacando a foto redonda e o campo Nome preenchido com Marina Alves | Psicóloga Online"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <text x="120" y="70" textAnchor="middle" fontSize="11" fontWeight="700" fill={COR_TEXTO}>
      Editar perfil
    </text>
    <Avatar cx={120} cy={130} r={34} />
    <rect x="90" y="176" width="60" height="18" rx="9" fill={COR_ROXO} />
    <text x="120" y="188" textAnchor="middle" fontSize="7.5" fill="#fff" fontFamily="monospace">
      Trocar foto
    </text>
    <rect
      x="40"
      y="220"
      width="160"
      height="28"
      rx="8"
      fill="#fff"
      stroke={COR_ROXO}
      strokeWidth="2"
    />
    <text x="50" y="238" fontSize="9" fill={COR_ROXO}>
      Marina Alves | Psicóloga Online
    </text>
    <rect
      x="40"
      y="258"
      width="160"
      height="24"
      rx="8"
      fill="#fff"
      stroke={COR_LINHA}
      strokeWidth="1.5"
    />
    <text x="50" y="274" fontSize="9" fill={COR_TEXTO_SUAVE}>
      @marinaalves.psi
    </text>
    <text x="120" y="316" textAnchor="middle" fontSize="9" fill={COR_TEXTO_SUAVE}>
      O nome pode mudar, o @ não precisa
    </text>
    <circle cx="120" cy="345" r="6" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="120" cy="345" r="11" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-10: a bio
// ─────────────────────────────────────────────────────────────
export const IlustracaoBio: React.FC<Props> = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de um celular com a bio do perfil escrita em três linhas curtas, cada uma com um emoji no início"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <text x="120" y="70" textAnchor="middle" fontSize="11" fontWeight="700" fill={COR_TEXTO}>
      Sua bio
    </text>
    <rect
      x="40"
      y="90"
      width="160"
      height="120"
      rx="12"
      fill="#f5f3ff"
      stroke="#c4b5fd"
      strokeWidth="1.5"
    />
    <text x="52" y="118" fontSize="9" fill={COR_TEXTO}>
      💜 Psicologia online
    </text>
    <text x="52" y="140" fontSize="9" fill={COR_TEXTO}>
      🗓 Atendimento semanal
    </text>
    <text x="52" y="162" fontSize="9" fill={COR_TEXTO}>
      📲 Agende pelo WhatsApp
    </text>
    <text x="120" y="240" textAnchor="middle" fontSize="9" fill={COR_TEXTO_SUAVE}>
      Quem você atende
    </text>
    <text x="120" y="256" textAnchor="middle" fontSize="9" fill={COR_TEXTO_SUAVE}>
      Como você ajuda
    </text>
    <text x="120" y="272" textAnchor="middle" fontSize="9" fill={COR_TEXTO_SUAVE}>
      Como agendar
    </text>
    <circle cx="120" cy="310" r="6" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="120" cy="310" r="11" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// I-11: link para o WhatsApp
// ─────────────────────────────────────────────────────────────
export const IlustracaoLinkWhatsapp: React.FC<Props> = () => (
  <svg
    viewBox="0 0 240 420"
    className="w-full"
    role="img"
    aria-label="Ilustração de um celular com o campo de link do perfil preenchido com o endereço do WhatsApp e o rótulo Agende sua sessão"
  >
    <rect width="240" height="420" rx="24" fill={COR_FUNDO} />
    <text x="120" y="70" textAnchor="middle" fontSize="11" fontWeight="700" fill={COR_TEXTO}>
      Links do perfil
    </text>
    <rect
      x="40"
      y="90"
      width="160"
      height="30"
      rx="8"
      fill="#fff"
      stroke={COR_ROXO}
      strokeWidth="2"
    />
    <circle cx="56" cy="105" r="7" fill="#22c55e" />
    <text x="70" y="109" fontSize="8.5" fill={COR_ROXO} fontFamily="monospace">
      wa.me/5511999999999
    </text>
    <rect
      x="40"
      y="130"
      width="160"
      height="24"
      rx="8"
      fill="#fff"
      stroke={COR_LINHA}
      strokeWidth="1.5"
    />
    <text x="50" y="146" fontSize="8.5" fill={COR_TEXTO_SUAVE}>
      Rótulo: Agende sua sessão
    </text>
    <rect x="72" y="180" width="96" height="24" rx="12" fill={COR_ROXO} />
    <text x="120" y="196" textAnchor="middle" fontSize="8.5" fill="#fff" fontFamily="monospace">
      Concluir
    </text>
    <text x="120" y="240" textAnchor="middle" fontSize="9" fill={COR_TEXTO_SUAVE}>
      Um toque e abre a conversa
    </text>
    <circle cx="120" cy="280" r="6" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="120" cy="280" r="11" fill={COR_LARANJA} opacity="0.25" />
  </svg>
)
