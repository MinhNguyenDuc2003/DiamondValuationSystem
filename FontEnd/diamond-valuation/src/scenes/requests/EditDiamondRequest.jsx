import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getCustomersPerPage,
  getAllServices,
  getRequestById,
  saveRequest,
} from "../../components/utils/ApiFunctions";
import {
  Box,
  Button,
  Typography,
  FormControl,
  Checkbox,
  FormControlLabel,
  Alert,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  InputLabel,
  Switch,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const EditDiamondRequest = () => {
  const { requestid } = useParams();
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    id: "",
    customer_id: "",
    note: "",
    status: "NEW",
    service_ids: [],
    payment_method: "TM",
    paid: false,
    appointment_date: null,
    appointment_time: "",
  });

  useEffect(() => {
    getCustomersPerPage(1, "")
      .then((data) => {
        setCustomers(data.list_customers);
      })
      .catch((error) => {
        setError(error.message);
      });

    getAllServices()
      .then((data) => {
        setServices(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const requestEdit = await getRequestById(requestid);

        const foundCustomer = customers.find(
          (customer) => customer.phone_number === requestEdit.customer_phone
        );
        if (foundCustomer) {
          setInitialValues({
            id: requestEdit.id,
            customer_id: foundCustomer.id,
            note: requestEdit.note,
            status: requestEdit.status,
            service_ids: requestEdit.service_ids,
            payment_method: requestEdit.payment_method,
            paid: requestEdit.paid,
            appointment_date: requestEdit.appoinment_date || "",
            appointment_time: requestEdit.appoinment_time || "",
          });
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchRequest();
  }, [requestid, customers]);
  console.log(initialValues);

  const validationSchema = Yup.object().shape({
    customer_id: Yup.string().required("Customer is required"),
    note: Yup.string(),
    status: Yup.string().required("Status is required"),
    service_ids: Yup.array().min(1, "At least one service must be selected"),
    payment_method: Yup.string().required("Payment method is required"),
    paid: Yup.boolean().required("Paid status is required"),
    appointment_date: Yup.date().nullable(),
    appointment_time: Yup.string().nullable(),
  });

  const handleSubmit = async (values) => {
    try {
      console.log(values);
      const result = await saveRequest(values);
      if (result.message !== undefined) {
        localStorage.setItem("successMessage", "Request updated successfully");
        navigate("/requests");
      } else {
        setError("Error occurred");
      }
    } catch (error) {
      setError(error.message);
    }
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  return (
    <Box p="20px">
      <Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
        Edit Diamond Request
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        maxWidth="700px"
        m="0 auto"
        border="1px solid black"
        borderRadius="5px"
        p="16px"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              >
                <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
                  <Autocomplete
                    options={customers}
                    getOptionLabel={(option) =>
                      `${option.first_name} ${option.last_name} - ${option.phone_number} - ${option.email}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(event, value) => {
                      setFieldValue("customer_id", value ? value.id : "");
                    }}
                    value={
                      customers.find(
                        (customer) => customer.id === values.customer_id
                      ) || null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer Phone"
                        variant="outlined"
                        error={
                          touched.customer_id && Boolean(errors.customer_id)
                        }
                        helperText={touched.customer_id && errors.customer_id}
                      />
                    )}
                  />
                </FormControl>

                <TextField
                  margin="dense"
                  label="Note"
                  name="note"
                  value={values.note}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.note && Boolean(errors.note)}
                  helperText={touched.note && errors.note}
                  fullWidth
                  sx={{ gridColumn: "span 4" }}
                />

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Field as={Select} name="status" label="Status">
                    <MenuItem value="WAIT">WAIT</MenuItem>
                    <MenuItem value="NEW">NEW</MenuItem>
                    <MenuItem value="PROCESSING">PROCESSING</MenuItem>
                    <MenuItem value="PROCESSED">PROCESSED</MenuItem>
                    <MenuItem value="DONE">DONE</MenuItem>
                    <MenuItem value="BLOCKREQUEST">BLOCKREQUEST</MenuItem>
                    <MenuItem value="BLOCKED">BLOCKED</MenuItem>
                  </Field>
                </FormControl>

                <Typography variant="subtitle1" sx={{ gridColumn: "span 4" }}>
                  Select Services:
                </Typography>
                {services.map((service) => (
                  <FormControlLabel
                    key={service.id}
                    control={
                      <Checkbox
                        checked={values.service_ids.includes(service.id + "")}
                        onChange={(event) => {
                          let services = values.service_ids;
                          const { name, checked, value } = event.target;
                          if (checked) {
                            services.push(value);
                            setInitialValues({ ...values, [name]: services });
                          } else {
                            setInitialValues({
                              ...values,
                              [name]: services.filter(
                                (serviceID) => serviceID !== value
                              ),
                            });
                          }
                        }}
                        value={service.id}
                        name="service_ids"
                      />
                    }
                    label={service.name}
                  />
                ))}
                {touched.service_ids && errors.service_ids && (
                  <div style={{ color: "red", gridColumn: "span 4" }}>
                    {errors.service_ids}
                  </div>
                )}
                <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                  <InputLabel>Payment Method</InputLabel>
                  <Field
                    as={Select}
                    name="payment_method"
                    label="Payment Method"
                  >
                    <MenuItem value="TM">TM</MenuItem>
                    <MenuItem value="CK">CK</MenuItem>
                  </Field>
                  {touched.payment_method && errors.payment_method && (
                    <div style={{ color: "red" }}>{errors.payment_method}</div>
                  )}
                </FormControl>

                <Box>
                  Paid:
                  <Switch
                    label="Paid"
                    checked={values.paid}
                    name="paid"
                    onChange={handleChange}
                  />
                </Box>

                <TextField
                  fullWidth
                  type="date"
                  margin="dense"
                  label="Appointment Date"
                  name="appointment_date"
                  value={values.appointment_date || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.appointment_date && Boolean(errors.appointment_date)
                  }
                  helperText={
                    touched.appointment_date && errors.appointment_date
                  }
                  sx={{ gridColumn: "span 2" }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  type="time"
                  margin="dense"
                  label="Appointment Time"
                  name="appointment_time"
                  value={values.appointment_time || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.appointment_time && Boolean(errors.appointment_time)
                  }
                  helperText={
                    touched.appointment_time && errors.appointment_time
                  }
                  sx={{ gridColumn: "span 2" }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box display="flex" justifyContent="center" mt="20px" gap="10px">
                <Button type="submit" variant="contained">
                  Save Changes
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/requests")}
                  sx={{ backgroundColor: "grey" }}
                >
                  Cancel
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default EditDiamondRequest;
