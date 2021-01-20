import { GetPathOptions, Key, MergedPath, TreeMate, TreeNode } from './interface'

export function getPath<R, G, I, T extends boolean> (key: Key | null | undefined, { includeGroup = false as any }: GetPathOptions<T>, treeMate: TreeMate<R, G, I>): T extends true ? MergedPath<R, G> : MergedPath<R, R> {
  const treeNodeMap = treeMate.treeNodeMap
  let treeNode = (key === null || key === undefined) ? null : (treeNodeMap.get(key) ?? null)
  const mergedPath: MergedPath<R, G> = {
    keyPath: [],
    treeNodePath: [],
    treeNode: treeNode as TreeNode<R, G> | null
  }
  if (treeNode?.ignored) {
    mergedPath.treeNode = null
    return mergedPath as any
  }
  while (treeNode) {
    if (!treeNode.ignored && (includeGroup || !treeNode.isGroup)) {
      mergedPath.treeNodePath.push(treeNode as any)
    }
    treeNode = treeNode.parent as any
  }
  mergedPath.treeNodePath.reverse()
  mergedPath.keyPath = mergedPath.treeNodePath.map(treeNode => treeNode.key)
  return mergedPath as any
}
