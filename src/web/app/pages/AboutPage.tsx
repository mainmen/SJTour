import { PlaceholderPage } from '@/web/app/pages/PlaceholderPage'
import { strings } from '@/web/app/strings'

export function AboutPage() {
  return (
    <PlaceholderPage title={strings.pages.about.title}>
      {strings.pages.about.placeholder}
    </PlaceholderPage>
  )
}
