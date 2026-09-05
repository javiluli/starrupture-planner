import { corporationsByName } from '@/shared/data'
import { getCorporationsSummary } from '../lib/corporation-summary'

const corporationsSummary = getCorporationsSummary(corporationsByName)

export const useCorporationsSummary = () => corporationsSummary
