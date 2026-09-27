import catalog from '@/catalog/catalog.json'

const ordering: Record<string, { orderUrl: string; sourceUrl: string; note: string }> = catalog.merchantOrdering

export default function MerchantOrdering({ restaurantId }: { restaurantId: string }) {
  const merchant = ordering[restaurantId]
  if (!merchant) return null
  return <div className="rounded-xl border border-border bg-surface p-4">
    <a href={merchant.orderUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accent hover:underline">Order from the restaurant ↗</a>
    <p className="mt-1 text-xs leading-relaxed text-content-secondary">{merchant.note}</p>
  </div>
}
