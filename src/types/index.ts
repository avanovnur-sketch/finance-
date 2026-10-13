export type TxType = 'income' | 'expense' | 'transfer'

export interface Account {
  id: string
  name: string
  currency: string
  initialBalance: number
  icon: 'cash' | 'card' | 'savings'
}

export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  color: string
}

export interface Transaction {
  id: string
  type: TxType
  /** Всегда > 0. В БД будет DECIMAL; здесь number только для демо. */
  amount: number
  /** Локальная дата YYYY-MM-DD */
  date: string
  accountId: string
  /** Для переводов не задаётся */
  categoryId?: string
  /** Только для переводов: счёт назначения */
  toAccountId?: string
  description: string
}

export type NewTransaction = Omit<Transaction, 'id'>

export interface Budget {
  id: string
  /** null — общий месячный бюджет */
  categoryId: string | null
  limit: number
}
