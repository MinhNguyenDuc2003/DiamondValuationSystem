import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Login from "../components/auth/Login"
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter as Router
import "@testing-library/jest-dom"

test('should redirect after successful login', () => {
    render(<Router>
        <Login />
      </Router>)
    
    // Find input fields by their labels
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Simulate user input in the fields
    fireEvent.change(emailInput, { target: { value: "1231234@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    // Find and click on the submit button
    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    expect(window.location.pathname).toBe("/");
});

test("should display error message for invalid credentials", async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    // Find input fields by their labels
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Simulate user input in the fields
    fireEvent.change(emailInput, { target: { value: "invalid@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    // Find and click on the submit button
    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(screen.getByText(/Invalid email or password. Please try again./i)).toBeInTheDocument();
    })
});