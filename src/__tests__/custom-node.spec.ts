/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createTreeMate } from '@/index'

const data = [
  {
    whatever: '0',
    children: [
      {
        whatever: '0-0'
      },
      {
        whatever: '0-1'
      }
    ]
  }
]

describe('custom node', () => {
  it('works', () => {
    const treemate = createTreeMate(data, {
      getDisabled (node) {
        return node.whatever === '0-0'
      },
      getKey (node) {
        return node.whatever
      }
    })
    expect(treemate.treeNodes[0].key).toEqual('0')
    expect(treemate.treeNodes[0].children![0]!.key).toEqual('0-0')
    expect(treemate.treeNodes[0].children![1]!.key).toEqual('0-1')
    expect(treemate.treeNodes[0].disabled).toEqual(false)
    expect(treemate.treeNodes[0].children![0]!.disabled).toEqual(true)
    expect(treemate.treeNodes[0].children![1]!.disabled).toEqual(false)
  })
})
