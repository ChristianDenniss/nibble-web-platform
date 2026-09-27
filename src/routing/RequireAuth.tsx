/**
 * RequireAuth — route guard for account pages. Guests go to /login and come back after signing in.
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import PageLoader from '@/components/layout/PageLoader'
import { useAuth } from '@/hooks/auth/authStore'
import { paths } from '@/routing/paths'

export default function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <PageLoader />
  if (status === 'guest') {
    return <Navigate to={paths.login} replace state={{ from: `${location.pathname}${location.search}` }} />
  }
  return <Outlet />
}
