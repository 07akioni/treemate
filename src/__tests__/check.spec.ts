import { getExtendedCheckedKeys } from '@/check'
import { TreeMate } from '@/index'

import {
  basicTree,
  disabledNodeTestTree,
  extendedCheckedKeysTestTree
} from './check-data/index'
import { expectCheckedStatusSame, expectArrayEqual } from './test-utils/index'

describe('check', () => {
  describe('#getExtentedCheckedKeys', () => {
    ;[
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
      it('extended to all avaiabled children #' + String(index + 1), () => {
        const treeMate = TreeMate(extendedCheckedKeysTestTree)
        const extendedCheckedKeys = getExtendedCheckedKeys(
          data.checkedKeys,
          treeMate
        )
        expectArrayEqual(extendedCheckedKeys, data.extendedCheckedKeys)
      })
    })
  })
  describe('#getCheckedKeys', () => {
    ;[
      {
        explain: 'check all available children',
        input: ['0-0'],
        output: {
          checkedKeys: ['0-0', '0-0-0', '0-0-0-0', '0-0-0-1', '0-0-1'],
          indeterminateKeys: ['0']
        },
        tree: basicTree
      },
      {
        explain: 'stop bubble on disabled parent',
        input: ['0-0-0'],
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'stop sink to disabled children',
        input: ['0'],
        output: {
          checkedKeys: ['0', '0-1', '0-1-0', '0-1-1'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'bubble on ascendant #1',
        input: ['0-1'],
        output: {
          checkedKeys: ['0', '0-1', '0-1-0', '0-1-1'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'bubble on ascendant #2',
        input: ['0-1-0'],
        output: {
          checkedKeys: ['0-1-0'],
          indeterminateKeys: ['0', '0-1']
        },
        tree: disabledNodeTestTree
      },
      {
        explain: "doesn't affect other nodes if it's disabled",
        input: ['0-0'],
        output: {
          checkedKeys: ['0-0'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'input keys are null',
        input: null,
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'input keys are null',
        input: undefined,
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'check all available children (non-cascade)',
        cascade: false,
        input: ['0-0'],
        output: {
          checkedKeys: ['0-0'],
          indeterminateKeys: []
        },
        tree: basicTree
      },
      {
        explain: 'stop bubble on disabled parent (non-cascade)',
        cascade: false,
        input: ['0-0-0'],
        output: {
          checkedKeys: ['0-0-0'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'stop sink to disabled children (non-cascade)',
        cascade: false,
        input: ['0'],
        output: {
          checkedKeys: ['0'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'bubble on ascendant #1 (non-cascade)',
        cascade: false,
        input: ['0-1'],
        output: {
          checkedKeys: ['0-1'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'bubble on ascendant #2 (non-cascade)',
        cascade: false,
        input: ['0-1-0'],
        output: {
          checkedKeys: ['0-1-0'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: "doesn't affect other nodes if it's disabled (non-cascade)",
        cascade: false,
        input: ['0-0'],
        output: {
          checkedKeys: ['0-0'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'input keys are null (non-cascade)',
        cascade: false,
        input: null,
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'input keys are null (non-cascade)',
        cascade: false,
        input: undefined,
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      }
    ].forEach((testCase) => {
      it(testCase.explain, () => {
        const treeMate = TreeMate(testCase.tree)
        expectCheckedStatusSame(
          treeMate.getCheckedKeys(testCase.input, {
            cascade: testCase.cascade
          }),
          testCase.output
        )
      })
    })
  })
  describe('#check', () => {
    ;[
      {
        explain: 'case1',
        checkedKeys: [],
        checkedKey: '0-0-0',
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case2',
        checkedKeys: [],
        checkedKey: '0-1',
        output: {
          checkedKeys: ['0', '0-1', '0-1-0', '0-1-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case3',
        checkedKeys: [],
        checkedKey: '0-1-0',
        output: {
          checkedKeys: ['0-1-0'],
          indeterminateKeys: ['0', '0-1']
        }
      },
      {
        explain: 'case4',
        checkedKeys: ['0-0-0-0'],
        checkedKey: '0-0-0-1',
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case5',
        checkedKeys: ['0-0', '0-0-0-0'],
        checkedKey: '0-0-0-1',
        output: {
          checkedKeys: ['0-0', '0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (null)',
        checkedKeys: ['0-0-0'],
        checkedKey: null,
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (undefined)',
        checkedKeys: ['0-0-0'],
        checkedKey: undefined,
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case1 (no cascade)',
        cascade: false,
        checkedKeys: [],
        checkedKey: '0-0-0',
        output: {
          checkedKeys: ['0-0-0'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case2 (no cascade)',
        cascade: false,
        checkedKeys: [],
        checkedKey: '0-1',
        output: {
          checkedKeys: ['0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case3 (no cascade)',
        cascade: false,
        checkedKeys: [],
        checkedKey: '0-1-0',
        output: {
          checkedKeys: ['0-1-0'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case4 (no cascade)',
        cascade: false,
        checkedKeys: ['0-0-0-0'],
        checkedKey: '0-0-0-1',
        output: {
          checkedKeys: ['0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case5 (no cascade)',
        cascade: false,
        checkedKeys: ['0-0', '0-0-0-0'],
        checkedKey: '0-0-0-1',
        output: {
          checkedKeys: ['0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (null) (non-cascade)',
        cascade: false,
        checkedKeys: ['0-0-0'],
        checkedKey: null,
        output: {
          checkedKeys: ['0-0-0'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (undefined) (non-cascade)',
        cascade: false,
        checkedKeys: ['0-0-0'],
        checkedKey: undefined,
        output: {
          checkedKeys: ['0-0-0'],
          indeterminateKeys: []
        }
      }
    ].forEach((testCase) => {
      it(testCase.explain, () => {
        const treeMate = TreeMate(disabledNodeTestTree)
        expectCheckedStatusSame(
          treeMate.check(testCase.checkedKey, testCase.checkedKeys, {
            cascade: testCase.cascade
          }),
          testCase.output
        )
      })
    })
  })
  describe('#uncheck', () => {
    ;[
      {
        explain: 'case1',
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: '0-0-0',
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case2',
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: '0-0-0-0',
        output: {
          checkedKeys: ['0-0-0-1'],
          indeterminateKeys: ['0-0-0']
        }
      },
      {
        explain: 'nullish input (null)',
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: null,
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (undefined)',
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: undefined,
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case1 (non-cascade)',
        cascade: false,
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: '0-0-0',
        output: {
          checkedKeys: ['0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case2 (non-cascade)',
        cascade: false,
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: '0-0-0-0',
        output: {
          checkedKeys: ['0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (null) (non-cascade)',
        cascade: false,
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: null,
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (undefined) (non-cascade)',
        cascade: false,
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: undefined,
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      }
    ].forEach((testCase) => {
      it(testCase.explain, () => {
        const treeMate = TreeMate(disabledNodeTestTree)
        expectCheckedStatusSame(
          treeMate.uncheck(testCase.uncheckedKey, testCase.checkedKeys, {
            cascade: testCase.cascade
          }),
          testCase.output
        )
      })
    })
  })
})
