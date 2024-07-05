<<<<<<< HEAD
import './Service.scss';
import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import { Box, Button, Chip, FormControl, FormControlLabel, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField } from '@mui/material';
=======
import React, { useEffect, useState } from 'react';
import './ServiceForm.scss'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from '@mui/material';
>>>>>>> 7cb4221b0519a05c4f7d761104d5fceec8749517
import paypal from './img/PayPal_Logo.jpg';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { getAllServices } from '../../utils/ApiFunction';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};
=======
>>>>>>> 7cb4221b0519a05c4f7d761104d5fceec8749517

// Style constants
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

<<<<<<< HEAD
const getStyles = (name, personName, theme) => {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};
=======
const names = [
  'Valuation',
  'Appraisal',
  'Sculpture'
];
>>>>>>> 7cb4221b0519a05c4f7d761104d5fceec8749517

const ServiceForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [serviceSelected, setServiceSelected] = useState([]);
  const [payMentSelected, setPayMentSelected] = useState('');
<<<<<<< HEAD
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(()=> {
    const Services = async() => {
      try {
        const response = await getAllServices();
        if(response.status === 200){
          setServices(response.data);
        }
      } catch (error) {
        console.log(error);
=======
  const currentDate = new Date();

  // Hàm lấy ngày, tháng, năm
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const onFinish = () => {
    const requestId = Math.floor(Math.random() * 10) + 1;
    const userId = JSON.parse(window.localStorage.getItem('user'));
    //lay du liệu của user và thêm vào request
    const request = {
      userID: userId.id,
      currentDate: formattedDate,
      id: requestId,
      date: selectedDate,
      service: serviceSelected,
      paymentMethod: payMentSelected,
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.Email,
      phone: user.Phone,
      address: user.Location,
    };

    navigate('/Payment-checkout', {
      state: {
        formData: request
>>>>>>> 7cb4221b0519a05c4f7d761104d5fceec8749517
      }
    }
    Services();
  }, [])



  const onFinish = () => {
    const serviceSelect = serviceSelected.reduce((value, service, index) => {
      return index === 0 ? service : value + ',' + service;
    }, '');
    localStorage.setItem("selectedDate", selectedDate)
    localStorage.setItem("serviceSelected", serviceSelect)
    localStorage.setItem("paymentMethod", payMentSelected)

    navigate('/Payment-checkout');
  };

  const handleServiceChange = (event) => {
    const { value } = event.target;
    setServiceSelected(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleChangeDate = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem('user'));
    setUser(data);
  }, []);

  return (
    <div className='wrapperrr'>
      <div className="body-content">
<<<<<<< HEAD
        <Form
          form={form}
          {...formItemLayout}
          className='form-valuation'
          onFinish={onFinish}
          style={{
            maxWidth: 1000,
          }}
        >
          <Form.Item
            label="Preferred Appraisal Date"
            name="date"
            rules={[
              {
                required: true,
                message: 'Please input date!',
              },
            ]}
          >
            <FormControl fullWidth>
              <TextField
                label="Preferred Appraisal Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Form.Item>
          <Form.Item
            label="Choose Service"
            name='service'
           
          >
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-chip-label">Service</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={serviceSelected}
                onChange={(event) => handleServiceChange(event)} // Pass event directly
                input={<OutlinedInput id="select-multiple-chip" label="Service" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <MenuItem key={value} label={value} 
                      >
                        {value}
                        </MenuItem>
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {services.map((service, index) => (
                  <MenuItem
                    key={service.id}
                    value={service.name}
                    
                  >
                    {service.name} - {service.content}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Form.Item>
          <Form.Item
            label="Payment Methods"
            name="paymentMethod"
            rules={[
              {
                required: true,
                message: 'Please choose your Method Payment!',
              },
            ]}
          >
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-labelledby="payment-method-radio-group-label"
                name="paymentMethod"
                value={payMentSelected}
                onChange={(e) => setPayMentSelected(e.target.value)}
              >
                <FormControlLabel value="CASH" control={<Radio />} label="Cash" />
                <FormControlLabel
                  value="PAYPAL"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <img src={paypal} alt="PayPal" height="20" style={{ marginRight: 5 }} />
                     
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Form.Item>
          <Form.Item>
          <Box marginTop={2} marginLeft={45} display="flex" justifyContent="center">
            <Button variant="contained" type="primary" htmlType="submit">
=======
        <Box component="form" onSubmit={onFinish} sx={{ ml: '30%', maxWidth: 600 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Service Form
          </Typography>
          <TextField
            label="First Name"
            name="FirstName"
            value={user.FirstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            name="LastName"
            value={user.LastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="Email"
            type="email"
            value={user.Email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone Number"
            name="Phone"
            value={user.Phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Address"
            name="Location"
            value={user.Location}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Preferred Appraisal Date"
            name="date"
            type="date"
            value={selectedDate}
            onChange={handleChangeDate}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="service-label">Choose Service</InputLabel>
            <Select
              labelId="service-label"
              id="service"
              multiple
              name="service"
              value={serviceSelected}
              onChange={handleServiceChange}
              input={<OutlinedInput label="Service" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl component="fieldset" margin="normal">

            <RadioGroup
              row
              aria-labelledby="payment-method-radio-group-label"
              name="paymentMethod"
              value={payMentSelected}
              onChange={(e) => setPayMentSelected(e.target.value)}
            >
              <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
              <FormControlLabel
                value="PayPal"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center">
                    <img src={paypal} alt="PayPal" height="20" style={{ marginRight: 5 }} />
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
          <Box sx={{ textAlign: 'right', mt: 2 }}>
            <Button variant="contained" type="submit">
>>>>>>> 7cb4221b0519a05c4f7d761104d5fceec8749517
              Submit
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default ServiceForm;
