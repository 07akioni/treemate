import { TreeNode, GetPrevNextOptions } from './interface'

export const moveMethods = {
  getChild (this: TreeNode) {
    const { children } = this
    if (children) {
      const { length } = children
      for (let i = 0; i < length; ++i) {
        const child = children[i]
        if (!child.disabled) return child
      }
    }
    return null
  },
  getParent (this: TreeNode) {
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
        if (!this.siblings[index].disabled) return this.siblings[index]
      }
    } else {
      const loopTimes = length - 1
      for (let i = this.index + 1; loopCount < loopTimes; ++loopCount, i += 1) {
        if (i > loopTimes) break
        if (!this.siblings[i].disabled) return this.siblings[i]
      }
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
        if (!this.siblings[index].disabled) return this.siblings[index]
      }
    } else {
      const loopTimes = length - 1
      for (let i = this.index - 1; loopCount < loopTimes; ++loopCount, i -= 1) {
        if (i < 0) break
        if (!this.siblings[i].disabled) return this.siblings[i]
      }
    }
    return null
  }
}
