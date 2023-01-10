# @forfuns/sudoku



## 关于 about

[![npm version](https://badge.fury.io/js/@forfuns%2Fsudoku.svg)](https://www.npmjs.com/package/@forfuns/sudoku) [![License](https://img.shields.io/badge/License-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![Page Views Count](https://badges.toozhao.com/badges/01GP5GHAP2TBZPP5WKKMABME0K/blue.svg)](https://badges.toozhao.com/stats/01GP5GHAP2TBZPP5WKKMABME0K "sudoku-nodejs")


一款基于javascript / nodejs 开源的数独 **计算器** 和 **生成器** 依赖库

opensource sudoku calculator and puzzle generator javascript/nodejs library


## 功能 features

- [√] 完整数独解题器 - complete Sudoku solver
- [√] 题目生成功能 -  random one solution puzzle generator with four level


## 安装 install

`npm i @forfuns/sudoku`

## 使用 tutorial

### Solver & Generator

```javascript 1.6
// Solver
// 9 * 9 矩阵数独题目，-1值为待输入值
// 9 * 9 matrix for the puzzle , -1 mean input position
let puzzle = [
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

let sudoku 
// 数独解题(不区分是否唯一数独,回溯出结果直接返回)
// make sudo with puzzle
sudoku = new Sudoku(puzzle)

// 数独解题 只能计算唯一解的数独，如果该puzzle拥有多解，则抛出错误Error('puzzle is not one-solution sudoku')
// 一般来说,只是单纯解题,使用上面的构造器即可,速度最快
// if you need to sure puzzle is one solution or not , you can use strict=true (default:false)
// if puzzle is not one solution sudoku , will throw Error('puzzle is not one-solution sudoku')
sudoku = new Sudoku(puzzle,true) 

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
// Generator
// 数独题目生成
// make puzzle with generate function , four level 0:easy / 1:medium / 2:hard / 3:expert
puzzle = generator(0) // level 可选 0 ~ 3 分别代表：简单 / 中等 / 困难 / 专家
```

相关测试用例，请查看 `/test/sudoku/*.js` 



with any idea welcome open issue to make me know 

if you want same project with other language like  `go` / `dart` and `flutter app` , here they are : 

- [einsitang/sudoku-go](https://github.com/einsitang/sudoku-go)
- [einsitang/sudoku-dart](https://github.com/einsitang/sudoku-dart)
- [einsitang/sudoku-flutter](https://github.com/einsitang/sudoku-flutter)
