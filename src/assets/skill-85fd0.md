---
name: academia-fac-design-system
description: Aplicar o design system da Academia FAC da Entrelaços a páginas, apresentações, documentos HTML e materiais de estudo da Academia, escolhendo a variação clara comercial ou escura editorial pela função da peça.
---

# Design system da Academia FAC

Use este padrão para materiais da Academia FAC. Leia [o inventário fornecido pela usuária](references/inventario-design-fac.md) antes de definir o visual. O inventário documenta o estado de 04/10/2026; não autoriza publicar conteúdo nem significa que prévias estão liberadas.

Escolha pela função: LP e conversão usam a variação clara lavanda/violeta; guia, caderno, retratos e acompanhamento usam a variação escura editorial. Preserve essa distinção ao criar novos materiais.

Para estudo: fundo #000, superfície #0a0a0a, superfície elevada #111214, texto #f0f0f0, apoio #a1a4a5, ameixa #1b1024, laranja editorial #ff9b32, violeta #8b5cf6 e linhas rgba(255,255,255,.1). Títulos Georgia, peso 400 e espaçamento negativo; corpo system-ui como fallback honesto quando Hanken Grotesk não estiver disponível. Microtipografia monoespaçada, maiúsculas, 10–11px. Raios 5–9px, largura máxima 1200px, respiro lateral 24px ou 16px até 680px. Botão principal branco com texto escuro; secundário transparente; foco violeta visível.

Para apresentação comercial: fundo #F5F2FB, superfícies brancas, texto #0B1533, apoio #54658A, violeta #6D28D9/#8B5CF6, bordas lavanda e raios 18–24px. Use Geist e Manrope apenas quando disponíveis, com fallbacks e sem depender de fontes remotas em entregas offline.

O cubo FAC deve mostrar frente, topo e lateral com peças e volume. Pode ser SVG ou CSS com perspectiva. Não use três blocos chapados como substituição. Movimento é opcional; se existir, respeite prefers-reduced-motion. Não aplique automaticamente a codificação de pilares da LP a todos os cartões escuros. Utilize rótulos além da cor.

Organize tokens em primitivos, semânticos e componentes. Preserve legibilidade, navegação por teclado, comportamento móvel e impressão quando pertinente. Use os ativos de marca apenas quando os arquivos reais estiverem disponíveis; não invente logotipos. Para artefatos offline, mantenha estilos, gráficos e comportamentos no arquivo sem serviços externos.
