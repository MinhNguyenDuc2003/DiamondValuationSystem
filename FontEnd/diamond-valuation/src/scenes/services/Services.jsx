import React from "react";
import { useState, useEffect } from "react";
import {
<<<<<<< HEAD
  deleteServiceById,
  getAllServices,
=======
  deleteCustomerById,
  getAllServices,
  getCustomersPerPage,
>>>>>>> master
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
<<<<<<< HEAD
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
=======
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
>>>>>>> master
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
<<<<<<< HEAD
import ServiceDetailsDialog from "./ServiceDetailDialog";

export const Services = () => {
  console.log(localStorage.getItem("userId"));
=======

export const Services = () => {
>>>>>>> master
  const [data, setData] = useState({
    list_services: [],
  });
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [serviceToDelete, setserviceToDelete] = useState(null);
  const [error, setError] = useState("");

<<<<<<< HEAD
  const [openServiceDetailDialog, setOpenServiceDetailDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

=======
>>>>>>> master
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
    getAllServices()
      .then((data) => {
        setData({
          list_services: data,
        });
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

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
<<<<<<< HEAD
    const result = await deleteServiceById(serviceToDelete);
=======
    const result = await deleteCustomerById(serviceToDelete);
>>>>>>> master
    if (result !== undefined) {
      setMessage(`Delete user with id ${serviceToDelete}  successfully!`);
      getAllServices()
        .then((data) => {
          setData({
            list_services: data,
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

<<<<<<< HEAD
  const handleOpenDialog = (service) => {
    setserviceToDelete(service);
=======
  const handleOpenDialog = (customer) => {
    setserviceToDelete(customer);
>>>>>>> master
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setserviceToDelete(null);
  };

<<<<<<< HEAD
  const handleOpenServiceDetailDialog = (service) => {
    setSelectedService(service);
    setOpenServiceDetailDialog(true);
  };

  const handleCloseServiceDetailDialog = () => {
    setOpenServiceDetailDialog(false);
    setSelectedService(null);
  };

  return (
    <Box p="20px" overflow="auto">
      <Typography variant="h4" textAlign="center">
        Manage services
      </Typography>

      <Box display="flex" justifyContent="space-between">
        <Link to={"/services/new"}>
          <AddIcon sx={{ ml: "10px", fontSize: "40px", color: "black" }} />
=======
  return (
    <Box p="20px" overflow="auto">
      <Typography variant="h4" textAlign="center">
        Manage Services
      </Typography>

      <Box display="flex" justifyContent="space-between">
        <Link to="/services/new">
          <AddIcon
            sx={{
              ml: "10px",
              fontSize: "40px",
              color: "black",
            }}
          />
>>>>>>> master
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
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Money</TableCell>
<<<<<<< HEAD
              <TableCell align="center">Content</TableCell>
=======
>>>>>>> master
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#EEE5D6" }}>
            {data.list_services.map((service) => (
              <TableRow key={service.id}>
                <TableCell align="center">{service.id}</TableCell>
                <TableCell align="center">{service.name}</TableCell>
                <TableCell align="center">{service.money}</TableCell>
<<<<<<< HEAD
                <TableCell align="center">{service.content}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleOpenServiceDetailDialog(service)}
                  >
                    <RemoveRedEyeIcon sx={{ color: "#C5A773" }} />
                  </IconButton>
                  <IconButton
                    onClick={() => navigate(`/services/${service.id}`)}
                  >
                    <EditIcon sx={{ color: "#C5A773" }} />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDialog(service.id)}>
=======
                <TableCell align="center">
                  <IconButton
                    onClick={() => navigate(`/customers/${service.id}`)}
                  >
                    <EditIcon sx={{ color: "#C5A773" }} />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDialog(id)}>
>>>>>>> master
                    <DeleteIcon sx={{ color: "#C5A773" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
<<<<<<< HEAD

=======
>>>>>>> master
      <Box display="flex" justifyContent="center">
        <Pagination
          count={data.total_page}
          page={currentPage}
          onChange={handleChange}
        />
      </Box>

<<<<<<< HEAD
      <ServiceDetailsDialog
        open={openServiceDetailDialog}
        handleClose={handleCloseServiceDetailDialog}
        service={selectedService}
      />

=======
>>>>>>> master
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
            Are you sure you want to delete this service?
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

export default Services;