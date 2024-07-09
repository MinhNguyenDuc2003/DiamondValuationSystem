import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllRequests,
  updateRequestStatus,
} from "../../components/utils/ApiFunctions";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Alert,
  Pagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import BuildIcon from "@mui/icons-material/Build";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import BlockIcon from "@mui/icons-material/Block";

const statusColors = {
  WAIT: "warning",
  NEW: "primary",
  PROCESSING: "info",
  PROCESSED: "secondary",
  DONE: "success",
  BLOCKREQUEST: "error",
  BLOCKED: "error",
};

const statusIcons = {
  WAIT: <WatchLaterIcon />,
  NEW: <NewReleasesIcon />,
  PROCESSING: <BuildIcon />,
  PROCESSED: <DoneAllIcon />,
  DONE: <DoneIcon />,
  BLOCKREQUEST: <BlockIcon />,
  BLOCKED: <BlockIcon />,
};

const ManageRequest = () => {
  const [requests, setRequests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [requestToManage, setRequestToManage] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const requestsPerPage = 9;

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
  }, []);

  useEffect(() => {
    getAllRequests()
      .then((data) => {
        // Filter requests with status BLOCKREQUEST
        const blockRequests = data.filter(
          (request) => request.status === "BLOCKREQUEST"
        );
        setRequests(blockRequests);
      })
      .catch((error) => setError(error.message));

    setTimeout(() => {
      setError("");
    }, 2000);
  }, []);

  const handleUpdateStatus = async (status) => {
    if (requestToManage) {
      const result = await updateRequestStatus(requestToManage.id, status);
      if (result !== undefined) {
        setMessage(
          `Request ${requestToManage.id} status updated to ${status}!`
        );
        getAllRequests()
          .then((data) => setRequests(data))
          .catch((error) => setError(error.message));
        handleCloseDialog();
        setTimeout(() => {
          setMessage("");
        }, 1000);
      }
    }
  };

  const handleOpenDialog = (request) => {
    setRequestToManage(request);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRequestToManage(null);
  };

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = requests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box p="20px" overflow="auto">
      <Typography variant="h4" textAlign="center">
        Manage Requests
      </Typography>

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

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {currentRequests.length > 0 ? (
          currentRequests.map((request) => (
            <Grid item xs={12} sm={6} md={4} key={request.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Request ID: {request.id}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Note: {request.note}
                  </Typography>
                  <Chip
                    label={request.status}
                    color={statusColors[request.status]}
                    icon={statusIcons[request.status]}
                    variant="outlined"
                    sx={{ mt: 2 }}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog(request)}
                  >
                    View Detail
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" textAlign="center" mt={2} width="100%">
            No requests found.
          </Typography>
        )}
      </Grid>

      <Pagination
        count={Math.ceil(requests.length / requestsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          m: 2,
        }}
      />

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="manage-request-dialog-title"
        aria-describedby="manage-request-dialog-description"
      >
        <DialogTitle id="manage-request-dialog-title">
          Manage Request: {requestToManage?.id}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="manage-request-dialog-description">
            <Typography variant="body1" paragraph>
              <strong>Request ID: </strong> {requestToManage?.id}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Customer Name:</strong> {requestToManage?.customer_name}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Customer Phone: </strong>
              {requestToManage?.customer_phone}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Note: </strong>
              {requestToManage?.note}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Service Names: </strong> {requestToManage?.service_names}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Payment Method: </strong>{" "}
              {requestToManage?.payment_method}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Total: </strong>
              {requestToManage?.total}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Paid: </strong>
              {requestToManage?.paid ? "Yes" : "No"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Created Date: </strong>
              {new Date(requestToManage?.created_date).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Appointment Date: </strong>
              {requestToManage?.appoinment_date}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Appointment Time: </strong>{" "}
              {requestToManage?.appoinment_time}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleUpdateStatus("BLOCKED")}
            autoFocus
            sx={{ color: "white", backgroundColor: "green" }}
            variant="contained"
          >
            Accept
          </Button>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: "white", backgroundColor: "red" }}
            variant="contained"
          >
            Decline
          </Button>
          <Button
            onClick={handleCloseDialog}
            sx={{ backgroundColor: "grey" }}
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageRequest;
