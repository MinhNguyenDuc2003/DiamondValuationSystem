import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import HistoryIcon from "@mui/icons-material/History";
import {
  deleteReport,
  getAllReports,
  saveReport,
  getReportTracking,
  updateRequestStatus,
} from "../../components/utils/ApiFunctions";

const statusColors = {
  WAIT: "default",
  ACCEPT: "success",
  REJECT: "error",
};

const statusIcons = {
  WAIT: <CancelIcon />,
  ACCEPT: <CheckCircleIcon />,
  REJECT: <BlockIcon />,
};

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openTrackingDialog, setOpenTrackingDialog] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [reportDeleted, setReportDeleted] = useState(null);

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
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
  };

  const handleDeleteReport = async () => {
    console.log(reportDeleted);
    try {
      const result = await deleteReport(reportDeleted.id);
      if (result !== undefined) {
        setMessage("Report deleted successfully!");
        fetchReports();
        setTimeout(() => {
          setMessage("");
        }, 4000);
        setOpenDeleteDialog(false);
      }
    } catch (error) {
      setError("Error deleting report.");
      console.error("Error deleting report:", error);
    }
  };

  const handleAcceptReport = async (report) => {
    try {
      const result = await saveReport({ ...report, status: "ACCEPT" });
      if (result.message !== undefined) {
        if (report.type === "BLOCKDIAMOND") {
          await updateRequestStatus(report.request_id, "BLOCKED");
        }
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
      const result = await saveReport({ ...report, status: "REJECT" });
      if (result.message !== undefined) {
        if (report.type === "BLOCKDIAMOND") {
          await updateRequestStatus(report.request_id, "PROCESSED");
        }
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

  const handleViewTracking = async (report) => {
    try {
      const result = await getReportTracking(report.id);
      const formattedData = result.map((item) => ({
        ...item,
        created_time: new Date(
          item.created_time[0],
          item.created_time[1] - 1,
          item.created_time[2],
          item.created_time[3],
          item.created_time[4],
          item.created_time[5]
        ).toLocaleString(),
      }));
      setTrackingData(formattedData);
      setSelectedReport(report);
      setOpenTrackingDialog(true);
    } catch (error) {
      setError("Error fetching tracking data.");
      console.error("Error fetching tracking data:", error);
    }
  };

  const handleCloseTrackingDialog = () => {
    setOpenTrackingDialog(false);
    setSelectedReport(null);
    setTrackingData(null);
  };

  const handleOpenDeleteDialog = (report) => {
    setReportDeleted(report);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setReportDeleted(null);
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

      <Grid container spacing={2} sx={{ mt: "10px" }}>
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
                    sx={{ mt: 2 }}
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
                    onClick={() => handleOpenDeleteDialog(report)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={() => handleViewTracking(report)}
                  >
                    <HistoryIcon />
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
          {selectedReport?.status === "WAIT" && (
            <>
              <Button
                onClick={() => handleAcceptReport(selectedReport)}
                color="success"
                startIcon={<CheckCircleIcon />}
              >
                Accept
              </Button>
              <Button
                onClick={() => handleRejectReport(selectedReport)}
                color="error"
                startIcon={<BlockIcon />}
              >
                Reject
              </Button>
            </>
          )}
          {selectedReport?.status === "ACCEPT" && (
            <Button
              onClick={() => handleRejectReport(selectedReport)}
              color="error"
              startIcon={<BlockIcon />}
            >
              Reject
            </Button>
          )}
          {selectedReport?.status === "REJECT" && (
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

      <Dialog
        open={openTrackingDialog}
        onClose={handleCloseTrackingDialog}
        aria-labelledby="view-tracking-dialog-title"
        aria-describedby="view-tracking-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          id="view-tracking-dialog-title"
          textAlign="center"
          sx={{ fontWeight: "bold" }}
        >
          Report Tracking
        </DialogTitle>
        <DialogContent>
          {trackingData ? (
            trackingData.map((item) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Typography>
                  <strong>Status: </strong> {item.status}
                </Typography>
                <Typography>
                  <strong>Created Time: </strong> {item.created_time}
                </Typography>
                <Typography>
                  <strong>Updated By: </strong> {item.updated_by}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>Loading tracking data...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTrackingDialog} color="primary">
            Close
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
            Are you sure you want to delete this report?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteReport} color="secondary" autoFocus>
            Delete
          </Button>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageReports;
