/* eslint-disable no-redeclare */
import {
  RawNode,
  TreeNode,
  TreeNodeMap,
  LevelTreeNodeMap,
  TreeMate,
  TreeMateOptions,
  Key,
  InputMergedKeys,
  GetPathOptions,
  CheckOptions,
  GetPrevNextOptions,
  GetNonLeafKeysOptions
} from './interface'
import { getCheckedKeys } from './check'
import {
  toArray,
  isDisabled,
  isLeaf,
  isGroup,
  isNodeInvalid,
  unwrapCheckedKeys,
  isShallowLoaded,
  unwrapIndeterminateKeys,
  getNonLeafKeys
} from './utils'
import { getPath } from './path'
import { moveMethods, getFirstAvailableNode } from './move'
import { flatten } from './flatten'

function createTreeNodes<R, G, I> (
  rawNodes: Array<R | G | I>,
  treeNodeMap: TreeNodeMap<R, G, I>,
  levelTreeNodeMap: LevelTreeNodeMap<R, G, I>,
  options: TreeMateOptions<R, G, I>,
  parent: TreeNode | null = null,
  level: number = 0
): Array<TreeNode<R, G, I>> {
  const treeNodes: Array<TreeNode<R, G, I>> = []
  rawNodes.forEach((rawNode, index) => {
    if (process.env.NODE_ENV !== 'production' && isNodeInvalid(rawNode)) {
      console.error('[treemate]: node', rawNode, 'is invalid')
    }
    const rawTreeNode = {
      rawNode,
      siblings: treeNodes,
      level,
      index,
      isFirstChild: index === 0,
      isLastChild: index + 1 === rawNodes.length,
      get key () {
        const { getKey } = options
        if (getKey) {
          // do not pass parent or related things to it
          // the key need to be specified explicitly
          return getKey(this.rawNode)
        } else {
          return (rawNode as RawNode).key
        }
      },
      get disabled () {
        const { getDisabled } = options
        if (getDisabled) {
          return getDisabled(this.rawNode)
        }
        return isDisabled(this.rawNode)
      },
      get isGroup () {
        const { getIsGroup } = options
        if (getIsGroup) {
          return getIsGroup(this.rawNode)
        }
        return isGroup(this.rawNode)
      },
      get isLeaf () {
        return isLeaf(this.rawNode)
      },
      get shallowLoaded () {
        return isShallowLoaded(this.rawNode)
      },
      get ignored () {
        const { getIgnored } = options
        if (getIgnored) return getIgnored(this.rawNode)
        // by default there is no ignored node
        return false
      },
      parent: parent
    }
    const treeNode: TreeNode<R, G, I> = Object.setPrototypeOf(
      rawTreeNode,
      moveMethods
    )
    const rawChildren = (rawNode as any).children as R[] | undefined
    if (rawChildren !== undefined) {
      treeNode.children = createTreeNodes<R, G, I>(
        rawChildren,
        treeNodeMap,
        levelTreeNodeMap,
        options,
        treeNode,
        level + 1
      )
    }
    treeNodes.push(treeNode)
    treeNodeMap.set(treeNode.key, treeNode)
    if (!levelTreeNodeMap.has(level)) levelTreeNodeMap.set(level, [])
    levelTreeNodeMap.get(level)?.push(treeNode)
  })
  return treeNodes as any
}

