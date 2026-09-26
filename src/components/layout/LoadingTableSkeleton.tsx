/**
 * LoadingTableSkeleton — loading skeleton for table/list views: a bordered, divided panel of pulsing rows, each with a two-line text placeholder, two pill placeholders, and a short trailing bar.
 * Props: `rows?` (default 8) sets how many placeholder rows render.
 * Lives in `components/layout/`; use as the initial-load state for table/list views.
 */
interface Props {
  rows?: number
}

export default function LoadingTableSkeleton({ rows = 8 }: Props) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden divide-y divide-border animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-3.5">
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-36 rounded bg-surface-inset" />
            <div className="h-3 w-24 rounded bg-surface-inset" />
          </div>
          <div className="h-5 w-20 rounded-full bg-surface-inset" />
          <div className="h-5 w-24 rounded-full bg-surface-inset" />
          <div className="h-3 w-16 rounded bg-surface-inset" />
        </div>
      ))}
    </div>
  )
}
