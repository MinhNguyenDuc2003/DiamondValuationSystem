import React, {useState} from 'react'
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const ManageAccount = () => {
    const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('user')) || {}); // Parse user object from localStorage
  const [editMode, setEditMode] = useState(false); // State to manage edit mode
  const [formData, setFormData] = useState({
    email: user.Email || '',
    firstName: user.FirstName || '',
    lastName: user.LastName || '',
    location: user.Location || '',
    password: user.Password || '',
    phone: user.Phone || ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
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

      // Call API to update user data
      const userId = user.id; 
      const response = await fetch(`https://6660044b5425580055b1c21d.mockapi.io/Assignment/User/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...user,
          Email: formData.email ,
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Location: formData.location,
          Password: formData.password,
          Phone: formData.phone
        })
      });

      if (response.ok) {
        console.log('User data updated successfully');
      } else {
        console.error('Failed to update user data');
      }

      setEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <Container maxWidth="sm" className='wrapperrr'>
      <Typography variant="h3" gutterBottom>Your Profile</Typography>
      <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, boxShadow: 1 }}>
        
          <form onSubmit={handleSubmit}>
            <TextField
            sx={{color:'gray'}}
              id="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
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
            />
            {/* Add more TextFields for additional fields */}
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Save
            </Button>
          </form>
       
      </Box>
    </Container>
  )
}

export default ManageAccount