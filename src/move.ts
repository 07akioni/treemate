import { TreeNode, GetPrevNextOptions } from './interface'

export function getFirstAvailableNode<R, G, I> (
  nodes: Array<TreeNode<R, G, I>>
): TreeNode<R> | null {
  if (nodes.length === 0) return null
  const node = nodes[0]
  if (node.isGroup || node.ignored || node.disabled) {
    return node.getNext()
  }
  return (node as unknown) as TreeNode<R>
}

function rawGetNext (node: TreeNode, loop: boolean): TreeNode | null {
  const sibs = node.siblings
  const l = sibs.length
  const { index } = node
  if (loop) {
    return sibs[(index + 1) % l]
  } else {
    if (index === sibs.length - 1) return null
    return sibs[index + 1]
  }
}

function move (
  fromNode: TreeNode,
  dir: 'prev' | 'next',
  { loop = false, includeDisabled = false }: GetPrevNextOptions = {}
): TreeNode | null {
  const iterate = dir === 'prev' ? rawGetPrev : rawGetNext
  const getChildOptions = {
    reverse: dir === 'prev'
  }
  let meet = false
  let endNode: TreeNode | null = null
  function traverse (node: TreeNode | null): void {
    if (node === null) return
    if (node === fromNode) {
      if (!meet) {
        meet = true
      } else if (!fromNode.disabled && !fromNode.isGroup) {
        endNode = fromNode
        return
      }
    } else {
      if (
        (!node.disabled || includeDisabled) &&
        !node.ignored &&
        !node.isGroup
      ) {
        endNode = node
        return
      }
    }
    if (node.isGroup) {
      const child = getChild(node, getChildOptions)
      if (child !== null) {
        endNode = child
      } else {
        traverse(iterate(node, loop))
      }
    } else {
      const nextNode = iterate(node, false)
      if (nextNode !== null) {
        traverse(nextNode)
      } else {
        const parent = rawGetParent(node)
        if (parent?.isGroup) {
          traverse(iterate(parent, loop))
        } else if (loop) {
          traverse(iterate(node, true))
        }
      }
    }
  }
  traverse(fromNode)
  return endNode
}

function rawGetPrev (node: TreeNode, loop: boolean): TreeNode | null {
  const sibs = node.siblings
  const l = sibs.length
  const { index } = node
  if (loop) {
    return sibs[(index - 1 + l) % l]
  } else {
    if (index === 0) return null
    return sibs[index - 1]
  }
}

function rawGetParent (node: TreeNode): TreeNode | null {
  return node.parent
}

function getChild (
  node: TreeNode,
  options: { reverse?: boolean } = {}
): TreeNode | null {
  const { reverse = false } = options
  const { children } = node
  if (children) {
    const { length } = children
    const start = reverse ? length - 1 : 0
    const end = reverse ? -1 : length
    const delta = reverse ? -1 : 1
    for (let i = start; i !== end; i += delta) {
      const child = children[i]
      if (!child.disabled && !child.ignored) {
        if (child.isGroup) {
          const childInGroup = getChild(child, options)
          if (childInGroup !== null) return childInGroup
        } else {
          return child
        }
      }
    }
  }
  return null
}

export const moveMethods: Pick<
TreeNode,
'getChild' | 'getNext' | 'getParent' | 'getPrev'
> = {
  getChild (this: TreeNode) {
    if (this.ignored) return null
    return getChild(this)
  },
  getParent (this: TreeNode) {
    const { parent } = this
    if (parent?.isGroup) {
      return parent.getParent()
    }
    return parent
  },
  getNext (this: TreeNode, options: GetPrevNextOptions = {}) {
    return move(this, 'next', options)
  },
  getPrev (this: TreeNode, options: GetPrevNextOptions = {}) {
    return move(this, 'prev', options)
  }
}
