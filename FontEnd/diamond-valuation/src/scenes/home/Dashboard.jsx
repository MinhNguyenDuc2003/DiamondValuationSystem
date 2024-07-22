import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { Email, PointOfSale, PersonAdd, Traffic } from "@mui/icons-material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import {
  getAllRequestPerDate,
  DashBoard,
} from "../../components/utils/ApiFunctions";
import StatBox from "./StatBox";
import OverviewChart from "../../components/common/OverviewChart";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Dashboard = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await DashBoard(new Date().getFullYear());
        setData(dashboardData);

        const schedule = await getAllRequestPerDate(getTodayDate());
        setScheduleData(schedule);

        setIsLoading(false);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  // // Function to calculate total income based on requests with status "Done"
  // const calculateTotalIncome = () => {
  //   let totalIncome = 0;
  //   requests.map((request) => {
  //     if (request.status === "DONE") {
  //       totalIncome += request.total;
  //     }
  //   });
  //   return totalIncome;
  // };

  // const today = new Date().toISOString().split("T")[0];
  // const todaysAppointments = requests.filter(
  //   (request) => request.appoinment_date === today
  // );

  // // Function to calculate increase of requests per month
  // const calculateMonthlyIncrease = (data) => {
  //   const monthlyCounts = {};
  //   data.forEach((item) => {
  //     const monthYear = item.created_date.slice(0, 7); // Extract YYYY-MM from created_date
  //     if (monthlyCounts[monthYear]) {
  //       monthlyCounts[monthYear]++;
  //     } else {
  //       monthlyCounts[monthYear] = 1;
  //     }
  //   });
  //   return monthlyCounts;
  // };

  // const requestMonthlyIncrease = calculateMonthlyIncrease(requests);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h4" textAlign="center">
        Dashboard
      </Typography>

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Total Customers"
          value={data ? data.total_customer : 0}
          description={`In ${new Date().getFullYear()} `}
          icon={<Email sx={{ fontSize: "26px" }} />}
        />
        <StatBox
          title="Total Requests"
          value={data ? data.total_request : 0}
          description={`In ${new Date().getFullYear()} `}
          icon={<RequestPageIcon sx={{ fontSize: "26px" }} />}
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={"#f0f0f0"}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart view="revenue" isDashboard={true} year={2024} />
        </Box>
        <StatBox
          title="Total Certificates"
          value={data ? data.total_certificate : 0}
          description={`In ${new Date().getFullYear()} `}
          icon={<ReceiptLongIcon sx={{ fontSize: "26px" }} />}
        />
        <StatBox
          title="Total Revenue"
          value={data ? `${data.total_revenue}$` : 0}
          description={`In ${new Date().getFullYear()} `}
          icon={<PointOfSale sx={{ fontSize: "26px" }} />}
        />

        <Box gridColumn="span 12" gridRow="span 1">
          <Paper
            sx={{
              height: isNonMediumScreens ? "30vh" : undefined,
              overflow: "auto",
            }}
          >
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
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
