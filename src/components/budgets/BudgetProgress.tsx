import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import type { BudgetStatus } from '../../utils/finance'
import { formatMoney, formatPlainPercent } from '../../utils/format'

interface Props {
  name: string
  color?: string
  limit: number
  spent: number
  percent: number
  remaining: number
  status: BudgetStatus
}

const STATUS = {
  ok: { Icon: CheckCircle2, cls: 'text-income', bar: '#10b981' },
  warning: { Icon: AlertTriangle, cls: 'text-warn', bar: '#f59e0b' },
  exceeded: { Icon: XCircle, cls: 'text-expense', bar: '#f43f5e' },
}

/** Предупреждение — и цветом, и иконкой, и текстом. */
export function BudgetProgress({ name, color, limit, spent, percent, remaining, status }: Props) {
  const { Icon, cls, bar } = STATUS[status]
  const message =
    status === 'exceeded'
      ? `Лимит превышен на ${formatMoney(Math.abs(remaining))}`
      : status === 'warning'
        ? `Использовано более 80% лимита, осталось ${formatMoney(remaining)}`
        : `Осталось ${formatMoney(remaining)}`

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {color && <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden />}
          <h3 className="truncate font-semibold">{name}</h3>
        </div>
        <span className={`tabular shrink-0 text-sm font-semibold ${cls}`}>{formatPlainPercent(percent)}</span>
      </div>
      <p className="tabular mt-2 text-sm text-muted">
        {formatMoney(spent)} из {formatMoney(limit)}
      </p>
      <div className="mt-3">
        <ProgressBar value={percent} label={`Использование бюджета «${name}»`} color={bar} />
      </div>
      <p className={`mt-3 flex items-start gap-2 text-sm ${cls}`}>
        <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
        {message}
      </p>
    </Card>
  )
}
