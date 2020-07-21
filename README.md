# Sudoku.js

## 关于

一个开源数独运算器~~以及独立可运行的web应用~~

## 计划
- [√] 完整数独计算器 
- [√] 题目生成功能
- [] 可独立运行的h5应用
- [] OCR扫描解题能力
- [] 社交元素

## 安装

`yarn install`

or

`npm i`

## 使用

### sudoku 库

```javascript 1.6
// 9*9 矩阵数独题目，-1值为待输入值
const source = [
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
const { Sudoku , generator } = require('./index')
// 创建数独
let sudoku = new Sudoku(source)
// 获取原题目
sudoku.getSource()
// 获取完整答案
sudoku.getAnswer()
// 查看debug信息
sudoku.debug()

// 生成数独
let source = generator(0) // level 可选 0 ~ 3 分别代表：简单 / 中等 / 困难 / 专家
```

### web 程序

更多用法正在设计中，感兴趣可以先了解 `/test/sudoku./sudokuTest.js` 提供的测试用例