import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Users from "../scenes/users/Users"; // Assuming this is the component exporting Users
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

import {
  getUsersPerPage,
  deleteUserById,
} from "../components/utils/ApiFunctions";

// Mock the API functions
jest.mock("../components/utils/ApiFunctions");

describe("Users Component", () => {
  beforeEach(() => {
    getUsersPerPage.mockResolvedValue({
      list_users: [
        {
          id: 1,
          avatar: "https://example.com/avatar1.jpg",
          email: "user1@example.com",
          first_name: "User",
          last_name: "One",
          phone_number: "1234567890",
          enabled: true,
          role_names: "admin",
        },
        {
          id: 2,
          avatar: "https://example.com/avatar2.jpg",
          email: "user2@example.com",
          first_name: "User",
          last_name: "Two",
          phone_number: "0987654321",
          enabled: false,
          role_names: "admin",
        },
      ],
      total_page: 1,
    });

    deleteUserById.mockResolvedValue({});
  });

  test("Open Delete Confirmation Dialog", async () => {
    render(
      <Router>
        <Users />
      </Router>
    );

    // Wait for users to be loaded
    await waitFor(() => {
      expect(screen.getByText("Manage Users")).toBeInTheDocument();
    });

    // Click on the delete button of the first user
    const deleteButton = screen.getByTestId("delete-button-1");
    fireEvent.click(deleteButton);

    // Check if the delete confirmation dialog opens
    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this user?")
    ).toBeInTheDocument();
  });

  test("Confirm Delete Action", async () => {
    render(
      <Router>
        <Users />
      </Router>
    );

    // Wait for users to be loaded
    await waitFor(() => {
      expect(screen.getByText("Manage Users")).toBeInTheDocument();
    });

    // Click on the delete button of the first user
    const deleteButton = screen.getByTestId("delete-button-1");
    fireEvent.click(deleteButton);

    // Check if the delete confirmation dialog opens
    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this user?")
    ).toBeInTheDocument();

    // Click on the delete button in the dialog
    const confirmDeleteButton = screen.getByText("Delete");
    fireEvent.click(confirmDeleteButton);

    // Wait for the delete function to be called
    await waitFor(() => {
      expect(deleteUserById).toHaveBeenCalledWith(1);
    });
  });

  test("opens delete confirmation dialog and cancels delete action", async () => {
    render(
      <Router>
        <Users />
      </Router>
    );

    // Wait for users to be loaded
    await waitFor(() => {
      expect(screen.getByText("Manage Users")).toBeInTheDocument();
    });

    // Click on the delete button of the first user
    const deleteButton = screen.getByTestId("delete-button-1");
    fireEvent.click(deleteButton);

    // Check if the delete confirmation dialog opens
    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this user?")
    ).toBeInTheDocument();

    // Click on the cancel button in the dialog
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // Check if the delete confirmation dialog closes
    await waitFor(() => {
      expect(screen.queryByText("Confirm Delete")).not.toBeInTheDocument();
    });
  });
});
