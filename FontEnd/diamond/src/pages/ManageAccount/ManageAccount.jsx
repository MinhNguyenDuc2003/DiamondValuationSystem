import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ManageAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('user')) || {});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: user.Email || '',
    firstName: user.FirstName || '',
    lastName: user.LastName || '',
    location: user.Location || '',
    password: user.Password || '',
    phone: user.Phone || ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update localStorage
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          ...user,
          Email: formData.email,
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Location: formData.location,
          Password: formData.password,
          Phone: formData.phone
        })
      );

      // Update user state
      setUser(JSON.parse(window.localStorage.getItem('user')));

     //call api 
      const userId = user.id;
      const response = await fetch(`https://api.example.com/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...user,
          Email: formData.email,
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Location: formData.location,
          Password: formData.password,
          Phone: formData.phone
        })
      });

      if (response.ok) {
        setSnackbarSeverity('success');
        setSnackbarMessage('User data updated successfully');
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to update user data');
      }
      setSnackbarOpen(true);

      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating user data:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error updating user data');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    // Reset dât
    setFormData({
      email: user.Email || '',
      firstName: user.FirstName || '',
      lastName: user.LastName || '',
      location: user.Location || '',
      password: user.Password || '',
      phone: user.Phone || ''
    });

    setEditMode(false);
  };

  return (
    <Container maxWidth="sm" className="wrapperr">
      <Typography variant="h3" gutterBottom>Your Profile</Typography>
      <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, boxShadow: 1 }}>
        {!editMode ? (
          <>
            <Typography variant="h5" gutterBottom>Personal Information</Typography>
            <Typography variant="body1" gutterBottom><strong>Email:</strong> {formData.email}</Typography>
            <Typography variant="body1" gutterBottom><strong>First Name:</strong> {formData.firstName}</Typography>
            <Typography variant="body1" gutterBottom><strong>Last Name:</strong> {formData.lastName}</Typography>
            <Typography variant="body1" gutterBottom><strong>Location:</strong> {formData.location}</Typography>
            <Typography variant="body1" gutterBottom><strong>Phone:</strong> {formData.phone}</Typography>
            <Button onClick={handleEditClick} variant="outlined" color="primary" sx={{ mt: 2 }}>Edit</Button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              id="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!editMode}
            />
            <TextField
              id="firstName"
              name="firstName"
              label="First Name"
              variant="outlined"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              disabled={!editMode}
            />
            <TextField
              id="lastName"
              name="lastName"
              label="Last Name"
              variant="outlined"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              disabled={!editMode}
            />
            <TextField
              id="location"
              name="location"
              label="Location"
              variant="outlined"
              value={formData.location}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              disabled={!editMode}
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              disabled={!editMode}
            />
            <TextField
              id="phone"
              name="phone"
              label="Phone"
              variant="outlined"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              disabled={!editMode}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                Save
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCancelClick}>
                Cancel
              </Button>
            </Box>
          </form>
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Container>
  );
};

export default ManageAccount;
