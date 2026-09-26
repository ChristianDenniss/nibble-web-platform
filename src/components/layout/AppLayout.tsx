/**
 * AppLayout — product chrome: sticky top nav and a normal scrolling document.
 * Not a dashboard shell (no left rail, no logo-width header, no brand wash overlays).
 * Lives in `components/layout/`.
 */
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Header from '../navigation/Header'
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
      <div className="min-h-screen bg-page text-content">
        <Header />
        <main id="main-content" className="mx-auto w-full max-w-5xl px-5 py-10">
          {children}
        </main>
      </div>
    </AppLayoutProvider>
  )
}
