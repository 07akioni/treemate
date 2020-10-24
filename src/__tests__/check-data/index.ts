export const basicTree = [
  {
    key: '0',
    children: [
      {
        key: '0-0',
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
            key: '0-1-0'
          },
          {
            key: '0-1-1'
          }
        ]
      }
    ]
  }
]

export const flattenedBasicTreeKeys = [
  '0',
  '0-0',
  '0-0-0',
  '0-0-0-0',
  '0-0-0-1',
  '0-0-1',
  '0-1',
  '0-1-0',
  '0-1-1'
]

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
            key: '0-1-0'
          },
          {
            key: '0-1-1'
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
  }
]
