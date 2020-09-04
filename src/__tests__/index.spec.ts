import testData from './index-data/tree-data'
import { expectTreeNodesEqual } from './test-utils/index'
import { TreeMate } from '../index'

describe('index', () => {
  describe('#createTreeNodes', () => {
    testData.forEach(({ createData, description }, index) => {
      it(`case - ${index} - ${description}`, () => {
        const { input, output } = createData()
        const { treeNodes } = TreeMate(input)
        expectTreeNodesEqual(treeNodes, output)
      })
    })
  })
})
