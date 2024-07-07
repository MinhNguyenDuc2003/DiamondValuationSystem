import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Alert,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BlockIcon from "@mui/icons-material/Block";

const statusColors = {
  New: "default",
  Resolved: "success",
  Decline: "error",
};

const statusIcons = {
  New: <CancelIcon />,
  Resolved: <CheckCircleIcon />,
  Decline: <BlockIcon />,
};

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        "https://665ae895003609eda45f3327.mockapi.io/Report"
      );
      setReports(response.data);
    } catch (error) {
      setError("Error fetching reports.");
      console.error("Error fetching reports:", error);
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await axios.delete(
        `https://665ae895003609eda45f3327.mockapi.io/Report/${reportId}`
      );
      setMessage("Report deleted successfully!");
      fetchReports();
      setTimeout(() => {
        setMessage("");
      }, 4000);
    } catch (error) {
      setError("Error deleting report.");
      console.error("Error deleting report:", error);
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      await axios.put(
        `https://665ae895003609eda45f3327.mockapi.io/Report/${reportId}`,
        {
          status: "Resolved",
        }
      );
      fetchReports();
      handleCloseDialog();
    } catch (error) {
      setError("Error resolving report.");
      console.error("Error resolving report:", error);
    }
  };

  const handleDeclineReport = async (reportId) => {
    try {
      await axios.put(
        `https://665ae895003609eda45f3327.mockapi.io/Report/${reportId}`,
        {
          status: "Decline",
        }
      );
      fetchReports();
      handleCloseDialog();
    } catch (error) {
      setError("Error declining report.");
      console.error("Error declining report:", error);
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom textAlign="center">
        Manage Reports
      </Typography>

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

      <Grid container spacing={2}>
        {reports.length > 0 ? (
          reports.map((report) => (
            <Grid item xs={12} sm={6} md={4} key={report.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {report.title}
                  </Typography>
                  <Chip
                    label={report.status}
                    color={statusColors[report.status]}
                    icon={statusIcons[report.status]}
                    variant="outlined"
                  />
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewReport(report)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteReport(report.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" textAlign="center" width="100%">
            No reports found.
          </Typography>
        )}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="view-report-dialog-title"
        aria-describedby="view-report-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          id="view-report-dialog-title"
          textAlign="center"
          sx={{ fontWeight: "bold" }}
        >
          Report
        </DialogTitle>
        <DialogContent>
          <Typography>
            <strong>Title: </strong> {selectedReport?.title}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Content: </strong>
            <div
              dangerouslySetInnerHTML={{ __html: selectedReport?.content }}
            />
          </Typography>
        </DialogContent>
        <DialogActions>
          {selectedReport?.status !== "Resolved" && (
            <Button
              onClick={() => handleResolveReport(selectedReport?.id)}
              color="success"
              startIcon={<CheckCircleIcon />}
            >
              Resolve
            </Button>
          )}
          {selectedReport?.status !== "Decline" && (
            <Button
              onClick={() => handleDeclineReport(selectedReport?.id)}
              color="error"
              startIcon={<BlockIcon />}
            >
              Decline
            </Button>
          )}
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageReports;
