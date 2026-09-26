/**
 * PageIcon — a rounded-square icon box filled with the brand-hue gradient, sized 10x10 with a subtle shadow.
 * Wraps the passed `icon` node and accepts a `className` passthrough; one of the few places allowed to reference raw `var(--brand-*)` scale values.
 * Lives in `components/brand/`; the icon element in page headers (composed by `PageTitle`).
 */
import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  className?: string
}

export default function PageIcon({ icon, className = '' }: Props) {
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-100)] to-[var(--brand-50)] dark:from-[var(--brand-900)]/30 dark:to-[var(--brand-900)]/20 shadow-sm shrink-0 ${className}`}>
      {icon}
    </div>
  )
}
