import React from "react";
import { Dialog, DialogTitle, Box, Typography, Avatar } from "@mui/material";

const UserDetailsDialog = ({ open, handleClose, user }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="user-detail-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      {user && (
        <Box sx={{ p: "20px" }}>
          <DialogTitle textAlign="center" sx={{ fontWeight: "bold" }}>
            User Detail
          </DialogTitle>
          <Avatar
            src={user.photo}
            sx={{ width: 75, height: 75, margin: "0 auto 20px auto" }}
          />
          <Typography>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography>
            <strong>Full Name:</strong>{" "}
            {`${user.last_name || ""} ${user.first_name || ""}`}
          </Typography>
          <Typography>
            <strong>Phone Number:</strong> {user.phone_number}
          </Typography>
          <Typography>
            <strong>Enabled:</strong> {user.enabled ? "Yes" : "No"}
          </Typography>
          <Typography>
            <strong>Roles:</strong>{" "}
            {user.role_names
              .split("/")
              .map((role) => role.charAt(0).toUpperCase() + role.slice(1))
              .join(", ")}
          </Typography>
        </Box>
      )}
    </Dialog>
  );
};

export default UserDetailsDialog;
