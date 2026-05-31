import { useFavorites } from '@/lib/useFavorites'
import { StarFilledIcon, StarIcon } from './icons'

interface FavoriteButtonProps {
  toolId: string
  /** Link 안에 들어갈 때 부모 클릭/내비게이션을 막는다 (Home 카드 안). 기본 true. */
  stopPropagation?: boolean
  className?: string
}

export function FavoriteButton({
  toolId,
  stopPropagation = true,
  className = '',
}: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(toolId)
  return (
    <button
      type="button"
      onClick={(e) => {
        if (stopPropagation) {
          e.preventDefault()
          e.stopPropagation()
        }
        toggle(toolId)
      }}
      aria-label={fav ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      aria-pressed={fav}
      title={fav ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
        fav
          ? 'text-amber-500'
          : 'text-zinc-400 hover:text-amber-500 dark:text-zinc-500 dark:hover:text-amber-400'
      } ${className}`}
    >
      {fav ? <StarFilledIcon className="h-4 w-4" /> : <StarIcon className="h-4 w-4" />}
    </button>
  )
}
