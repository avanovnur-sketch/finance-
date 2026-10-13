import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatMoney, formatPercent } from '../../utils/format'

interface Props {
  balance: number
  /** Изменение баланса за период в процентах; null — нечего сравнивать */
  change: number | null
}

export function BalanceCard({ balance, change }: Props) {
  const up = (change ?? 0) >= 0
  return (
    <Card className="border-accent/30 bg-gradient-to-br from-accent-strong/25 to-card">
      <p className="text-sm text-muted">Общий баланс</p>
      <p className="tabular mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{formatMoney(balance)}</p>
      <p className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium ${up ? 'text-income' : 'text-expense'}`}>
        {change === null ? (
          <span className="text-muted">Нет данных для сравнения</span>
        ) : (
          <>
            {up ? <TrendingUp className="size-4" aria-hidden /> : <TrendingDown className="size-4" aria-hidden />}
            {formatPercent(change)} за период
          </>
        )}
      </p>
    </Card>
  )
}
