import React from "react";
import { render, screen } from "@testing-library/react";
import Post from "./Post";

describe("Post", () => {
  it("renders the component without errors", () => {
    render(<Post />);
    expect(screen.getByText("Picture Perfect")).toBeInTheDocument();
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("ImageField")).toBeInTheDocument();
    expect(screen.getByText("FilterEffect")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });
});
