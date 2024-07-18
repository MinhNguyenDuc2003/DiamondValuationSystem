import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Pagination,
  TextField,
  Container,
  Collapse,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Autocomplete,
  FormControl,
} from "@mui/material";
import {
  getWorkAssignmentByDate,
  updateWorkAssignment,
  saveWorkAssignment,
  deleteWorkAssignment,
  searchUserByKeyword,
} from "../../components/utils/ApiFunctions"; // adjust the path to your API functions
import { styled } from "@mui/material/styles";

// Styled component for status
const StatusBadge = styled("span")(({ theme, status }) => ({
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "12px",
  color: "white",
  backgroundColor: status
    ? theme.palette.success.main
    : theme.palette.error.main,
  textAlign: "center",
}));

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const WorkAssignment = () => {
  const [date, setDate] = useState(getTodayDate());
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newAssignment, setNewAssignment] = useState({
    date: getTodayDate(),
    status: true,
    user_id: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const assignmentsPerPage = 5;

  const fetchAssignments = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWorkAssignmentByDate(date);
      setAssignments(data);
      setFilteredAssignments(data); // Initially set filtered assignments to all assignments
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      fetchAssignments(date);
    }
  }, [date]);

  useEffect(() => {
    // Filter assignments based on search term whenever it changes
    const filtered = assignments.filter((assignment) =>
      assignment.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAssignments(filtered);
  }, [searchTerm, assignments]);

  const handleUpdateAssignment = async (id, status) => {
    try {
      await updateWorkAssignment(id, status);
      fetchAssignments(date); // refresh the assignments after update
      setMessage(`Update status with id ${id} successfully!`);
    } catch (error) {
      setError(`Error updating assignment: ${error.message}`);
    }
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  const handleSaveAssignment = async () => {
    try {
      await saveWorkAssignment(newAssignment);
      fetchAssignments(date);
      setOpen(false);
      setNewAssignment({ date: getTodayDate(), status: true, user_id: "" });
      setMessage(`Add new assignment successfully!`);
    } catch (error) {
      setError(`Error saving assignment: ${error.message}`);
    }
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  const handleDeleteAssignment = async () => {
    console.log(assignmentToDelete);
    try {
      await deleteWorkAssignment(assignmentToDelete.id);
      fetchAssignments(date); // refresh assignments after deleting
      setOpenDeleteDialog(false); // close dialog after deletion
      setMessage(
        `Delete assignment with id ${assignmentToDelete.id} successfully!`
      );
    } catch (error) {
      setError(`Error deleting assignment: ${error.message}`);
    }
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  const handleOpenDeleteDialog = (assignment) => {
    setAssignmentToDelete(assignment);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setAssignmentToDelete(null);
  };

  const indexOfLastAssignment = currentPage * assignmentsPerPage;
  const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
  const currentAssignment = filteredAssignments.slice(
    indexOfFirstAssignment,
    indexOfLastAssignment
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    // Implementing debounce here
    debounceSearch();
  };

  function debounceSearch(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const fetchOptions = async (keyword) => {
    try {
      const users = await searchUserByKeyword(keyword); // Call your API function
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (event, value) => {
    fetchOptions(value);
    debounceSearch();
  };

  return (
    <Container>
      <Paper style={{ padding: "16px", marginTop: "16px" }}>
        <Typography variant="h4">Work Assignments</Typography>

        <TextField
          label="Select Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          style={{ margin: "16px 0" }}
        />
        <Box
          sx={{ m: "0 0 10px 0" }}
          display="flex"
          justifyContent="space-between"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Add Assignment
          </Button>

          <TextField
            label="Search by User Name"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>

        {message && (
          <Collapse in={Boolean(message)} sx={{ mt: 2, mb: 2 }}>
            <Alert severity="success">{message}</Alert>
          </Collapse>
        )}

        {loading && <CircularProgress />}

        {error && (
          <Collapse in={Boolean(error)} sx={{ mt: 2, mb: 2 }}>
            <Alert severity="success">{error}</Alert>
          </Collapse>
        )}
        {currentAssignment.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentAssignment.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.id}</TableCell>
                  <TableCell>{assignment.user_name}</TableCell>
                  <TableCell>{assignment.date}</TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={assignment.status}
                          onChange={(e) =>
                            handleUpdateAssignment(
                              assignment.id,
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      }
                      label={
                        <StatusBadge status={assignment.status}>
                          {assignment.status ? "Online" : "Offline"}
                        </StatusBadge>
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenDeleteDialog(assignment)}
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

      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredAssignments.length / assignmentsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Assignment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details for the new work assignment.
          </DialogContentText>

          <FormControl fullWidth>
            <Autocomplete
              options={users}
              getOptionLabel={(option) =>
                `${option.first_name} ${option.last_name} - ${option.email}`
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => {
                setNewAssignment({
                  ...newAssignment,
                  user_id: value ? value.id : "",
                });
              }}
              onInputChange={handleInputChange}
              renderInput={(params) => (
                <TextField {...params} label="User" variant="outlined" />
              )}
            />
          </FormControl>
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newAssignment.date}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, date: e.target.value })
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={newAssignment.status}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    status: e.target.checked,
                  })
                }
              />
            }
            label={newAssignment.status ? "Online" : "Offline"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveAssignment} color="primary">
            Save
          </Button>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this assignment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAssignment} color="secondary" autoFocus>
            Delete
          </Button>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorkAssignment;
