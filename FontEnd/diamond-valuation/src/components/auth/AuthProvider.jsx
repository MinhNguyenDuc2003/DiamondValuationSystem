import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Ensure you import it correctly
import { idID } from "@mui/material/locale";
import { logout } from "../utils/ApiFunctions";
export const AuthContext = createContext({
  user: null,
  handleLogin: (token) => {},
  handleLogout: () => {},
  isRoleAccept: (role) => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const handleLogin = (token) => {
    try {
      const decodedUser = jwtDecode(token);
      setSubject(decodedUser);
      localStorage.setItem("userRoles", decodedUser.roles);
      localStorage.setItem("token", token);
      setUser(decodedUser);
    } catch (error) {
      console.error("Failed to decode JWT: ", error);
    }
  };

  const setSubject = (decodedUser) => {
    const items = decodedUser.sub.split(",");
    localStorage.setItem("userId", items[0]);
    localStorage.setItem("userName", items[1]);
  };

  const isRoleAccept = (role) => {
    const roles = localStorage.getItem("userRoles").split("/");
    const foundRoles = roles.filter((r) => r === role);
  
    return foundRoles.length > 0 ? foundRoles : null;
  };

  const handleLogout = async () => {
      const id = localStorage.getItem("userId");
      const response = await logout(id);
      if(response.status === 200){
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRoles");
        localStorage.removeItem("token");
        setUser(null);
      }
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout, isRoleAccept }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
