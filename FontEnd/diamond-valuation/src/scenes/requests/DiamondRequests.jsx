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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Requests = () => {
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [message, setMessage] = useState("");
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
  }, []);

  const handleDelete = async () => {
    const result = await deleteRequestById(requestToDelete);
    if (result !== undefined) {
      setMessage(`Delete request with id ${requestToDelete}  successfully!`);
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

  const handleOpenDialog = (request) => {
    setRequestToDelete(request.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRequestToDelete(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "customer_name", headerName: "Customer Name", width: 150 },
    { field: "customer_phone", headerName: "Customer Phone", width: 150 },
    { field: "note", headerName: "Note", width: 200 },
    { field: "service_names", headerName: "Services", width: 200 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => navigate(`requests/${params.row.id}`)}>
            <EditIcon sx={{ color: "#C5A773" }} />
          </IconButton>
          <IconButton onClick={() => handleOpenDialog(params.row)}>
            <DeleteIcon sx={{ color: "#C5A773" }} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Box p="20px" overflow="auto">
      <Typography variant="h4" textAlign="center">
        Manage Requests
      </Typography>

      <Box display="flex" justifyContent="space-between">
        <Link to={"/requests/new"}>
          <AddIcon sx={{ ml: "10px", fontSize: "40px", color: "black" }} />
        </Link>
      </Box>

      {message && (
        <div className="alert alert-success text-center">{message}</div>
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
            {data.map((request) => (
              <TableRow key={request.id}>
                <TableCell align="center">{request.id}</TableCell>
                <TableCell align="center">{request.customer_name}</TableCell>
                <TableCell align="center">{request.customer_phone}</TableCell>
                <TableCell align="center">{request.created_date}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
