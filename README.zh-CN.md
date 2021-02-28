<!-- 请修改 docs/zh-CN.md，项目根目录中的 index.zh-CN.md 只是一个副本 -->

# treemate · [![Coverage Status](https://coveralls.io/repos/github/07akioni/treemate/badge.svg)](https://coveralls.io/github/07akioni/treemate)

https://treemate.vercel.app/zh-CN.html

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

一个 Group 节点包含一个 key，一个名为 type 的属性，值为 `group`，还有一个 children 属性包含了它的子节点（不能包含 Group 节点）。

```
GroupNode {
  key,
  type: 'group',
  children
}
```

在不同节点的移动过程中，Group 节点自身会被忽略，Group 节点的子节点会被看作为和 Group 在同一层的节点。

例如在下面的树中，group node 2 是 node 1 的下一个节点，group child 2 的下一个节点是 node 2.

```
- node 1
- group node 1
  - group child 1
  - group child 2
- node 2
```

#### Ignored 节点

有的时候你需要一些仅需渲染的节点。例如

```
- node 1
- 分割线 (render only)
- node 2
```

在数据层面，分割线节点没有实际意义。你可以把它作为一个 Ignored 节点。这个节点在节点移动的过程中会被忽略。（node 2 会被看作 node 1 的下一个节点。）同时 `getNode` 方法也不会返回 Ignored 节点。

Ignored 节点也应该包含一个 key（为现代前端框架的 diff 过程使用）。

```
IgnoredNode {
  key,
  type: 'ignored'
}
```

## 使用方式

### 创建一个 Treemate

`createTreeMate` 方法接受一个节点的数组作为输入数据，返回一个 treemate 的实例。

在 javascript 中使用：

```js
import { createTreeMate } from 'treemate'

const data = [
  // 非叶节点
  {
    key: 1,
    children: [
      {
        key: 2
      }
    ]
  },
  // 叶节点
  {
    key: 3
  },
  // ignored 节点
  {
    key: 4,
    type: 'ignored'
  },
  // group 节点
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

在 typescript 中，data 没什么区别。但是 `createTreeMate` 接受 3 个可选的泛型参数，这些参数为普通节点、Group 节点和 Ignored 节点的类型。

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

// 1. 指名左右节点的类型
const treeMate = createTreeMate<BaseNode, GroupNode, IgnoredNode>(data)

// 2. 等价于 createTreeMate<BaseNode, GroupNode, BaseNode>()
//    也就是说在数据中不会出现 Ignored 节点
const treeMate = createTreeMate<BaseNode, GroupNode>(data)

// 3. 等价于 createTreeMate<BaseNode, BaseNode, BaseNode>()
//    也就是说 Ignored 节点和 Group 节点不会出现在数据中
const treeMate = createTreeMate<BaseNode>(data)

// 4. 不写任何泛型参数
//    它会使用一个内置的类型作为基本节点的类型
//    RawNode {
//      key: string | number
//      children?: RawNode[]
//      disabled?: boolean
//      isLeaf? boolean
//    }
//    Ignored 节点和 Group 节点不会出现在数据中
const treeMate = createTreeMate(data)
```

### 自定义 `createTreeMate` 的选项

如果希望通过其他方式来判定一个节点的 key 和 diabled、group、ignored 的状态，你可以给 create treemate 传递一个选项。

```ts
const treeMate = createTreeMate(data, {
  getKey: (node) => Key,
  getDisabled: (node) => boolean,
  getIsGroup: (node) => boolean,
  getIgnored: (node) => boolean
})
```

### 从树中获取一个节点

假设我们有一个 treemate 的实例。

```ts
const tmNode = treeMate.getNode(key) // 如果不存在该节点会返回 null

// 注意：getNode 不会返回 Group 节点和 Ignored 节点！
// 如果你需要获取这些节点，你可以使用 treeNodeMap，例如：
treeMate.treeNodeMap.get(key)
```

### TreeMateNode 树节点的属性

```js
TreeMateNode {
  key,
  rawNode, // 对于原始数据节点的引用，很可能有用
  level,   // 从 0 开始
  index,   // 它在父节点（或者根数组）中的 index
  siblings,
  isFirstChild,
  isLastChild,
  parent,          // 父树节点（不是数据节点）
  isShallowLoaded, // 在局部加载数据时会用到
  isLeaf,
  isGroup,
  ignored,     // boolean
  disabled,    // disabled
  children?,   // 它的子树节点（不是原始数据节点）
  getPrev(),   // 方法
  getNext(),   // 方法
  getParent(), // 方法
  getChild()   // 方法
}
```

### 在树中勾选节点或取消勾选节点

#### `TreeMate.getCheckedKeys(checkedKeys, options?)`

获取树的勾选状态。

`disabled = true` 的节点会阻止关联勾选的检查传播。

参数 `checkedKeys` 有两种形式：

```ts
Key[] // 1. 当前勾选的节点

// 2. 当前的综合勾选状态
interface InputMergedKeys {
  checkedKeys?: Key[] | null
  indeterminateKeys?: Key[] | null // half checked
}

// 也可以是
null | undefined
// 会被当作空数组看待
```

选项 `options` 形如：

