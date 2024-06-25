import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import EditUser from "../scenes/users/EditUser";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import * as ApiFunctions from "../components/utils/ApiFunctions";

global.URL.createObjectURL = jest.fn(() => "mockedURL");

jest.mock("../components/utils/ApiFunctions", () => ({
  getRoles: jest.fn(),
  getUserById: jest.fn(),
  saveUser: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ userid: "112" }),
}));

describe("EditUser Component", () => {
  const mockUser = {
    id: "104",
    email: "a127@example.com",
    first_name: "Quan",
    last_name: "Nguyen",
    phone_number: "1234567890",
    enabled: true,
    role_ids: ["1", "2"],
  };

  const mockRoles = [
    { id: "1", name: "admin", description: "Admin Role" },
    { id: "2", name: "manager", description: "Manager Role" },
  ];

  beforeEach(async () => {
    ApiFunctions.getRoles.mockResolvedValue(mockRoles);
    ApiFunctions.getUserById.mockResolvedValue(mockUser);
  });

  test("EU - Fetch and Display User Data", async () => {
    await act(async () => {
      render(
        <Router>
          <EditUser />
        </Router>
      );
    });
    await waitFor(() => {
      expect(screen.getByLabelText(/e-mail/i).value).toBe(mockUser.email);
      expect(screen.getByLabelText(/first name/i).value).toBe(
        mockUser.first_name
      );
      expect(screen.getByLabelText(/last name/i).value).toBe(
        mockUser.last_name
      );
      expect(screen.getByLabelText(/phone number/i).value).toBe(
        mockUser.phone_number
      );
      expect(screen.getByLabelText(/enabled/i).checked).toBe(mockUser.enabled);
    });
  });

  test("EU - Submit Form with Valid Data", async () => {
    ApiFunctions.saveUser.mockResolvedValue({
      message: "User updated successfully",
    });

    await act(async () => {
      render(
        <Router>
          <EditUser />
        </Router>
      );
    });

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "new.email@example.com" },
    });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/users");
    });
  });

  test("EU - Cancel Form Submission", async () => {
    await act(async () => {
      render(
        <Router>
          <EditUser />
        </Router>
      );
    });
    fireEvent.click(screen.getByText(/cancel/i));

    expect(mockNavigate).toHaveBeenCalledWith("/users");
  });

  test("EU - Password Field Behavior", async () => {
    await act(async () => {
      render(
        <Router>
          <EditUser />
        </Router>
      );
    });
    const passwordInput = screen.getByLabelText(/password/i);

    expect(passwordInput.value).toBe("");
    fireEvent.change(passwordInput, { target: { value: "newPassword123" } });
    expect(passwordInput.value).toBe("newPassword123");

    fireEvent.change(passwordInput, { target: { value: "" } });
    expect(passwordInput.value).toBe("");
  });
});
