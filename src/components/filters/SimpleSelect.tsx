/**
 * SimpleSelect — plain single-select ("pick one") dropdown built on the same trigger + portal-panel pattern as FilterSelect (not a native `<select>`, so it picks up theme tokens), with an optional icon and a clear button.
 * Props: `icon?`, `placeholder`, `value`, `onChange`, `options`, `className?`. Use instead of FilterSelect when there's no include/exclude concept.
 * Lives in `components/filters/`; e.g. choosing a saved view.
 */
import { createPortal } from 'react-dom'
import { ChevronDown, Check, X } from 'lucide-react'
import type { MouseEvent, ReactElement, RefObject } from 'react'
import { usePortalDropdown } from '@/hooks/utils/usePortalDropdown'

export interface SimpleSelectOption {
  label: string
  value: string
}

interface Props {
  icon?: ReactElement
  placeholder: string
  value: string
  onChange: (value: string) => void
  options: SimpleSelectOption[]
  className?: string
  /** Keep the trigger label muted even once a value is selected - for a control like "sort"
   * where a value is always selected and shouldn't visually compete with active filters. */
  mutedLabel?: boolean
}

export default function SimpleSelect({ icon, placeholder, value, onChange, options, className = 'w-44', mutedLabel = false }: Props) {
  const { open, setOpen, dropdownStyle, triggerRef, dropdownRef } = usePortalDropdown(options.length * 32 + 8, 160, false)
  const selected = options.find(o => o.value === value)

  function select(v: string) {
    onChange(v)
    setOpen(false)
  }

  function clear(e: MouseEvent) {
    e.stopPropagation()
    onChange('')
    setOpen(false)
  }

  return (
    <div className={`relative shrink-0 ${className}`}>

      {/* Trigger */}
      <button
        ref={triggerRef as RefObject<HTMLButtonElement>}
        type="button"
        onClick={() => setOpen(v => !v)}
        className="relative w-full inline-flex items-center h-8 min-h-8 px-2 gap-1.5 rounded-md border border-border-strong bg-surface shadow-sm transition-colors outline-none text-left hover:bg-surface-inset cursor-pointer"
      >
        {icon && <span className="shrink-0 text-content-muted flex items-center">{icon}</span>}
        <span className={`flex-1 text-xs truncate pr-4 ${selected && !mutedLabel ? 'text-content' : 'text-content-muted'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`absolute right-2 text-content-muted transition-transform duration-150 ease ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Clear */}
      {selected && (
        <button
          type="button"
          tabIndex={-1}
          onClick={clear}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-0.5 text-content-muted hover:text-content-secondary transition-colors rounded-full cursor-pointer"
        >
          <X size={11} />
        </button>
      )}

      {/* Dropdown */}
      {open && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="scrollbar-thin rounded-lg border border-border bg-surface shadow-lg overflow-y-auto py-1"
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs text-content-muted">No options</div>
          ) : options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => select(opt.value)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                opt.value === value ? 'text-accent font-medium bg-accent/10' : 'text-content-secondary hover:bg-surface-inset'
              }`}
            >
              <span className="flex-1 truncate select-none">{opt.label}</span>
              {opt.value === value && <Check size={12} className="shrink-0" />}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  )
}
