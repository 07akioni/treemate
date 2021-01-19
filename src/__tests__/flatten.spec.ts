import { createTreeMate } from '@/index'
import { basicTree, flattenedBasicTreeKeys } from './check-data'

describe('# flatten', () => {
  it('works', () => {
    expect(
      createTreeMate(basicTree).flattenedNodes.map((node) => node.key)
    ).toEqual(flattenedBasicTreeKeys)
    expect(
      createTreeMate(basicTree).flattenedNodes.map((node) => node.fIndex)
    ).toEqual(flattenedBasicTreeKeys.map((_, i) => i))
  })
})
