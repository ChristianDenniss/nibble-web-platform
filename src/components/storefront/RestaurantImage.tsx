import { useState } from 'react'
import images from '@/catalog/restaurantImages.json'

const artwork: Record<string, { file: string; circle?: boolean; backgroundColor?: string }> = images
const backgrounds = new Map<string, string>()

/** Match the surrounding tile to the image edge without altering the logo asset. */
function backgroundFor(image: HTMLImageElement): string {
  const cached = backgrounds.get(image.src)
  if (cached) return cached
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 32
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return '#ffffff'
  try {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, 32, 32)
    context.drawImage(image, 0, 0, 32, 32)
    const pixels = context.getImageData(0, 0, 32, 32).data
    const colors = new Map<string, { count: number; r: number; g: number; b: number }>()
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        if (x > 1 && x < 30 && y > 1 && y < 30) continue
        const i = (y * 32 + x) * 4
        const [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]]
        const key = `${r >> 4},${g >> 4},${b >> 4}`
        const group = colors.get(key) ?? { count: 0, r: 0, g: 0, b: 0 }
        group.count++; group.r += r; group.g += g; group.b += b
        colors.set(key, group)
      }
    }
    const dominant = [...colors.values()].sort((a, b) => b.count - a.count)[0]
    const color = dominant ? `rgb(${Math.round(dominant.r / dominant.count)}, ${Math.round(dominant.g / dominant.count)}, ${Math.round(dominant.b / dominant.count)})` : '#ffffff'
    backgrounds.set(image.src, color)
    return color
  } catch {
    return '#ffffff'
  }
}

export default function RestaurantImage({ restaurantId, name, className = '' }: { restaurantId: string; name: string; className?: string }) {
  const src = artwork[restaurantId]?.file
  const circle = artwork[restaurantId]?.circle
  const backgroundColor = artwork[restaurantId]?.backgroundColor
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const [background, setBackground] = useState({ src: '', color: '#ffffff' })
  return <div style={{ backgroundColor: backgroundColor ?? (background.src === src ? background.color : '#ffffff') }} className={`flex items-center justify-center overflow-hidden ${className}`}>
    {src && failedSrc !== src ? <img src={src} alt={`${name} logo`} loading="lazy" decoding="async" onLoad={event => setBackground({ src, color: backgroundFor(event.currentTarget) })} onError={() => setFailedSrc(src)} className={circle ? 'h-[94%] aspect-square max-w-full rounded-full border-[4px] border-[#ed1029] object-cover' : `h-full w-full object-contain ${name.startsWith('Taco Boyz') ? 'p-0' : 'p-1'}`} /> : <span className="px-5 text-center text-xl font-semibold text-zinc-700">{name.replace(/\s*\([^)]*\)/g, '')}</span>}
  </div>
}
