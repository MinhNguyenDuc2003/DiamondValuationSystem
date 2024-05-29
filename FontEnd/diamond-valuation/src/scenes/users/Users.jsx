import React from 'react'
import { useState, useEffect } from 'react'
import { deleteUserById, getUsersPerPage } from '../../components/utils/ApiFunctions'
import { FaEdit, FaTrashAlt } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import Paginator from '../../components/common/Paginator'
import { useLocation } from 'react-router-dom'

import { Box, Button, IconButton, Typography, InputBase } from '@mui/material'
import { DataGrid, GridToolbarExport, GridToolbarContainer} from '@mui/x-data-grid'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search'



// export const Users = () => {
//     const [data, setData] = useState({
//       list_users : [],
//       total_page : 0
//     })
//     const [filteredData, setFilteredData] = useState("")
//     const [currentPage, setCurrentPage] = useState(1)
//     const [message, setMessage] = useState("")
    
//     const location = useLocation()   

//     useEffect(() => {
       
//       setMessage(location.state?.message)

//       setTimeout(() => {
//         setMessage("")
//       }, 2000)
//     },  [location.state?.message])

//     useEffect(() => {
//       getUsersPerPage(currentPage, filteredData)
//         .then((data) => {
//           setData({
//             list_users : data.data,
//             total_page : data.total_pages
//           })
//           console.log(data.data)
//         })
//         .catch((error) => {
//           setError(error.message)
//         })
// 	  }, [currentPage, filteredData])

//   function debounce(func, timeout = 300){
//     let timer;
//     return (...args) => {
//       clearTimeout(timer);
//       timer = setTimeout(() => { func.apply(this, args); }, timeout);
//     };
//   }

 
//   const handleSearchChange = (e) => {
//     let value = e.target.value;
//     setFilteredData(value);
// };

// const handlePageChange = (pageNumber) => {
//   setCurrentPage(pageNumber)
// }

// const processChange = debounce((e) => handleSearchChange(e));

// const handleDelete = async (id) => {
//     const result = await deleteUserById(id);
//     if(result!== undefined){
//       setMessage(`Delete user with id ${id}  successfully!`)
//       getUsersPerPage(currentPage, filteredData)
// 			.then((data) => {
// 				setData({
//           list_users : data.list_users,
//           total_page : data.total_page
//         })
// 			})
// 			.catch((error) => {
// 				setError(error.message)
// 			})
//       setTimeout(() => {
//         setMessage("")
//       }, 1000)
//     }
// }
    

    

//   return (

//     <div className="container-fluid">
//       <div className='ms-3 mt-3'>
// 			  <h2 className='text-center'>Manage Users</h2>
//         <Link to={"/users/new"}>
//           <i className="bi bi-person-add" style={{fontSize: "40px", color : "black"}}></i>
// 				</Link>
// 		  </div>

      
        
//       <div>
//           <form onSubmit={(e) => {e.preventDefault()}} className="form-inline d-flex align-items-center m-3 col-3">
//               <input type="search" name="keyword" className="form-control mr-2" onChange={processChange} id="keyword" required />
//               &nbsp;&nbsp;
//               <button type="submit" className="btn btn-primary">
//               <i className="bi bi-search"></i>
//               </button>
//           </form>
//       </div>

//       {message && <div className="alert alert-success text-center">{message}</div>}

//       <div>
//         <table className="table table-bordered table-striped table-hover table-responsive-xl">
//         <thead className="thead-dark">
// 					<tr className='text-center'>
// 						<th>User Id</th>
//             <th>Photos</th>
//             <th>Email</th>
//             <th>First Name</th>
//             <th>Last Name</th>
//             <th>Phone Number</th>
//             <th>Enabled</th>
//             <th></th>
// 					</tr>
// 				</thead>
//         <tbody>
//           {
//             data.list_users && data.list_users.map((user) => (
//               <tr key={user.id} className='text-center'>
//                 <td>{user.id}</td>
//                 <td> <img src={user.image_path} alt={user.name} style={{ width: '100px', height: 'auto' }} /> </td>
//                 <td>{user.email}</td>
//                 <td>{user.first_name}</td>
//                 <td>{user.last_name}</td>
//                 <td>{user.phone_number}</td>
//                 <td><a onClick={() => handleUpdateStatus(user.id)}><i className={`bi bi-check-circle-fill ${user.enabled ? "green-icon" : "dark-icon"}`} style={{fontSize: "30px" }}></i></a> </td>
//                 <td className="gap-2">
// 											<Link to={`/user/${user.id}`} className="gap-2">
// 												<span className="btn btn-warning btn-sm ml-5">
// 													<FaEdit />
// 												</span>
// 											</Link>
//                       &nbsp;&nbsp;&nbsp;
// 											<button
// 												className="btn btn-danger btn-sm ml-5"
// 												onClick={() => handleDelete(user.id)}>
// 												<FaTrashAlt />
// 											</button>
// 								</td>


//               </tr>
//             )
//             )
//           }
//         </tbody>
//         </table>

//         <div>
//           <Paginator
//             currentPage={currentPage}
// 						totalPages={data.total_page}
//             onPageChange={handlePageChange}
//           />
//         </div> 

