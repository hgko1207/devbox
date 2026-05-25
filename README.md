# devbox

브라우저에서만 동작하는 개발자용 웹 도구 모음. 한 사이트 안에 여러 작은 도구가 모여 있고, 도구를 하나씩 추가해 나가는 구조입니다.

## 원칙

- **100% 로컬 처리** — 입력한 데이터(텍스트·이미지 등)는 절대 서버로 전송되지 않습니다.
- **백엔드 없음** — 정적 사이트로 빌드되어 GitHub Pages 등에 무료로 배포됩니다.
- **추적·광고·회원가입 없음**, 외부 요청 없음(시스템 폰트 사용).
- 한국어 UI, 다크모드 지원, 모바일 대응.

## 기술 스택

React 18 · TypeScript · Vite · Tailwind CSS · React Router

## 개발

```bash
npm install
npm run dev        # 개발 서버
npm run build      # 타입체크 + 프로덕션 빌드 (dist/)
npm run preview    # 빌드 결과 미리보기
npm run typecheck  # 타입체크만
```

## 배포 (GitHub Pages)

1. 이 저장소를 GitHub 에 올립니다.
2. 저장소 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 설정합니다.
3. `main` 브랜치에 푸시하면 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 이 자동으로 빌드·배포합니다.

배포 경로는 워크플로가 저장소 이름에 맞춰 자동 설정합니다(`/<repo>/`). 사용자/조직
페이지(`username.github.io`)나 커스텀 도메인을 쓸 경우, 워크플로의 `VITE_BASE` 를 `/` 로 바꾸세요.
딥링크(예: `/json` 새로고침) 대응을 위해 빌드 시 `index.html` 을 `404.html` 로 복사합니다.

## 새 도구 추가하기

도구를 한 곳에 등록하면 홈 목록과 라우팅에 자동 반영됩니다.

1. `src/tools/<도구>/` 폴더를 만듭니다.
2. 페이지 컴포넌트를 작성합니다. 예: `src/tools/<도구>/MyToolPage.tsx` (`export default`).
3. `src/tools/<도구>/meta.ts` 에서 `ToolMeta` 를 export 합니다.

   ```ts
   import { lazy } from 'react'
   import type { ToolMeta } from '../types'
   import { SomeIcon } from '@/components/icons'

   export const myTool: ToolMeta = {
     id: 'color',
     path: '/color',
     name: '색상 도구',
     description: '색상 변환 및 팔레트',
     icon: SomeIcon,
     component: lazy(() => import('./MyToolPage')),
   }
   ```

4. [`src/tools/registry.ts`](src/tools/registry.ts) 의 `tools` 배열에 한 줄 추가합니다.

   ```ts
   import { myTool } from './color/meta'
   export const tools: ToolMeta[] = [jsonTool, myTool]
   ```

홈 카드와 `/color` 라우트가 자동으로 생성됩니다.

## 디렉터리 구조

```
src/
  components/      공통 UI (Header, Layout, ThemeToggle, icons)
  lib/             theme(다크모드), useDebounced 등 공용 로직
  pages/           Home, NotFound
  tools/
    types.ts       ToolMeta 타입
    registry.ts    도구 등록소 (여기에 한 줄 추가)
    json/
      meta.ts          도구 메타 + lazy 페이지
      JsonToolPage.tsx 페이지 (포맷/검사 · 비교 모드)
      components/      Editor, StatusBar, TreeView, DiffView
      lib/             parser(위치추적), diff, workerClient
      worker/          json.worker.ts (포맷·압축·검증·비교를 백그라운드 처리)
```

## JSON 도구 (`/json`)

- **포맷팅 / 압축** — 들여쓰기(2·4·탭) 정렬, 공백 제거 압축.
- **유효성 검사** — 잘못된 JSON 이면 **줄·열·이유**(한국어)를 표시하고 해당 위치로 이동.
- **트리 뷰** — 객체/배열을 접었다 펼 수 있으며, 큰 컬렉션은 "더 보기"로 점진 렌더.
- **비교(Diff)** — 두 JSON 의 추가/삭제/변경을 경로별로 표시.
- **성능** — 포맷·압축·검증·비교를 Web Worker 에서 처리해 수 MB 입력에서도 UI 가 멈추지 않습니다.
