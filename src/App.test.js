import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders 8x8 board", () => {
  const { Board } = render(<App />);

  expect({ Board }).toBeInTheDocument();
});
