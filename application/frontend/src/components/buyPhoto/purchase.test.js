import React from "react";
import { useLocation } from "react-router-dom";
import { render } from "@testing-library/react";
import Purchase from "./Purchase";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
}));

describe("Purchase component", () => {
  beforeEach(() => {
    useLocation.mockReturnValue({
      pathname: "/purchase",
      search: "",
      hash: "",
      state: {
        postedBy: "John Doe",
        phoneNumber: "5554567890",
        email: "johndoe@example.com",
      },
    });
  });

  test("Purchase component renders header and purchase details", () => {
    const props = {
      postedBy: "John Doe",
      phoneNumber: "5554567890",
      email: "johndoe@example.com",
    };
    const { getByText } = render(<Purchase {...props} />);
    expect(getByText("Buy Photo")).toBeInTheDocument();
    expect(
      getByText((content, element) => content.startsWith("Posted By:"))
    ).toBeInTheDocument();
    expect(
      getByText((content, element) => content.startsWith("Phone:"))
    ).toBeInTheDocument();
    expect(getByText("Email: johndoe@example.com")).toBeInTheDocument();
  });
});
