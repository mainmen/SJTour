import { PlaceholderPage } from '@/web/app/pages/PlaceholderPage'
import { strings } from '@/web/app/strings'

export function ListPage() {
  return (
    <PlaceholderPage title={strings.pages.list.title}>
      {strings.pages.list.placeholder}
    </PlaceholderPage>
  )
}
