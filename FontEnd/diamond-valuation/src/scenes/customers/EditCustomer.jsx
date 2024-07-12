import { Box, Button, TextField, Typography, Switch } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCustomerById,
  saveCustomer,
} from "../../components/utils/ApiFunctions";
import { useState, useEffect } from "react";

const phoneRegExp = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

const userSchema = yup.object().shape({
  first_name: yup.string().required("required"),
  last_name: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string(),
  phone_number: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  location: yup.string(),
});

const EditCustomer = () => {
  const { customerid } = useParams();
  const [customer, setCustomer] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    location: "",
    enabled: false,
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerEdit = await getCustomerById(customerid);
        setCustomer({
          id: customerEdit.id,
          email: customerEdit.email,
          first_name: customerEdit.first_name,
          last_name: customerEdit.last_name,
          password: "",
          phone_number: customerEdit.phone_number,
          location: customerEdit.location,
          enabled: customerEdit.enabled,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchCustomer();
  }, []);

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (values) => {
    try {
      const result = await saveCustomer(values);
      if (result.message !== undefined) {
        localStorage.setItem(
          "successMessage",
          `Edit Customer ${values.id} successfully`
        );
        navigate("/customers");
      } else {
        setErrorMessage("Your email is invalid");
      }
    } catch (error) {
      setErrorMessage(error);
    }
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };

  return (
    <Box m="20px">
      <Typography variant="h4" textAlign="center" m="20px">
        Edit Customer
      </Typography>
      <Box
        maxWidth="700px"
        m="0 auto"
        border="1px solid black"
        borderRadius="5px"
        p="16px"
      >
        <Formik
          onSubmit={handleFormSubmit}
          validationSchema={userSchema}
          initialValues={customer}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText="If you dont want to change password leave it blank"
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.first_name}
                  name="first_name"
                  error={!!touched.first_name && !!errors.first_name}
                  helperText={touched.first_name && errors.first_name}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.last_name}
                  name="last_name"
                  error={!!touched.last_name && !!errors.last_name}
                  helperText={touched.last_name && errors.last_name}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Phone Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone_number}
                  name="phone_number"
                  error={!!touched.phone_number && !!errors.phone_number}
                  helperText={touched.phone_number && errors.phone_number}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={!!touched.address1 && !!errors.address1}
                  helperText={touched.address1 && errors.address1}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box>
                  Enabled:
                  <Switch
                    label="Enabled"
                    checked={values.enabled}
                    name="enabled"
                    onChange={handleChange}
                  />
                </Box>
              </Box>
              <Box display="flex" justifyContent="center" mt="20px" gap="10px">
                <Button type="submit" variant="contained">
                  Save
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/customers")}
                  sx={{ backgroundColor: "grey" }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default EditCustomer;
