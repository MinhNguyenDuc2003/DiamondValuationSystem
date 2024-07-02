import React, { useState, useEffect } from 'react';
import { Box, Button, Stepper, Step, StepLabel, Typography, Paper, Modal, IconButton, Pagination, TableContainer, TableHead, TableRow, TableCell, Table, TableBody, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
const steps = ['Payment', 'Consultation', 'Reception', 'Appraisal', 'Completion'];

const MyOrder = () => {

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalRequest, setTotalRequest] = useState('');
  const [totalDone, setTotalDone] = useState('');
  const [totalCompletedSteps, setTotalCompletedSteps] = useState(0);
  //phan trang , 3 request / 1 trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Hàm để lấy một bước ngẫu nhiên từ mảng steps
  const getRandomStep = () => {
    const randomIndex = Math.floor(Math.random() * steps.length);
    return steps[randomIndex];
  };
  //call api de lay tất cả request ở đây
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
    //dung để lấy ra độ dài của mảng
    setTotalRequest(storedOrders.length);
    const completedOrders = storedOrders.filter(order => order.paymentMethod === 'PayPal');
    setTotalDone(completedOrders.length);

    const completedSteps = storedOrders.filter(order => order.step === 'Completion');
    setTotalCompletedSteps(completedSteps.length);
  }, []);



  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const sortByDone = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const DoneList = storedOrders.filter(request => request.paymentMethod !== 'Cash')
    setOrders(DoneList);
  }
  const sortByTotal = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
  }
  const sortByProcess = () => {
    const completedSteps = orders.filter(orders => orders.step === 'Completion');
    setOrders(completedSteps);
  }

  //các hàm khai báo phục vụ cho  phân trang
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <Box className='wrapperrr' >

      <Box sx={{ margin: 2, textAlign: 'start', marginBottom: '10px', paddingTop: '10px' }}>
        <Typography variant="h4">Tracking Request Process</Typography>
        <Typography variant="body2">Manage your services you use</Typography>
      </Box>
      <Box>

        <Box sx={{ ml: '17px', display: 'flex', gap: '20px', borderTop: '2px solid #eee' }}>


          <Box sx={{ display: 'flex', gap: '4px  ', mt: '10px', borderLeft: 2, textAlign: 'start' }}>
            <Typography><NotificationsNoneIcon /> </Typography>
            <Button onClick={sortByTotal} >
              Total
              <br />
              {totalRequest}
            </Button>

          </Box>
          <Box sx={{ display: 'flex', gap: '7px  ', mt: '10px', borderLeft: 2, textAlign: 'start' }}>
            <Typography><WorkOutlineIcon /> </Typography>
            <Button onClick={sortByProcess} >
              Process
              <br />
              {totalCompletedSteps}
            </Button>
          </Box>
          <Box sx={{ display: 'flex', mt: '10px', borderLeft: 2, textAlign: 'start' }}>
            <Typography><CheckIcon /> </Typography>
            <Button onClick={sortByDone}>
              Done
              <br />
              {totalDone}
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', margin: 2 }}>
          {orders.length === 0 ? (
            <Typography>No Request to track.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Request Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentOrders.map((request) => (
                    <>
                      <TableRow
                        key={request.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      />
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.currentDate}</TableCell>
                      <TableCell>{request.service.join(', ')}</TableCell>
                      <TableCell>{request.paymentMethod}</TableCell>
                      <TableCell>{request.paymentMethod === 'PayPal' ? 'Done' : 'Not Yet'}</TableCell>
                      <TableCell>
                        {'Wait ' + getRandomStep()}
                        <br />
                        <Button onClick={() => handleShowDetails(request)} >details</Button>
                      </TableCell>
                    </>
                  ))}

                </TableBody>
              </Table>
            </TableContainer>

          )}
        </Box>
      </Box>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ width: 500, padding: 2, margin: 'auto', marginTop: '10%', backgroundColor: 'white', boxShadow: 24, p: 4, borderRadius: 2 }}>
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
              {selectedOrder.step >= steps.length && (
                <Typography>Order Completed</Typography>
              )}
            </>
          )}
        </Box>
      </Modal>

      <Pagination
        //Dùng để phân trang
        count={Math.ceil(orders.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        shape="rounded"
      />
    </Box>
  );
};

export default MyOrder;
