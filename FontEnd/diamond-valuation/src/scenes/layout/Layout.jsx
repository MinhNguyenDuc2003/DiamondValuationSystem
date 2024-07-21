import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import NavBar from "../global/NavBar";
import { Outlet } from "react-router-dom";
import { getUserById } from "../../components/utils/ApiFunctions";
// import SideBar from "../global/SideBar";
import Sidebar from "../global/SideBar";

const Layout = () => {
  const [user, setUser] = useState({
    photo: "",
    full_name: "",
    roles_name: "",
  });
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          // Handle case where userId is not found
          console.error("UserId is not found in localStorage");
          // Optionally redirect to login or show an error
          return;
        }
        const userName = localStorage.getItem("userName");
        const roles = localStorage.getItem("userRoles");
        const useredit = await getUserById(userId);
        setUser({
          photo: useredit.photo,
          full_name: userName,
          roles_name: roles,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1}>
        <NavBar
          user={user}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
