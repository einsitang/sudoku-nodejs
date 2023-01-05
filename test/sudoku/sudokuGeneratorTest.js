/**
 * 数独生成器测试工具
 * generator sudoku puzzle
 */
const {
  Sudoku,
  generator
} = require('../../index')

const level = parseInt(Math.random() * 4)
console.debug(`数独难度 level : ${level}`)
console.time("generator")
const source = generator(level)
console.timeEnd("generator")
let sudoku = new Sudoku(source)
sudoku.debug()