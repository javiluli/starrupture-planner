import { Flex, Typography } from '@/shared/ui'

export const ThemeSwatch = ({ label, className }: { label: string; className: string }) => (
  <Flex justify="center" align="center" className={`h-24 w-24 rounded-xl border border-divider/60 ${className}`}>
    <Typography variant="small" tone="soft">
      {label}
    </Typography>
  </Flex>
)
