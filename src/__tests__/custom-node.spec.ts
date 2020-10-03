/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TreeMate } from '@/index'

const data = [
  {
    children: [
      {},
      {}
    ]
  }
]

describe('custom node', () => {
  it('works', () => {
    const treemate = TreeMate(data, {
      getDisabled ({ index }) {
        return !!index
      },
      getKey ({ parentKey, index }) {
        if (parentKey === null) return `${index}`
        return `${parentKey}-${index}`
      }
    })
    expect(treemate.treeNodes[0].key).toEqual('0')
    expect(treemate.treeNodes[0].children![0]!.key).toEqual('0-0')
    expect(treemate.treeNodes[0].children![1]!.key).toEqual('0-1')
    expect(treemate.treeNodes[0].disabled).toEqual(false)
    expect(treemate.treeNodes[0].children![0]!.disabled).toEqual(false)
    expect(treemate.treeNodes[0].children![1]!.disabled).toEqual(true)
  })
})
