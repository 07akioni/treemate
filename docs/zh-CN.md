# treemate · [![Coverage Status](https://coveralls.io/repos/github/07akioni/treemate/badge.svg)](https://coveralls.io/github/07akioni/treemate)

组件开发中树形数据结构的一站式解决方案。

帮助人们操作树形数据结构（可以用于 Tree，Select，Dropdown，Table，Menu 等组件）。

1. 勾选节点，取消勾选节点
2. 展开节点，折叠节点
3. 在节点中移动
4. 获取打平为数组的树
5. 查询节点
6. 支持 group 节点（聚集了一些同层级节点的节点）
7. 支持 ignored 节点（在移动时忽略）
8. 节点的元信息
9. 获取到对应的原始数据引用
10. 不完整数据中的勾选
11. ...

## 安装

```bash
npm i -D treemate
```

## 基本概念

在开始之前，我强烈建议阅读这一节，了解一些 treemate 的基本概念。

### 普通节点，Group 节点和 Ignored 节点

在 treemate 中，一个树由节点（可选的 group 节点和可选的 ingored 节点）组成。

一个普通节点包括一个 key，可能还包含一个 children 属性，里面是它的子节点。

#### 普通节点

```
Node {
  key,
  children?
}
```

#### Group 节点

如果你不需要 Group 节点，可以跨过这一节。

A group node contains a key, a type prop with value `group` and a children of its child node (can be a group node any more).

```
GroupNode {
  key,
  type: 'group',
  children
}
```

The group node itself will be ignored when moving along the nodes, and the children of the group node is view as the same level of the group node.

For eaxample, in the following tree, the group child 2 will be viewed as node 1's next node. node 2 will be viewed as group child 2's next node.

```
- node 1
- group node 1
  - group child 1
  - group child 2
- node 2
```

#### Ignored Node

Some time's you may want to put some render only nodes in the tree. For example:

```
- node 1
- divider (render only)
- node 2
```

In data aspect, the divider node is meaning less. You can make it a ignored node. The ignored node will be ignored when moving along the nodes. (node 2 will be view the next node as node 1.) Also, `getNode` method won't return the ignored node.

An ignored node should also contains a key (for modern frontend framework to do efficient diff)

```
IgnoredNode {
  key,
  type: 'ignored'
}
```

## Usage

### Create a Treemate

`createTreeMate` method accepts a array of node as data. It returns a treemate instance.

In javascript:

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
    key: 3
  },
  // ignored node
  {
    key: 4,
    type: 'ignored'
  },
  // group node
  {
    key: 5,
    type: 'group',
    children: [
      {
        key: 6
      }
    ]
  }
]

const treeMate = createTreeMate(data)
```

In typescript, the data looks amost same. However `createTreeMate` accepts 3 optional generic parameter to specify the types of node, group node and ignored node.

```ts
interface BaseNode {
  key: string | number
  children?: Array<BaseNode | GroupNode | IgnoredNode>
}

interface GroupNode {
  key: string | number
  type: 'group'
  children: Array<BaseNode | IgnoredNode>
}

interface IgnoredNode {
  key: string | number
  type: 'ignored'
}

// 1. specify all node types
const treeMate = createTreeMate<BaseNode, GroupNode, IgnoredNode>(data)

// 2. equals to createTreeMate<BaseNode, GroupNode, BaseNode>()
//    which mean no ignored node is in the data.
const treeMate = createTreeMate<BaseNode, GroupNode>(data)

// 3. equals to createTreeMate<BaseNode, BaseNode, BaseNode>()
//    which mean no ignored node and group node is in the data.
const treeMate = createTreeMate<BaseNode>(data)

// 4. without generic parameter
//    it will use a builtin node type as basic node type.
//    RawNode {
//      key: string | number
//      children?: RawNode[]
//      disabled?: boolean
//      isLeaf? boolean
//    }
//    ignored nodee and group node should be in the data.
const treeMate = createTreeMate(data)
```

### Custom `createTreeMate` Options

If you want another way to determine a way to specify if a node's key or its disabled, group, ignored status. You can pass an option when create treemate.

```ts
const treeMate = createTreeMate(data, {
  getKey: (node) => Key,
  getDisabled: (node) => boolean,
  getIsGroup: (node) => boolean,
  getIgnored: (node) => boolean
})
```

### Get a Node from Tree

Now suppose we have a treemate instance.

```ts
const tmNode = treeMate.getNode(key) // if not exist return null

// Caveat: getNode won't return group node & ignored node!
// If you do need to get them, you can use the treeNodeMap, eg:
treeMate.treeNodeMap.get(key)
```

### Props of a TreeNode

```js
TreeNode {
  // stable prop
  key,
  rawNode, // hold the ref to the original data node, can be very useful
  level, // from 0
  index, // its index in its parent node (or root array)
  siblings,
  isFirstChild,
  isLastChild,
  parent, // its parent TreeNode (not data node)
  isShallowLoaded, // use when on partial data is loaded
  isLeaf,
  isGroup,
  ignored, // boolean
  disabled, // disabled
  children?, // its child TreeNodes (not data node)
  getPrev, // method
  getNext, // method
  getParent, // method
  getChild // method
}
```

### Do Check and Uncheck in the Tree

#### `TreeMate.getCheckedKeys(checkedKeys, options?)`

Get checked status of the tree.

Node has `disabled = true` will be block cascade check's propagation.

Param `checkedKeys` has two forms:

```ts
Key[] // 1. currently checked keys

