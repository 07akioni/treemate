import { 
  Key,
  TreeNode,
  TreeNodeMap,
  LevelTreeNodeMap
} from './interface'

enum TraverseCommand {
  STOP
}

function traverse (
  treeNode: TreeNode,
  callback: (treeNode: TreeNode) => any,
) {
  const command = callback(treeNode)
  if (treeNode.children !== undefined && command !== TraverseCommand.STOP) {
    treeNode.children.forEach(childNode => traverse(childNode, callback))
  }
}

function getExtendedCheckedKeysAfterCheck (
  checkKey: Key,
  currentCheckedKeys: Key[],
  TreeNodeMap: TreeNodeMap
): Key[] {
  return getExtendedCheckedKeys(
    currentCheckedKeys.concat([checkKey]),
    TreeNodeMap
  )
}

function getExtendedCheckedKeysAfterUncheck (
  uncheckKey: Key,
  currentCheckedKeys: Key[],
  TreeNodeMap: TreeNodeMap
): Key[] {
  const extendedCheckedKeys = getExtendedCheckedKeys(
    currentCheckedKeys,
    TreeNodeMap
  )
  const extendedKeySetToUncheck = new Set(getExtendedCheckedKeys(
    [ uncheckKey ],
    TreeNodeMap
  ))
  return extendedCheckedKeys.filter(
    checkedKey => !extendedKeySetToUncheck.has(checkedKey)
  )
}

export function getCheckedKeys (
  checkedKeys: Key[],
  levelTreeNodeMap: LevelTreeNodeMap
): {
  checkedKeys: Key[],
  indeterminateKeys: Key[]
} {
  const syntheticCheckedKeySet: Set<Key> = new Set(checkedKeys)
  const syntheticIndeterminateKeySet: Set<Key> = new Set()
  const maxLevel = Math.max.apply(
    null,
    Array.from(levelTreeNodeMap.keys())
  )
  for (let level = maxLevel; level >= 0; level -= 1) {
    const levelTreeNodes = levelTreeNodeMap.get(level)!
    for (const levelTreeNode of levelTreeNodes) {
      if (levelTreeNode.disabled) {
        continue
      }
      const levelTreeNodeKey = levelTreeNode.key
      if (!levelTreeNode.isLeaf) {
        let fullyChecked = true
        let partialChecked = false
        for (const childNode of levelTreeNode.children!) {
          const childKey = childNode.key
          if (childNode.disabled) continue
          if (syntheticCheckedKeySet.has(childKey)) {
            partialChecked = true
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
  TreeNodeMap: TreeNodeMap
): Key[] {
  const checkedKeySet: Set<Key> = new Set(checkedKeys)
  const visitedKeySet: Set<Key> = new Set()
  const extendedCheckedKey: Key[] = []
  checkedKeys.forEach(checkedKey => {
    const checkedTreeNode = TreeNodeMap.get(checkedKey)
    if (checkedTreeNode !== undefined) {
      traverse(checkedTreeNode, treeNode => {
        const { key } = treeNode
        if (visitedKeySet.has(key)) return
        visitedKeySet.add(key)
        if (treeNode.disabled) {
          if (checkedKeySet.has(key)) {
            extendedCheckedKey.push(key)
          }
          return TraverseCommand.STOP
        } else {
          extendedCheckedKey.push(key)
        }
      })
    }
  })
  return Array.from(new Set(extendedCheckedKey))
}