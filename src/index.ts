import {
  RawNode,
  TreeNode,
  TreeNodeMap,
  LevelTreeNodeMap,
  TreeMateInstance,
  TreeMateOptions,
  Key,
  CheckResult
} from '@/interface'
import {
  getCheckedKeys
} from '@/check'
import {
  toArray,
  isDisabled,
  isLeaf,
  isNodeInvalid,
  unwrapResult, isShallowLoaded
} from '@/utils'
import {
  getActivePath
} from '@/active-path'

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
      get isShallowLoaded () {
        return isShallowLoaded(this.rawNode)
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
    getActivePath (activeKey: Key) {
      return getActivePath(
        activeKey,
        this
      )
    },
    getCheckedKeys (
      checkedKeys: Key[] | CheckResult
    ) {
      return getCheckedKeys(
        {
          checkedKeys: unwrapResult(checkedKeys)
        },
        this
      )
    },
    check (
      keysToCheck: Key | Key[],
      checkedKeys: Key[] | CheckResult
    ) {
      return getCheckedKeys(
        {
          checkedKeys: unwrapResult(checkedKeys),
          keysToCheck: toArray(keysToCheck)
        },
        this
      )
    },
    uncheck (
      keysToUncheck: Key | Key[],
      checkedKeys: Key[] | CheckResult
    ) {
      return getCheckedKeys(
        {
          checkedKeys: unwrapResult(checkedKeys),
          keysToUncheck: toArray(keysToUncheck)
        },
        this
      )
    }
  }
}
