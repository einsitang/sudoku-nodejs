const {BIT_MAP, range, matrix, formatPrint} = require('./tools')
const generate = require('./generator')

const BIT_FULL = 0b0111111111
const BIT_EMPTY = 0b0

class Condidate {
    constructor(index, isFull) {
        if (index === undefined) {
            throw new Error('wrong index')
        }
        this.index = index
        this.value = []
        if (isFull) {
            this.value.push(BIT_FULL)
            this.value.push(...range(9, (num) => num + 1))
        } else {
            this.value.push(BIT_EMPTY)
        }
    }

    /**
     * 判断是否已满
     * @returns {boolean}
     */
    isFull() {
        return this.value[0] === BIT_FULL
    }

    /**
     * 判断是否为空
     * @returns {boolean}
     */
    isEmpty() {
        return this.value[0] === BIT_EMPTY
    }

    /**
     * 判断是否存在
     * @param num
     * @returns {boolean}
     */
    isExist(num) {
        const bit = BIT_MAP[num - 1]
        return (this.value[0] & bit) === bit
    }

    /**
     * 移除候选词
     * @param num
     */
    remove(num) {

        if (!this.isEmpty()) {
            let numArr = []
            let bit = 0
            if (Array.isArray(num)) {
                num.forEach((_num) => {
                    let number = parseInt(_num)
                    numArr.push(number)
                    bit |= BIT_MAP[number - 1]
                })
            } else {
                let number = parseInt(num)
                bit |= BIT_MAP[number - 1]
                numArr = [parseInt(num)]
            }
            this.value[0] = this.value[0] & ~bit
            this.value = this.value.filter((_num, index) => {
                if (index === 0) {
                    return true
                }
                if (numArr.indexOf(_num) !== -1) {
                    return false
                }
                return true
            })
        }

    }

    /**
     * 清空候选
     */
    empty() {
        this.value = [BIT_EMPTY]
    }

    /**
     * 晋升唯一候选
     * @returns {number|*}
     */
    promote() {
        if (this.value.length === 2) {
            return this.value[1]
        }
        return 0
    }

    getBit() {
        return this.value[0]
    }

    getNums() {
        if (this.isEmpty()) {
            return []
        }
        return this.value.slice(1)
    }

}

class Sudoku {
    constructor(source) {
        if (!source) {
            source = generate()
        }
        if (!source || source.length != 81) {
            throw new Error('数独题目错误，不是 9 * 9 矩阵')
        }
        this.source = source
        this.init()
    }

    init() {
        let needFill
        let answer = []
        let candidate = []

        this.source.forEach((num, index) => {
            needFill = num === -1
            candidate.push(new Condidate(index, needFill))
            answer.push(needFill ? 0 : -1)
        })

        // 初始化答案
        this.answer = answer
        // 初始化候选词
        this.candidate = candidate

        let removeCandidateNum = (num) => (candidate) => {
            candidate.remove(num)
        }

        this.source.forEach((num, index) => {
            if (num !== -1) {
                let row = matrix.getRow(index)
                let col = matrix.getCol(index)
                let zone = matrix.getZone(index)
                this.getColCandidate(row).forEach(removeCandidateNum(num))
                this.getRowCandidate(col).forEach(removeCandidateNum(num))
                this.getZoneCandidate(zone).forEach(removeCandidateNum(num))
            }
        })

        // 尝试次数
        this.tryCount = 3
        this.status = Sudoku.STATUS_NONE
    }

    getRowCandidate(col) {
        // 返回 row 候选集
        let rowCandidate = []
        for (let row = 0; row < 9; ++row) {
            rowCandidate.push(this.candidate[matrix.getIndex(row, col)])
        }
        return rowCandidate
    }

    getColCandidate(row) {
        // 返回 col 候选集
        let colCandidate = []
        for (let col = 0; col < 9; ++col) {
            colCandidate.push(this.candidate[matrix.getIndex(row, col)])
        }
        return colCandidate
    }

    getZoneCandidate(zone) {
        // 返回 zone 候选集
        let rows = [0, 1, 2]
        let cols = [0, 1, 2]
        let zoneCandidate = []
        let index
        rows.forEach((row) => {

            cols.forEach((col) => {
                index = (parseInt(zone / 3) * 3 + col) * 9 + ((zone % 3) * 3 + row)
                zoneCandidate.push(this.candidate[index])

            })

        })
        return zoneCandidate
    }

