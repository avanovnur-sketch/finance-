import { Outlet } from 'react-router-dom'
import { FlaskConical } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNavigation } from './MobileNavigation'

export function AppLayout() {
  return (
    <div className="min-h-screen md:flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-lg focus:bg-accent-strong focus:px-4 focus:py-2 focus:text-white"
      >
        Перейти к содержимому
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <div className="flex items-center gap-2 border-b border-border bg-card/40 px-4 py-2 text-xs text-muted md:px-6">
          <FlaskConical className="size-4 shrink-0 text-accent-text" aria-hidden />
          <p>Демо-режим: показаны тестовые данные. Они не связаны с реальными аккаунтами и пропадают при обновлении страницы.</p>
        </div>
        <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-6 md:px-6 md:pb-10">
          <Outlet />
        </main>
      </div>
      <MobileNavigation />
    </div>
  )
}
