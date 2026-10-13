import type { Category, Transaction, TxType } from '../types'
import { inRange } from './finance'
import { resolveRange, type PeriodPreset } from './period'

export type SortKey = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

export interface Filters {
  q: string
  type: '' | TxType
  categoryId: string
  accountId: string
  period: '' | PeriodPreset
  from: string
  to: string
  min: string
  max: string
  sort: SortKey
}

export const emptyFilters: Filters = {
  q: '',
  type: '',
  categoryId: '',
  accountId: '',
  period: '',
  from: '',
  to: '',
  min: '',
  max: '',
  sort: 'date-desc',
}

/** Сколько фильтров включено (сортировка не считается). */
export function countActive(f: Filters): number {
  let n = 0
  if (f.q.trim()) n++
  if (f.type) n++
  if (f.categoryId) n++
  if (f.accountId) n++
  if (f.period) n++
  if (f.min !== '') n++
  if (f.max !== '') n++
  return n
}

/** Все фильтры работают совместно (логическое И). */
export function applyFilters(txs: Transaction[], f: Filters, categories: Category[]): Transaction[] {
  const q = f.q.trim().toLowerCase()
  const catName = new Map(categories.map((c) => [c.id, c.name.toLowerCase()]))
  const range = f.period ? resolveRange({ preset: f.period, from: f.from, to: f.to }, true) : null
  const min = f.min !== '' ? Number(f.min) : null
  const max = f.max !== '' ? Number(f.max) : null

  const result = txs.filter((t) => {
    if (f.type && t.type !== f.type) return false
    if (f.categoryId && t.categoryId !== f.categoryId) return false
    if (f.accountId && t.accountId !== f.accountId && t.toAccountId !== f.accountId) return false
    if (range && !inRange(t, range)) return false
    if (min !== null && !Number.isNaN(min) && t.amount < min) return false
    if (max !== null && !Number.isNaN(max) && t.amount > max) return false
    if (q) {
      const hay = `${t.description} ${catName.get(t.categoryId ?? '') ?? ''}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  const dir = f.sort.endsWith('asc') ? 1 : -1
  const byAmount = f.sort.startsWith('amount')
  return result.sort((a, b) => {
    const d = byAmount ? a.amount - b.amount : a.date.localeCompare(b.date)
    return d !== 0 ? d * dir : a.id.localeCompare(b.id)
  })
}
