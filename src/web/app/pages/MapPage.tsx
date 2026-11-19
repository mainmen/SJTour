import { PlaceholderPage } from '@/web/app/pages/PlaceholderPage'
import { strings } from '@/web/app/strings'

export function MapPage() {
  return (
    <PlaceholderPage title={strings.pages.map.title}>
      {strings.pages.map.placeholder}
    </PlaceholderPage>
  )
}
