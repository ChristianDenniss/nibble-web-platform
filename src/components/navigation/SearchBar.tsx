/**
 * SearchBar — a controlled text input with a leading search icon and a trailing clear (X) button.
 * Takes `value`/`onChange` (the X calls `onChange('')`), plus optional `placeholder`, `className`, `autoFocus`, and a `size` of `sm | md | lg`.
 * Lives in `components/navigation/`; used to filter lists and grids across pages.
 */
import { Search, X } from 'lucide-react'

const sizeStyles = {
  sm: 'py-1.5 text-sm',
  md: 'py-2 text-sm',
  lg: 'py-2.5 text-sm',
}

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  autoFocus?: boolean
}

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '', size = 'sm', autoFocus = false }: Props) {
  return (
    <div className={`relative flex ${className}`}>
      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-content-faint pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoFocus={autoFocus}
        className={`min-w-0 w-full flex-1 bg-surface border border-border-strong text-content rounded-lg pl-7 pr-7 placeholder:text-content-muted focus:outline-none focus:border-accent transition-colors shadow-sm ${sizeStyles[size]}`}
      />
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Clear search"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-content-muted opacity-40 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <X size={13} />
      </button>
    </div>
  )
}
