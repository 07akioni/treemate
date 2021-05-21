import { createTreeMate } from '..'

describe('maxLevel', () => {
  it('has children', () => {
    const tm = createTreeMate([
      {
        key: 1,
        children: [
          {
            key: 2
          }
        ]
      }
    ])
    expect(tm.maxLevel).toEqual(1)
  })
  it('no children', () => {
    const tm = createTreeMate([
      {
        key: 1
      }
    ])
    expect(tm.maxLevel).toEqual(0)
  })
})
