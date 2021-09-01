import { isLeaf } from '@/utils'
import { createTreeMate, RawNode } from '@/index'

describe('utils', () => {
  describe('#isLeaf', () => {
    function getChildren<T = RawNode> (rawNode: T): T[] | undefined {
      return (rawNode as any).children
    }
    it('works', () => {
      expect(
        isLeaf({
          key: 0
        }, getChildren)
      ).toEqual(true)
      expect(
        isLeaf({
          key: 0,
          children: []
        }, getChildren)
      ).toEqual(false)
      expect(
        isLeaf({
          key: 0,
          isLeaf: true
        }, getChildren)
      ).toEqual(true)
      expect(
        isLeaf({
          key: 0,
          isLeaf: false
        }, getChildren)
      ).toEqual(false)
    })
    it('invalid edge case', () => {
      expect(
        isLeaf({
          key: 0,
          children: [],
          isLeaf: true
        }, getChildren)
      ).toEqual(true)
    })
  })
  describe('#getNonLeafKeys', () => {
    const data = [
      {
        key: 1,
        children: [
          {
            key: 2
          },
          {
            key: 3,
            children: [
              {
                key: 4
              }
            ]
          },
          {
            type: 'group',
            key: 5,
            children: [
              {
                key: 6
              }
            ]
          }
        ]
      }
    ]
    it('works', () => {
      const tm = createTreeMate(data)
      expect(tm.getNonLeafKeys()).toEqual([1, 3])
    })
    it('works when `preserveGroup` = true', () => {
      const tm = createTreeMate(data)
      expect(tm.getNonLeafKeys({ preserveGroup: true })).toEqual([1, 3, 5])
    })
  })
})
