/**
 * CheckoutPage — review address / payment, then hand the user off to a provider.
 */
import { Link } from 'react-router-dom'
import { CreditCard, ExternalLink, MapPin } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import Button from '@/components/buttons/Button'
import LocationSelector from '@/components/location/LocationSelector'
import { formatMoney } from '@/lib/money'
import { formatLocation } from '@/lib/address'
import { selectDeliveryAddress } from '@/hooks/location/deliveryLocationStore'
import { useDeviceLocation } from '@/hooks/location/useDeviceLocation'
import { currentAddress, useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function CheckoutPage() {
  const { loading, data, error } = useStorefront()
  const { locating, locate } = useDeviceLocation()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Checkout unavailable" description={error ?? undefined} />
  if (data.cart.lines.length === 0) {
    return <EmptyState title="Nothing to check out" action={<Link to={paths.cart} className="text-sm text-accent">Back to cart</Link>} />
  }

  const address = currentAddress(data)
  const payment = data.account.paymentMethods.find((method) => method.default) ?? data.account.paymentMethods[0]
  const providerId = data.cart.lines[0]?.providerId
  const provider = data.providers.find((entry) => entry.id === providerId)
  const subtotal = data.cart.lines.reduce((sum, line) => {
    const offer = data.offers.find((entry) => entry.menuItemId === line.menuItemId && entry.providerId === line.providerId)
    return sum + (offer?.price.amountCents ?? 0) * line.quantity
  }, 0)

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Cart', href: paths.cart }, { label: 'Checkout' }]} />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-content">Checkout</h1>
        <p className="mt-1 text-sm text-content-secondary">
          Review the details, then continue on {provider?.name ?? 'the provider'}. We do not take payment here.
        </p>
      </div>

      <div className="grid gap-4 small:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-content">
            <MapPin size={16} className="text-accent" />
            Delivery
          </h2>
          <p className="mt-3 text-sm text-content">{address ? formatLocation(address.location) : 'No address'}</p>
          <LocationSelector
            className="mt-2"
            variant="inline"
            addresses={data.account.addresses}
            selected={address}
            onSelect={(next) => selectDeliveryAddress(next.id)}
            onUseCurrentLocation={() => locate(data.account.addresses)}
            locating={locating}
          />
        </section>
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-content">
            <CreditCard size={16} className="text-accent" />
            Payment on file
          </h2>
          <p className="mt-3 text-sm text-content">
            {payment ? `${payment.brand} ···· ${payment.last4}` : 'No card saved'}
          </p>
          <Link to={paths.payment} className="mt-2 inline-block text-sm font-medium text-accent">Manage</Link>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-content-secondary">Estimated subtotal</span>
          <span className="font-semibold text-accent">{formatMoney(subtotal)}</span>
        </div>
        <p className="mt-3 text-xs text-content-muted">
          Final total, fees, and payment method are confirmed after we send you to {provider?.name ?? 'the provider'}.
        </p>
        <Button className="mt-5 w-full">
          <ExternalLink size={14} />
          Continue to {provider?.name ?? 'provider'}
        </Button>
      </section>
    </div>
  )
}
