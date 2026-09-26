/**
 * NotFoundPage — unknown route.
 */
import { Link } from 'react-router-dom'
import EmptyState from '@/components/misc/EmptyState'
import { paths } from '@/routing/paths'

export default function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      description="That URL is not one of the storefront layouts."
      action={<Link to={paths.home} className="text-sm font-medium text-accent">Back home</Link>}
    />
  )
}
