import { Outlet } from 'react-router-dom'

/**
 * Защита закрытых страниц. Сейчас (демо, этап 2) доступ открыт.
 * Этап 3: запрашивать GET /api/auth/me и при 401 делать <Navigate to="/login" replace />.
 * Важно: настоящая проверка прав всегда выполняется на сервере, а не только здесь.
 */
export function ProtectedRoute() {
  const isAuthenticated = true
  if (!isAuthenticated) return null
  return <Outlet />
}
