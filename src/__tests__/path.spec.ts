import { TreeMate } from '..'
import { basicTree } from './check-data'

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
})
