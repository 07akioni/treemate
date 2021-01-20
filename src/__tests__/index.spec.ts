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
    it('warns when node is invalid', () => {
      const spy = jest.spyOn(console, 'error')
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
