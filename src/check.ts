import { 
  Key,
  TreeNode,
  TreeMateInstance,
  CheckAction
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
  treeMate: TreeMateInstance
): Key[] {
  return getExtendedCheckedKeys(
    currentCheckedKeys.concat([checkKey]),
    treeMate
  )
}

function getExtendedCheckedKeysAfterUncheck (
  uncheckKey: Key,
  currentCheckedKeys: Key[],
  treeMate: TreeMateInstance
): Key[] {
  const extendedCheckedKeys = getExtendedCheckedKeys(
    currentCheckedKeys,
    treeMate
  )
  const extendedKeySetToUncheck = new Set(getExtendedCheckedKeys(
    [ uncheckKey ],
    treeMate
  ))
  const ascendantKeySet: Set<Key> = new Set()
  const uncheckedTreeNode = treeMate.treeNodeMap.get(uncheckKey)
  if (uncheckedTreeNode) {
    let nodeCursor = uncheckedTreeNode.parent
    while (nodeCursor) {
      if (nodeCursor.disabled) break
      ascendantKeySet.add(nodeCursor.key)
      nodeCursor = nodeCursor.parent
    }
    return extendedCheckedKeys.filter(
      checkedKey => (
        !extendedKeySetToUncheck.has(checkedKey) &&
        !ascendantKeySet.has(checkedKey)
      )
    )
  } else {
    return extendedCheckedKeys
  }
}

export function getCheckedKeys (
  checkedKeys: Key[],
  action: CheckAction,
  treeMate: TreeMateInstance
): {
  checkedKeys: Key[],
  indeterminateKeys: Key[]
} {
  const { levelTreeNodeMap } = treeMate
  let extendedCheckedKeys: Key[]

  switch (action.type) {
    case 'check':
      extendedCheckedKeys = getExtendedCheckedKeysAfterCheck(
        action.key,
        checkedKeys,
        treeMate
      )
      break
    case 'uncheck':
      extendedCheckedKeys = getExtendedCheckedKeysAfterUncheck(
        action.key,
        checkedKeys,
        treeMate
      )
      console.log({ extendedCheckedKeys })
      break
    case 'none':
      extendedCheckedKeys = getExtendedCheckedKeys(
        checkedKeys,
        treeMate
      )
      break
  }

  const syntheticCheckedKeySet: Set<Key> = new Set(extendedCheckedKeys)
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
          return TraverseCommand.STOP
        } else {
          extendedCheckedKey.push(key)
        }
      })
    }
  })
  return Array.from(new Set(extendedCheckedKey))
}