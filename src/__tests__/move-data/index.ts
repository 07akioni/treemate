export const basicMoveTree = [
  {
    key: '-1',
    disabled: true
  },
  {
    key: '0'
  },
  {
    key: '1',
    disabled: true
  },
  {
    key: '2',
    children: [
      {
        key: '2-0',
        disabled: true
      },
      {
        key: '2-1',
        disabled: true
      }
    ]
  },
  {
    key: '3',
    children: [
      {
        key: '3-0',
        disabled: true
      },
      {
        key: '3-1'
      },
      {
        key: '3-2'
      },
      {
        key: '3-3'
      }
    ]
  }
]

export const groupMoveTree = [
  {
    key: '0'
  },
  {
    key: '1',
    type: 'group',
    children: [
      {
        key: '1-0',
        disabled: true
      },
      {
        key: '1-1'
      }
    ]
  },
  {
    key: '2',
    children: [
      {
        key: '2-0',
        type: 'group',
        children: [
          {
            key: '2-0-0'
          },
          {
            key: '2-0-1',
            disabled: true
          }
        ]
      },
      {
        key: '2-1',
        type: 'group',
        children: [
          {
            key: '2-1-0',
            disabled: true
          },
          {
            key: '2-1-1'
          },
          {
            key: '2-1-2'
          }
        ]
      }
    ]
  },
  {
    key: '3',
    children: [
      {
        key: '3-0'
      },
      {
        type: 'group',
        key: '3-1',
        children: [
          {
            key: '3-1-0',
            disabled: true
          }
        ]
      },
      {
        type: 'group',
        key: '3-2',
        children: [
          {
            key: '3-2-0'
          }
        ]
      }
    ]
  },
  {
    key: '4'
  }
]
