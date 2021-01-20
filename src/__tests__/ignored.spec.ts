import { createTreeMate, RawNode, TreeMateOptions } from '../index'
import { tree1, tree2 } from './ignored-data'

describe('ignored node', () => {
  const options: TreeMateOptions<
  RawNode,
  | {
    type: 'group'
    [k: string]: any
  }
  | {
    group: true
    [k: string]: any
  },
  {
    ignored: true
    [k: string]: any
  }
  > = {
    getIgnored (node) {
      return !!node.ignored
    },
    getIsGroup (node) {
      return node.type === 'group' || node.group === true
    }
  }
  it('case#1', () => {
    const tm = createTreeMate(tree1, options)
    expect(tm.getFirstAvailableNode()?.key).toEqual('0')
    expect(tm.getNode('0')).not.toEqual(null)
    expect(tm.getNode('0-1')).toEqual(null)
    expect(tm.getNext('0-0')?.key).toEqual('0-2')
    expect(tm.getNode('0-0')?.getNext()?.key).toEqual('0-2')
    expect(tm.getPrev('0-2')?.key).toEqual('0-0')
    expect(tm.getNode('0-2')?.getPrev()?.key).toEqual('0-0')
  })
  it('case2', () => {
    const tm = createTreeMate(tree2, options)
    expect(tm.getFirstAvailableNode()?.key).toEqual('1-1')
    expect(tm.getNode('1')).toEqual(null)
    // get is group
    expect(tm.getNext('1-3')?.key).toEqual('2-0')
  })
})
