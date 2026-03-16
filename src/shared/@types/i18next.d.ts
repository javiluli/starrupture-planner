import 'i18next'
import planner from '@/shared/i18n/ui/en/planner-page.json'
import items from '@/shared/i18n/ui/en/items-page.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'planner'
    resources: {
      planner: typeof planner
      items: typeof items
    }
  }
}
