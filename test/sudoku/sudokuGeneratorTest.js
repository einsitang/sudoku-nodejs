/**
 * 数独生成器测试工具
 */
const {Sudoku,generator} = require('../../index')

let level = parseInt(Math.random() * 4)
console.debug(`数独难度 level : ${level}`)
let source = generator(level)
let sudoku = new Sudoku(source)
sudoku.debug()