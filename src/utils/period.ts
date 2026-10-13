import { addDays, diffDays, parseISODate, toISODate, today } from './date'

export type PeriodPreset = 'day' | 'week' | 'month' | 'year' | 'custom'

export interface PeriodState {
  preset: PeriodPreset
  from: string
  to: string
}

export interface DateRange {
  from: string
  to: string
}

export const PERIOD_LABELS: Record<PeriodPreset, string> = {
  day: 'Сегодня',
  week: 'Неделя',
  month: 'Месяц',
  year: 'Год',
  custom: 'Свой диапазон',
}

/**
 * Превращает выбор периода в диапазон дат.
 * open=true — для фильтров: пустая граница своего диапазона означает «без ограничения».
 * open=false — для аналитики: пустые границы заменяются на последние 30 дней.
 */
export function resolveRange(p: PeriodState, open = false): DateRange {
  const t = today()
  switch (p.preset) {
    case 'day':
      return { from: t, to: t }
    case 'week':
      return { from: addDays(t, -6), to: t }
    case 'month':
      return { from: `${t.slice(0, 8)}01`, to: t }
    case 'year':
      return { from: `${t.slice(0, 4)}-01-01`, to: t }
    case 'custom': {
      let from = p.from
      let to = p.to
      if (open) {
        from = from || '0000-01-01'
        to = to || '9999-12-31'
      } else {
        to = to || t
        from = from || addDays(to, -29)
      }
      return from <= to ? { from, to } : { from: to, to: from }
    }
  }
}

function shiftMonths(s: string, delta: number): string {
  const d = parseISODate(s)
  const day = d.getDate()
  d.setDate(1)
  d.setMonth(d.getMonth() + delta)
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  d.setDate(Math.min(day, last))
  return toISODate(d)
}

/** Предыдущий период для сравнения: месяц к месяцу, год к году, иначе — тот же срок сразу перед текущим. */
export function previousRange(r: DateRange, preset: PeriodPreset): DateRange {
  if (preset === 'month') return { from: shiftMonths(r.from, -1), to: shiftMonths(r.to, -1) }
  if (preset === 'year') return { from: shiftMonths(r.from, -12), to: shiftMonths(r.to, -12) }
  const len = diffDays(r.from, r.to) + 1
  return { from: addDays(r.from, -len), to: addDays(r.from, -1) }
}

export function defaultPeriod(preset: PeriodPreset = 'month'): PeriodState {
  const t = today()
  return { preset, from: addDays(t, -29), to: t }
}
