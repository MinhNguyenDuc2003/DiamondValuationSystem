import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Alert,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  getRequestById,
  saveCertificate,
  saveRequest,
} from "../../components/utils/ApiFunctions";

const CreateCertificate = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const initialValues = {
    id: "",
    carat: "",
    clarity: "",
    color: "",
    cut: "",
    flourescence: "",
    make: "",
    polish: "",
    symmetry: "",
    cert: "",
    measurement: "",
    request_id: requestId,
  };

  const validationSchema = Yup.object().shape({
    carat: Yup.number().required("Required"),
    clarity: Yup.string().required("Required"),
    color: Yup.string().required("Required"),
    cut: Yup.string().required("Required"),
    flourescence: Yup.string().required("Required"),
    make: Yup.string().required("Required"),
    polish: Yup.string().required("Required"),
    symmetry: Yup.string().required("Required"),
    cert: Yup.string().required("Required"),
    measurement: Yup.string().required("Required"),
  });

  useEffect(() => {
    getRequestById(requestId)
      .then((data) => {
        setRequest(data);
      })
      .catch((error) => {
        console.error("Error fetching request: ", error);
      });
    setTimeout(() => {
      setError("");
    }, 2000);
  }, [requestId]);

  const handleSubmit = async (values) => {
    try {
      const result = await saveCertificate(values);
      if (result.message !== undefined) {
        localStorage.setItem(
          "successMessage",
          "Add new Certificate successfully"
        );
        navigate("/certificates");
      } else {
        setError("Error creating certificate");
      }
    } catch (error) {
      setError(error);
    }
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  const diamondCriterias = {
    clarity: [
      "IF",
      "VVS1",
      "VVS2",
      "VS1",
      "VS2",
      "SI1",
      "SI2",
      "SI3",
      "I1",
      "I2",
      "I3",
    ],
    color: ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"],
    cut: [
      "Round",
      "Marquise",
      "Pear",
      "Oval",
      "Heart",
      "Emerald",
      "Princess",
      "Radiant",
      "Triangle",
      "Baguette",
      "Asscher",
      "Cushion",
    ],
    flourescence: ["None", "Faint", "Medium", "Strong", "Very Strong"],
    make: ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"],
    polish: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    symmetry: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    cert: [
      "AGS",
      "CEGL",
      "CGI",
      "CGL",
      "DCLA",
      "EGL Asia",
      "EGL Intl.",
      "EGL USA",
      "GCAL",
      "GIA",
      "HRD",
      "IGI",
    ],
  };

  return (
    <Box p="20px">
      <Typography variant="h4" gutterBottom>
        Create Certificate for Request ID: {requestId}
      </Typography>
      {request && (
        <Typography variant="h6" gutterBottom>
          Current Status: {request.status}
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {String(error)}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <Form>
            <Grid container spacing={2}>
              {Object.keys(diamondCriterias).map((filterKey) => (
                <Grid item xs={12} sm={6} key={filterKey}>
                  <FormControl fullWidth>
                    <InputLabel>
                      {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
                    </InputLabel>
                    <Field
                      as={Select}
                      name={filterKey}
                      value={values[filterKey]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label={
                        filterKey.charAt(0).toUpperCase() + filterKey.slice(1)
                      }
                    >
                      {diamondCriterias[filterKey].map((criteria) => (
                        <MenuItem key={criteria} value={criteria}>
                          {criteria}
                        </MenuItem>
                      ))}
                    </Field>
                    {touched[filterKey] && errors[filterKey] ? (
                      <div>{errors[filterKey]}</div>
                    ) : null}
                  </FormControl>
                </Grid>
              ))}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Carat"
                  name="carat"
                  value={values.carat}
                  type="number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.carat && Boolean(errors.carat)}
                  helperText={touched.carat && errors.carat}
                  inputProps={{ step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Measurement"
                  name="measurement"
                  value={values.measurement}
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.measurement && Boolean(errors.measurement)}
                  helperText={touched.measurement && errors.measurement}
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="center" mt="20px" gap="10px">
              <Button type="submit" variant="contained">
                Save
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/certificates")}
                sx={{ backgroundColor: "grey" }}
              >
                Cancel
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateCertificate;
