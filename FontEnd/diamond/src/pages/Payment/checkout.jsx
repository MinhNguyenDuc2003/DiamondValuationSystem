import React, { useState } from 'react';
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, Divider, Alert } from '@mui/material';
import paypal from '../Service/img/PayPal_Logo.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import { ToastContainer, toast } from 'react-toastify';

//khai báo giá của service
const servicePrices = {
  'Valuation': 100,
  'Appraisal': 150,
  'Sculpture': 200
};

const Checkout = () => {
  const { formData } = useLocation().state ;
  const [checkPay , setCheckPay] = useState(true);
  const navigate = useNavigate('');
  
  //hàm tính giá tiền của các service sử dụng
  const calculateTotal = () => {
    if (formData.service) {
      return formData.service.reduce((total, service) => total + (servicePrices[service] || 0), 0);
    }
    return 0;
  };
  
  const total = calculateTotal();
  
  //call api de check exist requestID ở method : Carh
  const handleBookingClick = () => {
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    existingOrders.push(formData);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

   toast.success(` Booking successful !`, {autoClose : 3000})
    setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 4000);
  };
  //call api de check exist requestID ở method : PayPal
  const handlePayClick = () => {
    if(checkPay === true){   
      const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
      existingOrders.push(formData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      navigate('/Payment-checkout-success')
    }else{
      toast.error(`Pay Fail`, {autoClose : 2000})
    }
  }
  return (
    <div className="wrapperrrrr">
      <ToastContainer/>
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
