import './Service.scss'
import React, { useState } from 'react';
import { Button, message, Form, Input, DatePicker } from 'antd';
import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import paypal from './img/PayPal_Logo.jpg'
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

const ServiceForm = () => {
  const [form] = Form.useForm();
  const [serviceSelected , setServiceSelected] = useState('Valuation');
  const [payMentSelected , setPayMentSelected] = useState('Cash');
  // const [serviceSelected , setServiceSelected] = useState('Valuation');

  const onFinish = (values) => {
    console.log(values);
    message.success('Form submitted successfully!', 3);
  };

  return (
    <div className='wrapperrr'>
      <div className="body-content">
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
            label="First Name"
            name="firstName"
            rules={[
              {
                required: true,
                message: 'Please input your First Name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              {
                required: true,
                message: 'Please input your Last Name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please input a valid Email!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              {
                required: true,
                message: 'Please input your Phone Number!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: 'Please input your Address!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Preferred Appraisal Date"
            name="date"
            rules={[
              {
                required: true,
                message: 'Please input your Preferred Appraisal Date!',
              },
            ]}
          >
            <DatePicker className='date-picker' />
          </Form.Item>
          <Form.Item
            label="Choose Service"
            name="service"
          
          >
            <FormControl fullWidth>
             <InputLabel id="demo-simple-select-label">Service</InputLabel>
            <Select
             label="Service"
              labelId="service-select-label"
              id="service-select"
              onChange={e => setServiceSelected(e.target.value) }
              value={serviceSelected}
            >
              <MenuItem value="Valuation">Valuation</MenuItem>
              <MenuItem value="Appraisal">Appraisal</MenuItem>
              <MenuItem value="Sculpture">Sculpture</MenuItem>
            </Select>
            </FormControl>
          </Form.Item>
          <Form.Item
            label="Payment Methods"
            name="paymentMethod"
           
          >
            <RadioGroup
              row
              aria-labelledby="payment-method-radio-group-label"
              name="paymentMethod"
              defaultValue= {payMentSelected}
              onChange={e => setPayMentSelected(e.target.value)}
            >
              <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
              <FormControlLabel value="PayPal" control={<Radio />}
               label={
                <Box display="flex" alignItems="center"> 
                  <img src={paypal} alt="PayPal Logo" style={{ width: 70, height: 20 }} />
                </Box>
              }/>
            </RadioGroup>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 6,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ServiceForm;
