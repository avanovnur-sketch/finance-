// Заготовка клиента API для этапа 3. Сессия — HttpOnly-cookie, поэтому credentials: 'include'.
// userId клиент никогда не передаёт: владельца сервер определяет по сессии.

const BASE = import.meta.env.VITE_API_URL ?? '/api'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  })
  if (!res.ok) {
    let message = 'Не удалось выполнить запрос. Попробуйте ещё раз.'
    try {
      const body = await res.json()
      if (body?.error?.message) message = body.error.message
    } catch {
      /* тело ответа не JSON */
    }
    throw new ApiError(res.status, message)
  }
  return (res.status === 204 ? undefined : await res.json()) as T
}
