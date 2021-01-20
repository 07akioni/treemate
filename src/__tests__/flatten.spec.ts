import { createTreeMate } from '@/index'
import { basicTree, flattenedBasicTreeKeys } from './check-data'
import { tree2, tree2Keys } from './ignored-data'

describe('# flatten', () => {
  it('works', () => {
    const tm = createTreeMate(basicTree)
    expect(tm.flattenedNodes.map((node) => node.key)).toEqual(
      flattenedBasicTreeKeys
    )
    expect(tm.flattenedNodes.map((node) => node.fIndex)).toEqual(
      flattenedBasicTreeKeys.map((_, i) => i)
    )
  })
  it('works with ignored & group', () => {
    const tm = createTreeMate(tree2)
    expect(tm.flattenedNodes.map((node) => node.key)).toEqual(tree2Keys)
    expect(tm.flattenedNodes.map((node) => node.fIndex)).toEqual(
      tree2Keys.map((_, i) => i)
    )
  })
})
