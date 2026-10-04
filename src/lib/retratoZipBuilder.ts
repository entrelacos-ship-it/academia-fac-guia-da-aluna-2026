import f1Raw from '@/assets/skill-8ae03.md?raw'
import f2Raw from '@/assets/skill-85fd0.md?raw'
import f3Raw from '@/assets/inventario-design-fac-2f704.md?raw'

// CRC32 table & calculation
const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[i] = c >>> 0
  }
  return table
})()

function crc32(buf: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

interface ZipEntryInput {
  name: string
  content: string | Uint8Array
  isDir?: boolean
}

/**
 * Creates an uncompressed / store ZIP file binary buffer compliant with standard ZIP specifications.
 * Supports directory entries, UTF-8 filenames, and standard local/central directory records.
 */
export function generateZip(entries: ZipEntryInput[]): Uint8Array {
  const encoder = new TextEncoder()
  const dosTime = 24576 // 12:00:00
  const dosDate = 23876 // 2026-10-04

  interface ProcessedEntry {
    nameBuf: Uint8Array
    data: Uint8Array
    isDir: boolean
    crc: number
    offset: number
  }

  const processed: ProcessedEntry[] = []
  let totalLocalSize = 0

  for (const entry of entries) {
    const nameBuf = encoder.encode(entry.name)
    const data = entry.isDir
      ? new Uint8Array(0)
      : typeof entry.content === 'string'
        ? encoder.encode(entry.content)
        : entry.content
    const crc = entry.isDir ? 0 : crc32(data)
    processed.push({
      nameBuf,
      data,
      isDir: !!entry.isDir,
      crc,
      offset: 0,
    })
    totalLocalSize += 30 + nameBuf.length + data.length
  }

  let totalCentralDirSize = 0
  for (const p of processed) {
    totalCentralDirSize += 46 + p.nameBuf.length
  }

  const totalSize = totalLocalSize + totalCentralDirSize + 22
  const out = new Uint8Array(totalSize)
  const view = new DataView(out.buffer)

  let cursor = 0

  // 1. Write Local File Headers and Data
  for (const p of processed) {
    p.offset = cursor

    // signature
    view.setUint32(cursor, 0x04034b50, true)
    // version needed to extract (2.0)
    view.setUint16(cursor + 4, 20, true)
    // general purpose bit flag (bit 11 = UTF-8)
    view.setUint16(cursor + 6, 0x0800, true)
    // compression method (0 = store)
    view.setUint16(cursor + 8, 0, true)
    // dos time & date
    view.setUint16(cursor + 10, dosTime, true)
    view.setUint16(cursor + 12, dosDate, true)
    // crc32
    view.setUint32(cursor + 14, p.crc, true)
    // compressed size
    view.setUint32(cursor + 18, p.data.length, true)
    // uncompressed size
    view.setUint32(cursor + 22, p.data.length, true)
    // file name length
    view.setUint16(cursor + 26, p.nameBuf.length, true)
    // extra field length
    view.setUint16(cursor + 28, 0, true)

    cursor += 30
    out.set(p.nameBuf, cursor)
    cursor += p.nameBuf.length

    if (p.data.length > 0) {
      out.set(p.data, cursor)
      cursor += p.data.length
    }
  }

  const centralDirStart = cursor

  // 2. Write Central Directory Headers
  for (const p of processed) {
    view.setUint32(cursor, 0x02014b50, true)
    view.setUint16(cursor + 4, 20, true) // version made by
    view.setUint16(cursor + 6, 20, true) // version needed
    view.setUint16(cursor + 8, 0x0800, true) // bit flag UTF-8
    view.setUint16(cursor + 10, 0, true) // compression method (0 = store)
    view.setUint16(cursor + 12, dosTime, true)
    view.setUint16(cursor + 14, dosDate, true)
    view.setUint32(cursor + 16, p.crc, true)
    view.setUint32(cursor + 20, p.data.length, true)
    view.setUint32(cursor + 24, p.data.length, true)
    view.setUint16(cursor + 28, p.nameBuf.length, true)
    view.setUint16(cursor + 30, 0, true) // extra field length
    view.setUint16(cursor + 32, 0, true) // file comment length
    view.setUint16(cursor + 34, 0, true) // disk number start
    view.setUint16(cursor + 36, 0, true) // internal attributes
    view.setUint32(cursor + 38, p.isDir ? 0x10 : 0x20, true) // external attributes (directory or file)
    view.setUint32(cursor + 42, p.offset, true) // relative offset of local header

    cursor += 46
    out.set(p.nameBuf, cursor)
    cursor += p.nameBuf.length
  }

  const centralDirLength = cursor - centralDirStart

  // 3. Write End of Central Directory record
  view.setUint32(cursor, 0x06054b50, true)
  view.setUint16(cursor + 4, 0, true) // disk number
  view.setUint16(cursor + 6, 0, true) // disk with start of CD
  view.setUint16(cursor + 8, processed.length, true) // number of entries on this disk
  view.setUint16(cursor + 10, processed.length, true) // total entries
  view.setUint32(cursor + 12, centralDirLength, true)
  view.setUint32(cursor + 16, centralDirStart, true)
  view.setUint16(cursor + 20, 0, true) // comment length

  return out
}

/**
 * Builds the official ZIP containing the Retrato de Autoria and Academia FAC Design System structure.
 */
export function buildRetratoDeAutoriaZip(): Uint8Array {
  return generateZip([
    { name: 'retrato-de-autoria/', content: '', isDir: true },
    { name: 'retrato-de-autoria/SKILL.md', content: f1Raw },
    { name: 'academia-fac-design-system/', content: '', isDir: true },
    { name: 'academia-fac-design-system/SKILL.md', content: f2Raw },
    { name: 'academia-fac-design-system/references/', content: '', isDir: true },
    { name: 'academia-fac-design-system/references/inventario-design-fac.md', content: f3Raw },
  ])
}

/**
 * Triggers the browser download of the official retrato-de-autoria.zip
 */
export function downloadRetratoZip(): void {
  const zipData = buildRetratoDeAutoriaZip()
  const blob = new Blob([zipData.buffer as ArrayBuffer], { type: 'application/zip' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'retrato-de-autoria.zip'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
