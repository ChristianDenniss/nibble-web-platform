/**
 * Breadcrumb — a horizontal `<nav>` trail of `›`-separated crumbs shown at the top of a page.
 * Takes `items: { label, href? }[]`; parent crumbs render as router `Link`s while the last (current) crumb is plain emphasized text, and it renders nothing when there are fewer than two items.
 * Lives in `components/navigation/`; used at the top of every page.
 */
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: Props) {
  if (items.length < 2) return null

  return (
    <nav className="flex items-center gap-1 mb-6" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-content-muted text-2xl select-none leading-none">›</span>}
            {isLast || !item.href ? (
              <span className={`text-sm ${isLast ? 'text-content font-medium' : 'text-content-muted'}`}>
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-sm text-content-muted hover:text-content transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
