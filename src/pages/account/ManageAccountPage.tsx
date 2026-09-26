/**
 * ManageAccountPage — profile details and account deletion.
 */
import type { ReactNode } from 'react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import Button from '@/components/buttons/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

function SettingsSection({ id, title, description, children }: {
  id: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid gap-4 py-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
      <div>
        <h2 id={`${id}-title`} className="text-base font-semibold text-content">{title}</h2>
        <p className="mt-1 text-sm text-content-muted">{description}</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-5 small:p-6">{children}</div>
    </section>
  )
}

export default function ManageAccountPage() {
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Account unavailable" description={error ?? undefined} />

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Breadcrumb items={[{ label: 'Profile', href: paths.profile }, { label: 'Manage account' }]} />
      <header className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-content">Manage account</h1>
        <p className="mt-1 text-sm text-content-secondary">Your contact details and account.</p>
      </header>

      <div className="mt-2 divide-y divide-border">
        <SettingsSection id="profile" title="Profile" description="How we reach you. We never share this with providers.">
          <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
            <div className="grid gap-4 small:grid-cols-2">
              <div className="space-y-1.5 small:col-span-2">
                <Label htmlFor="acct-name">Name</Label>
                <Input id="acct-name" autoComplete="name" defaultValue={data.account.name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acct-email">Email</Label>
                <Input id="acct-email" type="email" autoComplete="email" defaultValue={data.account.email} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acct-phone">Phone</Label>
                <Input id="acct-phone" type="tel" autoComplete="tel" defaultValue={data.account.phone} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </SettingsSection>

        <SettingsSection id="delete" title="Delete account" description="Permanent. This can’t be undone.">
          <div className="flex flex-col gap-4 small:flex-row small:items-center small:justify-between">
            <p className="text-sm text-content-secondary">
              Removes your profile, saved addresses, saved card labels, preferences, and alerts.
            </p>
            <Button type="button" variant="danger" className="shrink-0">Delete account</Button>
          </div>
        </SettingsSection>
      </div>
    </div>
  )
}
