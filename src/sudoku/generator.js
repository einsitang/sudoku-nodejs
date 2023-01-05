/**
 * 数读生成器
 * @param level
 * @author EinsiTang
 */
const {
  matrix,
  range
} = require('./tools')
const Sudoku = require('./core')
const lodash = require('lodash');

// 简单级别填充规则
const easy = [{
  fill: 7,
  count: 1
}, {
  fill: 6,
  count: 1
}, {
  fill: 5,
  count: 3
}, {
  fill: 4,
  count: 2
}, {
  fill: 3,
  count: 2
}]

// 中等级别填充规则
const medium = [{
  fill: 6,
  count: 1
}, {
  fill: 5,
  count: 3
}, {
  fill: 4,
  count: 2
}, {
  fill: 3,
  count: 2
}, {
  fill: 2,
  count: 1
}]
// 困难级别填充规则
const hard = [{
  fill: 5,
  count: 1
}, {
  fill: 4,
  count: 2
}, {
  fill: 3,
  count: 2
}, {
  fill: 2,
  count: 3
}, {
  fill: 1,
  count: 1
}]
// 专家级别填充规则
const expert = [{
  fill: 5,
  count: 1
}, {
  fill: 4,
  count: 1,
}, {
  fill: 3,
  count: 4
}, {
  fill: 2,
  count: 2
}, {
  fill: 1,
  count: 1
}]
// 规则级别
const RULE_LEVEL = [easy, medium, hard, expert]

/**
 * 构建填充规则
 * @param rules
 * @returns {[]}
 */
const buildFillRules = (rules) => {
  // 分配宫的填充规则
  let distributeZones = range(9)
  let zoneRules = []

  let zoneIndexs = buildZoneIndexs()

  // 迭代所有规则
  for (let i in rules) {
    let fillRule = rules[i]
    let indexes = []

    let zoneCounter = 0
    while (zoneCounter < fillRule.count) {

      // 随机一个候选宫
      let randomZone = parseInt(Math.random() * distributeZones.length)
      let zone = distributeZones.splice(randomZone, 1)[0]
      let distributeIndexs = zoneIndexs[zone]

      // 在候选宫中随机出需要fill的格子
      let fillCounter = 0
      while (fillCounter < fillRule.fill) {
        let randomIndex = parseInt(Math.random() * distributeIndexs.length)
        indexes.push(distributeIndexs.splice(randomIndex, 1)[0])
        fillCounter++
      }
      zoneCounter++
    }
    zoneRules.push({
      fill: fillRule.fill,
      count: fillRule.count,
      progress: 0,
      // 需要被写入题目的格子
      indexes
    })
  }

  return zoneRules
}

/**
 * 获取所有宫格子
 * @returns {[]}
 */
const buildZoneIndexs = () => {
  const zones = range(9)
  const indexs = []
  for (let zi in zones) {
    indexs.push(matrix.getZoneIndexs(zones[zi]))
  }
  return indexs
}

const simFill = (puzzle, rows, cols, zones, index, numPool) => {
  let tryNums = numPool.nums()
  let tryNum

  let row = matrix.getRow(index)
  let col = matrix.getCol(index)
  let zone = matrix.getZone(index)

  for (let i in tryNums) {
    tryNum = tryNums[i]

    if (!rows[row][tryNum] && !cols[col][tryNum] && !zones[zone][tryNum]) {
      rows[row][tryNum] = true
      cols[col][tryNum] = true
      zones[zone][tryNum] = true
      puzzle[index] = tryNum
      numPool.record(tryNum)
      break
    }
  }
}

class NumPool {

  constructor(capacity = 3) {
    this.capacity = capacity
    this.replace = 0
    this.meta = {}
  }

  nums() {
    let originNums = range(9, (i) => i + 1)
    originNums = lodash.shuffle(originNums)
    let nums = []
    originNums.forEach((num) => {
      let numMeta = this.meta[num]
      if (!numMeta) {
        numMeta = 0
      }
      if (numMeta < this.capacity) {
        nums.push(num)
      }
    })
    return nums
  }

  record(num) {
    let numMeta = this.meta[num]
    if (!numMeta) {
      numMeta = 0
    }
    numMeta++

    if (numMeta >= this.capacity) {
      this.replace++
    }
    if (this.replace >= 2) {
      this.capacity++
      this.replace = 0
    }
  }
}

const generator = (fillRules) => {


  // 初始化填充记录
  let rows = range(9, () => range(10, () => false))
  let cols = range(9, () => range(10, () => false))
  let zones = range(9, () => range(10, () => false))

  // 迭代填充规则获取所有填充格子
  let numPool = new NumPool
  let fillIndexes = []
  fillRules.forEach((fillRule) => {
    fillIndexes = fillIndexes.concat(fillRule.indexes)
  })


  // 计算中心位置
  let basicIndexes = []
  range(3, (i) => i + 3).forEach((y) => {
    range(3, (i) => y * 9 + 3 + i).forEach((basicIndex) => {
      basicIndexes.push(basicIndex)
    })
  })

  // 基准数据填充
  let basicpuzzle = range(81, () => -1)
  basicIndexes.forEach((index) => {
    simFill(basicpuzzle, rows, cols, zones, index, numPool)

  })

  // 根据基准数据计算出完整数独
  let sudoku1 = new Sudoku(basicpuzzle)
  let answer1 = sudoku1.getAnswer()

  // 对完整数据做规则挖洞
  let puzzle = range(81, () => -1)
  fillIndexes.forEach((index) => {
    puzzle[index] = answer1[index]
  })

  // 校验挖洞完毕的题目是否唯一解
  let testSudoku1 = new Sudoku(puzzle)
  let testSudoku2 = new Sudoku(puzzle)

  let testAnswer1 = testSudoku1.getAnswer()
  let testAnswer2 = testSudoku2.getAnswer()
  for (let i in testAnswer1) {
    if (testAnswer1[i] != testAnswer2[i]) {
      throw new Error("retry")
    }
  }

  // 输出校验后的题目
  return puzzle
}

module.exports = (level = 0) => {
  // 生成数独题目
  let levelRules = RULE_LEVEL[level]
  if (!levelRules) {
    throw new Error(`please input level [0 - ${RULE_LEVEL.length}]`)
  }

  // 构建填充规则
  let fillRules = buildFillRules(levelRules)

  let puzzle

  // let tryCount = 0
  while (!puzzle) {
    // retry
    try {
      puzzle = generator(fillRules)
    } catch (e) {

    }
  }

  return puzzle
}