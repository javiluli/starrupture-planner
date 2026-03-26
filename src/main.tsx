import App from '@/App'
import type { Language } from '@/shared/@types/i18n'
import i18n from '@/shared/i18n/i18n'
import { useDataStore } from '@/store/data.store'
import { HeroUIProvider } from '@heroui/react'
import { Analytics } from '@vercel/analytics/react'
import '@xyflow/react/dist/style.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const syncDataLanguage = () => {
  const setLanguage = useDataStore.getState().setLanguage
  setLanguage(i18n.language as Language)
  i18n.on('languageChanged', (lang) => {
    setLanguage(lang as Language)
  })
}

syncDataLanguage()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
      <Analytics />
      <main className="dark text-foreground bg-background">
        <App />
      </main>
    </HeroUIProvider>
  </StrictMode>,
)
