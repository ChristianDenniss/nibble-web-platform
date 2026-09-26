import { createContext, useContext, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import type { Tier } from '@/config/breakpoints'

interface AppLayoutContextValue {
  tier: Tier
  isSmall: boolean
  isLarge: boolean
  mobileNavOpen: boolean
  setMobileNavOpen: Dispatch<SetStateAction<boolean>>
}

const AppLayoutContext = createContext<AppLayoutContextValue | null>(null)

export function AppLayoutProvider({
  value,
  children,
}: {
  value: AppLayoutContextValue
  children: ReactNode
}) {
  return <AppLayoutContext.Provider value={value}>{children}</AppLayoutContext.Provider>
}

export function useAppLayout(): AppLayoutContextValue | null {
  return useContext(AppLayoutContext)
}
