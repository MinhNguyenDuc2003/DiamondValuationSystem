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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  getAllCertificates,
  getAllServices,
  getAllRequests,
  getAllRequestPerDate,
} from "../../components/utils/ApiFunctions";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Dashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
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

        const schedule = await getAllRequestPerDate(getTodayDate());
        setScheduleData(schedule);
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={10}>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    {scheduleData.map((slotItem, index) => (
                      <TableCell key={index} align="center">
                        <Typography variant="h6">{slotItem.slot}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {scheduleData.map((slotItem, index) => (
                      <TableCell key={index}>
                        {slotItem.list.length > 0 ? (
                          <ul>
                            {slotItem.list.map((request) => (
                              <li key={request.id}>
                                <Typography variant="subtitle1">
                                  Request Id: {request.id} <br />
                                  Status: {request.status}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <Typography variant="body1">No requests</Typography>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item xs={12} md={2}>
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
