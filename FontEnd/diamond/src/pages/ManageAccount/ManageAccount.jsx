import React, { useState } from 'react'
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const ManageAccount = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
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

=======
  useEffect(() => {
    const getCustomer = async () => {
      const data = await getCustomerById();
      if (data !== null) {
        setUser({
          id: data.id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          location: data.location,
        });
      }
    };
    getCustomer();
  }, [navigate]);
  
  // Function to handle form input change
>>>>>>> b2d141de4e9de793f8e8450098c16aee0cc0e9f7
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
          Email: formData.email,
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

    <Container maxWidth="lg" className='wrapperrr' sx={{ bgcolor: '#333' }}>
      <Typography variant="h3" gutterBottom>Your Profile</Typography>
      <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, boxShadow: 1 }}>

        <form onSubmit={handleSubmit}>
          <TextField
            sx={{ color: 'gray' }}
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