    shaftInternalCalculate(type, shaft) {
        let isRow = type === 'row'
        let getShaftCandidate = isRow ? this.getRowCandidate : this.getColCandidate
        let shaftCandidate = getShaftCandidate.apply(this, [shaft])

        // 获取 shaft 候选词所有数据 , 组装成 值:{位,索引(个数)}
        // let rel = {
        //     '1': {
        //         bit: 0b0100000001,
        //         index: [0, 8]
        //     },
        //     '3': {
        //         bit: 0b0100000001,
        //         index: [0, 8]
        //     },
        //     '4': {
        //         bit: 0b0100100011,
        //         index: [0, 1, 5, 8],
        //     },
        //     '5': {
        //         bit: 0b0000110000,
        //         index: [4, 5],
        //     },
        //     '6': {
        //         bit: 0b0100010010,
        //         index: [1, 4, 8]
        //     }
        // }
        let rel = {}
        shaftCandidate.forEach((candidate, shaftSection) => {

            if (!candidate.isEmpty()) {
                let nums = candidate.getNums()
                let index = isRow ? matrix.getIndex(shaftSection, shaft) : matrix.getIndex(shaft, shaftSection)

                let relObj
                nums.forEach((num) => {
                    relObj = rel[num]
                    if (!relObj) {
                        relObj = {
                            bit: BIT_EMPTY,
                            index: []
                        }
                    }
                    // console.log(bit,shaftSection,BIT_MAP[shaftSection])
                    relObj.bit = relObj.bit | BIT_MAP[isRow ? matrix.getRow(index) : matrix.getCol(index)]
                    // console.log('->',relObj.bit )
                    relObj.index.push(index)
                    rel[num] = relObj
                })

            }

        })

        let index2Map = []
        let index3Map = []

        for (let num in rel) {
            let relObj = rel[num]
            let {bit, index} = relObj
            if (index.length === 1) {
                // 候选词 索引数 为 1 直接填写答案
                this.writeAnswer(index[0], num)
            } else if (index.length === 2 ) {
                if (index2Map[bit]) {
                    index2Map[bit]['nums'].push(num)
                } else {
                    index2Map[bit] = {
                        nums: [num],
                        index
                    }
                }

            } else if (index.length === 3) {
                if (index3Map[bit]) {
                    index3Map[bit]['nums'].push(num)
                } else {
                    index3Map[bit] = {
                        nums: [num],
                        index
                    }
                }
            }

        }

        // let shaftLevel = parseInt(shaft / 3)s
        // let shaftLevelIncludes = range(3, (num) => shaftLevel * 3 + num).filter((num) => num !== shaft)
        // let self = this

        // 候选词 索引数 相同 且 位一致 提取 并宣告 同宫轴其他格子移除候选 (2) & (3)
        for (let indexBit in index2Map) {
            let indexObj = index2Map[indexBit]
            if (indexObj.nums.length === 2) {
                // 符合 宣告 同宫轴其他格子移除候选
                // other shaft remove num

                indexObj.index.forEach((index)=>{
                    this.getZoneCandidate(matrix.getZone(index)).forEach((candidate)=>{
                        if(isRow){
                            if(matrix.getCol(index) === shaft){
                                return
                            }
                        }else{
                            if(matrix.getRow(index) === shaft){
                                return
                            }
                        }
                        indexObj.nums.forEach(()=>{
                            candidate.remove(indexObj.nums)
                        })
                    })
                })

            }
        }

        for (let indexBit in index3Map) {
            let indexObj = index3Map[indexBit]
            if (indexObj.nums.length === 3) {
                // 符合 宣告 同宫轴其他格子移除候选
                // other shaft remove num

                indexObj.index.forEach((index)=>{
                    this.getZoneCandidate(matrix.getZone(index)).forEach((candidate)=>{
                        if(isRow){
                            if(matrix.getCol(index) === shaft){
                                return
                            }
                        }else{
                            if(matrix.getRow(index) === shaft){
                                return
                            }
                        }

                        indexObj.nums.forEach(()=>{
                            candidate.remove(indexObj.nums)
                        })
                    })
                })
            }
        }

    }

