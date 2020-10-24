import { TreeMate } from '@/index'
import { basicTree } from './check-data'

describe('# flatten', () => {
  it('works', () => {
    expect(TreeMate(basicTree).flattenedNodes.map((node) => node.key)).toEqual([
      '0',
      '0-0',
      '0-0-0',
      '0-0-0-0',
      '0-0-0-1',
      '0-0-1',
      '0-1',
      '0-1-0',
      '0-1-1'
    ])
  })
})
