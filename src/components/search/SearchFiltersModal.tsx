import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import Modal from '@/components/modals/Modal'
import Button from '@/components/buttons/Button'

export const SEARCH_SORTS = [
  { id: 'sort_rec', label: 'Recommended', description: 'A balanced mix of relevance and quality.' },
  { id: 'sort_eta', label: 'Fastest', description: 'Restaurants with the quickest estimated delivery.' },
  { id: 'sort_rating', label: 'Highest rated', description: 'Top-rated restaurants first.' },
] as const

interface Props {
  open: boolean
  active: string[]
  onClose: () => void
  onApply: (filters: string[]) => void
}

export default function SearchFiltersModal({ open, active, onClose, onApply }: Props) {
  const [draft, setDraft] = useState(active[0] ?? 'sort_rec')

  useEffect(() => {
    if (open) setDraft(active[0] ?? 'sort_rec')
  }, [open, active])

  return (
    <Modal open={open} onClose={onClose} title="Sort this search" size="md">
      <div className="space-y-5">
        <p className="text-sm leading-6 text-content-secondary">
          This is a one-time override for the current search. It won’t change your saved preferences.
        </p>

        <div role="radiogroup" aria-label="Sort results" className="space-y-2">
          {SEARCH_SORTS.map((sort) => {
            const selected = draft === sort.id
            return (
              <button
                key={sort.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setDraft(sort.id)}
                className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${selected ? 'border-brand bg-brand/10' : 'border-border bg-surface hover:border-border-strong hover:bg-surface-inset'}`}
              >
                <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-brand bg-brand text-on-brand' : 'border-content-muted'}`}>
                  {selected && <Check size={10} strokeWidth={3} />}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-content">{sort.label}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-content-muted">{sort.description}</span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button variant="ghost" size="sm" onClick={() => setDraft('sort_rec')}>Reset</Button>
          <Button size="sm" onClick={() => { onApply([draft]); onClose() }}>Apply</Button>
        </div>
      </div>
    </Modal>
  )
}
