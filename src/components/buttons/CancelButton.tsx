/**
 * CancelButton — a dismissal/cancel action rendered as an XCircle icon-only button (a `danger`-variant IconButton).
 * Props: `onClick`, optional `disabled`, and `title` (defaults to "Cancel").
 * Lives in `components/buttons/`; used to cancel/dismiss inline edits and pending actions.
 */
import { XCircle } from 'lucide-react'
import IconButton from './IconButton'

interface Props {
  onClick: () => void
  disabled?: boolean
  title?: string
}

export default function CancelButton({ onClick, disabled, title = 'Cancel' }: Props) {
  return (
    <IconButton icon={XCircle} onClick={onClick} disabled={disabled} title={title} variant="danger" />
  )
}
