import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import DiamondIcon from "@mui/icons-material/Diamond";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DescriptionIcon from "@mui/icons-material/Description";
import ReportIcon from "@mui/icons-material/Report";
import { useAuth } from "../../components/auth/AuthProvider";

const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link to={to} />}
      rootStyles={{
        "& .ps-active": {
          color: "#C5A773",
        },
      }}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [user, setUser] = useState({
    full_name: "",
    roles_name: "",
  });
  // Authorized
  const auth = useAuth();
  const isAuthorized =
    auth.isRoleAccept("admin") || auth.isRoleAccept("manager");

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const roles = localStorage.getItem("userRoles");
    setUser({
      full_name: userName,
      roles_name: roles,
    });
  }, []);

  return (
    <Box>
      <Sidebar
        collapsed={isCollapsed}
        backgroundColor="#EEE5D6 !important"
        style={{ height: "100vh" }}
      >
        <Menu iconShape="square">
          {/* Logo and menu icon */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography
                  variant="h3"
                  // color={colors.grey[100]}
                >
                  ADMINIS
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* USER */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  //   src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>

              <Box textAlign="center">
                <Typography
                  variant="h5"
                  //   color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user.full_name}
                </Typography>
                <Typography
                  variant="h6"
                  // color={colors.greenAccent[500]}
                >
                  {user.roles_name.split("/").map((role, index) => (
                    <Typography key={index}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Typography>
                  ))}
                </Typography>
              </Box>
            </Box>
          )}

          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashbord"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              //   color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Manage Team"
              to="/users"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Customers"
              to="/customers"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Services"
              to="/services"
              icon={<DiamondIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Requests"
              to="/requests"
              icon={<RequestPageIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Certificates"
              to="/certificates"
              icon={<ReceiptLongIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Rapaport"
              to="/rapaport"
              icon={<DescriptionIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {isAuthorized && (
              <Box>
                <Typography
                  variant="h6"
                  //   color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Manager
                </Typography>
                <Item
                  title="Manage Reports"
                  to="/managereports"
                  icon={<ReportIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>
            )}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SideBar;
