import { Box, Button, TextField, Typography, Grid } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  getServiceById,
  saveService,
} from "../../components/utils/ApiFunctions";
import { useState, useEffect } from "react";

const nameReqExp = /^[a-zA-Z\s]+$/;

const serviceSchema = yup.object().shape({
  name: yup.string().matches(nameReqExp, "Invalid name").required("required"),
  money: yup.number().required("required"),
  content: yup.string(),
  photo: yup.mixed().required("Image is required"),
});

const EditService = () => {
  const { serviceid } = useParams();
  const [service, setService] = useState({
    id: "",
    name: "",
    money: "",
    content: "",
    photo: null,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceEdit = await getServiceById(serviceid);
        setService({
          id: serviceEdit.id,
          name: serviceEdit.name,
          money: serviceEdit.money,
          content: serviceEdit.content,
        });
        setImagePreview(serviceEdit.photo);
        setImage(serviceEdit.photo);
      } catch (error) {
        console.log(error);
      }
    };
    fetchService();
  }, []);

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (values) => {
    try {
      const result = await saveService(values);
      if (result.message !== undefined) {
        localStorage.setItem(
          "successMessage",
          `Edit Service ${values.id} successfully`
        );
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <Box m="20px">
      <Typography variant="h4" textAlign="center" m="20px">
        Edit Service
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
          initialValues={service}
          validationSchema={serviceSchema}
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

export default EditService;
