# treemate · [![Coverage Status](https://coveralls.io/repos/github/07akioni/treemate/badge.svg)](https://coveralls.io/github/07akioni/treemate)

Help people who want to write a tree component.

## TODO
- [x] checked keys & indeterminate keys
- [x] basic test
- [x] lint
- [x] check action & uncheck action
  - [x] full test
  - [x] batch check & batch uncheck
    - [x] feature
    - [x] API cleaning
    - [x] test
  - [x] functional disabled prop
- [x] <del>async patches</del> support non-complete-data
  - [x] support check & uncheck action on partial complete tree
    - [x] implemented
    - [x] well tested
  - [x] throw error on non-complete tree
- [ ] getIsGroup

## API
```ts
function createTreeMate(nodes: RawNode[], options: TreeMateOptions): TreeMate

export interface TreeMateOptions {
  getDisabled?: (node: RawNode) => boolean
  getKey?: (node: RawNode) => Key
}

export interface TreeMateInstance {
  treeNodes: TreeNode[]
  treeNodeMap: TreeNodeMap
  levelTreeNodeMap: LevelTreeNodeMap
  flattenedNodes: TreeNode[]
  getNode: KeyToNode
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
  getPath: (key: Key, options?: GetPathOptions) => MergedPath
  getFirstAvailableNode: () => TreeNode | null
  getPrev: KeyToNode
  getNext: KeyToNode
  getParent: KeyToNode
  getChild: KeyToNode
}

interface CheckOptions {
  cascade: boolean
  leafOnly: boolean
}

interface MergedKeys {
  checkedKeys: Key[],
  indeterminateKeys: Key[]
}

interface TreeNode {
  key: Key
  rawNode: RawNode
  level: number
  index: number
  fIndex: number
  isFirstChild: boolean
  isLastChild: boolean
  parent: TreeNode | null
  isLeaf: boolean
  isGroup: boolean
  isShallowLoaded: boolean
  disabled: boolean
  siblings: TreeNode[]
  children?: TreeNode[]
  getPrev: (options?: GetPrevNextOptions) => TreeNode | null
  getNext: (options?: GetPrevNextOptions) => TreeNode | null
  getParent: () => TreeNode | null
  getChild: () => TreeNode | null
}
```