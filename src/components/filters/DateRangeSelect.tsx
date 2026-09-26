/**
 * DateRangeSelect — date-range filter dropdown with preset options (last 24h/3d/7d/30d, all time, …) plus a custom from/to date-picker range, and a clear button.
 * Props: `value`, `onChange`, `presets?`, `placeholder?`, `className?`; also exports `LAST_USED_PRESETS` and the `DateRangeValue` type. Closes on outside click / Escape.
 * Lives in `components/filters/`; used to filter list/table pages by date.
 */
import { useEffect, useRef, useState } from 'react'
import { Calendar, ChevronDown, X } from 'lucide-react'

const DEFAULT_PRESETS = [
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 3 days', value: '3d' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'All time', value: 'all' },
  { label: 'Custom range', value: 'custom' },
]

export const LAST_USED_PRESETS = [
  { label: 'Today', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Never used', value: 'never' },
]

function presetToDates(preset: string): { from: Date | undefined; to: Date | undefined } {
  const now = new Date()
  const msPerDay = 86_400_000
  if (preset === '24h') return { from: new Date(Date.now() - msPerDay), to: now }
  if (preset === '3d') return { from: new Date(Date.now() - 3 * msPerDay), to: now }
  if (preset === '7d') return { from: new Date(Date.now() - 7 * msPerDay), to: now }
  if (preset === '30d') return { from: new Date(Date.now() - 30 * msPerDay), to: now }
  if (preset === '90d') return { from: new Date(Date.now() - 90 * msPerDay), to: now }
  return { from: undefined, to: undefined }
}

export interface DateRangeValue {
  preset: string
  from: Date | undefined
  to: Date | undefined
}

interface Props {
  value: DateRangeValue | undefined
  onChange: (value: DateRangeValue | undefined) => void
  presets?: { label: string; value: string }[]
  placeholder?: string
  className?: string
}

function toInputDate(d: Date | undefined): string {
  if (!d) return ''
  return d.toISOString().slice(0, 10)
}

export default function DateRangeSelect({ value, onChange, presets = DEFAULT_PRESETS, placeholder = 'Date range', className = 'w-[200px]' }: Props) {
  const [open, setOpen] = useState(false)
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setShowCustom(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); setShowCustom(false) }
    }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouse)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const handlePreset = (preset: string) => {
    if (preset === 'custom') {
      setShowCustom(true)
      return
    }
    if (preset === 'all') {
      onChange(undefined)
      setOpen(false)
      setShowCustom(false)
      return
    }
    if (preset === 'never') {
      onChange({ preset: 'never', from: undefined, to: undefined })
      setOpen(false)
      setShowCustom(false)
      return
    }
    const { from, to } = presetToDates(preset)
    onChange({ preset, from, to })
    setOpen(false)
    setShowCustom(false)
  }

  const handleApplyCustom = () => {
    if (!customFrom || !customTo) return
    onChange({ preset: 'custom', from: new Date(customFrom), to: new Date(customTo + 'T23:59:59') })
    setOpen(false)
    setShowCustom(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(undefined)
    setCustomFrom('')
    setCustomTo('')
    setShowCustom(false)
  }

  const label = (() => {
    if (!value) return null
    if (value.preset === 'custom' && value.from && value.to) {
      return `${toInputDate(value.from)} → ${toInputDate(value.to)}`
    }
    return presets.find(p => p.value === value.preset)?.label ?? null
  })()

  return (
    <div ref={ref} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => { setOpen(v => !v); if (!open) setShowCustom(false) }}
        className="relative w-full inline-flex items-center h-8 min-h-8 px-2 gap-1.5 rounded-md border border-border-strong bg-surface shadow-sm hover:bg-hover transition-colors outline-none text-left cursor-pointer"
      >
        <span className="shrink-0 text-content-muted flex items-center">
          <Calendar size={14} />
        </span>
        <span className={`flex-1 text-xs truncate pr-4 ${label ? 'text-content-secondary font-medium' : 'text-content-faint'}`}>
          {label ?? placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`absolute right-2 text-content-faint transition-transform duration-150 ease ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {value && (
        <button
          type="button"
          tabIndex={-1}
          onClick={handleClear}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-0.5 text-content-faint hover:text-content-secondary transition-colors rounded-full cursor-pointer"
        >
          <X size={11} />
        </button>
      )}

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 w-full rounded-lg border border-border bg-surface shadow-lg overflow-hidden py-1">
          {!showCustom ? (
            presets.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => handlePreset(p.value)}
                className={[
                  'w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer',
                  value?.preset === p.value && p.value !== 'all'
                    ? 'bg-brand-500/10 text-accent font-medium'
                    : 'text-content-secondary hover:bg-surface-inset',
                ].join(' ')}
              >
                {p.label}
              </button>
            ))
          ) : (
            <div className="px-3 py-2.5 space-y-2">
              <p className="text-xs font-medium text-content-secondary mb-1">Custom range</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-content-muted w-6 shrink-0">From</span>
                <input
                  type="date"
                  value={customFrom}
                  onChange={e => setCustomFrom(e.target.value)}
                  className="flex-1 h-7 rounded-md border border-border bg-surface-inset px-2 text-xs text-content-secondary focus:outline-none focus:border-border-strong transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-content-muted w-6 shrink-0">To</span>
                <input
                  type="date"
                  value={customTo}
                  min={customFrom}
                  onChange={e => setCustomTo(e.target.value)}
                  className="flex-1 h-7 rounded-md border border-border bg-surface-inset px-2 text-xs text-content-secondary focus:outline-none focus:border-border-strong transition-colors"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustom(false)}
                  className="text-xs text-content-muted hover:text-content-secondary transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleApplyCustom}
                  disabled={!customFrom || !customTo}
                  className="px-3 py-1 text-xs rounded-md bg-brand-500/20 text-accent font-medium hover:bg-brand-500/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
