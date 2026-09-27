/**
 * LocationPage — manage delivery addresses: pick current, drop a pin, remove saved entries.
 */
import { useState } from 'react'
import { MapPin } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import ConfirmModal from '@/components/modals/ConfirmModal'
import LocationPicker from '@/components/location/LocationPicker'
import { useAccountAddresses } from '@/hooks/location/useAccountAddresses'
import { useDeviceLocation } from '@/hooks/location/useDeviceLocation'
import { useDropPin } from '@/hooks/location/useDropPin'
import { currentAddress, useStorefront } from '@/hooks/storefront/useStorefront'
import type { SavedAddress } from '@/generated/data-model'
import { formatLocation } from '@/lib/address'
import { paths } from '@/routing/paths'

export default function LocationPage() {
  const { loading, data, error, reload } = useStorefront()
  const { locating, locate } = useDeviceLocation()
  const { dropping, drop } = useDropPin()
  const { pickAddress, removeAddress, busy: addressBusy } = useAccountAddresses(reload)
  const [pendingRemove, setPendingRemove] = useState<SavedAddress | null>(null)

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Location unavailable" description={error ?? undefined} />

  const selected = currentAddress(data)

  async function handleConfirmRemove() {
    if (!pendingRemove) return
    const ok = await removeAddress(pendingRemove.id)
    if (ok) setPendingRemove(null)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Account', href: paths.profile }, { label: 'Manage addresses' }]} />
      <PageTitle icon={<MapPin size={20} />} title="Manage addresses" />
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <LocationPicker
          addresses={data.account.addresses}
          selectedId={selected?.id}
          onSelect={(address) => { void pickAddress(address) }}
          onRemove={(address) => setPendingRemove(address)}
          onDropPin={(coords) => { void drop(coords) }}
          onUseCurrentLocation={() => { void locate(data.account.addresses, pickAddress) }}
          locating={locating}
          dropping={dropping}
        />
      </div>

      <ConfirmModal
        open={pendingRemove !== null}
        onClose={() => setPendingRemove(null)}
        onConfirm={() => { void handleConfirmRemove() }}
        danger
        loading={addressBusy}
        title="Remove this address?"
        description={
          pendingRemove ? (
            <>
              <span className="font-medium text-content">{pendingRemove.label}</span>
              {' — '}
              {formatLocation(pendingRemove.location)}
              {' '}will be removed from your saved addresses.
            </>
          ) : (
            ''
          )
        }
        confirmLabel="Remove"
        busyLabel="Removing…"
      />
    </div>
  )
}
