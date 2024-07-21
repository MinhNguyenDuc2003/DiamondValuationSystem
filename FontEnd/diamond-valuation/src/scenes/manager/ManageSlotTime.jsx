// SlotTimeManagement.jsx

import React, { useState, useEffect } from "react";
import {
  deleteSlotTime,
  getAllRequestPerDate,
  getAllSlotTime,
  saveSlotTime,
} from "../../components/utils/ApiFunctions"; // Adjust path as needed
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  CircularProgress,
  Collapse,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  const [date, setDate] = useState(getTodayDate());
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editedNumber, setEditedNumber] = useState("");

  useEffect(() => {
    const fetchSlotTimes = async () => {
      try {
        const data = await getAllSlotTime();
        const schedule = await getAllRequestPerDate(date);
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

  const validateTimes = () => {
    const from = new Date(`1970-01-01T${fromTime}:00`);
    const to = new Date(`1970-01-01T${toTime}:00`);
    return from < to;
  };

  const handleAddSlotTime = async () => {
    if (!validateTimes()) {
      setError("To Time must be after From Time.");
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return;
    }

    const newSlotTime = {
      time: `${fromTime} - ${toTime}`,
      number: Number(number),
    };

    try {
      await saveSlotTime(newSlotTime);
      setMessage(`Add new slot time successfully!`);
      const updatedSlotTimes = await getAllSlotTime();
      setSlotTimes(updatedSlotTimes);
      setFromTime("");
      setToTime("");
      setNumber("");
    } catch (error) {
      setError(error.message);
    }
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  const handleDeleteSlotTime = async () => {
    try {
      await deleteSlotTime(slotToDelete.id);
      setMessage(`Delete slot time ${slotToDelete.id} successfully!`);
      const updatedSlotTimes = await getAllSlotTime();
      setSlotTimes(updatedSlotTimes);
      setOpenDialog(false);
      setSlotToDelete(null);
    } catch (error) {
      setError(error.message);
      setOpenDialog(false);
    }
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  const handleOpenDialog = (slot) => {
    setSlotToDelete(slot);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSlotToDelete(null);
  };

  const handleDateChange = async (event) => {
    const date = event.target.value;
    setDate(date);

    try {
      const schedule = await getAllRequestPerDate(date);

      setScheduleData(schedule);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditClick = (id, currentNumber) => {
    setEditRowIndex(id);
    setEditedNumber(currentNumber);
  };

  const handleSaveClick = async (id) => {
    // Find the attribute to be edited
    const editedSlotTime = slotTimes.find((slot) => slot.id === id);

    if (editedSlotTime) {
      // const currentAttr = updatedCaratData[tabIndex].list[currentAttrIndex];

      // Update the number locally
      editedSlotTime.number = editedNumber;

      // Send the update request to the server
      try {
        const result = await saveSlotTime(editedSlotTime);
        if (result !== undefined) {
          setMessage(
            `Update slot time with id ${editedSlotTime.id}  successfully!`
          );
          const updatedSlotTimes = await getAllSlotTime();
          setSlotTimes(updatedSlotTimes);
          setEditRowIndex(null);
          setTimeout(() => {
            setMessage("");
          }, 3000);
        } else {
          setError("Failed to update slot time");
        }
      } catch (error) {
        setError("Failed to update slot time");
      }
    }
  };

  return (
    <Box p="0px 20px">
      <Typography variant="h4" gutterBottom textAlign="center">
        Manage Slot Times
      </Typography>

      {message && (
        <Collapse in={Boolean(message)} sx={{ mt: 2, mb: 2 }}>
          <Alert severity="success">{message}</Alert>
        </Collapse>
      )}

      {/* Form to add new slot time */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <Paper
            elevation={3}
            style={{ padding: "20px", marginBottom: "20px", maxHeight: "25vh" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="From Time"
                  type="time"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="To Time"
                  type="time"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Number"
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddSlotTime}
                >
                  Add Slot Time
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={9}>
          {/* List of current slot times */}
          <Paper
            elevation={3}
            style={{
              padding: "10px",
              marginBottom: "20px",
              maxHeight: "25vh",
              overflow: "auto",
            }}
          >
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Number Slot </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slotTimes.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell>{slot.time}</TableCell>
                      <TableCell>
                        {editRowIndex === slot.id ? (
                          <TextField
                            value={editedNumber}
                            onChange={(e) => setEditedNumber(e.target.value)}
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          slot.number
                        )}
                      </TableCell>
                      <TableCell>
                        {editRowIndex === slot.id ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSaveClick(slot.id)}
                          >
                            Save
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              handleEditClick(slot.id, slot.number)
                            }
                          >
                            Edit
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleOpenDialog(slot)}
                          sx={{ ml: "10px" }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4">Schedule</Typography>
        <TextField
          type="date"
          margin="dense"
          label="Date"
          name="date"
          value={date}
          onChange={(event) => handleDateChange(event)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the slot time: {slotToDelete?.time}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteSlotTime} color="secondary">
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

export default SlotTimeManagement;
