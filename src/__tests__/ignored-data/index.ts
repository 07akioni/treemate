export const tree1 = [
  {
    key: '0',
    children: [
      {
        key: '0-0'
      },
      {
        key: '0-1',
        ignored: true
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
    ignored: true
  },
  {
    key: '1',
    type: 'group',
    children: [
      {
        key: '1-0',
        ignored: true
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
    group: true,
    children: [
      {
        key: '2-0'
      }
    ]
  }
]
