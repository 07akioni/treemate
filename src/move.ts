import { TreeNode, GetPrevNextOptions } from './interface'

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
    const {
      loop = false
    } = options
    const length = this.siblings.length
    let loopCount = 0
    if (loop) {
      for (let i = this.index + 1; loopCount < length; ++loopCount, i += 1) {
        const index = i % length
        const sibling = this.siblings[index]
        if (!sibling.disabled) {
          if (sibling.isGroup) {
            const sibInGroup = sibling.getChild()
            if (sibInGroup !== null) return sibInGroup
          } else {
            return sibling
          }
        }
      }
    } else {
      const loopTimes = length - 1
      for (let i = this.index + 1; loopCount < loopTimes; ++loopCount, i += 1) {
        if (i > loopTimes) break
        const sibling = this.siblings[i]
        if (!sibling.disabled) {
          if (sibling.isGroup) {
            const sibInGroup = sibling.getChild()
            if (sibInGroup !== null) return sibInGroup
          } else {
            return sibling
          }
        }
      }
    }
    if (this.parent?.isGroup) {
      return this.parent.getNext()
    }
    return null
  },
  getPrev (this: TreeNode, options: GetPrevNextOptions = {}) {
    const {
      loop = false
    } = options
    const length = this.siblings.length
    let loopCount = 0
    if (loop) {
      for (let i = this.index + length - 1; loopCount < length; ++loopCount, i -= 1) {
        const index = i % length
        const sibling = this.siblings[index]
        if (!sibling.disabled) {
          if (sibling.isGroup) {
            const sibInGroup = sibling.getChild()
            if (sibInGroup !== null) return sibInGroup
          } else {
            return sibling
          }
        }
      }
    } else {
      const loopTimes = length - 1
      for (let i = this.index - 1; loopCount < loopTimes; ++loopCount, i -= 1) {
        if (i < 0) break
        const sibling = this.siblings[i]
        if (!sibling.disabled) {
          if (sibling.isGroup) {
            const sibInGroup = sibling.getChild()
            if (sibInGroup !== null) return sibInGroup
          } else {
            return sibling
          }
        }
      }
    }
    if (this.parent?.isGroup) {
      return this.parent.getPrev()
    }
    return null
  }
}
