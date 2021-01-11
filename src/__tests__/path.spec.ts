import { TreeMate } from '..'
import { basicTree } from './check-data'
import { groupMoveTree } from './move-data'

describe('getPath', () => {
  it('works', () => {
    const treeMate = TreeMate(basicTree)
    expect(treeMate.getPath('0-0-0-0').keyPath).toEqual([
      '0',
      '0-0',
      '0-0-0',
      '0-0-0-0'
    ])
  })
  it('return empty array when key does not exist', () => {
    const treeMate = TreeMate(basicTree)
    expect(treeMate.getPath('0-0-0-x').keyPath).toEqual([])
  })
  it('works with `includeGroup`', () => {
    const treeMate = TreeMate(groupMoveTree)
    expect(treeMate.getPath('2-1-1').keyPath).toEqual(['2', '2-1-1'])
    expect(treeMate.getPath('2-1-1', { includeGroup: true }).keyPath).toEqual([
      '2',
      '2-1',
      '2-1-1'
    ])
  })
})
