import {
  TreeNode
} from './interface'
import {
  isGroup
} from './utils'

export function flatten (treeNodes: TreeNode[], flattenedNodes: TreeNode[] = []): TreeNode[] {
  treeNodes.forEach(treeNode => {
    flattenedNodes.push(treeNode)
    if (treeNode.isLeaf) {
    } else if (isGroup(treeNode.rawNode)) {
      flatten(treeNode.children as TreeNode[], flattenedNodes)
    } else {
      flatten(treeNode.children as TreeNode[], flattenedNodes)
    }
  })
  return flattenedNodes
}
