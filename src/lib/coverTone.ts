/**
 * Presentation-only cover tint. Not a domain field — photos will replace this.
 */
const TONES = ['brand', 'info', 'success', 'warning', 'purple', 'orange', 'pink', 'danger'] as const

export type CoverTone = (typeof TONES)[number]

export function coverTone(id: string): CoverTone {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) hash = (hash + id.charCodeAt(i)) % TONES.length
  return TONES[hash]
}
