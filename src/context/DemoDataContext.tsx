import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Account, Budget, Category, NewTransaction, Transaction } from '../types'
import { buildDemoTransactions, demoAccounts, demoBudgets, demoCategories } from '../data/demo'

// ДЕМО-РЕЖИМ: данные живут только в памяти вкладки и сбрасываются при перезагрузке.
// На этапах 3–5 этот провайдер заменяется хуками TanStack Query поверх /api.

interface DemoData {
  transactions: Transaction[]
  accounts: Account[]
  categories: Category[]
  budgets: Budget[]
  addTransaction: (t: NewTransaction) => void
  updateTransaction: (id: string, t: NewTransaction) => void
  deleteTransaction: (id: string) => void
}

const Ctx = createContext<DemoData | null>(null)

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `t-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(buildDemoTransactions)

  const addTransaction = useCallback((t: NewTransaction) => {
    setTransactions((prev) => [{ ...t, id: newId() }, ...prev])
  }, [])

  const updateTransaction = useCallback((id: string, t: NewTransaction) => {
    setTransactions((prev) => prev.map((x) => (x.id === id ? { ...t, id } : x)))
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const value = useMemo<DemoData>(
    () => ({
      transactions,
      accounts: demoAccounts,
      categories: demoCategories,
      budgets: demoBudgets,
      addTransaction,
      updateTransaction,
      deleteTransaction,
    }),
    [transactions, addTransaction, updateTransaction, deleteTransaction],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useDemoData(): DemoData {
  const v = useContext(Ctx)
  if (!v) throw new Error('useDemoData должен использоваться внутри DemoDataProvider')
  return v
}
