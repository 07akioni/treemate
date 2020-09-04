import {
  RawNode,
  TreeNode,
  TreeNodeMap,
  LevelTreeNodeMap
} from './interface'

export function isLeaf (rawNode: RawNode): boolean {
  if (rawNode.isLeaf === true) return true
  else if (rawNode.children === undefined) return true
  return false
}

export function isDisabled (rawNode: RawNode): boolean {
  return rawNode.disabled === true
}

function createTreeNodes (
  rawNodes: RawNode[] | undefined,
  treeNodeMap: TreeNodeMap,
  levelTreeNodeMap: LevelTreeNodeMap,
  parent: TreeNode | null = null,
  level: number = 0,
): TreeNode[] | undefined {
  if (rawNodes === undefined) {
    return rawNodes
  }
  const treeNodes: TreeNode[] = []
  rawNodes.forEach((rawNode, index) => {
    const treeNode: TreeNode = {
      key: rawNode.key,
      rawNode,
      level,
      index,
      isFirstChild: index === 0,
      isLastChild: index + 1 === rawNodes.length,
      get disabled () {
        return isDisabled(rawNode)
      },
      get isLeaf () {
        return isLeaf(rawNode)
      },
      parent: parent
    }
    treeNode.children = createTreeNodes(
      rawNode.children,
      treeNodeMap,
      levelTreeNodeMap,
      treeNode,
      level + 1
    ),
    treeNodes.push(treeNode)
    treeNodeMap.set(treeNode.key, treeNode)
    if (!levelTreeNodeMap.has(level)) levelTreeNodeMap.set(level, [])
    levelTreeNodeMap.get(level)!.push(treeNode)
  })
  return treeNodes
}

export function createTreeAndMap (rawNodes: RawNode[]): [
  TreeNode[],
  TreeNodeMap,
  LevelTreeNodeMap,
] {
  const treeNodeMap: TreeNodeMap = new Map()
  const levelTreeNodeMap: LevelTreeNodeMap = new Map()
  const treeNodes: TreeNode[] = createTreeNodes(
    rawNodes,
    treeNodeMap,
    levelTreeNodeMap,
  )!
  return [treeNodes, treeNodeMap, levelTreeNodeMap]
}