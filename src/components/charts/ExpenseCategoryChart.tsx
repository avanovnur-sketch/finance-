import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { CategoryTotal } from '../../utils/finance'
import { formatMoney, formatPlainPercent } from '../../utils/format'
import { EmptyState } from '../ui/EmptyState'
import { tooltipStyle } from './chartTheme'

/** Круговая диаграмма расходов; под ней — легенда с суммами и долями (не только цвет). */
export function ExpenseCategoryChart({ data }: { data: CategoryTotal[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)

  if (data.length === 0) {
    return <EmptyState title="Нет расходов за период" description="Добавьте расход, и здесь появится распределение по категориям." />
  }

  return (
    <div>
      <div className="relative mx-auto h-48 w-full max-w-[220px]" role="img" aria-label="Круговая диаграмма расходов по категориям">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="100%" paddingAngle={2} stroke="none">
              {data.map((d) => (
                <Cell key={d.id} fill={d.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [formatMoney(Number(v)), String(name)]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-muted">Расходы</span>
          <span className="tabular text-sm font-semibold">{formatMoney(total)}</span>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {data.slice(0, 6).map((d) => (
          <li key={d.id} className="flex items-center gap-2 text-sm">
            <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: d.color }} aria-hidden />
            <span className="min-w-0 flex-1 truncate">{d.name}</span>
            <span className="tabular text-muted">{formatPlainPercent((d.value / total) * 100)}</span>
            <span className="tabular w-24 text-right font-medium">{formatMoney(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
