/**
 * LoadingColumnHeaders — loading skeleton for a row of table column headers: N bordered cells,
 * each with a pulsing name bar and a shorter type bar stacked below it.
 * Props: `columns?` (default 4) controls how many column placeholders render.
 * Lives in `components/layout/`; use while a table/schema's column headers are still loading.
 */
interface Props {
  columns?: number
}

export default function LoadingColumnHeaders({ columns = 4 }: Props) {
  return (
    <div className="flex border border-border rounded-xl overflow-hidden min-w-max animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className={`flex flex-col gap-1.5 px-4 py-3 min-w-[120px] ${i !== 0 ? 'border-l border-border' : ''}`}
        >
          <div className="h-3.5 w-20 rounded bg-surface-inset" />
          <div className="h-2.5 w-12 rounded bg-surface-inset" />
        </div>
      ))}
    </div>
  )
}
