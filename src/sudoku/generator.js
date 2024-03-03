const { matrix, range, shuffle } = require("./tools");
const Sudoku = require("./core");

const internalGenerate = (digHolePuzzle, digHoleCount) => {
  // random candidate indexes each try dig hole operation
  let fixedPositions = range(
    9,
    (num) => matrix.getZoneIndexs(num)[Math.random(9)]
  ).sort();

  let arr = [];
  digHolePuzzle.map((_, index) => {
    if (fixedPositions.length > 0 && fixedPositions[0] == index) {
      fixedPositions.splice(0, 1);
      return;
    }
    arr.push(index);
  });
  let candidateHoles = shuffle(arr);
  // each dig hole operation will use strict sudoku to solve make sure is one solution
  // cycle done when dig hole enough , one solution sudoku is generated
  let digHoleFulfill = 0;
  for (let candidateHoleIndex in candidateHoles) {
    if (digHoleFulfill >= digHoleCount) {
      break;
    }

    let position = candidateHoles[candidateHoleIndex];
    if (digHolePuzzle[position] != -1) {
      let old = digHolePuzzle[position];
      digHolePuzzle[position] = -1;
      // use sudoku solver to solve with strict , that will make sure one solution
      try {
        digHoleFulfill++;
        new Sudoku(digHolePuzzle, true);
      } catch (_) {
        digHolePuzzle[position] = old;
        digHoleFulfill--;
      }
    }
  }

  if (digHoleFulfill == digHoleCount) {
    return digHolePuzzle;
  }

  return 0;
};

// generator max job limit
const MAX_JOB_COUNT_LIMIT = 4;
const generate = (digHoleCount, jobCount) => {
  if (jobCount >= MAX_JOB_COUNT_LIMIT) {
    // internal generate do many times , reduce the difficulty
    console.debug(
      `reduce the difficulty : ${digHoleCount} -> ${digHoleCount - 2}`
    );
    jobCount = 1;
    digHoleCount -= 2;
  }

  // create center zone puzzle to make simple puzzle
  let p = 0;
  let shuffleNums = shuffle(range(9, (num) => num));
  let simplePuzzle = range(81, (index) => {
    if (matrix.getZone(index % 9, index / 9) == 4) {
      return shuffleNums[p++] + 1;
    }
    return -1;
  });

  // solve the base puzzle with normal sudoku
  let baseSudoku = new Sudoku(simplePuzzle);
  let baseAnswer = baseSudoku.getSolution();

  let puzzle = internalGenerate(baseAnswer, digHoleCount);
  if (puzzle == 0) {
    return generate(digHoleCount, jobCount + 1);
  }
  return puzzle;
};
/**
 * 数读生成器
 * @param level 0 - 4
 * @author EinsiTang
 */
module.exports = (level = 0) => {
  // level to make dig hold count
  let digHoleCount = 38;
  switch (level) {
    case 0:
      digHoleCount = 38;
      break;
    case 1:
      digHoleCount = 43;
      break;
    case 2:
      digHoleCount = 50;
      break;
    case 3:
      digHoleCount = 55;
      break;
    case 4:
      digHoleCount = 58;
      break;
    default:
      throw new Error(`please input level [0 - 4]`);
  }

  return generate(digHoleCount, 1);
};
