import {
  RawNode,
  TreeNode,
  TreeNodeMap,
  LevelTreeNodeMap,
  TreeMateInstance,
  TreeMateOptions,
  Key
} from './interface'

import {
  getCheckedKeys
} from './check'

export function isLeaf (rawNode: RawNode): boolean {
  const { isLeaf } = rawNode
  if (isLeaf !== undefined) return isLeaf
  else if (rawNode.children === undefined) return true
  return false
}

export function isDisabled (rawNode: RawNode): boolean {
  return rawNode.disabled === true
}

function createTreeNodes<T extends RawNode[] | undefined> (
  rawNodes: T,
  treeNodeMap: TreeNodeMap,
  levelTreeNodeMap: LevelTreeNodeMap,
  options: TreeMateOptions,
  parent: TreeNode | null = null,
  level: number = 0
): T extends RawNode[] ? TreeNode[] : undefined {
  if (rawNodes === undefined) {
    return rawNodes as any
  }
  const treeNodes: TreeNode[] = []
  rawNodes.forEach((rawNode, index) => {
    if (
      options.async === true &&
      rawNode.isLeaf === undefined
    ) {
      console.error(
        '[treemate]: node has no `isLeaf` property',
        rawNode,
        'all nodes in async mode should have `isLeaf` property'
      )
    }
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
      options,
      treeNode,
      level + 1
    )
    treeNodes.push(treeNode)
    treeNodeMap.set(treeNode.key, treeNode)
    if (!levelTreeNodeMap.has(level)) levelTreeNodeMap.set(level, [])
    levelTreeNodeMap.get(level)?.push(treeNode)
  })
  return treeNodes as any
}

export function TreeMate (
  rawNodes: RawNode[],
  options: TreeMateOptions = {}
): TreeMateInstance {
  const treeNodeMap: TreeNodeMap = new Map()
  const levelTreeNodeMap: LevelTreeNodeMap = new Map()
  const treeNodes: TreeNode[] = createTreeNodes(
    rawNodes,
    treeNodeMap,
    levelTreeNodeMap,
    options
  )
  return {
    treeNodes,
    treeNodeMap,
    levelTreeNodeMap,
    getCheckedKeys (
      checkedKeys: Key[]
    ) {
      return getCheckedKeys(
        checkedKeys,
        {
          type: 'none'
        },
        this
      )
    },
    check (
      checkedKey: Key | Key[],
      checkedKeys: Key[]
    ) {
      return getCheckedKeys(
        checkedKeys,
        {
          type: 'check',
          data: checkedKey
        },
        this
      )
    },
    uncheck (
      uncheckedKey: Key | Key[],
      checkedKeys: Key[]
    ) {
      return getCheckedKeys(
        checkedKeys,
        {
          type: 'uncheck',
          data: uncheckedKey
        },
        this
      )
    }
  }
}
