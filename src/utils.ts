import {
  TreeNode,
  RawNode,
  InputMergedKeys,
  Key,
  GetNonLeafKeysOptions
} from './interface'

export function toArray<T> (arg: T): T extends any[] ? T : T[] {
  if (Array.isArray(arg)) return arg as any
  return [arg] as any
}

// Do not use enum for lint plugin has error
export const TRAVERSE_COMMAND = {
  STOP: 'STOP'
}

export function traverse (
  treeNode: TreeNode,
  callback: (treeNode: TreeNode) => any
): void {
  const command = callback(treeNode)
  if (treeNode.children !== undefined && command !== TRAVERSE_COMMAND.STOP) {
    treeNode.children.forEach((childNode) => traverse(childNode, callback))
  }
}

export function getNonLeafKeys (
  treeNodes: TreeNode[],
  options: GetNonLeafKeysOptions = {}
): Key[] {
  const { preserveGroup = false } = options
  const keys: Key[] = []
  const cb = preserveGroup
    ? (node: TreeNode) => {
      if (!node.isLeaf) {
        keys.push(node.key)
        traverse(node.children as TreeNode[])
      }
    }
    : (node: TreeNode) => {
      if (!node.isLeaf) {
        if (!node.isGroup) keys.push(node.key)
        traverse(node.children as TreeNode[])
      }
    }
  function traverse (nodes: TreeNode[]): void {
    nodes.forEach(cb)
  }
  traverse(treeNodes)
  return keys
}

export function isLeaf (rawNode: RawNode): boolean {
  const { isLeaf } = rawNode
  if (isLeaf !== undefined) return isLeaf
  else if (rawNode.children === undefined) return true
  return false
}

export function isShallowLoaded (rawNode: RawNode): boolean {
  const { isLeaf, children } = rawNode
  if (isLeaf === false && children === undefined) return false
  return true
}

export function isDisabled (rawNode: RawNode): boolean {
  return rawNode.disabled === true
}

export function isExpilicitlyNotLoaded (rawNode: RawNode): boolean {
  return rawNode.isLeaf === false && rawNode.children === undefined
}

export function isNodeInvalid (rawNode: RawNode): boolean {
  return rawNode.isLeaf === true && rawNode.children !== undefined
}

export function unwrapCheckedKeys (
  result?: InputMergedKeys | Key[] | null
): Key[] {
  if (result === undefined || result === null) return []
  if (Array.isArray(result)) return result
  return result.checkedKeys ?? []
}

export function unwrapIndeterminateKeys (
  result?: InputMergedKeys | Key[] | null
): Key[] {
  if (result === undefined || result === null || Array.isArray(result)) {
    return []
  }
  return result.indeterminateKeys ?? []
}

export function merge (originalKeys: Key[], keysToAdd: Key[]): Key[] {
  const set = new Set(originalKeys)
  keysToAdd.forEach((key) => {
    if (!set.has(key)) {
      set.add(key)
    }
  })
  return Array.from(set)
}

export function minus (originalKeys: Key[], keysToRemove: Key[]): Key[] {
  const set = new Set(originalKeys)
  keysToRemove.forEach((key) => {
    if (set.has(key)) {
      set.delete(key)
    }
  })
  return Array.from(set)
}

export function isGroup (rawNode: RawNode): boolean {
  return rawNode?.type === 'group'
}
