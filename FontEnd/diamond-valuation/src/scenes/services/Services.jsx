import React from "react";
import { useState, useEffect } from "react";
import {
  deleteServiceById,
  getAllServices,
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
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import ServiceDetailsDialog from "./ServiceDetailDialog";

export const Services = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [serviceToDelete, setserviceToDelete] = useState(null);
  const [error, setError] = useState("");

  const [openServiceDetailDialog, setOpenServiceDetailDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

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
        setData(data);
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
    const result = await deleteServiceById(serviceToDelete);
    if (result !== undefined) {
      setMessage(`Delete user with id ${serviceToDelete}  successfully!`);
      getAllServices()
        .then((data) => {
          setData(data);
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

  const handleOpenDialog = (service) => {
    setserviceToDelete(service);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setserviceToDelete(null);
  };

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
              <TableCell align="center">Content</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#EEE5D6" }}>
            {data.map((service) => (
              <TableRow key={service.id}>
                <TableCell align="center">{service.id}</TableCell>
                <TableCell align="center">{service.name}</TableCell>
                <TableCell align="center">${service.money}</TableCell>
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

      <ServiceDetailsDialog
        open={openServiceDetailDialog}
        handleClose={handleCloseServiceDetailDialog}
        service={selectedService}
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
