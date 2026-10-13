import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { IconButton } from './Button'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** Диалог: на телефоне — выезжает снизу, на больших экранах — по центру. */
export function Modal({ open, onClose, title, children }: Props) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const previous = document.activeElement as HTMLElement | null
    panel?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeRef.current()
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const els = panel.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (els.length === 0) return
      const first = els[0]
      const last = els[els.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previous?.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-border bg-card p-5 shadow-2xl outline-none sm:max-w-lg sm:rounded-2xl sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <IconButton aria-label="Закрыть" onClick={onClose} className="-mr-2">
            <X className="size-5" aria-hidden />
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  )
}