    zoneInternalCalculate(zone) {
        /**
         * 获取每宫的所有候选值
         * 计算 候选值 与 位置 的的映射表
         * 迭代 候选值 所持有的 位置 为 1 的 结果 即可填入答案
         */
        let rel = {}
        // 返回 zone 候选集
        let rows = [0, 1, 2]
        let cols = [0, 1, 2]
        let keyIndex = parseInt(zone / 3)
        let candidate, relObj, index

        rows.forEach((row) => {

            cols.forEach((col) => {
                index = keyIndex * 3 + row + (keyIndex * 3 + col) * 9
                candidate = this.candidate[index]
                if (candidate.isEmpty()) {
                    return
                }

                candidate.getNums().forEach((num) => {
                    relObj = rel[num]
                    if (!relObj) {
                        relObj = {
                            indexs: [],
                            zone
                        }
                    }
                    relObj.indexs.push(index)
                    rel[num] = relObj
                })
            })
        })

        for (let num in rel) {
            relObj = rel[num]
            if (relObj.indexs.length === 1) {
                this.writeAnswer(relObj.indexs[0], num)
            }
        }

    }

    rowCalculate() {
        // 行计算
        for (let col = 0; col < 9; ++col) {
            this.shaftInternalCalculate('row', col)
        }

    }

    colCalculate() {
        // 列计算
        for (let row = 0; row < 9; ++row) {
            this.shaftInternalCalculate('col', row)
        }
    }

    zoneCalculate() {
        // 宫计算
        for (let zone = 0; zone < 9; ++zone) {
            this.zoneInternalCalculate(zone)
        }
    }

    promoteCheck() {
        // 候选晋升检查
        this.candidate.forEach((calculate, index) => {
            let promote = calculate.promote()
            if (promote !== 0) {
                this.writeAnswer(index, promote)
            }
        })
    }

    writeAnswer(index, num) {
        num = parseInt(num)
        if(this.answer[index] !== 0){
            return
        }
        if(this.candidate[index].isEmpty()){
            return
        }
        if(index === 0){
            console.log('write answer 0',num)
            console.log(this.candidate[0])
        }
        this.answer[index] = num
        this.candidate[index].empty()
        let row = matrix.getRow(index)
        let col = matrix.getCol(index)
        let zone = matrix.getZone(index)

        // row remove num
        this.getRowCandidate(col).forEach((calculate) => {
            calculate.remove(num)
        })

        // col remove num
        this.getColCandidate(row).forEach((calculate) => {
            calculate.remove(num)
        })

        // zone remove num
        this.getZoneCandidate(zone).forEach((calculate) => {
            calculate.remove(num)
        })
    }

    /**
     * 计算答案
     */
    calculate() {
        if (this.status === Sudoku.STATUS_DONE) {
            return
        }
        if (this.status === Sudoku.STATUS_FAILURE) {
            this.debug()
            throw new Error('题目有误，无法计算')
        }
        while (this.status === Sudoku.STATUS_NONE && this.tryCount > 0) {
            // row 计算
            this.rowCalculate()
            // col 计算
            this.colCalculate()
            // zone 计算
            this.zoneCalculate()
            // 检查
            this.promoteCheck()

            // @TODO 使用checksum校验后再使用snapshot
            if (!this.snapshot) {
                this.snapshot = this.candidate.slice(0)
            } else {
                if (this.snapshot.toString() === this.candidate.toString()) {
                    this.tryCount--
                }
                if (this.tryCount <= 0) {
                    this.status = Sudoku.STATUS_FAILURE
                }
            }
        }

    }

    /**
     * 获取源数独题目
     * @returns {[]}
     */
    getSource() {
        return this.source
    }

    /**
     * 获取答案
     * @returns {*[]}
     */
    getAnswer() {
        return this.answer
    }

    /**
     * 获取完整数据
     * @returns {*[]}
     */
    getSudokuData() {
        return this.source.map((num, index) => num === -1 ? this.answer[index] : num)
    }

    debug() {
        console.log('--- debug info ---')
        console.log('candidate')
        console.table(this.candidate)
        console.log('source')
        formatPrint(this.source)
        console.log('answer')
        formatPrint(this.answer)
        formatPrint(this.getSudokuData())
        console.log('--- debug end ---')
    }
}

Sudoku.STATUS_NONE = 0  // 未计算
Sudoku.STATUS_DONE = 1  // 计算完成
Sudoku.STATUS_FAILURE = -1  // 计算失败

class ExposedSudoku {
    constructor(source) {
        this.sudoku = new Sudoku(source)
        this.sudoku.calculate()
    }

    debug() {
        this.sudoku.debug()
    }

    getSource() {
        return this.sudoku.getSource()
    }

    getAnswer() {
        return this.sudoku.getAnswer()
    }

    getSudokuData() {
        return this.sudoku.getSudokuData()
    }

}

module.exports = ExposedSudoku