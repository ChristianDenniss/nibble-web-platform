import { useEffect, useState } from 'react'
import catalog from '@/catalog/catalog.json'
import { availablePromotions, restaurantPromotions } from '@/catalog/promotions'

const names: Record<string, string> = { prov_ubereats: 'Uber Eats', prov_doordash: 'DoorDash', prov_skip: 'SkipTheDishes', prov_direct: 'Restaurant app' }
const checkedDateFormat = new Intl.DateTimeFormat('en-CA', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Moncton' })

export default function PromotionList({ providerIds, restaurantName }: { providerIds: string[]; restaurantName: string }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])
  const promotions = availablePromotions(restaurantPromotions(catalog.promotions), providerIds, restaurantName, now)
  if (!promotions.length) return null
  return <details className="mt-3 rounded-lg border border-border p-3">
    <summary className="cursor-pointer text-sm font-semibold text-accent">Offers to check ({promotions.length})</summary>
    <p className="mt-2 text-xs text-content-muted">Eligibility is confirmed at checkout. These offers are not included in the item subtotal.</p>
    <ul className="mt-3 space-y-4">{promotions.map(promotion => <li key={promotion.id}>
      <p className="text-sm font-semibold text-content">{promotion.title}</p>
      <p className="mt-1 text-xs text-content-muted">{names[promotion.providerId]}{promotion.code && <> · Code <span className="font-mono font-semibold">{promotion.code}</span></>}{promotion.expiresOn && <> · Through {promotion.expiresOn}</>} · Last checked {checkedDateFormat.format(new Date(promotion.verifiedAt ?? promotion.reviewedAt))}</p>
      <p className="mt-1 text-xs leading-relaxed text-content-secondary">{promotion.terms}</p>
      <a href={promotion.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs font-semibold text-accent hover:underline">Official offer details ↗</a>
    </li>)}</ul>
  </details>
}
