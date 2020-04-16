import React, { Component } from "react";
import Row from "./row";

class Board extends Component {
  render() {
    let rows = this.props.board.map((row, i) => {
      return <Row key={i} row={row} rowNum={i} />;
    });
    return <div className="board">{rows}</div>;
  }
}
export default Board;
