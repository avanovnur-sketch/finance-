// Все даты — локальные строки YYYY-MM-DD, их можно сравнивать как строки.

export const pad = (n: number) => String(n).padStart(2, '0')

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function parseISODate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function today(): string {
  return toISODate(new Date())
}

export function addDays(s: string, n: number): string {
  const d = parseISODate(s)
  d.setDate(d.getDate() + n)
  return toISODate(d)
}

/** Количество дней от a до b (b - a). */
export function diffDays(a: string, b: string): number {
  return Math.round((parseISODate(b).getTime() - parseISODate(a).getTime()) / 86_400_000)
}

export function formatDate(s: string): string {
  return parseISODate(s).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatShort(s: string): string {
  return `${s.slice(8, 10)}.${s.slice(5, 7)}`
}

export function formatMonthShort(s: string): string {
  return parseISODate(`${s.slice(0, 7)}-01`).toLocaleDateString('ru-RU', { month: 'short' })
}
