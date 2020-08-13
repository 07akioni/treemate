import testData from './index-data/tree-data'
import { expectTreeNodesEqual } from './test-utils/index'
import { createTreeAndMap } from '../index'


describe('index', () => {
  describe('#createTreeNodes', () => {
    testData.forEach(({ createData, description }, index) => {
      it(`case - ${index} - ${description}`, () => {
        const { input, output } = createData()
        const [ treeNodes ] = createTreeAndMap(input)
        expectTreeNodesEqual(treeNodes, output)
      })
    })
  })
})