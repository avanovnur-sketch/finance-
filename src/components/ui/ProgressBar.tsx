interface Props {
  value: number
  label: string
  color?: string
}

export function ProgressBar({ value, label, color = 'var(--ff-accent)' }: Props) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className="h-2.5 w-full overflow-hidden rounded-full bg-bg"
    >
      <div className="h-full rounded-full transition-[width]" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}
