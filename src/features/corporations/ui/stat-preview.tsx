import { Typography } from '@/shared/ui'

interface Props {
  value: string | number
  title: string
}

export const StatPreview = ({ value, title }: Props) => {
  return (
    <Typography as="span" variant="h3">
      {value}{' '}
      <Typography as="span" tone="soft">
        {title}
      </Typography>
    </Typography>
  )
}
