import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Topbar from "../scenes/global/TopBar";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter as Router
import "@testing-library/jest-dom"


test('should redirect after successful logout', () => {
    render(<Router>
          <Topbar />
      </Router>)
    
    // Open the account menu
    fireEvent.click(screen.getByTestId("person-icon-button"));

    // Click the logout button
    fireEvent.click(screen.getByText(/logout/i));

    expect(window.location.pathname).toBe("/login");
});

test("should handle logout correctly and clear data", () => {
    render(
      <Router>
          <Topbar />
      </Router>
    );

    // Open the account menu
    fireEvent.click(screen.getByTestId("person-icon-button"));

    // Click the logout button
    fireEvent.click(screen.getByText(/logout/i));


    // Check if localStorage is cleared
    expect(localStorage.getItem("userId")).toBeNull();
});
