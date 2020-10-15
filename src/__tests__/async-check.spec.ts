import { TreeMate } from '@/index'
import { SubtreeUnloadedError } from '@/check'

import { disabledNodeTestTree } from './async-check-data/index'

describe('async-check', () => {
  it("doesn't throw error when subtree is loaded", () => {
    const treeMate = TreeMate(disabledNodeTestTree, { async: true })
    let error = null
    try {
      treeMate.check('0-0-0', [])
    } catch (err) {
      error = err
    }
    expect(error).toBeFalsy()
  })
  it('throws error when subtree is not loaded', () => {
    const treeMate = TreeMate(disabledNodeTestTree, { async: true })
    let error = null
    try {
      treeMate.check('0', [])
    } catch (err) {
      error = err
    }
    expect(error instanceof SubtreeUnloadedError).toBeTruthy()
  })
})
