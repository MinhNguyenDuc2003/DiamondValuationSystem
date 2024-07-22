// import { useState, useEffect } from "react";
// import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
// import { Box, IconButton, Typography } from "@mui/material";
// import { Link } from "react-router-dom";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
// import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
// import DiamondIcon from "@mui/icons-material/Diamond";
// import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
// import RequestPageIcon from "@mui/icons-material/RequestPage";
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import DescriptionIcon from "@mui/icons-material/Description";
// import ReportIcon from "@mui/icons-material/Report";
// import TodayIcon from "@mui/icons-material/Today";
// import EventNoteIcon from "@mui/icons-material/EventNote";
// import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
// import { useAuth } from "../../components/auth/AuthProvider";

// const Item = ({ title, to, icon, selected, setSelected }) => {
//   return (
//     <MenuItem
//       active={selected === title}
//       onClick={() => setSelected(title)}
//       icon={icon}
//       component={<Link to={to} />}
//       rootStyles={{
//         "& .ps-active": {
//           color: "#C5A773",
//         },
//       }}
//     >
//       <Typography>{title}</Typography>
//     </MenuItem>
//   );
// };
// const SideBar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [selected, setSelected] = useState("Dashboard");
//   const [user, setUser] = useState({
//     full_name: "",
//     roles_name: "",
//   });
//   const [number, setNumber] = useState(0);
//   // Authorized
//   const auth = useAuth();
//   const isAuthorized =
//     auth.isRoleAccept("admin") || auth.isRoleAccept("manager");

//   useEffect(() => {
//     const userName = localStorage.getItem("userName");
//     const roles = localStorage.getItem("userRoles");
//     setUser({
//       full_name: userName,
//       roles_name: roles,
//     });
//   }, []);

//   return (
//     <Box>
//       <Sidebar
//         collapsed={isCollapsed}
//         backgroundColor="#EEE5D6 !important"
//         style={{ overflow: "auto", height: "100vh" }}
//       >
//         <Menu iconShape="square">
//           {/* Logo and menu icon */}
//           <MenuItem
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
//             style={{
//               margin: "10px 0 20px 0",
//             }}
//           >
//             {!isCollapsed && (
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 ml="15px"
//               >
//                 <Typography
//                   variant="h3"
//                   // color={colors.grey[100]}
//                 >
//                   ADMINIS
//                 </Typography>
//                 <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
//                   <MenuOutlinedIcon />
//                 </IconButton>
//               </Box>
//             )}
//           </MenuItem>

//           {/* USER */}
//           {!isCollapsed && (
//             <Box mb="25px">
//               <Box display="flex" justifyContent="center" alignItems="center">
//                 <img
//                   alt="profile-user"
//                   width="100px"
//                   height="100px"
//                   //   src={`../../assets/user.png`}
//                   style={{ cursor: "pointer", borderRadius: "50%" }}
//                 />
//               </Box>

//               <Box textAlign="center">
//                 <Typography
//                   variant="h5"
//                   //   color={colors.grey[100]}
//                   fontWeight="bold"
//                   sx={{ m: "10px 0 0 0" }}
//                 >
//                   {user.full_name}
//                 </Typography>
//                 <Typography
//                   variant="h6"
//                   // color={colors.greenAccent[500]}
//                 >
//                   {user.roles_name.split("/").map((role, index) => (
//                     <Typography key={index}>
//                       {role.charAt(0).toUpperCase() + role.slice(1)}
//                     </Typography>
//                   ))}
//                 </Typography>
//               </Box>
//             </Box>
//           )}

//           {/* MENU ITEMS */}
//           <Box paddingLeft={isCollapsed ? undefined : "10%"}>
//             <Item
//               title="Dashbord"
//               to="/"
//               icon={<HomeOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />

