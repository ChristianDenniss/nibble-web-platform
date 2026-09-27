/**
 * StorefrontFooter — help and legal links under every storefront page.
 */
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '@/routing/paths'

const LINKS = [
  { label: 'Help', to: paths.help },
  { label: 'Terms', to: paths.terms },
  { label: 'Privacy', to: paths.privacy },
]

export default function StorefrontFooter() {
  const links: Array<{ label: string; to: string; className?: string }> = import.meta.env.DEV
    ? [...LINKS, { label: 'All pages', to: paths.dev, className: 'text-accent hover:opacity-80' }]
    : LINKS

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6">
        <p className="text-xs text-content-muted">Nibble</p>
        <nav className="flex flex-wrap items-center gap-3 text-xs font-medium text-content-secondary">
          {links.map((link, index) => (
            <Fragment key={link.to}>
              {index > 0 && <span aria-hidden="true" className="text-content-muted">|</span>}
              <Link to={link.to} className={link.className ?? 'hover:text-content'}>
                {link.label}
              </Link>
            </Fragment>
          ))}
        </nav>
      </div>
    </footer>
  )
}
