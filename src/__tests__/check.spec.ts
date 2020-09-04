import { getCheckedKeys, getExtendedCheckedKeys } from '../check'
import { createTreeAndMap } from '../index'
import { tree1, disabledTree1 } from './check-data/index'
import { expectCheckedStatusSame } from './test-utils/index'

describe('check', () => {
  it('#getCheckedKeys case 1', () => {
    const checkedKeys = [1]
    const [, treeNodeMap, levelTreeNodeMap] = createTreeAndMap(tree1)
    const extendedCheckedKeys = getExtendedCheckedKeys(checkedKeys, treeNodeMap)
    expectCheckedStatusSame(getCheckedKeys(extendedCheckedKeys, levelTreeNodeMap), {
      checkedKeys: [1, 3, 4],
      indeterminateKeys: [0]
    })
  })
  it('#getCheckedKeys case 2', () => {
    const checkedKeys = [3]
    const [, treeNodeMap, levelTreeNodeMap] = createTreeAndMap(disabledTree1)
    const extendedCheckedKeys = getExtendedCheckedKeys(checkedKeys, treeNodeMap)
    expectCheckedStatusSame(getCheckedKeys(extendedCheckedKeys, levelTreeNodeMap), {
      checkedKeys: [3],
      indeterminateKeys: []
    })
  })
})