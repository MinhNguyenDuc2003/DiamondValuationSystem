// SlotTimeManagement.jsx

import React, { useState, useEffect } from "react";
import {
  getAllRequestPerDate,
  getAllSlotTime,
} from "../../components/utils/ApiFunctions"; // Adjust path as needed
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SlotTimeManagement = () => {
  const [slotTimes, setSlotTimes] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [newSlotTime, setNewSlotTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlotTimes = async () => {
      try {
        const data = await getAllSlotTime();
        const schedule = await getAllRequestPerDate(getTodayDate());
        setSlotTimes(data);
        setScheduleData(schedule);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchSlotTimes();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manage Slot Times
      </Typography>
      {/* List of current slot times */}
      <Typography variant="h5" gutterBottom>
        Current Slot Times
      </Typography>
      <Paper elevation={3} style={{ padding: "20px" }}>
        {isLoading && <CircularProgress />}
        {slotTimes.map((slot) => (
          <Box key={slot.id} mb={2}>
            <Typography variant="subtitle1">
              Time: {slot.time} - Capacity: {slot.number}
            </Typography>
          </Box>
        ))}
      </Paper>

      {/* <Typography variant="h4" gutterBottom>
        Schedule
      </Typography>

      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              {scheduleData.map((slotItem, index) => (
                <TableCell key={index}>
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
                            Customer Name: {request.customer_name} <br />
                            Service: {request.service_names} <br />
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
      </Paper> */}
    </Box>
  );
};

export default SlotTimeManagement;
