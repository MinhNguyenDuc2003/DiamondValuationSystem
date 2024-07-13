import React, { useState, useEffect } from "react";
import { Form } from "antd";
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
  TextField,
  Typography,
} from "@mui/material";
import paypal from "./img/PayPal_Logo.jpg";
import { useNavigate } from "react-router-dom";
import { getAllServices, getCustomerById } from "../../utils/ApiFunction";

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

const ServiceForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [serviceSelected, setServiceSelected] = useState([]);
  const [payMentSelected, setPayMentSelected] = useState("");
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách dịch vụ
        const serviceResponse = await getAllServices();
        if (serviceResponse.status === 200) {
          setServices(serviceResponse.data);
        }
  
        // // Sau khi lấy danh sách dịch vụ xong, lấy thông tin khách hàng
        // const customerData = await getCustomerById();
        // if (customerData !== null) {
        //   setUser({
        //     id: customerData.id,
        //     email: customerData.email,
        //     first_name: customerData.first_name,
        //     last_name: customerData.last_name,
        //     phone_number: customerData.phone_number,
        //     location: customerData.location,
        //   });
        // }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, []);

  const onFinish = () => {
    const serviceSelect = serviceSelected.reduce((value, service, index) => {
      return index === 0 ? service : value + "," + service;
    }, "");
    localStorage.setItem("selectedDate", selectedDate);
    localStorage.setItem("serviceSelected", serviceSelect);
    localStorage.setItem("paymentMethod", payMentSelected);

    navigate("/Payment-checkout");
  };

  const handleDateChange = (e) => {
    const chosenDate = new Date(e.target.value);
    const today = new Date();
    // Set hours to 0 to compare only the date part
    today.setHours(0, 0, 0, 0);

    if (chosenDate >= today) {
      setSelectedDate(e.target.value);
    } else {
      alert('Please select a date that is today or in the future.');
    }
  };

  const handleServiceChange = (event) => {
    const { value } = event.target;
    setServiceSelected(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div className="wrapperrr">
      <div className="body-content">
        <Form
          {...formItemLayout}
          className="form-valuation"
          onFinish={onFinish}
          style={{
            maxWidth: 1000,
            marginLeft: "15%",
          }}
        >
          
          {/* <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <FormControl fullWidth>
              <TextField
                label="Email"
                value={user.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                fullWidth
                margin="normal"
              />
            </FormControl>
          </Form.Item>
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[
              {
                required: true,
                message: "Please input your first name!",
              },
            ]}
          >
            <FormControl fullWidth>
              <TextField
                label="First Name"
                value={user.first_name || ""}
                onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                fullWidth
                margin="normal"
              />
            </FormControl>
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[
              {
                required: true,
                message: "Please input your last name!",
              },
            ]}
          >
            <FormControl fullWidth>
              <TextField
                label="Last Name"
                value={user.last_name || ""}
                onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                fullWidth
                margin="normal"
              />
            </FormControl>
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            <FormControl fullWidth>
              <TextField
                label="Phone Number"
                value={user.phone_number || ""}
                onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
                fullWidth
                margin="normal"
              />
            </FormControl>
          </Form.Item>
          <Form.Item
            label="Address"
            name="location"
            rules={[
              {
                required: true,
                message: "Please input your address!",
              },
            ]}
          >
            <FormControl fullWidth>
              <TextField
                label="Address"
                value={user.location || ""}
                onChange={(e) => setUser({ ...user, location: e.target.value })}
                fullWidth
                margin="normal"
              />
            </FormControl>
          </Form.Item> */}
          <Form.Item
            label="Preferred Appraisal Date"
            name="date"
            rules={[
              {
                required: true,
                message: "Please input date!",
              },
            ]}
          >
            <FormControl fullWidth>
              <TextField
                label="Preferred Appraisal Date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e)}
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Form.Item>
          <Form.Item label="Choose Service" name="service">
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
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Typography key={value}>{value} <>&nbsp;</> <>&nbsp;</></Typography> 
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {services.map((service) => (
                  <MenuItem key={service.id} value={service.name}>
                    {service.name} - {service.money}
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
                message: "Please choose your Method Payment!",
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
                <FormControlLabel
                  value="CASH"
                  control={<Radio />}
                  label="Cash"
                />
                <FormControlLabel
                  value="PAYPAL"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <img
                        src={paypal}
                        alt="PayPal"
                        height="20"
                        style={{ marginRight: 5 }}
                      />
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Form.Item>
          <Form.Item>
            <Box
              marginTop={2}
              marginLeft={5}
              display="flex"
              justifyContent="center"
            >
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
