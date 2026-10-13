import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus, TrendingDown, TrendingUp, Wallet, type LucideIcon } from 'lucide-react'
import { Card } from '../ui/Card'
import type { Summary } from '../../utils/finance'
import { percentChange } from '../../utils/finance'
import { formatMoney, formatPercent, formatSignedMoney } from '../../utils/format'

function Delta({ current, previous, goodWhenUp }: { current: number; previous: number; goodWhenUp: boolean }) {
  const pct = percentChange(current, previous)
  if (pct === null) return <p className="mt-2 text-xs text-muted">Нет данных за прошлый период</p>
  if (pct === 0) {
    return (
      <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted">
        <Minus className="size-3.5" aria-hidden />0% к прошлому периоду
      </p>
    )
  }
  const up = pct > 0
  const good = up === goodWhenUp
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <p className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${good ? 'text-income' : 'text-expense'}`}>
      <Icon className="size-3.5" aria-hidden />
      {formatPercent(pct)} к прошлому периоду
    </p>
  )
}

function Item({
  label,
  icon: Icon,
  value,
  valueClass,
  children,
  className,
}: {
  label: string
  icon: LucideIcon
  value: string
  valueClass: string
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={className}>
      <div className="flex items-center gap-2 text-sm text-muted">
        <Icon className="size-4" aria-hidden />
        {label}
      </div>
      <p className={`tabular mt-2 text-2xl font-bold ${valueClass}`}>{value}</p>
      {children}
    </Card>
  )
}

interface Props {
  current: Summary
  previous: Summary
  /** Классы для сетки: net-карточка занимает всю ширину на планшете */
  netClassName?: string
}

export function SummaryCards({ current, previous, netClassName }: Props) {
  return (
    <>
      <Item label="Доходы" icon={TrendingUp} value={`+${formatMoney(current.income)}`} valueClass="text-income">
        <Delta current={current.income} previous={previous.income} goodWhenUp />
      </Item>
      <Item label="Расходы" icon={TrendingDown} value={`−${formatMoney(current.expenses)}`} valueClass="text-expense">
        <Delta current={current.expenses} previous={previous.expenses} goodWhenUp={false} />
      </Item>
      <Item
        label="Денежный поток"
        icon={Wallet}
        value={formatSignedMoney(current.net)}
        valueClass={current.net >= 0 ? 'text-income' : 'text-expense'}
        className={netClassName}
      >
        <Delta current={current.net} previous={previous.net} goodWhenUp />
      </Item>
    </>
  )
}
