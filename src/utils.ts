import {
  TreeNode,
  RawNode,
  CheckResult,
  Key
} from '@/interface'

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

export function unwrapResult (result: CheckResult | Key[]): Key[] {
  if (Array.isArray(result)) return result
  return result.checkedKeys
}
