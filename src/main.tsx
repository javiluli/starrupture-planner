import App from '@/App'
import { HeroUIProvider } from '@heroui/react'
import { Analytics } from '@vercel/analytics/react'
import '@xyflow/react/dist/style.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
      <Analytics />
      <div className="dark text-foreground bg-background">
        <App />
      </div>
    </HeroUIProvider>
  </StrictMode>,
)
