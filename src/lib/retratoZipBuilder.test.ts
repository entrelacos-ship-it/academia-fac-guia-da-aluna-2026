import { describe, it, expect } from 'vitest'
import { buildRetratoDeAutoriaZip } from './retratoZipBuilder'

// CRC table for standard CRC32 checking
const TABLE = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  TABLE[i] = c >>> 0
}
function calcCrc32(b: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < b.length; i++) crc = TABLE[(crc ^ b[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

interface ParsedFile {
  name: string
  content: Uint8Array
  crc: number
  isDir: boolean
}

function parseZip(buf: Uint8Array): ParsedFile[] {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
  const files: ParsedFile[] = []
  let offset = 0
  const decoder = new TextDecoder()

  while (offset + 30 <= buf.length) {
    const sig = view.getUint32(offset, true)
    if (sig !== 0x04034b50) break // Not a local file header (likely central directory)

    const method = view.getUint16(offset + 8, true)
    const crc = view.getUint32(offset + 14, true)
    const compSize = view.getUint32(offset + 18, true)
    const uncompSize = view.getUint32(offset + 22, true)
    const nameLen = view.getUint16(offset + 26, true)
    const extraLen = view.getUint16(offset + 28, true)

    const nameBuf = buf.subarray(offset + 30, offset + 30 + nameLen)
    const name = decoder.decode(nameBuf)
    const dataOffset = offset + 30 + nameLen + extraLen
    const data = buf.subarray(dataOffset, dataOffset + uncompSize)

    files.push({
      name,
      content: data,
      crc,
      isDir: name.endsWith('/'),
    })

    offset = dataOffset + compSize
  }

  return files
}

describe('Estrutura e integridade do ZIP Retrato de Autoria', () => {
  it('contém exatamente as pastas e arquivos requeridos com referências válidas', () => {
    const zipBytes = buildRetratoDeAutoriaZip()
    const files = parseZip(zipBytes)
    const filenames = files.map((f) => f.name)

    expect(filenames).toContain('retrato-de-autoria/')
    expect(filenames).toContain('retrato-de-autoria/SKILL.md')
    expect(filenames).toContain('academia-fac-design-system/')
    expect(filenames).toContain('academia-fac-design-system/SKILL.md')
    expect(filenames).toContain('academia-fac-design-system/references/')
    expect(filenames).toContain('academia-fac-design-system/references/inventario-design-fac.md')

    // Verificar integridade do CRC32 de cada arquivo
    for (const file of files) {
      if (!file.isDir) {
        expect(calcCrc32(file.content)).toBe(file.crc)
      }
    }

    const decoder = new TextDecoder()
    const skillRetrato = decoder.decode(
      files.find((f) => f.name === 'retrato-de-autoria/SKILL.md')?.content,
    )
    const skillDesign = decoder.decode(
      files.find((f) => f.name === 'academia-fac-design-system/SKILL.md')?.content,
    )
    const inventario = decoder.decode(
      files.find((f) => f.name === 'academia-fac-design-system/references/inventario-design-fac.md')
        ?.content,
    )

    // Referências relativas válidas
    expect(skillRetrato).toContain('../academia-fac-design-system/SKILL.md')
    expect(skillDesign).toContain('references/inventario-design-fac.md')
    expect(inventario).toContain('Inventário do design implementado em 04/10/2026')
  })
})
