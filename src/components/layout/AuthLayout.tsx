import FloatingFoodDoodles from '@/components/brand/FloatingFoodDoodles'
/**
 * AuthLayout — centered chrome for login / sign-up. No storefront search or cart.
 */
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import AppLogo from '@/components/brand/AppLogo'
import { paths } from '@/routing/paths'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-page text-content">
      <FloatingFoodDoodles />
      <header className="border-b border-border bg-surface/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-5">
          <Link to={paths.home} aria-label="Nibble home" className="flex items-center gap-2.5">
            <AppLogo mark="n" className="h-9 w-auto" />
            <span className="text-base font-semibold tracking-tight">Nibble</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        {children}
      </main>
    </div>
  )
}
