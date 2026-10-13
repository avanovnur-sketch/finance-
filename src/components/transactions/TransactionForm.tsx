import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Transaction, TxType } from '../../types'
import { transactionSchema, type TransactionFormValues } from '../../schemas/transaction'
import { useDemoData } from '../../context/DemoDataContext'
import { useToast } from '../../context/ToastContext'
import { today } from '../../utils/date'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'
import { Modal } from '../ui/Modal'
import { inputClass } from '../ui/styles'

const TYPES: { value: TxType; label: string }[] = [
  { value: 'expense', label: 'Расход' },
  { value: 'income', label: 'Доход' },
  { value: 'transfer', label: 'Перевод' },
]

interface FormProps {
  transaction?: Transaction
  defaultType: TxType
  onDone: () => void
}

/** Одна форма и для создания, и для редактирования. */
function TransactionForm({ transaction, defaultType, onDone }: FormProps) {
  const { accounts, categories, addTransaction, updateTransaction } = useDemoData()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: transaction?.type ?? defaultType,
      amount: transaction?.amount,
      date: transaction?.date ?? today(),
      accountId: transaction?.accountId ?? accounts[0]?.id ?? '',
      categoryId: transaction?.categoryId ?? '',
      toAccountId: transaction?.toAccountId ?? '',
      description: transaction?.description ?? '',
    },
  })

  const type = watch('type')
  const categoryOptions = categories.filter((c) => c.type === type)

  const onSubmit = (v: TransactionFormValues) => {
    const payload = {
      type: v.type,
      amount: v.amount,
      date: v.date,
      accountId: v.accountId,
      categoryId: v.type === 'transfer' ? undefined : v.categoryId,
      toAccountId: v.type === 'transfer' ? v.toAccountId : undefined,
      description: v.description.trim(),
    }
    if (transaction) {
      updateTransaction(transaction.id, payload)
      toast('Операция сохранена')
    } else {
      addTransaction(payload)
      toast('Операция добавлена')
    }
    onDone()
  }

  const describe = (name: keyof TransactionFormValues) => (errors[name] ? `${name}-msg` : undefined)

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Тип операции</legend>
        <div className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-bg p-1">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={type === t.value}
              onClick={() => {
                setValue('type', t.value)
                setValue('categoryId', '')
                clearErrors()
              }}
              className={cn(
                'min-h-10 rounded-lg text-sm font-semibold transition',
                type === t.value ? 'bg-accent-strong text-white' : 'text-muted hover:text-fg',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Сумма, сом" htmlFor="tx-amount" error={errors.amount?.message}>
          <input
            id="tx-amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0"
            className={inputClass}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={describe('amount')}
            {...register('amount', { valueAsNumber: true })}
          />
        </Field>
        <Field label="Дата" htmlFor="tx-date" error={errors.date?.message}>
          <input
            id="tx-date"
            type="date"
            className={inputClass}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={describe('date')}
            {...register('date')}
          />
        </Field>
      </div>

      <Field label={type === 'transfer' ? 'Со счёта' : 'Счёт'} htmlFor="tx-account" error={errors.accountId?.message}>
        <select id="tx-account" className={inputClass} aria-describedby={describe('accountId')} {...register('accountId')}>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.currency})
            </option>
          ))}
        </select>
      </Field>

      {type === 'transfer' ? (
        <Field label="На счёт" htmlFor="tx-to" error={errors.toAccountId?.message} hint="Переводы не считаются доходами и расходами.">
          <select id="tx-to" className={inputClass} aria-describedby="tx-to-msg" {...register('toAccountId')}>
            <option value="">Выберите счёт</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.currency})
              </option>
            ))}
          </select>
        </Field>
      ) : (
        <Field label="Категория" htmlFor="tx-category" error={errors.categoryId?.message}>
          <select
            id="tx-category"
            className={inputClass}
            aria-invalid={Boolean(errors.categoryId)}
            aria-describedby={describe('categoryId')}
            {...register('categoryId')}
          >
            <option value="">Выберите категорию</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field label="Описание (необязательно)" htmlFor="tx-desc" error={errors.description?.message}>
        <input
          id="tx-desc"
          type="text"
          maxLength={120}
          placeholder="Например, продукты на неделю"
          className={inputClass}
          aria-describedby={describe('description')}
          {...register('description')}
        />
      </Field>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onDone}>
          Отмена
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {transaction ? 'Сохранить' : 'Добавить'}
        </Button>
      </div>
    </form>
  )
}

interface ModalProps {
  open: boolean
  onClose: () => void
  transaction?: Transaction
  defaultType?: TxType
}

export function TransactionFormModal({ open, onClose, transaction, defaultType = 'expense' }: ModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={transaction ? 'Редактировать операцию' : 'Новая операция'}>
      <TransactionForm transaction={transaction} defaultType={defaultType} onDone={onClose} />
    </Modal>
  )
}
