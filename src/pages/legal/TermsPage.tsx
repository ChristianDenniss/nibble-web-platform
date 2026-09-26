/**
 * TermsPage — terms and conditions layout. Body copy is placeholder until legal review.
 */
import Breadcrumb from '@/components/navigation/Breadcrumb'
import { paths } from '@/routing/paths'

const PARAGRAPHS = [
  'These terms describe how this storefront lists restaurants, items, and provider offers.',
  'Checkout and payment are completed on the provider you choose. Their terms apply to that order.',
  'Listed prices are observations. Fees, taxes, and availability can change before you place the order.',
  'Do not use this service for anything unlawful. We may suspend accounts that abuse the platform.',
]

export default function TermsPage() {
  return (
    <article className="space-y-6">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Terms' }]} />
      <h1 className="text-2xl font-semibold tracking-tight text-content">Terms and conditions</h1>
      <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
        {PARAGRAPHS.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-content-secondary">{paragraph}</p>
        ))}
      </div>
    </article>
  )
}
