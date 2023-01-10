/**
 * 数独生成器测试工具
 * generate sudoku puzzle
 */
const {
  Sudoku,
  generator
} = require('../../index')

// const level = parseInt(Math.random() * 4)
const level = 3
console.debug(`数独难度 level : ${level}`)
console.time("generator")
const puzzle = generator(level)
console.timeEnd("generator")
let sudoku = new Sudoku(puzzle)
sudoku.debug()
console.log('this is puzzle can be copy to the clipboard : ')
console.log(sudoku.getPuzzle().join(','))