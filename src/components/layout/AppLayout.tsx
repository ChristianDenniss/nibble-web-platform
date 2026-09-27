import FloatingFoodDoodles from '@/components/brand/FloatingFoodDoodles'
/**
 * AppLayout — storefront chrome: sticky top bar, scrolling document, legal footer.
 * Not a dashboard shell (no left rail). Lives in `components/layout/`.
 */
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Header from '../navigation/Header'
import StorefrontFooter from '../storefront/StorefrontFooter'
import { AppLayoutProvider } from '@/context/AppLayoutContext'
import { useViewport } from '@/hooks/utils/useViewport'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { tier, isSmall, isLarge } = useViewport()

  useEffect(() => {
    if (!isSmall) setMobileNavOpen(false)
  }, [isSmall])

  return (
    <AppLayoutProvider value={{
      tier,
      isSmall,
      isLarge,
      mobileNavOpen,
      setMobileNavOpen,
    }}>
      <div className="relative isolate flex min-h-dvh flex-col bg-page text-content">
        <FloatingFoodDoodles />
        <Header />
        <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">
          {children}
        </main>
        <StorefrontFooter />
      </div>
    </AppLayoutProvider>
  )
}
