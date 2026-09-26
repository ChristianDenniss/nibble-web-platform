/**
 * LoadingGrid — loading skeleton for card grids: a vertical stack of three bordered, rounded pulsing card placeholders.
 * Takes no props; renders a fixed set of animated `bg-surface-inset` blocks.
 * Lives in `components/layout/`; use as the initial-load state for the Models and Datasets card grids.
 */
export default function LoadingGrid() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-surface-inset border border-border rounded-xl animate-pulse" />
      ))}
    </div>
  )
}
