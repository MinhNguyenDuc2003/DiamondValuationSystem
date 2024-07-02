import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  TableSortLabel,
} from "@mui/material";
import {
  getAllRapaport,
  updateDiamondAttribute,
  addDiamondAttribute,
  deleteDiamondAttributeById,
} from "../../components/utils/ApiFunctions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CaratRangeDialog from "./CaratRangeDialog";

const clarityOptions = ["", "IF", "VS", "SI1", "SI2", "SI3", "I1", "I2", "I3"];
const colorOptions = ["", "D", "F", "G", "H", "I", "J", "K", "L", "M", "N"];

const Rapaport = () => {
  const [caratData, setCaratData] = useState([]);
  const [error, setError] = useState("");
  const [clarityFilter, setClarityFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editedNumber, setEditedNumber] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [caratDialogOpen, setCaratDialogOpen] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState(null);
  const [message, setMessage] = useState();
  const [newClarity, setNewClarity] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("clarity");

  useEffect(() => {
    const successMessage = localStorage.getItem("successMessage");
    if (successMessage) {
      setMessage(successMessage);
      localStorage.removeItem("successMessage");
      setTimeout(() => {
        setMessage("");
      }, 4000);
    }
  }, [location.state?.message]);

  useEffect(() => {
    getAllRapaport()
      .then((data) => {
        setCaratData(data);
      })
      .catch((error) => {
        setError(error.message);
      });

    const errorTimeout = setTimeout(() => {
      setError("");
    }, 2000);

    return () => clearTimeout(errorTimeout);
  }, []);

  const handleOpenDialog = (attribute) => {
    setAttributeToDelete(attribute.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAttributeToDelete(null);
  };

  const handleDelete = async () => {
    const result = await deleteDiamondAttributeById(attributeToDelete);
    if (result !== undefined) {
      setMessage(
        `Delete diamond attribute with id ${attributeToDelete}  successfully!`
      );
      getAllRapaport()
        .then((data) => {
          setCaratData(data);
        })
        .catch((error) => {
          setError(error.message);
        });
      handleCloseDialog();
      setTimeout(() => {
        setMessage("");
      }, 1000);
    }
  };

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
    setEditRowIndex(null);
  };

  const filterAttributes = (attributes) => {
    return attributes.filter((attr) => {
      return (
        (clarityFilter === "" || attr.clarity === clarityFilter) &&
        (colorFilter === "" || attr.color === colorFilter)
      );
    });
  };

  const handleEditClick = (id, currentNumber) => {
    setEditRowIndex(id);
    setEditedNumber(currentNumber);
  };

  const handleSaveClick = async (id) => {
    const updatedCaratData = [...caratData];
    const currentCarat = updatedCaratData[tabIndex];

    // Find the attribute to be edited
    const editedAttr = currentCarat.list.find((attr) => attr.id === id);

    if (editedAttr) {
      // const currentAttr = updatedCaratData[tabIndex].list[currentAttrIndex];

      // Update the number locally
      editedAttr.number = editedNumber;

      // Send the update request to the server
      try {
        const result = await updateDiamondAttribute(editedAttr);
        if (result !== undefined) {
          setMessage(
            `Update diamond attribute with id ${editedAttr.id}  successfully!`
          );
          setCaratData(updatedCaratData);
          setEditRowIndex(null);
          setTimeout(() => {
            setMessage("");
          }, 3000);
        } else {
          setError("Failed to update attribute");
        }
      } catch (error) {
        setError("Failed to update attribute");
      }
    }
  };

  const handleAddNewAttribute = async () => {
    const newAttribute = {
      clarity: newClarity,
      color: newColor,
      number: newNumber,
    };

    try {
      const result = await addDiamondAttribute(newAttribute, tabIndex + 1);
      if (result !== undefined) {
        setMessage("New diamond attribute added successfully!");
        getAllRapaport()
          .then((data) => {
            setCaratData(data);
          })
          .catch((error) => {
            setError(error.message);
          });
        setNewClarity("");
        setNewColor("");
        setNewNumber("");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setError("Failed to add new attribute");
      }
    } catch (error) {
      setError("Failed to add new attribute");
    }
  };

  const currentCaratData = caratData[tabIndex] || {
    list: [],
    begin_carat: 0,
    end_carat: 0,
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedAttributes = (attributes) => {
    return attributes.sort((a, b) => {
      if (orderBy === "number") {
        return order === "asc"
          ? a[orderBy] - b[orderBy]
          : b[orderBy] - a[orderBy];
      } else {
        return order === "asc"
          ? a[orderBy].localeCompare(b[orderBy])
          : b[orderBy].localeCompare(a[orderBy]);
      }
    });
  };

  const handleSaveCaratRange = () => {
    getAllRapaport()
      .then((data) => {
        setCaratData(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <Box m="20px">
      <Typography variant="h4" textAlign="center">
        Rapaport Diamond Price
      </Typography>

      {message && (
        <Typography variant="body2" color="green" textAlign="center">
          {message}
        </Typography>
      )}

      {error && (
        <Typography variant="body2" color="error" textAlign="center">
          {error}
        </Typography>
      )}

      <Box display="flex" justifyContent="space-between" mb={2} mt={2}>
        <Box
          sx={{
            maxWidth: "700px",
            bgcolor: "background.paper",
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={handleChangeTab}
            aria-label="carat range tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            {caratData.map((carat, index) => (
              <Tab
                key={index}
                label={`${carat.begin_carat} - ${carat.end_carat} Carat`}
              />
            ))}
          </Tabs>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCaratDialogOpen(true)}
          >
            Manage Carat Ranges
          </Button>
        </Box>
        <Box>
          <FormControl
            variant="outlined"
            size="small"
            style={{ marginRight: "10px", minWidth: 120 }}
          >
            <InputLabel>Clarity</InputLabel>
            <Select
              value={clarityFilter}
              onChange={(e) => setClarityFilter(e.target.value)}
              label="Clarity"
            >
              {clarityOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            size="small"
            style={{ marginRight: "10px", minWidth: 120 }}
          >
            <InputLabel>Color</InputLabel>
            <Select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              label="Color"
            >
              {colorOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box mb={2} mt={2}>
        <Typography variant="h6" textAlign="center">
          Add New Diamond Attribute
        </Typography>
        <Box display="flex" justifyContent="center">
          <FormControl
            variant="outlined"
            size="small"
            style={{ marginRight: "10px", minWidth: 120 }}
          >
            <InputLabel>Clarity</InputLabel>
            <Select
              value={newClarity}
              onChange={(e) => setNewClarity(e.target.value)}
              label="Clarity"
            >
              {clarityOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            size="small"
            style={{ marginRight: "10px", minWidth: 120 }}
          >
            <InputLabel>Color</InputLabel>
            <Select
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              label="Color"
            >
              {colorOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Number"
            variant="outlined"
            size="small"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            style={{ marginRight: "10px", minWidth: 120 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewAttribute}
          >
            Add
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#C5A773" }}>
            <TableRow>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "clarity"}
                  direction={orderBy === "clarity" ? order : "asc"}
                  onClick={() => handleRequestSort("clarity")}
                >
                  Clarity
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "color"}
                  direction={orderBy === "color" ? order : "asc"}
                  onClick={() => handleRequestSort("color")}
                >
                  Color
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "number"}
                  direction={orderBy === "number" ? order : "asc"}
                  onClick={() => handleRequestSort("number")}
                >
                  Number
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#EEE5D6" }}>
            {sortedAttributes(filterAttributes(currentCaratData.list)).map(
              (attr, index) => (
                <TableRow key={`${attr.clarity}-${attr.color}-${index}`}>
                  <TableCell align="center">{attr.clarity}</TableCell>
                  <TableCell align="center">{attr.color}</TableCell>
                  <TableCell align="center">
                    {editRowIndex === attr.id ? (
                      <TextField
                        value={editedNumber}
                        onChange={(e) => setEditedNumber(e.target.value)}
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      attr.number
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {editRowIndex === attr.id ? (
                      <IconButton onClick={() => handleSaveClick(attr.id)}>
                        <SaveIcon sx={{ color: "#C5A773" }} />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => handleEditClick(attr.id, attr.number)}
                      >
                        <EditIcon sx={{ color: "#C5A773" }} />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleOpenDialog(attr)}>
                      <DeleteIcon sx={{ color: "#C5A773" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this diamond attribute{" "}
            {attributeToDelete}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Delete
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <CaratRangeDialog
        open={caratDialogOpen}
        onClose={() => setCaratDialogOpen(false)}
        caratData={caratData}
        onSaveCaratRange={handleSaveCaratRange}
      />
    </Box>
  );
};

export default Rapaport;
