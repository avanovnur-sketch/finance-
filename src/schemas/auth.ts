import { z } from 'zod'

const email = z.string().min(1, 'Введите электронную почту').email('Некорректный адрес электронной почты')

const password = z
  .string()
  .min(8, 'Не короче 8 символов')
  .regex(/[a-zа-я]/, 'Добавьте строчную букву')
  .regex(/[A-ZА-Я]/, 'Добавьте заглавную букву')
  .regex(/\d/, 'Добавьте цифру')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Введите пароль'),
})

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Введите имя').max(60, 'Не более 60 символов'),
    email,
    password,
    confirm: z.string().min(1, 'Повторите пароль'),
  })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Пароли не совпадают' })

export const forgotSchema = z.object({ email })

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
export type ForgotValues = z.infer<typeof forgotSchema>
