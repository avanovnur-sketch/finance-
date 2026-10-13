import { z } from 'zod'

// Те же правила, что и на сервере (там схема проверяется повторно — клиенту доверять нельзя).
export const transactionSchema = z
  .object({
    type: z.enum(['income', 'expense', 'transfer']),
    amount: z
      .number({ invalid_type_error: 'Введите сумму', required_error: 'Введите сумму' })
      .positive('Сумма должна быть больше нуля'),
    date: z.string().min(1, 'Укажите дату'),
    accountId: z.string().min(1, 'Выберите счёт'),
    categoryId: z.string(),
    toAccountId: z.string(),
    description: z.string().max(120, 'Не более 120 символов'),
  })
  .superRefine((v, ctx) => {
    if (v.type === 'transfer') {
      if (!v.toAccountId) {
        ctx.addIssue({ code: 'custom', path: ['toAccountId'], message: 'Выберите счёт назначения' })
      } else if (v.toAccountId === v.accountId) {
        ctx.addIssue({ code: 'custom', path: ['toAccountId'], message: 'Счета должны различаться' })
      }
    } else if (!v.categoryId) {
      ctx.addIssue({ code: 'custom', path: ['categoryId'], message: 'Выберите категорию' })
    }
  })

export type TransactionFormValues = z.infer<typeof transactionSchema>