//       </div>    
//     </div>
//   )
// }

export const Users = () => {
  const [data, setData] = useState({
    list_users: [],
    total_page: 0
  })
  const history = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredData, setFilteredData] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState('')
    
  const location = useLocation()   

  useEffect(() => {
     
    setMessage(location.state?.message)
    setTimeout(() => {
      setMessage("")
    }, 2000)
  },  [location.state?.message])

  useEffect(() => {
    fetchUsers(currentPage, filteredData);
  }, [currentPage, filteredData]);

  const fetchUsers = async (page, filter) => {
    try {
      const data = await getUsersPerPage(page, filter);
      setData({ list_users: data.list_users, total_page: data.total_page });
    } catch (error) {
      setError(error.message);
    }
  };

  const columns = [
    {
      field: 'id', 
      headerName: 'ID',
      flex: 0.5,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "email", 
      headerName: "Email", 
      align: 'center',
      headerAlign: 'center',
      flex: 1.5
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      flex: 1.5,
      align: 'center',
      headerAlign: 'center',
      valueGetter: ({ row }) => `${row.last_name || ''} ${row.first_name || ''}`,
    },
    {
      field: "phone_number", 
      headerName: "Phone Number", 
      flex: 1, 
      align: 'center',
      headerAlign: 'center',
    },
    { 
      field: "photo", 
      headerName: "Photo", 
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => {
        return (
          <Box display="flex" justifyContent="center">
            <img src={row.avatar} alt={row.first_name} style={{ width: 50, height: 50, borderRadius: '50%' }} />
          </Box>
        );
      }
    },
    {
      field: "enabled", 
      headerName: "Enable", 
      flex: 0.5,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row: {enabled } })  => {
        return(
          <>
            {enabled ? <CheckCircleIcon sx={{color: 'green', fontSize: '35px'}}/> : <CheckCircleOutlineIcon sx={{fontSize: '35px'}}/>}
          </>
        )
      }
    },
    {
      field: "role_names", 
      headerName: "Role", 
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row: {role_names} }) => {
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            {role_names.split('/').map((role, index) => (
                <Typography key={index}>{role.charAt(0).toUpperCase() + role.slice(1)}</Typography>
            ))}
          </Box>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 0.5,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row: {id} }) => {
        return (
          <Box>
            <IconButton
              onClick={() => handleEdit(id)}
            >
              <EditIcon sx={{color: "#C5A773"}}/>
            </IconButton>
            <IconButton
              onClick={() => handleDelete(id)}
            >
              <DeleteIcon sx={{color: "#C5A773"}}/>
            </IconButton>
          </Box>
        );
      }
    }
  ]

  const handleEdit = (user) => {
    history(`/users/${user}`)
  }

  const handleDelete = async (id) => {
    const result = await deleteUserById(id);
    if(result!== undefined){
      setMessage(`Delete user with id ${id}  successfully!`)
      getUsersPerPage(currentPage, filteredData)
			.then((data) => {
				setData({
          list_users : data.list_users,
          total_page : data.total_page
        })
			})
			.catch((error) => {
				setError(error.message)
			})
      setTimeout(() => {
        setMessage("")
      }, 1000)
    }
}

  function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{backgroundColor: 'white', border: 'none'}}>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
 
  const handleSearchChange = (e) => {
    let value = e.target.value;
    setFilteredData(value);
  };

  const processChange = debounce((e) => handleSearchChange(e));

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return(
    <Box m='20px'>
      <Typography
        variant='h4'
        textAlign='center'
      >
        Manage Users
      </Typography>
      
      <Box display='flex' alignContent='center' justifyContent='space-between'>
        <Link to='/users/new'>
          <PersonAddAlt1Icon 
            sx={{
              ml: '10px',
              fontSize: '40px',
              color: 'black'
            }}
            />
        </Link>
        <Box
            display="flex" 
            width='20%'
            border='1px solid black'
            borderRadius="30px"
        >
          <InputBase sx={{ml: 2, flex: 1}}  onChange={(e) => processChange(e)}/>
          <IconButton type="button" sx = {{p:1}}>
              <SearchIcon />
          </IconButton>
          {/* <Button sx={{borderRadius: '30px', backgroundColor: "#C5A773", color: 'black', fontWeight: 'bold'}}>
            Search
          </Button> */}
        </Box>
      </Box>

      <Box m='20px 0 0 0' height='65vh' sx={{
        '% .MuiDataGrid-root': {
          border: 'none'
        },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: "#C5A773",
          color: "black",
          fontWeight: "bold",
          borderBottom: "none"
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
        },
        backgroundColor: '#EEE5D6',
      }}>
        <DataGrid 
          rows={data.list_users}
          columns={columns}
          getRowId={(row) => row?.id}
          hideFooter
          disableColumnFilter
          disableColumnMenu
          disableRowSelectionOnClick
          slots={{
            toolbar: CustomToolbar
          }}
        />
      </Box>
      <Box display='flex' justifyContent='center'>
        <Pagination count={data.total_page} page={currentPage} onChange={handleChange}/>
      </Box>
    </Box>
  )
}

export default Users