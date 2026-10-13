import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'income' | 'expense'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent-strong text-white hover:brightness-110',
  secondary: 'border border-border bg-card text-fg hover:bg-card-hover',
  ghost: 'text-fg hover:bg-card-hover',
  income: 'bg-emerald-700 text-white hover:bg-emerald-600',
  expense: 'bg-rose-700 text-white hover:bg-rose-600',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', className, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...rest}
    />
  )
}

/** Квадратная кнопка-иконка 44×44 — удобна для касания. aria-label обязателен. */
export function IconButton({
  className,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { 'aria-label': string }) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-muted transition hover:bg-card-hover hover:text-fg',
        className,
      )}
      {...rest}
    />
  )
}
