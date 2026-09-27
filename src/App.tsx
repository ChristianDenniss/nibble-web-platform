import { lazy, Suspense, useCallback, useState } from 'react'
import StartupScreen from '@/components/brand/StartupScreen'
import { Routes, Route, Outlet } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import PageLoader from '@/components/layout/PageLoader'
import ErrorBoundary from '@/components/misc/ErrorBoundary'
import { paths } from '@/routing/paths'
import RequireAuth from '@/routing/RequireAuth'
import RequireAdmin from '@/routing/RequireAdmin'

const HomePage = lazy(() => import('@/pages/home/HomePage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const WelcomePage = lazy(() => import('@/pages/welcome/WelcomePage'))
const SearchPage = lazy(() => import('@/pages/search/SearchPage'))
const CategoriesPage = lazy(() => import('@/pages/categories/CategoriesPage'))
const CuisinesPage = lazy(() => import('@/pages/cuisines/CuisinesPage'))
const CuisinePage = lazy(() => import('@/pages/cuisines/CuisinePage'))
const StorePage = lazy(() => import('@/pages/stores/StorePage'))
const ItemPage = lazy(() => import('@/pages/items/ItemPage'))
const CartPage = lazy(() => import('@/pages/cart/CartPage'))
const CartComparePage = lazy(() => import('@/pages/cart/CartComparePage'))
const CheckoutPage = lazy(() => import('@/pages/checkout/CheckoutPage'))
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'))
const OrdersPage = lazy(() => import('@/pages/orders/OrdersPage'))
const LocationPage = lazy(() => import('@/pages/location/LocationPage'))
const PaymentPage = lazy(() => import('@/pages/account/PaymentPage'))
const ManageAccountPage = lazy(() => import('@/pages/account/ManageAccountPage'))
const PreferencesPage = lazy(() => import('@/pages/account/PreferencesPage'))
const HelpPage = lazy(() => import('@/pages/help/HelpPage'))
const TermsPage = lazy(() => import('@/pages/legal/TermsPage'))
const PrivacyPage = lazy(() => import('@/pages/legal/PrivacyPage'))
const ProviderCategoriesPage = lazy(() => import('@/pages/providers/ProviderCategoriesPage'))
const FilterPage = lazy(() => import('@/pages/filters/FilterPage'))
const HealthPage = lazy(() => import('@/pages/health/HealthPage'))
const ComparePage = lazy(() => import('@/pages/compare/ComparePage'))
const SourceMenuPage = lazy(() => import('@/pages/source/SourceMenuPage'))
const DevPagesPage = lazy(() => import('@/pages/dev/DevPagesPage'))
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'))
const DataPage = lazy(() => import('@/pages/data/DataPage'))
const NotFoundPage = lazy(() => import('@/pages/not-found/NotFoundPage'))

const isMockMode = import.meta.env.DEV && import.meta.env.VITE_MOCK !== '0'

function StorefrontShell() {
  return (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  )
}

function AuthShell() {
  return (
    <AuthLayout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </AuthLayout>
  )
}

export function App() {
  const [started, setStarted] = useState(false)
  const finishStartup = useCallback(() => setStarted(true), [])
  if (!started) return <ErrorBoundary><StartupScreen onComplete={finishStartup} /></ErrorBoundary>
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<AuthShell />}>
          <Route path={paths.login} element={<LoginPage />} />
        </Route>
        <Route element={<StorefrontShell />}>
          <Route path={paths.welcome} element={<WelcomePage />} />
          <Route path={paths.home} element={<HomePage />} />
          <Route path={paths.search} element={<SearchPage />} />
          <Route path={paths.categories} element={<CategoriesPage />} />
          <Route path={paths.cuisines} element={<CuisinesPage />} />
          <Route path="/cuisines/:cuisineSlug" element={<CuisinePage />} />
          <Route path="/stores/:storeId" element={<StorePage />} />
          <Route path="/stores/:storeId/items/:itemId" element={<ItemPage />} />
          <Route path={paths.cart} element={<CartPage />} />
          <Route path={paths.cartCompare} element={<CartComparePage />} />
          <Route path={paths.checkout} element={<CheckoutPage />} />
          <Route element={<RequireAuth />}>
            <Route path={paths.profile} element={<ProfilePage />} />
            <Route path={paths.orders} element={<OrdersPage />} />
            <Route path={paths.payment} element={<PaymentPage />} />
            <Route path={paths.preferences} element={<PreferencesPage />} />
            <Route path={paths.account} element={<ManageAccountPage />} />
          </Route>
          <Route path={paths.location} element={<LocationPage />} />
          <Route path={paths.help} element={<HelpPage />} />
          <Route path={paths.terms} element={<TermsPage />} />
          <Route path={paths.privacy} element={<PrivacyPage />} />
          <Route path="/providers/:providerId/categories" element={<ProviderCategoriesPage />} />
          <Route path={paths.filters} element={<FilterPage />} />
          <Route path={paths.health} element={<HealthPage />} />
          <Route path={paths.compare} element={<ComparePage />} />
          <Route path={paths.sourceMenu} element={<SourceMenuPage />} />
          <Route path={paths.data} element={<DataPage />} />
          {isMockMode ? (
            <Route path={paths.admin} element={<AdminPage />} />
          ) : (
            <Route element={<RequireAdmin />}><Route path={paths.admin} element={<AdminPage />} /></Route>
          )}
          {import.meta.env.DEV && <Route path={paths.dev} element={<DevPagesPage />} />}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
