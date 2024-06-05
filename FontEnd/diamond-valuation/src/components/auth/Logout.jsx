import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, useAuth } from "./AuthProvider";

export const Logout = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const handleLogout = () => {
    auth.handleLogout();
    navigate("/login", { replace: true });
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
