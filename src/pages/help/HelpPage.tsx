/**
 * HelpPage — FAQ grouped by topic. Copy is page content, not a domain type.
 */
import { HelpCircle } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import PageTitle from '@/components/brand/PageTitle'
import { paths } from '@/routing/paths'

const FAQS = [
  { id: 'faq_compare', topic: 'Ordering', question: 'How do prices get compared?', answer: 'Each listed price is an offer we observed from a provider for that item. Checkout still happens on the provider you pick.' },
  { id: 'faq_checkout', topic: 'Ordering', question: 'Where do I pay?', answer: 'You pay on the provider site or app we send you to. We do not charge your card on this page.' },
  { id: 'faq_location', topic: 'Delivery', question: 'Why do you need my address?', answer: 'Availability, ETAs, and fees change by location. Set an address so nearby stores and offers stay accurate.' },
  { id: 'faq_account', topic: 'Account', question: 'Can I delete my account?', answer: 'Yes. Open Manage account and use the delete action. That removes saved addresses and payment labels stored here.' },
  { id: 'faq_providers', topic: 'Providers', question: 'Which providers do you cover?', answer: 'Skip and DoorDash are in the current catalog. More providers can be added in go-data-model without changing these layouts.' },
]

export default function HelpPage() {
  const topics = [...new Set(FAQS.map((faq) => faq.topic))]

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Help' }]} />
      <PageTitle icon={<HelpCircle size={20} />} title="Help & FAQ" count={FAQS.length} />
      {topics.map((topic) => (
        <section key={topic} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-content-muted">{topic}</h2>
          <ul className="space-y-2">
            {FAQS.filter((faq) => faq.topic === topic).map((faq) => (
              <li key={faq.id} className="rounded-xl border border-border bg-surface p-4">
                <p className="text-sm font-semibold text-content">{faq.question}</p>
                <p className="mt-2 text-sm text-content-secondary">{faq.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
