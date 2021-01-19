/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createTreeMate } from '@/index'
import { TreeNode } from '@/interface'

import {
  basicMoveTree,
  groupMoveTree,
  groupMoveTree2,
  firstNodeMoveTree1,
  firstNodeMoveTree2,
  firstNodeMoveTree3,
  disabledMoveTree1,
  disabledMoveTree2,
  disabledMoveTree3,
  disabledMoveTree4,
  disabledMoveTree5
} from './move-data/index'

describe('move', () => {
  const treeMate = createTreeMate(basicMoveTree)
  it('first node', () => {
    const { getFirstAvailableNode } = treeMate
    expect(getFirstAvailableNode()?.key).toEqual('0')
  })
  it('first node(extra case)', () => {
    expect(
      createTreeMate(firstNodeMoveTree1).getFirstAvailableNode()?.key
    ).toEqual('0-1')
    expect(
      createTreeMate(firstNodeMoveTree2).getFirstAvailableNode()?.key
    ).toEqual('1')
    expect(createTreeMate(firstNodeMoveTree3).getFirstAvailableNode()).toEqual(
      null
    )
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
  describe('moves with group', () => {
    const treeMate = createTreeMate(groupMoveTree)
    it('getPrev & getNext', () => {
      let cursor = treeMate.getNode('0')!
      cursor = cursor.getNext()!
      expect(cursor.key).toEqual('1-1')
      expect(cursor.getParent()).toEqual(null)
      cursor = cursor.getNext()!
      expect(cursor.key).toEqual('2')
      cursor = cursor.getNext()!
      expect(cursor.key).toEqual('3')
      cursor = cursor.getChild()!
      expect(cursor.key).toEqual('3-0')
      cursor = cursor.getNext()!
      expect(cursor.key).toEqual('3-2-0')
      cursor = cursor.getPrev()!
      expect(cursor.key).toEqual('3-0')
      cursor = treeMate.getNode('2-0-0')!
      cursor = cursor.getNext()!
      expect(cursor.key).toEqual('2-1-1')
      cursor = cursor.getPrev()!
      expect(cursor.key).toEqual('2-0-0')
    })
    it('getChild', () => {
      expect(treeMate.getNode('2')!.getChild()!.key).toEqual('2-0-0')
    })
    it('getNext (extra 1)', () => {
      const tm = createTreeMate(groupMoveTree2)
      expect(tm.getFirstAvailableNode()?.key).toEqual('1-0')
      expect(tm.getChild('2')).toEqual(null)
      expect(tm.getChild('3')?.key).toEqual('3-1')
      expect(tm.getNode('1-0')?.getNext()?.key).toEqual('3-1')
      expect(tm.getNext('3-1')).toEqual(null)
      expect(tm.getPrev('3-1')?.key).toEqual('1-0')
      expect(tm.getPrev('1-0')).toEqual(null)
      expect(tm.getNext('3-1', { loop: true })?.key).toEqual('1-0')
      expect(tm.getPrev('1-0', { loop: true })?.key).toEqual('3-1')
    })
    it('move in disabled #1', () => {
      const tm = createTreeMate(disabledMoveTree1)
      expect(tm.getFirstAvailableNode()).toEqual(null)
    })
    it('move in disabled #2', () => {
      const tm = createTreeMate(disabledMoveTree2)
      expect(tm.getFirstAvailableNode()).toEqual(null)
    })
    it('move in disabled #3', () => {
      const tm = createTreeMate(disabledMoveTree3)
      expect(tm.getFirstAvailableNode()?.key).toEqual('0-1')
      expect(tm.getNext('0-1')).toEqual(null)
      expect(tm.getPrev('0-1')).toEqual(null)
      expect(tm.getNext('0-1', { loop: true })?.key).toEqual('0-1')
      expect(tm.getPrev('0-1', { loop: true })?.key).toEqual('0-1')
    })
    it('move in disabled #4', () => {
      const tm = createTreeMate(disabledMoveTree4)
      expect(tm.getFirstAvailableNode()?.key).toEqual('0-1')
      expect(tm.getNext('0-1')).toEqual(null)
      expect(tm.getPrev('0-1')).toEqual(null)
      expect(tm.getNext('0-1', { loop: true })?.key).toEqual('0-1')
      expect(tm.getPrev('0-1', { loop: true })?.key).toEqual('0-1')
    })
    it('move in disabled #5', () => {
      const tm = createTreeMate(disabledMoveTree5)
      expect(tm.getPrev('1-0')?.key).toEqual('0-1')
    })
  })
})
