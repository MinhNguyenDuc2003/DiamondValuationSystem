import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Users from "./scenes/users/Users";
import { AuthProvider, useAuth } from "./components/auth/AuthProvider";
import AddUser from "./scenes/users/AddUser";
import EditUser from "./scenes/users/EditUser";
import Customers from "./scenes/customers/Customers";
import PrivateRoute from "./components/routes/PrivateRoute";
import AddCustomer from "./scenes/customers/AddCustomer";
import EditCustomer from "./scenes/customers/EditCustomer";
import SideBar from "./scenes/global/SideBar";
import Services from "./scenes/services/Services";
import Topbar from "./scenes/global/TopBar";
import AddService from "./scenes/services/AddService";
import EditService from "./scenes/services/EditService";
import Requests from "./scenes/requests/DiamondRequests";
import AddDiamondRequest from "./scenes/requests/AddDiamondRequest";
import EditDiamondRequest from "./scenes/requests/EditDiamondRequest";
import Certificates from "./scenes/certificates/Certificates";
import CreateCertificate from "./scenes/certificates/CreateCertificate";
import Dashboard from "./scenes/home/Dashboard";
import Rapaport from "./scenes/rapaport/Rapaport";
import Report from "./scenes/report/Report";
import EditCertificate from "./scenes/certificates/EditCertificate";
import ManageReports from "./scenes/manager/ManageReports";
import UpdateAccount from "./scenes/users/UpdateAccount";
import ManagerRoute from "./components/routes/ManagerRoute";
import NotFound from "./scenes/error/NotFound";
import ValuationRoute from "./components/routes/ValuationRoute";
import StaffRoute from "./components/routes/StaffRoute";
import Overview from "./scenes/overview/Overview";

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
      <PrivateRoute>{!isLoginPage && <SideBar />}</PrivateRoute>
      <main className={"content"}>
        <PrivateRoute>{!isLoginPage && <Topbar />}</PrivateRoute>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Users */}

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
                <ManagerRoute>
                  <AddUser />
                </ManagerRoute>
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

          {/* Customers */}

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

          {/* Services */}

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
                <ManagerRoute>
                  <AddService />
                </ManagerRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/services/:serviceid"
            element={
              <PrivateRoute>
                <ManagerRoute>
                  <EditService />
                </ManagerRoute>
              </PrivateRoute>
            }
          />

          {/* Requests */}

          <Route
            path="/requests"
            element={
              <PrivateRoute>
                <Requests />
              </PrivateRoute>
            }
          />

          <Route
            path="/requests/new"
            element={
              <PrivateRoute>
                <StaffRoute>
                  <AddDiamondRequest />
                </StaffRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/requests/:requestid"
            element={
              <PrivateRoute>
                <StaffRoute>
                  <EditDiamondRequest />
                </StaffRoute>
              </PrivateRoute>
            }
          />

          {/* Certificates */}

          <Route
            path="/certificates/"
            element={
              <PrivateRoute>
                <Certificates />
              </PrivateRoute>
            }
          />
          <Route
            path="/certificates/:certificateId"
            element={
              <PrivateRoute>
                <ValuationRoute>
                  <EditCertificate />
                </ValuationRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/create-certificate/:requestId"
            element={
              <PrivateRoute>
                <ValuationRoute>
                  <CreateCertificate />
                </ValuationRoute>
              </PrivateRoute>
            }
          />

          {/* Rapaport */}
          <Route
            path="/rapaport"
            element={
              <PrivateRoute>
                <Rapaport />
              </PrivateRoute>
            }
          />

          {/* Report */}
          <Route
            path="/report/:requestId"
            element={
              <PrivateRoute>
                <StaffRoute>
                  <Report />
                </StaffRoute>
              </PrivateRoute>
            }
          />

          {/* Manager */}
          <Route
            path="/managereports"
            element={
              <PrivateRoute>
                <ManageReports />
              </PrivateRoute>
            }
          />
          <Route
            path="/account/information"
            element={
              <PrivateRoute>
                <UpdateAccount />
              </PrivateRoute>
            }
          />
          <Route
            path="/overview"
            element={
              <PrivateRoute>
                <Overview />
              </PrivateRoute>
            }
          />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
