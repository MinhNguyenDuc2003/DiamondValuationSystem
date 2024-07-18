import React, { useState, useEffect } from "react";
import { Form } from "antd";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllServices, getCustomerById } from "../../utils/ApiFunction";
import EditIcon from '@mui/icons-material/Edit'
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
  // const [payMentSelected, setPayMentSelected] = useState("");
  const [services, setServices] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const Services = async () => {
      try {
        const response = await getAllServices();
        if (response.status === 200) {
          setServices(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    Services();
  }, []);

  useEffect(() => {
    const getCustomer = async () => {
      const data = await getCustomerById();
      if (data !== null) {
        setUser({
          id: data.id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          location: data.location,
        });
      }
    };
    getCustomer();
  }, []);

  const onFinish = () => {
    const currentDate = new Date();
    const selected = new Date(selectedDate);
     // Clear time portion for comparison(Make sure user can choose a current date)
    currentDate.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    // Check if the selected date is in the past
    if (selected < currentDate) {
      setErrorMessage("Selected date cannot be in the past.");
      return;
    }
    const serviceSelect = serviceSelected.reduce((value, service, index) => {
      return index === 0 ? service : value + "," + service;
    }, "");
    localStorage.setItem("selectedDate", selectedDate);
    localStorage.setItem("serviceSelected", serviceSelect);
    // localStorage.setItem("paymentMethod", payMentSelected);

    navigate("/Payment-checkout");
  };

  const handleServiceChange = (event) => {
    const { value } = event.target;
    setServiceSelected(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div className="wrapperrr">
      <Typography variant="h4">Send Form For Us</Typography>
        <Form
          {...formItemLayout}
          className="form-valuation"
          onFinish={onFinish}
          style={{
            maxWidth: 500,
            marginLeft: "34%",
          }}
        >
           <Box
        sx={{
          bgcolor: "background.paper",
          p: 2,
          borderRadius: 1,
          boxShadow: 1,
          mb: 10
        }}
      >
       
          <FormControl fullWidth>
            <TextField
              label="Email"
              value={user.email || ""}
              fullWidth
              margin="normal"
            />
          </FormControl>

            <FormControl fullWidth>
              <TextField
                label="First Name"
                value={user.first_name || ""}
                fullWidth
                margin="normal"
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Last Name"
                value={user.last_name || ""}
                fullWidth
                margin="normal"
              />
            </FormControl>
          
            <FormControl fullWidth>
              <TextField
                label="Phone Number"
                value={user.phone_number || ""}
                fullWidth
                margin="normal"
              />
            </FormControl>
        
            <FormControl fullWidth>
              <TextField
                label="Address"
                value={user.location || ""}
                fullWidth
                margin="normal"
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Preferred Appraisal Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                fullWidth
                margin="normal"
                type="date"
                required
                error= {!!errorMessage}
                helperText = {errorMessage}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
        
          
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-chip-label">Service</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={serviceSelected}
                onChange={(event) => handleServiceChange(event)} // Pass event directly
                input={<OutlinedInput id="select-multiple-chip" label="Service" />}
                required
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Typography key={value}>{value}</Typography>
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
          {/* <Form.Item
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
          </Form.Item> */}
          
            <Box
              marginTop={2}
             
              display="flex"
              justifyContent="center"
            >
              <Button variant="contained" type="primary" htmlType="submit">
                Submit
              </Button>
            </Box>
            </Box>
        </Form>
    </div>
  );
};

export default ServiceForm;
