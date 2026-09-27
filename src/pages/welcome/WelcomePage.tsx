/**
 * WelcomePage — guest splash shown once per browser session: "What are you craving?" search.
 * New users also get the delivery location picker here before their first search.
 * Signed-in users never see it; visiting /welcome sends them home.
 */
import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import AppLogo from '@/components/brand/AppLogo'
import LocationPicker from '@/components/location/LocationPicker'
import PageLoader from '@/components/layout/PageLoader'
import EmptyState from '@/components/misc/EmptyState'
import SearchBar from '@/components/navigation/SearchBar'
import { useAuth } from '@/hooks/auth/authStore'
import { useAccountAddresses } from '@/hooks/location/useAccountAddresses'
import { useDropPin } from '@/hooks/location/useDropPin'
import { useDeviceLocation } from '@/hooks/location/useDeviceLocation'
import { useDeliveryLocationState } from '@/hooks/location/deliveryLocationStore'
import { isOnboarded, markOnboarded, markSplashSeen } from '@/hooks/onboarding/onboardingStore'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { paths, searchPath } from '@/routing/paths'

export default function WelcomePage() {
  const { status } = useAuth()
  if (status === 'loading') return <PageLoader />
  if (status === 'authenticated') return <Navigate to={paths.home} replace />
  return <WelcomeView status={status} />
}

function WelcomeView({ status }: { status: 'authenticated' | 'guest' }) {
  const { loading, data, error } = useStorefront()
  const { locating, locate } = useDeviceLocation()
  const { dropping, drop } = useDropPin()
  const { pickAddress } = useAccountAddresses(() => undefined)
  const { selectedId } = useDeliveryLocationState()
  const routeLocation = useLocation()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const routeState = routeLocation.state as { locationRequired?: boolean; from?: string } | null
  const destination = routeState?.from ?? paths.home
  const locationRequired = routeState?.locationRequired === true || !isOnboarded()

  useEffect(() => {
    markSplashSeen()
  }, [])

  if (loading) return <PageLoader />
  if (!data) {
    return <EmptyState title="Nothing to browse yet" description={error ?? 'Storefront catalog is empty.'} />
  }

  const needsLocation = locationRequired && (
    selectedId === null && (status === 'guest' || data.account.addresses.length === 0)
  )
  if (locationRequired && !needsLocation) return <Navigate to={destination} replace />

  const finishLocation = () => {
    markOnboarded()
    navigate(destination, { replace: true })
  }

  const selectLocation = async (next: Parameters<typeof pickAddress>[0]) => {
    if (await pickAddress(next)) finishLocation()
  }

  const handleUseCurrentLocation = async () => {
    if (await locate(data.account.addresses, pickAddress)) finishLocation()
  }

  const dropLocation = async (coords: { latitude: number; longitude: number }) => {
    await drop(coords)
    finishLocation()
  }

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (needsLocation) return
    markOnboarded()
    navigate(query.trim() ? searchPath(query) : destination)
  }

  return (
    <section className="relative isolate flex flex-col items-center overflow-hidden py-8 text-center small:py-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <span className="food-doodle food-doodle--pizza">🍕</span>
        <span className="food-doodle food-doodle--burger">🍔</span>
        <span className="food-doodle food-doodle--taco">🌮</span>
        <span className="food-doodle food-doodle--fries">🍟</span>
        <span className="food-doodle food-doodle--noodles">🍜</span>
        <span className="food-doodle food-doodle--avocado">🥑</span>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center">
        <AppLogo className="mb-6 h-24 w-auto small:h-32" />
        {needsLocation && (
          <div className="mb-8 w-full max-w-4xl text-left">
            <div className="mb-4 text-center">
              <p className="text-sm font-medium uppercase tracking-wide text-accent">Before we start</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-content">Where will you be ordering from?</h1>
              <p className="mt-2 text-sm text-content-secondary">Choose a delivery location so we can show nearby restaurants and accurate options.</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-surface text-left shadow-sm">
              <LocationPicker
                addresses={data.account.addresses}
                selectedId={selectedId}
                onSelect={(next) => { void selectLocation(next) }}
                onDropPin={(coords) => { void dropLocation(coords) }}
                onUseCurrentLocation={() => { void handleUseCurrentLocation() }}
                locating={locating}
                dropping={dropping}
                layout="split"
                autoFocusSearch
              />
            </div>
          </div>
        )}

        <p className="mb-3 text-sm font-medium text-accent">Good food, zero overthinking.</p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-content small:text-6xl">
          What are you <span className="text-accent">craving?</span>
        </h1>
        <p className="mt-4 text-base text-content-secondary">Say the word. We’ll find your next bite.</p>

        {!needsLocation && <form onSubmit={search} className="mt-8 flex w-full max-w-xl gap-2">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Tacos, noodles, something crispy..."
            size="lg"
            className="min-w-0 flex-1"
          />
          <button
            type="submit"
            aria-label="Search food"
            className="inline-flex h-11 w-12 shrink-0 items-center justify-center rounded-lg bg-brand text-on-brand transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <ArrowRight size={18} />
          </button>
        </form>}

        {!needsLocation && <Link
          to={paths.home}
          onClick={markOnboarded}
          className="mt-6 text-sm font-medium text-accent hover:underline"
        >
          Just browse
        </Link>}
      </div>
    </section>
  )
}
