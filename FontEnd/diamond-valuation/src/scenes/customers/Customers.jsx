import React from "react";
import { useState, useEffect } from "react";
import {
  deleteCustomerById,
  getCustomersPerPage,
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
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import CustomerDetailsDialog from "./CustomerDetailDialog";

export const Customers = () => {
  const [data, setData] = useState({
    list_customers: [],
    total_page: 0,
  });
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [error, setError] = useState("");

  const [openCustomerDetailDialog, setOpenCustomerDetailDialog] =
    useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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
    getCustomersPerPage(currentPage, filteredData)
      .then((data) => {
        setData({
          list_customers: data.list_customers,
          total_page: data.total_page,
        });
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [currentPage, filteredData]);

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const handleDelete = async () => {
    const result = await deleteCustomerById(customerToDelete);
    if (result !== undefined) {
      setMessage(`Delete customer with id ${customerToDelete}  successfully!`);
      getCustomersPerPage(currentPage, filteredData)
        .then((data) => {
          setData({
            list_customers: data.list_customers,
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

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (e) => {
    let value = e.target.value;
    setFilteredData(value);
  };

  const processChange = debounce((e) => handleSearchChange(e));

  const handleOpenDialog = (customer) => {
    setCustomerToDelete(customer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCustomerToDelete(null);
  };

  const handleOpenCustomerDetailDialog = (customer) => {
    setSelectedCustomer(customer);
    setOpenCustomerDetailDialog(true);
  };

  const handleCloseCustomerDetailDialog = () => {
    setOpenCustomerDetailDialog(false);
    setSelectedCustomer(null);
  };

  return (
    <Box p="20px" overflow="auto">
      <Typography variant="h4" textAlign="center">
        Manage Customers
      </Typography>

      <Box display="flex" justifyContent="space-between">
        <Link to="/customers/new">
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
        <Alert severity="success" sx={{ justifyContent: "center" }}>
          {message}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#C5A773" }}>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Fullname</TableCell>
              <TableCell align="center">Phone Number</TableCell>
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Enable</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#EEE5D6" }}>
            {data.list_customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell align="center">{customer.id}</TableCell>
                <TableCell align="center">{customer.created_time}</TableCell>
                <TableCell align="center">{customer.email}</TableCell>
                <TableCell align="center">
                  {customer.last_name} {customer.first_name}
                </TableCell>
                <TableCell align="center">{customer.phone_number}</TableCell>
                <TableCell align="center">{customer.location}</TableCell>
                <TableCell align="center">
                  {customer.enabled ? (
                    <CheckCircleIcon
                      sx={{ color: "green", fontSize: "35px" }}
                    />
                  ) : (
                    <CheckCircleOutlineIcon sx={{ fontSize: "35px" }} />
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleOpenCustomerDetailDialog(customer)}
                  >
                    <RemoveRedEyeIcon sx={{ color: "#C5A773" }} />
                  </IconButton>
                  <IconButton
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <EditIcon sx={{ color: "#C5A773" }} />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDialog(customer.id)}>
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

      <CustomerDetailsDialog
        open={openCustomerDetailDialog}
        handleClose={handleCloseCustomerDetailDialog}
        customer={selectedCustomer}
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this customer?
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
    </Box>
  );
};

export default Customers;
