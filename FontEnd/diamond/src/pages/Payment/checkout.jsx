import React, { useState } from 'react';
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, Divider, Alert } from '@mui/material';
import paypal from '../Service/img/PayPal_Logo.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';

<<<<<<< HEAD
=======
const fakeFormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
  phone: '1234567890',
  address: '123 Main St, City, Country',
  date: '2024-06-30',
  service: ['Valuation', 'Appraisal'],
  paymentMethod: 'PayPal'
};
>>>>>>> 834f79b370566ec58ef3a196806fa6076eb7a69f

const servicePrices = {
  'Valuation': 100,
  'Appraisal': 150,
  'Sculpture': 200
};

const Checkout = () => {
<<<<<<< HEAD
  const { formData } = useLocation().state ;
=======
  const { formData } = useLocation().state || { formData: fakeFormData };
>>>>>>> 834f79b370566ec58ef3a196806fa6076eb7a69f
  const [checkPay , setCheckPay] = useState(true);

  const calculateTotal = () => {
    if (formData.service) {
      return formData.service.reduce((total, service) => total + (servicePrices[service] || 0), 0);
    }
    return 0;
  };

  const total = calculateTotal();

  const navigate = useNavigate('');
  const handleBookingClick = () => {
<<<<<<< HEAD
    // const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    // existingOrders.push(formData);
    // localStorage.setItem('orders', JSON.stringify(existingOrders));
=======
>>>>>>> 834f79b370566ec58ef3a196806fa6076eb7a69f
    alert(' Booking successful !');
    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
     Booking successful !
    </Alert>
    
    setTimeout(() => {
      navigate('/');
    }, 100);
  };
  const handlePayClick = () => {
    if(checkPay === true){   
<<<<<<< HEAD
      const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
      existingOrders.push(formData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
=======
>>>>>>> 834f79b370566ec58ef3a196806fa6076eb7a69f
      navigate('/Payment-checkout-success')
    }else{
      alert(' Pay Fail')
    }
  }
  return (
    <div className="wrapperrrrr">
      <Paper className="checkout-paper" elevation={3}>
        <div className='header-checkout'>
          <Typography variant="h4" align="center" gutterBottom>
          RECEIPT
          </Typography>
          <Typography variant="subtitle1" align="center">
            Please check your receipt
          </Typography>
        </div>

        <Box padding={2}>
          <Typography variant="h6">Customer Information</Typography>
          <Typography>Name: {formData.firstName} {formData.lastName}</Typography>
          <Typography>Email: {formData.email}</Typography>
          <Typography>Phone Number: {formData.phone}</Typography>
          <Typography>Address: {formData.address}</Typography>
          <Typography>Preferred Appraisal Date: {formData.date}</Typography>

          <Box marginTop={2}>
            <Typography variant="h6">Services</Typography>
            {formData.service && formData.service.length > 0 ? (
              <List>
                {formData.service.map((service, index) => (
                  <ListItem key={index} divider>
                    <ListItemText primary={service} />
                    <Typography variant="body2">${servicePrices[service] || 0}</Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No services selected.</Typography>
            )}
          </Box>

          <Box marginTop={2}>
            <Typography variant="h6">Payment Method</Typography>
            <Typography>
              {formData.paymentMethod === 'PayPal' ? (
                <img src={paypal} alt="PayPal Logo" style={{ width: 70, height: 20 }} />
              ) : (
                <strong>Cash</strong>
              )}
            </Typography>
          </Box>

          <Divider style={{ margin: '20px 0' }} />

          <Box marginTop={2}>
            <Typography variant="h6">Total: ${total}</Typography>
          </Box>

          <Box marginTop={2} display="flex" justifyContent="center">
            {formData.paymentMethod === "Cash" ? (

              <Button onClick={handleBookingClick} variant="contained" color="primary" >
                BOOKING NOW
              </Button>
            ) : (
              <Button onClick={handlePayClick} variant="contained" color="primary" >
                PAY NOW
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </div>
  );
}

export default Checkout;
