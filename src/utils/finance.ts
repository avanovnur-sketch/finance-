import type { Account, Category, Transaction } from '../types'
import type { DateRange } from './period'
import { addDays, diffDays, formatMonthShort, formatShort } from './date'

export const round2 = (n: number) => Math.round(n * 100) / 100

/** Влияние операции на общий баланс. Переводы между своими счетами общий баланс не меняют. */
export function signedEffect(t: Transaction): number {
  if (t.type === 'income') return t.amount
  if (t.type === 'expense') return -t.amount
  return 0
}

export function accountBalance(a: Account, txs: Transaction[]): number {
  let b = a.initialBalance
  for (const t of txs) {
    if (t.type === 'transfer') {
      if (t.accountId === a.id) b -= t.amount
      if (t.toAccountId === a.id) b += t.amount
    } else if (t.accountId === a.id) {
      b += signedEffect(t)
    }
  }
  return round2(b)
}

export function totalBalance(accounts: Account[], txs: Transaction[]): number {
  // Демо: все счета в KGS. С несколькими валютами суммировать нельзя без конвертации.
  return round2(accounts.reduce((sum, a) => sum + accountBalance(a, txs), 0))
}

export function inRange(t: Transaction, r: DateRange): boolean {
  return t.date >= r.from && t.date <= r.to
}

export interface Summary {
  income: number
  expenses: number
  net: number
}

/** Переводы в доходы и расходы не попадают. */
export function summarize(txs: Transaction[]): Summary {
  let income = 0
  let expenses = 0
  for (const t of txs) {
    if (t.type === 'income') income += t.amount
    else if (t.type === 'expense') expenses += t.amount
  }
  return { income: round2(income), expenses: round2(expenses), net: round2(income - expenses) }
}

export interface CategoryTotal {
  id: string
  name: string
  color: string
  value: number
}

export function expensesByCategory(txs: Transaction[], categories: Category[]): CategoryTotal[] {
  const map = new Map<string, number>()
  for (const t of txs) {
    if (t.type !== 'expense' || !t.categoryId) continue
    map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount)
  }
  const out: CategoryTotal[] = []
  for (const [id, value] of map) {
    const c = categories.find((x) => x.id === id)
    out.push({ id, name: c?.name ?? 'Без категории', color: c?.color ?? '#94a3b8', value: round2(value) })
  }
  return out.sort((a, b) => b.value - a.value)
}

const MAX_POINTS = 800

export interface BalancePoint {
  date: string
  label: string
  balance: number
}

/** Баланс на конец каждого дня диапазона. */
export function balanceSeries(accounts: Account[], txs: Transaction[], r: DateRange): BalancePoint[] {
  const from = diffDays(r.from, r.to) + 1 > MAX_POINTS ? addDays(r.to, -(MAX_POINTS - 1)) : r.from
  let balance = accounts.reduce((s, a) => s + a.initialBalance, 0)
  const perDay = new Map<string, number>()
  for (const t of txs) {
    const e = signedEffect(t)
    if (e === 0) continue
    if (t.date < from) balance += e
    else if (t.date <= r.to) perDay.set(t.date, (perDay.get(t.date) ?? 0) + e)
  }
  const out: BalancePoint[] = []
  const days = diffDays(from, r.to) + 1
  for (let i = 0; i < days; i++) {
    const date = addDays(from, i)
    balance += perDay.get(date) ?? 0
    out.push({ date, label: formatShort(date), balance: round2(balance) })
  }
  return out
}

export interface PeriodBucket {
  key: string
  label: string
  income: number
  expenses: number
}

/** Доходы и расходы по дням (до 31 дня) или по месяцам. */
export function periodSeries(txs: Transaction[], r: DateRange): PeriodBucket[] {
  const days = Math.min(diffDays(r.from, r.to) + 1, MAX_POINTS)
  const byMonth = days > 31
  const buckets = new Map<string, PeriodBucket>()
  const start = addDays(r.to, -(days - 1))
  for (let i = 0; i < days; i++) {
    const date = addDays(start, i)
    const key = byMonth ? date.slice(0, 7) : date
    if (!buckets.has(key)) {
      buckets.set(key, {
        key,
        label: byMonth ? formatMonthShort(date) : formatShort(date),
        income: 0,
        expenses: 0,
      })
    }
  }
  for (const t of txs) {
    if (t.type === 'transfer' || t.date < start || t.date > r.to) continue
    const b = buckets.get(byMonth ? t.date.slice(0, 7) : t.date)
    if (!b) continue
    if (t.type === 'income') b.income += t.amount
    else b.expenses += t.amount
  }
  return [...buckets.values()].map((b) => ({ ...b, income: round2(b.income), expenses: round2(b.expenses) }))
}

/** Изменение в процентах; null, если база равна нулю. */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return round2(((current - previous) / Math.abs(previous)) * 100)
}

export type BudgetStatus = 'ok' | 'warning' | 'exceeded'

export function budgetUsage(limit: number, spent: number) {
  const percent = limit > 0 ? (spent / limit) * 100 : 0
  const status: BudgetStatus = spent > limit ? 'exceeded' : percent >= 80 ? 'warning' : 'ok'
  return { percent, status, remaining: round2(limit - spent) }
}
