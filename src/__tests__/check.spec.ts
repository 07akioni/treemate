import { getCheckedKeys, getExtendedCheckedKeys } from '../check'
import { createTreeAndMap } from '../index'
import { tree1 } from './check-data/index'
import { expectCheckedStatusSame } from './test-utils/index'

describe('check', () => {
  it('#getCheckedKeys', () => {
    const checkedKeys = [1]
    const [, treeNodeMap, levelTreeNodeMap] = createTreeAndMap(tree1)
    const extendedCheckedKeys = getExtendedCheckedKeys(checkedKeys, treeNodeMap)
    expectCheckedStatusSame(getCheckedKeys(extendedCheckedKeys, levelTreeNodeMap), {
      checkedKeys: [1, 3, 4],
      indeterminateKeys: [0]
    })
  })
})