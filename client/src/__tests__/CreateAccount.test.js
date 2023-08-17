import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import CreateAccount from "../components/CreateAccount";

// Mocking the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("CreateAccount", () => {
  it("navigates to '/' upon successful account creation", async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(<CreateAccount />);

    // Mocking a successful account creation response
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      status: 201,
    });

    // Fill out the form and submit
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "testpassword" },
    });
    fireEvent.change(screen.getByLabelText(/Role/i), {
      target: { value: "SITTER" },
    });
    fireEvent.click(screen.getByText(/Create Account/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("displays an error message on account creation failure", async () => {
    render(<CreateAccount />);

    // Mocking a response with a failure status
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      status: 403,
    });

    fireEvent.click(screen.getByText(/Create Account/i));

    await waitFor(() => {
      expect(screen.getByText(/Account Creation failed/i)).toBeInTheDocument();
    });
  });
});
