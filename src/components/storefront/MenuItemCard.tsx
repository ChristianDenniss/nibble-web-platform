/**
 * MenuItemCard — compact food-item row used on store and search layouts.
 */
import { Link } from 'react-router-dom'
import CoverBlock from './CoverBlock'
import { coverTone } from '@/lib/coverTone'
import { formatMoney } from '@/lib/money'
import { paths } from '@/routing/paths'
import type { Item } from '@/generated/data-model'

interface Props {
  item: Item
  storeId: string
  priceCents?: number | null
  currency?: string
}

export default function MenuItemCard({ item, storeId, priceCents, currency = 'CAD' }: Props) {
  return (
    <Link
      to={paths.item(storeId, item.id)}
      className="flex gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:bg-surface-brand-hover"
    >
      <CoverBlock tone={coverTone(item.id)} label={item.name.slice(0, 1)} className="h-20 w-20 shrink-0" />
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-content">{item.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-content-muted">{item.description}</p>
        {priceCents != null && (
          <p className="mt-2 text-sm font-medium text-accent">{formatMoney(priceCents, currency)}</p>
        )}
      </div>
    </Link>
  )
}
