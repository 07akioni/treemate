import { createTreeMate } from '@/index'
import testData from './index-data/tree-data'
import { expectTreeNodesEqual } from './test-utils/index'
import { emptychildrenData } from './empty-children-data'

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
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      createTreeMate([
        {
          key: 'a',
          isLeaf: true,
          children: []
        }
      ])
      expect(spy).not.toHaveBeenCalled()
      createTreeMate([
        {
          key: 'a',
          isLeaf: true,
          children: [
            {
              key: 'b'
            }
          ]
        }
      ])
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
    it('ingoreEmptyChildren', () => {
      const tm = createTreeMate(emptychildrenData, {
        ignoreEmptyChildren: true
      })
      expect(tm.getNode('1')?.isLeaf).toEqual(true)
      expect(tm.getNode('1')?.children).toEqual(undefined)
      expect(tm.getNode('2')?.isLeaf).toEqual(false)
      expect(tm.getNode('2')?.children).not.toEqual(undefined)
      expect(tm.getNode('3')?.isLeaf).toEqual(true)
      expect(tm.getNode('3')?.children).toEqual(undefined)
      expect(tm.getNode('4')?.isLeaf).toEqual(true)
      expect(tm.getNode('4')?.children).toEqual(undefined)
    })
  })
})
