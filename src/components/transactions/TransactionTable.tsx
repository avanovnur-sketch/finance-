import { useMemo } from 'react'
import { ArrowLeftRight, Pencil, Trash2 } from 'lucide-react'
import type { Account, Category, Transaction } from '../../types'
import { formatDate } from '../../utils/date'
import { formatMoney } from '../../utils/format'
import { IconButton } from '../ui/Button'

interface Props {
  transactions: Transaction[]
  categories: Category[]
  accounts: Account[]
  onEdit?: (t: Transaction) => void
  onDelete?: (t: Transaction) => void
}

/** Desktop/планшет — таблица, телефон — карточки. */
export function TransactionTable({ transactions, categories, accounts, onEdit, onDelete }: Props) {
  const catMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])
  const accMap = useMemo(() => new Map(accounts.map((a) => [a.id, a])), [accounts])
  const hasActions = Boolean(onEdit || onDelete)

  const title = (t: Transaction) =>
    t.description || (t.type === 'transfer' ? 'Перевод между счетами' : (catMap.get(t.categoryId ?? '')?.name ?? 'Операция'))

  const account = (t: Transaction) =>
    t.type === 'transfer'
      ? `${accMap.get(t.accountId)?.name ?? '—'} → ${accMap.get(t.toAccountId ?? '')?.name ?? '—'}`
      : (accMap.get(t.accountId)?.name ?? '—')

  const amount = (t: Transaction) => {
    if (t.type === 'income') return { text: `+${formatMoney(t.amount)}`, cls: 'text-income' }
    if (t.type === 'expense') return { text: `−${formatMoney(t.amount)}`, cls: 'text-expense' }
    return { text: formatMoney(t.amount), cls: 'text-muted' }
  }

  const category = (t: Transaction) => {
    if (t.type === 'transfer') {
      return (
        <span className="inline-flex items-center gap-1.5 text-muted">
          <ArrowLeftRight className="size-3.5" aria-hidden />
          Перевод
        </span>
      )
    }
    const c = catMap.get(t.categoryId ?? '')
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="size-2.5 rounded-full" style={{ backgroundColor: c?.color ?? '#94a3b8' }} aria-hidden />
        {c?.name ?? 'Без категории'}
      </span>
    )
  }

  const actions = (t: Transaction) => (
    <div className="flex justify-end gap-1">
      {onEdit && (
        <IconButton aria-label={`Редактировать операцию «${title(t)}»`} onClick={() => onEdit(t)}>
          <Pencil className="size-4" aria-hidden />
        </IconButton>
      )}
      {onDelete && (
        <IconButton aria-label={`Удалить операцию «${title(t)}»`} onClick={() => onDelete(t)}>
          <Trash2 className="size-4" aria-hidden />
        </IconButton>
      )}
    </div>
  )

  return (
    <>
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <caption className="sr-only">Список операций</caption>
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th scope="col" className="py-3 pr-3 font-medium">Дата</th>
              <th scope="col" className="px-3 py-3 font-medium">Описание</th>
              <th scope="col" className="px-3 py-3 font-medium">Категория</th>
              <th scope="col" className="px-3 py-3 font-medium">Счёт</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Сумма</th>
              {hasActions && (
                <th scope="col" className="py-3 pl-3 text-right font-medium">
                  <span className="sr-only">Действия</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => {
              const a = amount(t)
              return (
                <tr key={t.id} className="border-b border-border/60 last:border-0">
                  <td className="whitespace-nowrap py-3 pr-3 text-muted">{formatDate(t.date)}</td>
                  <td className="max-w-[16rem] truncate px-3 py-3 font-medium">{title(t)}</td>
                  <td className="whitespace-nowrap px-3 py-3">{category(t)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted">{account(t)}</td>
                  <td className={`tabular whitespace-nowrap px-3 py-3 text-right font-semibold ${a.cls}`}>{a.text}</td>
                  {hasActions && <td className="py-1 pl-3">{actions(t)}</td>}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {transactions.map((t) => {
          const a = amount(t)
          return (
            <li key={t.id} className="rounded-xl border border-border bg-bg p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 flex-1 break-words font-medium">{title(t)}</p>
                <p className={`tabular shrink-0 font-semibold ${a.cls}`}>{a.text}</p>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span>{formatDate(t.date)}</span>
                {category(t)}
                <span>{account(t)}</span>
              </div>
              {hasActions && <div className="mt-2 border-t border-border/60 pt-1">{actions(t)}</div>}
            </li>
          )
        })}
      </ul>
    </>
  )
}
