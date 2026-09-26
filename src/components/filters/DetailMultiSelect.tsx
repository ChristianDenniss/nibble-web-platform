/**
 * DetailMultiSelect — portal-rendered multi-select dropdown with checkbox rows, select-all/clear controls, and optional search, showing an "N of M {noun}s" summary label on its trigger.
 * Props: `ids`, `getLabel(id)`, `selected`, `onChange`, `icon`, `noun`, `searchable?`; positioned via `usePortalDropdown`.
 * Lives in `components/filters/`; used on the dashboard model/dataset detail pages to pick which items to compare.
 */
import { useState } from 'react'
import type { RefObject } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check, Search } from 'lucide-react'
import { usePortalDropdown } from '@/hooks/utils/usePortalDropdown'

interface DetailMultiSelectProps {
  ids:        string[]
  getLabel:   (id: string) => string
  selected:   Set<string>
  onChange:   (ids: Set<string>) => void
  icon:       React.ReactNode
  noun:       string
  searchable?: boolean
}

const OPTION_HEIGHT       = 34
const DROPDOWN_PADDING    = 52
const SEARCH_BAR_HEIGHT   = 44
const MAX_DROPDOWN_HEIGHT = 380
const DEFAULT_WIDTH       = 240
const SEARCHABLE_WIDTH    = 260

export default function DetailMultiSelect({ ids, getLabel, selected, onChange, icon, noun, searchable }: DetailMultiSelectProps) {
  const [query, setQuery] = useState('')

  const { open, setOpen, dropdownStyle, triggerRef, dropdownRef } = usePortalDropdown(
    Math.min(
      ids.length * OPTION_HEIGHT + DROPDOWN_PADDING + (searchable ? SEARCH_BAR_HEIGHT : 0),
      MAX_DROPDOWN_HEIGHT,
    ),
    searchable ? SEARCHABLE_WIDTH : DEFAULT_WIDTH,
  )

  const filteredIds  = searchable && query
    ? ids.filter(id => getLabel(id).toLowerCase().includes(query.toLowerCase()))
    : ids

  const allSelected = selected.size === ids.length && ids.length > 0
  const label = ids.length === 0
    ? `No ${noun}s`
    : allSelected
    ? `All ${ids.length} ${noun}${ids.length === 1 ? '' : 's'}`
    : `${selected.size} of ${ids.length} ${noun}s`

  function toggle(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange(next)
  }

  function handleOpen() {
    setQuery('')
    setOpen(v => !v)
  }

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef as RefObject<HTMLButtonElement>}
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center h-8 px-3 gap-1.5 rounded-md border border-border-strong bg-surface shadow-sm hover:bg-surface-raised transition-colors text-xs text-content-secondary font-medium cursor-pointer"
      >
        <span className="text-content-muted">{icon}</span>
        <span>{label}</span>
        <ChevronDown
          size={13}
          className={`text-content-muted transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && createPortal(
        <div
          ref={dropdownRef}
          style={{ ...dropdownStyle, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          className="rounded-lg border border-border bg-surface shadow-lg"
        >
          {/* Search input - sticky, doesn't scroll */}
          {searchable && (
            <div className="px-2 pt-2 pb-1.5 border-b border-border shrink-0">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={`Search ${noun}s…`}
                  autoFocus
                  className="w-full pl-7 pr-2 py-1.5 text-xs bg-surface-inset border border-border rounded-md outline-none focus:border-accent text-content placeholder:text-content-muted transition-colors"
                />
              </div>
            </div>
          )}

          {/* Select all / clear - sticky */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border shrink-0">
            <button
              type="button"
              onClick={() => onChange(new Set(ids))}
              className="text-[11px] text-accent hover:underline cursor-pointer"
            >
              Select all
            </button>
            <span className="text-content-muted text-[11px]">·</span>
            <button
              type="button"
              onClick={() => onChange(new Set())}
              className="text-[11px] text-content-tertiary hover:underline cursor-pointer"
            >
              Clear
            </button>
            {query && (
              <>
                <span className="text-content-muted text-[11px]">·</span>
                <span className="text-[11px] text-content-muted">{filteredIds.length} match{filteredIds.length !== 1 ? 'es' : ''}</span>
              </>
            )}
          </div>

          {/* Scrollable item list */}
          <div className="overflow-y-auto flex-1 py-1">
            {filteredIds.length === 0 ? (
              <p className="px-3 py-3 text-xs text-content-muted text-center">No {noun}s match "{query}"</p>
            ) : (
              filteredIds.map(id => {
                const checked = selected.has(id)
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggle(id)}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-xs hover:bg-surface-inset transition-colors cursor-pointer"
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        checked ? 'bg-accent border-accent' : 'border-border-strong'
                      }`}
                    >
                      {checked && <Check size={9} className="text-on-accent" />}
                    </span>
                    <span className="truncate font-mono text-content-secondary">{getLabel(id)}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
