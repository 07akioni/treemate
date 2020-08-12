export type Key = string | number

export interface RawNode {
  key: Key
  children?: RawNode[]
  isLeaf?: boolean
}

export interface TreeNode {
  key: Key,
  rawNode: RawNode,
  children?: TreeNode[] | null
  isLeaf?: boolean
  level: number
  index: number
  isFirstChild: boolean
  isLastChild: boolean
  parent: TreeNode | null
}

export type TreeNodeMap = Map<Key, TreeNode>
