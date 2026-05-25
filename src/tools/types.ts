import type { ComponentType, LazyExoticComponent } from 'react'

export interface ToolMeta {
  /** 고유 식별자 (영문 소문자) */
  id: string
  /** 라우트 경로. 예: '/json' */
  path: string
  /** 표시 이름 (한국어) */
  name: string
  /** 한 줄 설명 (홈 카드에 표시) */
  description: string
  /** 카드·헤더 아이콘 컴포넌트 */
  icon: ComponentType<{ className?: string }>
  /** 검색/필터용 키워드 (선택) */
  keywords?: string[]
  /** 페이지 컴포넌트. 코드 스플리팅을 위해 React.lazy 사용을 권장 */
  component: LazyExoticComponent<ComponentType> | ComponentType
}
