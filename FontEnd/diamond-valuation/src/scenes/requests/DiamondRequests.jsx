import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllRequests,
  deleteRequestById,
  getAllServices,
  getRequestTracking,
  getCertificateById,
  updateRequestStatus,
} from "../../components/utils/ApiFunctions";
import {
  Avatar,
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
  Chip,
  Collapse,
  Badge,
  List,
  ListItem,
  ListItemText,
  Menu,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Paid as PaidIcon,
  WatchLater as WatchLaterIcon,
  NewReleases as NewReleasesIcon,
  Build as BuildIcon,
  DoneAll as DoneAllIcon,
  Done as DoneIcon,
  Block as BlockIcon,
  Receipt as ReceiptIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Flag as FlagIcon,
  Flag,
  AssignmentLate as AssignmentLateIcon,
  CalendarToday as CalendarTodayIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
  Reply as ReplyIcon,
} from "@mui/icons-material";
import { useAuth } from "../../components/auth/AuthProvider";
import PrintPDF from "./PrintPDF";
import CertificateHTML from "../certificates/CertificateHTML";
import PrintReturnPDF from "./PrintCommitPDF";
import PrintBlockPDF from "./PrintBlockPDF";

const statusColors = {
  WAIT: "warning",
  NEW: "primary",
  PROCESSING: "info",
  PROCESSED: "secondary",
  DONE: "success",
  BLOCKREQUEST: "error",
  BLOCKED: "error",
  RETURNREQUEST: "default",
};

const statusIcons = {
  WAIT: <WatchLaterIcon />,
  NEW: <NewReleasesIcon />,
  PROCESSING: <BuildIcon />,
  PROCESSED: <DoneAllIcon />,
  DONE: <DoneIcon />,
  BLOCKREQUEST: <BlockIcon />,
  BLOCKED: <BlockIcon />,
  RETURNREQUEST: <ReplyIcon />,
};

