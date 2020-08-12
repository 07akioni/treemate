import {
  RawNode,
  TreeNode,
  TreeNodeMap
} from './interface'

function createTreeNodes (
  rawNodes: RawNode[] | null | undefined,
  treeNodeMap: TreeNodeMap,
  parent: TreeNode | null = null,
  level: number = 0,
): TreeNode[] | undefined | null {
  if (rawNodes === undefined || rawNodes === null) {
    return rawNodes
  }
  const treeNodes: TreeNode[] = []
  rawNodes.forEach((rawNode, index) => {
    const treeNode: TreeNode = {
      key: rawNode.key,
      children: createTreeNodes(rawNode.children, treeNodeMap),
      rawNode,
      level,
      index,
      isFirstChild: index === 0,
      isLastChild: index + 1 === rawNodes.length,
      parent: parent
    }
    treeNodes.push(treeNode)
    treeNodeMap.set(treeNode.key, treeNode)
  })
  return treeNodes
}

function createTreeAndMap (rawNodes: RawNode[]) {
  const TreeNodeMap: TreeNodeMap = new Map()
  const treeNodes = createTreeNodes(rawNodes, TreeNodeMap)
  return [treeNodes, TreeNodeMap]
}