import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Users from "./scenes/users/Users";
import { AuthProvider } from "./components/auth/AuthProvider";
import AddUser from "./scenes/users/AddUser";
import EditUser from "./scenes/users/EditUser";
import Customers from "./scenes/customers/Customers";
import PrivateRoute from "./components/routes/PrivateRoute";
import AddCustomer from "./scenes/customers/AddCustomer";
import EditCustomer from "./scenes/customers/EditCustomer";
import Services from "./scenes/services/Services";
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
import WorkAssignment from "./scenes/manager/WorkAssignment";
import SlotTimeManagement from "./scenes/manager/ManageSlotTime";
import Layout from "./scenes/layout/Layout";
import Daily from "./scenes/daily/Daily";
// import React, { Suspense, lazy } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import {
//   Routes,
//   Route,
//   useLocation,
//   Navigate,
//   BrowserRouter,
// } from "react-router-dom";
// import { CircularProgress } from "@mui/material";
// import "./App.css";
// import Login from "./components/auth/Login";
// import PrivateRoute from "./components/routes/PrivateRoute";
// import ManagerRoute from "./components/routes/ManagerRoute";
// import ValuationRoute from "./components/routes/ValuationRoute";
// import StaffRoute from "./components/routes/StaffRoute";
// import Layout from "./scenes/layout/Layout";
// import NotFound from "./scenes/error/NotFound";
// import { AuthProvider } from "./components/auth/AuthProvider";

// // Lazy-loaded components
// const Users = lazy(() => import("./scenes/users/Users"));
// const AddUser = lazy(() => import("./scenes/users/AddUser"));
// const EditUser = lazy(() => import("./scenes/users/EditUser"));
// const Customers = lazy(() => import("./scenes/customers/Customers"));
// const AddCustomer = lazy(() => import("./scenes/customers/AddCustomer"));
// const EditCustomer = lazy(() => import("./scenes/customers/EditCustomer"));
// const Services = lazy(() => import("./scenes/services/Services"));
// const AddService = lazy(() => import("./scenes/services/AddService"));
// const EditService = lazy(() => import("./scenes/services/EditService"));
// const Requests = lazy(() => import("./scenes/requests/DiamondRequests"));
// const AddDiamondRequest = lazy(() =>
//   import("./scenes/requests/AddDiamondRequest")
// );
// const EditDiamondRequest = lazy(() =>
//   import("./scenes/requests/EditDiamondRequest")
// );
// const Certificates = lazy(() => import("./scenes/certificates/Certificates"));
// const CreateCertificate = lazy(() =>
//   import("./scenes/certificates/CreateCertificate")
// );
// const EditCertificate = lazy(() =>
//   import("./scenes/certificates/EditCertificate")
// );
// const Dashboard = lazy(() => import("./scenes/home/Dashboard"));
// const Rapaport = lazy(() => import("./scenes/rapaport/Rapaport"));
// const Report = lazy(() => import("./scenes/report/Report"));
// const ManageReports = lazy(() => import("./scenes/manager/ManageReports"));
// const UpdateAccount = lazy(() => import("./scenes/users/UpdateAccount"));
// const Overview = lazy(() => import("./scenes/overview/Overview"));
// const WorkAssignment = lazy(() => import("./scenes/manager/WorkAssignment"));
// const SlotTimeManagement = lazy(() =>
//   import("./scenes/manager/ManageSlotTime")
// );
// const Daily = lazy(() => import("./scenes/daily/Daily"));

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
      {/* <Suspense fallback={<CircularProgress />}> */}
      <Routes>
        {isLoginPage ? (
          <Route path="/login" element={<Login />} />
        ) : (
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
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
                  <StaffRoute>
                    <Customers />
                  </StaffRoute>
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
              path="/reports"
              element={
                <PrivateRoute>
                  <ManagerRoute>
                    <ManageReports />
                  </ManagerRoute>
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
                  <ManagerRoute>
                    <Overview />
                  </ManagerRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/daily"
              element={
                <PrivateRoute>
                  <ManagerRoute>
                    <Daily />
                  </ManagerRoute>
                </PrivateRoute>
              }
            />

            {/* Work Assignment */}
            <Route
              path="/workassignment"
              element={
                <PrivateRoute>
                  <ManagerRoute>
                    <WorkAssignment />
                  </ManagerRoute>
                </PrivateRoute>
              }
            />

            {/* Slot Time */}
            <Route
              path="/slottime"
              element={
                <PrivateRoute>
                  <ManagerRoute>
                    <SlotTimeManagement />
                  </ManagerRoute>
                </PrivateRoute>
              }
            />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        )}
      </Routes>
      {/* </Suspense> */}
    </div>
  );
};

export default App;
