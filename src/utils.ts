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

export function traverseWithCb<R, G, I> (
  treeNode: TreeNode<R, G, I>,
  callback: (treeNode: TreeNode<R, G, I>) => any
): void {
  const command = callback(treeNode)
  if (treeNode.children !== undefined && command !== TRAVERSE_COMMAND.STOP) {
    treeNode.children.forEach((childNode) => traverseWithCb(childNode, callback))
  }
}

export function getNonLeafKeys<R, G, I> (
  treeNodes: Array<TreeNode<R, G, I>>,
  options: GetNonLeafKeysOptions = {}
): Key[] {
  const { preserveGroup = false } = options
  const keys: Key[] = []
  const cb = preserveGroup
    ? (node: TreeNode<R, G, I>) => {
      if (!node.isLeaf) {
        keys.push(node.key)
        traverse(node.children as Array<TreeNode<R, G, I>>)
      }
    }
    : (node: TreeNode<R, G, I>) => {
      if (!node.isLeaf) {
        if (!node.isGroup) keys.push(node.key)
        traverse(node.children as Array<TreeNode<R, G, I>>)
      }
    }
  function traverse (nodes: Array<TreeNode<R, G, I>>): void {
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

export function defaultGetChildren<T> (
  node: unknown
): T[] | undefined {
  return (node as any).children
}

export function defaultGetKey (
  node: unknown
): Key {
  return (node as any).key
}

export function isIgnored (): boolean {
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

export type IndexGetter = (key: Key) => number | null

export function createIndexGetter<R, G, I> (
  treeNodes: Array<TreeNode<R, G, I>>
): IndexGetter {
  const map = new Map<Key, number>()
  treeNodes.forEach((treeNode, i) => {
    map.set(treeNode.key, i)
  })
  return (key: Key) => map.get(key) ?? null
}
