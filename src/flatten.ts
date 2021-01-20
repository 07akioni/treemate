import {
  TreeNode
} from './interface'

export function flatten<R, G, I> (treeNodes: Array<TreeNode<R, G, I>>, flattenedNodes: Array<TreeNode<R, G, I>> = []): Array<TreeNode<R, G, I>> {
  treeNodes.forEach(treeNode => {
    flattenedNodes.push(treeNode)
    if (treeNode.isLeaf) {
    } else if (treeNode.isGroup) {
      flatten(treeNode.children as TreeNode[], flattenedNodes)
    } else {
      flatten(treeNode.children as TreeNode[], flattenedNodes)
    }
  })
  return flattenedNodes
}
