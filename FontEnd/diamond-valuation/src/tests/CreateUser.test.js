import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddUser from "../scenes/users/AddUser";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter as Router
import "@testing-library/jest-dom";
import * as ApiFunctions from "../components/utils/ApiFunctions";

global.URL.createObjectURL = jest.fn(() => "mockedURL");
jest.mock("../components/utils/ApiFunctions", () => ({
  saveUser: jest.fn(),
  getRoles: jest.fn(),
}));

describe("AddUser Component", () => {
  test("Handle Image Upload and Preview", async () => {
    render(
      <Router>
        <AddUser />
      </Router>
    );
    const fileInput = screen.getByLabelText(/photos/i);
    const file = new File(["dummy content"], "NA1.png", {
      type: "image/png",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(
      () => {
        const img = screen.getByAltText(/Photos preview/i);
        expect(img).toBeInTheDocument();
        expect(img.src).toContain("mockedURL");
      },
      { timeout: 1000 }
    );
  });

  test("Submit Form with Valid Data", async () => {
    // Mock the getRoles function to return roles
    ApiFunctions.getRoles.mockResolvedValue([
      { id: "1", name: "admin", description: "admin role" },
      { id: "2", name: "manager", description: "manager role" },
    ]);

    // Mock the saveUser function to simulate a successful response
    ApiFunctions.saveUser.mockResolvedValue({
      message: "User added successfully",
    });

    render(
      <Router>
        <AddUser />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: "1234567890" },
    });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => expect(window.location.pathname).toBe("/users"));
  });
  test("Submit Form with Existed Email or Invalid Email", async () => {
    ApiFunctions.saveUser.mockResolvedValue({
      message: undefined,
    });

    render(
      <Router>
        <AddUser />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "a124@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: "1234567890" },
    });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(
      () => {
        expect(screen.getByText(/Your email is invalid/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  test("Cancel Form Submission", () => {
    render(
      <Router>
        <AddUser />
      </Router>
    );

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(window.location.pathname).toBe("/users");
  });
});
