import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  getAllCertificates,
  getAllServices,
  getAllRequests,
} from "../../components/utils/ApiFunctions";
import BarChart from "../../components/common/BarChart";

const Dashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const certData = await getAllCertificates();
        setCertificates(certData);

        const serviceData = await getAllServices();
        setServices(serviceData);

        const requestData = await getAllRequests();
        setRequests(requestData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  // Function to calculate total income based on requests with status "Done"
  const calculateTotalIncome = () => {
    let totalIncome = 0;
    requests.map((request) => {
      if (request.status === "DONE") {
        totalIncome += request.total;
      }
    });
    return totalIncome;
  };

  const today = new Date().toISOString().split("T")[0];
  const todaysAppointments = requests.filter(
    (request) => request.appoinment_date === today
  );

  // Function to calculate increase of requests per month
  const calculateMonthlyIncrease = (data) => {
    const monthlyCounts = {};
    data.forEach((item) => {
      const monthYear = item.created_date.slice(0, 7); // Extract YYYY-MM from created_date
      if (monthlyCounts[monthYear]) {
        monthlyCounts[monthYear]++;
      } else {
        monthlyCounts[monthYear] = 1;
      }
    });
    return monthlyCounts;
  };

  const requestMonthlyIncrease = calculateMonthlyIncrease(requests);

  return (
    <Box p="20px" overflow="auto">
      <Typography variant="h4" textAlign="center">
        Dashboard
      </Typography>

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Certificates</Typography>
              <Typography variant="h3">{certificates.length}</Typography>
              <Button component={Link} to="/certificates">
                Manage Certificates
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Services</Typography>
              <Typography variant="h3">{services.length}</Typography>
              <Button component={Link} to="/services">
                Manage Services
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Requests</Typography>
              <Typography variant="h3">{requests.length}</Typography>
              <Button component={Link} to="/requests">
                View Requests
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h5">Today's Appointments</Typography>
        <List>
          {todaysAppointments.length > 0 ? (
            todaysAppointments.map((appointment) => (
              <ListItem key={appointment.id}>
                <ListItemText
                  primary={`Request ID: ${appointment.id}`}
                  secondary={`Appointment Date: ${new Date(
                    appointment.appoinment_date
                  ).toLocaleDateString()} ${
                    appointment.appoinment_time
                      ? `Time: ${appointment.appoinment_time}`
                      : ""
                  }`}
                />
              </ListItem>
            ))
          ) : (
            <Typography>No appointments for today.</Typography>
          )}
        </List>
      </Box>

      <Box mt={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper>
              <Typography variant="h6" textAlign="center">
                Increase of Requests per Month
              </Typography>
              <BarChart data={requestMonthlyIncrease} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper>
              <Typography variant="h6" textAlign="center">
                Total Income (Requests with Status Done)
              </Typography>
              <Box p={2} textAlign="center" bgcolor="#f0f0f0">
                <Typography variant="h4">
                  ${calculateTotalIncome().toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
