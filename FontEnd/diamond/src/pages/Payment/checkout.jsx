<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, Divider, Alert, Grid, Avatar, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { createPayment, getAllServices, getCustomerById, placeOrderDiamond } from '../../utils/ApiFunction';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import paypal from '../Service/img/PayPal_Logo.jpg';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit'

const Checkout = () => {
  const [user, setUser] = useState({});
  const [cart, setCart] = useState({
    selectedDate: "",
    serviceSelected: [],
    paymentMethod: ""
  });
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getMoneyByService = (name) => {
    const serviceSelect = services.filter(service => service.name === name);
    return serviceSelect.length > 0 ? serviceSelect[0].money : 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all services
        const fetchServices = async () => {
          const response = await getAllServices();
          if (response.status === 200) {
            setServices(response.data);
          }
        };
  
        // Fetch customer data
        const fetchUser = async () => {
          const data = await getCustomerById();
          if (data) {
            setUser({
              fullname: `${data.first_name} ${data.last_name}`,
              email: data.email,
              phone_number: data.phone_number,
              location: data.location
            });
          }
        };
  
        await fetchServices();
        await fetchUser();
        
        // Retrieve data from localStorage
        const date = localStorage.getItem("selectedDate");
        const serviceSelect = localStorage.getItem("serviceSelected");
        const paymentMethod = localStorage.getItem("paymentMethod");
        const serviceSelected = serviceSelect ? serviceSelect.split(",") : [];
  
        setCart({
          selectedDate: date,
          serviceSelected: serviceSelected,
          paymentMethod: paymentMethod
        });
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const calculateTotal = () => {
      return cart.serviceSelected.reduce((total, service) => {
        return total + getMoneyByService(service);
      }, 0);
    };

    setTotal(calculateTotal());
  }, [cart.serviceSelected, services]);

  const handleBookingClick = async () => {
    try {
      const response = await placeOrderDiamond(cart);
      if (response.status === 200) {
        localStorage.removeItem('serviceSelected');
        localStorage.removeItem('paymentMethod');
        localStorage.removeItem('selectedDate');
        setOpen(true);
      } else {
        setError("Sorry, some problem happen with your order please try again!");
      }
    } catch (error) {
      setError("Sorry, some problem happen with your order please try again!");
    }
>>>>>>> b2d141de4e9de793f8e8450098c16aee0cc0e9f7
    setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 4000);
  };
<<<<<<< HEAD
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
=======

  const handlePayClick = async () => {
    try {
      const response = await createPayment(total);
      if (response.status === 200) {
        window.location.href = response.data;
      } else {
        setError("Sorry, some problem happen with your order please try again!");
      }
    } catch (error) {
      setError("Sorry, some problem happen with your order please try again!");
    }
    setTimeout(() => {
      setError("");
    }, 6000);
  };

  const handleClickDialog = () => {
    setOpen(false);
    navigate("/");
  };

>>>>>>> b2d141de4e9de793f8e8450098c16aee0cc0e9f7
  return (
    <Container maxWidth="md" sx={{ padding: 4, mt: '100px' }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, backgroundColor: 'white', color: 'black' }}>
        <ToastContainer />
        <Box className="header-checkout" sx={{ textAlign: 'center', marginBottom: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#56758d' }}>RECEIPT</Typography>
          <Typography variant="subtitle1" sx={{ color: 'black' }}>Please check your receipt</Typography>
        </Box>

<<<<<<< HEAD
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
=======
        {error && (<Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>)}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ marginRight: 2 }}>
                <AccountCircleIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ color: '#56758d' }}>Customer Information</Typography>
                <Button
                  onClick={e => navigate('/account')}
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  sx={{ fontSize: '11px', marginTop: '4px', borderColor: '#56758d', color: '#56758d' }}
                >
                  Edit
                </Button>
              </Box>
            </Box>
            <Typography>Name: {user.fullname}</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Phone Number: {user.phone_number}</Typography>
            <Typography>Address: {user.location}</Typography>
            <Typography>Preferred Appraisal Date: {cart.selectedDate}</Typography>
            {/* <Link to={"/account"}>Change your information</Link> */}
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h6" sx={{ color: '#56758d' }}>Services</Typography>
              {cart.serviceSelected.length > 0 ? (
                <List>
                  {cart.serviceSelected.map((service, index) => (
                    <ListItem key={index} divider sx={{ borderBottom: '1px solid #444' }}>
                      <ListItemText primary={service} />
                      <Typography variant="body2">${getMoneyByService(service)}</Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No services selected.</Typography>
>>>>>>> b2d141de4e9de793f8e8450098c16aee0cc0e9f7
              )}
            </Box>
          </Grid>
        </Grid>

<<<<<<< HEAD
          <Divider style={{ margin: '20px 0' }} />

          <Box marginTop={2}>
            <Typography variant="h6">Total: ${total}</Typography>
          </Box>

          <Box marginTop={2} display="flex" justifyContent="center">
            {formData.paymentMethod === "Cash" ? (

              <Button onClick={handleBookingClick} variant="contained" color="primary" >
                BOOKING NOW
              </Button>
=======
        <Box mt={4}>
          <Typography variant="h6" sx={{ color: '#56758d' }}>Payment Method</Typography>
          <Typography>
            {cart.paymentMethod === 'PAYPAL' ? (
              <img src={paypal} alt="PayPal Logo" style={{ width: 70, height: 20 }} />
>>>>>>> b2d141de4e9de793f8e8450098c16aee0cc0e9f7
            ) : (
              <strong>CASH</strong>
            )}
          </Typography>
        </Box>

        <Divider style={{ margin: '20px 0', backgroundColor: '#444' }} />

        <Box mt={4}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Total: ${total.toFixed(2)}</Typography>
        </Box>

        <Box mt={4} display="flex" justifyContent="center">
          {cart.paymentMethod === "CASH" ? (
            <Button onClick={handleBookingClick} variant="contained" >
              BOOKING NOW
            </Button>
          ) : (
            <Button onClick={handlePayClick} variant="contained">
              PAY NOW
            </Button>
          )}
        </Box>
      </Paper>
<<<<<<< HEAD
    </div>
=======

      <Dialog open={open} onClose={handleClickDialog}>
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
    </Container>
>>>>>>> b2d141de4e9de793f8e8450098c16aee0cc0e9f7
  );
};

export default Checkout;
