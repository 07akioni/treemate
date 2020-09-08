# treemate · [![Coverage Status](https://coveralls.io/repos/github/07akioni/treemate/badge.svg)](https://coveralls.io/github/07akioni/treemate)

Help people who want to write a tree component.

## TODO
- [x] checked keys & indeterminate keys
- [x] basic test
- [x] lint
- [ ] check action & uncheck action
  - [x] full test
  - [ ] batch check & batch uncheck
    - [x] feature
    - [x] API cleaning
    - [ ] test
  - [ ] functional disabled prop
- [x] <del>async patches</del> support non-complete-data
  - [ ] support check & uncheck action on partial complete tree
    - [x] implemented
    - [ ] well tested
  - [x] throw error on non-complete tree

## Usage
```js
const { TreeMate } = require('treemate')

const tree = [
  {
    key: '0',
    children: [
      {
        key: '0-0'
      },
      {
        key: '0-1'
      }
    ]
  }
]

const treemate = TreeMate(tree)

let result = treemate.getCheckedKeys(['0'])
// {
//   checkedKeys: ['0', '0-0', '0-1'],
//   indeterminateKeys: []
// }
checkedKeys = treemate.uncheck('0-1', result)
// {
//   checkedKeys: ['0-0'],
//   indeterminateKeys: ['0']
// }
checkedKeys = treemate.check('0-1', result)
// {
//   checkedKeys: ['0', '0-0', '0-1'],
//   indeterminateKeys: []
// }
```
