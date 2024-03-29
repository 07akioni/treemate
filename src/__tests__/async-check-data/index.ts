export const disabledNodeTestTree = [
  {
    key: '0',
    children: [
      {
        key: '0-0',
        disabled: true,
        children: [
          {
            key: '0-0-0',
            children: [
              {
                key: '0-0-0-0'
              },
              {
                key: '0-0-0-1'
              }
            ]
          },
          {
            key: '0-0-1'
          }
        ]
      },
      {
        key: '0-1',
        children: [
          {
            key: '0-1-0',
            isLeaf: false
          },
          {
            key: '0-1-1',
            isLeaf: false
          }
        ]
      }
    ]
  }
]

export const asyncBasicTree = [
  {
    key: '0',
    children: [
      {
        key: '1',
        isLeaf: false
      }
    ]
  }
]

export const asyncCascadeTree = [
  {
    key: '0',
    children: [
      {
        key: '1',
        isLeaf: false
      },
      {
        key: '2',
        children: [
          {
            key: '3'
          },
          {
            key: '4'
          }
        ]
      }
    ]
  }
]
