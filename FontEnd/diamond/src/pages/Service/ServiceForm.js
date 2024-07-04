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
import paypal from './img/PayPal_Logo.jpg';
import { useNavigate } from 'react-router-dom';

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

const names = [
  'Valuation',
  'Appraisal',
  'Sculpture'
];

const ServiceForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [serviceSelected, setServiceSelected] = useState([]);
  const [payMentSelected, setPayMentSelected] = useState('');
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
      }
    });
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
              Submit
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default ServiceForm;
