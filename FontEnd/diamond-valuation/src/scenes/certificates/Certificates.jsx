import React, { useState, useEffect } from "react";
import {
  getAllCertificates,
  deleteCertificateById,
  getAllRequestsStatus,
  updateRequestStatus,
} from "../../components/utils/ApiFunctions";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Badge,
  List,
  ListItem,
  ListItemText,
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
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Slider,
  Pagination,
  Paper,
  Alert,
  Collapse,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PrintIcon from "@mui/icons-material/Print";
import { PiCertificate } from "react-icons/pi";
import CertificateHTML from "./CertificateHTML";
import PrintPDF from "./PrintPDF";
import { useAuth } from "../../components/auth/AuthProvider";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [requests, setRequests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openRow, setOpenRow] = useState(null);
  const CertificatesPerPage = 6;
  const navigate = useNavigate();

  const auth = useAuth();

  // Check if the user is an admin or manager or valuation staff
  const isAuthorized =
    auth.isRoleAccept("admin") ||
    auth.isRoleAccept("manager") ||
    auth.isRoleAccept("valuationStaff");

  const [filters, setFilters] = useState({
    carat: [0, 10],
    clarity: "",
    color: "",
    cut: "",
    flourescence: "",
    make: "",
    polish: "",
    symmetry: "",
    cert: "",
  });

  const filterOptions = {
    clarity: [
      "",
      "IF",
      "VVS1",
      "VVS2",
      "VS1",
      "VS2",
      "SI1",
      "SI2",
      "SI3",
      "I1",
      "I2",
      "I3",
    ],
    color: [
      "",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
    ],
    cut: [
      "",
      "Round",
      "Marquise",
      "Pear",
      "Oval",
      "Heart",
      "Emerald",
      "Princess",
      "Radiant",
      "Triangle",
      "Baguette",
      "Asscher",
      "Cushion",
    ],
    flourescence: ["", "None", "Faint", "Medium", "Strong", "Very Strong"],
    make: ["", "Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"],
    polish: ["", "Excellent", "Very Good", "Good", "Fair", "Poor"],
    symmetry: ["", "Excellent", "Very Good", "Good", "Fair", "Poor"],
    cert: [
      "",
      "AGS",
      "CEGL",
      "CGI",
      "CGL",
      "DCLA",
      "EGL Asia",
      "EGL Intl.",
      "EGL USA",
      "GCAL",
      "GIA",
      "HRD",
      "IGI",
    ],
  };

  useEffect(() => {
    const successMessage = localStorage.getItem("successMessage");
    if (successMessage) {
      setMessage(successMessage);
      localStorage.removeItem("successMessage");
      setTimeout(() => {
        setMessage("");
      }, 4000);
    }
  }, [location.state?.message]);

  useEffect(() => {
    const fetchCertificatesAndRequests = async () => {
      try {
        // Fetch certificates
        const certificates = await getAllCertificates();
        if (certificates !== undefined) {
          setCertificates(certificates);
        }

        // Fetch requests status
        const requests = await getAllRequestsStatus("NEW");
        setRequests(requests);

        // Clear error after a timeout
        setTimeout(() => {
          setError("");
        }, 2000);
      } catch (error) {
        setError(error.message);
        // Clear error after a timeout
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    };

    fetchCertificatesAndRequests();
  }, []);

  const handleDelete = async () => {
    const result = await deleteCertificateById(certificateToDelete);
    if (result !== undefined) {
      setMessage(
        `Delete certificate with id ${certificateToDelete}  successfully!`
      );
      updateRequestStatus(certificateToDelete.request_id, "NEW");
      getAllCertificates()
        .then((data) => {
          setCertificates(data);
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

  const handleOpenDialog = (certificate) => {
    setCertificateToDelete(certificate.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCertificateToDelete(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleCaratChange = (event, newValue) => {
    setFilters({
      ...filters,
      carat: newValue,
    });
  };

  const handleBadgeClick = () => {
    setOpenRequestDialog(true);
  };

  const handleRequestSelect = (request) => {
    setSelectedRequest(request);
    // setOpenRequestDialog(false);
  };

  const handleCreateCertificate = async () => {
    if (selectedRequest) {
      updateRequestStatus(selectedRequest.id, "PROCESSING");
      navigate(`/create-certificate/${selectedRequest.id}`, { replace: true });
    }
  };

  const filteredData = certificates.filter((certificate) => {
    return (
      ((filters.carat[0] === 0 && filters.carat[1] === 10) ||
        (certificate.carat >= filters.carat[0] &&
          certificate.carat <= filters.carat[1])) &&
      (filters.clarity === "" ||
        certificate.clarity.includes(filters.clarity.replace(/\s+/g, ""))) &&
      (filters.color === "" ||
        certificate.color.includes(filters.color.replace(/\s+/g, ""))) &&
      (filters.cut === "" ||
        certificate.cut.includes(filters.cut.replace(/\s+/g, ""))) &&
      (filters.flourescence === "" ||
        certificate.flourescence ===
          filters.flourescence.replace(/\s+/g, "")) &&
      (filters.make === "" ||
        certificate.make === filters.make.replace(/\s+/g, "")) &&
      (filters.polish === "" ||
        certificate.polish === filters.polish.replace(/\s+/g, "")) &&
      (filters.symmetry === "" ||
        certificate.symmetry === filters.symmetry.replace(/\s+/g, "")) &&
      (filters.cert === "" ||
        certificate.cert.toLowerCase().includes(filters.cert.toLowerCase()))
    );
  });

  const indexOfLastCertificate = currentPage * CertificatesPerPage;
  const indexOfFirstCertificate = indexOfLastCertificate - CertificatesPerPage;
  const currentCertificates = filteredData.slice(
    indexOfFirstCertificate,
    indexOfLastCertificate
  );

  const newRequests = requests.filter((request) => request.status === "NEW");

  const openCertificateInNewTab = (certificate) => {
    const htmlContent = CertificateHTML(certificate);
    const newWindow = window.open("", "_blank");
    newWindow.document.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  };

  const handleRowClick = (id) => {
    setOpenRow(openRow === id ? null : id); // Toggle the row open/close
  };

  return (
    <Box p="20px" overflow="auto">
      <Typography variant="h4" textAlign="center">
        Manage Certificates
      </Typography>
      {isAuthorized && (
        <Badge
          color="secondary"
          badgeContent={newRequests.length}
          onClick={handleBadgeClick}
          sx={{ cursor: "pointer", fontSize: "40px", color: "black" }}
        >
          <RequestPageIcon />
        </Badge>
      )}
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

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-around"
        alignItems="center"
        sx={{ mt: 2, mb: 2 }}
      >
        <Box>
          <Typography gutterBottom paddingTop="10px">
            Carat Range
          </Typography>
          <Slider
            value={filters.carat}
            onChange={handleCaratChange}
            valueLabelDisplay="auto"
            min={0}
            max={10}
            step={0.1}
            sx={{ width: 200, mr: 2 }}
          />
        </Box>

        {Object.keys(filterOptions).map((filterKey) => (
          <FormControl key={filterKey} sx={{ minWidth: 120 }}>
            <InputLabel>
              {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
            </InputLabel>
            <Select
              name={filterKey}
              value={filters[filterKey]}
              onChange={handleFilterChange}
              label={filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
            >
              {filterOptions[filterKey].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#C5A773" }}>
            <TableRow>
              <TableCell />
              <TableCell align="center">Code</TableCell>
              <TableCell align="center">Carat</TableCell>
              <TableCell align="center">Clarity</TableCell>
              <TableCell align="center">Color</TableCell>
              <TableCell align="center">Cut</TableCell>
              <TableCell align="center">Flourescence</TableCell>
              <TableCell align="center">Make</TableCell>
              <TableCell align="center">Polish</TableCell>
              <TableCell align="center">Symmetry</TableCell>
              <TableCell align="center">Measurement</TableCell>
              <TableCell align="center">Cert</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#EEE5D6" }}>
            {currentCertificates.length > 0 ? (
              currentCertificates.map((certificate) => (
                <React.Fragment key={certificate.id}>
                  <TableRow>
                    <TableCell align="center">
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleRowClick(certificate.id)}
                      >
                        {openRow === certificate.id ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">{certificate.code}</TableCell>
                    <TableCell align="center">{certificate.carat}</TableCell>
                    <TableCell align="center">{certificate.clarity}</TableCell>
                    <TableCell align="center">{certificate.color}</TableCell>
                    <TableCell align="center">{certificate.cut}</TableCell>
                    <TableCell align="center">
                      {certificate.flourescence.replace(
                        /([a-z])([A-Z])/g,
                        "$1 $2"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {certificate.make.replace(/([a-z])([A-Z])/g, "$1 $2")}
                    </TableCell>
                    <TableCell align="center">
                      {certificate.polish.replace(/([a-z])([A-Z])/g, "$1 $2")}
                    </TableCell>
                    <TableCell align="center">
                      {certificate.symmetry.replace(/([a-z])([A-Z])/g, "$1 $2")}
                    </TableCell>
                    <TableCell align="center">
                      {certificate.measurement}
                    </TableCell>
                    <TableCell align="center">{certificate.name}</TableCell>

                    <TableCell align="center">
                      <IconButton
                        onClick={() => openCertificateInNewTab(certificate)}
                      >
                        <PiCertificate color="#C5A773" />
                      </IconButton>
                      {isAuthorized && (
                        <IconButton
                          onClick={() =>
                            navigate(`/certificates/${certificate.id}`)
                          }
                        >
                          <EditIcon sx={{ color: "#C5A773" }} />
                        </IconButton>
                      )}
                      {isAuthorized && (
                        <IconButton
                          onClick={() => handleOpenDialog(certificate)}
                        >
                          <DeleteIcon sx={{ color: "#C5A773" }} />
                        </IconButton>
                      )}
                      <IconButton onClick={() => PrintPDF(certificate)}>
                        <PrintIcon sx={{ color: "#C5A773" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={13} sx={{ padding: 0 }}>
                      <Collapse
                        in={openRow === certificate.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ m: 1 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Diamond Price
                          </Typography>
                          <Table size="small" aria-label="diamond price">
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">Min Price</TableCell>
                                <TableCell align="center">Max Price</TableCell>
                                <TableCell align="center">
                                  RAP Percent
                                </TableCell>
                                <TableCell align="center">RAP Price</TableCell>
                                <TableCell align="center">Real Price</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell align="center">
                                  {certificate.min_price}
                                </TableCell>
                                <TableCell align="center">
                                  {certificate.max_price}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    color:
                                      certificate.rap_percent >= 0
                                        ? "green"
                                        : "red",
                                  }}
                                >
                                  {certificate.rap_percent.toFixed(2)}%
                                </TableCell>
                                <TableCell align="center">
                                  {certificate.rap_price}
                                </TableCell>
                                <TableCell align="center">
                                  {certificate.real_price}
                                </TableCell>
                              </TableRow>
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
                <TableCell colSpan={13} align="center">
                  No certificates available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredData.length / CertificatesPerPage)}
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
            Are you sure you want to delete this certificate?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDelete}
            color="secondary"
            autoFocus
            variant="contained"
          >
            Delete
          </Button>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="contained"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRequestDialog}
        onClose={() => setOpenDialog(false)}
        variant="contained"
      >
        <DialogTitle>Select Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose a request to create a certificate:
          </DialogContentText>
          <List>
            {newRequests.map((request) => (
              <ListItem
                button
                key={request.id}
                onClick={() => handleRequestSelect(request)}
                selected={selectedRequest && selectedRequest.id === request.id}
              >
                <ListItemText
                  primary={`Request ID: ${request.id}`}
                  secondary={`Customer: ${request.customer_name}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateCertificate} color="primary" autoFocus>
            Create Certificate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Certificates;
