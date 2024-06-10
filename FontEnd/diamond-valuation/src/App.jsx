import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Home from "./scenes/home/Home";
import NavBar from "./scenes/global/NavBar";
import Users from "./scenes/users/Users";
import { AuthProvider, useAuth } from "./components/auth/AuthProvider";
import AddUser from "./scenes/users/AddUser";
import EditUser from "./scenes/users/EditUser";
import Customers from "./scenes/customers/Customers";
import PrivateRoute from "./components/auth/PrivateRoute";
import AddCustomer from "./scenes/customers/AddCustomer";
import EditCustomer from "./scenes/customers/EditCustomer";
import SideBar from "./scenes/global/SideBar";
import Services from "./scenes/services/Services";
import Topbar from "./scenes/global/TopBar";
import AddService from "./scenes/services/AddService";
import EditService from "./scenes/services/EditService";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

const MainContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="app">
      {!isLoginPage && <SideBar />}
      <main className={"content"}>
        {!isLoginPage && <Topbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/new"
            element={
              <PrivateRoute>
                <AddUser />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/:userid"
            element={
              <PrivateRoute>
                <EditUser />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <Customers />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/new"
            element={
              <PrivateRoute>
                <AddCustomer />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/:customerid"
            element={
              <PrivateRoute>
                <EditCustomer />
              </PrivateRoute>
            }
          />
          <Route
            path="/services"
            element={
              <PrivateRoute>
                <Services />
              </PrivateRoute>
            }
          />
          <Route
            path="/services/new"
            element={
              <PrivateRoute>
                <AddService />
              </PrivateRoute>
            }
          />
          <Route
            path="/services/:serviceid"
            element={
              <PrivateRoute>
                <EditService />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
