import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export function LoadingState({ fullScreen = false, label = 'Загрузка…' }: { fullScreen?: boolean; label?: string }) {
  return (
    <div
      role="status"
      className={cn('flex items-center justify-center gap-3 text-muted', fullScreen ? 'min-h-screen' : 'py-16')}
    >
      <Loader2 className="size-5 animate-spin" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  )
}
