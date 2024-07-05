import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, Divider, Alert } from '@mui/material';
import paypal from '../Service/img/PayPal_Logo.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import { createPayment, getAllServices, getCustomerById, placeOrderDiamond } from '../../utils/ApiFunction';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Link } from '@mui/material';

const Checkout = () => {
  const [user, setUser] = useState({});
  const [cart , setCart] = useState({
        selectedDate : "",
        serviceSelected : [],
        paymentMethod : ""
  });
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [services, setServices] = useState([])
  const navigate = useNavigate('');
  const [error, setError] = useState('');

  const getMoneyByService = (name) => {
    const serviceSelect = services.filter(service => service.name === name);
    if (serviceSelect.length > 0) {
      return serviceSelect[0].money;
    }
    return null; // or a default value like 0
  };
  

  useEffect(() => {
    const getCustomer = async() => {
        const data = await getCustomerById();
        if(data!==null){
          setUser({
            fullname : data.first_name + " " + data.last_name,
            email : data.email,
            phone_number : data.phone_number,
            location : data.location
          }); 
        }
      }
      const Services = async() => {
        try {
          const response = await getAllServices();
          if(response.status === 200){
            setServices(response.data);
          }
        } catch (error) {
          console.log(error);
        }
      }
      Services();
    const date = localStorage.getItem("selectedDate");
    const serviceSelect = localStorage.getItem("serviceSelected")
    const paymentMethod = localStorage.getItem("paymentMethod")
    const serviceSelected = serviceSelect.split(",");
    
      setCart({
        selectedDate : date,
        serviceSelected : serviceSelected,
        paymentMethod : paymentMethod
      })
      getCustomer();
},[])

useEffect(() => {
  const calculateTotal = () => {
    if (cart.serviceSelected.length > 0 && services.length > 0) {
      return services.reduce((total, service) => {
        if (cart.serviceSelected.includes(service.name)) {
          return total + service.money;
        }
        return total;
      }, 0);
    }
    return 0;
  };

  const total = calculateTotal();
  setTotal(total);
}, [cart.serviceSelected, services]);

  const handleBookingClick = () => {
    
      const placeOrder = async() => {
        try {
        const response = await placeOrderDiamond(cart);
        if(response.status === 200){
          localStorage.removeItem('serviceSelected');
          localStorage.removeItem('paymentMethod');
          localStorage.removeItem('selectedDate');
          setOpen(true);
        }else{
          setError("Sorry, some problem happen with your order please try again!")
        }
      } catch (error) {
        setError("Sorry, some problem happen with your order please try again!")
      }
      } 
      placeOrder();

    setTimeout(() => {
      setError("");
    }, 6000);
  };
  const handlePayClick = async() => {
      const response = await createPayment(total);
      try {
        if(response.status === 200){
          window.location.href = response.data;
        }else{
          setError("Sorry, some problem happen with your order please try again!")
        }
      } catch (error) {
          setError("Sorry, some problem happen with your order please try again!")
      }
      setTimeout(() => {
        setError("");
      }, 6000);
  }


const handleClickDialog = () => {
    setOpen(false)
    navigate("/");
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
        {error &&  (<Alert key='danger' variant='danger'>
                            {error}
                    </Alert>)}
          <Typography variant="h6">Customer Information</Typography>
          <Typography>Name: {user.fullname  }</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Phone Number: {user.phone_number}</Typography>
          <Typography>Address: {user.location}</Typography>
          <Typography>Preferred Appraisal Date(yyyy/MM/dd): {cart.selectedDate}</Typography>

          <Box marginTop={2}>
            <Typography variant="h6">Services</Typography>
            {cart.serviceSelected && cart.serviceSelected.length > 0 ? (
              <List>
                {cart.serviceSelected.map((service, index) => (
                  <ListItem key={index} divider>
                    <ListItemText primary={service} />
                    <Typography variant="body2">${getMoneyByService(service)}</Typography>
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
              {cart.paymentMethod === 'PAYPAL' ? (
                <img src={paypal} alt="PayPal Logo" style={{ width: 70, height: 20 }} />
              ) : (
                <strong>CASH</strong>
              )}
            </Typography>
          </Box>

          <Divider style={{ margin: '20px 0' }} />

          <Box marginTop={2}>
            <Typography variant="h6">Total: ${total}</Typography>
          </Box>

          <Box marginTop={2} display="flex" justifyContent="center">
            {cart.paymentMethod === "CASH" ? (

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
      <Dialog
                open={open}
                onClose={handleClickDialog}
            >
            <DialogTitle>Booking successfully</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Booking created successfully!
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClickDialog} color="primary">
                Close
            </Button>
            </DialogActions>
            </Dialog>
    </div>
  );
}

export default Checkout;
