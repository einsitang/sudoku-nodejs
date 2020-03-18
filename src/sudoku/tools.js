const range = (max, cb) => {
    return [...Array(max).keys()].map(((num) => cb(num)))
}
const BIT_MAP = range(9, (num) => Math.pow(2, num))

const matrix = {
    getRow: (index) => {
        return index % 9
    },
    getCol: (index) => {
        return parseInt(index / 9)
    },
    getZone: (row, col) => {
        let index
        if (col === undefined) {
            index = row
        } else {
            index = col * 9 + row
        }

        row = matrix.getRow(index)
        col = matrix.getCol(index)

        let x = parseInt(row / 3)
        let y = parseInt(col / 3)
        return y * 3 + x
    },
    getIndex: (row, col) => {
        return col * 9 + row
    }
}

const formatPrint = (arr) => {
    let matrix = []
    let rows = []
    arr.forEach((num,index)=>{
        if(index % 9 === 0){
            rows = []
        }
        rows.push(num)
        if(rows.length === 9 ){
            matrix.push(rows)
        }
    })
    console.table(matrix)
}

module.exports = {
    range,
    matrix,
    formatPrint,
    BIT_MAP
}