import { useMemo } from 'react'
import { useDemoData } from '../context/DemoDataContext'
import type { Category } from '../types'
import { Card, CardHeader } from '../components/ui/Card'

export default function CategoriesPage() {
  const { categories, transactions } = useDemoData()

  const counts = useMemo(() => {
    const m = new Map<string, number>()
    for (const t of transactions) if (t.categoryId) m.set(t.categoryId, (m.get(t.categoryId) ?? 0) + 1)
    return m
  }, [transactions])

  const group = (title: string, type: Category['type']) => (
    <Card>
      <CardHeader title={title} />
      <ul className="divide-y divide-border/60">
        {categories
          .filter((c) => c.type === type)
          .map((c) => (
            <li key={c.id} className="flex min-h-12 items-center gap-3 py-2">
              <span className="size-3.5 shrink-0 rounded-full" style={{ backgroundColor: c.color }} aria-hidden />
              <span className="min-w-0 flex-1 truncate font-medium">{c.name}</span>
              <span className="text-sm text-muted">Операций: {counts.get(c.id) ?? 0}</span>
            </li>
          ))}
      </ul>
    </Card>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Категории</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        {group('Расходы', 'expense')}
        {group('Доходы', 'income')}
      </div>
      <p className="text-sm text-muted">Добавление и редактирование собственных категорий подключится на этапе 4.</p>
    </div>
  )
}
