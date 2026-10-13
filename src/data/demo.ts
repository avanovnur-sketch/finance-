// ДЕМО-ДАННЫЕ. Генерируются в браузере, не связаны ни с каким реальным аккаунтом.
// В готовой версии заменяются ответами API (см. client/src/services).
import type { Account, Budget, Category, Transaction } from '../types'
import { addDays, today } from '../utils/date'

export const demoCategories: Category[] = [
  { id: 'food', name: 'Еда', type: 'expense', color: '#f59e0b' },
  { id: 'transport', name: 'Транспорт', type: 'expense', color: '#3b82f6' },
  { id: 'housing', name: 'Жильё', type: 'expense', color: '#8b5cf6' },
  { id: 'comm', name: 'Связь и интернет', type: 'expense', color: '#06b6d4' },
  { id: 'shop', name: 'Покупки', type: 'expense', color: '#ec4899' },
  { id: 'fun', name: 'Развлечения', type: 'expense', color: '#f43f5e' },
  { id: 'health', name: 'Здоровье', type: 'expense', color: '#14b8a6' },
  { id: 'salary', name: 'Зарплата', type: 'income', color: '#10b981' },
  { id: 'freelance', name: 'Фриланс', type: 'income', color: '#22c55e' },
  { id: 'bonus', name: 'Бонус', type: 'income', color: '#84cc16' },
]

export const demoAccounts: Account[] = [
  { id: 'cash', name: 'Наличные', currency: 'KGS', initialBalance: 5000, icon: 'cash' },
  { id: 'card', name: 'Банковская карта', currency: 'KGS', initialBalance: 20000, icon: 'card' },
  { id: 'savings', name: 'Сберегательный счёт', currency: 'KGS', initialBalance: 60000, icon: 'savings' },
]

export const demoBudgets: Budget[] = [
  { id: 'b-total', categoryId: null, limit: 40000 },
  { id: 'b-food', categoryId: 'food', limit: 12000 },
  { id: 'b-transport', categoryId: 'transport', limit: 3000 },
  { id: 'b-shop', categoryId: 'shop', limit: 6000 },
  { id: 'b-fun', categoryId: 'fun', limit: 4000 },
]

function mulberry32(seed: number) {
  let s = seed
  return () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const foodNames = ['Продукты', 'Супермаркет', 'Кафе', 'Обед в столовой', 'Доставка еды', 'Рынок']
const transportNames = ['Такси', 'Маршрутка', 'Бензин', 'Проезд']
const shopNames = ['Одежда', 'Бытовая техника', 'Товары для дома', 'Подарок']
const funNames = ['Кино', 'Ресторан', 'Подписка на сервис', 'Концерт']
const healthNames = ['Аптека', 'Приём врача', 'Анализы']

export function buildDemoTransactions(): Transaction[] {
  const rng = mulberry32(2026)
  const pick = <T>(a: T[]): T => a[Math.floor(rng() * a.length)]
  const between = (a: number, b: number, step: number) => Math.round((a + rng() * (b - a)) / step) * step
  const t0 = today()
  const txs: Transaction[] = []
  let n = 0

  const add = (
    date: string,
    type: Transaction['type'],
    amount: number,
    accountId: string,
    categoryId: string | undefined,
    description: string,
    toAccountId?: string,
  ) => {
    txs.push({ id: `demo-${++n}`, date, type, amount, accountId, categoryId, description, toAccountId })
  }

  for (let i = 0; i < 120; i++) {
    const date = addDays(t0, -i)
    const dom = Number(date.slice(8, 10))

    if (dom === 1) add(date, 'expense', 12000, 'card', 'housing', 'Аренда квартиры')
    if (dom === 3) add(date, 'expense', 1200, 'card', 'comm', 'Интернет и мобильная связь')
    if (dom === 5) add(date, 'income', 45000, 'card', 'salary', 'Зарплата')
    if (dom === 6) add(date, 'transfer', 8000, 'card', undefined, 'Пополнение накоплений', 'savings')
    if (dom === 7) add(date, 'transfer', 5000, 'card', undefined, 'Снятие наличных', 'cash')
    if (dom === 20) add(date, 'income', between(6000, 12000, 500), 'card', 'freelance', 'Фриланс-проект')

    if (rng() < 0.7) add(date, 'expense', between(150, 900, 10), rng() < 0.3 ? 'cash' : 'card', 'food', pick(foodNames))
    if (rng() < 0.35) add(date, 'expense', between(50, 400, 10), rng() < 0.3 ? 'cash' : 'card', 'transport', pick(transportNames))
    if (rng() < 0.08) add(date, 'expense', between(800, 6000, 50), 'card', 'shop', pick(shopNames))
    if (rng() < 0.1) add(date, 'expense', between(300, 2500, 50), 'card', 'fun', pick(funNames))
    if (rng() < 0.05) add(date, 'expense', between(500, 3000, 50), 'card', 'health', pick(healthNames))
  }

  add(addDays(t0, -40), 'income', 15000, 'card', 'bonus', 'Квартальная премия')

  return txs.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
}
