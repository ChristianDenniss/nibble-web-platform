import { FileSearch, HelpCircle, House, Receipt, type LucideIcon } from 'lucide-react'
import type { NavTagVariant } from '@/components/navigation/NavTag'
import { paths } from '@/routing/paths'

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
    label: 'Home',
    icon: House,
    path: paths.home,
    activeMatch: [paths.home],
  },
  {
    type: 'item',
    label: 'Orders',
    icon: Receipt,
    path: paths.orders,
    activeMatch: [paths.orders],
  },
  {
    type: 'item',
    label: 'Captured data',
    icon: FileSearch,
    path: paths.data,
    activeMatch: [paths.data],
  },
  {
    type: 'item',
    label: 'Help',
    icon: HelpCircle,
    path: paths.help,
    activeMatch: [paths.help],
  },
]
