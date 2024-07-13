import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { saveService } from "../../components/utils/ApiFunctions";
import { useState } from "react";

// Regular expression for name validation
const nameReqExp = /^[a-zA-Z\s]+$/;

// Validation schema using Yup
const serviceSchema = yup.object().shape({
  name: yup.string().matches(nameReqExp, "Invalid name").required("Required"),
  money: yup.number().required("Required"),
  content: yup.string().required("Required"),
  photo: yup.mixed().required("Image is required"),
});

const AddService = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const initialValues = {
    id: "",
    name: "",
    money: "",
    content: "",
  };

  const handleFormSubmit = async (values) => {

    console.log({ ...values, photo: image });
    try {
      const result = await saveService({ ...values, photo: image });
      console.log(result); // Debug: Log the API response
      if (result.message !== undefined) {
        localStorage.setItem("successMessage", "Add new Service successfully");
        navigate("/services");
      } else {
        setErrorMessage("Failed to add new service");
      }
    } catch (error) {
      console.error(error); // Debug: Log the error
      setErrorMessage("An error occurred while saving the service");
    }
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <Box m="20px">
      <Typography variant="h4" textAlign="center" m="20px">
        Add Service
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
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
          validationSchema={serviceSchema}
          validate={(values) => {
            const errors = {};
            if (!image) {
              errors.photo = "Image is required";
            }
            return errors;
          }}
          onSubmit={handleFormSubmit}
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
                  margin="dense"
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  fullWidth
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  margin="dense"
                  label="Money"
                  name="money"
                  type="number"
                  value={values.money}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.money && !!errors.money}
                  helperText={touched.money && errors.money}
                  fullWidth
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  margin="dense"
                  label="Content"
                  name="content"
                  value={values.content}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.content && !!errors.content}
                  helperText={touched.content && errors.content}
                  fullWidth
                  sx={{ gridColumn: "span 4" }}
                />
                <Box sx={{ gridColumn: "span 4" }}>
                  <Button variant="contained" component="label" fullWidth>
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {imagePreview && (
                    <Box mt={2} textAlign="center">
                      <Typography>Image Preview:</Typography>
                      <img
                        src={imagePreview}
                        alt="Image Preview"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    </Box>
                  )}
                  {errors.photo && touched.photo && (
                    <Typography color="error">{errors.photo}</Typography>
                  )}
                </Box>
              </Box>
              <Box display="flex" justifyContent="center" mt="20px" gap="10px">
                <Button type="submit" variant="contained">
                  Save
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/services")}
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

export default AddService;
