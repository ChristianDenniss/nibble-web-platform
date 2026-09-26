/**
 * CoverBlock — image stand-in for restaurant / item / category tiles.
 * Tint is presentation-only (see coverTone). Not a domain field.
 */
import type { ReactNode } from 'react'
import { type CoverTone } from '@/lib/coverTone'

const TONE: Record<CoverTone, string> = {
  brand: 'bg-brand/10 text-accent',
  info: 'bg-status-info/15 text-status-info',
  success: 'bg-status-success/15 text-status-success',
  warning: 'bg-status-warning/15 text-status-warning',
  purple: 'bg-status-purple/15 text-status-purple',
  orange: 'bg-status-orange/15 text-status-orange',
  pink: 'bg-status-pink/15 text-status-pink',
  danger: 'bg-status-danger/15 text-status-danger',
}

interface Props {
  tone: CoverTone
  icon?: ReactNode
  label?: string
  className?: string
}

export default function CoverBlock({ tone, icon, label, className = 'h-36' }: Props) {
  return (
    <div className={`flex items-center justify-center rounded-xl ${TONE[tone]} ${className}`}>
      {icon ?? <span className="text-2xl font-semibold tracking-tight">{label}</span>}
    </div>
  )
}
