/**
 * GridTable — sortable CSS-grid data table with a sticky, blurred header, zebra rows, and built-in loading-skeleton and empty states.
 * Driven by `cols` (grid-template-columns) + `columns` (GridColumn[]); supports `sortCol`/`sortDir`/`onSort` clickable headers and a `renderHeader` override. Also exports the `GridRow` cell wrapper and `GridColumn`/`SortDir` types.
 * Lives in `components/layout/`; use for every paginated list/table view (wrap in `ResponsiveList` for a card view on the busiest tables). On the phone (`small`) tier it becomes a horizontal-scroll container and tightens cell padding/gaps so columns can run narrower. Callers should pass a compact `cols`/`columns` pair on that tier — a hand-tuned `GRID_SMALL`, or `compactGrid()`/`compactColumns()` from `utils/compactGrid.ts`.
 */
import type { ReactNode } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import EmptyState from '../misc/EmptyState'

export type SortDir = 'asc' | 'desc'

export interface GridColumn {
  label: string
  /** Provide to make this column sortable. Passed back to onSort. */
  sortKey?: string
  align?: 'left' | 'center' | 'right'
}

interface GridTableProps {
  cols: string
  columns: GridColumn[]
  loading?: boolean
  empty?: boolean
  emptyLabel?: string
  /** Tailwind sticky class for the header, e.g. "top-0" or "top-14". Defaults to "top-0". */
  stickyTop?: string
  sortCol?: string
  sortDir?: 'asc' | 'desc'
  onSort?: (key: string) => void
  skeletonRows?: number
  /** When provided, called instead of the default label rendering for each column header cell. */
  renderHeader?: (col: GridColumn, index: number) => ReactNode
  children: ReactNode
}

interface GridRowProps {
  cols: string
  index: number
  onClick?: () => void
  /** Vertical alignment of cells. Defaults to "center". */
  align?: 'start' | 'center'
  /** Marks row as pending deletion - renders a red tint background. */
  deleted?: boolean
  /** Show brand hover tint even without an onClick handler. */
  hover?: boolean
  children: ReactNode
}

const CELL_GRID = 'grid gap-4 px-6 max-small:gap-2 max-small:px-3'

function SortIcon({ active, dir }: { active: boolean; dir?: 'asc' | 'desc' }) {
  if (!active) return <ArrowUpDown size={11} className="opacity-40 shrink-0" />
  return dir === 'asc'
    ? <ArrowUp size={11} className="shrink-0" />
    : <ArrowDown size={11} className="shrink-0" />
}

export function GridRow({ cols, index, onClick, align = 'center', deleted, hover, children }: GridRowProps) {
  const zebra = index % 2 !== 0
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        // Ignore keydowns that bubbled up from a nested action button (e.g. Rerun/Delete) -
        // those already handle their own Enter/Space activation and stopPropagation on click.
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
      className={[
        'group ' + CELL_GRID + ' py-3 2xl:py-4 max-small:py-2 transition-all duration-200',
        (onClick || hover) ? 'hover:bg-surface-brand-hover hover:shadow-sm' : '',
        onClick ? 'cursor-pointer' : '',
        align === 'start' ? 'items-start' : 'items-center',
        deleted ? 'bg-status-danger/10 opacity-60' : (zebra ? 'bg-surface-zebra' : 'bg-surface'),
      ].join(' ')}
      style={{ gridTemplateColumns: cols }}
    >
      {children}
    </div>
  )
}

export default function GridTable({
  cols,
  columns,
  loading,
  empty,
  emptyLabel = 'No results.',
  stickyTop = 'top-0',
  sortCol,
  sortDir,
  onSort,
  skeletonRows,
  renderHeader,
  children,
}: GridTableProps) {
  const header = (
    <div
      className={`sticky ${stickyTop} z-10 ${CELL_GRID} border-b border-border/60 bg-surface-sticky py-3 max-small:py-2 shadow-sm backdrop-blur-sm rounded-t-xl`}
      style={{ gridTemplateColumns: cols }}
    >
      {columns.map((col, idx) => {
        const key = col.sortKey ?? col.label
        const flexAlign = col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : ''
        const textAlign = col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''
        const baseText = 'text-xs font-bold uppercase tracking-wider text-content-secondary'

        if (renderHeader) {
          return <div key={key} className="min-w-0">{renderHeader(col, idx)}</div>
        }

        if (col.sortKey && onSort) {
          return (
            <button
              key={key}
              onClick={() => onSort(col.sortKey!)}
              className={`min-w-0 overflow-hidden flex items-center gap-1 ${baseText} transition-colors hover:text-accent cursor-pointer ${flexAlign}`}
            >
              <span className="truncate">{col.label}</span>
              <SortIcon active={sortCol === col.sortKey} dir={sortDir} />
            </button>
          )
        }

        return (
          <span key={key} className={`truncate ${baseText} ${textAlign}`}>
            {col.label}
          </span>
        )
      })}
    </div>
  )

  // Loading takes precedence over empty - a caller that hasn't confirmed emptiness yet
  // (e.g. initial-mount data still in flight) must never flash "No results" before the
  // real answer is known. Checked in this order regardless of what the caller passes.
  if (loading) {
    return (
      // `contents` = no box on medium/large (byte-for-byte unchanged); on phone it
      // becomes a horizontal-scroll container so wide tables don't overflow the page.
      <div className="contents max-small:block max-small:overflow-x-auto">
      <div className="min-w-min rounded-xl border border-border">
        {header}
        <div className="divide-y divide-border/30 overflow-hidden rounded-b-xl animate-pulse">
          {Array.from({ length: skeletonRows ?? 8 }).map((_, i) => (
            <div
              key={i}
              className={`${CELL_GRID} py-3.5 max-small:py-2 ${i % 2 !== 0 ? 'bg-surface-zebra' : 'bg-surface'}`}
              style={{ gridTemplateColumns: cols }}
            >
              {columns.map((col, j) => (
                <div
                  key={j}
                  className={`h-4 rounded bg-surface-inset ${col.align === 'right' ? 'justify-self-end' : col.align === 'center' ? 'justify-self-center' : ''}`}
                  style={{ width: j === 0 ? '60%' : '80%' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      </div>
    )
  }

  if (empty) return <EmptyState label={emptyLabel} />

  return (
    // `contents` = no box on medium/large (byte-for-byte unchanged); on phone it
    // becomes a horizontal-scroll container so wide tables don't overflow the page.
    <div className="contents max-small:block max-small:overflow-x-auto">
    <div className="min-w-min rounded-xl border border-border">
      {header}
      <div className="divide-y divide-border/30 overflow-hidden rounded-b-xl">
        {children}
      </div>
    </div>
    </div>
  )
}
