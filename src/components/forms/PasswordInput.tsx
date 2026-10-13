import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { inputClass } from '../ui/styles'

/** Поле пароля с кнопкой «показать». Совместимо с register() из react-hook-form. */
export const PasswordInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function PasswordInput(
  props,
  ref,
) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <input ref={ref} {...props} type={visible ? 'text' : 'password'} className={`${inputClass} pr-12`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
        aria-pressed={visible}
        className="absolute right-0 top-0 flex size-11 items-center justify-center rounded-xl text-muted hover:text-fg"
      >
        {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  )
})
