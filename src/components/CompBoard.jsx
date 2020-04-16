import React, { Component } from "react";
import Board from "./board";

class Comp extends Component {
  constructor() {
    super();
    this.state = { board: this.makeBoard(8), turn: 1 };
  }
  makeBoard(num) {
    let b = Array(num).fill(Array(num).fill(null));
    // make players
    let p1 = this.makePlayerRows(1, num);
    let p2 = this.makePlayerRows(2, num);

    b[0] = p1.even;
    b[1] = p1.odd;
    b[num - 1] = p2.odd;
    b[num - 2] = p2.even;

    return b;
  }
  makePlayerRows(p, num) {
    let evenRow = [];
    let oddRow = [];
    for (let i = 0; i < num; i++) {
      if (i % 2 == 0) {
        evenRow.push(p);
        oddRow.push(null);
      } else {
        oddRow.push(p);
        evenRow.push(null);
      }
    }
    return { even: evenRow, odd: oddRow };
  }
  render() {
    return (
      <div className="boardArray">
        <Board board={this.state.board} />
      </div>
    );
  }
}
export default Comp;
