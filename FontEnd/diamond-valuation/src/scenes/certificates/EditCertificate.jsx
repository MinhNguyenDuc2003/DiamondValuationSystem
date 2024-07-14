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
  getCertificateById,
  saveCertificate,
} from "../../components/utils/ApiFunctions";

// Utility function to remove spaces from object values
const removeSpacesFromObjectValues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      typeof value === "string"
        ? [key, value.replace(/\s+/g, "")]
        : [key, value]
    )
  );
};

const EditCertificate = () => {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

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
    length: Yup.number().required("Required"),
    width: Yup.number().required("Required"),
    height: Yup.number().required("Required"),
  });

  useEffect(() => {
    getCertificateById(certificateId)
      .then((data) => {
        setCertificate(data);
        setImagePreview(data.photo);
        setImage(data.image);
      })
      .catch((error) => {
        console.error("Error fetching certificate: ", error);
      });
  }, [certificateId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (values) => {
    try {
      const measurement = `${values.length}-${values.width}x${values.height}mm`;
      const updatedCertificateData = removeSpacesFromObjectValues({
        ...values,
        measurement,
        photo: image,
      });
      const result = await saveCertificate(updatedCertificateData);
      if (result.message !== undefined) {
        localStorage.setItem(
          "successMessage",
          "Certificate updated successfully"
        );
        navigate("/certificates");
      } else {
        setError("Error updating certificate");
      }
    } catch (error) {
      setError(error);
    }
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  const handleCancel = async () => {
    try {
      navigate("/certificates");
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

  if (!certificate) return null;

  const initialValues = {
    id: certificate.id,
    carat: certificate.carat,
    clarity: certificate.clarity,
    color: certificate.color,
    cut: certificate.cut,
    flourescence: certificate.flourescence,
    make: certificate.make,
    polish: certificate.polish,
    symmetry: certificate.symmetry,
    cert: certificate.name,
    length: parseFloat(certificate.measurement.split("-")[0]),
    width: parseFloat(certificate.measurement.split("-")[1].split("x")[0]),
    height: parseFloat(certificate.measurement.split("x")[1].replace("mm", "")),
    request_id: certificate.request_id,
    code: certificate.code,
    photo: certificate.photo,
  };

  return (
    <Box p="20px">
      <Box
        maxWidth="700px"
        m="0 auto"
        border="1px solid black"
        borderRadius="5px"
        p="16px"
      >
        <Typography variant="h4" gutterBottom>
          Edit Certificate for ID: {certificateId}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {String(error)}
          </Alert>
        )}

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
                        value={values[filterKey].replace(
                          /([a-z])([A-Z])/g,
                          "$1 $2"
                        )}
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
                  <Typography>Measurement: </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Length"
                    name="length"
                    value={values.length}
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.length && Boolean(errors.length)}
                    helperText={touched.length && errors.length}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Width"
                    name="width"
                    value={values.width}
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.width && Boolean(errors.width)}
                    helperText={touched.width && errors.width}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Height"
                    name="height"
                    value={values.height}
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.height && Boolean(errors.height)}
                    helperText={touched.height && errors.height}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" component="label" fullWidth>
                    Upload Image
                    <input type="file" hidden onChange={handleImageChange} />
                  </Button>
                </Grid>
                {imagePreview && (
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" mt="20px">
                      <img
                        src={imagePreview}
                        alt="Image Preview"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
              <Box display="flex" justifyContent="center" mt="20px" gap="10px">
                <Button type="submit" variant="contained">
                  Save
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCancel}
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

export default EditCertificate;
