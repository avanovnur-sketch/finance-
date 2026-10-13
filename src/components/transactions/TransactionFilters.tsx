import { useId } from 'react'
import { Search } from 'lucide-react'
import type { Account, Category, TxType } from '../../types'
import { PERIOD_LABELS, type PeriodPreset } from '../../utils/period'
import { emptyFilters, type Filters, type SortKey } from '../../utils/transactionFilters'
import { Button } from '../ui/Button'
import { inputClass, labelClass } from '../ui/styles'

interface Props {
  value: Filters
  onChange: (f: Filters) => void
  categories: Category[]
  accounts: Account[]
}

const PERIODS: PeriodPreset[] = ['day', 'week', 'month', 'year', 'custom']

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'date-desc', label: 'Сначала новые' },
  { value: 'date-asc', label: 'Сначала старые' },
  { value: 'amount-desc', label: 'Сумма: по убыванию' },
  { value: 'amount-asc', label: 'Сумма: по возрастанию' },
]

export function TransactionFilters({ value, onChange, categories, accounts }: Props) {
  const id = useId()
  const set = <K extends keyof Filters>(key: K, v: Filters[K]) => onChange({ ...value, [key]: v })
  const categoryOptions = value.type && value.type !== 'transfer' ? categories.filter((c) => c.type === value.type) : categories

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${id}-q`} className={labelClass}>
          Поиск по названию и описанию
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id={`${id}-q`}
            type="search"
            value={value.q}
            onChange={(e) => set('q', e.target.value)}
            placeholder="Например, такси"
            className={`${inputClass} pl-9`}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label htmlFor={`${id}-type`} className={labelClass}>Тип</label>
          <select
            id={`${id}-type`}
            className={inputClass}
            value={value.type}
            onChange={(e) => onChange({ ...value, type: e.target.value as '' | TxType, categoryId: '' })}
          >
            <option value="">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
            <option value="transfer">Переводы</option>
          </select>
        </div>

        <div>
          <label htmlFor={`${id}-cat`} className={labelClass}>Категория</label>
          <select
            id={`${id}-cat`}
            className={inputClass}
            value={value.categoryId}
            disabled={value.type === 'transfer'}
            onChange={(e) => set('categoryId', e.target.value)}
          >
            <option value="">Все категории</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${id}-acc`} className={labelClass}>Счёт</label>
          <select id={`${id}-acc`} className={inputClass} value={value.accountId} onChange={(e) => set('accountId', e.target.value)}>
            <option value="">Все счета</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${id}-period`} className={labelClass}>Период</label>
          <select
            id={`${id}-period`}
            className={inputClass}
            value={value.period}
            onChange={(e) => onChange({ ...value, period: e.target.value as '' | PeriodPreset })}
          >
            <option value="">За всё время</option>
            {PERIODS.map((p) => (
              <option key={p} value={p}>{PERIOD_LABELS[p]}</option>
            ))}
          </select>
        </div>

        {value.period === 'custom' && (
          <>
            <div>
              <label htmlFor={`${id}-from`} className={labelClass}>С даты</label>
              <input id={`${id}-from`} type="date" className={inputClass} value={value.from} onChange={(e) => set('from', e.target.value)} />
            </div>
            <div>
              <label htmlFor={`${id}-to`} className={labelClass}>По дату</label>
              <input id={`${id}-to`} type="date" className={inputClass} value={value.to} onChange={(e) => set('to', e.target.value)} />
            </div>
          </>
        )}

        <div>
          <label htmlFor={`${id}-min`} className={labelClass}>Сумма от, сом</label>
          <input id={`${id}-min`} type="number" inputMode="decimal" min="0" className={inputClass} value={value.min} onChange={(e) => set('min', e.target.value)} />
        </div>
        <div>
          <label htmlFor={`${id}-max`} className={labelClass}>Сумма до, сом</label>
          <input id={`${id}-max`} type="number" inputMode="decimal" min="0" className={inputClass} value={value.max} onChange={(e) => set('max', e.target.value)} />
        </div>

        <div>
          <label htmlFor={`${id}-sort`} className={labelClass}>Сортировка</label>
          <select id={`${id}-sort`} className={inputClass} value={value.sort} onChange={(e) => set('sort', e.target.value as SortKey)}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <Button variant="secondary" onClick={() => onChange({ ...emptyFilters })}>
        Сбросить фильтры
      </Button>
    </div>
  )
}
