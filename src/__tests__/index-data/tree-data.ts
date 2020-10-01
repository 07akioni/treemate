import { TreeNode, RawNode } from '../../interface'

type CreateData = () => { input: RawNode[], output: TreeNode[] }

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
      const node0 = {
        key: 0,
        rawNode: raw0,
        level: 0,
        index: 0,
        isFirstChild: true,
        isLastChild: true,
        parent: null,
        isLeaf: true,
        isShallowLoaded: true,
        disabled: false
      }
      return {
        input: [
          raw0
        ],
        output: [
          node0
        ]
      }
    }
  },
  {
    description: '3 nodes',
    createData () {
      const raw0 = {
        key: 0,
        children: [
          {
            key: 1
          },
          {
            key: 2
          }
        ]
      }
      const raw1 = raw0.children[0]
      const raw2 = raw0.children[1]
      const node0 = {
        key: 0,
        rawNode: raw0,
        level: 0,
        index: 0,
        isFirstChild: true,
        isLastChild: true,
        parent: null,
        isLeaf: false,
        disabled: false,
        isShallowLoaded: true,
        children: [
          {
            key: 1,
            rawNode: raw1,
            level: 1,
            index: 0,
            isFirstChild: true,
            isLastChild: false,
            parent: null, // will be set later
            isLeaf: true,
            disabled: false,
            isShallowLoaded: true
          },
          {
            key: 2,
            rawNode: raw2,
            level: 1,
            index: 1,
            isFirstChild: false,
            isLastChild: true,
            parent: null, // will be set later
            isLeaf: true,
            disabled: false,
            isShallowLoaded: true
          }
        ]
      }
      ;(node0.children[0] as TreeNode).parent = node0
      ;(node0.children[1] as TreeNode).parent = node0
      return {
        input: [
          raw0
        ],
        output: [
          node0
        ]
      }
    }
  }
]

export default data
