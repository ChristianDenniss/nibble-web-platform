/**
 * PaginationFooter — a top-bordered bottom bar that wraps `Pagination` for table/list pages.
 * Forwards `page`, `totalPages`, and `onPageChange` to Pagination and accepts an optional `padding` (defaults to a compact `py-1.5`) plus `className`.
 * Lives in `components/navigation/`; pinned at the bottom of table/list views.
 */
import Pagination from './Pagination'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number | ((p: number) => number)) => void
  /** Tailwind vertical padding classes for the bar. Defaults to a compact bar. */
  padding?: string
  className?: string
}

export default function PaginationFooter({
  page, totalPages, onPageChange, padding = 'py-1.5', className = '',
}: Props) {
  return (
    <div className={`shrink-0 ${padding} border-t border-border/40 ${className}`}>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}
