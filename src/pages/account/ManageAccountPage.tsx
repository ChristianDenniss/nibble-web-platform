/**
 * ManageAccountPage — name, email, phone, and account-level actions.
 */
import { Settings } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import Button from '@/components/buttons/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function ManageAccountPage() {
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Account unavailable" description={error ?? undefined} />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Profile', href: paths.profile }, { label: 'Manage account' }]} />
      <PageTitle icon={<Settings size={20} />} title="Manage account" />
      <form className="max-w-lg space-y-4 rounded-xl border border-border bg-surface p-5" onSubmit={(event) => event.preventDefault()}>
        <div className="space-y-1.5">
          <Label htmlFor="acct-name">Name</Label>
          <Input id="acct-name" defaultValue={data.account.name} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="acct-email">Email</Label>
          <Input id="acct-email" type="email" defaultValue={data.account.email} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="acct-phone">Phone</Label>
          <Input id="acct-phone" defaultValue={data.account.phone} />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
      <section className="max-w-lg rounded-xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-content">Danger zone</h2>
        <p className="mt-1 text-sm text-content-secondary">Delete removes saved addresses and payment labels stored here.</p>
        <Button type="button" variant="danger" className="mt-4">Delete account</Button>
      </section>
    </div>
  )
}
