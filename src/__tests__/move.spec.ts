/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TreeMate } from '@/index'
import { TreeNode } from '@/interface'

import { basicMoveTree } from './move-data/index'

describe('move', () => {
  const treeMate = TreeMate(basicMoveTree)
  it('first node', () => {
    expect(treeMate.getFirstAvailableNode()?.key).toEqual('0')
  })
  it('moves', () => {
    let cursor = treeMate.treeNodeMap.get('0') as TreeNode
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
})
