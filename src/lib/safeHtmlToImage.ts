/**
 * Utilitário seguro para exportação e renderização de elementos DOM em imagens ou canvas via html-to-image.
 *
 * Configurações padrão incluem `skipFonts: true` e `fontEmbedCSS: ''` para blindar
 * contra o SecurityError ("Failed to read the 'cssRules' property from 'CSSStyleSheet': Cannot access rules")
 * gerado ao acessar folhas de estilo de origens externas/cross-origin (ex: Google Fonts).
 */
import * as htmlToImage from 'html-to-image'
import type { Options } from 'html-to-image/lib/types'

export const SAFE_HTML_TO_IMAGE_OPTIONS: Options = {
  skipFonts: true,
  fontEmbedCSS: '',
  cacheBust: true,
}

export async function safeToPng(node: HTMLElement, options?: Options): Promise<string> {
  try {
    return await htmlToImage.toPng(node, {
      ...SAFE_HTML_TO_IMAGE_OPTIONS,
      ...options,
    })
  } catch (err) {
    console.warn('[html-to-image] Erro ao renderizar PNG com safeToPng:', err)
    throw err
  }
}

export async function safeToJpeg(node: HTMLElement, options?: Options): Promise<string> {
  try {
    return await htmlToImage.toJpeg(node, {
      ...SAFE_HTML_TO_IMAGE_OPTIONS,
      ...options,
    })
  } catch (err) {
    console.warn('[html-to-image] Erro ao renderizar JPEG com safeToJpeg:', err)
    throw err
  }
}

export async function safeToBlob(node: HTMLElement, options?: Options): Promise<Blob | null> {
  try {
    return await htmlToImage.toBlob(node, {
      ...SAFE_HTML_TO_IMAGE_OPTIONS,
      ...options,
    })
  } catch (err) {
    console.warn('[html-to-image] Erro ao renderizar Blob com safeToBlob:', err)
    throw err
  }
}

export async function safeToCanvas(
  node: HTMLElement,
  options?: Options,
): Promise<HTMLCanvasElement> {
  try {
    return await htmlToImage.toCanvas(node, {
      ...SAFE_HTML_TO_IMAGE_OPTIONS,
      ...options,
    })
  } catch (err) {
    console.warn('[html-to-image] Erro ao renderizar Canvas com safeToCanvas:', err)
    throw err
  }
}

export async function safeToPixelData(
  node: HTMLElement,
  options?: Options,
): Promise<Uint8ClampedArray> {
  try {
    return await htmlToImage.toPixelData(node, {
      ...SAFE_HTML_TO_IMAGE_OPTIONS,
      ...options,
    })
  } catch (err) {
    console.warn('[html-to-image] Erro ao obter PixelData com safeToPixelData:', err)
    throw err
  }
}

export { htmlToImage }
