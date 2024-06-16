import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllRequests,
  deleteRequestById,
} from "../../components/utils/ApiFunctions";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Dialog,
  InputLabel,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  FormControl,
  Select,
  MenuItem,
  TableBody,
  TableCell,
  TableContainer,
  TextField,
  TableHead,
  TableRow,
  Pagination,
  Paper,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Requests = () => {
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const requestsPerPage = 6;

  const navigate = useNavigate();

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
    getAllRequests()
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error.message);
      });
    setTimeout(() => {
      setError("");
    }, 2000);
  }, []);

  const handleDelete = async () => {
    const result = await deleteRequestById(requestToDelete);
    if (result !== undefined) {
      setMessage(`Delete request with id ${requestToDelete}  successfully!`);
      getAllRequests()
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

  const handleOpenDialog = (request) => {
    setRequestToDelete(request.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRequestToDelete(null);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handlePhoneFilterChange = (event) => {
    setPhoneFilter(event.target.value);
  };

  const filteredData = data.filter(
    (request) =>
      (statusFilter ? request.status === statusFilter : true) &&
      (phoneFilter ? request.customer_phone.includes(phoneFilter) : true)
  );

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredData.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box p="20px" overflow="auto">
      <Typography variant="h4" textAlign="center">
        Manage Requests
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 2, mb: 2 }}
      >
        <Link to={"/requests/new"}>
          <AddIcon sx={{ ml: "10px", fontSize: "40px", color: "black" }} />
        </Link>

        <Box>
          <TextField
            label="Customer Phone"
            type="number"
            // variant="outlined"
            value={phoneFilter}
            onChange={handlePhoneFilterChange}
          />

          <FormControl sx={{ minWidth: 120, ml: "10px" }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="WAIT">WAIT</MenuItem>
              <MenuItem value="NEW">NEW</MenuItem>
              <MenuItem value="PROCESSING">PROCESSING</MenuItem>
              <MenuItem value="PROCESSED">PROCESSED</MenuItem>
              <MenuItem value="DONE">DONE</MenuItem>
              <MenuItem value="BLOCKREQUEST">BLOCKREQUEST</MenuItem>
              <MenuItem value="BLOCKED">BLOCKED</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#C5A773" }}>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Customer Name</TableCell>
              <TableCell align="center">Customer Phone</TableCell>
              <TableCell align="center">Created Date</TableCell>
              <TableCell align="center">Note</TableCell>
              <TableCell align="center">Service</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#EEE5D6" }}>
            {currentRequests.length > 0 ? (
              currentRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell align="center">{request.id}</TableCell>
                  <TableCell align="center">{request.customer_name}</TableCell>
                  <TableCell align="center">{request.customer_phone}</TableCell>
                  <TableCell align="center">
                    {formatDate(request.created_date)}
                  </TableCell>
                  <TableCell align="center">{request.note}</TableCell>
                  <TableCell align="center">{request.service_names}</TableCell>
                  <TableCell align="center">{request.status}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => navigate(`/requests/${request.id}`)}
                    >
                      <EditIcon sx={{ color: "#C5A773" }} />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDialog(request)}>
                      <DeleteIcon sx={{ color: "#C5A773" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No requests available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredData.length / requestsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this request?
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

export default Requests;
