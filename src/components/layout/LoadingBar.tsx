/**
 * LoadingBar — loading skeleton for a single input-height element: a full-width, input-height (`h-10`) rounded pulsing placeholder bar.
 * Takes no props; renders one animated `bg-surface-inset` block.
 * Lives in `components/layout/`; use for e.g. a select still loading its options.
 */
export default function LoadingBar() {
  return <div className="h-10 w-full rounded-lg bg-surface-inset animate-pulse" />
}
