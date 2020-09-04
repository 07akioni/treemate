import { getExtendedCheckedKeys } from '../check'
import { TreeMate } from '../index'
import { basicTree, disabledNodeTestTree, extendedCheckedKeysTestTree } from './check-data/index'
import { expectCheckedStatusSame, expectArrayEqual } from './test-utils/index'
import { Key } from '../interface'

describe('check', () => {
  describe('#getExtentedCheckedKeys', () => {
    [
      {
        checkedKeys: ['0'],
        extendedCheckedKeys: ['0', '0-0']
      },
      {
        checkedKeys: ['1'],
        extendedCheckedKeys: ['1']
      },
      {
        checkedKeys: ['0-1'],
        extendedCheckedKeys: ['0-1']
      },
      {
        checkedKeys: ['1-1'],
        extendedCheckedKeys: ['1-1', '1-1-0']
      }
    ].forEach((data, index) => {
      it('extended to all avaiabled children #' + (index + 1), () => {
        const treeMate = TreeMate(extendedCheckedKeysTestTree)
        const extendedCheckedKeys = getExtendedCheckedKeys(data.checkedKeys, treeMate)
        expectArrayEqual(
          extendedCheckedKeys,
          data.extendedCheckedKeys
        )
      })
    })
  })
  describe('#getCheckedKeys', () => {
    it('check all available children', () => {
      const checkedKeys = [1]
      const treeMate = TreeMate(basicTree)
      expectCheckedStatusSame(treeMate.getCheckedKeys(checkedKeys), {
        checkedKeys: [1, 3, 4, 9, 10],
        indeterminateKeys: [0]
      })
    })
    it('stop bubble on disabled parent', () => {
      const checkedKeys = [3]
      const treeMate = TreeMate(disabledNodeTestTree)
      expectCheckedStatusSame(treeMate.getCheckedKeys(checkedKeys), {
        checkedKeys: [3, 9, 10],
        indeterminateKeys: []
      })
    }),
    it('stop sink to disabled children', () => {
      const checkedKeys = [0]
      const treeMate = TreeMate(disabledNodeTestTree)
      expectCheckedStatusSame(treeMate.getCheckedKeys(checkedKeys), {
        checkedKeys: [0, 2, 5, 6],
        indeterminateKeys: []
      })
    })
    it('bubble on ascendant', () => {
      const checkedKeys = [2]
      const treeMate = TreeMate(disabledNodeTestTree)
      expectCheckedStatusSame(treeMate.getCheckedKeys(checkedKeys), {
        checkedKeys: [0, 2, 5, 6],
        indeterminateKeys: []
      })
    })
    it('doesn\'t affect other nodes if it\'s disabled', () => {
      const checkedKeys = [1]
      const treeMate = TreeMate(disabledNodeTestTree)
      expectCheckedStatusSame(treeMate.getCheckedKeys(checkedKeys), {
        checkedKeys: [1],
        indeterminateKeys: []
      })
    })
  })
  describe('#check', () => {
    it('works', () => {
      const checkedKeys: Key[] = []
      const treeMate = TreeMate(disabledNodeTestTree)
      expectCheckedStatusSame(treeMate.check(3, checkedKeys), {
        checkedKeys: [3, 9, 10],
        indeterminateKeys: []
      })
    })
  })
  describe('#uncheck', () => {
    it('works', () => {
      const checkedKeys: Key[] = [3, 9, 10]
      const treeMate = TreeMate(disabledNodeTestTree)
      expectCheckedStatusSame(treeMate.uncheck(3, checkedKeys), {
        checkedKeys: [],
        indeterminateKeys: []
      })
    })
  })
})