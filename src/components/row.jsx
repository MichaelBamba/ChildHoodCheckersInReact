import React, { Component } from "react";
import Square from "./square";

class Row extends Component {
  render() {
    let squares = this.props.row.map((square, i) => {
      return <Square key={i} val={square} row={this.props.rowNum} column={i} />;
    });
    return <div className="row">{squares}</div>;
  }
}
export default Row;
