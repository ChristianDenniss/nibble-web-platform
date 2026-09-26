/**
 * StorefrontFooter — legal + account links under every storefront page.
 */
import { Link } from 'react-router-dom'
import { paths } from '@/routing/paths'

const LINKS = [
  { label: 'Help', to: paths.help },
  { label: 'Terms', to: paths.terms },
  { label: 'Privacy', to: paths.privacy },
  { label: 'Account', to: paths.account },
]

export default function StorefrontFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6">
        <p className="text-xs text-content-muted">Nibble</p>
        <nav className="flex flex-wrap items-center gap-4 text-xs font-medium text-content-secondary">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-content">
              {link.label}
            </Link>
          ))}
          {import.meta.env.DEV && (
            <Link to={paths.dev} className="text-accent hover:opacity-80">
              All pages
            </Link>
          )}
        </nav>
      </div>
    </footer>
  )
}
