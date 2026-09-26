/**
 * LocationSelector — compact trigger that opens LocationPicker in a modal (map pin
 * dropper needs the extra room). Shows the current delivery address; picking a saved
 * address calls `onSelect` and closes. Confirming a map pin applies the delivery location.
 * Props: `addresses`, `selected?`, `onSelect`, `onUseCurrentLocation?`, `locating?`,
 * `variant?` (`header` | `hero` | `inline`), `className?`, `placeholder?`.
 * Lives in `components/location/`; used in the header, home hero, and checkout.
 */
import { useState } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'
import Modal from '@/components/modals/Modal'
import LocationPicker from '@/components/location/LocationPicker'
import { useAppLayout } from '@/context/AppLayoutContext'
import { useDropPin } from '@/hooks/location/useDropPin'
import type { SavedAddress } from '@/generated/data-model'
import { addressTriggerLabel, formatLocation } from '@/lib/address'
import { paths } from '@/routing/paths'

interface Props {
  addresses: SavedAddress[]
  selected?: SavedAddress | null
  onSelect: (address: SavedAddress) => void
  onUseCurrentLocation?: () => void | boolean | Promise<void | boolean>
  locating?: boolean
  variant?: 'header' | 'hero' | 'inline'
  className?: string
  placeholder?: string
}

const TRIGGER = {
  header:
    'inline-flex max-w-[9rem] shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-content-secondary hover:bg-surface-inset hover:text-content cursor-pointer small:max-w-[12rem]',
  hero:
    'inline-flex max-w-full items-center gap-2 text-sm text-content-secondary transition-colors hover:text-accent cursor-pointer',
  inline:
    'inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline cursor-pointer',
}

function triggerLabel(
  variant: NonNullable<Props['variant']>,
  selected: SavedAddress | null | undefined,
  placeholder: string,
): string {
  if (variant === 'inline') return selected ? 'Change' : placeholder
  if (variant === 'header') return addressTriggerLabel(selected, placeholder)
  if (!selected) return placeholder
  return formatLocation(selected.location)
}

export default function LocationSelector({
  addresses,
  selected,
  onSelect,
  onUseCurrentLocation,
  locating = false,
  variant = 'header',
  className = '',
  placeholder = 'Set location',
}: Props) {
  const layout = useAppLayout()
  const [open, setOpen] = useState(false)
  const { dropping, drop } = useDropPin()

  function handleSelect(address: SavedAddress) {
    onSelect(address)
    setOpen(false)
  }

  return (
    <div className={`relative ${variant === 'header' ? 'shrink-0' : ''}`}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={
          variant === 'inline'
            ? 'Change delivery address'
            : selected
              ? `Delivery address: ${formatLocation(selected.location)}`
              : 'Choose delivery address'
        }
        onClick={() => {
          layout?.setMobileNavOpen(false)
          setOpen((current) => !current)
        }}
        className={`${TRIGGER[variant]} ${className}`}
      >
        <MapPin size={16} className={`shrink-0 ${variant === 'inline' ? '' : 'text-accent'}`} />
        <span className="truncate">{triggerLabel(variant, selected, placeholder)}</span>
        {variant !== 'inline' && (
          <ChevronDown
            size={14}
            className={`shrink-0 text-content-muted transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delivery address"
        size="xl"
        scrollBody={false}
        bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden p-0"
      >
        <LocationPicker
          addresses={addresses}
          selectedId={selected?.id}
          onSelect={handleSelect}
          onDropPin={(coords) => { void drop(coords) }}
          onUseCurrentLocation={onUseCurrentLocation ? () => { void onUseCurrentLocation() } : undefined}
          locating={locating}
          dropping={dropping}
          manageTo={paths.location}
          onManageClick={() => setOpen(false)}
          flushMap
          autoFocusSearch
        />
      </Modal>
    </div>
  )
}
