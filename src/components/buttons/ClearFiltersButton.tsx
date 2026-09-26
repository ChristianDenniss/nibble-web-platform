/**
 * ClearFiltersButton — a small "Clear All" pill button that animates its width/opacity in and out via framer-motion when `visible` toggles.
 * Props: `visible` (drives the AnimatePresence mount), `onClick`, and optional `className`.
 * Lives in `components/buttons/`; used to reset active filters, appearing only when filters are applied.
 */
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  visible: boolean
  onClick: () => void
  className?: string
}

export default function ClearFiltersButton({ visible, onClick, className = '' }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 'auto', opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className={`overflow-hidden shrink-0 ${className}`}
        >
          <button
            onClick={onClick}
            className="flex items-center gap-1 h-8 px-2.5 rounded-md border border-border-strong bg-surface text-xs text-content-muted hover:bg-hover hover:text-content-secondary transition-colors whitespace-nowrap cursor-pointer"
          >
            Clear All
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
