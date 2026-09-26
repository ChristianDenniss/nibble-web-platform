/**
 * EditButton — a pencil-icon edit trigger rendered as a default-variant IconButton titled "Edit".
 * Props: just `onClick`.
 * Lives in `components/buttons/`; used by TagEditor, DescriptionEditor, MetaEditor, and LabelBubble to enter inline-edit mode.
 */
import { Pencil } from 'lucide-react'
import IconButton from './IconButton'

interface Props {
  onClick: () => void
}

export default function EditButton({ onClick }: Props) {
  return <IconButton icon={Pencil} onClick={onClick} title="Edit" />
}
