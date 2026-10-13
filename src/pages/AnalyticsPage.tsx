import { useMemo, useState } from 'react'
import { useDemoData } from '../context/DemoDataContext'
import { balanceSeries, expensesByCategory, inRange, percentChange, periodSeries, summarize } from '../utils/finance'
import { formatMoney, formatPercent, formatPlainPercent, formatSignedMoney } from '../utils/format'
import { formatDate } from '../utils/date'
import { defaultPeriod, previousRange, resolveRange, type PeriodState } from '../utils/period'
import { CashFlowChart } from '../components/charts/CashFlowChart'
import { ExpenseCategoryChart } from '../components/charts/ExpenseCategoryChart'
import { IncomeExpenseChart } from '../components/charts/IncomeExpenseChart'
import { SummaryCards } from '../components/dashboard/SummaryCards'
import { Card, CardHeader } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { PeriodPicker } from '../components/ui/PeriodPicker'
import { ProgressBar } from '../components/ui/ProgressBar'

export default function AnalyticsPage() {
  const { transactions, accounts, categories } = useDemoData()
  const [period, setPeriod] = useState<PeriodState>(defaultPeriod('month'))

  const range = useMemo(() => resolveRange(period), [period])
  const prevRange = useMemo(() => previousRange(range, period.preset), [range, period.preset])

  const d = useMemo(() => {
    const cur = transactions.filter((t) => inRange(t, range))
    const prev = transactions.filter((t) => inRange(t, prevRange))
    return {
      current: summarize(cur),
      previous: summarize(prev),
      series: balanceSeries(accounts, transactions, range),
      buckets: periodSeries(cur, range),
      byCategory: expensesByCategory(cur, categories),
      count: cur.filter((t) => t.type !== 'transfer').length,
    }
  }, [transactions, accounts, categories, range, prevRange])

  const rows = [
    { label: 'Доходы', cur: d.current.income, prev: d.previous.income, goodWhenUp: true, signed: false },
    { label: 'Расходы', cur: d.current.expenses, prev: d.previous.expenses, goodWhenUp: false, signed: false },
    { label: 'Чистый денежный поток', cur: d.current.net, prev: d.previous.net, goodWhenUp: true, signed: true },
  ]
  const totalExpenses = d.byCategory.reduce((s, c) => s + c.value, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Аналитика</h1>
          <p className="mt-1 text-sm text-muted">
            {formatDate(range.from)} — {formatDate(range.to)}. Сравнение: {formatDate(prevRange.from)} — {formatDate(prevRange.to)}
          </p>
        </div>
        <PeriodPicker value={period} onChange={setPeriod} />
      </div>

      {d.count === 0 ? (
        <Card>
          <EmptyState title="Нет данных за период" description="За выбранные даты нет доходов и расходов. Выберите другой период." />
        </Card>
      ) : (
        <>
          <section aria-label="Итоги периода" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <SummaryCards current={d.current} previous={d.previous} netClassName="md:col-span-2 xl:col-span-1" />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader title="Изменение баланса" />
              <CashFlowChart data={d.series} />
            </Card>
            <Card>
              <CardHeader title="Доходы и расходы" />
              <IncomeExpenseChart data={d.buckets} />
            </Card>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <Card>
              <CardHeader title="Структура расходов" />
              <ExpenseCategoryChart data={d.byCategory} />
            </Card>

            <Card>
              <CardHeader title="Самые затратные категории" />
              {d.byCategory.length === 0 ? (
                <EmptyState title="Нет расходов за период" />
              ) : (
                <ol className="space-y-4">
                  {d.byCategory.slice(0, 5).map((c, i) => (
                    <li key={c.id}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                        <span className="min-w-0 truncate font-medium">
                          {i + 1}. {c.name}
                        </span>
                        <span className="tabular shrink-0">{formatMoney(c.value)}</span>
                      </div>
                      <ProgressBar value={(c.value / totalExpenses) * 100} label={`Доля категории «${c.name}»`} color={c.color} />
                      <p className="mt-1 text-xs text-muted">{formatPlainPercent((c.value / totalExpenses) * 100)} всех расходов</p>
                    </li>
                  ))}
                </ol>
              )}
            </Card>

            <Card>
              <CardHeader title="Сравнение периодов" />
              <table className="w-full text-sm">
                <caption className="sr-only">Сравнение текущего и предыдущего периода</caption>
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                    <th scope="col" className="py-2 pr-2 font-medium">Показатель</th>
                    <th scope="col" className="px-2 py-2 text-right font-medium">Сейчас</th>
                    <th scope="col" className="py-2 pl-2 text-right font-medium">Раньше</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const pct = percentChange(r.cur, r.prev)
                    const good = pct === null ? null : pct > 0 === r.goodWhenUp
                    return (
                      <tr key={r.label} className="border-b border-border/60 align-top last:border-0">
                        <th scope="row" className="py-3 pr-2 text-left font-medium">{r.label}</th>
                        <td className="tabular px-2 py-3 text-right">
                          {r.signed ? formatSignedMoney(r.cur) : formatMoney(r.cur)}
                          <span className={`block text-xs ${pct === null || pct === 0 ? 'text-muted' : good ? 'text-income' : 'text-expense'}`}>
                            {pct === null ? 'нет базы' : formatPercent(pct)}
                          </span>
                        </td>
                        <td className="tabular py-3 pl-2 text-right text-muted">
                          {r.signed ? formatSignedMoney(r.prev) : formatMoney(r.prev)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          </section>
        </>
      )}
    </div>
  )
}
