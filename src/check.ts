import { 
  Key,
  TreeNode,
  TreeNodeMap,
  LevelTreeNodeMap
} from './interface'

function traverse (
  treeNode: TreeNode,
  callback: (treeNode: TreeNode) => any,
) {
  callback(treeNode)
  if (treeNode.children !== undefined && !treeNode.disabled) {
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

function getCheckedKeys (
  checkedKeys: Key[],
  levelTreeNodeMap: LevelTreeNodeMap
) {
  const syntheticCheckedKeySet = new Set()
  const syntheticIndeterminateKeySet = new Set()
  const checkedKeySet = new Set(checkedKeys)
  const maxLevel = Math.max.apply(
    null,
    Array.from(levelTreeNodeMap.keys())
  )
  for (let level = maxLevel; level >= 0; level -= 1) {
    const levelTreeNodes = levelTreeNodeMap.get(level)!
    for (const levelTreeNode of levelTreeNodes) {
      const levelTreeNodeKey = levelTreeNode.key
      if (levelTreeNode.isLeaf) {
        if (checkedKeySet.has(levelTreeNodeKey)) {
          syntheticCheckedKeySet.add(levelTreeNodeKey)
        }
      } else {
        let fullyChecked = true
        let partialChecked = false
        for (const childNode of levelTreeNode.children!) {
          const childKey = childNode.key
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

function getExtendedCheckedKeys (
  checkedKeys: Key[],
  TreeNodeMap: TreeNodeMap
): Key[] {
  const visitedKeySet: Set<Key> = new Set()
  const extendedCheckedKey: Key[] = []
  checkedKeys.forEach(checkedKey => {
    const checkedTreeNode = TreeNodeMap.get(checkedKey)
    if (checkedTreeNode !== undefined) {
      traverse(checkedTreeNode, treeNode => {
        if (visitedKeySet.has(treeNode.key)) return
        visitedKeySet.add(treeNode.key)
        extendedCheckedKey.push(treeNode.key)
      })
    }
  })
  return Array.from(new Set(extendedCheckedKey))
}