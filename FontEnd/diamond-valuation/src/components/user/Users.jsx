import React from 'react'
import { useState, useEffect } from 'react'
import { deleteUserById, getUsersPerPage } from '../utils/ApiFunctions'
import { FaEdit, FaTrashAlt } from "react-icons/fa"
import { Link } from "react-router-dom"
import Paginator from '../common/Paginator'
import { useLocation } from 'react-router-dom'

export const Users = () => {
    const [data, setData] = useState({
      list_users : [],
      total_page : 0
    })
    const [filteredData, setFilteredData] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [message, setMessage] = useState("")
    
    const location = useLocation()   

    useEffect(() => {
       
      setMessage(location.state?.message)

      setTimeout(() => {
        setMessage("")
      }, 2000)
    },  [location.state?.message])

    useEffect(() => {
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
	}, [currentPage, filteredData])

  function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

 
  const handleSearchChange = (e) => {
    let value = e.target.value;
    setFilteredData(value);
};

const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber)
}

const processChange = debounce((e) => handleSearchChange(e));

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
    

    

  return (

    <div className="container-fluid">
      <div className='ms-3 mt-3'>
			  <h2 className='text-center'>Manage Users</h2>
        <Link to={"/users/new"}>
          <i className="bi bi-person-add" style={{fontSize: "40px", color : "black"}}></i>
				</Link>
		  </div>

      
        
      <div>
          <form onSubmit={(e) => {e.preventDefault()}} className="form-inline d-flex align-items-center m-3 col-3">
              <input type="search" name="keyword" className="form-control mr-2" onChange={processChange} id="keyword" required />
              &nbsp;&nbsp;
              <button type="submit" className="btn btn-primary">
              <i className="bi bi-search"></i>
              </button>
          </form>
      </div>

      {message && <div className="alert alert-success text-center">{message}</div>}

      <div>
        <table className="table table-bordered table-striped table-hover table-responsive-xl">
        <thead className="thead-dark">
					<tr className='text-center'>
						<th>User Id</th>
            <th>Photos</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Enabled</th>
            <th></th>
					</tr>
				</thead>
        <tbody>
          {
            data.list_users && data.list_users.map((user) => (
              <tr key={user.id} className='text-center'>
                <td>{user.id}</td>
                <td> <img src={user.image_path} alt={user.name} style={{ width: '100px', height: 'auto' }} /> </td>
                <td>{user.email}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.phone_number}</td>
                <td><a onClick={() => handleUpdateStatus(user.id)}><i className={`bi bi-check-circle-fill ${user.enabled ? "green-icon" : "dark-icon"}`} style={{fontSize: "30px" }}></i></a> </td>
                <td className="gap-2">
											<Link to={`/user/${user.id}`} className="gap-2">
												<span className="btn btn-warning btn-sm ml-5">
													<FaEdit />
												</span>
											</Link>
                      &nbsp;&nbsp;&nbsp;
											<button
												className="btn btn-danger btn-sm ml-5"
												onClick={() => handleDelete(user.id)}>
												<FaTrashAlt />
											</button>
								</td>


              </tr>
            )
            )
          }
        </tbody>
        </table>

        <div>
          <Paginator
            currentPage={currentPage}
						totalPages={data.total_page}
            onPageChange={handlePageChange}
          />
        </div> 

      </div>    
    </div>
  )
}

export default Users