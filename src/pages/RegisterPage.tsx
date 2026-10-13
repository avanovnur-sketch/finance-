import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { registerSchema, type RegisterValues } from '../schemas/auth'
import { AuthLayout } from '../components/layout/AuthLayout'
import { PasswordInput } from '../components/forms/PasswordInput'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { inputClass } from '../components/ui/styles'

export default function RegisterPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirm: '' },
  })

  // Этап 3: POST /api/auth/register; 409 — «Эта почта уже зарегистрирована».
  const onSubmit = () => navigate('/dashboard')

  return (
    <AuthLayout title="Создать аккаунт" subtitle="Это займёт меньше минуты">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="Имя" htmlFor="r-name" error={errors.name?.message}>
          <input
            id="r-name"
            autoComplete="name"
            className={inputClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'r-name-msg' : undefined}
            {...register('name')}
          />
        </Field>
        <Field label="Электронная почта" htmlFor="r-email" error={errors.email?.message}>
          <input
            id="r-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'r-email-msg' : undefined}
            {...register('email')}
          />
        </Field>
        <Field
          label="Пароль"
          htmlFor="r-pass"
          error={errors.password?.message}
          hint="Не короче 8 символов, с заглавной и строчной буквой и цифрой."
        >
          <PasswordInput
            id="r-pass"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby="r-pass-msg"
            {...register('password')}
          />
        </Field>
        <Field label="Повторите пароль" htmlFor="r-confirm" error={errors.confirm?.message}>
          <PasswordInput
            id="r-confirm"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirm)}
            aria-describedby={errors.confirm ? 'r-confirm-msg' : undefined}
            {...register('confirm')}
          />
        </Field>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Зарегистрироваться
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="font-medium text-accent-text hover:underline">
          Войти
        </Link>
      </p>
    </AuthLayout>
  )
}
