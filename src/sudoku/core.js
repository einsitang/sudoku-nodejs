const {matrix, range, formatPrint} = require('./tools')
const NUMS = range(9, (num) => num + 1)
const lodash = require('lodash');

const calculate = (answer, rows, cols, zones, index,traceBackNums) => {

    let row = matrix.getRow(index)
    let col = matrix.getCol(index)
    let zone = matrix.getZone(index)

    if (index >= 81) {
        return true
    }
    if (answer[index] !== -1) {
        return calculate(answer, rows, cols, zones, index + 1,traceBackNums)
    }

    let num
    let iterateNums = lodash.shuffle(NUMS);
    for (let n in iterateNums) {
        num = iterateNums[n]
        // console.log(`num : ${num} index : ${index}`)
        if (!rows[row][num] && !cols[col][num] && !zones[zone][num]) {
            answer[index] = num
            rows[row][num] = true
            cols[col][num] = true
            zones[zone][num] = true

            if (calculate(answer, rows, cols, zones, index + 1,iterateNums)) {
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

class Sudoku {

    constructor(source) {
        this.source = source

        if (!source || source.length != 81) {
            throw new Error('数独题目错误，不是 9 * 9 矩阵')
        }

        let answer = []
        let rows = range(9, () => range(10, () => false))
        let cols = range(9, () => range(10, () => false))
        let zones = range(9, () => range(10, () => false))

        let row, col, zone
        this.source.forEach((num, index) => {
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


        let isSuccess = true
        const timeBegin = new Date().getTime()
        let traceBackNums = lodash.shuffle(NUMS)
        for (let index = 0; index < 81; ++index) {
            if (answer[index] === -1) {
                isSuccess = calculate(answer, rows, cols, zones, index, traceBackNums)
                break
            }
        }

        if (!isSuccess) {
            throw new Error('错误数独，无法计算')
        }

        this.answer = answer
        this.timecount = (new Date().getTime() - timeBegin)
    }

    getPuzzle() {
        return this.source
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
        console.log(`耗时 : ${this.timecount}'ms`)
        console.log('--- debug end ---')
    }
}

module.exports = Sudoku
