import { HeroUIProvider } from '@heroui/react'
import '@xyflow/react/dist/style.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './i18n'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </StrictMode>,
)
