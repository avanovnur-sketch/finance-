import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { forgotSchema, type ForgotValues } from '../schemas/auth'
import { AuthLayout } from '../components/layout/AuthLayout'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { inputClass } from '../components/ui/styles'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema), defaultValues: { email: '' } })

  // Этап 3: POST /api/auth/forgot-password. Ответ всегда одинаковый, чтобы нельзя было узнать, есть ли такая почта.
  const onSubmit = () => setSent(true)

  return (
    <AuthLayout title="Восстановление пароля" subtitle="Отправим ссылку для сброса на вашу почту">
      {sent ? (
        <div role="status" className="space-y-4 text-sm">
          <p>Если аккаунт с такой почтой существует, мы отправили на неё письмо со ссылкой для сброса пароля.</p>
          <Link to="/login" className="inline-flex min-h-11 items-center font-medium text-accent-text hover:underline">
            Вернуться ко входу
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Field label="Электронная почта" htmlFor="f-email" error={errors.email?.message}>
            <input
              id="f-email"
              type="email"
              autoComplete="email"
              className={inputClass}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'f-email-msg' : undefined}
              {...register('email')}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Отправить ссылку
          </Button>
          <p className="text-center text-sm text-muted">
            <Link to="/login" className="font-medium text-accent-text hover:underline">
              Вернуться ко входу
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  )
}
