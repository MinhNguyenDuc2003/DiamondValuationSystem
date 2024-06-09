import React from "react";
import { useState, useEffect } from "react";
import {
  deleteUserById,
  getUserById,
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
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

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "photo",
      headerName: "Photo",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        return (
          <Box display="flex" justifyContent="center">
            <img
              src={row.avatar}
              alt={row.first_name}
              style={{ width: 50, height: 50, borderRadius: "50%" }}
            />
          </Box>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      align: "center",
      headerAlign: "center",
      flex: 1.5,
    },
    {
      field: "fullName",
      headerName: "Full name",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      valueGetter: ({ row }) =>
        `${row.last_name || ""} ${row.first_name || ""}`,
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "enabled",
      headerName: "Enable",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row: { enabled } }) => {
        return (
          <>
            {enabled ? (
              <CheckCircleIcon sx={{ color: "green", fontSize: "35px" }} />
            ) : (
              <CheckCircleOutlineIcon sx={{ fontSize: "35px" }} />
            )}
          </>
        );
      },
    },
    {
      field: "role_names",
      headerName: "Role",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row: { role_names } }) => {
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            {role_names.split("/").map((role, index) => (
              <Typography key={index}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Typography>
            ))}
          </Box>
        );
      },
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        return (
          <Box>
            <IconButton onClick={() => handleOpenUserDetailDialog(row)}>
              <RemoveRedEyeIcon sx={{ color: "#C5A773" }} />
            </IconButton>
            <IconButton onClick={() => navigate(`/users/${row.id}`)}>
              <EditIcon sx={{ color: "#C5A773" }} />
            </IconButton>
            <IconButton onClick={() => handleOpenDialog(row.id)}>
              <DeleteIcon sx={{ color: "#C5A773" }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

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

      <Box
        m="20px 0 0 0"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#C5A773",
            borderBottom: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
          backgroundColor: "#EEE5D6",
        }}
      >
        <DataGrid
          rows={data.list_users}
          columns={columns}
          getRowId={(row) => row?.id}
          hideFooter
          disableColumnFilter
          disableColumnMenu
          disableRowSelectionOnClick
        />
      </Box>
      <Box display="flex" justifyContent="center">
        <Pagination
          count={data.total_page}
          page={currentPage}
          onChange={handleChange}
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
      {/* User Detail Dialog
      <Dialog
        open={openUserDetailDialog}
        onClose={handleCloseUserDetailDialog}
        aria-labelledby="user-detail-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="user-detail-dialog-title">User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography>
                <strong>Email:</strong> {selectedUser.email}
              </Typography>
              <Typography>
                <strong>Full Name:</strong>{" "}
                {`${selectedUser.last_name || ""} ${
                  selectedUser.first_name || ""
                }`}
              </Typography>
              <Typography>
                <strong>Phone Number:</strong> {selectedUser.phone_number}
              </Typography>
              <Typography>
                <strong>Enabled:</strong> {selectedUser.enabled ? "Yes" : "No"}
              </Typography>
              <Typography>
                <strong>Roles:</strong>{" "}
                {selectedUser.role_names
                  .split("/")
                  .map((role) => role.charAt(0).toUpperCase() + role.slice(1))
                  .join(", ")}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDetailDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
};

export default Users;
