import React from "react";
import { useState, useEffect } from "react";
import {
  deleteCustomerById,
  getAllServices,
  getCustomersPerPage,
} from "../../components/utils/ApiFunctions";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Typography,
  InputBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";

export const Services = () => {
  const [data, setData] = useState({
    list_services: [],
  });
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [error, setError] = useState("");

  const location = useLocation();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "number",
      headerName: "Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "money",
      headerName: "Money",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row: { id } }) => {
        return (
          <Box>
            <IconButton onClick={() => navigate(`/customers/${id}`)}>
              <EditIcon sx={{ color: "#C5A773" }} />
            </IconButton>
            <IconButton onClick={() => handleOpenDialog(id)}>
              <DeleteIcon sx={{ color: "#C5A773" }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    const successMessage = localStorage.getItem("successMessage");
    if (successMessage) {
      setMessage(successMessage);
      localStorage.removeItem("successMessage");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }, [location.state?.message]);

  useEffect(() => {
    getAllServices()
      .then((data) => {
        console.log(data);
        setData({
          list_services: data,
        });
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const handleDelete = async () => {
    const result = await deleteCustomerById(customerToDelete);
    if (result !== undefined) {
      setMessage(`Delete user with id ${customerToDelete}  successfully!`);
      getCustomersPerPage(currentPage, filteredData)
        .then((data) => {
          setData({
            list_customers: data.list_customers,
            total_page: data.total_page,
          });
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

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (e) => {
    let value = e.target.value;
    setFilteredData(value);
  };

  const processChange = debounce((e) => handleSearchChange(e));

  const handleOpenDialog = (customer) => {
    setCustomerToDelete(customer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCustomerToDelete(null);
  };

  return (
    // <Box p="20px" overflow="auto">
    //   <Typography variant="h4" textAlign="center">
    //     Manage Customers
    //   </Typography>

    //   <Box display="flex" justifyContent="space-between">
    //     <Link to="/customers/new">
    //       <AddIcon
    //         sx={{
    //           ml: "10px",
    //           fontSize: "40px",
    //           color: "black",
    //         }}
    //       />
    //     </Link>
    //     <Box
    //       display="flex"
    //       width="20%"
    //       border="1px solid black"
    //       borderRadius="30px"
    //     >
    //       <InputBase
    //         sx={{ ml: 2, flex: 1 }}
    //         onChange={(e) => processChange(e)}
    //       />
    //       <IconButton type="button" sx={{ p: 1 }}>
    //         <SearchIcon />
    //       </IconButton>
    //     </Box>
    //   </Box>

    //   {message && (
    //     <div className="alert alert-success text-center">{message}</div>
    //   )}

    //   <Box
    //     m="20px 0 0 0"
    //     sx={{
    //       "& .MuiDataGrid-root": {
    //         border: "none",
    //       },
    //       "& .MuiDataGrid-columnHeader": {
    //         backgroundColor: "#C5A773",
    //         borderBottom: "none",
    //       },
    //       "& .MuiDataGrid-footerContainer": {
    //         borderTop: "none",
    //       },
    //       backgroundColor: "#EEE5D6",
    //     }}
    //   >
    //     <DataGrid
    //       rows={data.list_customers}
    //       columns={columns}
    //       getRowId={(row) => row?.id}
    //       hideFooter
    //       disableColumnFilter
    //       disableColumnMenu
    //       disableRowSelectionOnClick
    //     />
    //   </Box>
    //   <Box display="flex" justifyContent="center">
    //     <Pagination
    //       count={data.total_page}
    //       page={currentPage}
    //       onChange={handleChange}
    //     />
    //   </Box>

    //   {/* Confirmation Dialog */}
    //   <Dialog
    //     open={openDialog}
    //     onClose={handleCloseDialog}
    //     aria-labelledby="alert-dialog-title"
    //     aria-describedby="alert-dialog-description"
    //   >
    //     <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
    //     <DialogContent>
    //       <DialogContentText id="alert-dialog-description">
    //         Are you sure you want to delete this customer?
    //       </DialogContentText>
    //     </DialogContent>
    //     <DialogActions>
    //       <Button onClick={handleDelete} color="secondary" autoFocus>
    //         Delete
    //       </Button>
    //       <Button onClick={handleCloseDialog} color="primary">
    //         Cancel
    //       </Button>
    //     </DialogActions>
    //   </Dialog>
    // </Box>
    <>Hello</>
  );
};

export default Services;
