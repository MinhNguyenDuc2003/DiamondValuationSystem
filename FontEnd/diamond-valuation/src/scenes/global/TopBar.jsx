// import {
//   Box,
//   IconButton,
//   Menu,
//   MenuItem,
//   Divider,
//   ListItemIcon,
// } from "@mui/material";
// import InputBase from "@mui/material/InputBase";
// import Logout from "@mui/icons-material/Logout";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import SearchIcon from "@mui/icons-material/Search";
// import { useAuth } from "../../components/auth/AuthProvider";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// const Topbar = () => {
//   const auth = useAuth();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();
//   const userId = localStorage.getItem("userId");

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     auth.handleLogout();
//     navigate("/login", { replace: true });
//   };

//   return (
//     <Box display="flex" justifyContent="space-between" p={2}>
//       {/* SEARCH BAR */}
//       <Box
//         display="flex"
//         // backgroundColor={colors.primary[400]}
//         borderRadius="30px"
//         border="1px solid black"
//       >
//         <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
//         <IconButton type="button" sx={{ p: 1 }}>
//           <SearchIcon />
//         </IconButton>
//       </Box>

//       {/* ICONS */}
//       <Box display="flex">
//         <IconButton>
//           <NotificationsOutlinedIcon />
//         </IconButton>

//         <IconButton>
//           <SettingsOutlinedIcon />
//         </IconButton>

//         <IconButton
//           onClick={handleClick}
//           size="small"
//           aria-controls={open ? "account-menu" : undefined}
//           aria-haspopup="true"
//           aria-expanded={open ? "true" : undefined}
//           data-testid="person-icon-button"
//         >
//           <PersonOutlinedIcon />
//         </IconButton>
//       </Box>

//       <Menu
//         anchorEl={anchorEl}
//         id="account-menu"
//         open={open}
//         onClose={handleClose}
//         onClick={handleClose}
//         transformOrigin={{ horizontal: "right", vertical: "top" }}
//         anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//       >
//         <MenuItem onClick={() => navigate(`/users/${userId}`)}>
//           Your Account
//         </MenuItem>
//         <Divider />
//         <MenuItem onClick={handleLogout}>
//           <ListItemIcon>
//             <Logout fontSize="small" />
//           </ListItemIcon>
//           Logout
//         </MenuItem>
//       </Menu>
//     </Box>
//   );
// };

// export default Topbar;

import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  InputBase,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../../components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const Topbar = () => {
  const auth = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async() => {
    await auth.handleLogout();
    navigate("/login", { replace: true });
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={isMobile ? 1 : 2}
      flexDirection={isMobile ? "column" : "row"}
      alignItems={isMobile ? "flex-start" : "center"}
    >
      {/* SEARCH BAR */}
      <Box
        display="flex"
        borderRadius="30px"
        border="1px solid black"
        width={isMobile ? "100%" : "auto"}
        mb={isMobile ? 1 : 0}
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box
        display="flex"
        justifyContent={isMobile ? "flex-end" : "center"}
        width={isMobile ? "100%" : "auto"}
      >
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>

        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          data-testid="person-icon-button"
        >
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => navigate(`/account/information`)}>
          Your Account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Topbar;
