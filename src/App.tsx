import { lazy, Suspense } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import PageLoader from '@/components/layout/PageLoader'
import ErrorBoundary from '@/components/misc/ErrorBoundary'

const HealthPage = lazy(() => import('@/pages/health/HealthPage'))

function LayoutShell() {
  return (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<LayoutShell />}>
          <Route path="/" element={<HealthPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
