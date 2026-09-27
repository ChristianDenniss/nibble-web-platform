/**
 * CheckoutPage — review address / payment, then hand the user off to a provider.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, ExternalLink, MapPin, Phone, Smartphone, Store } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import LocationSelector from '@/components/location/LocationSelector'
import { formatMoney } from '@/lib/money'
import { formatLocation } from '@/lib/address'
import { useAccountAddresses } from '@/hooks/location/useAccountAddresses'
import { useDeviceLocation } from '@/hooks/location/useDeviceLocation'
import { currentAddress, useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'
import { useCartDraft } from '@/hooks/cart/useCartDraft'
import { trackCartEvent } from '@/lib/cartAnalytics'
import Button from '@/components/buttons/Button'
import Modal from '@/components/modals/Modal'

function providerURL(name: string) {
  const key = name.toLowerCase()
  if (key.includes('skip')) return 'https://www.skipthedishes.com/'
  if (key.includes('door')) return 'https://www.doordash.com/'
  if (key.includes('uber')) return 'https://www.ubereats.com/'
  if (key.includes('instacart')) return 'https://www.instacart.ca/'
  return '#'
}

export default function CheckoutPage() {
  const { loading, data, error, reload } = useStorefront()
  const { pickAddress } = useAccountAddresses(reload)
  const { locating, locate } = useDeviceLocation()
  const draft = useCartDraft(data?.cart.lines ?? [], data?.cart.id, data?.cart.accountId)
  const [handoffOpen, setHandoffOpen] = useState(false)

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Checkout unavailable" description={error ?? undefined} />
  if (draft.lines.length === 0) {
    return <EmptyState title="Nothing to check out" action={<Link to={paths.cart} className="text-sm text-accent">Back to cart</Link>} />
  }

  const address = currentAddress(data)
  const payment = data.account.paymentMethods.find((method) => method.default) ?? data.account.paymentMethods[0]
  const providerId = draft.lines[0]?.providerId
  const provider = data.providers.find((entry) => entry.id === providerId)
  const restaurant = data.restaurants.find((entry) => entry.id === draft.lines[0]?.restaurantId)
  const handoffURL = restaurant?.appURL || (provider ? providerURL(provider.name) : '#')
  const subtotal = draft.lines.reduce((sum, line) => {
    const offer = data.offers.find((entry) => entry.menuItemId === line.menuItemId && entry.providerId === line.providerId)
    return sum + (offer?.price.amountCents ?? 0) * line.quantity
  }, 0)
  const currency = data.offers.find((offer) => offer.providerId === providerId)?.price.currency ?? 'CAD'
  const handoffDetails = {
    providerId,
    restaurantId: restaurant?.id,
    totalCents: subtotal,
    currency,
    addressId: address?.id,
    targetURL: handoffURL,
  }
  const openHandoff = () => setHandoffOpen(true)
  const confirmHandoff = () => {
    trackCartEvent('handoff', handoffDetails)
    setHandoffOpen(false)
  }

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
            onSelect={(next) => { void pickAddress(next) }}
            onUseCurrentLocation={() => { void locate(data.account.addresses, pickAddress) }}
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
        <Button type="button" onClick={openHandoff} className="mt-5 h-8 w-full gap-2">
          <ExternalLink size={14} />
          Continue to {provider?.name ?? 'provider'}
        </Button>
      </section>

      <Modal open={handoffOpen} onClose={() => setHandoffOpen(false)} title="Ready to continue?">
        <div className="space-y-4">
          <p className="text-sm text-content-secondary">
            You are leaving Nibble to finish this order with {provider?.name ?? 'the provider'}.
          </p>
          <div className="rounded-lg border border-border bg-surface-inset p-4 text-sm">
            <div className="flex justify-between gap-4"><span className="text-content-secondary">Estimated total</span><span className="font-semibold text-content">{formatMoney(subtotal, currency)}</span></div>
            <div className="mt-2 flex justify-between gap-4"><span className="text-content-secondary">Delivery address</span><span className="text-right font-medium text-content">{address ? formatLocation(address.location) : 'No address selected'}</span></div>
          </div>
          <p className="text-xs text-content-muted">The provider will confirm final fees, taxes, availability, and payment.</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setHandoffOpen(false)} className="flex-1">Stay here</Button>
            <a href={handoffURL} target={handoffURL !== '#' ? '_blank' : undefined} rel={handoffURL !== '#' ? 'noreferrer' : undefined} onClick={confirmHandoff} className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-on-brand hover:opacity-90">Continue</a>
          </div>
        </div>
      </Modal>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-content">How do you want to order?</h2>
        <p className="mt-1 text-xs text-content-muted">Choose the handoff that works best for this store. Payment happens wherever you continue.</p>
        <div className="mt-4 grid gap-2 small:grid-cols-3">
          <a href={restaurant?.appURL ?? '#'} className="rounded-lg border border-accent bg-accent/10 p-3 text-left text-sm font-medium text-content"><Smartphone size={16} className="mb-2 text-accent" />Open {restaurant?.name ?? 'store'} app<span className="mt-1 block text-xs font-normal text-content-muted">Continue in app or web</span></a>
          {restaurant?.phone && <a href={`tel:${restaurant.phone.replace(/[^\d+]/g, '')}`} className="rounded-lg border border-border p-3 text-left text-sm font-medium text-content"><Phone size={16} className="mb-2 text-accent" />Call the store<span className="mt-1 block text-xs font-normal text-content-muted">Order by phone</span></a>}
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant?.location.address ?? '')}`} target="_blank" rel="noreferrer" className="rounded-lg border border-border p-3 text-left text-sm font-medium text-content"><Store size={16} className="mb-2 text-accent" />Order in person<span className="mt-1 block text-xs font-normal text-content-muted">Get directions to the store</span></a>
        </div>
      </section>
    </div>
  )
}
