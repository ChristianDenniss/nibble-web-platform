/**
 * Sidebar — left navigation with collapsible sections and NavLink items, built from `sidebarMenu`.
 * `variant`: `fixed` (default) is the persistent desktop sidebar; `panel` fills the phone MobileNavDrawer.
 * Lives in `components/navigation/`; composed by AppLayout and MobileNavDrawer.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, ListCollapse, Lock } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { sidebarMenu, type NavItem } from '@/routing/sidebarMenu'
import NavTag, { NAV_TAG_DISABLED } from '@/components/navigation/NavTag'
import { readSidebarSectionsCollapsedDefault } from '@/hooks/utils/useLayoutPrefs'
import { useViewport } from '@/hooks/utils/useViewport'
import { notify } from '@/utils/notify'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  onHoverChange?: (hovered: boolean) => void
  onClose?: () => void
  variant?: 'fixed' | 'panel'
  fullHeight?: boolean
}

export default function Sidebar({ collapsed, onToggleCollapse, onHoverChange, onClose, variant = 'fixed', fullHeight = false }: SidebarProps) {
  const isPanel = variant === 'panel'
  const { pathname } = useLocation()
  const { isSmall } = useViewport()
  const [hovered, setHovered] = useState(false)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    if (readSidebarSectionsCollapsedDefault()) return new Set<string>()
    return new Set(sidebarMenu.map(item => item.label))
  })

  const toggleSection = useCallback((label: string) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }, [])

  const showFull = !collapsed || hovered

  const handleMouseEnter = useCallback(() => {
    if (collapsed) {
      if (hoverTimer.current) clearTimeout(hoverTimer.current)
      setHovered(true)
      onHoverChange?.(true)
    }
  }, [collapsed, onHoverChange])

  const handleMouseLeave = useCallback(() => {
    if (collapsed) {
      hoverTimer.current = setTimeout(() => {
        setHovered(false)
        onHoverChange?.(false)
      }, 100)
    }
  }, [collapsed, onHoverChange])

  const handleBackgroundClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('a, button, [data-sidebar-clickable]')) return
    const aside = e.currentTarget
    const prevPointerEvents = aside.style.pointerEvents
    aside.style.pointerEvents = 'none'
    const under = document.elementFromPoint(e.clientX, e.clientY)
    aside.style.pointerEvents = prevPointerEvents
    under?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: e.clientX, clientY: e.clientY }))
  }, [])

  useEffect(() => {
    if (!collapsed) setHovered(false)
    return () => { if (hoverTimer.current) clearTimeout(hoverTimer.current) }
  }, [collapsed])

  const width = collapsed ? (hovered ? 'w-[195px] shadow-xl' : 'w-[56px]') : 'w-[195px]'
  const px = collapsed ? (hovered ? 'px-2' : 'px-1') : 'px-2'

  const renderItems = (items: NavItem[]) => items.map((item) => {
    const parentActive = item.type === 'item'
      ? pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
      : item.activeMatch.some((prefix) => prefix === '/' ? pathname === '/' : pathname.startsWith(prefix))

    if (item.type === 'item') {
      return (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={[
            'flex items-center gap-3 rounded-lg px-3 py-2',
            'whitespace-nowrap text-[15px] font-medium',
            'border-l-[3px] transition-all duration-150',
            parentActive
              ? 'border-l-brand bg-brand/10 text-content-tertiary'
              : 'border-l-transparent text-content-secondary hover:bg-brand/10',
          ].join(' ')}
        >
          <span className="shrink-0">
            <item.icon size={20} className={parentActive ? 'text-accent' : 'text-content-muted'} />
          </span>
          <span className={['transition-all duration-200', showFull ? 'opacity-100' : 'w-0 overflow-hidden opacity-0'].join(' ')}>
            {item.label}
          </span>
        </NavLink>
      )
    }

    const isOpen = openSections.has(item.label)
    return (
      <div key={item.label} className="w-full">
        <button
          onClick={() => toggleSection(item.label)}
          className={[
            'w-full flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer',
            'whitespace-nowrap text-[15px] font-medium',
            'border-l-[3px] transition-all duration-150',
            parentActive
              ? 'border-l-brand bg-brand/10 text-content-tertiary'
              : 'border-l-transparent text-content-secondary hover:bg-brand/10',
          ].join(' ')}
        >
          <span className="shrink-0">
            <item.icon size={20} className={parentActive ? 'text-accent' : 'text-content-muted'} />
          </span>
          <span
            className={[
              'text-sm font-semibold uppercase tracking-wider transition-all duration-200',
              showFull ? 'opacity-100' : 'w-0 overflow-hidden opacity-0',
            ].join(' ')}
          >
            {item.label}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {showFull && isOpen && (
            <motion.div
              key="children"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="ml-8 mt-1 mb-1 flex flex-col gap-1">
                {item.children.map((child) => {
                  const tagDisabled = !!child.tag && NAV_TAG_DISABLED[child.tag]
                  const smallLocked = !!child.disableOnSmall && isSmall
                  const disabled = tagDisabled || smallLocked

                  if (disabled) {
                    return (
                      <span
                        key={child.path}
                        data-sidebar-clickable
                        onClick={smallLocked ? () => notify.info(`${child.label} isn't accessible on this screen size.`) : undefined}
                        className={`flex items-center justify-between gap-2 rounded-md px-2 py-1 text-[14px] font-medium text-content-faint select-none ${smallLocked ? 'cursor-pointer hover:bg-brand/10' : 'cursor-default'}`}
                        title={smallLocked ? 'Requires a larger screen' : undefined}
                      >
                        <span className="truncate">{child.label}</span>
                        {smallLocked
                          ? <Lock size={12} className="shrink-0 text-content-muted" />
                          : <NavTag variant={child.tag!} />
                        }
                      </span>
                    )
                  }
                  return (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      end
                      className={({ isActive }) => [
                        'group flex items-center justify-between gap-2 rounded-md px-2 py-1 text-[14px] transition-all duration-150',
                        isActive
                          ? 'active-nav bg-accent font-semibold text-on-accent'
                          : 'font-medium text-content-secondary hover:bg-brand/10',
                      ].join(' ')}
                    >
                      <span className="truncate">{child.label}</span>
                      {child.tag && <NavTag variant={child.tag} />}
                    </NavLink>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  })

  return (
    <aside
      className={(isPanel ? [
        'flex flex-col justify-between',
        'overflow-x-hidden overflow-y-auto sidebar-gradient-scroll',
        'bg-surface-raised',
        'h-full w-full py-3 px-2',
      ] : [
        `fixed left-0 bottom-0 z-40 ${fullHeight ? 'top-0' : 'top-14'}`,
        'flex flex-col justify-between',
        'overflow-x-hidden overflow-y-auto sidebar-gradient-scroll',
        'border-r border-border',
        'bg-gradient-to-b from-surface-inset to-brand/5',
        'dark:from-surface-raised dark:to-surface-raised',
        'py-3 transition-all duration-300 ease-in-out',
        width,
        px,
      ]).join(' ')}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleBackgroundClick}
    >
      <nav className="flex flex-col gap-0.5 w-full">
        {renderItems(sidebarMenu)}
      </nav>

      <div className="mt-2 flex items-center gap-1">
        {showFull && (
          <button
            onClick={() => {
              const allCollapsed = openSections.size === 0
              setOpenSections(allCollapsed ? new Set(sidebarMenu.map(i => i.label)) : new Set())
            }}
            title={openSections.size === 0 ? 'Expand all' : 'Collapse all'}
            className={[
              'flex items-center justify-center rounded-lg py-2 flex-1 cursor-pointer',
              'text-content-muted transition-colors',
              'hover:bg-brand/10 hover:text-content-secondary',
            ].join(' ')}
          >
            <ListCollapse size={18} />
          </button>
        )}
        {(!isPanel || onClose) && (
          <button
            onClick={isPanel ? onClose : onToggleCollapse}
            title={isPanel ? 'Close menu' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={[
              'flex items-center justify-center rounded-lg py-2 flex-1 cursor-pointer',
              'text-content-muted transition-colors',
              'hover:bg-brand/10 hover:text-content-secondary',
            ].join(' ')}
          >
            {isPanel
              ? <PanelLeftClose size={18} />
              : collapsed
                ? <PanelLeftOpen size={18} />
                : <PanelLeftClose size={18} />
            }
          </button>
        )}
      </div>
    </aside>
  )
}
