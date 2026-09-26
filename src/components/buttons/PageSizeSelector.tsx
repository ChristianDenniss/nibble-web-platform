/**
 * PageSizeSelector — a rows-per-page dropdown rendered as a styled native `<select>` with "{n} per page" options.
 * Props: `pageSize`, `onChange` (receives the numeric size), and optional `options` (defaults to [5, 10, 20, 50]).
 * Lives in `components/buttons/`; used in paginated list/table footers to control page size.
 */
const DEFAULT_OPTIONS = [5, 10, 20, 50]

interface Props {
  pageSize: number
  onChange: (size: number) => void
  options?: number[]
}

export default function PageSizeSelector({ pageSize, onChange, options = DEFAULT_OPTIONS }: Props) {
  return (
    <select
      value={pageSize}
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-surface border border-border-strong text-content-muted text-sm rounded-lg px-2 h-8 cursor-pointer focus:outline-none focus:border-border-strong transition-colors shadow-sm"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt} per page</option>
      ))}
    </select>
  )
}
