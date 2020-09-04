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
    [
      {
        explain: 'check all available children',
        input: [1],
        output: {
          checkedKeys: [1, 3, 4, 9, 10],
          indeterminateKeys: [0]
        },
        tree: basicTree
      },
      {
        explain: 'stop bubble on disabled parent',
        input: [3],
        output: {
          checkedKeys: [3, 9, 10],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'stop sink to disabled children',
        input: [0],
        output: {
          checkedKeys: [0, 2, 5, 6],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'bubble on ascendant #1',
        input: [2],
        output: {
          checkedKeys: [0, 2, 5, 6],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'bubble on ascendant #2',
        input: [5],
        output: {
          checkedKeys: [5],
          indeterminateKeys: [0, 2]
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'doesn\'t affect other nodes if it\'s disabled',
        input: [1],
        output: {
          checkedKeys: [1],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      }
    ].forEach(testCase => {
      it(testCase.explain, () => {
        const treeMate = TreeMate(testCase.tree)
        expectCheckedStatusSame(
          treeMate.getCheckedKeys(testCase.input),
          testCase.output
        )
      })
    })
  })
  describe('#check', () => {
    [
      {
        explain: 'case1',
        checkedKeys: [],
        checkedKey: 3,
        output: {
          checkedKeys: [3, 9, 10],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case2',
        checkedKeys: [],
        checkedKey: 2,
        output: {
          checkedKeys: [0, 2, 5, 6],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case3',
        checkedKeys: [],
        checkedKey: 5,
        output: {
          checkedKeys: [5],
          indeterminateKeys: [0, 2]
        }
      },
      {
        explain: 'case4',
        checkedKeys: [9],
        checkedKey: 10,
        output: {
          checkedKeys: [3, 9, 10],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case5',
        checkedKeys: [1, 9],
        checkedKey: 10,
        output: {
          checkedKeys: [1, 3, 9, 10],
          indeterminateKeys: []
        }
      },
    ].forEach(testCase => {
      it(testCase.explain, () => {
        const treeMate = TreeMate(disabledNodeTestTree)
        expectCheckedStatusSame(
          treeMate.check(testCase.checkedKey, testCase.checkedKeys),
          testCase.output
        )
      })
    })
  })
  describe('#uncheck', () => {
    [
      {
        explain: 'case1',
        checkedKeys: [3, 9, 10],
        uncheckedKey: 3,
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case2',
        checkedKeys: [3, 9, 10],
        uncheckedKey: 9,
        output: {
          checkedKeys: [10],
          indeterminateKeys: [3]
        }
      },
    ].forEach(testCase => {
      it(testCase.explain, () => {
        const treeMate = TreeMate(disabledNodeTestTree)
        expectCheckedStatusSame(
          treeMate.uncheck(testCase.uncheckedKey, testCase.checkedKeys),
          testCase.output
        )
      })
    })
  })
})