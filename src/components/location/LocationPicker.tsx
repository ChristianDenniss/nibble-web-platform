/**
 * LocationPicker — the address-picking panel: drop a pin on the map, search saved
 * addresses, use device GPS, pick one. Presentational; the parent owns the selected
 * id, GPS request, and pin drop. Optional `manageTo` adds a footer link to the full
 * location page; optional `onRemove` shows a delete control per row (manage page).
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Locate, MapPin } from 'lucide-react'
import SearchBar from '@/components/navigation/SearchBar'
import Button from '@/components/buttons/Button'
import DeleteButton from '@/components/buttons/DeleteButton'
import EmptyState from '@/components/misc/EmptyState'
import Pill from '@/components/pills/Pill'
import LocationMap from '@/components/location/LocationMap'
import type { SavedAddress } from '@/generated/data-model'
import { addressesMatchQuery, DEFAULT_MAP_CENTER, formatLocation } from '@/lib/address'

interface Props {
  addresses: SavedAddress[]
  selectedId?: string | null
  onSelect: (address: SavedAddress) => void
  onRemove?: (address: SavedAddress) => void
  onDropPin?: (coords: { latitude: number; longitude: number }) => void
  onUseCurrentLocation?: () => void
  locating?: boolean
  dropping?: boolean
  manageTo?: string
  onManageClick?: () => void
  compact?: boolean
  layout?: 'split' | 'stack'
  flushMap?: boolean
  className?: string
  autoFocusSearch?: boolean
}

export default function LocationPicker({
  addresses,
  selectedId,
  onSelect,
  onRemove,
  onDropPin,
  onUseCurrentLocation,
  locating = false,
  dropping: _dropping = false,
  manageTo,
  onManageClick,
  compact = false,
  layout = 'split',
  flushMap = false,
  className = '',
  autoFocusSearch = false,
}: Props) {
  const [query, setQuery] = useState('')
  const matches = addresses.filter((address) => addressesMatchQuery(address, query))
  const selected = addresses.find((address) => (selectedId ? address.id === selectedId : address.current)) ?? addresses[0]
  const latitude = selected?.location.latitude ?? DEFAULT_MAP_CENTER.latitude
  const longitude = selected?.location.longitude ?? DEFAULT_MAP_CENTER.longitude
  const useSplit = layout === 'split' && !compact

  const mapShellClass = flushMap
    ? 'h-full min-h-[13rem] rounded-none border-0 small:min-h-[26rem]'
    : 'h-full min-h-[13rem] rounded-none border-0 border-b border-border small:min-h-[26rem] small:rounded-l-xl small:border-b-0'

  const mapSection =
    onDropPin &&
    (useSplit ? (
      <section
        className={`h-52 shrink-0 small:h-auto small:min-h-[26rem] small:flex-[1.15] ${
          flushMap ? 'small:border-r small:border-border' : ''
        }`}
      >
        <LocationMap
          latitude={latitude}
          longitude={longitude}
          followToken={selected?.id ?? 'none'}
          onDrop={onDropPin}
          confirming={_dropping}
          className={mapShellClass}
        />
      </section>
    ) : (
      <LocationMap
        latitude={latitude}
        longitude={longitude}
        followToken={selected?.id ?? 'none'}
        onDrop={onDropPin}
        confirming={_dropping}
        compact={compact}
      />
    ))

  const controls = (
    <>
      <div className="flex flex-col gap-2 small:flex-row small:items-center">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Street, city, or postal code"
          size="md"
          autoFocus={autoFocusSearch}
          className="min-w-0 flex-1"
        />
        {onUseCurrentLocation && (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onUseCurrentLocation}
            disabled={locating}
            className="w-full shrink-0 justify-center gap-1.5 !h-9 !bg-[var(--brand-100)] !text-content px-2.5 py-0 text-sm leading-none hover:!bg-[var(--brand-200)] small:w-auto small:whitespace-nowrap"
          >
            <Locate size={14} className="shrink-0" />
            {locating ? 'Finding you…' : 'Current Location'}
          </Button>
        )}
      </div>

      <section className={`space-y-2 ${useSplit ? 'min-h-0 flex-1 overflow-y-auto' : ''}`}>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-content-muted">Saved</h2>
        {matches.length === 0 ? (
          <EmptyState
            compact
            title={addresses.length === 0 ? 'No saved addresses yet' : 'No addresses match'}
          />
        ) : (
          <ul className="space-y-1.5" role="listbox" aria-label="Saved addresses">
            {matches.map((address) => {
              const isCurrent = selectedId ? address.id === selectedId : address.current
              return (
                <li key={address.id} className={onRemove ? 'flex items-stretch gap-1.5' : undefined}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isCurrent}
                    onClick={() => onSelect(address)}
                    className={`flex min-w-0 flex-1 items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors cursor-pointer ${
                      isCurrent
                        ? 'border-accent/40 bg-accent/10'
                        : 'border-border bg-surface hover:bg-surface-inset'
                    }`}
                  >
                    <MapPin size={16} className={`mt-0.5 shrink-0 ${isCurrent ? 'text-accent' : 'text-content-muted'}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-content">{address.label}</span>
                        {isCurrent && <Pill accent>Current</Pill>}
                      </span>
                      {formatLocation(address.location) !== address.label && (
                        <span className="mt-0.5 block text-sm text-content-secondary">
                          {formatLocation(address.location)}
                        </span>
                      )}
                    </span>
                    {isCurrent && <Check size={16} className="mt-0.5 shrink-0 text-accent" />}
                  </button>
                  {onRemove && (
                    <DeleteButton
                      size="sm"
                      title={`Remove ${address.label}`}
                      onClick={() => onRemove(address)}
                    />
                  )}
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
          className="shrink-0 text-center text-sm font-medium text-accent hover:underline"
        >
          Manage addresses
        </Link>
      )}
    </>
  )

  if (useSplit) {
    return (
      <div className={`flex min-h-0 flex-1 flex-col small:min-h-[26rem] small:flex-row ${className}`}>
        {mapSection}
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-5 small:max-w-[22rem] small:flex-none small:py-5">
          {controls}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${compact ? 'gap-2.5' : 'gap-3'} ${className}`}>
      {mapSection}
      {controls}
    </div>
  )
}

