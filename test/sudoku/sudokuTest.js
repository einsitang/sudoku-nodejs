/**
 * 数独计算器测试
 * solve puzzle with expert level
 */

const isEquals = (sudoku1, sudoku2) => {

  let testAnswer1 = sudoku1.getAnswer()
  let testAnswer2 = sudoku2.getAnswer()
  for (let i in testAnswer1) {
    if (testAnswer1[i] != testAnswer2[i]) {
      return false
    }
  }
  return true
}

// use puzzle if you want
let puzzle = [
  -1, -1, 8, 9, -1, 6, -1, -1, 5,
  -1, 4, 3, -1, -1, -1, -1, 2, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1,

  -1, -1, 4, -1, -1, -1, 9, -1, -1,
  5, -1, -1, -1, 4, -1, 6, 8, -1,
  -1, -1, -1, 1, -1, -1, -1, -1, -1,

  2, -1, -1, -1, 8, -1, -1, 7, -1,
  -1, -1, -1, -1, 3, 4, 1, -1, -1,
  -1, 6, -1, -1, -1, 9, -1, -1, -1,
]
// puzzleFromGo variable data is generated from sudoku-go
// sudoku-go github repository : https://github.com/einsitang/sudoku-go
const puzzleFromGo = [2, 3, -1, -1, -1, 6, 7, -1, -1, -1, -1, -1, -1, 7, 8, 2, -1, 5, -1, -1, -1, 5, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 6, -1, 1, -1, 9, -1, 2, -1, -1, -1, -1, -1, 6, 8, -1, -1, -1, -1, -1, -1, -1, 4, -1, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, 8, -1, -1, 4, -1, -1, -1, 6, -1, -1, 9, 4, 1, -1, -1]
const Sudoku = require('../../src/sudoku/core')
let sudoku, verifySudoku
sudoku = new Sudoku(puzzle, true)
sudoku.debug()
