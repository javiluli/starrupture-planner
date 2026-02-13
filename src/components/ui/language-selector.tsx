import { useDataStore } from '@/store/data.store'
import type { Language } from '@/types/i18n'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, type Selection } from '@heroui/react'
import { Languages } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const LanguageSelector = () => {
  const { i18n } = useTranslation()
  const setLanguageStore = useDataStore((state) => state.setLanguage)

  // Inicializamos el estado con el idioma actual de i18n (que debería ser 'en')
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([i18n.language]))

  const handleLanguageChange = (key: React.Key) => {
    const lang = key as Language
    // Cambiamos el idioma de la UI (i18next)
    i18n.changeLanguage(lang)
    // Sincronizamos los datos del Store (JSONs de produccion)
    setLanguageStore(lang)
    // Actualizamos el estado visual del dropdown
    setSelectedKeys(new Set([lang]))
  }

  return (
    <Dropdown className="min-w-28">
      <DropdownTrigger>
        <Button isIconOnly variant="light">
          <Languages size={24} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        selectedKeys={selectedKeys}
        selectionMode="single"
        variant="flat"
        aria-label="Language selection"
        onAction={handleLanguageChange}
      >
        <DropdownItem key="en" textValue="English">
          English
        </DropdownItem>
        <DropdownItem key="es" textValue="Español">
          Español
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
