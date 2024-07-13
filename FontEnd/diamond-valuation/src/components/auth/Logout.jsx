import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, useAuth } from "./AuthProvider";

export const Logout = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const handleLogout = async () => {
    try {
      await auth.handleLogout(); // Wait for the logout to complete
      // navigate("/login", { replace: true }); // Then navigate to the login page
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally handle the error, e.g., show a message to the user
    }
  };

  return (
    <>
      <li>
        <Link className="dropdown-item" to={"/account"}>
          Your Account
        </Link>
      </li>
      <li>
        <hr className="dropdown-divider" />
      </li>
      <button className="dropdown-item" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
};

export default Logout;
