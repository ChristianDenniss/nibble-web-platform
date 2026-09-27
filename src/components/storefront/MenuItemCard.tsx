/**
 * MenuItemCard — food-item row used on store and search layouts: name, two-line description and
 * price on the left, photo with a quick-add badge on the right. Full-bleed divided rows on the
 * `small` viewport, bordered cards above it.
 */
import { Link } from 'react-router-dom'
import CartItemAction from './CartItemAction'
import ItemImage from './ItemImage'
import { formatMoney } from '@/lib/money'
import { paths } from '@/routing/paths'
import type { Item } from '@/generated/data-model'

interface Props {
  item: Item
  storeId: string
  priceCents?: number | null
  currency?: string
  tinted?: boolean
}

export default function MenuItemCard({ item, storeId, priceCents, currency = 'CAD', tinted = false }: Props) {
  return (
    <article
      className={`group flex gap-4 border-border ${tinted ? 'bg-surface-alt' : 'bg-surface'} transition-colors hover:bg-surface-brand-hover max-small:-mx-5 max-small:border-b max-small:px-5 max-small:py-4 small:rounded-xl small:border small:p-4`}
    >
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-semibold leading-snug text-content"><Link to={paths.item(storeId, item.id)}>{item.name}</Link></h3>
        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-content-secondary">{item.description}</p>
        )}
        {priceCents != null && (
          <p className="mt-3 text-sm font-semibold text-content">From {formatMoney(priceCents, currency)}</p>
        )}
      </div>
      <div className="relative shrink-0 self-start">
        <ItemImage
          src={item.imageURL}
          alt={item.name}
          seed={item.id}
          className="size-28 rounded-xl border border-border max-small:size-24"
        />
        <div className="absolute -bottom-2 -right-2"><CartItemAction item={item} /></div>
      </div>
    </article>
  )
}
