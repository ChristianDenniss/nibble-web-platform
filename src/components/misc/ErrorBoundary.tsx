/**
 * ErrorBoundary — top-level class component that catches render/lifecycle throws and shows
 * ServiceErrorPage (`unexpected`) instead of a white screen. Also auto-recovers from stale
 * lazy-chunk load failures with a single forced reload.
 * Lives in `components/misc/`; mounted once at the router root in `App.tsx`.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react'
import ServiceErrorPage from '@/components/misc/ServiceErrorPage'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

const CHUNK_RELOAD_FLAG = 'chunk-reload-attempted'

const CHUNK_LOAD_ERROR_PATTERN =
  /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed|failed to load module script|loading chunk [\w-]+ failed/i

function isChunkLoadError(error: Error): boolean {
  return CHUNK_LOAD_ERROR_PATTERN.test(error.message ?? '') || CHUNK_LOAD_ERROR_PATTERN.test(error.name ?? '')
}

function safeSessionStorage() {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidMount(): void {
    if (!this.state.hasError) {
      safeSessionStorage()?.removeItem(CHUNK_RELOAD_FLAG)
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack)

    if (isChunkLoadError(error)) {
      const storage = safeSessionStorage()
      const alreadyAttempted = storage?.getItem(CHUNK_RELOAD_FLAG) === '1'
      if (!alreadyAttempted) {
        storage?.setItem(CHUNK_RELOAD_FLAG, '1')
        window.location.reload()
      }
    }
  }

  handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <ServiceErrorPage kind="unexpected" error={this.state.error} onReload={this.handleReload} />
    }

    return this.props.children
  }
}
