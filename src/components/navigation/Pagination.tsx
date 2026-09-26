/**
 * Pagination — a centered prev/next chevron pair flanking a `page / totalPages` indicator.
 * Takes `page`, `totalPages`, and an `onPageChange` updater; always rendered, disabling both arrows at a single page (reads "1 / 1").
 * Lives in `components/navigation/`; wrapped by PaginationFooter for table/list pages.
 */
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number | ((p: number) => number)) => void
  className?: string
}

export default function Pagination({ page, totalPages, onPageChange, className = '' }: Props) {
  const pages = Math.max(totalPages, 1)

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(p => p - 1)}
        className="flex items-center justify-center w-6 h-6 rounded-full border border-border text-content-secondary hover:bg-surface-inset hover:border-border-strong disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      <span className="text-sm text-content-muted tabular-nums">
        {page} / {pages}
      </span>

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= pages}
        onClick={() => onPageChange(p => p + 1)}
        className="flex items-center justify-center w-6 h-6 rounded-full border border-border text-content-secondary hover:bg-surface-inset hover:border-border-strong disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
