import { TreeNode, GetPrevNextOptions } from './interface'

export function getFirstAvailableNode (nodes: TreeNode[]): TreeNode | null {
  if (nodes.length === 0) return null
  const node = nodes[0]
  if (node.isGroup) {
    return node.getNext()
  }
  return node.disabled
    ? node.getNext()
    : node
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
  iterate: (node: TreeNode, loop: boolean) => TreeNode | null,
  options: GetPrevNextOptions = {}
): TreeNode | null {
  const {
    loop = false
  } = options
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  let meet = false
  let endNode: TreeNode | null = null
  function traverse (node: TreeNode | null): void {
    if (node === null) return
    if (node === fromNode) {
      if (!meet) {
        meet = true
      } else if (
        !fromNode.disabled &&
        !fromNode.isGroup
      ) {
        endNode = fromNode
        return
      }
    } else {
      if (
        !node.disabled &&
        !node.isGroup
      ) {
        endNode = node
        return
      }
    }
    if (node.isGroup) {
      const child = node.getChild()
      if (child !== null) {
        endNode = child
      } else {
        traverse(iterate(node, loop))
      }
    } else {
      const parent = rawGetParent(node)
      const nextNode = iterate(node, false)
      if (nextNode !== null) {
        traverse(nextNode)
      } else {
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

export const moveMethods = {
  getChild (this: TreeNode) {
    const { children } = this
    if (children) {
      const { length } = children
      for (let i = 0; i < length; ++i) {
        const child = children[i]
        if (!child.disabled) {
          if (child.isGroup) {
            const childInGroup = child.getChild()
            if (childInGroup !== null) return childInGroup
          } else {
            return child
          }
        }
      }
    }
    return null
  },
  getParent (this: TreeNode) {
    if (this.parent?.isGroup) {
      return this.parent.getParent()
    }
    return this.parent
  },
  getNext (this: TreeNode, options: GetPrevNextOptions = {}) {
    return move(this, rawGetNext, options)
  },
  getPrev (this: TreeNode, options: GetPrevNextOptions = {}) {
    return move(this, rawGetPrev, options)
  }
}
