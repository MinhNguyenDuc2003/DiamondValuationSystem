import React, { useState, useEffect } from "react";
import {
  getAllCertificates,
  getAllRequests,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RequestPageIcon from "@mui/icons-material/RequestPage";

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
  const CertificatesPerPage = 6;
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    carat: [0, 10],
    clarity: "",
    color: "",
    cut: "",
    fluorescence: "",
    make: "",
    polish: "",
    symmetry: "",
    name: "",
  });

  const filterOptions = {
    clarity: ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1"],
    color: ["D", "E", "F", "G", "H", "I", "J", "K"],
    cut: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    fluorescence: ["None", "Faint", "Medium", "Strong", "Very Strong"],
    make: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    polish: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    symmetry: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
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
    getAllCertificates()
      .then((data) => {
        if (data !== undefined) {
          setCertificates(data);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
    getAllRequests()
      .then((data) => {
        setRequests(data);
      })
      .catch((error) => {
        console.error("Error fetching requests: ", error);
      });
    setTimeout(() => {
      setError("");
    }, 2000);
  }, []);

  const handleDelete = async () => {
    const result = await deletecertificateById(certificateToDelete);
    if (result !== undefined) {
      setMessage(
        `Delete certificate with id ${certificateToDelete}  successfully!`
      );
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

  const handleCreateCertificate = () => {
    if (selectedRequest) {
      createCertificateForRequest(selectedRequest.id)
        .then((response) => {
          // Handle success, navigate to certificate details or update state
          console.log("Certificate created successfully:", response);
        })
        .catch((error) => {
          console.error("Error creating certificate:", error);
        });
    }
  };

  const filteredData = certificates.filter((certificate) => {
    return (
      ((filters.carat[0] === 0 && filters.carat[1] === 10) ||
        (certificate.carat >= filters.carat[0] &&
          certificate.carat <= filters.carat[1])) &&
      (filters.clarity === "" ||
        certificate.clarity.includes(filters.clarity)) &&
      (filters.color === "" || certificate.color.includes(filters.color)) &&
      (filters.cut === "" || certificate.cut.includes(filters.cut)) &&
      (filters.fluorescence === "" ||
        certificate.fluorescence.includes(filters.fluorescence)) &&
      (filters.make === "" || certificate.make.includes(filters.make)) &&
      (filters.polish === "" || certificate.polish.includes(filters.polish)) &&
      (filters.symmetry === "" ||
        certificate.symmetry.includes(filters.symmetry)) &&
      (filters.name === "" ||
        certificate.name.toLowerCase().includes(filters.name.toLowerCase()))
    );
  });

  const indexOfLastCertificate = currentPage * CertificatesPerPage;
  const indexOfFirstCertificate = indexOfLastCertificate - CertificatesPerPage;
  const currentCertificates = filteredData.slice(
    indexOfFirstCertificate,
    indexOfLastCertificate
  );

  const newRequests = requests.filter((request) => request.status === "NEW");

  return (
    <Box p="20px" overflow="auto">
      <Typography variant="h4" textAlign="center">
        Manage Certificates
      </Typography>

      <Badge
        color="secondary"
        badgeContent={newRequests.length}
        onClick={handleBadgeClick}
        sx={{ cursor: "pointer", fontSize: "40px", color: "black" }}
      >
        <RequestPageIcon />
      </Badge>

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
        <Typography gutterBottom>Carat Range</Typography>
        <Slider
          value={filters.carat}
          onChange={handleCaratChange}
          valueLabelDisplay="auto"
          min={0}
          max={10}
          step={0.1}
          sx={{ width: 200, mr: 2 }}
        />

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
              <MenuItem value="">All</MenuItem>
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
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Carat</TableCell>
              <TableCell align="center">Clarity</TableCell>
              <TableCell align="center">Color</TableCell>
              <TableCell align="center">Cut</TableCell>
              <TableCell align="center">Flourescence</TableCell>
              <TableCell align="center">Make</TableCell>
              <TableCell align="center">Polish</TableCell>
              <TableCell align="center">Symmetry</TableCell>
              <TableCell align="center">Cert</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#EEE5D6" }}>
            {currentCertificates.length > 0 ? (
              currentCertificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell align="center">{certificate.id}</TableCell>
                  <TableCell align="center">{certificate.carat}</TableCell>
                  <TableCell align="center">{certificate.clarity}</TableCell>
                  <TableCell align="center">{certificate.color}</TableCell>
                  <TableCell align="center">{certificate.cut}</TableCell>
                  <TableCell align="center">
                    {certificate.flourescence}
                  </TableCell>
                  <TableCell align="center">{certificate.make}</TableCell>
                  <TableCell align="center">{certificate.polish}</TableCell>
                  <TableCell align="center">{certificate.symmetry}</TableCell>
                  <TableCell align="center">{certificate.name}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() =>
                        navigate(`/certificates/${certificate.id}`)
                      }
                    >
                      <EditIcon sx={{ color: "#C5A773" }} />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDialog(certificate)}>
                      <DeleteIcon sx={{ color: "#C5A773" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">
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
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Delete
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRequestDialog} onClose={() => setOpenDialog(false)}>
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
