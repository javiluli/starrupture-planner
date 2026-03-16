import { Typography } from '@/shared/ui'
import { useTranslation } from 'react-i18next'

export const ItemCount = ({ totalItems }: { totalItems: number }) => {
  const { t } = useTranslation('items')

  return (
    <div className="panel-muted px-4 py-2">
      <Typography variant="micro" tone="soft" className="uppercase">
        {t('item-counter')}:
        <Typography
          as="span"
          variant="small"
          tone="normal"
          className="ml-2 font-mono font-bold text-foreground"
        >
          {totalItems}
        </Typography>
      </Typography>
    </div>
  )
}
