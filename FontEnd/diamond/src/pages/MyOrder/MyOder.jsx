import React, { useState, useEffect } from 'react';
import { Box, Button, Stepper, Step, StepLabel, Typography, Paper, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'];

const MyOrder = () => {
 const [activeStep, setActiveStep] = React.useState(0);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
  }, []);

  const handleStepChange = (orderId, newStep) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, step: newStep };
      }
      return order;
    });

    setOrders(updatedOrders);   
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    if (newStep >= steps.length) {
      handleRemoveOrder(orderId);
    } else {
      setSelectedOrder(prevOrder => ({ ...prevOrder, step: newStep }));
    }
  };

  const handleRemoveOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setSelectedOrder(null);
    setModalOpen(false);
  };

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className='wrapperrr'>
      <Box sx={{ margin: 2 }}>
        <Typography variant="h4">Tracking Service Process</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', margin: 2 }}>
        {orders.length === 0 ? (
          <Typography>No orders to track.</Typography>
        ) : (
          orders.map(order => (
            <Paper key={order.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 2, padding: 2 }}>
              <Box>
                <Typography variant="h6">Order ID: {order.id}</Typography>
                <Typography>Customer: {order.firstName} {order.lastName}</Typography>
              </Box>
              <Button variant="contained" onClick={() => handleShowDetails(order)}>Show Details</Button>
            </Paper>
          ))
        )}
      </Box>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ width: 400, padding: 2, margin: 'auto', marginTop: '10%', backgroundColor: 'white', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <IconButton onClick={handleCloseModal} sx={{ alignSelf: 'flex-end' }}>
            <CloseIcon />
          </IconButton>
          {selectedOrder && (
            <>
              <Typography variant="h5" gutterBottom>Order Details</Typography>
              <Stepper nonLinear activeStep={selectedOrder.step} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {selectedOrder.step >= steps.length ? (
                <Typography>Order Completed</Typography>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => handleStepChange(selectedOrder.id, selectedOrder.step + 1)}
                  sx={{ marginTop: 2 }}
                >
                  Next Step
                </Button>
              )}
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default MyOrder;
