/**
 * HealthPage — first placeholder screen. Shows whether api-engine answers GET /health.
 * Renders only; fetching lives in hooks/health/useFetchHealth.
 */
import PageLoader from '@/components/layout/PageLoader'
import { useFetchHealth } from '@/hooks/health/useFetchHealth'

export default function HealthPage() {
  const health = useFetchHealth()

  if (health.loading) return <PageLoader />

  return (
    <section className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-wide text-content-muted">System</p>
      <h1 className="text-3xl font-semibold tracking-tight text-content">
        {health.ok ? 'API is reachable' : 'API is down'}
      </h1>
      <p className="text-content-secondary">
        {health.message}
      </p>
    </section>
  )
}
