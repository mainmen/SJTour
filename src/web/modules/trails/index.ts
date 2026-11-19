import { BikeIcon, FootprintsIcon, RouteIcon } from 'lucide-react'
import { trailsModule as core } from '@/core/modules/trails/module'
import { TrailCard } from '@/web/modules/trails/TrailCard'
import { TrailLines } from '@/web/modules/trails/TrailLines'
import { defineWebModule } from '@/web/modules/types'

export const trailsWebModule = defineWebModule({
  id: 'trails',
  core,
  labelKey: 'categories.trails',
  Icon: RouteIcon,
  tone: 'trails',
  Card: TrailCard,
  Overlay: TrailLines,
  layers: [
    { id: 'walking', labelKey: 'layers.walking', Icon: FootprintsIcon },
    { id: 'biking', labelKey: 'layers.biking', Icon: BikeIcon },
  ],
})
