/**
 * PrivacyPage — privacy policy layout. Body copy is placeholder until legal review.
 */
import Breadcrumb from '@/components/navigation/Breadcrumb'
import { paths } from '@/routing/paths'

const PARAGRAPHS = [
  'We store the account details you give us: name, email, phone, addresses, and payment labels.',
  'Location is used to show nearby stores and offers. You can change or clear it on the location page.',
  'We do not sell personal information. Provider checkout happens on that provider site.',
  'You can request account deletion from Manage account.',
]

export default function PrivacyPage() {
  return (
    <article className="space-y-6">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Privacy' }]} />
      <h1 className="text-2xl font-semibold tracking-tight text-content">Privacy policy</h1>
      <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
        {PARAGRAPHS.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-content-secondary">{paragraph}</p>
        ))}
      </div>
    </article>
  )
}
