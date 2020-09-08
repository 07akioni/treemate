import {
  Key,
  TreeMateInstance,
  CheckResult
} from '@/interface'
import {
  isExpilicitlyNotLoaded,
  traverse,
  TRAVERSE_COMMAND
} from '@/utils'

export class SubtreeUnloadedError extends Error {
  constructor () {
    super()
    this.message = 'SubtreeUnloadedError: checking a subtree whose required nodes are not fully loaded.'
  }
}

function getExtendedCheckedKeysAfterCheck (
  checkKeys: Key[],
  currentCheckedKeys: Key[],
  treeMate: TreeMateInstance
): Key[] {
  return getExtendedCheckedKeys(
    currentCheckedKeys.concat(
      checkKeys
    ),
    treeMate
  )
}

function getAvailableAscendantNodeSet (
  uncheckedKeys: Key[],
  treeMate: TreeMateInstance
): Set<Key> {
  const visitedKeys: Set<Key> = new Set()
  uncheckedKeys.forEach(uncheckedKey => {
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

function getExtendedCheckedKeysAfterUncheck (
  uncheckedKeys: Key[],
  currentCheckedKeys: Key[],
  treeMate: TreeMateInstance
): Key[] {
  const extendedCheckedKeys = getExtendedCheckedKeys(
    currentCheckedKeys,
    treeMate
  )
  const extendedKeySetToUncheck = new Set(getExtendedCheckedKeys(
    uncheckedKeys,
    treeMate
  ))
  const ascendantKeySet: Set<Key> = getAvailableAscendantNodeSet(
    uncheckedKeys,
    treeMate
  )
  return extendedCheckedKeys.filter(
    checkedKey => (
      !extendedKeySetToUncheck.has(checkedKey) &&
      !ascendantKeySet.has(checkedKey)
    )
  )
}

export function getCheckedKeys (
  options: {
    checkedKeys: Key[]
    keysToCheck?: Key[]
    keysToUncheck?: Key[]
  },
  treeMate: TreeMateInstance
): CheckResult {
  const {
    checkedKeys,
    keysToCheck,
    keysToUncheck
  } = options
  const { levelTreeNodeMap } = treeMate
  let extendedCheckedKeys: Key[]
  if (keysToUncheck !== undefined) {
    extendedCheckedKeys = getExtendedCheckedKeysAfterUncheck(
      keysToUncheck,
      checkedKeys,
      treeMate
    )
  } else if (keysToCheck !== undefined) {
    extendedCheckedKeys = getExtendedCheckedKeysAfterCheck(
      keysToCheck,
      checkedKeys,
      treeMate
    )
  } else {
    extendedCheckedKeys = getExtendedCheckedKeys(
      checkedKeys,
      treeMate
    )
  }

  const syntheticCheckedKeySet: Set<Key> = new Set(extendedCheckedKeys)
  const syntheticIndeterminateKeySet: Set<Key> = new Set()
  const maxLevel = Math.max.apply(
    null,
    Array.from(levelTreeNodeMap.keys())
  )
  for (let level = maxLevel; level >= 0; level -= 1) {
    const levelTreeNodes = levelTreeNodeMap.get(level) ?? []
    for (const levelTreeNode of levelTreeNodes) {
      if (levelTreeNode.disabled) {
        continue
      }
      const levelTreeNodeKey = levelTreeNode.key
      if (!levelTreeNode.isLeaf) {
        let fullyChecked = true
        let partialChecked = false
        for (const childNode of levelTreeNode.children ?? []) {
          const childKey = childNode.key
          if (childNode.disabled) continue
          if (
            syntheticCheckedKeySet.has(childKey)
          ) {
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
  return {
    checkedKeys: Array.from(syntheticCheckedKeySet),
    indeterminateKeys: Array.from(syntheticIndeterminateKeySet)
  }
}

export function getExtendedCheckedKeys (
  checkedKeys: Key[],
  treeMate: TreeMateInstance
): Key[] {
  const { treeNodeMap } = treeMate
  const checkedKeySet: Set<Key> = new Set(checkedKeys)
  const visitedKeySet: Set<Key> = new Set()
  const extendedCheckedKey: Key[] = []
  checkedKeys.forEach(checkedKey => {
    const checkedTreeNode = treeNodeMap.get(checkedKey)
    if (checkedTreeNode !== undefined) {
      traverse(checkedTreeNode, treeNode => {
        const { key } = treeNode
        if (visitedKeySet.has(key)) return
        visitedKeySet.add(key)
        if (treeNode.disabled) {
          if (checkedKeySet.has(key)) {
            extendedCheckedKey.push(key)
          }
          return TRAVERSE_COMMAND.STOP
        } else {
          if (isExpilicitlyNotLoaded(treeNode.rawNode)) {
            throw new SubtreeUnloadedError()
          }
          extendedCheckedKey.push(key)
        }
      })
    }
  })
  return Array.from(new Set(extendedCheckedKey))
}
