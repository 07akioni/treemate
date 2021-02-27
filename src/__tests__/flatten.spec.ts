import { createTreeMate } from '@/index'
import { createIndexGetter } from '@/utils'
import { basicTree, flattenedBasicTreeKeys } from './check-data'
import { expandedableTree, tree2, tree2Keys } from './ignored-data'

describe('# flatten', () => {
  it('works', () => {
    const tm = createTreeMate(basicTree)
    const flattenedNodes = tm.getFlattenedNodes()
    expect(flattenedNodes.map((node) => node.key)).toEqual(
      flattenedBasicTreeKeys
    )
    const getIndex = createIndexGetter(flattenedNodes)
    expect(flattenedNodes.map((node) => getIndex(node.key))).toEqual(
      flattenedBasicTreeKeys.map((_, i) => i)
    )
  })
  it('works with ignored & group', () => {
    const tm = createTreeMate(tree2)
    const flattenedNodes = tm.getFlattenedNodes()
    expect(flattenedNodes.map((node) => node.key)).toEqual(tree2Keys)
    const getIndex = createIndexGetter(flattenedNodes)
    expect(flattenedNodes.map((node) => getIndex(node.key))).toEqual(
      tree2Keys.map((_, i) => i)
    )
  })
  describe('# expanded keys', () => {
    const tm = createTreeMate(expandedableTree)
    it('case 1', () => {
      const fn = tm.getFlattenedNodes([])
      const fn1 = tm.getFlattenedNodes(['2-0'])
      const fk = ['0', '1', '2', '3', '3-0', '3-1']
      expect(fn.map((node) => node.key)).toEqual(fk)
      expect(fn1.map((node) => node.key)).toEqual(fk)
      const getIndex = createIndexGetter(fn)
      expect(fn.map((node) => getIndex(node.key))).toEqual(fk.map((_, i) => i))
      const getIndex1 = createIndexGetter(fn1)
      expect(fn.map((node) => getIndex1(node.key))).toEqual(fk.map((_, i) => i))
    })
    it('case 2', () => {
      const fn = tm.getFlattenedNodes(['1'])
      const fk = ['0', '1', '1-0', '2', '3', '3-0', '3-1']
      expect(fn.map((node) => node.key)).toEqual(fk)
      const getIndex = createIndexGetter(fn)
      expect(fn.map((node) => getIndex(node.key))).toEqual(fk.map((_, i) => i))
    })
    it('case 3', () => {
      const fn = tm.getFlattenedNodes(['1', '2'])
      const fk = ['0', '1', '1-0', '2', '2-0', '2-1', '3', '3-0', '3-1']
      expect(fn.map((node) => node.key)).toEqual(fk)
      const getIndex = createIndexGetter(fn)
      expect(fn.map((node) => getIndex(node.key))).toEqual(fk.map((_, i) => i))
    })
    it('case 4', () => {
      const fn = tm.getFlattenedNodes(['1', '2', '2-0'])
      const fk = [
        '0',
        '1',
        '1-0',
        '2',
        '2-0',
        '2-0-0',
        '2-0-1',
        '2-1',
        '3',
        '3-0',
        '3-1'
      ]
      expect(fn.map((node) => node.key)).toEqual(fk)
      const getIndex = createIndexGetter(fn)
      expect(fn.map((node) => getIndex(node.key))).toEqual(fk.map((_, i) => i))
    })
  })
})
