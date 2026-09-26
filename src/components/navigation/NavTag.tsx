/**
 * NavTag — a small uppercase pill label shown alongside a sidebar nav item, keyed by a `variant` prop.
 * Supports `soon | wip | down | new | beta` (status-colored) and adapts to active-nav styling; also exports `NavTagVariant` and the `NAV_TAG_DISABLED` map that marks which variants disable navigation.
 * Lives in `components/navigation/`; rendered by Sidebar next to sub-item labels.
 */
export type NavTagVariant = 'soon' | 'wip' | 'down' | 'new' | 'beta'

const CONFIG: Record<NavTagVariant, { label: string; classes: string }> = {
  soon: {
    label: 'Soon',
    classes: 'bg-surface-inset text-content-muted border-border',
  },
  wip: {
    label: 'WIP',
    classes: 'bg-status-warning/15 text-status-warning border-status-warning/30',
  },
  down: {
    label: 'Down',
    classes: 'bg-status-danger/15 text-status-danger border-status-danger/30',
  },
  new: {
    label: 'New',
    classes: 'bg-status-success/15 text-status-success border-status-success/30',
  },
  beta: {
    label: 'Beta',
    classes: 'bg-status-info/15 text-status-info border-status-info/30',
  },
}

export const NAV_TAG_DISABLED: Record<NavTagVariant, boolean> = {
  soon: true,
  down: true,
  wip:  false,
  new:  false,
  beta: false,
}

export default function NavTag({ variant }: { variant: NavTagVariant }) {
  const { label, classes } = CONFIG[variant]
  return (
    <span
      className={`shrink-0 rounded border px-1 py-px text-[10px] font-semibold uppercase tracking-wide group-[.active-nav]:bg-on-accent/20 group-[.active-nav]:text-on-accent group-[.active-nav]:border-on-accent/40 ${classes}`}
    >
      {label}
    </span>
  )
}
