import { useMemo } from 'react'
import { useDemoData } from '../context/DemoDataContext'
import { budgetUsage, round2 } from '../utils/finance'
import { today } from '../utils/date'

/** Использование бюджетов за текущий календарный месяц. Переводы не учитываются. */
export function useBudgetUsage() {
  const { budgets, categories, transactions } = useDemoData()
  return useMemo(() => {
    const month = today().slice(0, 7)
    const spentBy = new Map<string, number>()
    let total = 0
    for (const t of transactions) {
      if (t.type !== 'expense' || t.date.slice(0, 7) !== month) continue
      total += t.amount
      if (t.categoryId) spentBy.set(t.categoryId, (spentBy.get(t.categoryId) ?? 0) + t.amount)
    }
    return budgets.map((b) => {
      const spent = round2(b.categoryId ? (spentBy.get(b.categoryId) ?? 0) : total)
      const cat = b.categoryId ? categories.find((c) => c.id === b.categoryId) : undefined
      return {
        id: b.id,
        name: cat ? cat.name : 'Общий месячный бюджет',
        color: cat?.color,
        limit: b.limit,
        spent,
        ...budgetUsage(b.limit, spent),
      }
    })
  }, [budgets, categories, transactions])
}
