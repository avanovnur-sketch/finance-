import type { ReactNode } from 'react'
import { labelClass } from './styles'

interface Props {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: ReactNode
}

/** Подпись + поле + сообщение об ошибке. Поле должно иметь id = htmlFor и aria-describedby = `${htmlFor}-msg`. */
export function Field({ label, htmlFor, error, hint, children }: Props) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {(error || hint) && (
        <p id={`${htmlFor}-msg`} className={error ? 'mt-1.5 text-sm text-expense' : 'mt-1.5 text-sm text-muted'}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
}
