import { Key, TreeNode } from './interface'

export function flatten<R, G, I> (
  treeNodes: Array<TreeNode<R, G, I>>,
  expandedKeys?: Key[]
): Array<TreeNode<R, G, I>> {
  const expandedKeySet = expandedKeys ? new Set<Key>(expandedKeys) : undefined
  const flattenedNodes: Array<TreeNode<R, G, I>> = []
  function traverse (treeNodes: Array<TreeNode<R, G, I>>): void {
    treeNodes.forEach((treeNode) => {
      flattenedNodes.push(treeNode)
      if (treeNode.isLeaf || !treeNode.children || treeNode.ignored) return
      if (treeNode.isGroup) {
        // group node shouldn't be expanded
        traverse(treeNode.children)
      } else if (
        // normal non-leaf node
        expandedKeySet === undefined ||
        expandedKeySet.has(treeNode.key)
      ) {
        traverse(treeNode.children)
      }
    })
  }
  traverse(treeNodes)
  return flattenedNodes
}
