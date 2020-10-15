export type Key = string | number

export interface RawNode {
  key?: Key
  children?: RawNode[]
  isLeaf?: boolean
  disabled?: boolean
  [key: string]: any
}

export interface GetPrevNextOptions {
  loop?: boolean
}

export interface TreeNode {
  key: Key
  rawNode: RawNode
  level: number
  index: number
  isFirstChild: boolean
  isLastChild: boolean
  parent: TreeNode | null
  isLeaf: boolean
  isShallowLoaded: boolean
  disabled: boolean
  siblings: TreeNode[]
  children?: TreeNode[]
  getPrev: (options?: GetPrevNextOptions) => TreeNode | null
  getNext: (options?: GetPrevNextOptions) => TreeNode | null
  getParent: () => TreeNode | null
  getChild: () => TreeNode | null
}

export type TreeNodeMap = Map<Key, TreeNode>

export type LevelTreeNodeMap = Map<number, TreeNode[]>

export interface MergedKeys {
  checkedKeys: Key[]
  indeterminateKeys: Key[]
}

export interface TreeMateOptions {
  getDisabled?: (data: { parentKey: Key | null, index: number, node: RawNode}) => boolean
  getKey?: (data: { parentKey: Key | null, index: number, node: RawNode }) => Key
}

export interface MergedPath {
  keyPath: Key[]
  treeNodePath: TreeNode[]
  treeNode: TreeNode | null
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetPathOptions {
}

export interface CheckState {
  checkedKeys: Key[]
  indeterminateKeys: Key[]
}

export interface CheckOptions {
  cascade?: boolean
}

export interface TreeMateInstance {
  treeNodes: TreeNode[]
  treeNodeMap: TreeNodeMap
  levelTreeNodeMap: LevelTreeNodeMap
  getCheckedKeys: (
    checkedKeys: Key[] | CheckState | null | undefined,
    options?: CheckOptions
  ) => MergedKeys
  check: (
    keysToCheck: Key | Key[] | null | undefined,
    checkedKeys: Key[] | CheckState,
    options?: CheckOptions
  ) => MergedKeys
  uncheck: (
    keysToUncheck: Key | Key[] | null | undefined,
    checkedKeys: Key[] | CheckState,
    options?: CheckOptions
  ) => MergedKeys
  getPath: (key: Key, options?: GetPathOptions) => MergedPath
  getFirstAvailableNode: () => TreeNode | null
}
