import { Link } from 'react-router'
import { PlaceholderPage } from '@/web/app/pages/PlaceholderPage'
import { strings } from '@/web/app/strings'

export function NotFoundPage() {
  const t = strings.pages.notFound
  return (
    <PlaceholderPage title={t.title}>
      <p>{t.message}</p>
      <Link
        to="/"
        className="mt-3 inline-block font-medium text-accent underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        {t.backHome}
      </Link>
    </PlaceholderPage>
  )
}
