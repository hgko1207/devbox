import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import RouteError from './pages/RouteError'
import { tools } from './tools/registry'

// import.meta.env.BASE_URL 예: '/' 또는 '/devbox/'. 라우터 basename 은 끝의 슬래시를 제거해 사용한다.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      errorElement: <RouteError />,
      children: [
        { index: true, element: <Home /> },
        // 도구 레지스트리로부터 라우트를 자동 생성한다.
        ...tools.map((tool) => {
          const Component = tool.component
          return {
            path: tool.path.replace(/^\//, ''),
            element: <Component />,
          }
        }),
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename },
)
