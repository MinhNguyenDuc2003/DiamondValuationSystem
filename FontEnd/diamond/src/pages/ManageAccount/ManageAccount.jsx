import React, {useEffect, useState} from 'react'
import { Container, Typography, TextField, Box } from '@mui/material';
import { Alert, Button} from '@mui/material'
import { getCustomerById, updateAccount } from '../../utils/ApiFunction';
import { useNavigate } from 'react-router-dom';

const ManageAccount = () => {
  const [user, setUser] = useState({
    id : "",
    email : "",
    first_name: "",
    last_name: "",
    phone_number: "",
    location: ""
  });
  const [error , setError] = useState("")
  const navigate = useNavigate()
  useEffect(() => {
    const getCustomer = async() => {
      const data = await getCustomerById();
      if(data!==null){
        setUser({
          id : data.id,
          email : data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          location: data.location
        }); 
      }
    }
    getCustomer();
  }, [navigate])

  // Function to handle form input change
  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
   try {
    const response = await updateAccount(user);
    if(response.status === 200){
      alert("update account successfully!")
      window.location.reload()
    }
   } catch (error) {
      setError("This email is already exist!")
   }
   setTimeout(() => {
    setError("");
  }, 5000);
  };

  return (
    <Container maxWidth="sm" className='wrapperrr'>
      <Typography variant="h3" gutterBottom>Your Profile</Typography>
      <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, boxShadow: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
            sx={{color:'gray'}}
              id="email"
              name="email"
              label="Email"
              value={user.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              id="first_name"
              name="first_name"
              label="First Name"
              variant="outlined"
              value={user.first_name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              id="last_name"
              name="last_name"
              label="Last Name"
              variant="outlined"
              value={user.last_name}
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
              value={user.location}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              id="phone_number"
              name="phone_number"
              label="Phone"
              variant="outlined"
              value={user.phone_number}
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