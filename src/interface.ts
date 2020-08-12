export type Key = string | number

export interface RawNode {
  key: Key
  children?: RawNode[]
  isLeaf?: boolean
  disabled?: boolean
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
