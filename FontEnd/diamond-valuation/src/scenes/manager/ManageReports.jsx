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
import {
  deleteReport,
  getAllReports,
  saveReport,
} from "../../components/utils/ApiFunctions";

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
      const result = await getAllReports();
      setReports(result);
    } catch (error) {
      setError("Error fetching reports.");
      console.error("Error fetching reports:", error);
    }
  };

  const handleViewReport = (report) => {
    console.log(report);
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
  };

  const handleDeleteReport = async (reportId) => {
    try {
      const result = await deleteReport(reportId);
      if (result !== undefined) {
        setMessage("Report deleted successfully!");
        fetchReports();
        setTimeout(() => {
          setMessage("");
        }, 4000);
        setOpenDialog(false);
      }
    } catch (error) {
      setError("Error deleting report.");
      console.error("Error deleting report:", error);
    }
  };

  const handleAcceptReport = async (report) => {
    try {
      console.log({ ...report, status: "true" });
      const result = await saveReport({ ...report, status: "true" });
      if (result.message !== undefined) {
        setMessage(`Accept Report ${report.id} successfully`);
        fetchReports();
        setOpenDialog(false);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      } else {
        setError("Error occurred");
      }
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  const handleRejectReport = async (report) => {
    try {
      const result = await saveReport({ ...report, status: "false" });
      if (result.message !== undefined) {
        setMessage(`Reject Report ${report.id} successfully`);
        fetchReports();
        setOpenDialog(false);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      } else {
        setError("Error occurred");
      }
    } catch (error) {
      console.error("Error saving report:", error);
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
                    <strong>Title: </strong> {report.header}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    <strong>Type: </strong> {report.type}
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
            <strong>Title: </strong> {selectedReport?.header}
          </Typography>
          <Typography component="div" variant="body1" paragraph>
            <strong>Content: </strong>
            <div
              dangerouslySetInnerHTML={{ __html: selectedReport?.content }}
            />
          </Typography>
        </DialogContent>
        <DialogActions>
          {selectedReport?.status === "true" && (
            <Button
              onClick={() => handleRejectReport(selectedReport)}
              color="error"
              startIcon={<BlockIcon />}
            >
              Reject
            </Button>
          )}
          {selectedReport?.status === "false" && (
            <Button
              onClick={() => handleAcceptReport(selectedReport)}
              color="success"
              startIcon={<CheckCircleIcon />}
            >
              Accept
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
