/**
 * DeleteButton — a destructive delete action rendered as a Trash2 icon-only button (a `danger`-variant IconButton).
 * Props: `onClick`, optional `disabled`, `title` (defaults to "Delete"), and `size` ('sm' | 'md').
 * Lives in `components/buttons/`; used to trigger destructive deletes on resources and list rows.
 */
import { Trash2 } from 'lucide-react'
import IconButton from './IconButton'

interface Props {
  onClick: () => void
  disabled?: boolean
  title?: string
  size?: 'sm' | 'md'
}

export default function DeleteButton({ onClick, disabled, title = 'Delete', size }: Props) {
  return (
    <IconButton icon={Trash2} onClick={onClick} disabled={disabled} title={title} variant="danger" size={size} />
  )
}
