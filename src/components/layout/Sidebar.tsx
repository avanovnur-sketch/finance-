import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { navItems } from './navItems'
import { LogoMark } from './Logo'

/** Планшет (768–1199px): компактная панель с иконками. Desktop (от 1200px): полная панель. */
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card/60 px-3 py-5 md:flex md:w-[76px] xl:w-64 xl:px-4">
      <div className="flex items-center gap-3 px-1">
        <LogoMark />
        <div className="hidden min-w-0 xl:block">
          <p className="font-semibold leading-tight">FinanceFlow</p>
          <p className="text-xs text-muted">Personal finance manager</p>
        </div>
      </div>

      <nav aria-label="Основная навигация" className="mt-8 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                'flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition md:justify-center xl:justify-start',
                isActive ? 'bg-accent-strong text-white' : 'text-muted hover:bg-card-hover hover:text-fg',
              )
            }
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            <span className="hidden xl:inline">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
