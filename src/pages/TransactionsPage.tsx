import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus, SlidersHorizontal } from 'lucide-react'
import { useDemoData } from '../context/DemoDataContext'
import { useToast } from '../context/ToastContext'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { Transaction } from '../types'
import { applyFilters, countActive, emptyFilters, type Filters } from '../utils/transactionFilters'
import { TransactionFilters } from '../components/transactions/TransactionFilters'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { TransactionFormModal } from '../components/transactions/TransactionForm'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'

const PAGE_SIZE = 10

export default function TransactionsPage() {
  const { transactions, accounts, categories, deleteTransaction } = useDemoData()
  const { toast } = useToast()
  const [params] = useSearchParams()
  const qParam = params.get('q') ?? ''

  const [filters, setFilters] = useState<Filters>({ ...emptyFilters, q: qParam })
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | undefined>()
  const [deleting, setDeleting] = useState<Transaction | null>(null)

  // Поиск из шапки: ?q=...
  useEffect(() => {
    setFilters((f) => (f.q === qParam ? f : { ...f, q: qParam }))
    setPage(1)
  }, [qParam])

  const updateFilters = (f: Filters) => {
    setFilters(f)
    setPage(1)
  }

  // Задержка поиска: список не пересчитывается на каждый символ
  const debouncedQ = useDebouncedValue(filters.q, 300)
  const filtered = useMemo(
    () => applyFilters(transactions, { ...filters, q: debouncedQ }, categories),
    [transactions, filters, debouncedQ, categories],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const active = countActive(filters)

  const openCreate = () => {
    setEditing(undefined)
    setFormOpen(true)
  }

  const filtersEl = <TransactionFilters value={filters} onChange={updateFilters} categories={categories} accounts={accounts} />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Операции</h1>
        <div className="flex gap-2">
          <Button variant="secondary" className="md:hidden" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal className="size-4" aria-hidden />
            Фильтры{active > 0 ? ` (${active})` : ''}
          </Button>
          <Button onClick={openCreate}>
            <Plus className="size-4" aria-hidden /> Добавить
          </Button>
        </div>
      </div>

      {/* Планшет и desktop: фильтры на странице. Телефон: в отдельной панели. */}
      <Card className="hidden md:block">{filtersEl}</Card>
      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Фильтры">
        {filtersEl}
        <Button className="mt-4 w-full" onClick={() => setFiltersOpen(false)}>
          Показать результаты ({filtered.length})
        </Button>
      </Modal>

      <Card>
        {transactions.length === 0 ? (
          <EmptyState
            title="Пока нет операций"
            description="Добавьте первую запись о доходе или расходе."
            action={<Button onClick={openCreate}>Добавить первую операцию</Button>}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Ничего не найдено"
            description="Измените или сбросьте фильтры — под текущие условия операций нет."
            action={<Button variant="secondary" onClick={() => updateFilters({ ...emptyFilters })}>Сбросить фильтры</Button>}
          />
        ) : (
          <>
            <p className="mb-3 text-sm text-muted" aria-live="polite">
              Найдено операций: {filtered.length}
            </p>
            <TransactionTable
              transactions={pageItems}
              categories={categories}
              accounts={accounts}
              onEdit={(t) => {
                setEditing(t)
                setFormOpen(true)
              }}
              onDelete={setDeleting}
            />
            {pageCount > 1 && (
              <nav aria-label="Страницы списка" className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                <Button variant="secondary" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
                  <ChevronLeft className="size-4" aria-hidden /> Назад
                </Button>
                <span className="text-sm text-muted">
                  Страница {safePage} из {pageCount}
                </span>
                <Button variant="secondary" disabled={safePage >= pageCount} onClick={() => setPage(safePage + 1)}>
                  Вперёд <ChevronRight className="size-4" aria-hidden />
                </Button>
              </nav>
            )}
          </>
        )}
      </Card>

      <TransactionFormModal open={formOpen} onClose={() => setFormOpen(false)} transaction={editing} />

      <ConfirmDialog
        open={deleting !== null}
        title="Удалить операцию?"
        message={
          deleting
            ? `Операция «${deleting.description || 'без описания'}» будет удалена, баланс и статистика пересчитаются. Это действие нельзя отменить.`
            : ''
        }
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            deleteTransaction(deleting.id)
            toast('Операция удалена')
          }
          setDeleting(null)
        }}
      />
    </div>
  )
}