const RequestActionsMenu = ({
  request,
  navigate,
  services,
  handleOpenDialog,
  openCertificateInNewTab,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <MoreVertIcon sx={{ color: "#C5A773" }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {request.certificate_id !== null && (
          <MenuItem
            onClick={() => {
              openCertificateInNewTab(request.certificate_id);
              handleMenuClose();
            }}
          >
            <VisibilityIcon sx={{ color: "#C5A773", mr: 1 }} />
            View Certificate
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            navigate(`/requests/${request.id}`);
            handleMenuClose();
          }}
        >
          <EditIcon sx={{ color: "#C5A773", mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleOpenDialog(request);
            handleMenuClose();
          }}
        >
          <DeleteIcon sx={{ color: "#C5A773", mr: 1 }} />
          Delete
        </MenuItem>
        <MenuItem
          onClick={async () => {
            navigate(`/report/${request.id}`);
            handleMenuClose();
          }}
        >
          <Flag sx={{ color: "#C5A773", mr: 1 }} />
          Report
        </MenuItem>
        <MenuItem
          onClick={() => {
            PrintPDF(request, services);
            handleMenuClose();
          }}
        >
          <ReceiptIcon sx={{ color: "#C5A773", mr: 1 }} />
          Receipt
        </MenuItem>
        <MenuItem
          onClick={() => {
            PrintBlockPDF();
            handleMenuClose();
          }}
        >
          <DescriptionIcon sx={{ color: "#C5A773", mr: 1 }} />
          Block Paper
        </MenuItem>
        <MenuItem
          onClick={() => {
            PrintReturnPDF();
            handleMenuClose();
          }}
        >
          <DescriptionIcon sx={{ color: "#C5A773", mr: 1 }} />
          Retun Paper
        </MenuItem>
      </Menu>
    </>
  );
};

const Requests = () => {
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [trackingData, setTrackingData] = useState({});
  const [showLateRequests, setShowLateRequests] = useState(false);
  const [number, setNumber] = useState(0);
  const requestsPerPage = 5;

  const navigate = useNavigate();

  const auth = useAuth();
  const isAuthorized =
    auth.isRoleAccept("admin") ||
    auth.isRoleAccept("manager") ||
    auth.isRoleAccept("staff");

  const isManager = auth.isRoleAccept("admin") || auth.isRoleAccept("manager");

  const socketRef = useRef(null);

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
    const fetchData = async () => {
      try {
        console.log("fetchData called");

        // Fetch requests
        const requests = await getAllRequests();
        setData(requests);

        // Fetch services
        const services = await getAllServices();
        setServices(services);

        if (socketRef.current) {
          // Close existing WebSocket if any
          socketRef.current.close();
        }

        const socket = new WebSocket("ws://localhost:8081/DiamondShop/ws");
        socketRef.current = socket;

        socket.onopen = () => {
          console.log("Connected to WebSocket server");
        };

        socket.onmessage = (event) => {
          // When a new request notification is received, increment the count
          setNumber((prevNumber) => prevNumber + 1);
        };

        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        socket.onclose = (event) => {
          console.log("WebSocket connection closed:", event);
        };

        return () => {
          if (socketRef.current) {
            socketRef.current.close();
          }
        };
      } catch (error) {
        console.error("Error in fetchData:", error);
        setError(error.message);
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    const result = await deleteRequestById(requestToDelete);
    if (result !== undefined) {
      setMessage(`Delete request with id ${requestToDelete} successfully!`);
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

  const handleRowClick = async (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      if (!trackingData[id]) {
        const data = await getRequestTracking(id);
        setTrackingData((prevData) => ({ ...prevData, [id]: data }));
      }
      setExpandedRow(id);
    }
  };

  const isAppointmentLate = (appointmentDate) => {
    const today = new Date();
    const appointment = new Date(appointmentDate);
    return (
      appointment < today && (today - appointment) / (1000 * 60 * 60 * 24) > 7
    );
  };

  const lateRequests = data.filter(
    (request) =>
      isAppointmentLate(request.appoinment_date) &&
      request.appoinment_date !== null &&
      (request.status === "NEW" || request.status === "PROCESSED")
  );

  const filteredData = (showLateRequests ? lateRequests : data).filter(
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

  const openCertificateInNewTab = async (certificateId) => {
    try {
      const certificate = await getCertificateById(certificateId);
      const htmlContent = CertificateHTML(certificate);
      const newWindow = window.open("", "_blank");
      newWindow.document.open();
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    } catch (error) {
      console.error("Error in fetchData:", error);
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (
    <Box p="20px" overflow="auto">
      <Typography variant="h4" textAlign="center">
        Manage Requests
      </Typography>
      <Typography variant="body1" textAlign="center" mb={4}>
        Here you can view, edit, and manage all customer requests.
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 2, mb: 2 }}
      >
        {isAuthorized && (
          <Box>
            <Link to={"/requests/new"}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
              >
                Add New Request
              </Button>
            </Link>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowLateRequests(!showLateRequests)}
              sx={{ ml: 2 }}
            >
              {showLateRequests ? "Show All Requests" : "Show Late Requests"}
            </Button>
          </Box>
        )}

        <Box>
          <TextField
            label="Customer Phone"
            type="number"
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
            </Select>
          </FormControl>
        </Box>
      </Box>

      {message && (
        <Collapse in={Boolean(message)} sx={{ mt: 2, mb: 2 }}>
          <Alert severity="success">{message}</Alert>
        </Collapse>
      )}

      {number > 0 && (
        <Collapse in={Boolean(number)} sx={{ mt: 2, mb: 2 }}>
          <Alert
            severity="warning"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => window.location.reload()}
              >
                REFRESH
              </Button>
            }
          >
            {number} have been created
          </Alert>
        </Collapse>
      )}

      {error && (
        <Collapse in={Boolean(error)} sx={{ mt: 2, mb: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Collapse>
      )}

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#C5A773" }}>
            <TableRow>
              {isManager && <TableCell />}
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Customer Name</TableCell>
              <TableCell align="center">Customer Phone</TableCell>
              <TableCell align="center">Created Date</TableCell>
              <TableCell align="center">Payment Method</TableCell>
              <TableCell align="center">Appointment Date</TableCell>
              <TableCell align="center">Appointment Time</TableCell>
              <TableCell align="center">Service</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Paid</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#EEE5D6" }}>
            {currentRequests.length > 0 ? (
              currentRequests.map((request) => (
                <React.Fragment key={request.id}>
                  <TableRow>
                    {isManager && (
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleRowClick(request.id)}
                        >
                          {expandedRow === request.id ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    )}
                    <TableCell align="center">{request.id}</TableCell>
                    <TableCell align="center">
                      {request.customer_name}
                    </TableCell>
                    <TableCell align="center">
                      {request.customer_phone}
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(request.created_date)}
                    </TableCell>
                    <TableCell align="center">
                      {request.payment_method}
                    </TableCell>
                    <TableCell align="center">
                      {request.appoinment_date}
                    </TableCell>
                    <TableCell align="center">{request.slot}</TableCell>
                    <TableCell align="center">
                      {request.service_names.replace(
                        /([a-z])([A-Z])/g,
                        "$1, $2"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      ${request.total.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {request.paid ? (
                        <PaidIcon sx={{ color: "green", fontSize: "25px" }} />
                      ) : (
                        <PaidIcon sx={{ fontSize: "25px" }} />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={statusIcons[request.status]}
                        label={request.status}
                        color={statusColors[request.status]}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {isAuthorized && (
                        <RequestActionsMenu
                          request={request}
                          navigate={navigate}
                          services={services}
                          handleOpenDialog={handleOpenDialog}
                          openCertificateInNewTab={openCertificateInNewTab}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ overflow: "auto" }}>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={14}
                    >
                      <Collapse
                        in={expandedRow === request.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box
                          margin={1}
                          sx={{
                            maxHeight: "200px", // Adjust height as needed
                            overflowY: "auto",
                          }}
                        >
                          <Typography variant="h6" gutterBottom component="div">
                            Request Tracking
                          </Typography>
                          <Table size="small" aria-label="tracking">
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">Date</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Comment</TableCell>
                                <TableCell align="center">
                                  {" "}
                                  Updated By
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {trackingData[request.id] &&
                                trackingData[request.id].map((track) => (
                                  <TableRow key={track.id}>
                                    <TableCell component="th" scope="row">
                                      {formatDate(track.updated_time)}
                                    </TableCell>
                                    <TableCell>{track.status}</TableCell>
                                    <TableCell>{track.note}</TableCell>
                                    <TableCell>
                                      {track.updated_by
                                        ? track.updated_by.fullname
                                        : "System"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isManager ? 14 : 13} align="center">
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
