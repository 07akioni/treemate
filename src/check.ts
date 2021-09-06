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
  treeMate: TreeMate<R, G, I>
): Set<Key> {
  return getExtendedCheckedKeySet(
    currentCheckedKeys.concat(checkKeys),
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
  treeMate: TreeMate<R, G, I>
): Set<Key> {
  const extendedCheckedKeySet = getExtendedCheckedKeySet(
    currentCheckedKeys,
    treeMate
  )
  const extendedKeySetToUncheck = getExtendedCheckedKeySet(
    uncheckedKeys,
    treeMate,
    true
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
      treeMate
    )
  } else if (keysToCheck !== undefined) {
    extendedCheckedKeySet = getExtendedCheckedKeySetAfterCheck(
      keysToCheck,
      checkedKeys,
      treeMate
    )
  } else {
    extendedCheckedKeySet = getExtendedCheckedKeySet(checkedKeys, treeMate)
  }

  const checkStrategyIsParent = checkStrategy === 'parent'
  const checkStrategyIsChild = checkStrategy === 'child' || leafOnly

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
    const levelIsZero = level === 0
    // it should exists, nor it is a bug
    const levelTreeNodes = levelTreeNodeMap.get(level)
    for (const levelTreeNode of levelTreeNodes as Array<TreeNode<R, G, I>>) {
      if (levelTreeNode.isLeaf) continue
      const { key: levelTreeNodeKey, shallowLoaded } = levelTreeNode
      if (checkStrategyIsChild && shallowLoaded) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        levelTreeNode.children!.forEach((v) => {
          if (
            !v.disabled &&
            !v.isLeaf &&
            v.shallowLoaded &&
            syntheticCheckedKeySet.has(v.key)
          ) {
            syntheticCheckedKeySet.delete(v.key)
          }
        })
      }
      if (levelTreeNode.disabled || !shallowLoaded) {
        continue
      }
      let fullyChecked = true
      let partialChecked = false
      let allDisabled = true
      // it is shallow loaded, so `children` must exist
      for (const childNode of levelTreeNode.children as Array<
      TreeNode<R, G, I>
      >) {
        const childKey = childNode.key
        if (childNode.disabled) continue
        if (allDisabled) allDisabled = false
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
      if (fullyChecked && !allDisabled) {
        if (checkStrategyIsParent) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          levelTreeNode.children!.forEach((v) => {
            if (!v.disabled && syntheticCheckedKeySet.has(v.key)) {
              syntheticCheckedKeySet.delete(v.key)
            }
          })
        }
        syntheticCheckedKeySet.add(levelTreeNodeKey)
      } else if (partialChecked) {
        syntheticIndeterminateKeySet.add(levelTreeNodeKey)
      }
      if (
        levelIsZero &&
        checkStrategyIsChild &&
        syntheticCheckedKeySet.has(levelTreeNodeKey)
      ) {
        syntheticCheckedKeySet.delete(levelTreeNodeKey)
      }
    }
  }
  return {
    checkedKeys: Array.from(syntheticCheckedKeySet),
    indeterminateKeys: Array.from(syntheticIndeterminateKeySet)
  }
}

// unchecking is safe when doing cascade uncheck in async mode
export function getExtendedCheckedKeySet<R, G, I> (
  checkedKeys: Key[],
  treeMate: TreeMate<R, G, I>,
  isUnchecking: boolean = false
): Set<Key> {
  const { treeNodeMap, getChildren } = treeMate
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
        // Adding keys before loaded check is okay, since if not valid error
        // would be thrown
        extendedKeySet.add(key)
        if (isExpilicitlyNotLoaded(treeNode.rawNode, getChildren)) {
          if (isUnchecking) {
            return TRAVERSE_COMMAND.STOP
          } else {
            throw new SubtreeNotLoadedError()
          }
        }
      })
    }
  })
  return extendedKeySet
}
