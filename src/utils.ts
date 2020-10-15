import {
  TreeNode,
  RawNode,
  CheckState,
  Key
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
    treeNode.children.forEach(childNode => traverse(childNode, callback))
  }
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

export function unwrapResult (result?: CheckState | Key[] | null): Key[] | null {
  if (result === undefined || result === null) return null
  if (Array.isArray(result)) return result
  return result.checkedKeys
}

export function isNullish<T> (value: T): T extends null ? true : T extends undefined ? true : false {
  return (value === null || value === undefined) as any
}

export function merge (originalKeys: Key[], keysToAdd: Key[]): Key[] {
  const set = new Set(originalKeys)
  keysToAdd.forEach(key => {
    if (!set.has(key)) {
      set.add(key)
    }
  })
  return Array.from(set)
}

export function minus (originalKeys: Key[], keysToRemove: Key[]): Key[] {
  const set = new Set(originalKeys)
  keysToRemove.forEach(key => {
    if (set.has(key)) {
      set.delete(key)
    }
  })
  return Array.from(set)
}
