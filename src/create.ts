/* eslint-disable no-redeclare */
import {
  RawNode,
  TreeNode,
  TreeNodeMap,
  LevelTreeNodeMap,
  TreeMateInstance,
  TreeMateOptions,
  Key,
  InputMergedKeys,
  GetPathOptions,
  CheckOptions
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
  unwrapIndeterminateKeys
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

function createTreeNodes<T extends RawNode[] | undefined> (
  rawNodes: T,
  treeNodeMap: TreeNodeMap,
  levelTreeNodeMap: LevelTreeNodeMap,
  options: TreeMateOptions,
  fIndexRef: [number] = [0],
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
          return rawNode.key
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
    const treeNode: TreeNode = Object.setPrototypeOf(rawTreeNode, moveMethods)
    treeNode.children = createTreeNodes(
      rawNode.children,
      treeNodeMap,
      levelTreeNodeMap,
      options,
      fIndexRef,
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

export function createTreeMate (
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
  function getNode<T> (key: Key | null | undefined): T extends (null | undefined) ? null : TreeNode
  function getNode (key: Key | null | undefined): TreeNode | null {
    if (key === null || key === undefined) return null
    return treeNodeMap.get(key) ?? null
  }
  function getPrev<T> (key: Key | null | undefined): T extends (null | undefined) ? null : TreeNode
  function getPrev (key: Key | null | undefined): TreeNode | null {
    const node = getNode(key)
    if (node === null) return null
    return node.getPrev()
  }
  function getNext<T> (key: Key | null | undefined): T extends (null | undefined) ? null : TreeNode
  function getNext (key: Key | null | undefined): TreeNode | null {
    const node = getNode(key)
    if (node === null) return null
    return node.getNext()
  }
  function getParent<T> (key: Key | null | undefined): T extends (null | undefined) ? null : TreeNode
  function getParent (key: Key | null | undefined): TreeNode | null {
    const node = getNode(key)
    if (node === null) return null
    return node.getParent()
  }
  function getChild<T> (key: Key | null | undefined): T extends (null | undefined) ? null : TreeNode
  function getChild (key: Key | null | undefined): TreeNode | null {
    const node = getNode(key)
    if (node === null) return null
    return node.getChild()
  }
  let cachedFlattenedNodes: TreeNode[]
  const treemate: TreeMateInstance = {
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
    getPath (key: Key, options: GetPathOptions = {}) {
      return getPath(
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
    }
  }
  return treemate
}
