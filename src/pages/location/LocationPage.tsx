/**
 * LocationPage — pick or confirm a delivery address.
 */
import { MapPin } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import LocationPicker from '@/components/location/LocationPicker'
import { selectDeliveryAddress } from '@/hooks/location/deliveryLocationStore'
import { useDeviceLocation } from '@/hooks/location/useDeviceLocation'
import { currentAddress, useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function LocationPage() {
  const { loading, data, error } = useStorefront()
  const { locating, locate } = useDeviceLocation()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Location unavailable" description={error ?? undefined} />

  const selected = currentAddress(data)

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Location' }]} />
      <PageTitle icon={<MapPin size={20} />} title="Delivery address" />
      <div className="rounded-xl border border-border bg-surface p-5">
        <LocationPicker
          addresses={data.account.addresses}
          selectedId={selected?.id}
          onSelect={(address) => selectDeliveryAddress(address.id)}
          onUseCurrentLocation={() => { void locate(data.account.addresses) }}
          locating={locating}
        />
      </div>
    </div>
  )
}
