/**
 * ProfilePage — account hub: orders, payment, addresses, preferences, manage account, help.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, CreditCard, HelpCircle, LogOut, MapPin, Receipt, Settings, SlidersHorizontal, User } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import { logout } from '@/hooks/auth/authStore'
import { currentAddress, useStorefront } from '@/hooks/storefront/useStorefront'
import { formatLocation } from '@/lib/address'
import { paths } from '@/routing/paths'
import { notify } from '@/utils/notify'

const LINKS = [
  { label: 'Past orders', to: paths.orders, icon: Receipt },
  { label: 'Payment', to: paths.payment, icon: CreditCard },
  { label: 'Addresses', to: paths.location, icon: MapPin },
  { label: 'Preferences', to: paths.preferences, icon: SlidersHorizontal },
  { label: 'Manage account', to: paths.account, icon: Settings },
  { label: 'Help', to: paths.help, icon: HelpCircle },
]

export default function ProfilePage() {
  const { loading, data, error } = useStorefront()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)

  const signOut = async () => {
    setSigningOut(true)
    try {
      await logout()
    } catch {
      notify.error('Could not reach the server; you are logged out on this device.')
    }
    navigate(paths.login, { replace: true })
  }

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Account unavailable" description={error ?? undefined} />

  const address = currentAddress(data)

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Account' }]} />
      <PageTitle icon={<User size={20} />} title="Account" />
      <section className="rounded-xl border border-border bg-surface p-5">
        <p className="text-lg font-semibold text-content">{data.account.name}</p>
        <p className="mt-1 text-sm text-content-secondary">{data.account.email}</p>
        <p className="mt-1 text-sm text-content-muted">{address ? formatLocation(address.location) : 'No address set'}</p>
      </section>
      <ul className="overflow-hidden rounded-xl border border-border bg-surface">
        {LINKS.map((item) => (
          <li key={item.to} className="border-b border-border last:border-b-0">
            <Link to={item.to} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-content hover:bg-surface-inset">
              <item.icon size={16} className="text-content-muted" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight size={16} className="text-content-muted" />
            </Link>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => { void signOut() }}
        disabled={signingOut}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <LogOut size={16} />
        {signingOut ? 'Logging out…' : 'Log out / switch account'}
      </button>
    </div>
  )
}
