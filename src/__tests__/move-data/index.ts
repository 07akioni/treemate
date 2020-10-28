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

export const groupMoveTree2 = [
  {
    type: 'group',
    key: '0',
    children: [
      {
        key: '0-0',
        disabled: true
      }
    ]
  },
  {
    type: 'group',
    key: '1',
    children: [
      {
        key: '1-0',
        disabled: true
      },
      {
        key: '1-0'
      }
    ]
  },
  {
    type: 'group',
    key: '2',
    children: [
      {
        key: '2-0',
        disabled: true
      }
    ]
  },
  {
    type: 'group',
    key: '3',
    children: [
      {
        key: '3-0',
        disabled: true
      },
      {
        key: '3-1'
      }
    ]
  }
]

export const firstNodeMoveTree1 = [
  {
    type: 'group',
    key: '0',
    children: [
      {
        key: '0-0',
        disabled: true
      },
      {
        key: '0-1'
      }
    ]
  }
]

export const firstNodeMoveTree2 = [
  {
    type: 'group',
    key: '0',
    children: [
      {
        key: '0-0',
        disabled: true
      },
      {
        key: '0-1',
        disabled: true
      }
    ]
  },
  {
    key: '1'
  }
]

export const firstNodeMoveTree3 = [
  {
    type: 'group',
    key: '0',
    children: [
      {
        key: '0-0',
        disabled: true
      },
      {
        key: '0-1',
        disabled: true
      }
    ]
  },
  {
    key: '1',
    disabled: true
  }
]

export const disabledMoveTree1 = [
  {
    type: 'group',
    key: '0',
    children: [
      {
        key: '0-0',
        disabled: true
      }
    ]
  },
  {
    key: '1',
    disabled: true
  }
]

export const disabledMoveTree2 = [
  {
    key: '0',
    disabled: true
  },
  {
    key: '1',
    disabled: true
  }
]

export const disabledMoveTree3 = [
  {
    type: 'group',
    key: '0',
    children: [
      {
        key: '0-0',
        disabled: true
      },
      {
        key: '0-1'
      }
    ]
  },
  {
    key: '1',
    disabled: true
  }
]

export const disabledMoveTree4 = [
  {
    key: '0',
    disabled: true
  },
  {
    key: '0-1'
  },
  {
    key: '1',
    disabled: true
  }
]
