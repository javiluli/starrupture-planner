import { Accordion, AccordionItemContent } from '@/shared/ui'
import { accordionItemStyles } from '@/shared/ui/accordion/accordion-item.styles'
import { AccordionItem } from '@heroui/react'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCorporationsAccordionData } from '../hooks/use-corporations-accordion-data'
import { getCorporationLevelAnchorId } from '../lib/corporation-level-navigation'
import { CorporationAccordionHeader } from './corporation-accordion-header'
import { CorporationLevelRow } from './corporation-level-row'

const parseLevel = (value: string | null) => {
  if (!value) return null
  const level = Number(value)
  return Number.isInteger(level) && level > 0 ? level : null
}

export const CorporationsAccordion = () => {
  const { corporationsList, itemMap } = useCorporationsAccordionData()
  const [searchParams] = useSearchParams()
  const requestedCorporationId = searchParams.get('corporation')
  const targetLevel = parseLevel(searchParams.get('level'))
  const targetCorporationId = corporationsList.some((corporation) => corporation.id === requestedCorporationId)
    ? requestedCorporationId
    : null

  useEffect(() => {
    if (!targetCorporationId || !targetLevel) return

    // Wait for the accordion expansion animation before centering the requested level.
    const timer = window.setTimeout(() => {
      const target = document.getElementById(getCorporationLevelAnchorId(targetCorporationId, targetLevel))
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      target?.focus({ preventScroll: true })
    }, 300)

    return () => window.clearTimeout(timer)
  }, [targetCorporationId, targetLevel])

  return (
    <Accordion
      key={`${targetCorporationId ?? 'all'}-${targetLevel ?? 'none'}`}
      defaultSelectedKeys={targetCorporationId ? [targetCorporationId] : undefined}
    >
      {corporationsList.map((corporation) => (
        <AccordionItem
          key={corporation.id}
          aria-label={corporation.id.split('_')[0]}
          classNames={accordionItemStyles}
          title={<CorporationAccordionHeader corporation={corporation} />}
        >
          <AccordionItemContent>
            {corporation.levels.map((level) => (
              <CorporationLevelRow
                key={`${corporation.id}-${level.level}`}
                corporationId={corporation.id}
                level={level}
                itemMap={itemMap}
                isTargeted={corporation.id === targetCorporationId && level.level === targetLevel}
              />
            ))}
          </AccordionItemContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
