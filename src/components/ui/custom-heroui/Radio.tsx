// MyButton.tsx
import { extendVariants, Radio } from '@heroui/react'

export const CHRadio = extendVariants(Radio, {
  slots: {
    base: 'group inline-flex m-0 cursor-pointer rounded-lg px-2 py-1 border-2',
    wrapper: ['hidden'],
    labelWrapper: 'ml-0',
    label: 'text-xs',
  },

  variants: {
    category: {
      raw: {
        base: 'data-[selected=true]:border-item-raw data-[selected=true]:bg-item-raw/20',
      },
      processed: {
        base: 'data-[selected=true]:border-item-processed data-[selected=true]:bg-item-processed/20',
      },
      component: {
        base: 'data-[selected=true]:border-item-component data-[selected=true]:bg-item-component/20',
      },
      material: {
        base: 'data-[selected=true]:border-item-material data-[selected=true]:bg-item-material/20',
      },
      ammo: {
        base: 'data-[selected=true]:border-item-ammo data-[selected=true]:bg-item-ammo/20',
      },
      default: {
        base: 'data-[selected=true]:border-item-default data-[selected=true]:bg-item-default/20',
      },
    },
  },

  defaultVariants: {
    category: 'default',
  },
})
