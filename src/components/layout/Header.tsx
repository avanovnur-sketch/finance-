import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Moon, Search, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useBudgetUsage } from '../../hooks/useBudgetUsage'
import { IconButton } from '../ui/Button'
import { LogoMark } from './Logo'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const alerts = useBudgetUsage().filter((b) => b.status !== 'ok').length

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    const query = q.trim()
    navigate(query ? `/transactions?q=${encodeURIComponent(query)}` : '/transactions')
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-bg/85 px-4 py-2.5 backdrop-blur md:px-6">
      <div className="md:hidden">
        <LogoMark />
      </div>

      <form role="search" onSubmit={onSearch} className="relative min-w-0 max-w-md flex-1">
        <label htmlFor="global-search" className="sr-only">
          Поиск операций
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          id="global-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск операций"
          className="block min-h-11 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted"
        />
      </form>

      <div className="ml-auto flex items-center gap-1">
        <IconButton
          aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
        </IconButton>

        <Link
          to="/budgets"
          aria-label={alerts > 0 ? `Уведомления: предупреждений по бюджету — ${alerts}` : 'Уведомления: нет новых'}
          className="relative inline-flex size-11 items-center justify-center rounded-xl text-muted transition hover:bg-card-hover hover:text-fg"
        >
          <Bell className="size-5" aria-hidden />
          {alerts > 0 && (
            <span className="absolute right-1.5 top-1.5 flex min-w-4 items-center justify-center rounded-full bg-rose-700 px-1 text-[10px] font-bold leading-4 text-white">
              {alerts}
            </span>
          )}
        </Link>

        <Link
          to="/settings"
          aria-label="Профиль и настройки"
          className="ml-1 hidden size-10 items-center justify-center rounded-full bg-accent-strong text-sm font-semibold text-white sm:inline-flex"
        >
          ДП
        </Link>
      </div>
    </header>
  )
}
