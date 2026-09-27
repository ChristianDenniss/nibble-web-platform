/**
 * StoreInfoModal — store details behind the info tip on StorePage: store open hours and delivery hours
 * (listed separately because they often differ) plus the allergen / food-preparation disclaimer.
 */
import { AlertTriangle } from 'lucide-react'
import Modal from '@/components/modals/Modal'
import type { Restaurant } from '@/generated/data-model'
import { currentInterval, formatTime, hasHours, weeklySchedule, type HoursService } from '@/lib/hours'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  restaurant: Restaurant
}

function HoursTable({ restaurant, service, title }: { restaurant: Restaurant; service: HoursService; title: string }) {
  const now = new Date()
  const today = now.getDay()
  const known = hasHours(restaurant.hours, service)
  const current = known ? currentInterval(restaurant.hours, service, now) : undefined

  return (
    <section aria-label={title} className="rounded-xl border border-border p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-content">{title}</h3>
        {known && (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-semibold',
              current ? 'bg-status-success/10 text-status-success' : 'bg-surface-inset text-content-secondary',
            )}
          >
            {current ? `Open until ${formatTime(current.closes)}` : 'Closed now'}
          </span>
        )}
      </div>
      {known ? (
        <dl className="space-y-1 text-sm">
          {weeklySchedule(restaurant.hours, service).map((day) => (
            <div
              key={day.dayOfWeek}
              className={cn(
                '-mx-2 flex justify-between gap-4 rounded-md px-2 py-1',
                day.dayOfWeek === today ? 'bg-surface-inset font-semibold text-content' : 'text-content-secondary',
              )}
            >
              <dt>
                {day.label}
                {day.dayOfWeek === today && <span className="sr-only"> (today)</span>}
              </dt>
              <dd className="text-right tabular-nums">
                {day.intervals.length === 0
                  ? 'Closed'
                  : day.intervals.map((interval) => (
                      <span key={interval.opens} className="block">
                        {formatTime(interval.opens)} – {formatTime(interval.closes)}
                      </span>
                    ))}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-content-secondary">Hours not listed. Check with the restaurant.</p>
      )}
    </section>
  )
}

export default function StoreInfoModal({ open, onClose, restaurant }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={restaurant.name} size="lg">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="grid gap-3 small:grid-cols-2">
            <HoursTable restaurant={restaurant} service="store" title="Open hours" />
            <HoursTable restaurant={restaurant} service="delivery" title="Delivery hours" />
          </div>
          <p className="text-xs text-content-muted">
            Delivery can start later or end earlier than the store is open. Hours may change on holidays.
          </p>
        </div>

        <section aria-labelledby="store-info-allergens" className="rounded-xl bg-status-warning/10 p-4">
          <h3 id="store-info-allergens" className="flex items-center gap-2 text-base font-semibold text-content">
            <AlertTriangle size={18} className="shrink-0 text-status-warning" aria-hidden="true" />
            Allergens and food preparation
          </h3>
          <div className="mt-2 space-y-2 text-sm text-content-secondary">
            <p>
              Nibble compares prices across delivery apps. We don't prepare, cook, package or deliver food, and we
              aren't involved in how {restaurant.name} handles ingredients.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Menu items may contain or come into contact with common allergens, including peanuts, tree nuts,
                sesame, milk, eggs, fish, shellfish, soy, wheat, mustard and sulphites.
              </li>
              <li>Shared kitchens can't guarantee any item is allergen-free.</li>
              <li>
                Descriptions and ingredients come from the restaurant and delivery apps, and may be incomplete or out
                of date.
              </li>
              <li>
                If you have a food allergy or dietary restriction, contact the restaurant before ordering
                {restaurant.phone ? (
                  <>
                    {' '}at{' '}
                    <a href={`tel:${restaurant.phone.replace(/[^\d+]/g, '')}`} className="font-medium text-content underline">
                      {restaurant.phone}
                    </a>
                  </>
                ) : null}
                .
              </li>
            </ul>
          </div>
        </section>
      </div>
    </Modal>
  )
}
