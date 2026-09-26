/**
 * Toggle — a boolean on/off switch rendered as an accessible `role="switch"` button with a sliding knob that animates and fills brand color when on.
 * Props: `checked`, `onChange`, and optional `disabled`.
 * Lives in `components/buttons/`; used wherever a compact boolean toggle is needed.
 */
interface Props {
  checked: boolean
  onChange: () => void
  disabled?: boolean
}

export default function Toggle({ checked, onChange, disabled = false }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={disabled ? undefined : onChange}
      className={[
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200',
        checked ? 'bg-brand' : 'bg-border-strong',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:ring-2 hover:ring-accent/40',
      ].join(' ')}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-surface-elevated transition-transform duration-200 ${checked ? 'translate-x-[19px]' : 'translate-x-[3px]'}`}
      />
    </button>
  )
}
