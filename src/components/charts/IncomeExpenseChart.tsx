import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { PeriodBucket } from '../../utils/finance'
import { formatCompact, formatMoney } from '../../utils/format'
import { COLORS, axisTick, tooltipStyle } from './chartTheme'

/** Столбчатая диаграмма доходов и расходов. */
export function IncomeExpenseChart({ data }: { data: PeriodBucket[] }) {
  return (
    <div className="h-64 w-full sm:h-72" role="img" aria-label="Столбчатая диаграмма доходов и расходов по периодам">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={COLORS.grid} vertical={false} />
          <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} minTickGap={16} />
          <YAxis
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            width={52}
            tickFormatter={(v: number) => formatCompact(v)}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: 'rgba(148,163,184,0.12)' }}
            formatter={(v, name) => [formatMoney(Number(v)), String(name)]}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Bar dataKey="income" name="Доходы" fill={COLORS.income} radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="expenses" name="Расходы" fill={COLORS.expense} radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
