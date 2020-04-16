import React, { Component } from "react";

class Square extends Component {
  render() {
    let color = (this.props.row + this.props.column) % 2 == 0 ? "red" : "black";
    let classes = "square " + color;
    let square = null;
    //if (this.props.)
    return <div className={classes}>{this.props.val}</div>;
  }
}
export default Square;
