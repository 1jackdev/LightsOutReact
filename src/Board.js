import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = 0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let y = 0; y < nrows; y++) {
      let row = [];
      for (let x = 0; x < ncols; x++) {
        const val = Math.random() < chanceLightStartsOn;
        row.push(val);
      }
      initialBoard.push(row);
    }

    return initialBoard;
  }

  function hasWon() {
    // if every cell in every row is false, we've won
    return board.every((row) => row.every((cell) => !cell));
  }

  function flipCellsAround(coords) {
    setBoard((oldBoard) => {
      const [y, x] = coords.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if these coords are actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // make a copy of the board that we can play with
      const boardCopy = oldBoard.map((row) => [...row]);

      // flip this cell
      flipCell(y, x, boardCopy);
      // flip cell to the left
      flipCell(y, x - 1, boardCopy);
      // flip cell to the right
      flipCell(y, x + 1, boardCopy);
      // flip cell below
      flipCell(y - 1, x, boardCopy);
      // flip cell above
      flipCell(y + 1, x, boardCopy);

      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else

  if (hasWon()) {
    return <div>You win!</div>;
  }

  let tableBoard = [];

  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coords = `${y}-${x}`;
      row.push(
        <Cell
          key={coords}
          //isLit is the bool value at board[y][x]
          isLit={board[y][x]}
          flipCellsAroundMe={() => flipCellsAround(coords)}
        />
      );
    }
    tableBoard.push(<tr key={y}>{row}</tr>);
  }

  return (
    <table className="Board">
      <tbody>{tableBoard}</tbody>
    </table>
  );
}

export default Board;
