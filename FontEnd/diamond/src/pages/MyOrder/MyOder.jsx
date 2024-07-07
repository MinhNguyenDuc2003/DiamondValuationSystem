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
import CheckIcon from "@mui/icons-material/Check";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import palpayLogo from "../Service/img/PayPal_Logo.jpg";
import cashLogo from "./cash.jpg";
import { data } from "./Requests";
import CertificateHTML from "./CertificateHTML";

const steps = ["WAIT", "NEW", "PROCESSING", "PROCESSED", "DONE"];

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalRequest, setTotalRequest] = useState(0);
  const [totalDone, setTotalDone] = useState(0);
  const [totalCompletedSteps, setTotalCompletedSteps] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [certificateData, setCertificateData] = useState(null);
  const itemsPerPage = 2;

  useEffect(() => {
    setOrders(data);
    setTotalRequest(data.length);
    const doneRequests = data.filter((order) => order.status === "DONE");
    setTotalDone(doneRequests.length);
    const completedSteps = data.filter((order) => order.status === "PROCESSED");
    setTotalCompletedSteps(completedSteps.length);
  }, []);

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
    setCertificateData(null);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const sortByDone = () => {
    const doneList = orders.filter((request) => request.status === "DONE");
    setOrders(doneList);
  };

  const sortByTotal = () => {
    setOrders(data);
  };

  const sortByProcess = () => {
    const processList = orders.filter((order) => order.status === "PROCESSED");
    setOrders(processList);
  };

  const handleShowCertificate = (order) => {
    setCertificateData(order.certificate);
    setModalOpen(true);
  };

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <Box className="wrapperrr" sx={{ height: "60vh" }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">Tracking Request Process</Typography>
        <Typography variant="body2">Manage your services you use</Typography>
      </Box>
      <Box
        sx={{ display: "flex", gap: 3, mb: 2, borderBottom: "2px solid #eee" }}
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
            <TableRow>
              <TableCell align="center">STT</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Service</TableCell>
              <TableCell align="center">Payment</TableCell>
              <TableCell align="center">Payment Status</TableCell>
              <TableCell align="center">Request Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrders.map((request) => (
              <TableRow key={request.id}>
                <TableCell align="center">{request.id}</TableCell>
                <TableCell align="center">{request.created_date}</TableCell>
                <TableCell align="center">{request.service_names}</TableCell>
                <TableCell align="center">
                  {request.payment_method === "PAYPAL" ? (
                    <img
                      style={{ width: "40px" }}
                      src={palpayLogo}
                      alt="PayPal"
                    />
                  ) : (
                    <img style={{ width: "30px" }} src={cashLogo} alt="Cash" />
                  )}
                </TableCell>
                <TableCell align="center">
                  {request.paid ? "Paid" : "Not Yet"}
                </TableCell>
                <TableCell align="center">
                  {request.status}
                  <br />
                  <Button onClick={() => handleShowDetails(request)}>
                    Details
                  </Button>
                </TableCell>
                <TableCell align="center">
                  {request.status === "DONE" && (
                    <Button onClick={() => handleShowCertificate(request)}>
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
          {certificateData && (
            <Box sx={{ mt: 2 }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: CertificateHTML(certificateData),
                }}
              />
            </Box>
          )}
        </Box>
      </Modal>
      <Pagination
        count={Math.ceil(orders.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ display: "flex", justifyContent: "center", mt: 2 }}
      />
    </Box>
  );
};

export default MyOrder;
