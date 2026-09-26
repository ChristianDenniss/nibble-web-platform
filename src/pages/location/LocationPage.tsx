/**
 * LocationPage — pick or confirm a delivery address.
 */
import { MapPin } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import Button from '@/components/buttons/Button'
import Pill from '@/components/pills/Pill'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function LocationPage() {
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Location unavailable" description={error ?? undefined} />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Location' }]} />
      <PageTitle icon={<MapPin size={20} />} title="Delivery address" />
      <form className="space-y-3 rounded-xl border border-border bg-surface p-5" onSubmit={(event) => event.preventDefault()}>
        <Label htmlFor="address-search">Search for an address</Label>
        <Input id="address-search" placeholder="Street, city, or postal code" />
        <Button type="button" variant="secondary">Use current location</Button>
      </form>
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-content">Saved</h2>
        <ul className="space-y-2">
          {data.account.addresses.map((address) => (
            <li key={address.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface p-4">
              <div>
                <p className="text-sm font-semibold text-content">{address.label}</p>
                <p className="mt-1 text-sm text-content-secondary">
                  {address.location.address}, {address.location.city} {address.location.region} {address.location.postalCode}
                </p>
              </div>
              {address.current ? <Pill accent>Current</Pill> : <Button variant="ghost" size="sm">Use</Button>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
