import {
  TreeNode
} from './interface'
import {
  isGroup
} from './utils'

export function flatten<R, G> (treeNodes: Array<TreeNode<R, G>>, flattenedNodes: Array<TreeNode<R, G>> = []): Array<TreeNode<R, G>> {
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
