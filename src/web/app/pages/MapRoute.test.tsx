import { render, screen } from '@testing-library/react'
import { i18n } from '@/web/i18n'
import { MapLoading } from '@/web/app/pages/MapRoute'

describe('MapLoading', () => {
  it('announces a translated loading status', () => {
    render(<MapLoading />)
    expect(screen.getByRole('status')).toHaveTextContent(i18n.t('map.loading'))
    expect(screen.getByRole('status')).toHaveTextContent('Chargement de la carte…')
  })
})