```ts
interface CheckOptions {
  cascade?: boolean // 是否关联勾选，子级勾选会影响父级状态，默认为 true
  leafOnly?: boolean // 是否只允许叶节点被勾选，默认为 false
}
```

返回值形如：

```ts
interface MergedKeys {
  checkedKeys: Key[]
  indeterminateKeys: Key[] // 半选
}
```

##### 使用举例

```ts
const { checkedKeys, indeterminateKeys } = treeMate.getCheckedKeys([1])
const { checkedKeys, indeterminateKeys } = treeMate.getCheckedKeys([1], {
  cascade: false
})
const { checkedKeys, indeterminateKeys } = treeMate.getCheckedKeys({
  checkedKeys: [1],
  indeterminateKeys: [2]
})
// ...
```

#### `TreeMate.check(keysToCheck, checkedKeys, options?)`

获取树在勾选一些节点后新的勾选状态。

`keysToCheck` 可以为 `Key | Key[] | null | undefined`。

`checkedKeys`，`options` 和返回值参考 `getCheckedKeys(checkedKeys, options?)`。

#### `TreeMate.uncheck(keysToUncheck, checkedKeys, options?)`

获取树在取消勾选一些节点后新的勾选状态。

`keysToCheck` 可以为 `Key | Key[] | null | undefined`。

`checkedKeys`, `options` 和返回值参考 `getCheckedKeys(checkedKeys, options?)`。

### 在树中移动

#### `TreeMate.getPrev(key, options?)`

获取该 `key` 对应节点的前一个非 `disabled` 的 `TreeMateNode`，寻找过程中 `group | ignored` 节点自身会被忽略，不存在时返回 `null`。

`options` 形如 `{ loop?: boolean }`，默认 `loop` 为 `false`，不会循环寻找。

#### `TreeMate.getNext(key, options?)`

获取该 `key` 对应节点的后一个非 `disabled` 的 `TreeMateNode`，寻找过程中 `group | ignored` 节点自身会被忽略，不存在时返回 `null`。

`options` 形如 `{ loop?: boolean }`，默认 `loop` 为 `false`，不会循环寻找。

#### `TreeMate.getParent(key)`

获取该 `key` 对应节点的父级 `TreeMateNode`，寻找过程中 `group` 节点自身会被忽略，不存在时返回 `null`。

#### `TreeMate.getChild(key)`

获取该 `key` 对应节点第一个非 `disabled` 的 `TreeMateNode`，寻找过程中 `group | ignored` 节点自身会被忽略，不存在时返回 `null`。

#### `TreeMateNode.getPrev(options?)`

获取该节点的前一个非 `disabled` 的 `TreeMateNode`，寻找过程中 `group | ignored` 节点自身会被忽略，不存在时返回 `null`。

`options` 形如 `{ loop?: boolean }`，默认 `loop` 为 `false`，不会循环寻找。

#### `TreeMateNode.getNext(options?)`

获取该节点的后一个非 `disabled` 的 `TreeMateNode`，寻找过程中 `group | ignored` 节点自身会被忽略，不存在时返回 `null`。

`options` 形如 `{ loop?: boolean }`，默认 `loop` 为 `false`，不会循环寻找。

#### `TreeMateNode.getParent()`

获取该节点的父级 `TreeMateNode`，寻找过程中 `group` 节点自身会被忽略，不存在时返回 `null`。

#### `TreeMateNode.getChild()`

获取该节点第一个非 `disabled` 的 `TreeMateNode`，寻找过程中 `group | ignored` 节点自身会被忽略，不存在时返回 `null`。

### 展开、折叠树节点

展开状态会影响树的展平状态。展平节点对于虚拟列表至关重要。

#### `TreeMate.getFlattenedNodes(expandedKeys?)`

获取树对应于 `expandedKeys` 的展平节点。如果 `expandedKeys` 没有传入，treemate 会当作所有节点全部处于展开状态。

#### `createIndexGetter(flattenedNodes)`

从展平节点创建一个索引的 getter 函数。

```ts
import { createIndexGetter } from 'treemate'

const getIndex = createIndexGetter(flattenedNodes)

getIndex(flattenedNodes[0].key) === 0
```

### 获取节点的路径

#### `TreeMate.getPath(key)`

获取从根到该 `key` 对应节点的路径。返回值形如

```ts
interface MergedPath {
  keyPath: Key[]
  treeNodePath: TreeMateNode[]
  treeNode: TreeMateNode | null
}
```

其中 `keyPath` 为路径中各个节点的 `key`。其中 `treeNodePath` 为节点路径。`treeNode` 该 `key` 对应的 `TreeMateNode`。

### 获取树第一个可用的节点

可以用于获取选择菜单的默认选项。

#### `TreeMate.getFirstAvailableNode()`

获取整个树第一个非 `disabled` 的 `TreeMateNode`，寻找过程中 `group ｜ ignored` 节点自身会被忽略，不存在时返回 `null`。

### TreeMate 实例的其他属性

#### `TreeMate.treeNodes`

原数据对应的 `TreeMateNode` 数组，结构完全对应于原数据。

#### `TreeMate.treeNodeMap`

`key` 到节点的 Map。包含全部节点，`group | ignored` 节点包含在内。
