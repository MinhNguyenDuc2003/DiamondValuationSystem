import React, { useContext, useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Logout from "../../components/auth/Logout";

export const NavBar = () => {
  const [user, setUser] = useState({
    full_name: "",
    roles_name: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showAccount, setShowAccount] = useState(false);

  const handleAccountClick = () => {
    setShowAccount(!showAccount);
  };
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const roles = localStorage.getItem("userRoles");
    const token = localStorage.getItem("token") ? true : false;
    if (token) {
      setIsLoggedIn(true);
    }
    setUser({
      full_name: userName,
      roles_name: roles,
    });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark sticky-top">
      <Link to={"/"} className="navbar-brand">
        <span className="text-white ms-5">Diamond Valuation Admin</span>
      </Link>

      <button
        className="navbar-toggler text-white"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarScroll"
        aria-controls="navbarScroll"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse ms-5" id="navbarScroll">
        <ul className="navbar-nav me-auto my-2 my-lg-2 navbar-nav-scroll">
          <li className="nav-item">
            <NavLink
              className="nav-link text-white"
              aria-current="page"
              to={"/users"}
            >
              Users
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              className="nav-link text-white"
              aria-current="page"
              to={"/customers"}
            >
              Customers
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              className="nav-link text-white"
              aria-current="page"
              to={"/services"}
            >
              Services
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              className="nav-link text-white"
              aria-current="page"
              to={"/settings"}
            >
              Settings
            </NavLink>
          </li>
        </ul>

        <ul className="d-flex navbar-nav">
          <li className="nav-item dropdown">
            {user.full_name ? (
              <a
                className={`nav-link dropdown-toggle ${
                  showAccount ? "show" : ""
                } text-white`}
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={handleAccountClick}
              >
                {user.full_name}&nbsp; &nbsp;{"(" + user.roles_name + ")"}
              </a>
            ) : (
              <a
                className={`nav-link dropdown-toggle ${
                  showAccount ? "show" : ""
                } text-white bi bi-person-lines-fill ms-8`}
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ marginLeft: "125px" }}
                onClick={handleAccountClick}
              ></a>
            )}

            <ul
              className={`dropdown-menu ${showAccount ? "show" : ""} `}
              aria-labelledby="navbarDropdown"
            >
              {isLoggedIn ? (
                <Logout />
              ) : (
                <li>
                  <Link className="dropdown-item" to={"/login"}>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
