/**
 * ServiceErrorPage — full-page outage screen with a kind-specific headline and refresh action.
 * Used for backend-down, gateway timeout, and render crashes — not per-request toasts.
 * Lives in `components/misc/`; mounted by ErrorBoundary.
 */
import { RefreshCw } from 'lucide-react'
import AppLogo from '@/components/brand/AppLogo'
import Button from '@/components/buttons/Button'
import type { ServiceErrorKind } from '@/errors/classifyServiceError'

export const SERVICE_ERROR_COPY: Record<ServiceErrorKind, { title: string; body: string }> = {
  timeout: {
    title: "We couldn't respond to your request in time.",
    body: 'Sorry about that. Please try refreshing and contact us if the problem persists.',
  },
  unavailable: {
    title: "We couldn't reach the server.",
    body: 'Sorry about that. Please try refreshing and contact us if the problem persists.',
  },
  unexpected: {
    title: 'Something went wrong.',
    body: 'An unexpected error occurred. Reloading the page usually fixes this.',
  },
}

interface Props {
  kind: ServiceErrorKind
  error?: Error | null
  onReload?: () => void
}

export default function ServiceErrorPage({ kind, error, onReload }: Props) {
  const { title, body } = SERVICE_ERROR_COPY[kind]

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-6 py-16">
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <AppLogo className="mb-10 h-28 w-auto -rotate-6" />
        <h1 className="text-2xl font-semibold text-content tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-content-secondary leading-relaxed">{body}</p>
        <Button variant="primary" className="mt-8" onClick={onReload ?? (() => window.location.reload())}>
          <RefreshCw size={14} />
          Refresh
        </Button>
        {import.meta.env.DEV && error && (
          <pre className="mt-8 max-h-64 w-full overflow-auto rounded-lg border border-border bg-surface-inset p-3 text-left text-xs text-content-secondary">
            {error.stack ?? error.message}
          </pre>
        )}
      </div>
    </div>
  )
}
