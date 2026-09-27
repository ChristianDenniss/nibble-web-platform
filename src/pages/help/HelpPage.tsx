/**
 * HelpPage — one expandable FAQ list. Copy is page content, not a domain type.
 */
import { useState } from 'react'
import { HelpCircle, Minus, Plus } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import PageTitle from '@/components/brand/PageTitle'
import { paths } from '@/routing/paths'

const FAQS = [
  { id: 'faq_compare', question: 'How do prices get compared?', answer: 'Each listed price is an offer we observed from a provider for that item. Checkout still happens on the provider you pick.' },
  { id: 'faq_checkout', question: 'Where do I pay?', answer: 'You pay on the provider site or app we send you to. We do not charge your card on this page.' },
  { id: 'faq_location', question: 'Why do you need my address?', answer: 'Availability, ETAs, and fees change by location. Set an address so nearby stores and offers stay accurate.' },
  { id: 'faq_account', question: 'Can I delete my account?', answer: 'Yes. Open Manage account and use the delete action. That removes saved addresses and payment labels stored here.' },
  { id: 'faq_providers', question: 'Which providers do you cover?', answer: 'Skip, DoorDash, Uber Eats, Instacart, Grubhub, and Fantuan are in the current catalog. Not every provider operates in every city, so some may have no offers near you. More providers can be added in go-data-model without changing these layouts.' },
]

export default function HelpPage() {
  const [openFaqs, setOpenFaqs] = useState<Set<string>>(() => new Set())

  const toggleFaq = (id: string) => {
    setOpenFaqs((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: 'Home', href: paths.home }, { label: 'Help' }]} />
      <PageTitle icon={<HelpCircle size={20} />} title="Help & FAQ" count={FAQS.length} />
      <ul className="space-y-2">
        {FAQS.map((faq) => {
          const isOpen = openFaqs.has(faq.id)
          const answerId = `${faq.id}_answer`

          return (
            <li key={faq.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-4">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggleFaq(faq.id)}
                  className="flex flex-1 items-center justify-between gap-4 text-left text-sm font-semibold text-content transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span>{faq.question}</span>
                  <span aria-hidden="true" className="shrink-0 text-accent">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>
              </div>
              <div
                id={answerId}
                aria-hidden={!isOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="mt-3 text-sm text-content-secondary">{faq.answer}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
