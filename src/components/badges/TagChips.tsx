/**
 * TagChips — renders an array of string tags as colored rounded chips, showing the first `maxVisible` and a `+N` overflow button.
 * The overflow button opens a hover-driven portal popover (`TagPopover`, also exported) listing all tags; chips can be made clickable links via `getHref`.
 * `colorClass` accepts either one class string for every chip, or a `(item) => string` function for per-tag coloring.
 * Lives in `components/badges/`; used in table rows for tag lists.
 */
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

export type TagColorClass = string | ((item: string) => string)

function resolveColorClass(colorClass: TagColorClass, item: string): string {
  return typeof colorClass === 'function' ? colorClass(item) : colorClass
}

interface TagChipsProps {
  items: string[]
  colorClass: TagColorClass
  maxVisible?: number
  chipClassName?: string
  getLabel?: (item: string) => string
  getHref?: (item: string) => string | undefined
}

export interface PopoverProps {
  items: string[]
  colorClass: TagColorClass
  anchor: { current: HTMLButtonElement | null }
  onClose: () => void
  getLabel?: (item: string) => string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const WIDE_ITEM_THRESHOLD = 8

export function TagPopover({ items, colorClass, anchor, onClose, getLabel, onMouseEnter, onMouseLeave }: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0, position: 'fixed' })
  const [arrowLeft, setArrowLeft] = useState(12)
  const maxWidthCls = items.length > WIDE_ITEM_THRESHOLD ? 'max-w-[480px]' : 'max-w-[280px]'

  useEffect(() => {
    const btn = anchor.current
    const pop = popoverRef.current
    if (!btn || !pop) return
    const rect = btn.getBoundingClientRect()
    const popWidth = pop.offsetWidth
    const half = popWidth / 2
    const btnCenterX = rect.left + rect.width / 2
    const left = Math.max(8, Math.min(btnCenterX - half, window.innerWidth - popWidth - 8))
    setArrowLeft(Math.max(8, Math.min(btnCenterX - left - 5, popWidth - 10)))
    setStyle({
      position: 'fixed',
      top: rect.top,
      left,
      transform: 'translateY(calc(-100% - 8px))',
      opacity: 1,
    })
  }, [anchor])

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (
        popoverRef.current?.contains(e.target as Node) ||
        anchor.current?.contains(e.target as Node)
      ) return
      onClose()
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    function onScroll() { onClose() }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onClose)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onClose)
    }
  }, [anchor, onClose])

  return createPortal(
    <div
      ref={popoverRef}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`z-[9999] w-max ${maxWidthCls} rounded-lg border border-border bg-surface-elevated p-2.5`}
    >
      <div className="flex flex-wrap gap-1">
        {items.map(item => {
          const label = getLabel ? getLabel(item) : item
          return (
            <span
              key={item}
              className={`inline-flex max-w-[200px] items-center rounded-full px-2 py-0.5 text-xs font-semibold ${resolveColorClass(colorClass, item)}`}
              title={item}
            >
              <span className="truncate">{label}</span>
            </span>
          )
        })}
      </div>
      <div
        style={{ left: arrowLeft }}
        className="absolute -bottom-[5px] h-2.5 w-2.5 rotate-45 border-b border-r border-border bg-surface-elevated"
      />
    </div>,
    document.body,
  )
}

export function useHoverPopover(delay = 150) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelTimer = () => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
  }
  const openNow = () => { cancelTimer(); setOpen(true) }
  const scheduleClose = () => { cancelTimer(); timeoutRef.current = setTimeout(() => setOpen(false), delay) }
  const closeNow = () => { cancelTimer(); setOpen(false) }

  useEffect(() => cancelTimer, [])

  return { open, onMouseEnter: openNow, onMouseLeave: scheduleClose, close: closeNow }
}

export default function TagChips({ items, colorClass, maxVisible = 2, chipClassName = '', getLabel, getHref }: TagChipsProps) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const hover = useHoverPopover()

  if (!items.length) return <span className="text-xs text-content-faint">-</span>

  const visible = items.slice(0, maxVisible)
  const overflow = items.length - maxVisible

  return (
    <div className="flex flex-wrap gap-1 min-w-0">
      {visible.map(item => {
        const href = getHref?.(item)
        const cls = `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${chipClassName} ${resolveColorClass(colorClass, item)}`
        const content = <span className="whitespace-nowrap">{getLabel ? getLabel(item) : item}</span>
        return href ? (
          <Link
            key={item}
            to={href}
            onClick={e => e.stopPropagation()}
            className={`${cls} cursor-pointer hover:opacity-80 transition-opacity`}
            title={item}
          >
            {content}
          </Link>
        ) : (
          <span key={item} className={cls} title={item}>
            {content}
          </span>
        )
      })}
      {overflow > 0 && (
        <>
          <button
            ref={btnRef}
            type="button"
            onClick={e => e.stopPropagation()}
            onMouseEnter={e => { e.stopPropagation(); hover.onMouseEnter() }}
            onMouseLeave={hover.onMouseLeave}
            aria-label={`Show ${overflow} more`}
            className={[
              'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none cursor-pointer',
              'ring-1 ring-border transition-colors',
              hover.open
                ? 'bg-hover text-content ring-border-strong'
                : 'bg-surface-inset text-content-secondary hover:bg-hover hover:text-content',
            ].join(' ')}
          >
            +{overflow}
          </button>
          {hover.open && (
            <TagPopover
              items={items}
              colorClass={colorClass}
              getLabel={getLabel}
              anchor={btnRef}
              onClose={hover.close}
              onMouseEnter={hover.onMouseEnter}
              onMouseLeave={hover.onMouseLeave}
            />
          )}
        </>
      )}
    </div>
  )
}
