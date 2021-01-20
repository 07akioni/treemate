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

// R=RawNode, G=GroupNode, E=ExtraNode
export interface TreeNode<R=RawNode, G=R, E=R> {
  key: Key
  rawNode: R | G | E
  level: number
  index: number
  fIndex: number
  isFirstChild: boolean
  isLastChild: boolean
  parent: TreeNode<R, G> | null
  isLeaf: boolean
  isGroup: boolean
  ignored: boolean
  shallowLoaded: boolean
  disabled: boolean
  siblings: Array<TreeNode<R, G, E>>
  children?: Array<TreeNode<R, G, E>>
  getPrev: (options?: GetPrevNextOptions) => TreeNode<R> | null
  getNext: (options?: GetPrevNextOptions) => TreeNode<R> | null
  getParent: () => TreeNode<R> | null
  getChild: () => TreeNode<R> | null
}

export type TreeNodeMap<R, G, E> = Map<Key, TreeNode<R, G, E>>

export type LevelTreeNodeMap<R, G, E> = Map<number, Array<TreeNode<R, G, E>>>

export interface MergedKeys {
  checkedKeys: Key[]
  indeterminateKeys: Key[]
}

export interface TreeMateOptions<R, G, E> {
  getKey?: (node: R | G | E) => Key
  getDisabled?: (node: R | G | E) => boolean
  getIsGroup?: (node: R | G | E) => boolean
  getIgnored?: (node: R | G | E) => boolean
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

export interface TreeMate<R=RawNode, G=R, E=R> {
  treeNodes: Array<TreeNode<R, G, E>>
  treeNodeMap: TreeNodeMap<R, G, E>
  levelTreeNodeMap: LevelTreeNodeMap<R, G, E>
  // flattened nodes is view related, so ExtraNode should be included
  flattenedNodes: Array<TreeNode<R, G, E>>
  // I don't want ExtraNode & GroupNode to be accessed by getNode
  // TODO: add includeGroup
  getNode: KeyToNode<R, R>
  // check related methods
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
  getNonLeafKeys: (options?: GetNonLeafKeysOptions) => Key[]
  // If include group, GroupNode & RawNode will be included
  // If not include group, only RawNode will be included
  getPath: <T extends boolean>(key: Key | null | undefined, options?: GetPathOptions<T>) => T extends true ? MergedPath<R, G> : MergedPath<R>
  // In movement related methods, only RawNode can be accessed
  getFirstAvailableNode: () => TreeNode<R> | null
  getPrev: KeyToNonGroupNodeWithOptions<R>
  getNext: KeyToNonGroupNodeWithOptions<R>
  getParent: KeyToNonGroupNode<R>
  getChild: KeyToNonGroupNode<R>
}
