/**
 * CopyButton — a copy-to-clipboard button that swaps its Copy icon for a green Check for 1.5s after copying.
 * Renders one of four styles by prop: `iconOnly` (square toolbar button), `ghost` (borderless text), a bordered pill when `label`/`icon` is given, or a bare icon otherwise; copies `value` to the clipboard on click.
 * Lives in `components/buttons/`; used wherever a value (IDs, HF paths, raw text) needs a one-click copy affordance.
 */
import { useState, type ReactNode } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  value: string
  label?: string
  icon?: ReactNode
  size?: number
  ghost?: boolean
  className?: string
  /** Icon-only square button matching SlideshowButton/FullscreenButton's toolbar style. */
  iconOnly?: boolean
  title?: string
}

export default function CopyButton({ value, label, icon, size = 13, ghost, className, iconOnly, title }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handle = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (iconOnly) {
    return (
      <button
        onClick={handle}
        title={title}
        className={`flex items-center justify-center w-7 h-7 rounded-md text-content-muted hover:text-accent hover:bg-accent/10 transition-colors duration-150 cursor-pointer ${className ?? ''}`}
      >
        {copied ? <Check size={size} className="text-status-success" /> : (icon ?? <Copy size={size} />)}
      </button>
    )
  }

  if (ghost) {
    return (
      <button
        onClick={handle}
        className={`cursor-pointer flex items-center gap-1.5 shrink-0 text-sm text-content-secondary hover:text-content transition-colors ${className ?? ''}`}
      >
        {copied
          ? <><Check size={size} className="text-status-success" />{label ? 'Copied!' : null}</>
          : <>{icon ?? <Copy size={size} />}{label}</>}
      </button>
    )
  }

  if (label || icon) {
    return (
      <button
        onClick={handle}
        className={`cursor-pointer flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded text-xs border border-border bg-surface-inset text-content-secondary hover:bg-hover transition-colors ${className ?? ''}`}
      >
        {copied
          ? <><Check size={size} className="text-status-success" />{label ? 'Copied!' : null}</>
          : <>{icon ?? <Copy size={size} />}{label}</>}
      </button>
    )
  }

  return (
    <button
      onClick={handle}
      className={`cursor-pointer text-content-muted hover:text-content transition-colors shrink-0 ${className ?? ''}`}
    >
      {copied ? <Check size={size} className="text-status-success" /> : <Copy size={size} />}
    </button>
  )
}
