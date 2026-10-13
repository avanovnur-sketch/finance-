import { useMemo } from 'react'
import { Banknote, CreditCard, PiggyBank, type LucideIcon } from 'lucide-react'
import { useDemoData } from '../context/DemoDataContext'
import { accountBalance, totalBalance } from '../utils/finance'
import { formatMoney } from '../utils/format'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { Card, CardHeader } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'

const ICONS: Record<string, LucideIcon> = { cash: Banknote, card: CreditCard, savings: PiggyBank }

export default function AccountsPage() {
  const { accounts, transactions, categories } = useDemoData()
  const total = useMemo(() => totalBalance(accounts, transactions), [accounts, transactions])
  const transfers = useMemo(() => transactions.filter((t) => t.type === 'transfer').slice(0, 5), [transactions])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Счета</h1>
        <p className="mt-1 text-sm text-muted">
          Всего: <span className="tabular font-semibold text-fg">{formatMoney(total)}</span>
        </p>
      </div>

      <section aria-label="Список счетов" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((a) => {
          const Icon = ICONS[a.icon] ?? Banknote
          return (
            <Card key={a.id}>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent-strong/20 text-accent-text">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-semibold">{a.name}</h2>
                  <p className="text-xs text-muted">Валюта: {a.currency}</p>
                </div>
              </div>
              <p className="tabular mt-4 text-2xl font-bold">{formatMoney(accountBalance(a, transactions))}</p>
              <p className="mt-1 text-xs text-muted">Начальный остаток: {formatMoney(a.initialBalance)}</p>
            </Card>
          )
        })}
      </section>

      <Card>
        <CardHeader title="Последние переводы" subtitle="Переводы между счетами не попадают в доходы и расходы" />
        {transfers.length === 0 ? (
          <EmptyState title="Переводов пока нет" />
        ) : (
          <TransactionTable transactions={transfers} categories={categories} accounts={accounts} />
        )}
      </Card>

      <p className="text-sm text-muted">
        Создание, переименование и удаление счетов подключится на этапе 4. Для счетов в разных валютах потребуется конвертация по
        курсу с указанием даты — суммы в разных валютах складывать нельзя.
      </p>
    </div>
  )
}
