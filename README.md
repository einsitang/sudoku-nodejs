# @forfuns/sudoku

## 关于 about

一个开源数独 **计算器** / **生成器**

opensource sudoku calculator and puzzle generator

## 功能 feature
- [√] 完整数独计算器 - complete Sudoku calculator
- [√] 题目生成功能 - puzzle generator with four level

## 安装 install

`npm i @forfuns/sudoku`

## 使用 tutorial

### sudoku 库

```javascript 1.6
// 9 * 9 矩阵数独题目，-1值为待输入值
// 9 * 9 matrix for the puzzle , -1 mean input position
let source = [
    -1,-1,8,    9,-1,6,     -1,-1,5,
    -1,4,3,     -1,-1,-1,   -1,2,-1,
    -1,-1,-1,   -1,-1,-1,   -1,-1,-1,

    -1,-1,4,    -1,-1,-1,   9,-1,-1,
    5,-1,-1,    -1,4,-1,    6,8,-1,
    -1,-1,-1,   1,-1,-1,    -1,-1,-1,

    2,-1,-1,    -1,8,-1,    -1,7,-1,
    -1,-1,-1,   -1,3,4,     1,-1,-1,
    -1,6,-1,    -1,-1,9,    -1,-1,-1,
]
const { Sudoku , generator } = require('@forfuns/sudoku')

// 创建数独
// make sudo with source(A.K.A puzzle)
let sudoku = new Sudoku(source)

// 获取原题目
// get origin puzzle
sudoku.getPuzzle()

// 获取完整答案
// get full sudoku with answer
sudoku.getAnswer()

// 查看debug信息
// show debug infomation
sudoku.debug()

-----------------------------------------------------------------------------
// 数独题目生成
// make puzzle with genarator function , four level 0:easy / 1:medium / 2:hard / 3:expert
source = generator(0) // level 可选 0 ~ 3 分别代表：简单 / 中等 / 困难 / 专家
```

更多用法正在设计中，感兴趣可以先了解 `/test/sudoku./sudokuTest.js` 提供的测试用例

with any idea welcome open issue to make me know , same lib with go / dart and flutter app

- [einsitang/sudoku-go](https://github.com/einsitang/sudoku-go)
- [einsitang/sudoku-dart](https://github.com/einsitang/sudoku-dart)
- [einsitang/sudoku-flutter](https://github.com/einsitang/sudoku-flutter)
