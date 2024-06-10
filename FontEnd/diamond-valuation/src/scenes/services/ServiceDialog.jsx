import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Switch,
} from "@mui/material";

const ServiceDialog = ({}) => {
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>{formData.id ? "Edit Service" : "Add Service"}</DialogTitle>
    <DialogContent>
      <TextField
        margin="dense"
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        margin="dense"
        label="Description"
        name="desc"
        value={formData.desc}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        margin="dense"
        label="Number of Weeks"
        name="number_of_weeks"
        value={formData.number_of_weeks}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        margin="dense"
        label="Image URL"
        name="image"
        value={formData.image}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        margin="dense"
        label="Start Date"
        type="date"
        name="Start_date"
        value={formData.Start_date}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <Box>
        Active:
        <Switch
          label="Active"
          value={formData.active}
          name="active"
          onChange={(e) =>
            setFormData({ ...formData, active: e.target.checked })
          }
        />
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleSubmit}>{formData.id ? "Update" : "Add"}</Button>
    </DialogActions>
  </Dialog>;
};

export default ServiceDialog;
