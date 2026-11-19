import { coreModules } from '@/core/modules/registry'
import { webModules } from '@/web/modules/registry'

describe('web module registry', () => {
  it('has one web module per core module, in the same order', () => {
    expect(webModules.map((module) => module.core)).toEqual(coreModules)
  })

  it.each(webModules.map((module) => [module.id, module] as const))(
    '%s chips match its core layers',
    (_id, module) => {
      expect(module.layers.map((layer) => layer.id)).toEqual(
        module.core.layers.map((layer) => layer.id),
      )
    },
  )
})
