import { lazy, Suspense } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import PageLoader from '@/components/layout/PageLoader'
import ErrorBoundary from '@/components/misc/ErrorBoundary'
import { paths } from '@/routing/paths'

const HomePage = lazy(() => import('@/pages/home/HomePage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const SearchPage = lazy(() => import('@/pages/search/SearchPage'))
const CategoriesPage = lazy(() => import('@/pages/categories/CategoriesPage'))
const CuisinesPage = lazy(() => import('@/pages/cuisines/CuisinesPage'))
const CuisinePage = lazy(() => import('@/pages/cuisines/CuisinePage'))
const StorePage = lazy(() => import('@/pages/stores/StorePage'))
const ItemPage = lazy(() => import('@/pages/items/ItemPage'))
const CartPage = lazy(() => import('@/pages/cart/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/checkout/CheckoutPage'))
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'))
const OrdersPage = lazy(() => import('@/pages/orders/OrdersPage'))
const LocationPage = lazy(() => import('@/pages/location/LocationPage'))
const PaymentPage = lazy(() => import('@/pages/account/PaymentPage'))
const ManageAccountPage = lazy(() => import('@/pages/account/ManageAccountPage'))
const HelpPage = lazy(() => import('@/pages/help/HelpPage'))
const TermsPage = lazy(() => import('@/pages/legal/TermsPage'))
const PrivacyPage = lazy(() => import('@/pages/legal/PrivacyPage'))
const ProviderCategoriesPage = lazy(() => import('@/pages/providers/ProviderCategoriesPage'))
const FilterPage = lazy(() => import('@/pages/filters/FilterPage'))
const HealthPage = lazy(() => import('@/pages/health/HealthPage'))
const ComparePage = lazy(() => import('@/pages/compare/ComparePage'))
const SourceMenuPage = lazy(() => import('@/pages/source/SourceMenuPage'))
const DevPagesPage = lazy(() => import('@/pages/dev/DevPagesPage'))
const NotFoundPage = lazy(() => import('@/pages/not-found/NotFoundPage'))

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
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<AuthShell />}>
          <Route path={paths.login} element={<LoginPage />} />
        </Route>
        <Route element={<StorefrontShell />}>
          <Route path={paths.home} element={<HomePage />} />
          <Route path={paths.search} element={<SearchPage />} />
          <Route path={paths.categories} element={<CategoriesPage />} />
          <Route path={paths.cuisines} element={<CuisinesPage />} />
          <Route path="/cuisines/:cuisineSlug" element={<CuisinePage />} />
          <Route path="/stores/:storeId" element={<StorePage />} />
          <Route path="/stores/:storeId/items/:itemId" element={<ItemPage />} />
          <Route path={paths.cart} element={<CartPage />} />
          <Route path={paths.checkout} element={<CheckoutPage />} />
          <Route path={paths.profile} element={<ProfilePage />} />
          <Route path={paths.orders} element={<OrdersPage />} />
          <Route path={paths.location} element={<LocationPage />} />
          <Route path={paths.payment} element={<PaymentPage />} />
          <Route path={paths.account} element={<ManageAccountPage />} />
          <Route path={paths.help} element={<HelpPage />} />
          <Route path={paths.terms} element={<TermsPage />} />
          <Route path={paths.privacy} element={<PrivacyPage />} />
          <Route path="/providers/:providerId/categories" element={<ProviderCategoriesPage />} />
          <Route path={paths.filters} element={<FilterPage />} />
          <Route path={paths.health} element={<HealthPage />} />
          <Route path={paths.compare} element={<ComparePage />} />
          <Route path={paths.sourceMenu} element={<SourceMenuPage />} />
          {import.meta.env.DEV && <Route path={paths.dev} element={<DevPagesPage />} />}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
