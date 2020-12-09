# treemate · [![Coverage Status](https://coveralls.io/repos/github/07akioni/treemate/badge.svg)](https://coveralls.io/github/07akioni/treemate)

中文 | [English](README.md)

帮助人们操作树形数据结构（可以用于 Tree，Select，Dropdown，Table，Menu 等组件）。

1. 树形结构勾选
2. 在不同节点间移动
3. 获取展平节点
4. 通过 key 获取节点
5. 获取节点路径
6. 支持 Group 节点
7. 各种节点的元信息
8. ...

## 安装
```bash
npm install --save treemate
```

## 基本用法
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
#### `createTreeMate(nodes: RawNode[], options?): TreeMate`
创建一个 `TreeMate` 实例。

`nodes` 为一个数组，每个节点形如
```ts
interface RawNode {
  key?: Key
  children?: RawNode[]
  isLeaf?: boolean // 非异步状态不需要填写
  disabled?: boolean
  [key: string]: any
}
```

`options` 形如
```ts
interface TreeMateOptions {
  getDisabled?: (node: RawNode) => boolean
  getKey?: (node: RawNode) => Key
}
```
`getDisabled` 被用来判断一个节点是否为 `disabled`，`getKey` 被用来生成一个节点在 `TreeMate` 内部的 key。

### `TreeMate`
#### `treeNodes`
原数据对应的 `TreeMateNode` 数组，结构完全对应于原数据。
#### `treeNodeMap`
`key` 到节点的 Map。
#### `flattenedNodes`
被展为一维的树节点。
#### `getNode(key)`
使用 key 获取树节点，不存在时返回 `null`。
#### `getCheckedKeys(checkedKeys, options?)`
获取树的勾选状态。

参数 `checkedKeys` 有两种输入模式:
```ts
Key[] // 1. 当前选中的节点

// 2. 或者复合状态
interface InputMergedKeys {
  checkedKeys?: Key[] | null
  indeterminateKeys?: Key[] | null // 半选
}

// 也可以为
null | undefined
// 至少不会报错
```
参数 `options` 形如：
```ts
interface CheckOptions {
  cascade?: boolean // 关联全选节点与半选节点，默认为 true
  leafOnly?: boolean // 是否只允许全选叶节点，默认为 false
}
```
返回值形如
```ts
interface MergedKeys {
  checkedKeys: Key[]
  indeterminateKeys: Key[] // 半选
}
```
#### `check(keysToCheck, checkedKeys, options?)`
获取树在勾选一些节点后新的勾选状态。

`keysToCheck` 可以为 `Key | Key[] | null | undefined`。

`checkedKeys`, `options` 和返回值参考 `getCheckedKeys(checkedKeys, options?)`。
#### `uncheck(keysToUncheck, checkedKeys, options?)`
获取树在取消勾选一些节点后新的勾选状态。

`keysToCheck` 可以为 `Key | Key[] | null | undefined`。

`checkedKeys`, `options` 和返回值参考 `getCheckedKeys(checkedKeys, options?)`。
#### `getPath(key)`
获取从根到该 `key` 对应节点的路径。返回值形如
```ts
interface MergedPath {
  keyPath: Key[],
  treeNodePath: TreeMateNode[],
  treeNode: TreeMateNode | null
}
```
其中 `keyPath` 为路径中各个节点的 `key`。其中 `treeNodePath` 为节点路径。`treeNode` 该 `key` 对应的 `TreeMateNode`。
#### `getFirstAvailableNode()`
获取整个树第一个非 `disabled` 的 `TreeMateNode`，寻找过程中 `group` 节点自身会被忽略，不存在时返回 `null`。
#### `getPrev(key, options?)`
获取该 `key` 对应节点的前一个非 `disabled` 的 `TreeMateNode`，寻找过程中 `group` 节点自身会被忽略，不存在时返回 `null`。

`options` 形如 `{ loop?: boolean }`，默认 `loop` 为 `false`，不会循环寻找。
#### `getNext(key, options?)`
获取该 `key` 对应节点的后一个非 `disabled` 的 `TreeMateNode`，寻找过程中 `group` 节点自身会被忽略，不存在时返回 `null`。

`options` 形如 `{ loop?: boolean }`，默认 `loop` 为 `false`，不会循环寻找。
#### `getParent(key)`
获取该 `key` 对应节点的父级 `TreeMateNode`，寻找过程中 `group` 节点自身会被忽略，不存在时返回 `null`。
#### `getChild(key)`
获取该 `key` 对应节点第一个非 `disabled` 的 `TreeMateNode`，寻找过程中 `group` 节点自身会被忽略，不存在时返回 `null`。

### `TreeMateNode`
#### `rawNode`
`TreeMateNode` 对应的原始数据节点。
#### `level`
节点的层级，从 0 开始。
#### `index`
节点自身的 `index`。
#### `fIndex`
在展平节点 `flattenedNodes` 中节点的 `index`。
#### `parent`
节点的父级 `TreeMateNode`，不存在时为 `null`。
#### `isLeaf`
是否为叶节点。
#### `isGroup`
是否为 Group 节点。
#### `isShallowLoaded`
是否直接子节点都已经被加载。
#### `disabled`
是否为被禁用的节点。
#### `siblings`
兄弟节点数组，为 `TreeMateNode` 数组。
#### `children`
子节点数组，为 `TreeMateNode` 数组。
#### `getPrev(options?)`
获取该节点的前一个非 `disabled` 的 `TreeMateNode`，寻找过程中 `group` 节点自身会被忽略，不存在时返回 `null`。

`options` 形如 `{ loop?: boolean }`，默认 `loop` 为 `false`，不会循环寻找。
#### `getNext(options?)`
获取该节点的后一个非 `disabled` 的 `TreeMateNode`，寻找过程中 `group` 节点自身会被忽略，不存在时返回 `null`。

`options` 形如 `{ loop?: boolean }`，默认 `loop` 为 `false`，不会循环寻找。
#### `getParent()`
获取该节点的父级 `TreeMateNode`，寻找过程中 `group` 节点自身会被忽略，不存在时返回 `null`。
#### `getChild()`
获取该节点第一个非 `disabled` 的子 `TreeMateNode`，寻找过程中 `group` 节点自身会被忽略，不存在时返回 `null`。
