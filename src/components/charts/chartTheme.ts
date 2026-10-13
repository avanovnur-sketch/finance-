import type { CSSProperties } from 'react'

export const COLORS = {
  accent: '#8b5cf6',
  income: '#10b981',
  expense: '#f43f5e',
  axis: '#94a3b8',
  grid: 'rgba(148, 163, 184, 0.2)',
}

export const tooltipStyle: CSSProperties = {
  backgroundColor: 'var(--ff-card)',
  border: '1px solid var(--ff-border)',
  borderRadius: 12,
  color: 'var(--ff-fg)',
  fontSize: 13,
}

export const axisTick = { fill: COLORS.axis, fontSize: 12 }
