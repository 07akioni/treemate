import { createTreeMate } from '../index'

describe('#contains', () => {
  it('works', () => {
    const tm = createTreeMate([
      {
        key: 1,
        children: [
          {
            key: 2
          }
        ]
      },
      {
        key: 3
      }
    ])
    expect(tm.getNode(1)?.contains(tm.getNode(1))).toEqual(true)
    expect(tm.getNode(1)?.contains(tm.getNode(2))).toEqual(true)
    expect(tm.getNode(2)?.contains(tm.getNode(1))).toEqual(false)
    expect(tm.getNode(3)?.contains(tm.getNode(1))).toEqual(false)
    expect(tm.getNode(3)?.contains(tm.getNode(2))).toEqual(false)
    expect(tm.getNode(1)?.contains(tm.getNode(3))).toEqual(false)
  })
})