//             <Typography
//               variant="h6"
//               //   color={colors.grey[300]}
//               sx={{ m: "15px 0 5px 20px" }}
//             >
//               Data
//             </Typography>
//             <Item
//               title="Manage Team"
//               to="/users"
//               icon={<PeopleOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Customers"
//               to="/customers"
//               icon={<ContactsOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Services"
//               to="/services"
//               icon={<DiamondIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Overview"
//               to="/overview"
//               icon={<PointOfSaleIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title={"Requests"}
//               to="/requests"
//               icon={<RequestPageIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Certificates"
//               to="/certificates"
//               icon={<ReceiptLongIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Rapaport"
//               to="/rapaport"
//               icon={<DescriptionIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             {isAuthorized && (
//               <Box>
//                 <Typography
//                   variant="h6"
//                   //   color={colors.grey[300]}
//                   sx={{ m: "15px 0 5px 20px" }}
//                 >
//                   Manager
//                 </Typography>
//                 <Item
//                   title="Manage Reports"
//                   to="/reports"
//                   icon={<ReportIcon />}
//                   selected={selected}
//                   setSelected={setSelected}
//                 />
//                 <Item
//                   title="Work Assignment"
//                   to="/workassignment"
//                   icon={<TodayIcon />}
//                   selected={selected}
//                   setSelected={setSelected}
//                 />
//                 <Item
//                   title="Manage Slot Time"
//                   to="/slottime"
//                   icon={<EventNoteIcon />}
//                   selected={selected}
//                   setSelected={setSelected}
//                 />
//               </Box>
//             )}
//           </Box>
//         </Menu>
//       </Sidebar>
//     </Box>
//   );
// };

// export default SideBar;

import React from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import DiamondIcon from "@mui/icons-material/Diamond";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DescriptionIcon from "@mui/icons-material/Description";
import ReportIcon from "@mui/icons-material/Report";
import TodayIcon from "@mui/icons-material/Today";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "../../components/common/FlexBetween";
import { useAuth } from "../../components/auth/AuthProvider";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlinedIcon />,
  },
  {
    text: "Client Facing",
    icon: null,
  },
  {
    text: "Customers",
    icon: <GroupsIcon />,
  },
  {
    text: "Services",
    icon: <DiamondIcon />,
  },
  {
    text: "Requests",
    icon: <RequestPageIcon />,
  },
  {
    text: "Certificates",
    icon: <ReceiptLongIcon />,
  },
  {
    text: "Rapaport",
    icon: <DescriptionIcon />,
  },
  {
    text: "Statistics",
    icon: null,
  },
  {
    text: "Overview",
    icon: <TodayIcon />,
  },
  {
    text: "Daily",
    icon: <TodayIcon />,
  },
  {
    text: "Management",
    icon: null,
  },
  {
    text: "Users",
    icon: <PeopleOutlinedIcon />,
  },
  {
    text: "Reports",
    icon: <ReportIcon />,
  },
  {
    text: "WorkAssignment",
    icon: <TodayIcon />,
  },
  {
    text: "SlotTime",
    icon: <EventNoteIcon />,
  },
];

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();

  const auth = useAuth();
  const isAuthorized =
    auth.isRoleAccept("admin") || auth.isRoleAccept("manager");

  const isValuationStaff = auth.isRoleAccept("valuationStaff");

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: "#997d3d",
              backgroundColor: "#21295c",
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={"#ffe3a3"}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h4" fontWeight="bold" color="#ffe3a3">
                    ADMINIS
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeftIcon sx={{ color: "#ffe3a3" }} />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                if (
                  !isAuthorized &&
                  (text === "Management" ||
                    text === "Users" ||
                    text === "Reports" ||
                    text === "WorkAssignment" ||
                    text === "SlotTime" ||
                    text === "Statistics" ||
                    text === "Overview" ||
                    text === "Daily")
                ) {
                  return;
                }

                if (isValuationStaff && text === "Customers") {
                  return;
                }

                if (!icon) {
                  return (
                    <Typography
                      key={text}
                      sx={{ m: "2.25rem 0 1rem 3rem", color: "white" }}
                    >
                      {text}
                    </Typography>
                  );
                }

                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText ? "#ffe3a3" : "transparent",
                        color: active === lcText ? "#191F45" : "#f0f0f0",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color: active === lcText ? "#191F45" : "#ffedc2",
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightIcon sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
