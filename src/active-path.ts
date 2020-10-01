/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-labels */
import { Key, MergedActivePath, TreeMateInstance } from './interface'

export function getActivePath (activeKey: Key, treeMate: TreeMateInstance): MergedActivePath {
  const treeNodeMap = treeMate.treeNodeMap
  let activeTreeNode = treeNodeMap.get(activeKey) ?? null
  const mergedActivePath: MergedActivePath = {
    keyPath: [],
    treeNodePath: [],
    activeTreeNode
  }
  while (activeTreeNode) {
    mergedActivePath.treeNodePath.push(activeTreeNode)
    activeTreeNode = activeTreeNode.parent
  }
  mergedActivePath.treeNodePath.reverse()
  mergedActivePath.keyPath = mergedActivePath.treeNodePath.map(treeNode => treeNode.key)
  return mergedActivePath
}
