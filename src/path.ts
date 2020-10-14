import { GetPathOptions, Key, MergedPath, TreeMateInstance } from './interface'

export function getPath (key: Key | null, options: GetPathOptions, treeMate: TreeMateInstance): MergedPath {
  const treeNodeMap = treeMate.treeNodeMap
  let treeNode = key === null ? null : (treeNodeMap.get(key) ?? null)
  const mergedPath: MergedPath = {
    keyPath: [],
    treeNodePath: [],
    treeNode
  }
  while (treeNode) {
    mergedPath.treeNodePath.push(treeNode)
    treeNode = treeNode.parent
  }
  mergedPath.treeNodePath.reverse()
  mergedPath.keyPath = mergedPath.treeNodePath.map(treeNode => treeNode.key)
  return mergedPath
}
