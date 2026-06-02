// 큐레이션 팔레트. 모두 정적 데이터 — 외부 호출 없음.

export type PaletteCategory = 'pantone' | 'dev-theme' | 'design-system' | 'korean'

export interface Palette {
  id: string
  name: string
  category: PaletteCategory
  /** 출처·라이선스 표기 */
  source?: string
  /** 짧은 부연 설명 */
  note?: string
  colors: string[]
}

export const CATEGORY_LABELS: Record<PaletteCategory, string> = {
  pantone: 'Pantone 올해의 색',
  'dev-theme': '개발 테마',
  'design-system': '디자인 시스템',
  korean: '한국 전통',
}

export const CATEGORY_ORDER: PaletteCategory[] = [
  'pantone',
  'dev-theme',
  'design-system',
  'korean',
]

export const palettes: Palette[] = [
  // ─── Pantone Color of the Year ─────────────────────────────────────────
  {
    id: 'pantone-2025-mocha-mousse',
    name: 'Mocha Mousse (2025)',
    category: 'pantone',
    source: 'Pantone',
    note: '따뜻한 갈색 베이스 + 자연 톤 보조',
    colors: ['#A47864', '#F5EAE0', '#D4A28E', '#5C3E2E', '#9DA98B'],
  },
  {
    id: 'pantone-2024-peach-fuzz',
    name: 'Peach Fuzz (2024)',
    category: 'pantone',
    source: 'Pantone',
    note: '부드러운 복숭아 + 따뜻한 살구 보조',
    colors: ['#FFBE98', '#FFD4A8', '#FF8E72', '#C97D5D', '#5C2E1F'],
  },
  {
    id: 'pantone-2023-viva-magenta',
    name: 'Viva Magenta (2023)',
    category: 'pantone',
    source: 'Pantone',
    note: '강렬한 마젠타 + 자홍 계열',
    colors: ['#BB2649', '#E36A8A', '#7A1A30', '#F4D8DE', '#2B0A14'],
  },
  {
    id: 'pantone-2022-very-peri',
    name: 'Very Peri (2022)',
    category: 'pantone',
    source: 'Pantone',
    note: '바이올렛 블루 + 그라데이션',
    colors: ['#6667AB', '#9494C5', '#3D3E7E', '#D5D5E8', '#1F2050'],
  },
  {
    id: 'pantone-2020-classic-blue',
    name: 'Classic Blue (2020)',
    category: 'pantone',
    source: 'Pantone',
    note: '깊은 클래식 블루 + 보조',
    colors: ['#0F4C81', '#4A7AAA', '#0A2D4E', '#CCD7E4', '#01172F'],
  },

  // ─── 개발 테마 ─────────────────────────────────────────────────────────
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    category: 'dev-theme',
    source: 'Catppuccin',
    note: '어두운 보라/파스텔 액센트',
    colors: [
      '#1E1E2E',
      '#CDD6F4',
      '#F38BA8',
      '#A6E3A1',
      '#FAB387',
      '#89B4FA',
      '#CBA6F7',
    ],
  },
  {
    id: 'catppuccin-latte',
    name: 'Catppuccin Latte',
    category: 'dev-theme',
    source: 'Catppuccin',
    note: '밝은 라이트 모드 — 부드러운 파스텔',
    colors: [
      '#EFF1F5',
      '#4C4F69',
      '#D20F39',
      '#40A02B',
      '#FE640B',
      '#1E66F5',
      '#8839EF',
    ],
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    category: 'dev-theme',
    source: 'enkia',
    note: '도쿄의 밤 — 차분한 다크 블루',
    colors: [
      '#1A1B26',
      '#A9B1D6',
      '#F7768E',
      '#9ECE6A',
      '#E0AF68',
      '#7AA2F7',
      '#BB9AF7',
    ],
  },
  {
    id: 'nord',
    name: 'Nord',
    category: 'dev-theme',
    source: 'Arctic Ice Studio',
    note: '북극 차가운 블루 그레이',
    colors: [
      '#2E3440',
      '#D8DEE9',
      '#BF616A',
      '#A3BE8C',
      '#EBCB8B',
      '#5E81AC',
      '#B48EAD',
    ],
  },
  {
    id: 'dracula',
    name: 'Dracula',
    category: 'dev-theme',
    source: 'Dracula Theme',
    note: '어둠 + 형광 액센트',
    colors: [
      '#282A36',
      '#F8F8F2',
      '#FF5555',
      '#50FA7B',
      '#F1FA8C',
      '#BD93F9',
      '#FF79C6',
    ],
  },
  {
    id: 'gruvbox-dark',
    name: 'Gruvbox Dark',
    category: 'dev-theme',
    source: 'morhetz',
    note: '레트로 따뜻한 다크',
    colors: [
      '#282828',
      '#EBDBB2',
      '#CC241D',
      '#98971A',
      '#D79921',
      '#458588',
      '#B16286',
    ],
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    category: 'dev-theme',
    source: 'Ethan Schoonover',
    note: '청록 톤 다크',
    colors: [
      '#002B36',
      '#93A1A1',
      '#DC322F',
      '#859900',
      '#B58900',
      '#268BD2',
      '#D33682',
    ],
  },
  {
    id: 'one-dark',
    name: 'One Dark',
    category: 'dev-theme',
    source: 'Atom',
    note: 'Atom 에디터 기본 테마',
    colors: [
      '#282C34',
      '#ABB2BF',
      '#E06C75',
      '#98C379',
      '#E5C07B',
      '#61AFEF',
      '#C678DD',
    ],
  },
  {
    id: 'monokai',
    name: 'Monokai',
    category: 'dev-theme',
    source: 'Wimer Hazenberg',
    note: '비비드한 형광 액센트',
    colors: [
      '#272822',
      '#F8F8F2',
      '#F92672',
      '#A6E22E',
      '#E6DB74',
      '#66D9EF',
      '#AE81FF',
    ],
  },

  // ─── 디자인 시스템 ─────────────────────────────────────────────────────
  {
    id: 'tailwind-violet',
    name: 'Tailwind Violet',
    category: 'design-system',
    source: 'Tailwind CSS',
    note: '50 → 950 (대표 6단계)',
    colors: ['#F5F3FF', '#DDD6FE', '#A78BFA', '#7C3AED', '#5B21B6', '#2E1065'],
  },
  {
    id: 'tailwind-slate',
    name: 'Tailwind Slate',
    category: 'design-system',
    source: 'Tailwind CSS',
    note: '중성 슬레이트 그레이',
    colors: ['#F8FAFC', '#E2E8F0', '#94A3B8', '#475569', '#1E293B', '#020617'],
  },
  {
    id: 'tailwind-emerald',
    name: 'Tailwind Emerald',
    category: 'design-system',
    source: 'Tailwind CSS',
    note: '에메랄드 그린',
    colors: ['#ECFDF5', '#A7F3D0', '#34D399', '#10B981', '#047857', '#022C22'],
  },
  {
    id: 'tailwind-amber',
    name: 'Tailwind Amber',
    category: 'design-system',
    source: 'Tailwind CSS',
    note: '따뜻한 앰버',
    colors: ['#FFFBEB', '#FDE68A', '#FBBF24', '#D97706', '#92400E', '#451A03'],
  },
  {
    id: 'radix-plum',
    name: 'Radix Plum',
    category: 'design-system',
    source: 'Radix Colors',
    note: '풍부한 자두색',
    colors: ['#FEFCFE', '#F4D4F2', '#D08DE1', '#AB4ABA', '#82268C', '#3B0A40'],
  },
  {
    id: 'material-indigo',
    name: 'Material Indigo',
    category: 'design-system',
    source: 'Material Design',
    note: '머티리얼 인디고 100~900',
    colors: ['#E8EAF6', '#9FA8DA', '#5C6BC0', '#3F51B5', '#283593', '#1A237E'],
  },

  // ─── 한국 전통 ─────────────────────────────────────────────────────────
  {
    id: 'obangsaek',
    name: '오방색 (五方色)',
    category: 'korean',
    source: '한국 전통',
    note: '동·서·남·북·중앙 — 청·백·적·흑·황',
    colors: ['#0F2C5C', '#FAFAFA', '#C2272E', '#1A1A1A', '#F8B500'],
  },
  {
    id: 'dancheong',
    name: '단청 (丹靑)',
    category: 'korean',
    source: '한국 전통',
    note: '사찰·궁궐 채색 — 화려한 다색',
    colors: ['#1B5E8C', '#28A745', '#FFD700', '#E63946', '#FAFAFA'],
  },
  {
    id: 'hanbok',
    name: '한복 (韓服)',
    category: 'korean',
    source: '한국 전통',
    note: '전통 의복의 대비 미학',
    colors: ['#C2272E', '#1E5BAB', '#FAFAFA', '#FFD700', '#0A0A0A'],
  },
  {
    id: 'sumukhwa',
    name: '수묵화 (水墨畵)',
    category: 'korean',
    source: '한국 전통',
    note: '먹의 농담 — 5단계 그라데이션',
    colors: ['#F5F0E5', '#A8A4A0', '#5A5450', '#2D2A28', '#0A0908'],
  },
  {
    id: 'jagae',
    name: '자개 (螺鈿)',
    category: 'korean',
    source: '한국 전통',
    note: '자개공예 — 진주빛 반사',
    colors: ['#F8F4E3', '#C9B458', '#7C6D43', '#A8324C', '#1F2933'],
  },
]
