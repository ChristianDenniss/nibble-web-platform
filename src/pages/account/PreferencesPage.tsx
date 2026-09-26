/**
 * PreferencesPage — default compare preferences: ways to get food, apps, ordering direct, memberships.
 */
import DefaultPreferencesForm from '@/components/account/DefaultPreferencesForm'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import { paths } from '@/routing/paths'

export default function PreferencesPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Breadcrumb items={[{ label: 'Profile', href: paths.profile }, { label: 'Preferences' }]} />
      <header className="mb-6 mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-content">Preferences</h1>
        <p className="mt-1 text-sm text-content-secondary">
          What we include every time you compare. You can still change these for a single compare.
        </p>
      </header>
      <DefaultPreferencesForm />
    </div>
  )
}
