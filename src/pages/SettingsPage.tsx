import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Moon, Sun } from 'lucide-react'
import { useTheme, type Theme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import { cn } from '../utils/cn'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { Field } from '../components/ui/Field'
import { inputClass } from '../components/ui/styles'

const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'dark', label: 'Тёмная', icon: Moon },
  { value: 'light', label: 'Светлая', icon: Sun },
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [name, setName] = useState('Демо-пользователь')
  const [notify, setNotify] = useState({ budget80: true, budgetOver: true, weekly: false })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Настройки</h1>

      <Card>
        <CardHeader title="Профиль" />
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            toast('Демо: профиль будет сохраняться на сервере после этапа 3')
          }}
        >
          <Field label="Имя" htmlFor="s-name">
            <input id="s-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
          </Field>
          <Field label="Основная валюта" htmlFor="s-cur" hint="По умолчанию — кыргызский сом. Другие валюты потребуют конвертации по курсу с датой.">
            <select id="s-cur" className={inputClass} defaultValue="KGS" aria-describedby="s-cur-msg">
              <option value="KGS">KGS — кыргызский сом</option>
              <option value="USD" disabled>USD — доллар США (скоро)</option>
            </select>
          </Field>
          <Button type="submit">Сохранить</Button>
        </form>
      </Card>

      <Card>
        <CardHeader title="Тема оформления" />
        <div role="radiogroup" aria-label="Тема оформления" className="grid grid-cols-2 gap-2">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={theme === value}
              onClick={() => setTheme(value)}
              className={cn(
                'flex min-h-12 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition',
                theme === value ? 'border-accent bg-accent-strong/20 text-accent-text' : 'border-border text-muted hover:text-fg',
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Уведомления" />
        <div className="space-y-1">
          {(
            [
              ['budget80', 'Предупреждать при достижении 80% бюджета'],
              ['budgetOver', 'Предупреждать при превышении лимита'],
              ['weekly', 'Еженедельная сводка на почту'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg px-1 text-sm">
              <input
                type="checkbox"
                className="size-5 accent-violet-600"
                checked={notify[key]}
                onChange={(e) => setNotify((n) => ({ ...n, [key]: e.target.checked }))}
              />
              {label}
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Безопасность" subtitle="Смена пароля появится вместе с авторизацией (этап 3)." />
        <Button variant="secondary" onClick={() => navigate('/login')}>
          <LogOut className="size-4" aria-hidden /> Выйти из аккаунта
        </Button>
      </Card>
    </div>
  )
}
