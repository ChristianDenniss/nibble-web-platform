/**
 * LocationSelector — compact trigger that opens LocationPicker (dropdown on medium+, modal on small).
 * Shows the current delivery address; picking one calls `onSelect` and closes.
 * Props: `addresses`, `selected?`, `onSelect`, `onUseCurrentLocation?`, `locating?`,
 * `variant?` (`header` | `hero` | `inline`), `className?`, `placeholder?`.
 * Lives in `components/location/`; used in the header, home hero, and checkout.
 */
import { createPortal } from 'react-dom'
import { useState, type RefObject } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'
import Modal from '@/components/modals/Modal'
import LocationPicker from '@/components/location/LocationPicker'
import { useAppLayout } from '@/context/AppLayoutContext'
import { usePortalDropdown } from '@/hooks/utils/usePortalDropdown'
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
  const isSmall = layout?.isSmall ?? false
  const dropdown = usePortalDropdown(340, 320, false)
  const [modalOpen, setModalOpen] = useState(false)

  const overlayOpen = isSmall ? modalOpen : dropdown.open

  function setOpen(next: boolean) {
    if (next) layout?.setMobileNavOpen(false)
    if (isSmall) setModalOpen(next)
    else dropdown.setOpen(next)
  }

  function handleSelect(address: SavedAddress) {
    onSelect(address)
    setOpen(false)
  }

  async function handleLocate() {
    const ok = await onUseCurrentLocation?.()
    if (ok !== false) setOpen(false)
  }

  const picker = (
    <LocationPicker
      addresses={addresses}
      selectedId={selected?.id}
      onSelect={handleSelect}
      onUseCurrentLocation={onUseCurrentLocation ? () => { void handleLocate() } : undefined}
      locating={locating}
      manageTo={paths.location}
      onManageClick={() => setOpen(false)}
      compact
      autoFocusSearch
    />
  )

  return (
    <div className={`relative ${variant === 'header' ? 'shrink-0' : ''}`}>
      <button
        ref={dropdown.triggerRef as RefObject<HTMLButtonElement>}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={overlayOpen}
        aria-label={
          variant === 'inline'
            ? 'Change delivery address'
            : selected
              ? `Delivery address: ${formatLocation(selected.location)}`
              : 'Choose delivery address'
        }
        onClick={() => setOpen(!overlayOpen)}
        className={`${TRIGGER[variant]} ${className}`}
      >
        <MapPin size={16} className={`shrink-0 ${variant === 'inline' ? '' : 'text-accent'}`} />
        <span className="truncate">{triggerLabel(variant, selected, placeholder)}</span>
        {variant !== 'inline' && (
          <ChevronDown
            size={14}
            className={`shrink-0 text-content-muted transition-transform duration-150 ${overlayOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {isSmall && (
        <Modal open={modalOpen} onClose={() => setOpen(false)} title="Delivery address" size="md">
          {picker}
        </Modal>
      )}

      {!isSmall && dropdown.open && createPortal(
        <div
          ref={dropdown.dropdownRef}
          style={dropdown.dropdownStyle}
          className="scrollbar-thin rounded-xl border border-border bg-surface p-3 shadow-lg overflow-y-auto"
        >
          {picker}
        </div>,
        document.body,
      )}
    </div>
  )
}
