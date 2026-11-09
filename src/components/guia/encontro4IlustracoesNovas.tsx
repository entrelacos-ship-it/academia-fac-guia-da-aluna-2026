import React from 'react'

// ─────────────────────────────────────────────────────────────
// Novas Ilustrações do Encontro 4 (Canais)
// Traço simples, cantos arredondados, cores do app (roxo #7c3aed,
// laranja #ea580c, linha #e2e8f0, texto #334155), um único destaque
// laranja (ponto de toque com onda pulsando), telas de celular
// estilizadas, SEM logotipos oficiais (câmera, bandeira, balão com maleta).
// Perfil fictício: Marina Alves | Psicóloga Online, @marinaalves.psi, CRP 06/000000.
// ─────────────────────────────────────────────────────────────

const COR_ROXO = '#7c3aed'
const COR_LARANJA = '#ea580c'
const COR_LINHA = '#e2e8f0'
const COR_TEXTO = '#334155'
const COR_TEXTO_SUAVE = '#94a3b8'
const COR_FUNDO = '#f8fafc'

// Ilustração Etapa 0: mesa vista de cima com celular, notebook e documento "Manifesto", cada um com pequeno selo de check
export const IlustracaoMesaAntesDeComecar: React.FC = () => (
  <svg
    viewBox="0 0 320 220"
    className="w-full max-w-[420px]"
    role="img"
    aria-label="Mesa vista de cima com celular, notebook e documento Manifesto, cada um com um pequeno selo de check"
  >
    <rect width="320" height="220" rx="20" fill={COR_FUNDO} />

    {/* Notebook no centro */}
    <g>
      <rect
        x="95"
        y="42"
        width="130"
        height="84"
        rx="8"
        fill="#ffffff"
        stroke={COR_ROXO}
        strokeWidth="2"
      />
      <rect x="103" y="50" width="114" height="68" rx="4" fill="#f5f3ff" />
      {/* ChatGPT no notebook */}
      <rect x="111" y="58" width="40" height="12" rx="3" fill="#ede9fe" />
      <text x="131" y="67" fontSize="7" fill={COR_ROXO} textAnchor="middle" fontWeight="700">
        ChatGPT
      </text>
      <rect x="111" y="76" width="98" height="34" rx="4" fill="#ffffff" />
      <line
        x1="117"
        y1="84"
        x2="185"
        y2="84"
        stroke={COR_LINHA}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="117"
        y1="92"
        x2="165"
        y2="92"
        stroke={COR_LINHA}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="117"
        y1="100"
        x2="195"
        y2="100"
        stroke={COR_LINHA}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Base do notebook */}
      <path
        d="M 80 126 L 240 126 L 228 140 L 92 140 Z"
        fill="#e2e8f0"
        stroke={COR_LINHA}
        strokeWidth="1.5"
      />
      <rect x="142" y="128" width="36" height="5" rx="2" fill="#cbd5e1" />

      {/* Selo check no notebook */}
      <circle cx="225" cy="42" r="9" fill="#22c55e" />
      <path
        d="M 221 42 l 3 3 l 5 -5"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* Celular à esquerda */}
    <g>
      <rect
        x="24"
        y="50"
        width="54"
        height="100"
        rx="10"
        fill="#ffffff"
        stroke={COR_ROXO}
        strokeWidth="2"
      />
      <rect x="30" y="58" width="42" height="78" rx="6" fill="#f5f3ff" />
      <circle cx="51" cy="54" r="1.8" fill="#cbd5e1" />
      {/* Ícones de apps no celular */}
      <rect x="35" y="66" width="14" height="14" rx="3.5" fill="#ede9fe" />
      <circle cx="42" cy="73" r="3" fill="none" stroke={COR_ROXO} strokeWidth="1.2" />
      <rect x="53" y="66" width="14" height="14" rx="3.5" fill="#ede9fe" />
      <circle cx="60" cy="73" r="3" fill={COR_ROXO} />

      <circle cx="51" cy="143" r="3.5" fill="none" stroke={COR_LINHA} strokeWidth="1.2" />

      {/* Selo check no celular */}
      <circle cx="78" cy="50" r="9" fill="#22c55e" />
      <path
        d="M 74 50 l 3 3 l 5 -5"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* Documento Manifesto à direita */}
    <g>
      <rect
        x="242"
        y="52"
        width="58"
        height="82"
        rx="6"
        fill="#ffffff"
        stroke={COR_LINHA}
        strokeWidth="1.5"
      />
      <rect x="250" y="60" width="38" height="8" rx="2" fill="#ede9fe" />
      <text x="269" y="66" fontSize="6" fill={COR_ROXO} textAnchor="middle" fontWeight="700">
        Manifesto
      </text>
      {[74, 82, 90, 98, 106, 114].map((y, i) => (
        <line
          key={y}
          x1="250"
          y1={y}
          x2={i % 2 === 0 ? 290 : 282}
          y2={y}
          stroke={COR_LINHA}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}

      {/* Selo check no Manifesto */}
      <circle cx="298" cy="52" r="9" fill="#22c55e" />
      <path
        d="M 294 52 l 3 3 l 5 -5"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* Ponto de toque laranja pulsando na mesa */}
    <circle cx="160" cy="180" r="6" fill={COR_LARANJA} opacity="0.85" />
    <circle cx="160" cy="180" r="12" fill={COR_LARANJA} opacity="0.25" />
    <text x="160" y="202" fontSize="9" fill={COR_TEXTO_SUAVE} textAnchor="middle">
      tudo pronto para começar
    </text>
  </svg>
)

