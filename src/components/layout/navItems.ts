import { ArrowLeftRight, BarChart3, Landmark, LayoutDashboard, Settings, Tags, Target, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Обзор', icon: LayoutDashboard },
  { to: '/transactions', label: 'Операции', icon: ArrowLeftRight },
  { to: '/analytics', label: 'Аналитика', icon: BarChart3 },
  { to: '/budgets', label: 'Бюджеты', icon: Target },
  { to: '/accounts', label: 'Счета', icon: Landmark },
  { to: '/categories', label: 'Категории', icon: Tags },
  { to: '/settings', label: 'Настройки', icon: Settings },
]

/** Пункты, вынесенные в «Ещё» на телефоне */
export const mobileMainPaths = ['/dashboard', '/transactions', '/analytics', '/budgets']
