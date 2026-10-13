import { useEffect, useState } from 'react'

/** Значение, которое обновляется только после паузы — чтобы не фильтровать/запрашивать на каждый символ. */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debounced
}
