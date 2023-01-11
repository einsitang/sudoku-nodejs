const {
  matrix,
  range,
  shuffle,
  formatPrint
} = require('./tools')
const NUMS = range(9, (num) => num + 1)

const backtrackCalculate = (answer, rows, cols, zones, index, traceBackNums) => {

  let row = matrix.getRow(index)
  let col = matrix.getCol(index)
  let zone = matrix.getZone(index)

  if (index >= 81) {
    return true
  }
  if (answer[index] !== -1) {
    return backtrackCalculate(answer, rows, cols, zones, index + 1, traceBackNums)
  }

  let num
  for (let n in traceBackNums) {
    num = traceBackNums[n]

    if (!rows[row][num] && !cols[col][num] && !zones[zone][num]) {
      answer[index] = num
      rows[row][num] = true
      cols[col][num] = true
      zones[zone][num] = true

      if (backtrackCalculate(answer, rows, cols, zones, index + 1, traceBackNums)) {
        return true
      } else {
        answer[index] = -1
        rows[row][num] = false
        cols[col][num] = false
        zones[zone][num] = false
      }

    }
  }
  return false
}

const dsfOneSolutionCalculate = (answer, rows, cols, zones, index, traceBackNums, mark) => {

  if (mark.finishes > 1) {
    return
  }

  if (index >= 81) {
    for (let i = 0; i < answer.length; ++i) {
      if (answer[i] == -1) {
        return
      }
    }
    mark.finishes++
    mark.answer = answer
    return
  }

  let row = matrix.getRow(index)
  let col = matrix.getCol(index)
  let zone = matrix.getZone(index)

  if (answer[index] !== -1) {
    dsfOneSolutionCalculate(answer, rows, cols, zones, index + 1, traceBackNums, mark)
    return
  }

  let num
  for (let n in traceBackNums) {
    num = traceBackNums[n]

    if (!rows[row][num] && !cols[col][num] && !zones[zone][num]) {
      answer[index] = num
      rows[row][num] = true
      cols[col][num] = true
      zones[zone][num] = true

      dsfOneSolutionCalculate([...answer], [...rows], [...cols], [...zones], index + 1, traceBackNums, mark)

      answer[index] = -1
      rows[row][num] = false
      cols[col][num] = false
      zones[zone][num] = false

    }
  }
}

class Sudoku {

  constructor(puzzle, strict = false) {
    this.puzzle = puzzle

    if (!puzzle || puzzle.length != 81) {
      // 数独题目错误，不是 9 * 9 矩阵
      throw new Error('is not a 9 * 9 matrix sudoku puzzle')
    }

    let answer = []
    let rows = range(9, () => range(10, () => false))
    let cols = range(9, () => range(10, () => false))
    let zones = range(9, () => range(10, () => false))

    let row, col, zone
    this.puzzle.forEach((num, index) => {
      row = matrix.getRow(index)
      col = matrix.getCol(index)
      zone = matrix.getZone(index)
      if (num !== -1) {
        rows[row][num] = true
        cols[col][num] = true
        zones[zone][num] = true
      }
      answer.push(num)
    })


    let isSuccess = false
    const timeBegin = new Date().getTime()
    let traceBackNums = shuffle(NUMS)
    let firstCheckPoint
    for (let index = 0; index < 81; ++index) {
      if (answer[index] === -1) {
        firstCheckPoint = index
        break
      }
    }

    if (strict) {
      const mark = {
        count: 0,
        finishes: 0
      }
      dsfOneSolutionCalculate(answer, rows, cols, zones, firstCheckPoint, traceBackNums, mark)
      if (mark.finishes > 1) {
        throw new Error('puzzle is not one-solution sudoku')
      } else if (mark.finishes == 0) {
        isSuccess = false
      } else {
        answer = mark.answer
        isSuccess = true
      }
    } else {
      isSuccess = backtrackCalculate(answer, rows, cols, zones, firstCheckPoint, traceBackNums)
    }


    if (!isSuccess) {
      throw new Error('not found the solution. is that you give me the puzzle with mistake?')
    }

    this.answer = answer
    this.timecount = (new Date().getTime() - timeBegin)
  }

  getPuzzle() {
    return this.puzzle
  }

  getAnswer() {
    return this.answer
  }

  debug() {
    console.log('--- debug info ---')
    console.log('puzzle')
    formatPrint(this.getPuzzle())
    console.log('answer')
    formatPrint(this.getAnswer())
    console.log(`solve puzzle total time : ${this.timecount}'ms`)
    console.log('--- debug end ---')
  }
}

module.exports = Sudoku