import { isLeaf } from '@/utils'

describe('utils', () => {
  describe('#isLeaf', () => {
    it('works', () => {
      expect(isLeaf({
        key: 0
      })).toEqual(true)
      expect(isLeaf({
        key: 0,
        children: []
      })).toEqual(false)
      expect(isLeaf({
        key: 0,
        isLeaf: true
      })).toEqual(true)
      expect(isLeaf({
        key: 0,
        isLeaf: false
      })).toEqual(false)
    })
    it('invalid edge case', () => {
      expect(isLeaf({
        key: 0,
        children: [],
        isLeaf: true
      })).toEqual(true)
    })
  })
})
