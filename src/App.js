import React from "react";
import "./game.css";
import Board from "./components/board";
import * as Aid from "./components/HelperFunctions";

const InitBoard = Aid.initBoard;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.getBoard(),
      history: [
        {
          boardState: this.getBoard(),
          currentPlayer: true,
        },
      ],
      currentPlayer: true,
      moves: [],
      clicks: [false, false],
      squareCoords: [-1, -1],
      stepNumber: 0,
      isWinner: false,
    };
  }

  onClickHandle(rowIndex, colIndex) {
    const { board, clicks, currentPlayer, squareCoords } = this.state;
    const currentState = this.getCurrentState();
    const tempBoard = this.cloneBoard(currentState.boardState);
    let clickedSquare = board[rowIndex][colIndex];
    let firstClick = clicks[0];
    let secondClick = clicks[1];

    if (
      clickedSquare === "-" ||
      (clickedSquare.charAt(0) !== (currentPlayer ? "R" : "B") &&
        clickedSquare !== "O")
    )
      return;

    if (
      firstClick === false ||
      clickedSquare === (currentPlayer ? "R" : "B") ||
      clickedSquare === (currentPlayer ? "RK" : "BK")
    ) {
      squareCoords[0] = rowIndex;
      squareCoords[1] = colIndex;
      firstClick = true;
    }

    if (clickedSquare === "O") {
      firstClick = false;
      secondClick = true;
    }

    if (firstClick === true) {
      const res = this.checkOptionalMoves(
        tempBoard,
        rowIndex,
        colIndex,
        clickedSquare
      );
      tempBoard[rowIndex][colIndex] = "H";

      for (let i = 0; i < res.length; ++i) {
        const { row, col } = res[i];
        tempBoard[row][col] = "O";
      }

      this.setState({
        board: tempBoard,
        clicks: [firstClick, secondClick],
        moves: res,
      });
      return;
    }

    if (secondClick === true) {
      clickedSquare = tempBoard[squareCoords[0]][squareCoords[1]];
      const { moves } = this.state;
      const flag = Aid.isKing(rowIndex, clickedSquare, currentPlayer);
      console.log(flag);
      Aid.replaceSquare(
        tempBoard,
        rowIndex,
        colIndex,
        flag ? flag : clickedSquare
      );
      Aid.replaceSquare(tempBoard, squareCoords[0], squareCoords[1], "-");

      if (moves.length > 0) {
        for (let i = 0; i < moves.length; ++i) {
          const { row, col, deleteList } = moves[i];
          if (row === rowIndex && col === colIndex) {
            for (let j = 0; j < deleteList.length; ++j) {
              const { row, col } = deleteList[j];
              Aid.replaceSquare(tempBoard, row, col, "-");
            }
            i = moves.length;
          }
        }
      }

      const winner = Aid.evaluateWinner(tempBoard);

      this.setState({
        board: tempBoard,
        currentPlayer: !this.state.currentPlayer,
        history: this.state.history.concat([
          {
            boardState: tempBoard,
            currentPlayer: !this.state.currentPlayer,
          },
        ]),
        stepNumber: this.state.history.length,
        squareCoords: [-1, -1],
        isWinner: winner,
      });
      return;
    }
  }

  checkOptionalMoves(board, rowIndex, colIndex, clickedSquare) {
    const { currentPlayer } = this.state;
    const optionalMoves = [];
    const playerDirection = [];
    const leftRight = [-1, 1];
    const isKing = clickedSquare.length > 1 ? true : false;
    if (currentPlayer) playerDirection.push(-1);
    else playerDirection.push(1);

    if (isKing) playerDirection.push(playerDirection[0] * -1);

    for (let i = 0; i < playerDirection.length; ++i) {
      for (let j = 0; j < leftRight.length; ++j) {
        const row = rowIndex + playerDirection[i];
        const col = colIndex + leftRight[j];
        if (Aid.checkBounds(row, col, currentPlayer)) continue;
        const squareValue = board[row][col];
        if (squareValue === "-") {
          const move = {
            row: row,
            col: col,
            deleteList: [],
          };
          optionalMoves.push(move);
        }
      }
    }
    let prevSquare = { row: rowIndex, col: colIndex };
    const jumps = this.checkOptionalJumps(
      board,
      rowIndex,
      colIndex,
      prevSquare,
      playerDirection,
      [],
      []
    );
    optionalMoves.push(...jumps);
    return optionalMoves;
  }

  checkOptionalJumps(
    board,
    rowIndex,
    colIndex,
    prevSquare,
    playerDirection,
    deleteList,
    optionalMoves
  ) {
    const { currentPlayer } = this.state;
    const leftRight = [-1, 1];
    let { row, col, rowJump, colJump, squareValue } = 0;

    for (let i = 0; i < playerDirection.length; ++i) {
      for (let j = 0; j < leftRight.length; ++j) {
        row = rowIndex + playerDirection[i];
        col = colIndex + leftRight[j];
        if (Aid.checkBounds(row, col)) continue;
        squareValue = board[row][col];
        if ((currentPlayer ? "B" : "R") === squareValue.charAt(0)) {
          rowJump = rowIndex + 2 * playerDirection[i];
          colJump = colIndex + 2 * leftRight[j];
          if (Aid.checkBounds(rowJump, colJump)) continue;
          squareValue = board[rowJump][colJump];
          if (prevSquare.row === rowJump && prevSquare.col === colJump)
            continue;
          if (squareValue === "-") {
            const move = {
              row: rowJump,
              col: colJump,
              deleteList: [{ row: row, col: col }],
            };
            for (let i = 0; i < deleteList.length; ++i)
              move.deleteList.push(deleteList[i]);
            optionalMoves.push(move);
          }
        }
      }
    }

    const temp = [];
    for (let i = 0; i < optionalMoves.length; ++i) {
      prevSquare = { row: rowIndex, col: colIndex };
      const { row, col, deleteList } = optionalMoves[i];
      const nextJumps = this.checkOptionalJumps(
        board,
        row,
        col,
        prevSquare,
        playerDirection,
        deleteList,
        []
      );
      temp.push(...nextJumps);
    }
    optionalMoves.push(...temp);
    return optionalMoves;
  }

  getCurrentState() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    return history[history.length - 1];
  }

  getBoard = () => {
    return this.cloneBoard(InitBoard);
  };

  cloneBoard(array) {
    return array.map((o) => [...o]);
  }

  render() {
    const { board, isWinner, currentPlayer } = this.state;
    let status = null;
    if (isWinner) status = isWinner + " is the winner !!!";
    else status = currentPlayer ? "Player 1's turn" : "Player 2's turn";

    return (
      <div>
        <h1 className="Title"> Checkers </h1>
        <div className={"status"}>
          <h2>status: {status} </h2>
        </div>
        <div className="center">
          {board.map((row, i) => (
            <div className="board-row" key={i}>
              {row.map((col, j) => (
                <Board
                  symbol={col}
                  key={j * 10}
                  onClick={() => this.onClickHandle(i, j)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Game;
