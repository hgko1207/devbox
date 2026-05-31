import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const KEY = 'devbox-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(KEY, [])

  const toggle = useCallback(
    (id: string) => {
      setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    },
    [setFavorites],
  )

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites])

  return { favorites, toggle, isFavorite }
}
