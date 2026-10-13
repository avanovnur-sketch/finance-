import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'

type ToastKind = 'success' | 'error'

interface ToastItem {
  id: number
  kind: ToastKind
  message: string
}

interface ToastCtx {
  toast: (message: string, kind?: ToastKind) => void
}

const Ctx = createContext<ToastCtx | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => setItems((p) => p.filter((t) => t.id !== id)), [])

  const toast = useCallback(
    (message: string, kind: ToastKind = 'success') => {
      const id = nextId.current++
      setItems((p) => [...p, { id, kind, message }])
      window.setTimeout(() => dismiss(id), 4000)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6 md:items-end md:px-6"
        role="status"
        aria-live="polite"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-border bg-card p-3 text-sm shadow-xl"
          >
            {t.kind === 'success' ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-income" aria-hidden />
            ) : (
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-expense" aria-hidden />
            )}
            <p className="min-w-0 flex-1">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Закрыть уведомление"
              className="-m-2 flex size-10 items-center justify-center rounded-lg text-muted hover:text-fg"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useToast(): ToastCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useToast должен использоваться внутри ToastProvider')
  return v
}