// 2. merged checked status
interface InputMergedKeys {
  checkedKeys?: Key[] | null
  indeterminateKeys?: Key[] | null // half checked
}

// it can also be
null | undefined
// viewed as an empty array
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

##### Usage

```ts
const { checkedKeys, indeterminateKeys } = treeMate.getCheckedKeys([1])
const { checkedKeys, indeterminateKeys } = treeMate.getCheckedKeys([1], {
  cascade: true
})
const { checkedKeys, indeterminateKeys } = treeMate.getCheckedKeys({
  checkedKeys: [1],
  indeterminateKeys: [2]
})
// ...
```

#### `TreeMate.check(keysToCheck, checkedKeys, options?)`

Get checked status of the tree after some nodes are checked.

`keysToCheck` could be `Key | Key[] | null | undefined`.

For `checkedKeys`, `options` and return value, see `getCheckedKeys(checkedKeys, options?)`.

#### `TreeMate.uncheck(keysToUncheck, checkedKeys, options?)`

Get checked status of the tree after some nodes are unchecked.

`keysToCheck` could be `Key | Key[] | null | undefined`.

For `checkedKeys`, `options` and return value, see `getCheckedKeys(checkedKeys, options?)`.

### Do Move in the Tree

#### `TreeMate.getPrev(key, options?)`

Get the first previous not `disabled` sibling `TreeMateNode` of the `key`'s corresponding node. In the traverse process, the `group | ignored` node itself will be dismissed. If node doesn't exist, return `null`.

`options` look like `{ loop?: boolean }`. By default, `loop` is `false`, it won't loop when touches the last node.

#### `TreeMate.getNext(key, options?)`

Get the first next not `disabled` sibling `TreeMateNode` of the `key`'s corresponding node. In the traverse process, the `group | ignored` node itself will be dismissed. If node doesn't exist, return `null`.

`options` look like `{ loop?: boolean }`. By default, `loop` is `false`, it won't loop when touches the last node.

#### `TreeMate.getParent(key)`

Get the parent node of the `key`'s corresponding node. In the traverse process, the `group` node itself will be dismissed. If node doesn't exist, return `null`.

#### `TreeMate.getChild(key)`

Get the first not `diabled` child node of the `key`'s corresponding node. In the traverse process, the `group | ignored` node itself will be dismissed. If node doesn't exist, return `null`.

#### `TreeNode.getPrev(options?)`

Get the first previous not `disabled` sibling `TreeMateNode`. In the traverse process, the `group` node itself will be dismissed. If node doesn't exist, return `null`.

`options` look like `{ loop?: boolean }`. By default, `loop` is `false`, it won't loop when touches the last node.

#### `TreeNode.getNext(options?)`

Get the first next not `disabled` sibling `TreeMateNode`. In the traverse process, the `group | ignored` node itself will be dismissed. If node doesn't exist, return `null`.

`options` look like `{ loop?: boolean }`. By default, `loop` is `false`, it won't loop when touches the last node.

#### `TreeNode.getParent()`

Get the parent node of `TreeMateNode`. In the traverse process, the `group` node itself will be dismissed. If node doesn't exist, return `null`.

#### `TreeNode.getChild()`

Get the first not `disabled` child `TreeMateNode`. In the traverse process, the `group | ignored` node itself will be dismissed. If node doesn't exist, return `null`.

### Do Expand & Collapsed on the Tree

Expand status is will influence the flattened nodes of the tree. The flattened nodes is crucial for virtual list.

#### `TreeMate.getFlattenedNodes(expandedKeys?)`

Returns the flattened tree nodes with corresponding `expandedKeys`. If `expandedKeys` is not provided, treemate will treat it as all expanded.

#### `createIndexGetter(flattenedNodes)`

Create an index getter from the flattenedNodes.

```ts
import { createIndexGetter } from 'treemate'

const getIndex = createIndexGetter(flattenedNodes)

getIndex(flattenedNodes[0].key) === 0
```

### Get Path of a Node

#### `TreeMate.getPath(key)`

Get the path from root to the node corresponding to the `key`. The return value looks like

```ts
interface MergedPath {
  keyPath: Key[]
  treeNodePath: TreeMateNode[]
  treeNode: TreeMateNode | null
}
```

The `keyPath` is the `key` of the nodes in path. The `treeNodePath` is the node path. `treeNode` is the `TreeMateNode` corresponding to the `key`.

### Get First Available Node of the Tree

Can be used to get the default pending status of a select menu.

#### `TreeMate.getFirstAvailableNode()`

Get the first not `disabled` `TreeMateNode` of the tree. In the traverse process, the `group | ignored` node itself will be dismissed. If node doesn't exist, returns `null`.

### Other Props in TreeMate Instance

#### `TreeMate.treeNodes`

Corresponding `TreeMateNode` Array of original data. The tree structure is identical to the original data.

#### `TreeMate.treeNodeMap`

A map of `key` to tree node. Contains all nodes, including `group | ignored` node.
