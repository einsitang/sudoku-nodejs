import { Sudoku, generator } from "../../index.js";

test("sudoku generator", () => {
  const level = 4;
  const puzzle = generator(level);
  let sudoku = new Sudoku(puzzle);
  console.log(
    "this is puzzle can be copy to the clipboard : ",
    puzzle
  );
  console.log(sudoku.getPuzzle().join(","));
  expect(sudoku != null).toBe(true);
});
