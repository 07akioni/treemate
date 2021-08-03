import { Key, TreeMate, MergedKeys, TreeNode } from './interface'
import {
  isExpilicitlyNotLoaded,
  merge,
  minus,
  traverseWithCb,
  TRAVERSE_COMMAND
} from './utils'

export class SubtreeNotLoadedError extends Error {
  constructor () {
    super()
    this.message =
      'SubtreeNotLoadedError: checking a subtree whose required nodes are not fully loaded.'
  }
}

function getExtendedCheckedKeySetAfterCheck<R, G, I> (
  checkKeys: Key[],
  currentCheckedKeys: Key[],
  leafOnly: boolean,
  treeMate: TreeMate<R, G, I>
): Set<Key> {
  return getExtendedCheckedKeySet(
    currentCheckedKeys.concat(checkKeys),
    leafOnly,
    treeMate
  )
}

function getAvailableAscendantNodeSet<R, G, I> (
  uncheckedKeys: Key[],
  treeMate: TreeMate<R, G, I>
): Set<Key> {
  const visitedKeys: Set<Key> = new Set()
  uncheckedKeys.forEach((uncheckedKey) => {
    const uncheckedTreeNode = treeMate.treeNodeMap.get(uncheckedKey)
    if (uncheckedTreeNode !== undefined) {
      let nodeCursor = uncheckedTreeNode.parent
      while (nodeCursor !== null) {
        if (nodeCursor.disabled) break
        if (visitedKeys.has(nodeCursor.key)) break
        else {
          visitedKeys.add(nodeCursor.key)
        }
        nodeCursor = nodeCursor.parent
      }
    }
  })
  return visitedKeys
}

function getExtendedCheckedKeySetAfterUncheck<R, G, I> (
  uncheckedKeys: Key[],
  currentCheckedKeys: Key[],
  leafOnly: boolean,
  treeMate: TreeMate<R, G, I>
): Set<Key> {
  const extendedCheckedKeySet = getExtendedCheckedKeySet(
    currentCheckedKeys,
    leafOnly,
    treeMate
  )
  const extendedKeySetToUncheck = getExtendedCheckedKeySet(
    uncheckedKeys,
    leafOnly,
    treeMate
  )
  const ascendantKeySet: Set<Key> = getAvailableAscendantNodeSet(
    uncheckedKeys,
    treeMate
  )
  const keysToRemove: Key[] = []
  extendedCheckedKeySet.forEach((key) => {
    if (extendedKeySetToUncheck.has(key) || ascendantKeySet.has(key)) {
      keysToRemove.push(key)
    }
  })
  keysToRemove.forEach((key) => extendedCheckedKeySet.delete(key))
  return extendedCheckedKeySet
}

