import { Flex } from '@/shared/ui'
import { ComponentPlayground, PlaygroundPreview } from '../../components'
import { Button, cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'

type ScaleStep = {
  key: string
  value: string
}

type InlineStep = {
  key: string
  color: string
}

const ThemeSwatch = ({ label, className }: { label: string; className: string }) => (
  <Flex justify="center" align="center" className={`h-8 w-20 rounded-xl border border-divider/30 ${className}`}>
    <span className="text-tiny">{label}</span>
  </Flex>
)

const ScaleSwatch = ({ label, className }: { label: string; className: string }) => (
  <Flex direction="col" justify="center">
    <div className={cn('h-6 w-6 rounded', className)} />
    <span className="text-xs">{label}</span>
  </Flex>
)

const InlineSwatch = ({ label, color }: { label: string; color: string }) => (
  <Flex direction="col" justify="center">
    <div className="h-6 w-6 rounded" style={{ background: color }} />
    <span className="text-xs">{label}</span>
  </Flex>
)

const ThemeScaleDropdown = ({ label, colors }: { label: string; colors: ScaleStep[] }) => (
  <Flex wrap="wrap" gap="md">
    <Dropdown>
      <DropdownTrigger>
        <Button color={label as never}>{label}</Button>
      </DropdownTrigger>
      <DropdownMenu disableAnimation aria-label="Theme scale">
        <DropdownItem isReadOnly key="scale">
          <div className="grid grid-cols-5 gap-1 gap-y-3">
            {colors.map((c) => (
              <ScaleSwatch key={c.key} label={c.key} className={c.value} />
            ))}
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </Flex>
)

const ThemeScaleForegroundDropdown = ({ label, colors }: { label: string; colors: ScaleStep[] }) => (
  <Flex wrap="wrap" gap="md">
    <Dropdown>
      <DropdownTrigger>
        <Button className="bg-foreground text-background">{label}</Button>
      </DropdownTrigger>
      <DropdownMenu disableAnimation aria-label="Theme scale">
        <DropdownItem isReadOnly key="scale">
          <div className="grid grid-cols-5 gap-1 gap-y-3">
            {colors.map((c) => (
              <ScaleSwatch key={c.key} label={c.key} className={c.value} />
            ))}
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </Flex>
)

const InlineScaleDropdown = ({ label, colors }: { label: string; colors: InlineStep[] }) => (
  <Flex wrap="wrap" gap="md">
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">{label}</Button>
      </DropdownTrigger>
      <DropdownMenu disableAnimation aria-label="Theme preview scale">
        <DropdownItem isReadOnly key="scale">
          <div className="grid grid-cols-5 gap-1 gap-y-3">
            {colors.map((c) => (
              <InlineSwatch key={c.key} label={c.key} color={c.color} />
            ))}
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </Flex>
)

const defaultScale: ScaleStep[] = [
  { key: '50', value: `bg-default-50` },
  { key: '100', value: `bg-default-100` },
  { key: '200', value: `bg-default-200` },
  { key: '300', value: `bg-default-300` },
  { key: '400', value: `bg-default-400` },
  { key: '500', value: `bg-default-500` },
  { key: '600', value: `bg-default-600` },
  { key: '700', value: `bg-default-700` },
  { key: '800', value: `bg-default-800` },
  { key: '900', value: `bg-default-900` },
]

const primaryScale: ScaleStep[] = [
  { key: '50', value: `bg-primary-50` },
  { key: '100', value: `bg-primary-100` },
  { key: '200', value: `bg-primary-200` },
  { key: '300', value: `bg-primary-300` },
  { key: '400', value: `bg-primary-400` },
  { key: '500', value: `bg-primary-500` },
  { key: '600', value: `bg-primary-600` },
  { key: '700', value: `bg-primary-700` },
  { key: '800', value: `bg-primary-800` },
  { key: '900', value: `bg-primary-900` },
]

const secondaryScale: ScaleStep[] = [
  { key: '50', value: `bg-secondary-50` },
  { key: '100', value: `bg-secondary-100` },
  { key: '200', value: `bg-secondary-200` },
  { key: '300', value: `bg-secondary-300` },
  { key: '400', value: `bg-secondary-400` },
  { key: '500', value: `bg-secondary-500` },
  { key: '600', value: `bg-secondary-600` },
  { key: '700', value: `bg-secondary-700` },
  { key: '800', value: `bg-secondary-800` },
  { key: '900', value: `bg-secondary-900` },
]

const successScale: ScaleStep[] = [
  { key: '50', value: `bg-success-50` },
  { key: '100', value: `bg-success-100` },
  { key: '200', value: `bg-success-200` },
  { key: '300', value: `bg-success-300` },
  { key: '400', value: `bg-success-400` },
  { key: '500', value: `bg-success-500` },
  { key: '600', value: `bg-success-600` },
  { key: '700', value: `bg-success-700` },
  { key: '800', value: `bg-success-800` },
  { key: '900', value: `bg-success-900` },
]

const warningScale: ScaleStep[] = [
  { key: '50', value: `bg-warning-50` },
  { key: '100', value: `bg-warning-100` },
  { key: '200', value: `bg-warning-200` },
  { key: '300', value: `bg-warning-300` },
  { key: '400', value: `bg-warning-400` },
  { key: '500', value: `bg-warning-500` },
  { key: '600', value: `bg-warning-600` },
  { key: '700', value: `bg-warning-700` },
  { key: '800', value: `bg-warning-800` },
  { key: '900', value: `bg-warning-900` },
]

const dangerScale: ScaleStep[] = [
  { key: '50', value: `bg-danger-50` },
  { key: '100', value: `bg-danger-100` },
  { key: '200', value: `bg-danger-200` },
  { key: '300', value: `bg-danger-300` },
  { key: '400', value: `bg-danger-400` },
  { key: '500', value: `bg-danger-500` },
  { key: '600', value: `bg-danger-600` },
  { key: '700', value: `bg-danger-700` },
  { key: '800', value: `bg-danger-800` },
  { key: '900', value: `bg-danger-900` },
]

const foregroundScale: ScaleStep[] = [
  { key: '50', value: `bg-foreground-50` },
  { key: '100', value: `bg-foreground-100` },
  { key: '200', value: `bg-foreground-200` },
  { key: '300', value: `bg-foreground-300` },
  { key: '400', value: `bg-foreground-400` },
  { key: '500', value: `bg-foreground-500` },
  { key: '600', value: `bg-foreground-600` },
  { key: '700', value: `bg-foreground-700` },
  { key: '800', value: `bg-foreground-800` },
  { key: '900', value: `bg-foreground-900` },
]

const buildPreviewScale = (baseColor: string, targetColor: string): InlineStep[] => [
  { key: '50', color: `color-mix(in oklab, ${baseColor} 95%, ${targetColor})` },
  { key: '100', color: `color-mix(in oklab, ${baseColor} 90%, ${targetColor})` },
  { key: '200', color: `color-mix(in oklab, ${baseColor} 80%, ${targetColor})` },
  { key: '300', color: `color-mix(in oklab, ${baseColor} 70%, ${targetColor})` },
  { key: '400', color: `color-mix(in oklab, ${baseColor} 60%, ${targetColor})` },
  { key: '500', color: `color-mix(in oklab, ${baseColor} 50%, ${targetColor})` },
  { key: '600', color: `color-mix(in oklab, ${baseColor} 40%, ${targetColor})` },
  { key: '700', color: `color-mix(in oklab, ${baseColor} 30%, ${targetColor})` },
  { key: '800', color: `color-mix(in oklab, ${baseColor} 20%, ${targetColor})` },
  { key: '900', color: `color-mix(in oklab, ${baseColor} 10%, ${targetColor})` },
]

const makeThemeVar = (name: string) => `hsl(var(--heroui-${name}) / 1)`

const previewBackground = buildPreviewScale(makeThemeVar('background'), '#ffffff')
const previewContent1 = buildPreviewScale(makeThemeVar('content1'), '#ffffff')
const previewContent2 = buildPreviewScale(makeThemeVar('content2'), '#ffffff')
const previewContent3 = buildPreviewScale(makeThemeVar('content3'), '#ffffff')
const previewContent4 = buildPreviewScale(makeThemeVar('content4'), '#ffffff')

export const Theme = () => {
  return (
    <ComponentPlayground id="theme" title="Theme">
      <PlaygroundPreview>
        <Flex wrap="wrap" gap="md">
          <ThemeScaleDropdown label="default" colors={defaultScale} />
          <ThemeScaleDropdown label="primary" colors={primaryScale} />
          <ThemeScaleDropdown label="secondary" colors={secondaryScale} />
          <ThemeScaleDropdown label="success" colors={successScale} />
          <ThemeScaleDropdown label="warning" colors={warningScale} />
          <ThemeScaleDropdown label="danger" colors={dangerScale} />
        </Flex>

        <Flex wrap="wrap" gap="md">
          <InlineScaleDropdown label="background (preview)" colors={previewBackground} />
          <ThemeScaleForegroundDropdown label="foreground" colors={foregroundScale} />

          <InlineScaleDropdown label="content1 (preview)" colors={previewContent1} />
          <InlineScaleDropdown label="content2 (preview)" colors={previewContent2} />
          <InlineScaleDropdown label="content3 (preview)" colors={previewContent3} />
          <InlineScaleDropdown label="content4 (preview)" colors={previewContent4} />
        </Flex>

        <Flex wrap="wrap" gap="md">
          <ThemeSwatch label="focus" className="bg-focus" />
          <ThemeSwatch label="overlay" className="bg-overlay text-background" />
          <ThemeSwatch label="divider" className="bg-divider" />
        </Flex>
      </PlaygroundPreview>
    </ComponentPlayground>
  )
}
