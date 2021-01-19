import { createTreeMate } from '@/index'
import { SubtreeNotLoadedError } from '@/check'
import { expectCheckedStatusSame } from './test-utils'
import { disabledNodeTestTree, asyncBasicTree } from './async-check-data/index'

describe('async-check', () => {
  describe('#check (async)', () => {
    it("doesn't throw error when subtree is loaded", () => {
      const treeMate = createTreeMate(disabledNodeTestTree)
      let error = null
      try {
        expectCheckedStatusSame(treeMate.check('0-0-0', []), {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        })
        expectCheckedStatusSame(treeMate.check('0-0-0-0', []), {
          checkedKeys: ['0-0-0-0'],
          indeterminateKeys: ['0-0-0']
        })
      } catch (err) {
        error = err
      }
      expect(error).toBeFalsy()
    })
    it('throws error when subtree is not loaded', () => {
      const treeMate = createTreeMate(disabledNodeTestTree)
      let error = null
      try {
        treeMate.check('0', [])
      } catch (err) {
        error = err
      }
      expect(error instanceof SubtreeNotLoadedError).toBeTruthy()
    })
  })
  describe('#uncheck (async)', () => {
    it("doesn't throw error when subtree is loaded", () => {
      const treeMate = createTreeMate(disabledNodeTestTree)
      let error = null
      try {
        expectCheckedStatusSame(
          treeMate.uncheck('0-0-0', ['0-0-0', '0-0-0-0', '0-0-0-1']),
          {
            checkedKeys: [],
            indeterminateKeys: []
          }
        )
        expectCheckedStatusSame(
          treeMate.uncheck('0-0-0-0', ['0-0-0', '0-0-0-0', '0-0-0-1']),
          {
            checkedKeys: ['0-0-0-1'],
            indeterminateKeys: ['0-0-0']
          }
        )
      } catch (err) {
        error = err
      }
      expect(error).toBeFalsy()
    })
    it('throws error when subtree is not loaded', () => {
      const treeMate = createTreeMate(disabledNodeTestTree)
      let error = null
      try {
        treeMate.uncheck('0', [])
      } catch (err) {
        error = err
      }
      expect(error instanceof SubtreeNotLoadedError).toBeTruthy()
    })
  })
  describe('#getCheckedKeys (async)', () => {
    it('do not check when nothing is checked', () => {
      const treeMate = createTreeMate(asyncBasicTree)
      expectCheckedStatusSame(treeMate.getCheckedKeys([]), {
        checkedKeys: [],
        indeterminateKeys: []
      })
    })
    it('do check keys which is loaded', () => {
      const treeMate = createTreeMate(disabledNodeTestTree)
      expectCheckedStatusSame(treeMate.getCheckedKeys(['0-0-0-0']), {
        checkedKeys: ['0-0-0-0'],
        indeterminateKeys: ['0-0-0']
      })
      expectCheckedStatusSame(treeMate.getCheckedKeys(['0-0-0-0', '0-0-0-1']), {
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        indeterminateKeys: []
      })
    })
    it('throws error when subtree is not loaded', () => {
      const treeMate = createTreeMate(asyncBasicTree)
      let error = null
      try {
        expectCheckedStatusSame(treeMate.getCheckedKeys(['0']), {
          checkedKeys: [],
          indeterminateKeys: []
        })
      } catch (err) {
        error = err
      }
      expect(error instanceof SubtreeNotLoadedError).toBeTruthy()
    })
  })
})