export function getCheckedKeys<R, G, I> (
  options: {
    checkedKeys: Key[]
    indeterminateKeys: Key[]
    keysToCheck?: Key[]
    keysToUncheck?: Key[]
    cascade: boolean
    // `leafOnly` only works when `keysToCheck` or `keysToUncheck` is set.
    // Since view should always be sync with the input data.
    // We only want the data model value to be leaf only.
    leafOnly: boolean
    checkStrategy: string
  },
  treeMate: TreeMate<R, G, I>
): MergedKeys {
  const {
    checkedKeys,
    keysToCheck,
    keysToUncheck,
    indeterminateKeys,
    cascade,
    leafOnly,
    checkStrategy
  } = options
  if (!cascade) {
    if (keysToCheck !== undefined) {
      return {
        checkedKeys: merge(checkedKeys, keysToCheck),
        indeterminateKeys: Array.from(indeterminateKeys)
      }
    } else if (keysToUncheck !== undefined) {
      return {
        checkedKeys: minus(checkedKeys, keysToUncheck),
        indeterminateKeys: Array.from(indeterminateKeys)
      }
    } else {
      return {
        checkedKeys: Array.from(checkedKeys),
        indeterminateKeys: Array.from(indeterminateKeys)
      }
    }
  }
  const { levelTreeNodeMap } = treeMate
  let extendedCheckedKeySet: Set<Key>
  if (keysToUncheck !== undefined) {
    extendedCheckedKeySet = getExtendedCheckedKeySetAfterUncheck(
      keysToUncheck,
      checkedKeys,
      leafOnly,
      treeMate
    )
  } else if (keysToCheck !== undefined) {
    extendedCheckedKeySet = getExtendedCheckedKeySetAfterCheck(
      keysToCheck,
      checkedKeys,
      leafOnly,
      treeMate
    )
  } else {
    extendedCheckedKeySet = getExtendedCheckedKeySet(
      checkedKeys,
      leafOnly,
      treeMate
    )
  }

  const leafCheckedKeySet = leafOnly ? new Set(extendedCheckedKeySet) : null
  const syntheticCheckedKeySet: Set<Key> = extendedCheckedKeySet
  const syntheticIndeterminateKeySet: Set<Key> = new Set()
  const maxLevel = Math.max.apply(null, Array.from(levelTreeNodeMap.keys()))
  // cascade check
  // 1. if tree is fully loaded, it just works
  // 2. if the tree is not fully loaded, we assume that keys which is in not
  //    loaded tree are not in checked keys
  //    for example:
  //    a -- b(fully-loaded)   -- c(fully-loaded)
  //      |- d(partial-loaded) -- ?e(not-loaded)
  //    in the case, `e` is assumed not to be checked, nor we can't calc `d`'s
  //    and `a`'s status
  for (let level = maxLevel; level >= 0; level -= 1) {
    // it should exists, nor it is a bug
    const levelTreeNodes = levelTreeNodeMap.get(level)
    for (const levelTreeNode of levelTreeNodes as Array<TreeNode<R, G, I>>) {
      if (levelTreeNode.disabled || !levelTreeNode.shallowLoaded) {
        continue
      }
      const levelTreeNodeKey = levelTreeNode.key
      if (!levelTreeNode.isLeaf) {
        let fullyChecked = true
        let partialChecked = false
        // it is shallow loaded, so `children` must exist
        for (const childNode of levelTreeNode.children as Array<
        TreeNode<R, G, I>
        >) {
          const childKey = childNode.key
          if (childNode.disabled) continue
          if (syntheticCheckedKeySet.has(childKey)) {
            partialChecked = true
          } else if (syntheticIndeterminateKeySet.has(childKey)) {
            partialChecked = true
            fullyChecked = false
            break
          } else {
            fullyChecked = false
            if (partialChecked) {
              break
            }
          }
        }
        if (fullyChecked) {
          syntheticCheckedKeySet.add(levelTreeNodeKey)
        } else if (partialChecked) {
          syntheticIndeterminateKeySet.add(levelTreeNodeKey)
        }
      }
    }
  }
  const result = {
    checkedKeys: handleCheckStrategy({
      checkedKeys: Array.from(
        leafOnly ? (leafCheckedKeySet as Set<Key>) : syntheticCheckedKeySet
      ),
      indeterminateKeys: Array.from(syntheticIndeterminateKeySet)
    }, checkStrategy, treeMate),
    indeterminateKeys: Array.from(syntheticIndeterminateKeySet)
  }
  return result
}

function handleCheckStrategy<R, G, I> (res: MergedKeys, checkStrategy: string, treeMate: TreeMate<R, G, I>): Key[] {
  let result: Key[] = []
  switch (checkStrategy) {
    case 'all':
      result = res.checkedKeys
      break
    case 'child':
      res.checkedKeys.forEach((v) => {
        const node = treeMate.getNode(v)
        if (node?.isLeaf) {
          result.push(v)
        }
      })
      break
    case 'parent':
      res.checkedKeys.forEach((v) => {
        const node = treeMate.getNode(v)
        if (node !== null) {
          const flag = isContainChild(node, res.indeterminateKeys)
          if (node?.parent === null || !flag) {
            result.push(v)
          }
        }
      })
      break
    default:
      result = res.checkedKeys
      break
  }
  return result
}
function isContainChild<R, G, I> (
  node: TreeNode<R, G, I>,
  indeterminateKeys: Key[]
): boolean {
  const parent = node.parent
  if (parent !== null) {
    const flag = indeterminateKeys.includes(parent.key)
    if (!flag) {
      return true
    }
  }
  return false
}

export function getExtendedCheckedKeySet<R, G, I> (
  checkedKeys: Key[],
  leafOnly: boolean,
  treeMate: TreeMate<R, G, I>
): Set<Key> {
  const { treeNodeMap } = treeMate
  const visitedKeySet: Set<Key> = new Set()
  const extendedKeySet: Set<Key> = new Set(checkedKeys)
  checkedKeys.forEach((checkedKey) => {
    const checkedTreeNode = treeNodeMap.get(checkedKey)
    if (checkedTreeNode !== undefined) {
      traverseWithCb(checkedTreeNode, (treeNode) => {
        if (treeNode.disabled) {
          return TRAVERSE_COMMAND.STOP
        }
        const { key } = treeNode
        if (visitedKeySet.has(key)) return
        visitedKeySet.add(key)
        if (isExpilicitlyNotLoaded(treeNode.rawNode)) {
          throw new SubtreeNotLoadedError()
        }
        if (!leafOnly || (leafOnly && treeNode.isLeaf)) {
          extendedKeySet.add(key)
        }
      })
      if (leafOnly && !checkedTreeNode.isLeaf) {
        extendedKeySet.delete(checkedTreeNode.key)
      }
    }
  })
  return extendedKeySet
}
