import { Wallet } from 'lucide-react'

export function LogoMark() {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-strong text-white">
      <Wallet className="size-5" aria-hidden />
    </span>
  )
}
