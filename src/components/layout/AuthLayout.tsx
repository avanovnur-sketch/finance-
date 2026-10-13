import type { ReactNode } from 'react'
import { FlaskConical } from 'lucide-react'
import { LogoMark } from './Logo'

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <LogoMark />
          <span className="text-xl font-bold">FinanceFlow</span>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs text-muted">
          <FlaskConical className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
          Демо: серверной авторизации пока нет, форма только проверяет данные и ведёт в приложение.
        </p>
      </div>
    </main>
  )
}
