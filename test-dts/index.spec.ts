import { MergedPath } from '@/interface'
import { createTreeMate, TreeNode } from '../src/index'
import { expectType } from './utils'

describe('Select', () => {
  type Option = BaseOption | GroupOption
  interface BaseOption {
    label: string
    value: string | number
  }
  interface GroupOption {
    label: string
    value: string | number
    children: BaseOption[]
  }
  const options: Option[] = []
  const tm = createTreeMate<BaseOption, GroupOption>(options)
  expectType<BaseOption|undefined>(tm.getFirstAvailableNode()?.rawNode)
  const tmNode = tm.getNode(1)
  expectType<TreeNode<Option>|null>(tmNode)
  const rawNode = tmNode?.rawNode
  expectType<GroupOption|BaseOption|undefined>(rawNode)
  const path1 = tm.getPath(1, {
    includeGroup: true
  })
  expectType<MergedPath<BaseOption, GroupOption>>(path1)
  const path2 = tm.getPath(1, {
    includeGroup: false
  })
  expectType<MergedPath<BaseOption>>(path2)
  it('passed', () => {
    expect(true)
  })
})
