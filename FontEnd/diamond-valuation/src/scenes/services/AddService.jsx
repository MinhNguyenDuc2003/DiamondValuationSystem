import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { Formik, Form } from "formik";
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
  // Photo field is not needed in validation schema, handled separately
});

const AddService = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const initialValues = {
    
    name: "",
    money: "",
    content: "",
  };

  const handleFormSubmit = async (values) => {
    try {
      if (!image) {
        setErrorMessage("Image is required");
        return;
      }
      const result = await saveService({
        ...values,
        photo: image,
      });
      if (result.message !== undefined) {
        localStorage.setItem("successMessage", "Add New Service Successfully");
        navigate("/services");
      } else {
        setErrorMessage("Failed to add service");
      }
    } catch (error) {
      console.error("Error occurred while saving service:", error);
      setErrorMessage("An error occurred while saving the service");
    }
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
            <Form onSubmit={handleSubmit}>
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
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default AddService;
