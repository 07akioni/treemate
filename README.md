# treemate · [![Coverage Status](https://coveralls.io/repos/github/07akioni/treemate/badge.svg)](https://coveralls.io/github/07akioni/treemate)

[中文](README.zh-CN.md) | English

Help you manipulate tree data structure for user interface. (Can be used in Tree, Select, Dropdown, Table, Menu components and ...)

1. check nodes in the tree
2. move along tree nodes
3. get flattened nodes
4. get node by key
5. get path of nodes
6. support group node
7. meta info of nodes
8. ...

## Installation
```bash
npm install --save treemate
```

## Basic Usage
```js
import { createTreeMate } from 'treemate'

const data = [
  // non-leaf node
  {
    key: 1,
    children: [
      {
        key: 2
      }
    ]
  },
  // leaf node
  {
    key: 3,
  },
  // group node
  {
    key: 4,
    type: 'group',
    children: [
      {
        key: 5
      }
    ]
  }
]

const treeMate = createTreeMate(data)
const treeMateNode = treeMate.getNode(1)
```

## API
### `createTreeMate`
#### `createTreeMate(nodes: RawNode[], options): TreeMate`
Create a `TreeMate` instance.

`nodes` is a array. Every node looks like
```ts
interface RawNode {
  key?: Key
  children?: RawNode[]
  isLeaf?: boolean // Need not to fill if not in async mode
  disabled?: boolean
  [key: string]: any
}
```

`options` looks like
```ts
interface TreeMateOptions {
  getDisabled?: (node: RawNode) => boolean
  getKey?: (node: RawNode) => Key
}
```
`getDisabled` is used to determine the `disabled` status of a node. `getKey` is used to generate the key of a node inside `TreeMate`.

### `TreeMate`
#### `treeNodes`
Corresponding `TreeMateNode` Array of original data. The tree structure is identical to the original data.
#### `treeNodeMap`
A map of `key` to tree node.
#### `flattenedNodes`
The flattened nodes of the tree.
#### `getNode(key)`
Use key to get tree node. Returns `null` if not exists.
#### `getCheckedKeys(checkedKeys, options?)`
Get checked status of the tree.

Param `checkedKeys` has two forms:
```ts
Key[] // 1. currently checked keys

// 2. merged checked status
interface InputMergedKeys {
  checkedKeys?: Key[] | null
  indeterminateKeys?: Key[] | null // 半选
}

// can also be
null | undefined
// at least it won't throw an error
```
Param `options` looks like
```ts
interface CheckOptions {
  cascade?: boolean // cascade check status, default is true
  leafOnly?: boolean // whether only allow leaf node being checked, default is false
}
```
Return value looks like
```ts
interface MergedKeys {
  checkedKeys: Key[]
  indeterminateKeys: Key[] // half checked
}
```
#### `check(keysToCheck, checkedKeys, options)`
Get checked status of the tree after some nodes are checked.

`keysToCheck` could be `Key | Key[] | null | undefined`。

For `checkedKeys`, `options` and return value, see `getCheckedKeys(checkedKeys, options?)`。
#### `uncheck(keysToUncheck, checkedKeys, options)`
Get checked status of the tree after some nodes are unchecked.

`keysToCheck` could be `Key | Key[] | null | undefined`。

For `checkedKeys`, `options` and return value, see `getCheckedKeys(checkedKeys, options?)`。
#### `getPath(key)`
Get the path from root to the node corresponding to the `key`. The return value looks like
```ts
interface MergedPath {
  keyPath: Key[],
  treeNodePath: TreeMateNode[],
  treeNode: TreeMateNode | null
}
```
The `keyPath` is the `key` of the nodes in path. The `treeNodePath` is the node path. `treeNode` is the `TreeMateNode` corresponding to the `key`.
#### `getFirstAvailableNode()`
Get the first not `disabled` `TreeMateNode` of the tree. In the traverse process, the `group` node itself will be dismissed. If node doesn't exist, return `null`.
#### `getPrev(key, options)`
Get the first previous not `disabled` sibling `TreeMateNode` of the `key`'s corresponding node. In the traverse process, the `group` node itself will be dismissed. If node doesn't exist, return `null`.

`options` look like `{ loop?: boolean }`. By default, `loop` is `false`, it won't loop when touches the last node.
#### `getNext(key, options)`
Get the first next not `disabled` sibling `TreeMateNode` of the `key`'s corresponding node. In the traverse process, the `group` node itself will be dismissed. If node doesn't exist, return `null`.

`options` look like `{ loop?: boolean }`. By default, `loop` is `false`, it won't loop when touches the last node.
#### `getParent(key)`
Get the parent node of the `key`'s corresponding node. In the traverse process, the `group` node itself will be dismissed. If node doesn't exist, return `null`.
#### `getChild(key)`
Get the first not `diabled` child node of the `key`'s corresponding node. In the traverse process, the `group` node itself will be dismissed. If node doesn't exist, return `null`.

### `TreeMateNode`
#### `rawNode`
Corresponding original data node for `TreeMateNode`.
#### `level`
The level of the node, which starts from 0.
#### `index`
`index` of node itself.
#### `fIndex`
`index` inside `flattenedNodes`.
#### `parent`
Parent `TreeMateNode` of the node. It's `null` if not exists.
#### `isLeaf`
Whether node is leaf node.
#### `isGroup`
Whether node is group node.
#### `isShallowLoaded`
Whether node's direct child node is loaded.
#### `disabled`
Whether the node is disabled.
#### `siblings`
Sibling nodes array of the node. It's a `TreeMateNode` Array.
#### `children`
Child nodes array of the node. It's a `TreeMateNode` Array.
#### `getPrev(options?)`
Get the first previous not `disabled` sibling `TreeMateNode`. In the traverse process, the `group` node itself will be dismissed. If node doesn't exist, return `null`.

`options` look like `{ loop?: boolean }`. By default, `loop` is `false`, it won't loop when touches the last node.
#### `getNext(options?)`
Get the first next not `disabled` sibling `TreeMateNode`. In the traverse process, the `group` node itself will be dismissed. If node doesn't exist, return `null`.

`options` look like `{ loop?: boolean }`. By default, `loop` is `false`, it won't loop when touches the last node.
#### `getParent()`
Get the parent node of `TreeMateNode`. In the traverse process, the `group` node itself will be dismissed. If node doesn't exist, return `null`.
#### `getChild()`
Get the first not `disabled` child `TreeMateNode`. In the traverse process, the `group` node itself will be dismissed. If node doesn't exist, return `null`.
