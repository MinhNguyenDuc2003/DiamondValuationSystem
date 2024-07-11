import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  Modal,
  IconButton,
  Pagination,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import palpayLogo from "../Service/img/PayPal_Logo.jpg";
import cashLogo from "./cashh.jpg";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CertificateHTML from "./CertificateHTML";
import { getAllRequest, getCertificateById } from "../../utils/ApiFunction";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CheckIcon from "@mui/icons-material/Check";

const steps = ["WAIT", "NEW", "PROCESSING", "PROCESSED", "DONE"];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalRequest, setTotalRequest] = useState(0);
  const [totalDone, setTotalDone] = useState(0);
  const [totalCompletedSteps, setTotalCompletedSteps] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const itemsPerPage = 3;

  // Style
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    marginBottom: 15,
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));

  useEffect(() => {
    getAllRequest().then((data) => {
      setOrders(data);
      setFilteredOrders(data);
      setTotalRequest(data.length);
      const doneRequests = data.filter((order) => order.status === "DONE");
      setTotalDone(doneRequests.length);
      const completedSteps = data.filter(
        (order) => order.status === "PROCESSED"
      );
      setTotalCompletedSteps(completedSteps.length);
    });
  }, []);

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const sortByDone = () => {
    const doneList = orders.filter((request) => request.status === "DONE");
    setFilteredOrders(doneList);
  };

  const sortByTotal = () => {
    setFilteredOrders(orders);
  };

  const sortByProcess = () => {
    const processList = orders.filter((order) => order.status === "PROCESSED");
    setFilteredOrders(processList);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    if (value === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        order.id.toString().includes(value)
      );
      setFilteredOrders(filtered);
    }
  };

  const handleShowCertificate = async (certificate_id) => {
    const result = await getCertificateById(certificate_id);
    if (result) {
      openCertificateInNewTab(result);
    } else {
      console.log(`Certificate with ID not found.`);
    }
  };

  const openCertificateInNewTab = (certificate) => {
    const newWindow = window.open("", "_blank");
    newWindow.document.write(CertificateHTML(certificate));
    newWindow.document.close();
  };

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  return (
    <Box sx={{ backgroundColor: "#dcdcdc66" }}>
      <Box className="wrapperrr" sx={{ mt: 10, height: "80vh" }}>
        <Box
          sx={{
            textAlign: "start",
            pt: 2,
            pl: 2,
            height: "10vh",
            backgroundColor: "white",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              justifyContent: "space-between",
              height: "100%",
              color: "gray",
            }}
          >
            Recent Report
            <Search>
              <SearchIconWrapper>
                <SearchIcon sx={{ mr: "10px" }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchValue}
                onChange={handleSearch}
              />
            </Search>
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">Manage your services you use</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            mb: 2,
            borderBottom: "2px solid #eee",
          }}
        >
          <Button
            onClick={sortByTotal}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <NotificationsNoneIcon />
            <Typography sx={{ ml: 1 }}>Total ({totalRequest})</Typography>
          </Button>
          <Button
            onClick={sortByProcess}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <WorkOutlineIcon />
            <Typography sx={{ ml: 1 }}>
              Process ({totalCompletedSteps})
            </Typography>
          </Button>
          <Button
            onClick={sortByDone}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <CheckIcon />
            <Typography sx={{ ml: 1 }}>Done ({totalDone})</Typography>
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#dcdcdc66" }}>
                <TableCell
                  sx={{ color: "#11375e", fontSize: "20px " }}
                  align="center"
                >
                  No
                </TableCell>
                <TableCell
                  sx={{ color: "#11375e", fontSize: "20px " }}
                  align="center"
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{ color: "#11375e", fontSize: "20px " }}
                  align="center"
                >
                  Service
                </TableCell>
                <TableCell
                  sx={{ color: "#11375e", fontSize: "20px " }}
                  align="center"
                >
                  Payment
                </TableCell>
                <TableCell
                  sx={{ color: "#11375e", fontSize: "20px " }}
                  align="center"
                >
                  Payment Status
                </TableCell>
                <TableCell
                  sx={{ color: "#11375e", fontSize: "20px " }}
                  align="center"
                >
                  Request Status
                </TableCell>
                <TableCell
                  sx={{ color: "#11375e", fontSize: "20px " }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentOrders.map((request, index) => (
                <TableRow key={request.id}>
                  <TableCell sx={{ color: "gray" }} align="center">
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ color: "#11375e" }} align="center">
                    {formatDate(request.created_date)}
                  </TableCell>
                  <TableCell sx={{ color: "gray" }} align="center">
                    {request.service_names.replace(/([a-z])([A-Z])/g, "$1, $2")}
                  </TableCell>
                  <TableCell align="center">
                    {request.payment_method === "PAYPAL" ? (
                      <img
                        style={{ width: "60px" }}
                        src={palpayLogo}
                        alt="PayPal"
                      />
                    ) : (
                      <img
                        style={{ width: "50px", height: "40px" }}
                        src={cashLogo}
                        alt="Cash"
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ color: "gray" }} align="center">
                    {request.paid ? "Paid" : "Pending"}
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{
                        backgroundColor:
                          request.status === "DONE"
                            ? "green"
                            : request.status === "BLOCKED"
                            ? "red"
                            : "#00aaff",
                        color: "white",
                        borderRadius: 1,
                        width: "50%",
                        marginLeft: "25%",
                      }}
                    >
                      {request.status}
                    </Typography>
                    {request.status !== "DONE" &&
                      request.status !== "BLOCKED" && (
                        <>
                          <br />
                          <Button onClick={() => handleShowDetails(request)}>
                            Details
                          </Button>
                        </>
                      )}
                  </TableCell>
                  <TableCell sx={{ color: "gray" }} align="center">
                    {request.status === "DONE" && (
                      <Button
                        onClick={() =>
                          handleShowCertificate(request.certificate_id)
                        }
                      >
                        Show Certificate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              width: 600,
              p: 3,
              mx: "auto",
              mt: "10%",
              backgroundColor: "white",
              boxShadow: 24,
              borderRadius: 2,
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
            {selectedOrder && (
              <>
                <Typography variant="h5" gutterBottom>
                  Order Step
                </Typography>
                {selectedOrder.status === "BLOCKED" ? (
                  <Typography color="error">
                    This order is currently blocked.
                  </Typography>
                ) : (
                  <Stepper
                    nonLinear
                    activeStep={steps.indexOf(selectedOrder.status)}
                    alternativeLabel
                  >
                    {steps.map((label, index) => (
                      <Step
                        key={label}
                        completed={index < steps.indexOf(selectedOrder.status)}
                      >
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                )}
                {steps.indexOf(selectedOrder.status) >= steps.length && (
                  <Typography>Order Completed</Typography>
                )}
              </>
            )}
          </Box>
        </Modal>
        <Pagination
          count={Math.ceil(filteredOrders.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          sx={{ display: "flex", justifyContent: "center", mt: 2 }}
        />
      </Box>
    </Box>
  );
};

export default MyOrder;
