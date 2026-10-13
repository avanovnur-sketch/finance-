const nf = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
const nf1 = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 })
const compact = new Intl.NumberFormat('ru-RU', { notation: 'compact', maximumFractionDigits: 1 })

/** 125 400 сом (отрицательные — со знаком «−») */
export function formatMoney(n: number): string {
  return `${n < 0 ? '−' : ''}${nf.format(Math.abs(n))} сом`
}

/** Всегда со знаком: +45 000 сом / −28 500 сом */
export function formatSignedMoney(n: number): string {
  if (n === 0) return formatMoney(0)
  return `${n > 0 ? '+' : '−'}${nf.format(Math.abs(n))} сом`
}

export function formatCompact(n: number): string {
  return compact.format(n)
}

/** +12,5% / −3,1% */
export function formatPercent(n: number): string {
  if (n === 0) return '0%'
  return `${n > 0 ? '+' : '−'}${nf1.format(Math.abs(n))}%`
}

export function formatPlainPercent(n: number): string {
  return `${nf.format(Math.round(n))}%`
}
