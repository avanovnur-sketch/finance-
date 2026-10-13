import { useBudgetUsage } from '../hooks/useBudgetUsage'
import { BudgetProgress } from '../components/budgets/BudgetProgress'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'

export default function BudgetsPage() {
  const usage = useBudgetUsage()
  const monthLabel = new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
  const total = usage.find((u) => u.id === 'b-total')
  const categoryBudgets = usage.filter((u) => u.id !== 'b-total')
  const warnings = usage.filter((u) => u.status !== 'ok')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Бюджеты</h1>
        <p className="mt-1 text-sm capitalize text-muted">{monthLabel}</p>
      </div>

      {warnings.length > 0 && (
        <div role="status" className="rounded-2xl border border-border bg-card p-4 text-sm">
          <p className="font-semibold">Требуют внимания: {warnings.length}</p>
          <ul className="mt-1 list-disc pl-5 text-muted">
            {warnings.map((w) => (
              <li key={w.id}>
                {w.name}: {w.status === 'exceeded' ? 'лимит превышен' : 'использовано 80% и более'}
              </li>
            ))}
          </ul>
        </div>
      )}

      {usage.length === 0 ? (
        <Card>
          <EmptyState title="Бюджетов пока нет" description="Создание бюджетов и лимитов появится на этапе 5." />
        </Card>
      ) : (
        <>
          {total && <BudgetProgress {...total} />}
          <section aria-label="Лимиты по категориям" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categoryBudgets.map((b) => (
              <BudgetProgress key={b.id} {...b} />
            ))}
          </section>
        </>
      )}

      <p className="text-sm text-muted">
        Учитываются только расходы текущего месяца. Переводы между счетами в бюджет не входят. Создание и редактирование лимитов
        подключится вместе с API (этап 5).
      </p>
    </div>
  )
}
