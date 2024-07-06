import React, { useEffect, useState } from 'react'
import successIcon from './successsss.jpg'
import { Link, Typography } from '@mui/material'
import { processPayment } from '../../utils/ApiFunction';
import { useSearchParams } from 'react-router-dom'
const Success = () => {
  const [searchParams] = useSearchParams();
  const [cart , setCart] = useState({
    selectedDate : "",
    serviceSelected : [],
    paymentMethod : ""
});
useEffect(() => {
  const date = localStorage.getItem("selectedDate");
  const serviceSelect = localStorage.getItem("serviceSelected");
  const paymentMethod = localStorage.getItem("paymentMethod");
  const serviceSelected = serviceSelect ? serviceSelect.split(",") : [];
  
  setCart({
    selectedDate: date,
    serviceSelected: serviceSelected,
    paymentMethod: paymentMethod
  });
}, []); // Only run once, on mount

useEffect(() => {
  const executePayment = async () => {
    const paymentId = searchParams.get('paymentId');
    const PayerID = searchParams.get('PayerID');

    if (cart.selectedDate && cart.serviceSelected.length && cart.paymentMethod) { // Check if cart is populated
      const response = await processPayment(paymentId, PayerID, cart);
      
      if (response && response.status === 200) {
        localStorage.removeItem('serviceSelected');
        localStorage.removeItem('paymentMethod');
        localStorage.removeItem('selectedDate');
      }
    }
  };

  executePayment();
}, [cart]); // Run when cart is updated
  

  return (
    <div style={{marginBottom : '12%'}} className='wrapperrr'>
        <img style={{width : '10%'}} src={successIcon}/>
        <Typography>Payment Success. Thanks for use Service</Typography>
        <Link href="/">Back to HomePage</Link>
        </div>
  )
}
export default Success