export const basicTree = [
  {
    key: 0,
    children: [
      {
        key: 1,
        children: [
          {
            key: 3,
            children: [
              {
                key: 9,
              },
              {
                key: 10
              }
            ]
          },
          {
            key: 4
          }
        ]
      },
      {
        key: 2,
        children: [
          {
            key: 5
          },
          {
            key: 6
          }
        ]
      }
    ]
  }
]

export const disabledNodeTestTree = [
  {
    key: 0,
    children: [
      {
        key: 1,
        disabled: true,
        children: [
          {
            key: 3,
            children: [
              {
                key: 9,
              },
              {
                key: 10
              }
            ]
          },
          {
            key: 4
          }
        ]
      },
      {
        key: 2,
        children: [
          {
            key: 5
          },
          {
            key: 6
          }
        ]
      }
    ]
  }
]

export const extendedCheckedKeysTestTree = [
  {
    key: '0',
    children: [
      {
        key: '0-0'
      },
      {
        key: '0-1',
        disabled: true,
        children: [
          {
            key: '0-1-0'
          },
          {
            key: '0-1-1',
            disabled: true
          }
        ]
      }
    ]
  },
  {
    key: '1',
    disabled: true,
    children: [
      {
        key: '1-0'
      },
      {
        key: '1-1',
        children: [
          {
            key: '1-1-0'
          },
          {
            key: '1-1-1',
            disabled: true
          }
        ]
      }
    ]
  },
]