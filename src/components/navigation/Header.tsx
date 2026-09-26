/**
 * Header — storefront top bar: wordmark, location picker, search, cart, account.
 * On the small tier the search row sits under the bar and a menu lists the rest.
 */
import { useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, ShoppingBag, User, X } from 'lucide-react'
import AppLogo from '@/components/brand/AppLogo'
import CountBadge from '@/components/badges/CountBadge'
import LocationSelector from '@/components/location/LocationSelector'
import SearchBar from '@/components/navigation/SearchBar'
import { useAppLayout } from '@/context/AppLayoutContext'
import { useAccountAddresses } from '@/hooks/location/useAccountAddresses'
import { useDeviceLocation } from '@/hooks/location/useDeviceLocation'
import { currentAddress, useStorefront } from '@/hooks/storefront/useStorefront'
import { appNav } from '@/routing/appNav'
import { paths, searchPath } from '@/routing/paths'

export default function Header() {
  const layout = useAppLayout()
  const open = layout?.mobileNavOpen ?? false
  const navigate = useNavigate()
  const storefront = useStorefront()
  const { pickAddress } = useAccountAddresses(storefront.reload)
  const { locating, locate } = useDeviceLocation()
  const [query, setQuery] = useState('')

  const address = storefront.data ? currentAddress(storefront.data) : null
  const addresses = storefront.data?.account.addresses ?? []
  const cartCount = storefront.data?.cart.lines.reduce((sum, line) => sum + line.quantity, 0) ?? 0

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    navigate(searchPath(query))
  }

  const locationSelector = (
    <LocationSelector
      addresses={addresses}
      selected={address}
      onSelect={(next) => { void pickAddress(next) }}
      onUseCurrentLocation={() => { void locate(addresses, pickAddress) }}
      locating={locating}
    />
  )

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5">
        <Link to={paths.home} aria-label="Nibble home" className="flex shrink-0 items-center gap-2">
          <AppLogo mark="n" className="h-9 w-auto" />
          <span className="hidden text-base font-semibold tracking-tight text-content small:inline">
            Nibble
          </span>
        </Link>

        {locationSelector}

        <form onSubmit={submitSearch} className="hidden min-w-0 flex-1 small:block">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search restaurants and dishes"
            size="md"
          />
        </form>

        <nav className="ml-auto hidden shrink-0 items-center gap-1 small:flex">
          <Link
            to={paths.cart}
            className="relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-content-secondary hover:text-content"
          >
            <ShoppingBag size={18} />
            Cart
            {cartCount > 0 && <CountBadge count={cartCount} size="sm" />}
          </Link>
          <Link
            to={paths.profile}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-content-secondary hover:text-content"
          >
            <User size={18} />
            Account
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1 small:hidden">
          <Link to={paths.cart} className="relative rounded-md p-2 text-content-secondary hover:bg-surface-inset" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5">
                <CountBadge count={cartCount} size="sm" />
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={() => layout?.setMobileNavOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md p-2 text-content-secondary hover:bg-surface-inset hover:text-content"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <form onSubmit={submitSearch} className="border-t border-border px-5 py-2 small:hidden">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search restaurants and dishes"
          size="md"
        />
      </form>

      {open && (
        <nav className="border-t border-border px-5 py-3 small:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {appNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === paths.home}
                onClick={() => layout?.setMobileNavOpen(false)}
                className={({ isActive }) => [
                  'rounded-md px-3 py-2 text-sm font-medium',
                  isActive ? 'bg-brand/10 text-accent' : 'text-content-secondary',
                ].join(' ')}
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to={paths.profile}
              onClick={() => layout?.setMobileNavOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-content-secondary"
            >
              Account
            </Link>
            <Link
              to={paths.login}
              onClick={() => layout?.setMobileNavOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-content-secondary"
            >
              Log in
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
