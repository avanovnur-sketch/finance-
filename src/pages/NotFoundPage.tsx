import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl font-bold text-accent-text">404</p>
      <h1 className="text-xl font-semibold">Страница не найдена</h1>
      <p className="max-w-sm text-sm text-muted">Возможно, ссылка устарела или адрес введён с ошибкой.</p>
      <Link
        to="/dashboard"
        className="inline-flex min-h-11 items-center rounded-xl bg-accent-strong px-5 text-sm font-semibold text-white hover:brightness-110"
      >
        На главную
      </Link>
    </main>
  )
}
