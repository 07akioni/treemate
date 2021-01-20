import { createTreeMate } from '..'
import { basicTree } from './check-data'
import { groupMoveTree } from './move-data'
import { tree2 } from './ignored-data'

describe('getPath', () => {
  it('works', () => {
    const treeMate = createTreeMate(basicTree)
    expect(treeMate.getPath('0-0-0-0').keyPath).toEqual([
      '0',
      '0-0',
      '0-0-0',
      '0-0-0-0'
    ])
  })
  it('return empty array when key does not exist', () => {
    const treeMate = createTreeMate(basicTree)
    expect(treeMate.getPath('0-0-0-x').keyPath).toEqual([])
  })
  it('works with `includeGroup`', () => {
    const treeMate = createTreeMate(groupMoveTree)
    expect(treeMate.getPath('2-1-1').keyPath).toEqual(['2', '2-1-1'])
    expect(treeMate.getPath('2-1-1', { includeGroup: true }).keyPath).toEqual([
      '2',
      '2-1',
      '2-1-1'
    ])
  })
  it('returns no path for ignored node', () => {
    const tm = createTreeMate(tree2, {
      getIgnored (node) {
        return !!node.ignored
      }
    })
    expect(tm.getPath('1-0').treeNode).toEqual(null)
  })
})
