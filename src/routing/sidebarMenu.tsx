import { Activity, type LucideIcon } from 'lucide-react'
import type { NavTagVariant } from '@/components/navigation/NavTag'

interface ChildNavItem {
  label: string
  path: string
  tag?: NavTagVariant
  disableOnSmall?: boolean
}

interface BaseNavItem {
  label: string
  icon: LucideIcon
  activeMatch: string[]
}

interface NavItemFlat extends BaseNavItem {
  type: 'item'
  path: string
}

interface NavItemExpandable extends BaseNavItem {
  type: 'expandable'
  children: ChildNavItem[]
}

export type NavItem = NavItemFlat | NavItemExpandable

export const sidebarMenu: NavItem[] = [
  {
    type: 'item',
    label: 'Health',
    icon: Activity,
    path: '/',
    activeMatch: ['/'],
  },
]
