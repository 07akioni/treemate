/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TreeMate } from '@/index'
import { TreeNode } from '@/interface'

import { basicMoveTree } from './move-data/index'

describe('move', () => {
  const treeMate = TreeMate(basicMoveTree)
  it('first node', () => {
    const { getFirstAvailableNode } = treeMate
    expect(getFirstAvailableNode()?.key).toEqual('0')
  })
  it('moves', () => {
    const { getNode } = treeMate
    let cursor = getNode('0') as TreeNode
    cursor = cursor.getNext()!
    expect(cursor.key).toEqual('2')
    expect(cursor.getChild()).toEqual(null)
    cursor = cursor.getNext()!
    expect(cursor.key).toEqual('3')
    cursor = cursor.getChild()!
    expect(cursor.key).toEqual('3-1')
    expect(cursor.getParent()?.key).toEqual('3')
    cursor = cursor.getNext()!
    expect(cursor.key).toEqual('3-2')
    cursor = cursor.getNext()!
    expect(cursor.key).toEqual('3-3')
    expect(cursor.getNext()).toEqual(null)
    cursor = cursor.getPrev()!
    expect(cursor.key).toEqual('3-2')
    cursor = cursor.getPrev()!
    expect(cursor.key).toEqual('3-1')
    expect(cursor.getPrev()).toEqual(null)
  })
  it('moves by key', () => {
    let cursor = treeMate.treeNodeMap.get('0') as TreeNode
    const { getChild, getParent, getNext, getPrev } = treeMate
    cursor = getNext('0')!
    expect(cursor.key).toEqual('2')
    expect(getChild('2')).toEqual(null)
    cursor = getNext('2')!
    expect(cursor.key).toEqual('3')
    cursor = getChild('3')!
    expect(cursor.key).toEqual('3-1')
    expect(getParent('3-1')?.key).toEqual('3')
    cursor = getNext('3-1')!
    expect(cursor.key).toEqual('3-2')
    cursor = getNext('3-2')!
    expect(cursor.key).toEqual('3-3')
    expect(getNext('3-3')).toEqual(null)
    cursor = getPrev('3-3')!
    expect(cursor.key).toEqual('3-2')
    cursor = getPrev('3-2')!
    expect(cursor.key).toEqual('3-1')
    expect(getPrev('3-1')).toEqual(null)
  })
})
