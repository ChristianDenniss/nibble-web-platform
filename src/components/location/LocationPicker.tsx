/**
 * LocationPicker — the address-picking panel: search saved addresses, use device GPS, pick one.
 * Presentational; the parent owns the selected id and GPS request. Optional `manageTo` adds a
 * footer link to the full location page.
 * Props: `addresses`, `selectedId?`, `onSelect`, `onUseCurrentLocation?`, `locating?`,
 * `manageTo?`, `onManageClick?`, `compact?`, `className?`, `autoFocusSearch?`.
 * Lives in `components/location/`; the body of LocationSelector and LocationPage.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Locate, MapPin } from 'lucide-react'
import SearchBar from '@/components/navigation/SearchBar'
import Button from '@/components/buttons/Button'
import EmptyState from '@/components/misc/EmptyState'
import Pill from '@/components/pills/Pill'
import type { SavedAddress } from '@/generated/data-model'
import { addressesMatchQuery, formatLocation } from '@/lib/address'

interface Props {
  addresses: SavedAddress[]
  selectedId?: string | null
  onSelect: (address: SavedAddress) => void
  onUseCurrentLocation?: () => void
  locating?: boolean
  manageTo?: string
  onManageClick?: () => void
  compact?: boolean
  className?: string
  autoFocusSearch?: boolean
}

export default function LocationPicker({
  addresses,
  selectedId,
  onSelect,
  onUseCurrentLocation,
  locating = false,
  manageTo,
  onManageClick,
  compact = false,
  className = '',
  autoFocusSearch = false,
}: Props) {
  const [query, setQuery] = useState('')
  const matches = addresses.filter((address) => addressesMatchQuery(address, query))

  return (
    <div className={`flex flex-col ${compact ? 'gap-2.5' : 'gap-3'} ${className}`}>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Street, city, or postal code"
        size="md"
        autoFocus={autoFocusSearch}
      />

      {onUseCurrentLocation && (
        <Button
          type="button"
          variant="secondary"
          onClick={onUseCurrentLocation}
          disabled={locating}
          className="w-full justify-start"
        >
          <Locate size={14} />
          {locating ? 'Finding you…' : 'Use current location'}
        </Button>
      )}

      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-content-muted">Saved</h2>
        {matches.length === 0 ? (
          <EmptyState
            compact
            title={addresses.length === 0 ? 'No saved addresses yet' : 'No addresses match'}
          />
        ) : (
          <ul className="space-y-1.5" role="listbox" aria-label="Saved addresses">
            {matches.map((address) => {
              const selected = selectedId ? address.id === selectedId : address.current
              return (
                <li key={address.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => onSelect(address)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors cursor-pointer ${
                      selected
                        ? 'border-accent/40 bg-accent/10'
                        : 'border-border bg-surface hover:bg-surface-inset'
                    }`}
                  >
                    <MapPin size={16} className={`mt-0.5 shrink-0 ${selected ? 'text-accent' : 'text-content-muted'}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-content">{address.label}</span>
                        {selected && <Pill accent>Current</Pill>}
                      </span>
                      {formatLocation(address.location) !== address.label && (
                        <span className="mt-0.5 block text-sm text-content-secondary">
                          {formatLocation(address.location)}
                        </span>
                      )}
                    </span>
                    {selected && <Check size={16} className="mt-0.5 shrink-0 text-accent" />}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {manageTo && (
        <Link
          to={manageTo}
          onClick={onManageClick}
          className="text-center text-sm font-medium text-accent hover:underline"
        >
          Manage addresses
        </Link>
      )}
    </div>
  )
}