export function createTreeMate<R = RawNode, G = R, I = R> (
  rawNodes: Array<R | G | I>,
  options: TreeMateOptions<R, G, I> = {}
): TreeMate<R, G, I> {
  const treeNodeMap: TreeNodeMap<R, G, I> = new Map()
  const levelTreeNodeMap: LevelTreeNodeMap<R, G, I> = new Map()
  const treeNodes: Array<TreeNode<R, G, I>> = createTreeNodes<R, G, I>(
    rawNodes,
    treeNodeMap,
    levelTreeNodeMap,
    options
  )
  // get only raw node
  function getNode<T> (
    key: Key | null | undefined
  ): T extends null | undefined ? null : TreeNode<R>
  function getNode (key: Key | null | undefined): TreeNode | null {
    if (key === null || key === undefined) return null
    const tmNode = treeNodeMap.get(key)
    if (tmNode && !tmNode.isGroup && !tmNode.ignored) {
      return tmNode
    }
    return null
  }
  // get group & raw node, for internally usage
  function _getNode<T> (
    key: Key | null | undefined
  ): T extends null | undefined ? null : TreeNode<R, G>
  function _getNode (key: Key | null | undefined): TreeNode | null {
    if (key === null || key === undefined) return null
    const tmNode = treeNodeMap.get(key)
    if (tmNode && !tmNode.ignored) {
      return tmNode
    }
    return null
  }
  function getPrev<T> (
    key: Key | null | undefined
  ): T extends null | undefined ? null : TreeNode<R>
  function getPrev (
    key: Key | null | undefined,
    options?: GetPrevNextOptions
  ): TreeNode<R> | null {
    const node = _getNode(key)
    if (!node) return null
    return node.getPrev(options)
  }
  function getNext<T> (
    key: Key | null | undefined
  ): T extends null | undefined ? null : TreeNode<R>
  function getNext (
    key: Key | null | undefined,
    options?: GetPrevNextOptions
  ): TreeNode<R> | null {
    const node = _getNode(key)
    if (!node) return null
    return node.getNext(options)
  }
  function getParent<T> (
    key: Key | null | undefined
  ): T extends null | undefined ? null : TreeNode<R>
  function getParent (key: Key | null | undefined): TreeNode<R> | null {
    const node = _getNode(key)
    if (!node) return null
    return node.getParent()
  }
  function getChild<T> (
    key: Key | null | undefined
  ): T extends null | undefined ? null : TreeNode<R>
  function getChild (key: Key | null | undefined): TreeNode<R> | null {
    const node = _getNode(key)
    if (!node) return null
    return node.getChild()
  }
  const treemate: TreeMate<R, G, I> = {
    treeNodes,
    treeNodeMap,
    levelTreeNodeMap,
    getFlattenedNodes (expandedKeys?: Key[]) {
      return flatten(treeNodes, expandedKeys)
    },
    getNode,
    getPrev,
    getNext,
    getParent,
    getChild,
    getFirstAvailableNode () {
      return getFirstAvailableNode(treeNodes)
    },
    getPath<T extends boolean>(
      key: Key | null | undefined,
      options: GetPathOptions<T> = {}
    ) {
      return getPath<R, G, I, T>(key, options, treemate)
    },
    getCheckedKeys (
      checkedKeys: Key[] | InputMergedKeys | null | undefined,
      options: CheckOptions = {}
    ) {
      const { cascade = true, leafOnly = false } = options
      return getCheckedKeys(
        {
          checkedKeys: unwrapCheckedKeys(checkedKeys),
          indeterminateKeys: unwrapIndeterminateKeys(checkedKeys),
          cascade,
          leafOnly
        },
        treemate
      )
    },
    check (
      keysToCheck: Key | Key[] | null | undefined,
      checkedKeys: Key[] | InputMergedKeys,
      options: CheckOptions = {}
    ) {
      const { cascade = true, leafOnly = false } = options
      return getCheckedKeys(
        {
          checkedKeys: unwrapCheckedKeys(checkedKeys),
          indeterminateKeys: unwrapIndeterminateKeys(checkedKeys),
          keysToCheck:
            keysToCheck === undefined || keysToCheck === null
              ? []
              : toArray(keysToCheck),
          cascade,
          leafOnly
        },
        treemate
      )
    },
    uncheck (
      keysToUncheck: Key | Key[] | null | undefined,
      checkedKeys: Key[] | InputMergedKeys,
      options: CheckOptions = {}
    ) {
      const { cascade = true, leafOnly = false } = options
      return getCheckedKeys(
        {
          checkedKeys: unwrapCheckedKeys(checkedKeys),
          indeterminateKeys: unwrapIndeterminateKeys(checkedKeys),
          keysToUncheck:
            keysToUncheck === null || keysToUncheck === undefined
              ? []
              : toArray(keysToUncheck),
          cascade,
          leafOnly
        },
        treemate
      )
    },
    getNonLeafKeys (options: GetNonLeafKeysOptions = {}) {
      return getNonLeafKeys(treeNodes, options)
    }
  }
  return treemate
}
