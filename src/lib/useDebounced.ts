import { useEffect, useState } from 'react'

/** value 가 delay(ms) 동안 변하지 않으면 그 값을 반영해 반환한다. */
export function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}
