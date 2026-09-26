/**
 * Header — product top bar with wordmark and in-flow nav links (not a dashboard rail).
 * On the small tier a menu button toggles a link list under the bar.
 * Lives in `components/navigation/`.
 */
import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { appNav } from '@/routing/appNav'
import { useAppLayout } from '@/context/AppLayoutContext'

export default function Header() {
  const layout = useAppLayout()
  const open = layout?.mobileNavOpen ?? false

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <NavLink to="/" className="text-base font-semibold tracking-tight text-content">
          web-platform
        </NavLink>

        <nav className="hidden items-center gap-1 max-small:hidden small:flex">
          {appNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => [
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isActive ? 'bg-brand/10 text-accent' : 'text-content-secondary hover:text-content',
              ].join(' ')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          onClick={() => layout?.setMobileNavOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-content-secondary hover:bg-surface-inset hover:text-content small:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border px-5 py-3 small:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-1">
            {appNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => layout?.setMobileNavOpen(false)}
                className={({ isActive }) => [
                  'rounded-md px-3 py-2 text-sm font-medium',
                  isActive ? 'bg-brand/10 text-accent' : 'text-content-secondary',
                ].join(' ')}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
