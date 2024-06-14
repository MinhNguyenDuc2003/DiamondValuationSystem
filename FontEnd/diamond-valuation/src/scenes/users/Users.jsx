import React from "react";
import { useState, useEffect } from "react";
import {
  deleteUserById,
  getUsersPerPage,
} from "../../components/utils/ApiFunctions";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import {
  Box,
  Button,
  IconButton,
  Typography,
  InputBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import UserDetailsDialog from "./UserDetailsDialog";

export const Users = () => {
  const [data, setData] = useState({
    list_users: [],
    total_page: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [openUserDetailDialog, setOpenUserDetailDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenDialog = (user) => {
    setUserToDelete(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUserToDelete(null);
  };

  const handleOpenUserDetailDialog = (user) => {
    setSelectedUser(user);
    setOpenUserDetailDialog(true);
  };

  const handleCloseUserDetailDialog = () => {
    setOpenUserDetailDialog(false);
    setSelectedUser(null);
  };

  const location = useLocation();

  useEffect(() => {
    const successMessage = localStorage.getItem("successMessage");
    if (successMessage) {
      setMessage(successMessage);
      localStorage.removeItem("successMessage");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }, [location.state?.message]);

  useEffect(() => {
    fetchUsers(currentPage, filteredData);
  }, [currentPage, filteredData]);

  const fetchUsers = async (page, filter) => {
    try {
      const data = await getUsersPerPage(page, filter);
      setData({ list_users: data.list_users, total_page: data.total_page });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    const result = await deleteUserById(userToDelete);
    if (result !== undefined) {
      setMessage(`Delete user with id ${userToDelete}  successfully!`);
      getUsersPerPage(currentPage, filteredData)
        .then((data) => {
          setData({
            list_users: data.list_users,
            total_page: data.total_page,
          });
        })
        .catch((error) => {
          setError(error.message);
        });
      handleCloseDialog();
      setTimeout(() => {
        setMessage("");
      }, 1000);
    }
  };

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const handleSearchChange = (e) => {
    let value = e.target.value;
    setFilteredData(value);
  };

  const processChange = debounce((e) => handleSearchChange(e));

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box m="20px" overflow="auto">
      <Typography variant="h4" textAlign="center">
        Manage Users
      </Typography>

      <Box display="flex" justifyContent="space-between">
        <Link to="/users/new">
          <PersonAddAlt1Icon
            sx={{
              ml: "10px",
              fontSize: "40px",
              color: "black",
            }}
          />
        </Link>
        <Box
          display="flex"
          width="20%"
          border="1px solid black"
          borderRadius="30px"
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            onChange={(e) => processChange(e)}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      {message && (
        <div className="alert alert-success text-center">{message}</div>
      )}

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#C5A773" }}>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Photo</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Fullname</TableCell>
              <TableCell align="center">Phone Number</TableCell>
              <TableCell align="center">Enable</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#EEE5D6" }}>
            {data.list_users.map((user) => (
              <TableRow key={user.id}>
                <TableCell align="center">{user.id}</TableCell>
                <TableCell align="center">
                  <img
                    src={user.avatar}
                    alt={user.first_name}
                    style={{ width: 50, height: 50, borderRadius: "50%" }}
                  />
                </TableCell>
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">
                  {user.last_name} {user.first_name}
                </TableCell>
                <TableCell align="center">{user.phone_number}</TableCell>
                <TableCell align="center">
                  {user.enabled ? (
                    <CheckCircleIcon
                      sx={{ color: "green", fontSize: "35px" }}
                    />
                  ) : (
                    <CheckCircleOutlineIcon sx={{ fontSize: "35px" }} />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    {user.role_names.split("/").map((role, index) => (
                      <Typography key={index}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Typography>
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenUserDetailDialog(user)}>
                    <RemoveRedEyeIcon sx={{ color: "#C5A773" }} />
                  </IconButton>
                  <IconButton onClick={() => navigate(`/users/${user.id}`)}>
                    <EditIcon sx={{ color: "#C5A773" }} />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDialog(user.id)}>
                    <DeleteIcon sx={{ color: "#C5A773" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Pagination
          count={data.total_page}
          page={currentPage}
          onChange={handleChange}
          color="primary"
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Delete
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <UserDetailsDialog
        open={openUserDetailDialog}
        handleClose={handleCloseUserDetailDialog}
        user={selectedUser}
      />
    </Box>
  );
};

export default Users;
