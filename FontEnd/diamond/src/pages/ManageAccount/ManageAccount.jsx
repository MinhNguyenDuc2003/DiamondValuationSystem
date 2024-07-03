import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';

const ManageAccount = () => {
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

      // Call API
      const userId = user.id;
      const response = await fetch(`https://api.com/users/${userId}`, {
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
    // Reset form data
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
    <Container maxWidth="md" sx={{ mt: 15 , mb: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ width: 80, height: 80, mr: 2, backgroundColor: 'gray' }}>
          <Typography sx={{fontSize : '30px'}}>
          {user.LastName.charAt(0)}
          </Typography>
          </Avatar>
        <Typography variant="h4">Your Profile</Typography>
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 1, boxShadow: 2 }}>
        {!editMode ? (
          <>
            <Typography variant="h5" gutterBottom>Personal Information</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 1 }} />
              <Typography variant="body1"><strong>Email:</strong> {formData.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1 }} />
              <Typography variant="body1"><strong>First Name:</strong> {formData.firstName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1 }} />
              <Typography variant="body1"><strong>Last Name:</strong> {formData.lastName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography variant="body1"><strong>Location:</strong> {formData.location}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ mr: 1 }} />
              <Typography variant="body1"><strong>Phone:</strong> {formData.phone}</Typography>
            </Box>
            <Button onClick={handleEditClick} variant="outlined" startIcon={<EditIcon />} sx={{ mt: 2 }}>Edit</Button>
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
              InputProps={{
                startAdornment: (
                  <EmailIcon sx={{ mr: 1 }} />
                ),
              }}
            />
            <TextField
              id="firstName"
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <PersonIcon sx={{ mr: 1 }} />
                ),
              }}
            />
            <TextField
              id="lastName"
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <PersonIcon sx={{ mr: 1 }} />
                ),
              }}
            />
            <TextField
              id="location"
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <LocationOnIcon sx={{ mr: 1 }} />
                ),
              }}
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ mr: 1 }} />
                ),
              }}
            />
            <TextField
              id="phone"
              name="phone"
              label="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <PhoneIcon sx={{ mr: 1 }} />
                ),
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button type="submit" variant="contained" startIcon={<SaveIcon />} sx={{ mr: 2 }}>
                Save
              </Button>
              <Button variant="contained" color="error" startIcon={<CancelIcon />} onClick={handleCancelClick}>
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
