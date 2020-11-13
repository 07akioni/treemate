import { isLeaf } from '@/utils'
import { createTreeMate } from '@/index'

describe('utils', () => {
  describe('#isLeaf', () => {
    it('works', () => {
      expect(
        isLeaf({
          key: 0
        })
      ).toEqual(true)
      expect(
        isLeaf({
          key: 0,
          children: []
        })
      ).toEqual(false)
      expect(
        isLeaf({
          key: 0,
          isLeaf: true
        })
      ).toEqual(true)
      expect(
        isLeaf({
          key: 0,
          isLeaf: false
        })
      ).toEqual(false)
    })
    it('invalid edge case', () => {
      expect(
        isLeaf({
          key: 0,
          children: [],
          isLeaf: true
        })
      ).toEqual(true)
    })
  })
  describe('#getNonLeafKeys', () => {
    it('works', () => {
      const tm = createTreeMate([
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
            }
          ]
        }
      ])
      expect(tm.getNonLeafKeys()).toEqual([1, 3])
    })
  })
})
