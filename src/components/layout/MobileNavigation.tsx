import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '../../utils/cn'
import { mobileMainPaths, navItems } from './navItems'
import { Modal } from '../ui/Modal'

/** Телефон (до 767px): нижняя навигация, остальные разделы — в «Ещё». */
export function MobileNavigation() {
  const [moreOpen, setMoreOpen] = useState(false)
  const { pathname } = useLocation()
  const main = navItems.filter((i) => mobileMainPaths.includes(i.to))
  const more = navItems.filter((i) => !mobileMainPaths.includes(i.to))
  const moreActive = more.some((i) => pathname.startsWith(i.to))

  const itemClass = (active: boolean) =>
    cn(
      'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium',
      active ? 'text-accent-text' : 'text-muted',
    )

  return (
    <>
      <nav
        aria-label="Мобильная навигация"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {main.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => itemClass(isActive)}>
            <Icon className="size-5" aria-hidden />
            {label}
          </NavLink>
        ))}
        <button type="button" onClick={() => setMoreOpen(true)} className={itemClass(moreActive)} aria-haspopup="dialog">
          <MoreHorizontal className="size-5" aria-hidden />
          Ещё
        </button>
      </nav>

      <Modal open={moreOpen} onClose={() => setMoreOpen(false)} title="Разделы">
        <ul className="grid gap-1">
          {more.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => setMoreOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium',
                    isActive ? 'bg-accent-strong text-white' : 'hover:bg-card-hover',
                  )
                }
              >
                <Icon className="size-5" aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  )
}
