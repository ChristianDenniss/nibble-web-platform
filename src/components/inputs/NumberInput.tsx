/**
 * NumberInput — styled numeric input flanked by minus/plus stepper buttons, replacing the browser's unstyleable native `<input type="number">` spinner; the buttons disable at `min`/`max`.
 * Value/onChange stay string-based to match how eval-config fields are stored. Props: `value` (string | number), `onChange(value: string)`, `min?`, `max?`, `step?`, `className?`, `autoFocus?`, `onKeyDown?` (forwarded to the inner `<input>`).
 * Lives in `components/inputs/`; used for classifier-type eval-config numeric fields (Step3_Configuration) and inline-edit numeric settings (Admin.tsx's `InlineEditField` rows).
 */
import { Minus, Plus } from 'lucide-react'
import type { KeyboardEvent } from 'react'

interface Props {
  value: string | number
  onChange: (value: string) => void
  min?: number
  max?: number
  step?: number
  className?: string
  autoFocus?: boolean
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
}

// Styled numeric input with increment/decrement buttons, replacing the browser's unstyleable
// native <input type="number"> spinner. Value/onChange stay string-based (not number-based) to
// match how eval-config fields are already stored (Step3_Configuration's evalConfig record).
export default function NumberInput({ value, onChange, min, max, step = 1, className = 'w-32', autoFocus, onKeyDown }: Props) {
  const numeric = Number(value)

  function clamp(n: number): number {
    if (min !== undefined && n < min) return min
    if (max !== undefined && n > max) return max
    return n
  }

  function bump(delta: number) {
    const base = Number.isFinite(numeric) ? numeric : (min ?? 0)
    onChange(String(clamp(base + delta)))
  }

  const atMin = min !== undefined && Number.isFinite(numeric) && numeric <= min
  const atMax = max !== undefined && Number.isFinite(numeric) && numeric >= max
  const stepperButtonClass = 'flex items-center justify-center w-7 shrink-0 text-content-muted hover:text-content hover:bg-surface-elevated transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer'

  return (
    <div className={`inline-flex items-stretch rounded-lg border border-border bg-surface-inset focus-within:border-accent overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => bump(-step)}
        disabled={atMin}
        aria-label="Decrease"
        className={`${stepperButtonClass} border-r border-border`}
      >
        <Minus size={13} />
      </button>
      <input
        type="number"
        autoFocus={autoFocus}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full min-w-0 flex-1 px-1 py-1.5 bg-transparent text-content text-center text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => bump(step)}
        disabled={atMax}
        aria-label="Increase"
        className={`${stepperButtonClass} border-l border-border`}
      >
        <Plus size={13} />
      </button>
    </div>
  )
}
