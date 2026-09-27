/**
 * ItemImage — a menu item's photo (external URL), falling back to a tinted CoverBlock when the
 * item has no image or the URL fails to load. Size and rounding come from `className`.
 */
import { useState } from 'react'
import CoverBlock from './CoverBlock'
import { coverTone } from '@/lib/coverTone'

interface Props {
  src: string
  alt: string
  /** Stable id for the fallback tint, usually the item id. */
  seed: string
  /** Fallback text; defaults to the first letter of `alt`. */
  label?: string
  className?: string
}

export default function ItemImage({ src, alt, seed, label, className = '' }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (!src || failedSrc === src) {
    return <CoverBlock tone={coverTone(seed)} label={label ?? alt.slice(0, 1)} className={className} />
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={`bg-surface-inset object-cover ${className}`}
    />
  )
}
