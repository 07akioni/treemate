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
import {
  getCheckedKeys
} from './check'
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
import {
  getPath
} from './path'
import {
  moveMethods,
  getFirstAvailableNode
} from './move'
import {
  flatten
} from './flatten'

function createTreeNodes<R, G> (
  rawNodes: Array<R | G>,
  treeNodeMap: TreeNodeMap<R, G>,
  levelTreeNodeMap: LevelTreeNodeMap<R, G>,
  options: TreeMateOptions<R, G>,
  fIndexRef: [number] = [0],
  parent: TreeNode | null = null,
  level: number = 0
): Array<TreeNode<R, G>> {
  const treeNodes: Array<TreeNode<R, G>> = []
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
    const rawTreeNode = ({
      rawNode,
      siblings: treeNodes,
      level,
      index,
      fIndex: fIndexRef[0]++,
      isFirstChild: index === 0,
      isLastChild: index + 1 === rawNodes.length,
      get key () {
        const {
          getKey
        } = options
        if (getKey) {
          // do not pass parent or related things to it
          // the key need to be specified explicitly
          return getKey(
            this.rawNode
          )
        } else {
          return (rawNode as RawNode).key
        }
      },
      get disabled () {
        const {
          getDisabled
        } = options
        if (getDisabled) {
          return getDisabled(this.rawNode)
        }
        return isDisabled(this.rawNode)
      },
      get isGroup () {
        const {
          getIsGroup
        } = options
        if (getIsGroup) return getIsGroup(this.rawNode)
        return isGroup(this.rawNode)
      },
      get isLeaf () {
        return isLeaf(this.rawNode)
      },
      get isShallowLoaded () {
        return isShallowLoaded(this.rawNode)
      },
      parent: parent
    })
    const treeNode: TreeNode<R, G> = Object.setPrototypeOf(rawTreeNode, moveMethods)
    const rawChildren = (rawNode as any).children as R[] | undefined
    if (rawChildren !== undefined) {
      treeNode.children = createTreeNodes<R, G>(
        rawChildren,
        treeNodeMap,
        levelTreeNodeMap,
        options,
        fIndexRef,
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

export function createTreeMate<R=RawNode, G=R> (
  rawNodes: Array<R | G>,
  options: TreeMateOptions<R, G> = {}
): TreeMate<R, G> {
  const treeNodeMap: TreeNodeMap<R, G> = new Map()
  const levelTreeNodeMap: LevelTreeNodeMap<R, G> = new Map()
  const treeNodes: Array<TreeNode<R, G>> = createTreeNodes<R, G>(
    rawNodes,
    treeNodeMap,
    levelTreeNodeMap,
    options
  )
  function getNode<T> (key: Key | null | undefined): T extends (null | undefined) ? null : TreeNode<R, G>
  function getNode (key: Key | null | undefined): TreeNode | null {
    if (key === null || key === undefined) return null
    return treeNodeMap.get(key) ?? null
  }
  function getPrev<T> (key: Key | null | undefined): T extends (null | undefined) ? null : TreeNode<R>
  function getPrev (key: Key | null | undefined, options?: GetPrevNextOptions): TreeNode<R> | null {
    const node = getNode(key)
    if (node === null) return null
    return node.getPrev(options)
  }
  function getNext<T> (key: Key | null | undefined): T extends (null | undefined) ? null : TreeNode<R>
  function getNext (key: Key | null | undefined, options?: GetPrevNextOptions): TreeNode<R> | null {
    const node = getNode(key)
    if (node === null) return null
    return node.getNext(options)
  }
  function getParent<T> (key: Key | null | undefined): T extends (null | undefined) ? null : TreeNode<R>
  function getParent (key: Key | null | undefined): TreeNode<R> | null {
    const node = getNode(key)
    if (node === null) return null
    return node.getParent()
  }
  function getChild<T> (key: Key | null | undefined): T extends (null | undefined) ? null : TreeNode<R>
  function getChild (key: Key | null | undefined): TreeNode<R> | null {
    const node = getNode(key)
    if (node === null) return null
    return node.getChild()
  }
  let cachedFlattenedNodes: Array<TreeNode<R, G>>
  const treemate: TreeMate<R, G> = {
    treeNodes,
    treeNodeMap,
    levelTreeNodeMap,
    get flattenedNodes () {
      return cachedFlattenedNodes || (cachedFlattenedNodes = flatten(treeNodes))
    },
    getNode,
    getPrev,
    getNext,
    getParent,
    getChild,
    getFirstAvailableNode () {
      return getFirstAvailableNode(treeNodes)
    },
    getPath <T extends boolean>(key: Key | null | undefined, options: GetPathOptions<T> = {}) {
      return getPath<R, G, T>(
        key,
        options,
        treemate
      )
    },
    getCheckedKeys (
      checkedKeys: Key[] | InputMergedKeys | null | undefined,
      options: CheckOptions = {}
    ) {
      const {
        cascade = true,
        leafOnly = false
      } = options
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
      const {
        cascade = true,
        leafOnly = false
      } = options
      return getCheckedKeys(
        {
          checkedKeys: unwrapCheckedKeys(checkedKeys),
          indeterminateKeys: unwrapIndeterminateKeys(checkedKeys),
          keysToCheck: (keysToCheck === undefined || keysToCheck === null) ? [] : toArray(keysToCheck),
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
      const {
        cascade = true,
        leafOnly = false
      } = options
      return getCheckedKeys(
        {
          checkedKeys: unwrapCheckedKeys(checkedKeys),
          indeterminateKeys: unwrapIndeterminateKeys(checkedKeys),
          keysToUncheck: (keysToUncheck === null || keysToUncheck === undefined) ? [] : toArray(keysToUncheck),
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
