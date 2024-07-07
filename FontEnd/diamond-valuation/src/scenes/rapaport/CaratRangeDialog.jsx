import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  updateCaratRange,
  deleteCaratRange,
  addCaratRange,
} from "../../components/utils/ApiFunctions";

const CaratRangeDialog = ({ open, onClose, caratData, onSaveCaratRange }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCaratRange, setCurrentCaratRange] = useState(null);
  const [newCaratRange, setNewCaratRange] = useState({
    begin_carat: "",
    end_carat: "",
  });

  const handleSave = async () => {
    try {
      if (isEditMode && currentCaratRange) {
        await updateCaratRange(currentCaratRange.id, newCaratRange);
      } else {
        await addCaratRange(newCaratRange);
      }
      onSaveCaratRange(); // Refresh carat ranges
      handleClose();
    } catch (error) {
      console.error("Failed to save carat range:", error);
    }
  };

  const handleClose = () => {
    setIsEditMode(false);
    setNewCaratRange({ begin_carat: "", end_carat: "" });
    setCurrentCaratRange(null);
    onClose();
  };

  const handleEdit = (caratRange) => {
    setIsEditMode(true);
    setCurrentCaratRange(caratRange);
    setNewCaratRange({
      begin_carat: caratRange.begin_carat,
      end_carat: caratRange.end_carat,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteCaratRange(id);
      onSaveCaratRange(); // Refresh carat ranges
    } catch (error) {
      console.error("Failed to delete carat range:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="carat-range-dialog-title"
      aria-describedby="carat-range-dialog-description"
    >
      <DialogTitle id="carat-range-dialog-title">
        {isEditMode ? "Edit Carat Range" : "Manage Carat Ranges"}
      </DialogTitle>
      <DialogContent>
        {isEditMode ? (
          <>
            <TextField
              autoFocus
              margin="dense"
              id="begin_carat"
              label="Begin Carat"
              type="number"
              fullWidth
              value={newCaratRange.begin_carat}
              onChange={(e) =>
                setNewCaratRange({
                  ...newCaratRange,
                  begin_carat: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              id="end_carat"
              label="End Carat"
              type="number"
              fullWidth
              value={newCaratRange.end_carat}
              onChange={(e) =>
                setNewCaratRange({
                  ...newCaratRange,
                  end_carat: e.target.value,
                })
              }
            />
          </>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Begin Carat</TableCell>
                  <TableCell>End Carat</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {caratData.map((carat) => (
                  <TableRow key={carat.id}>
                    <TableCell>{carat.begin_carat}</TableCell>
                    <TableCell>{carat.end_carat}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(carat)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(carat.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        {isEditMode ? (
          <Button onClick={handleSave} color="primary">
            Update
          </Button>
        ) : (
          <Button onClick={handleSave} color="primary">
            Add
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CaratRangeDialog;
