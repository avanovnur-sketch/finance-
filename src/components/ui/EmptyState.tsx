import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface Props {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-bg text-muted">
        <Inbox className="size-6" aria-hidden />
      </div>
      <p className="font-semibold">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  )
}
