import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageLoader from '@/components/layout/PageLoader'
import EmptyState from '@/components/misc/EmptyState'
import RestaurantCard from '@/components/storefront/RestaurantCard'
import ProviderLogo from '@/components/brand/ProviderLogo'
import { useStorefront, restaurantProviders } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'
import catalog from '@/catalog/catalog.json'
export default function SourceMenuPage() {
  const { loading, data, error } = useStorefront()
  const [provider, setProvider] = useState('prov_ubereats')
  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Menus unavailable" description={error ?? undefined} />
  const providerIds: Record<string, string[]> = catalog.providerIds
  const restaurants = data.restaurants.filter(restaurant => providerIds[restaurant.id]?.includes(provider))
  return <div className="space-y-6"><h1 className="text-2xl font-semibold">Browse by channel</h1><div className="flex flex-wrap gap-3">{data.providers.map(entry => <button key={entry.id} onClick={() => setProvider(entry.id)} aria-pressed={provider === entry.id} className={`flex items-center gap-2 rounded-lg border px-4 py-3 ${provider === entry.id ? 'border-accent bg-brand/10' : 'border-border'}`}><ProviderLogo provider={entry} className="size-7" />{entry.name}</button>)}</div><div className="grid gap-5 small:grid-cols-2 large:grid-cols-3">{restaurants.map(restaurant => <RestaurantCard key={restaurant.id} restaurant={restaurant} providers={restaurantProviders(data,restaurant.id)} reason={restaurant.location.address} />)}</div><Link to={paths.home} className="text-sm text-accent">All restaurants</Link></div>
}
