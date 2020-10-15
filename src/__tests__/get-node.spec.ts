import { TreeMate } from '@/index'

import { basicTree } from './check-data/index'

describe('# getNode', () => {
  const treeMate = TreeMate(basicTree)
  it('works with nullish input', () => {
    expect(treeMate.getNode(null)).toEqual(null)
    expect(treeMate.getNode(undefined)).toEqual(null)
  })
  it('works with non-exist key', () => {
    expect(treeMate.getNode('bad-key')).toEqual(null)
  })
  it('works with exist key', () => {
    expect(treeMate.getNode('0-0-0')?.key).toEqual('0-0-0')
    expect(treeMate.getNode('0-0')?.key).toEqual('0-0')
  })
})
