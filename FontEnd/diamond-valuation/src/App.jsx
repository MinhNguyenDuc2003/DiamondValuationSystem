import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "/node_modules/bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Home from "./scenes/home/Home";
import Users from "./scenes/users/Users";
import { AuthProvider, useAuth } from "./components/auth/AuthProvider";
import AddUser from "./scenes/users/AddUser";
import EditUser from "./scenes/users/EditUser";
import Customers from "./scenes/customers/Customers";
import PrivateRoute from "./components/auth/PrivateRoute";
import AddCustomer from "./scenes/customers/AddCustomer";
import EditCustomer from "./scenes/customers/EditCustomer";

import SideBar from "./scenes/global/SideBar";

const App = () => {
  return (
    <AuthProvider>
      <main>
        <Router>
          <MainContent />
        </Router>
      </main>
    </AuthProvider>
  );
};

const MainContent = () => {
  const location = useLocation();
  const isLoginRoute = location.pathname === "/login";

  return (
    <>
      { !isLoginRoute && <SideBar /> }

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              {" "}
              <Home />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              {" "}
              <Users />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              {" "}
              <Customers />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/users/new"
          element={
            <PrivateRoute>
              {" "}
              <AddUser />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:userid"
          element={
            <PrivateRoute>
              {" "}
              <EditUser />{" "}
            </PrivateRoute>
          }
        />
        {/* Thêm các Route khác cần NavBar tại đây */}
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              {" "}
              <Customers />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/customers/new"
          element={
            <PrivateRoute>
              {" "}
              <AddCustomer />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/customers/:customerid"
          element={
            <PrivateRoute>
              {" "}
              <EditCustomer />{" "}
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
