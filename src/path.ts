import { GetPathOptions, Key, MergedPath, TreeMateInstance } from './interface'

export function getPath (key: Key | null | undefined, { includeGroup = false }: GetPathOptions, treeMate: TreeMateInstance): MergedPath {
  const treeNodeMap = treeMate.treeNodeMap
  let treeNode = (key === null || key === undefined) ? null : (treeNodeMap.get(key) ?? null)
  const mergedPath: MergedPath = {
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
  return mergedPath
}
