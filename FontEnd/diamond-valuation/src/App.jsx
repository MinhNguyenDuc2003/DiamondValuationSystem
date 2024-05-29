import React from "react"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "/node_modules/bootstrap/dist/js/bootstrap.min.js"
import 'bootstrap-icons/font/bootstrap-icons.css'
import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom"
import './App.css'
import Login from "./components/auth/Login"
import Home from "./scenes/home/Home"
import NavBar from "./scenes/layout/NavBar"
import Users from "./scenes/users/Users"
import { AuthProvider } from "./components/auth/AuthProvider"
import AddUser from "./scenes/users/AddUser"
import EditUser from "./scenes/users/EditUser"
import Customers from "./scenes/customer/Customers"

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
    const isLoginRoute = location.pathname === '/login';

    return (
        <>
            {!isLoginRoute && <NavBar />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
				<Route path="/users" element={<Users/>} />
				<Route path="/customers" element={<Customers />} />
                <Route path="/users/new" element={<AddUser/>}/>
                <Route path="/users/:userid" element={<EditUser/>}/>
                {/* Thêm các Route khác cần NavBar tại đây */}
            </Routes>
        </>
    );
};

export default App;
