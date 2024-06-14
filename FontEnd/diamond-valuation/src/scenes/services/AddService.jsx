import { Box, Button, TextField, Typography, Input } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { saveService } from "../../components/utils/ApiFunctions";
import { useState } from "react";

const initialValues = {
  id: "",
  name: "",
  money: "",
  content: "",
  photo: null,
};

const nameReqExp = /^[a-zA-Z\s]+$/;

const serviceSchema = yup.object().shape({
  name: yup.string().matches(nameReqExp, "Invalid name").required("required"),
  money: yup.number().required("required"),
  content: yup.string(),
  photo: yup.mixed().required("Image is required"),
});

const AddService = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (values) => {
    try {
      const result = await saveService(values);
      if (result.message !== undefined) {
        localStorage.setItem("successMessage", "Add new Service successfully");
        navigate("/services");
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
        Add Service
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
          initialValues={initialValues}
          validationSchema={serviceSchema}
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
                <Input
                  margin="dense"
                  type="file"
                  name="photo"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.photo && !!errors.photo}
                  inputProps={{ accept: "image/png, image/jpeg " }}
                  sx={{ gridColumn: "span 4" }}
                />
                {touched.photo && errors.photo && (
                  <div style={{ color: "red" }}>{errors.photo}</div>
                )}
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
