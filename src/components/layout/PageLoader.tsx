/**
 * PageLoader — universal initial-load state: a centered, fading-in trio of accent dots that pulse in a staggered scale/opacity animation (framer-motion).
 * Takes no props; fills at least half the viewport height.
 * Lives in `components/layout/`; use as an early return on every page — `if (loading) return <PageLoader />`.
 */
import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <motion.div
      className="flex min-h-[50vh] items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-center gap-2.5">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="block w-2 h-2 rounded-full bg-accent"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  )
}
