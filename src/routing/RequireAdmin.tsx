import { Navigate, Outlet, useLocation } from 'react-router-dom'
import PageLoader from '@/components/layout/PageLoader'
import { useAuth } from '@/hooks/auth/authStore'
import { paths } from '@/routing/paths'

export default function RequireAdmin() {
  const { status, account } = useAuth()
  const location = useLocation()
  if (status === 'loading') return <PageLoader />
  if (status === 'guest') return <Navigate to={paths.login} replace state={{ from: `${location.pathname}${location.search}` }} />
  if (account?.role !== 'root' && account?.role !== 'admin') return <Navigate to={paths.home} replace />
  return <Outlet />
}
