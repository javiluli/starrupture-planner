import App from '@/App'
import { HeroUIProvider } from '@heroui/react'
import '@xyflow/react/dist/style.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
      <div className="dark text-foreground bg-background">
        <App />
      </div>
    </HeroUIProvider>
  </StrictMode>,
)
