import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ThemeProvider } from './lib/theme'
import './index.css'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('#root 요소를 찾을 수 없습니다.')

createRoot(rootEl).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
