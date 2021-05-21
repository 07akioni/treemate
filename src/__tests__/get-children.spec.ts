import { Key } from '@/interface'
import { createTreeMate } from '..'

describe('#getChildren', () => {
  it('works', () => {
    interface MyNode {
      key: Key
      childs?: MyNode[]
      children?: MyNode[]
    }
    const tm = createTreeMate<MyNode>(
      [
        {
          key: 1,
          children: [
            {
              key: 3
            }
          ],
          childs: [
            {
              key: 2
            }
          ]
        }
      ],
      {
        getChildren (node) {
          return node.childs
        }
      }
    )
    expect(tm.treeNodes[0].children?.[0].key).toEqual(2)
  })
})
