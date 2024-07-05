import './Service.scss';
import React, { useState } from 'react';
import { Form } from 'antd';
import { Box, Button, Chip, FormControl, FormControlLabel, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField } from '@mui/material';
import paypal from './img/PayPal_Logo.jpg';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

const getStyles = (name, personName, theme) => {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

const names = [
  'Valuation',
  'Appraisal',
  'Sculpture'
];

const ServiceForm = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();
  const [serviceSelected, setServiceSelected] = useState([]);
  const [payMentSelected, setPayMentSelected] = useState('');
  const navigate = useNavigate();

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue.format('DD/MM/YYYY'));
  };

  const onFinish = (values) => {
    navigate('/Payment-checkout', {
      state: {
        formData: {
          ...values,
          date: selectedDate,
          service: serviceSelected,
          paymentMethod: payMentSelected
        }
      }
    });
  };

  const handleServiceChange = (event) => {
    const { value } = event.target; // Ensure event.target.value exists
    setServiceSelected(
      typeof value === 'string' ? value.split(',') : value
    );
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
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, serviceSelected, theme)}
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
            <Button variant="contained" type="primary" htmlType="submit">
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
