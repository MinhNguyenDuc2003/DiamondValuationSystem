import './Service.scss';
import React, { useState } from 'react';
import { Form } from 'antd';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField
}
  from '@mui/material';
import paypal from './img/PayPal_Logo.jpg';
import { useNavigate } from 'react-router-dom';

//các style từ MUI
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


//ten các service
const names = [
  'Valuation',
  'Appraisal',
  'Sculpture'
];

const ServiceForm = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState();
  const [form] = Form.useForm();
  const [serviceSelected, setServiceSelected] = useState([]);
  const [payMentSelected, setPayMentSelected] = useState('');
  const currentDate = new Date();
  // Hàm lấy ngày, tháng, năm 
  const day = currentDate.getDate().toString().padStart(2, '0'); 
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); 
  const year = currentDate.getFullYear(); 

  //hàm tạo chuỗi ngày tháng năm dạng "dd-mm-yyyy"
  const formattedDate = `${day}-${month}-${year}`;

  const onFinish = (values) => {
    //hàm random RequestID
    const requestId = Math.floor(Math.random() * 10) + 1;
    //hàm lấy userID
    const userId = JSON.parse(window.localStorage.getItem('user'));
    //tạo ra request từ các data
    const request = {
      ...values,
      userID: userId.id,
      currentDate: formattedDate,
      id: requestId,
      date: selectedDate,
      service: serviceSelected,
      paymentMethod: payMentSelected
    };

    //truyền các dữ liệu đã nhập từ form sag PayMent Recipt
    navigate('/Payment-checkout', {
      state: {
        formData: request
      }
    });
  };

  const handleServiceChange = (event) => {
    const { value } = event.target;
    setServiceSelected(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleChangeDate = (value) => {

    // const selectedDate = new Date(value)
    // if(currentDate > selectedDate){
    //   console.log('Ngày nhập liệu bé hơn ngày hiện tại');
    // }else{
    setSelectedDate(value)
    // }
  }
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
            <TextField label='First Name' fullWidth />
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
            <TextField label='Last Name' fullWidth />
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
            <TextField label="Email" fullWidth />
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
            <TextField label='Phone Number' fullWidth />
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
            <TextField label="Address" fullWidth />
          </Form.Item>
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
                onChange={(e) => handleChangeDate(e.target.value)}
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
                onChange={(event) => handleServiceChange(event)} 
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
                {names.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}

                  >
                    {name}
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
          </Form.Item>
          <Form.Item>
            <Box marginTop={2} marginLeft={45} display="flex" justifyContent="center">
              <Button variant="contained" type="submit" >
                Submit
              </Button>
            </Box>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ServiceForm;
