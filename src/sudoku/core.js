const generate = require('./generator')
const {matrix, range, formatPrint} = require('./tools')
const NUMS = range(9, (num) => num + 1)

const calculate = (answer, rows, cols, zones, index) => {

    let row = matrix.getRow(index)
    let col = matrix.getCol(index)
    let zone = matrix.getZone(index)

    if (index > 81) {
        return true
    }
    if (answer[index] !== -1) {
        return calculate(answer, rows, cols, zones, index + 1)
    }

    let num
    for (let n in NUMS) {
        num = NUMS[n]
        if (!rows[row][num] && !cols[col][num] && !zones[zone][num]) {
            answer[index] = num
            rows[row][num] = true
            cols[col][num] = true
            zones[zone][num] = true

            if (calculate(answer, rows, cols, zones, index + 1)) {
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

        if (!source) {
            source = generate()
        }
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
        for (let index = 0; index < 81; ++index) {
            if (answer[index] === -1) {
                isSuccess = calculate(answer, rows, cols, zones, index)
                break
            }
        }

        if(!isSuccess){
            throw new Error('错误数独，无法计算')
        }

        this.answer = answer
        this.timecount = (new Date().getTime() - timeBegin)
    }

    getSource() {
        return this.source
    }

    getAnswer() {
        return this.answer
    }

    debug() {
        console.log('--- debug info ---')
        console.log('source')
        formatPrint(this.getSource())
        console.log('answer')
        formatPrint(this.getAnswer())
        console.log(`耗时 : ${this.timecount}'ms`)
        console.log('--- debug end ---')
    }
}

module.exports = Sudoku