import React from "react";
import { Dialog, DialogTitle, Box, Typography } from "@mui/material";

const CustomerDetailsDialog = ({ open, handleClose, customer }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="customer-detail-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      {customer && (
        <Box sx={{ p: "20px" }}>
          <DialogTitle textAlign="center" sx={{ fontWeight: "bold" }}>
            Customer Detail
          </DialogTitle>
          <Typography>
            <strong>Email:</strong> {customer.email}
          </Typography>
          <Typography>
            <strong>Full Name:</strong>{" "}
            {`${customer.last_name || ""} ${customer.first_name || ""}`}
          </Typography>
          <Typography>
            <strong>Phone Number:</strong> {customer.phone_number}
          </Typography>
          <Typography>
            <strong>Location:</strong> {customer.location}
          </Typography>
          <Typography>
            <strong>Enabled:</strong> {customer.enabled ? "Yes" : "No"}
          </Typography>
          <Typography>
            <strong>Created At:</strong> {customer.created_time}
          </Typography>
        </Box>
      )}
    </Dialog>
  );
};

export default CustomerDetailsDialog;
