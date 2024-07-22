import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getAllServices,
  getRequestById,
  saveRequest,
  getSlotAvailable,
  getValuationStaffAvailable,
  setRequestToAssign,
  searchCustomerByKeyword,
  deleteAssign,
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

const formatAssignmentDate = (dateArray) => {
  if (!dateArray || dateArray.length !== 3) return "";
  const [year, month, day] = dateArray;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
};

const EditDiamondRequest = () => {
  const { requestid } = useParams();
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
  const [slots, setSlots] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [error, setError] = useState(null);
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    id: "",
    customer_id: "",
    note: "",
    status: "NEW",
    service_ids: [],
    payment_method: "CASH",
    paid: false,
    appointment_date: null,
    slotId: 0,
    assignment: [],
    assignment_id: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersData = await searchCustomerByKeyword("");
        setCustomers(customersData);

        const servicesData = await getAllServices();
        setServices(servicesData);

        const requestEdit = await getRequestById(requestid);
        if (requestEdit) {
          const formattedAssignmentDate =
            requestEdit.assignment.length > 0
              ? formatAssignmentDate(requestEdit.assignment[0].date)
              : "";
          setInitialValues({
            id: requestEdit.id,
            customer_id: requestEdit.customer_id,
            note: requestEdit.note,
            status: requestEdit.status,
            service_ids: requestEdit.service_ids,
            payment_method: requestEdit.payment_method,
            paid: requestEdit.paid,
            appointment_date: requestEdit.appoinment_date || "",
            slotId: requestEdit.slot_id || 0,
            assignment: requestEdit.assignment,
            assignment_id: requestEdit.assignment.map(
              (assignment) => assignment.id
            ),
          });

          if (requestEdit.assignment.length > 0) {
            setDate(formatAssignmentDate(requestEdit.assignment[0].date));
          }

          // Fetch slots for the existing appointment date
          if (requestEdit.appoinment_date) {
            const availableSlots = await getSlotAvailable(
              requestEdit.appoinment_date
            );
            setSlots(availableSlots);
          }

          if (formattedAssignmentDate) {
            setDate(formattedAssignmentDate);
            const availableValuationStaffs = await getValuationStaffAvailable(
              formattedAssignmentDate
            );
            setStaffs(availableValuationStaffs);
          }
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    customer_id: Yup.string().required("Customer is required"),
    note: Yup.string(),
    status: Yup.string().required("Status is required"),
    service_ids: Yup.array().min(1, "At least one service must be selected"),
    payment_method: Yup.string().required("Payment method is required"),
    paid: Yup.boolean().required("Paid status is required"),
    appointment_date: Yup.string().required("Appointment date is required"),
  });

  const handleSubmit = async (values) => {
    try {
      console.log(values);
      const result = await saveRequest(values);

      // Call setRequestToAssign only for new assignments
      if (values.assignment.length === 0) {
        await setRequestToAssign(values, values.assignment_id);
      } else if (values.assignment[0].id !== values.assignment_id[0]) {
        await deleteAssign(values, values.assignment[0].id);
        await setRequestToAssign(values, values.assignment_id);
      }
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

  const handleDateChange = async (event, setFieldValue) => {
    const date = event.target.value;
    setFieldValue("appointment_date", date);

    try {
      const availableSlots = await getSlotAvailable(date);

      setSlots(availableSlots);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDateAssignChange = async (event) => {
    const date = event.target.value;
    setDate(date);
    try {
      const availableValuationStaffs = await getValuationStaffAvailable(date);
      setStaffs(availableValuationStaffs);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box p="0px 20px">
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
                        (customer) =>
                          Number(customer.id) ===
                          Number(initialValues.customer_id)
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
                    <MenuItem value="CASH">CASH</MenuItem>
                    <MenuItem value="PAYPAL">PAYPAL</MenuItem>
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
                  onChange={(event) => handleDateChange(event, setFieldValue)}
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

                {slots.length > 0 && (
                  <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                    <InputLabel>Slot Time</InputLabel>
                    <Field as={Select} name="slotId" label="Slot Time">
                      {slots.map((slot) => (
                        <MenuItem key={slot.id} value={slot.id}>
                          {slot.time}
                        </MenuItem>
                      ))}
                    </Field>
                    {touched.slotId && errors.slotId && (
                      <div style={{ color: "red" }}>{errors.slotId}</div>
                    )}
                  </FormControl>
                )}

                <TextField
                  type="date"
                  margin="dense"
                  label="Date to Assign"
                  name="date"
                  value={date}
                  onChange={(event) => handleDateAssignChange(event)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ gridColumn: "span 1" }}
                />

                <FormControl fullWidth sx={{ gridColumn: "span 3" }}>
                  <InputLabel>Select Staff to assign</InputLabel>
                  <Field
                    as={Select}
                    name="assignment_id"
                    label="Assign Staff"
                    value={values.assignment_id}
                  >
                    {staffs.map((staff) => (
                      <MenuItem
                        key={staff.assignmentid}
                        value={staff.assignmentid}
                      >
                        {staff.name} (Processing{" "}
                        {staff.number_request_processing} requests)
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
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
