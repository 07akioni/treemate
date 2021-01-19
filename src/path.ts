import { GetPathOptions, Key, MergedPath, TreeMate } from './interface'

export function getPath<R, G, T extends boolean> (key: Key | null | undefined, { includeGroup = false as any }: GetPathOptions<T>, treeMate: TreeMate<R, G>): T extends true ? MergedPath<R, G> : MergedPath<R, R> {
  const treeNodeMap = treeMate.treeNodeMap
  let treeNode = (key === null || key === undefined) ? null : (treeNodeMap.get(key) ?? null)
  const mergedPath: MergedPath<R, G> = {
    keyPath: [],
    treeNodePath: [],
    treeNode
  }
  while (treeNode) {
    if (includeGroup || !treeNode.isGroup) {
      mergedPath.treeNodePath.push(treeNode)
    }
    treeNode = treeNode.parent
  }
  mergedPath.treeNodePath.reverse()
  mergedPath.keyPath = mergedPath.treeNodePath.map(treeNode => treeNode.key)
  return mergedPath as any
}
