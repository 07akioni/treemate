import { TreeNode } from '../../interface'

export function expectTreeNodesEqual (nodes1: TreeNode[] | undefined, nodes2: TreeNode[] | undefined) {
  if (nodes1 === undefined || nodes2 === undefined) {
    expect(nodes1).toEqual(nodes2)
    return
  }
  nodes1?.forEach((node, index) => {
    expectTreeNodeEqual(node, nodes2[index])
  })
}

export function expectTreeNodeEqual (node1: TreeNode, node2: TreeNode) {
  Object.keys(node1).forEach(key => {
    if (key === 'rawNode') {
      expect(node1.rawNode).toStrictEqual(node2.rawNode)
    } else if (key === 'parent') {
      if (node1.parent === null) expect(node2.parent).toEqual(null)
      expect(node1.parent?.key).toEqual(node2.parent?.key)
    } else if (key === 'children') {
      expectTreeNodesEqual(node1.children, node2.children)
    } else {
      expect((node1 as any)[key]).toStrictEqual((node2 as any)[key])
    }
  })
}
