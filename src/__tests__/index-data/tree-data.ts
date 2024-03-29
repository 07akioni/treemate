import { TreeNode, RawNode } from '../../interface'

type CreateData = (key?: string) => { input: RawNode[], output: TreeNode[] }

const data: Array<{ createData: CreateData, description: string }> = [
  {
    description: 'empty root []',
    createData () {
      return {
        input: [],
        output: []
      }
    }
  },
  {
    description: '1 node',
    createData () {
      const raw0 = {
        key: 0
      }
      const input = [raw0]
      const node0 = {
        key: 0,
        rawNode: raw0,
        level: 0,
        index: 0,
        isFirstChild: true,
        isLastChild: true,
        isGroup: false,
        parent: null,
        isLeaf: true,
        ignored: false,
        shallowLoaded: true,
        disabled: false,
        getParent: () => null,
        getChild: () => null,
        getPrev: () => null,
        getNext: () => null
      }
      ;(node0 as TreeNode).siblings = [node0 as TreeNode]
      const output = (node0 as TreeNode).siblings
      return {
        input,
        output
      }
    }
  },
  {
    description: '3 nodes',
    createData (key = 'children') {
      const raw0 = {
        key: 0,
        [key]: [
          {
            key: 1
          },
          {
            key: 2
          }
        ]
      }
      const raw1 = (raw0[key] as any)[0]
      const raw2 = (raw0[key] as any)[1]
      const input = [raw0]
      const node1 = {
        key: 1,
        rawNode: raw1,
        level: 1,
        index: 0,
        isFirstChild: true,
        isLastChild: false,
        isGroup: false,
        parent: null, // will be set later
        isLeaf: true,
        disabled: false,
        shallowLoaded: true,
        ignored: false,
        getParent: () => null,
        getChild: () => null,
        getPrev: () => null,
        getNext: () => null,
        contains: () => true,
        siblings: []
      }
      const node2 = {
        key: 2,
        rawNode: raw2,
        level: 1,
        index: 1,
        isFirstChild: false,
        isLastChild: true,
        isGroup: false,
        parent: null, // will be set later
        isLeaf: true,
        disabled: false,
        shallowLoaded: true,
        ignored: false,
        getParent: () => null,
        getChild: () => null,
        getPrev: () => null,
        getNext: () => null,
        contains: () => true,
        siblings: []
      }
      const node0 = {
        key: 0,
        rawNode: raw0,
        level: 0,
        index: 0,
        isFirstChild: true,
        isLastChild: true,
        isGroup: false,
        parent: null,
        isLeaf: false,
        disabled: false,
        shallowLoaded: true,
        ignored: false,
        getParent: () => null,
        getChild: () => null,
        getPrev: () => null,
        getNext: () => null,
        contains: () => true,
        siblings: [],
        children: [node1, node2]
      }
      ;(node0 as TreeNode).siblings = [node0 as TreeNode]
      ;(node1 as TreeNode).siblings = node0.children
      ;(node2 as TreeNode).siblings = node0.children
      ;(node0.children[0] as TreeNode).parent = node0
      ;(node0.children[1] as TreeNode).parent = node0
      return {
        input,
        output: node0.siblings
      }
    }
  }
]

export default data
