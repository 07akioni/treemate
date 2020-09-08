import {
  RawNode,
  TreeNode,
  TreeNodeMap,
  LevelTreeNodeMap,
  TreeMateInstance,
  TreeMateOptions,
  Key
} from '@/interface'
import {
  getCheckedKeys
} from '@/check'
import {
  toArray,
  isDisabled,
  isLeaf,
  isNodeInvalid
} from '@/utils'

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
      process.env.NODE_ENV !== 'production' &&
      isNodeInvalid(rawNode)
    ) {
      console.error(
        '[treemate]: node',
        rawNode,
        'is invalid'
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
        return isDisabled(this.rawNode)
      },
      get isLeaf () {
        return isLeaf(this.rawNode)
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
        { checkedKeys },
        this
      )
    },
    check (
      keysToCheck: Key | Key[],
      checkedKeys: Key[]
    ) {
      return getCheckedKeys(
        {
          checkedKeys,
          keysToCheck: toArray(keysToCheck)
        },
        this
      )
    },
    uncheck (
      keysToUncheck: Key | Key[],
      checkedKeys: Key[]
    ) {
      return getCheckedKeys(
        {
          checkedKeys,
          keysToUncheck: toArray(keysToUncheck)
        },
        this
      )
    }
  }
}
