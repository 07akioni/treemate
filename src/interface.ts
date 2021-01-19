export type Key = string | number

export interface RawNode {
  key?: Key
  children?: RawNode[]
  isLeaf?: boolean
  disabled?: boolean
  [key: string]: any
}

export interface KeyedRawNode {
  key: Key
  children?: KeyedRawNode[]
  isLeaf?: boolean
  disabled?: boolean
  [key: string]: any
}

export interface GetPrevNextOptions {
  loop?: boolean
}

export interface TreeNode<R=RawNode, G=R> {
  key: Key
  rawNode: R | G
  level: number
  index: number
  fIndex: number
  isFirstChild: boolean
  isLastChild: boolean
  parent: TreeNode<R, G> | null
  isLeaf: boolean
  isGroup: boolean
  isShallowLoaded: boolean
  disabled: boolean
  siblings: Array<TreeNode<R, G>>
  children?: Array<TreeNode<R, G>>
  getPrev: (options?: GetPrevNextOptions) => TreeNode<R> | null
  getNext: (options?: GetPrevNextOptions) => TreeNode<R> | null
  getParent: () => TreeNode<R> | null
  getChild: () => TreeNode<R> | null
}

export type TreeNodeMap<R, G> = Map<Key, TreeNode<R, G>>

export type LevelTreeNodeMap<R, G> = Map<number, Array<TreeNode<R, G>>>

export interface MergedKeys {
  checkedKeys: Key[]
  indeterminateKeys: Key[]
}

export interface TreeMateOptions<R, G> {
  getKey?: (node: R | G) => Key
  getDisabled?: (node: R | G) => boolean
  getIsGroup?: (node: R | G) => boolean
}

export interface MergedPath<R, G=R> {
  keyPath: Key[]
  treeNodePath: Array<TreeNode<R, G>>
  treeNode: TreeNode<R, G> | null
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetPathOptions<T extends boolean> {
  includeGroup?: T
}

export interface InputMergedKeys {
  checkedKeys?: Key[] | null
  indeterminateKeys?: Key[] | null
}

export interface CheckOptions {
  cascade?: boolean
  leafOnly?: boolean
}

type KeyToNode<R, G> = <T extends Key | null | undefined>(key: T) => T extends (null | undefined) ? null : (TreeNode<R, G> | null)
type KeyToNonGroupNode<R> = <T extends Key | null | undefined>(key: T) => T extends (null | undefined) ? null : (TreeNode<R, R> | null)
type KeyToNonGroupNodeWithOptions<R> = <T extends Key | null | undefined>(key: T, options?: GetPrevNextOptions) => T extends (null | undefined) ? null : (TreeNode<R, R> | null)

export interface GetNonLeafKeysOptions {
  preserveGroup?: boolean
}

export interface TreeMate<R=RawNode, G=R> {
  treeNodes: Array<TreeNode<R, G>>
  treeNodeMap: TreeNodeMap<R, G>
  levelTreeNodeMap: LevelTreeNodeMap<R, G>
  flattenedNodes: Array<TreeNode<R, G>>
  getNode: KeyToNode<R, G>
  getCheckedKeys: (
    checkedKeys: Key[] | InputMergedKeys | null | undefined,
    options?: CheckOptions
  ) => MergedKeys
  check: (
    keysToCheck: Key | Key[] | null | undefined,
    checkedKeys: Key[] | InputMergedKeys,
    options?: CheckOptions
  ) => MergedKeys
  uncheck: (
    keysToUncheck: Key | Key[] | null | undefined,
    checkedKeys: Key[] | InputMergedKeys,
    options?: CheckOptions
  ) => MergedKeys
  getPath: <T extends boolean>(key: Key | null | undefined, options?: GetPathOptions<T>) => T extends true ? MergedPath<R, G> : MergedPath<R, R>
  getFirstAvailableNode: () => TreeNode<R, R> | null
  getNonLeafKeys: (options?: GetNonLeafKeysOptions) => Key[]
  getPrev: KeyToNonGroupNodeWithOptions<R>
  getNext: KeyToNonGroupNodeWithOptions<R>
  getParent: KeyToNonGroupNode<R>
  getChild: KeyToNonGroupNode<R>
}
