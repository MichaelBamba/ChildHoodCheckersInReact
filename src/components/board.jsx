import React from "react";
import "../index.css";

export default function Board({ symbol, onClick }) {
  if (
    symbol === "R" ||
    symbol === "B" ||
    symbol === "H" ||
    symbol === "RK" ||
    symbol === "BK"
  ) {
    return (
      <button className={"square checker-g"}>
        <div className={"player-" + symbol} onClick={onClick}></div>
      </button>
    );
  }

  if (symbol === "O") {
    return (
      <button className={"square checker-O"} onClick={onClick}>
        <div className={"player-O"}></div>
      </button>
    );
  }

  if (symbol === "-") {
    return (
      <button className="square checker-g" onClick={onClick}>
        <div> </div>
      </button>
    );
  }

  if (symbol === "null") {
    return <div className="square checker-w"></div>;
  }
}
