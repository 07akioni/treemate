import { createTreeMate } from '@/index'
import testData from './index-data/tree-data'
import { expectTreeNodesEqual } from './test-utils/index'

describe('index', () => {
  describe('#createTreeNodes', () => {
    testData.forEach(({ createData, description }, index) => {
      it(`case - ${index} - ${description}`, () => {
        const { input, output } = createData()
        const { treeNodes } = createTreeMate(input)
        expectTreeNodesEqual(treeNodes, output)
      })
    })
    it('getChildren', () => {
      const { input, output } = testData[2].createData('coolChildren')
      interface TestNode {
        key: number
        coolChildren?: TestNode[]
      }
      const { treeNodes } = createTreeMate<TestNode>(input as TestNode[], {
        getChildren (rawNode) {
          return rawNode.coolChildren
        }
      })
      expectTreeNodesEqual(treeNodes as any, output)
    })
    it('warns when node is invalid', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation()
      createTreeMate([
        {
          isLeaf: true,
          children: []
        }
      ])
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })
})
