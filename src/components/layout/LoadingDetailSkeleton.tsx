/**
 * LoadingDetailSkeleton — loading skeleton for detail pages: a title bar, a header block, a row of stat-card placeholders, a large footer block, and optional thin line rows, all pulsing.
 * Props: `statCols?` (default 3) sets the number of stat-card columns; `lines?` (default 0) adds thin line-row placeholders below the footer block.
 * Lives in `components/layout/`; use as the initial-load state for detail pages.
 */
interface Props {
  statCols?: number
  /** Extra thin line-row placeholders below the footer block (e.g. a list preview). */
  lines?: number
}

export default function LoadingDetailSkeleton({ statCols = 3, lines = 0 }: Props) {
  return (
    <div className="space-y-4">
      <div className="h-5 w-32 bg-surface-inset rounded animate-pulse" />
      <div className="h-20 bg-surface-inset rounded-2xl animate-pulse" />
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${statCols}, minmax(0, 1fr))` }}>
        {Array.from({ length: statCols }, (_, i) => (
          <div key={i} className="h-24 bg-surface-inset rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="h-32 bg-surface-inset rounded-2xl animate-pulse" />
      {lines > 0 && (
        <div className="space-y-2.5">
          {Array.from({ length: lines }, (_, i) => (
            <div key={i} className="h-3 rounded bg-surface-inset animate-pulse" />
          ))}
        </div>
      )}
    </div>
  )
}
