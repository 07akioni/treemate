export const tree1 = [
  {
    key: '0',
    children: [
      {
        key: '0-0'
      },
      {
        key: '0-1',
        type: 'ignored'
      },
      {
        key: '0-2'
      },
      {
        key: '0-3'
      }
    ]
  }
]

export const tree2Keys = ['0', '1', '1-0', '1-1', '1-2', '1-3', '2', '2-0']

export const tree2 = [
  {
    key: '0',
    type: 'ignored'
  },
  {
    key: '1',
    type: 'group',
    children: [
      {
        key: '1-0',
        type: 'ignored'
      },
      {
        key: '1-1'
      },
      {
        key: '1-2'
      },
      {
        key: '1-3'
      }
    ]
  },
  {
    key: '2',
    type: 'group',
    children: [
      {
        key: '2-0'
      }
    ]
  }
]

// ['0', '1', '1-0', '2', '2-0', '2-0-0', '2-0-1', '2-1', '3', '3-0', '3-1']
export const expandedableTree = [
  {
    key: '0'
  },
  {
    key: '1',
    children: [
      {
        key: '1-0'
      }
    ]
  },
  {
    key: '2',
    children: [
      {
        key: '2-0',
        children: [
          {
            key: '2-0-0'
          },
          {
            key: '2-0-1'
          }
        ]
      },
      {
        key: '2-1'
      }
    ]
  },
  {
    key: '3',
    type: 'group',
    children: [
      {
        key: '3-0'
      },
      {
        key: '3-1'
      }
    ]
  }
]
