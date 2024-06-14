import React from "react";
import { Dialog, DialogTitle, Box, Typography } from "@mui/material";

const ServiceDetailsDialog = ({ open, handleClose, service }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="service-detail-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      {service && (
        <Box sx={{ p: "20px" }}>
          <DialogTitle textAlign="center" sx={{ fontWeight: "bold" }}>
            Service Detail
          </DialogTitle>
          <Typography>
            <strong>Name:</strong>
            {service.name}
          </Typography>
          <Typography>
            <strong>Money:</strong> {service.money}
          </Typography>
          <Typography>
            <strong>Content:</strong> {service.content}
          </Typography>
          <Typography>
            <strong>Photo:</strong>
            <img src={service.photo} alt={service.name} />
          </Typography>
        </Box>
      )}
    </Dialog>
  );
};

export default ServiceDetailsDialog;
