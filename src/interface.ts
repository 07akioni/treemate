import {
  getCheckedKeys
} from './check'

export type Key = string | number

export interface RawNode {
  key: Key
  children?: RawNode[]
  isLeaf?: boolean
  disabled?: boolean,
  [key: string]: any
}

export interface TreeNode {
  key: Key,
  rawNode: RawNode,
  level: number
  index: number
  isFirstChild: boolean
  isLastChild: boolean
  parent: TreeNode | null
  isLeaf: boolean
  disabled: boolean
  children?: TreeNode[]
}

export type TreeNodeMap = Map<Key, TreeNode>

export type LevelTreeNodeMap = Map<number, TreeNode[]>

export type MergedKeys = {
  checkedKeys: Key[],
  indeterminateKeys: Key[]
}

export type TreeMateOptions = {
  async?: boolean
}

export interface TreeMateInstance {
  treeNodes: TreeNode[],
  treeNodeMap: TreeNodeMap,
  levelTreeNodeMap: LevelTreeNodeMap,
  getCheckedKeys: (checkedKeys: Key[]) => MergedKeys
}