// Ilustração Etapa 1: documento "Manifesto" entrando num círculo com faíscas (a IA) e saindo como celular com perfil montado; abaixo, mão escolhendo entre 3 balões
export const IlustracaoIaTrabalhaParaVoce: React.FC = () => (
  <svg
    viewBox="0 0 320 220"
    className="w-full max-w-[420px]"
    role="img"
    aria-label="Manifesto entrando no círculo de inteligência artificial e saindo como celular com perfil montado, com escolha entre três balões"
  >
    <rect width="320" height="220" rx="20" fill={COR_FUNDO} />

    {/* Documento Manifesto à esquerda */}
    <g>
      <rect
        x="24"
        y="42"
        width="56"
        height="76"
        rx="6"
        fill="#ffffff"
        stroke={COR_LINHA}
        strokeWidth="1.5"
      />
      <rect x="32" y="50" width="36" height="8" rx="2" fill="#ede9fe" />
      <text x="50" y="56" fontSize="6.5" fill={COR_ROXO} textAnchor="middle" fontWeight="700">
        Manifesto
      </text>
      {[64, 72, 80, 88, 96].map((y) => (
        <line
          key={y}
          x1="32"
          y1={y}
          x2="70"
          y2={y}
          stroke={COR_LINHA}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </g>

    {/* Seta para a IA */}
    <path d="M 88 80 L 114 80" stroke={COR_ROXO} strokeWidth="2" strokeDasharray="3 3" />
    <polygon points="118,80 112,76 112,84" fill={COR_ROXO} />

    {/* Círculo central com faíscas (a IA) */}
    <g>
      <circle cx="150" cy="80" r="28" fill="#ede9fe" stroke={COR_ROXO} strokeWidth="2" />
      <text x="150" y="84" fontSize="11" fontWeight="700" fill={COR_ROXO} textAnchor="middle">
        IA
      </text>
      {/* Faíscas */}
      <circle cx="132" cy="62" r="2" fill={COR_LARANJA} />
      <circle cx="168" cy="62" r="2.5" fill={COR_LARANJA} />
      <circle cx="170" cy="98" r="2" fill={COR_LARANJA} />
      <circle cx="130" cy="96" r="1.5" fill={COR_LARANJA} />
      <path d="M 150 48 L 150 44" stroke={COR_LARANJA} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 150 112 L 150 116" stroke={COR_LARANJA} strokeWidth="1.5" strokeLinecap="round" />
    </g>

    {/* Seta saindo da IA */}
    <path d="M 186 80 L 214 80" stroke={COR_ROXO} strokeWidth="2" strokeDasharray="3 3" />
    <polygon points="218,80 212,76 212,84" fill={COR_ROXO} />

    {/* Celular montado à direita */}
    <g>
      <rect
        x="228"
        y="32"
        width="68"
        height="100"
        rx="10"
        fill="#ffffff"
        stroke={COR_ROXO}
        strokeWidth="2"
      />
      <circle cx="262" cy="48" r="8" fill="#ede9fe" />
      <circle cx="262" cy="46" r="3.5" fill={COR_ROXO} />
      <rect x="238" y="60" width="48" height="5" rx="2.5" fill={COR_ROXO} />
      <rect x="238" y="68" width="40" height="4" rx="2" fill="#ddd6fe" />
      <rect x="238" y="75" width="44" height="4" rx="2" fill="#ddd6fe" />
      <rect x="238" y="82" width="30" height="4" rx="2" fill="#ddd6fe" />
      <rect x="238" y="90" width="48" height="8" rx="3" fill="#faede4" />
      <rect x="244" y="93" width="36" height="2" rx="1" fill={COR_LARANJA} />
      <circle cx="262" cy="124" r="3" fill="none" stroke={COR_LINHA} strokeWidth="1.2" />
    </g>

    {/* Três balões de texto abaixo */}
    <g>
      {[
        { x: 34, w: 72, label: 'Opção 1' },
        { x: 124, w: 72, label: 'Opção 2' },
        { x: 214, w: 72, label: 'Opção 3' },
      ].map((b, idx) => (
        <g key={b.label}>
          <rect
            x={b.x}
            y="152"
            width={b.w}
            height="34"
            rx="8"
            fill={idx === 1 ? '#ffffff' : '#f8fafc'}
            stroke={idx === 1 ? COR_ROXO : COR_LINHA}
            strokeWidth={idx === 1 ? 2 : 1.2}
          />
          <text
            x={b.x + b.w / 2}
            y="166"
            fontSize="8"
            fontWeight={idx === 1 ? '700' : '500'}
            fill={idx === 1 ? COR_ROXO : COR_TEXTO}
            textAnchor="middle"
          >
            {b.label}
          </text>
          <line
            x1={b.x + 8}
            y1="174"
            x2={b.x + b.w - 8}
            y2="174"
            stroke={idx === 1 ? '#ddd6fe' : COR_LINHA}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Destaque laranja no balão escolhido (Opção 2) */}
      <circle cx="160" cy="152" r="5" fill={COR_LARANJA} opacity="0.9" />
      <circle cx="160" cy="152" r="10" fill={COR_LARANJA} opacity="0.25" />
    </g>

    <text x="160" y="206" fontSize="9" fill={COR_TEXTO_SUAVE} textAnchor="middle">
      A IA rascunha, quem decide é você
    </text>
  </svg>
)

// Ilustração Etapa 4: dois celulares, câmera (Instagram) e página com bandeira (Facebook), ligados por ponte; no meio, Central de Contas
export const IlustracaoPonteCentralDeContas: React.FC = () => (
  <svg
    viewBox="0 0 320 220"
    className="w-full max-w-[420px]"
    role="img"
    aria-label="Dois celulares representando Instagram e Facebook ligados por uma ponte com a Central de Contas no meio"
  >
    <rect width="320" height="220" rx="20" fill={COR_FUNDO} />

    {/* Celular Instagram à esquerda */}
    <g>
      <rect
        x="24"
        y="40"
        width="66"
        height="110"
        rx="12"
        fill="#ffffff"
        stroke={COR_ROXO}
        strokeWidth="2"
      />
      <rect x="31" y="48" width="52" height="84" rx="8" fill="#f5f3ff" />
      {/* Ícone câmera */}
      <rect
        x="49"
        y="58"
        width="16"
        height="12"
        rx="3"
        fill="none"
        stroke={COR_ROXO}
        strokeWidth="1.5"
      />
      <circle cx="57" cy="64" r="3" fill="none" stroke={COR_ROXO} strokeWidth="1.2" />
      <circle cx="62" cy="60" r="0.8" fill={COR_ROXO} />
      <text x="57" y="82" fontSize="7.5" fontWeight="600" fill={COR_TEXTO} textAnchor="middle">
        Instagram
      </text>
      <rect x="36" y="90" width="42" height="10" rx="3" fill="#ede9fe" />
      <text x="57" y="97" fontSize="6" fill={COR_ROXO} textAnchor="middle">
        Editar perfil
      </text>
      <circle cx="57" cy="142" r="3" fill="none" stroke={COR_LINHA} strokeWidth="1.2" />
    </g>

    {/* Ponte de conexão */}
    <path
      d="M 90 92 C 110 70, 130 70, 150 78"
      stroke={COR_ROXO}
      strokeWidth="2"
      fill="none"
      strokeDasharray="4 3"
    />
    <path
      d="M 170 78 C 190 70, 210 70, 230 92"
      stroke={COR_ROXO}
      strokeWidth="2"
      fill="none"
      strokeDasharray="4 3"
    />

    {/* Cartão central: Central de Contas */}
    <g>
      <rect
        x="110"
        y="60"
        width="100"
        height="100"
        rx="12"
        fill="#ffffff"
        stroke={COR_ROXO}
        strokeWidth="2"
      />
      <rect x="110" y="60" width="100" height="24" rx="12" fill="#ede9fe" />
      <text x="160" y="75" fontSize="8" fontWeight="700" fill={COR_ROXO} textAnchor="middle">
        Central de Contas
      </text>
      {/* Itens Contas e Compartilhamento */}
      <rect
        x="118"
        y="92"
        width="84"
        height="24"
        rx="6"
        fill="#f8fafc"
        stroke={COR_LINHA}
        strokeWidth="1"
      />
      <text x="124" y="104" fontSize="7" fontWeight="600" fill={COR_TEXTO}>
        Contas
      </text>
      <text x="124" y="112" fontSize="6" fill={COR_TEXTO_SUAVE}>
        Facebook + Instagram
      </text>
      <circle cx="194" cy="104" r="4" fill="#22c55e" />
      <path
        d="M 192 104 l 1.5 1.5 l 2.5 -2.5"
        fill="none"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <rect
        x="118"
        y="122"
        width="84"
        height="28"
        rx="6"
        fill="#f8fafc"
        stroke={COR_LINHA}
        strokeWidth="1"
      />
      <text x="124" y="134" fontSize="7" fontWeight="600" fill={COR_TEXTO}>
        Compartilhamento
      </text>
      <text x="124" y="142" fontSize="6" fill={COR_TEXTO_SUAVE}>
        entre perfis: ativo
      </text>
      <circle cx="194" cy="136" r="4" fill="#22c55e" />
      <path
        d="M 192 136 l 1.5 1.5 l 2.5 -2.5"
        fill="none"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Ponto de toque laranja pulsando no botão de conectar */}
      <circle cx="160" cy="170" r="5" fill={COR_LARANJA} opacity="0.9" />
      <circle cx="160" cy="170" r="11" fill={COR_LARANJA} opacity="0.25" />
    </g>

    {/* Celular Facebook à direita */}
    <g>
      <rect
        x="230"
        y="40"
        width="66"
        height="110"
        rx="12"
        fill="#ffffff"
        stroke={COR_ROXO}
        strokeWidth="2"
      />
      <rect x="237" y="48" width="52" height="84" rx="8" fill="#f5f3ff" />
      {/* Ícone página com bandeira */}
      <path d="M 258 56 v 14" stroke={COR_ROXO} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M 258 56 h 10 l -2.5 3.5 l 2.5 3.5 h -10"
        fill="#ede9fe"
        stroke={COR_ROXO}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <text x="263" y="82" fontSize="7.5" fontWeight="600" fill={COR_TEXTO} textAnchor="middle">
        Facebook
      </text>
      <rect x="242" y="90" width="42" height="10" rx="3" fill="#ede9fe" />
      <text x="263" y="97" fontSize="6" fill={COR_ROXO} textAnchor="middle">
        Página
      </text>
      <circle cx="263" cy="142" r="3" fill="none" stroke={COR_LINHA} strokeWidth="1.2" />
    </g>

    <text x="160" y="202" fontSize="9" fill={COR_TEXTO_SUAVE} textAnchor="middle">
      Página conectada ao Instagram e Central de Contas configurada
    </text>
  </svg>
)

// Ilustração Etapa 5: dois celulares lado a lado: WhatsApp comum simples vs WhatsApp Business com selo Gratuito
export const IlustracaoWhatsappComumVsBusiness: React.FC = () => (
  <svg
    viewBox="0 0 320 220"
    className="w-full max-w-[420px]"
    role="img"
    aria-label="Dois celulares lado a lado comparando WhatsApp comum simples e WhatsApp Business com selo Gratuito e recursos profissionais"
  >
    <rect width="320" height="220" rx="20" fill={COR_FUNDO} />

    {/* Celular 1: WhatsApp comum */}
    <g>
      <rect
        x="36"
        y="30"
        width="100"
        height="146"
        rx="14"
        fill="#ffffff"
        stroke={COR_LINHA}
        strokeWidth="1.5"
      />
      <text
        x="86"
        y="52"
        fontSize="9.5"
        fontWeight="600"
        fill={COR_TEXTO_SUAVE}
        textAnchor="middle"
      >
        WhatsApp comum
      </text>
      {/* Balão simples */}
      <circle cx="86" cy="78" r="16" fill="#f1f5f9" />
      <path
        d="M 80 74 h 12 a 3 3 0 0 1 3 3 v 5 a 3 3 0 0 1 -3 3 h -7 l -3 3 v -3 h -2 a 3 3 0 0 1 -3 -3 v -5 a 3 3 0 0 1 3 -3 z"
        fill="#94a3b8"
      />
      <text x="86" y="112" fontSize="8" fill={COR_TEXTO_SUAVE} textAnchor="middle">
        Conversas simples
      </text>
      <text x="86" y="124" fontSize="7.5" fill={COR_TEXTO_SUAVE} textAnchor="middle">
        Sem mensagem automática
      </text>
      <text x="86" y="136" fontSize="7.5" fill={COR_TEXTO_SUAVE} textAnchor="middle">
        Sem perfil comercial
      </text>
      <circle cx="86" cy="164" r="3" fill="none" stroke={COR_LINHA} strokeWidth="1.2" />
    </g>

    {/* Celular 2: WhatsApp Business com selo Gratuito */}
    <g>
      <rect
        x="184"
        y="30"
        width="100"
        height="146"
        rx="14"
        fill="#ffffff"
        stroke={COR_ROXO}
        strokeWidth="2"
      />
      {/* Selo gratuito */}
      <rect x="238" y="22" width="42" height="16" rx="8" fill="#22c55e" />
      <text x="259" y="33" fontSize="7" fontWeight="700" fill="#fff" textAnchor="middle">
        Gratuito
      </text>

      <text x="234" y="52" fontSize="9.5" fontWeight="700" fill={COR_ROXO} textAnchor="middle">
        WhatsApp Business
      </text>

      {/* Ícone balão com maleta */}
      <circle cx="234" cy="78" r="16" fill="#ede9fe" />
      <path
        d="M 226 73 h 16 a 3 3 0 0 1 3 3 v 6 a 3 3 0 0 1 -3 3 h -9 l -4 3 v -3 h -3 a 3 3 0 0 1 -3 -3 v -6 a 3 3 0 0 1 3 -3 z"
        fill={COR_ROXO}
      />
      <rect x="231" y="76" width="6" height="4" rx="1" fill="#fff" />

      {/* Pequenos ícones: perfil comercial, automação, etiquetas */}
      <g>
        <rect
          x="194"
          y="104"
          width="80"
          height="14"
          rx="4"
          fill="#f5f3ff"
          stroke="#ddd6fe"
          strokeWidth="0.8"
        />
        <text x="234" y="114" fontSize="7" fontWeight="600" fill={COR_ROXO} textAnchor="middle">
          ✓ Perfil comercial
        </text>

        <rect
          x="194"
          y="122"
          width="80"
          height="14"
          rx="4"
          fill="#f5f3ff"
          stroke="#ddd6fe"
          strokeWidth="0.8"
        />
        <text x="234" y="132" fontSize="7" fontWeight="600" fill={COR_ROXO} textAnchor="middle">
          ✓ Saudação e ausência
        </text>

        <rect
          x="194"
          y="140"
          width="80"
          height="14"
          rx="4"
          fill="#f5f3ff"
          stroke="#ddd6fe"
          strokeWidth="0.8"
        />
        <text x="234" y="150" fontSize="7" fontWeight="600" fill={COR_ROXO} textAnchor="middle">
          ✓ Respostas e etiquetas
        </text>
      </g>

      <circle cx="234" cy="164" r="3" fill="none" stroke={COR_LINHA} strokeWidth="1.2" />

      {/* Destaque laranja no botão do Business */}
      <circle cx="234" cy="98" r="4.5" fill={COR_LARANJA} opacity="0.9" />
      <circle cx="234" cy="98" r="9" fill={COR_LARANJA} opacity="0.25" />
    </g>

    <text x="160" y="202" fontSize="9" fill={COR_TEXTO_SUAVE} textAnchor="middle">
      O WhatsApp Business trabalha por você mesmo quando você está em sessão
    </text>
  </svg>
)

// Ilustração Subtítulo 5.1: tela "Usar este número" com número preenchido e aviso "Suas conversas serão transferidas"
export const IlustracaoMigracaoNumeroWhatsApp: React.FC = () => (
  <svg
    viewBox="0 0 320 220"
    className="w-full max-w-[420px]"
    role="img"
    aria-label="Tela de migração do WhatsApp Business com opção Usar este número e aviso de que as conversas serão transferidas"
  >
    <rect width="320" height="220" rx="20" fill={COR_FUNDO} />

    {/* Celular central */}
    <g>
      <rect
        x="95"
        y="16"
        width="130"
        height="188"
        rx="18"
        fill="#ffffff"
        stroke={COR_ROXO}
        strokeWidth="2"
      />
      <rect x="103" y="26" width="114" height="162" rx="12" fill="#f5f3ff" />
      <rect x="135" y="20" width="50" height="4" rx="2" fill="#cbd5e1" />

      {/* Ícone balão com maleta */}
      <circle cx="160" cy="50" r="14" fill="#ede9fe" />
      <rect x="154" y="46" width="12" height="9" rx="2" fill={COR_ROXO} />
      <path
        d="M 157 46 v -2 a 2 2 0 0 1 2 -2 h 2 a 2 2 0 0 1 2 2 v 2"
        fill="none"
        stroke={COR_ROXO}
        strokeWidth="1.2"
      />

      <text x="160" y="74" fontSize="9" fontWeight="700" fill={COR_TEXTO} textAnchor="middle">
        Usar este número
      </text>

      {/* Campo de telefone */}
      <rect
        x="114"
        y="82"
        width="92"
        height="24"
        rx="6"
        fill="#ffffff"
        stroke={COR_LINHA}
        strokeWidth="1.2"
      />
      <text x="160" y="97" fontSize="8" fontWeight="600" fill={COR_TEXTO} textAnchor="middle">
        +55 11 90000 0000
      </text>

      {/* Aviso de transferência */}
      <rect
        x="114"
        y="112"
        width="92"
        height="34"
        rx="6"
        fill="#fff7ed"
        stroke="#fed7aa"
        strokeWidth="1"
      />
      <text x="160" y="123" fontSize="6.5" fontWeight="600" fill={COR_LARANJA} textAnchor="middle">
        Suas conversas
      </text>
      <text x="160" y="132" fontSize="6.5" fontWeight="600" fill={COR_LARANJA} textAnchor="middle">
        serão transferidas
      </text>
      <text x="160" y="141" fontSize="5.5" fill={COR_TEXTO_SUAVE} textAnchor="middle">
        Histórico mantido
      </text>

      {/* Botão aceitar transferência com ponto de toque laranja */}
      <rect x="114" y="152" width="92" height="22" rx="6" fill={COR_ROXO} />
      <text x="160" y="166" fontSize="7.5" fontWeight="700" fill="#fff" textAnchor="middle">
        Transferir conversas
      </text>

      <circle cx="160" cy="163" r="5" fill={COR_LARANJA} opacity="0.9" />
      <circle cx="160" cy="163" r="11" fill={COR_LARANJA} opacity="0.25" />
    </g>
  </svg>
)

// Ilustração Etapa 7: cronômetro circular de 5 segundos com três balões em volta: "O que ela faz?" · "Para quem?" · "Como eu agendo?"
export const IlustracaoCronometroTresBaloes: React.FC = () => (
  <svg
    viewBox="0 0 320 220"
    className="w-full max-w-[420px]"
    role="img"
    aria-label="Cronômetro de cinco segundos com três balões em volta perguntando o que ela faz, para quem e como eu agendo"
  >
    <rect width="320" height="220" rx="20" fill={COR_FUNDO} />

    {/* Cronômetro central */}
    <g>
      <circle cx="160" cy="110" r="48" fill="#ede9fe" />
      <circle cx="160" cy="110" r="38" fill="#ffffff" stroke={COR_ROXO} strokeWidth="3" />
      {/* Arco laranja de 5s */}
      <path
        d="M 160 72 A 38 38 0 0 1 193 91"
        fill="none"
        stroke={COR_LARANJA}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Botão superior do cronômetro */}
      <rect x="154" y="52" width="12" height="8" rx="2" fill={COR_ROXO} />
      <path d="M 155 52 h 10" stroke={COR_ROXO} strokeWidth="3" strokeLinecap="round" />
      <text
        x="160"
        y="122"
        fontSize="28"
        fontWeight="700"
        fill={COR_ROXO}
        textAnchor="middle"
        fontFamily="Georgia, serif"
      >
        5
      </text>
      <text
        x="160"
        y="136"
        fontSize="7"
        fill={COR_TEXTO_SUAVE}
        textAnchor="middle"
        fontWeight="600"
      >
        segundos
      </text>

      {/* Ponto de toque laranja no botão */}
      <circle cx="160" cy="52" r="4.5" fill={COR_LARANJA} opacity="0.9" />
      <circle cx="160" cy="52" r="9" fill={COR_LARANJA} opacity="0.25" />
    </g>

    {/* Balão 1: O que ela faz? (à esquerda) */}
    <g>
      <rect
        x="20"
        y="42"
        width="88"
        height="38"
        rx="10"
        fill="#ffffff"
        stroke={COR_ROXO}
        strokeWidth="1.5"
      />
      <text x="64" y="58" fontSize="8" fontWeight="700" fill={COR_TEXTO} textAnchor="middle">
        O que ela faz?
      </text>
      <text x="64" y="70" fontSize="7" fill={COR_TEXTO_SUAVE} textAnchor="middle">
        campo Nome e bio
      </text>
      <path d="M 100 70 L 122 88" stroke={COR_ROXO} strokeWidth="1.2" strokeDasharray="2 2" />
    </g>

    {/* Balão 2: Para quem? (à direita) */}
    <g>
      <rect
        x="212"
        y="42"
        width="88"
        height="38"
        rx="10"
        fill="#ffffff"
        stroke={COR_ROXO}
        strokeWidth="1.5"
      />
      <text x="256" y="58" fontSize="8" fontWeight="700" fill={COR_TEXTO} textAnchor="middle">
        Para quem?
      </text>
      <text x="256" y="70" fontSize="7" fill={COR_TEXTO_SUAVE} textAnchor="middle">
        clareza da dor
      </text>
      <path d="M 220 70 L 198 88" stroke={COR_ROXO} strokeWidth="1.2" strokeDasharray="2 2" />
    </g>

    {/* Balão 3: Como eu agendo? (abaixo) */}
    <g>
      <rect
        x="110"
        y="170"
        width="100"
        height="38"
        rx="10"
        fill="#ffffff"
        stroke={COR_ROXO}
        strokeWidth="1.5"
      />
      <text x="160" y="186" fontSize="8" fontWeight="700" fill={COR_TEXTO} textAnchor="middle">
        Como eu agendo?
      </text>
      <text x="160" y="198" fontSize="7" fill={COR_TEXTO_SUAVE} textAnchor="middle">
        primeiro link direto
      </text>
      <path d="M 160 170 L 160 160" stroke={COR_ROXO} strokeWidth="1.2" strokeDasharray="2 2" />
    </g>
  </svg>
)
