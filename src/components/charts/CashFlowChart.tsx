import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { BalancePoint } from '../../utils/finance'
import { formatCompact, formatMoney } from '../../utils/format'
import { COLORS, axisTick, tooltipStyle } from './chartTheme'

/** Линейный график изменения баланса. */
export function CashFlowChart({ data }: { data: BalancePoint[] }) {
  return (
    <div className="h-64 w-full sm:h-72" role="img" aria-label="График изменения общего баланса за выбранный период">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="ff-balance-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.4} />
              <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={COLORS.grid} vertical={false} />
          <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} minTickGap={28} />
          <YAxis
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            width={52}
            domain={['auto', 'auto']}
            tickFormatter={(v: number) => formatCompact(v)}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v) => [formatMoney(Number(v)), 'Баланс']}
            labelFormatter={(l) => `Дата: ${l}`}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke={COLORS.accent}
            strokeWidth={2.5}
            fill="url(#ff-balance-fill)"
            dot={false}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
