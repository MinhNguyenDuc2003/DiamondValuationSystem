import axios from "axios"

export const api = axios.create({
	baseURL: 'http://localhost:8080/Diamond',
	withCredentials: true
})


export async function loginUser(login) {
    try {
        const response = await api.post("/api/auth/sign-in", login);

        if (response.status >= 200 && response.status < 300) {
            return response.data ;
        } else 
            return  response.status;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            return { success: false, status: error.response.status, message: error.response.data?.message || 'An error occurred' };
        } else {
            // Network error or other issue
            return { success: false, message: error.message || 'Network error' };
        }
	}
}


// =========================== USER ================================================
export async function getUsersPerPage(pageNum, keyword) {
	try {
		let page = pageNum;  // Use 'let' to allow reassignment
		const token = localStorage.getItem("token");
		console.log(token);
		if (keyword.length > 0 && page === 0) {  // Correct 'lenght' to 'length'
    		page = 1;
		}
		const result = await api.get(`/api/users/page/${page}?keyword=${keyword}`)
		return result.data;
	} catch (error) {
		throw new Error(`Error fetching users : ${error.message}`)
	}
}

export async function getUserById(id) {
	try {
		const result = await api.get(`/api/users/user/${id}`)
		return result.data
	} catch (error) {
		throw new Error(`Error fetching user with id ${id} : ${error.message}`)
	}
}

export async function getRoles() {
	try {
		const result = await api.get("/api/users/user/roles")
		return result.data;
	} catch (error) {
		throw new Error(`Error fetching roles : ${error.message}`)
	}
}

export async function saveUser(user) {
	const formData = new FormData()
	formData.append("id", user.id)
	formData.append("first_name", user.first_name)
	formData.append("last_name", user.last_name)
	formData.append("email", user.email)
	formData.append("password", user.password)
	formData.append("phone_number", user.phone_number)
	formData.append("roles", user.role_ids)
	formData.append("photo", user.photo)
	formData.append("enabled", user.enabled)

	try {
		const response = await api.post("api/users/user/save", formData)
		if (response.status >= 200 && response.status < 300) {
            return response.data ;
        } else 
            return  response.status;
	} catch (error) {
		console.log(error.data);
	}
}

export async function deleteUserById(id) {
    try {
        const result = await api.delete(`/api/users/delete/${id}`
        )
        return result.data;
    } catch (error) {
        throw new Error(`Error delete user : ${error.message}`)
    }
}

// =========================== CUSTOMER ================================================//
export async function getCustomersPerPage(pageNum, keyword) {
	try {
		let page = pageNum;  // Use 'let' to allow reassignment

		if (keyword.length > 0 && page === 0) {  // Correct 'lenght' to 'length'
    		page = 1;
		}
		const result = await api.get(`/api/customers/page/${page}?keyword=${keyword}`)
		return result.data;
	} catch (error) {
		throw new Error(`Error fetching users : ${error.message}`)
	}
}

export async function deleteCustomerById(id) {
    try {
        const result = await api.delete(`/api/customers/delete/${id}`
        )
        return result.data;
    } catch (error) {
        throw new Error(`Error delete user : ${error.message}`)
    }
}

export async function saveCustomer(customer) {
	const formData = new FormData()
	formData.append("id", customer.id)
	formData.append("first_name", customer.first_name)
	formData.append("last_name", customer.last_name)
	formData.append("email", customer.email)
	formData.append("password", customer.password)
	formData.append("phone_number", customer.phone_number)
	formData.append("location", customer.location)
	formData.append("enabled", customer.enabled)

	try {
		const response = await api.post("api/customers/customer/save", formData
		)
		if (response.status >= 200 && response.status < 300) {
            return response.data ;
        } else 
            return  response.status;
	} catch (error) {
		console.log(error.data);
	}
}

export async function getCustomerById(id) {
	try {
		const result = await api.get(`/api/customers/customer/${id}`)
		return result.data
	} catch (error) {
		throw new Error(`Error fetching customer with id ${id} : ${error.message}`)
	}
}

// =========================== SERVICES ================================================//
export async function getAllServices() {
	try {
		const result = await api.get(`/api/services/all-services`,{})

		return result.data;
	} catch (error) {
		throw new Error(`Error fetching services : ${error.message}`)
	}
}

export async function deleteServiceById(id) {
    try {
        const result = await api.delete(`/apiapi/customers/delete/${id}`
        )
        return result.data;
    } catch (error) {
        throw new Error(`Error delete user : ${error.message}`)
    }
}

export async function saveService(service) {
	const formData = new FormData()
	formData.append("id", service.id)
	formData.append("name", service.name)
	formData.append("money", service.money)
	formData.append("content", service.content)
	formData.append("photo", service.photo)

	try {
		const response = await api.post("api/services/service/save", formData
		)
		if (response.status >= 200 && response.status < 300) {
            return response.data ;
        } else 
            return  response.status;
	} catch (error) {
		console.log(error.data);
	}
}

export async function getServiceById(id) {
	try {
		const result = await api.get(`api/services/service/${id}`)
		return result.data
	} catch (error) {
		throw new Error(`Error fetching service with id ${id} : ${error.message}`)
	}
}

// ================================== REQUESTS ============================================ //
export async function getAllRequests() {
	try {
		const result = await api.get(`api/diamond-requests/all-request`,{})
		return result.data;
	} catch (error) {
		throw new Error(`Error fetching services : ${error.message}`)
	}
}

export async function deleteRequestById(id) {
    try {
        const result = await api.delete(`api/diamond-requests/delete/${id}`
        )
        return result.data;
    } catch (error) {
        throw new Error(`Error delete request : ${error.message}`)
    }
}

export async function saveRequest(request) {
	const formData = new FormData()
	formData.append("id", request.id)
	formData.append("customer_id", request.customer_id)
	formData.append("note", request.note)
	formData.append("status", request.status)
	 // Append service_ids correctly
	 if (request.service_ids && request.service_ids.length > 0) {
        formData.append("service_ids", request.service_ids.join(","));
    }

	try {
		const response = await api.post("api/diamond-requests/request/save", formData
		)
		if (response.status >= 200 && response.status < 300) {
            return response.data ;
        } else 
            return  response.status;
	} catch (error) {
		console.log(error.data);
	}
}

export async function getRequestById(id) {
	try {
		const result = await api.get(`api/diamond-requests/request/${id}`)
		return result.data
	} catch (error) {
		throw new Error(`Error fetching service with id ${id} : ${error.message}`)
	}
}

// ================================== Certificates ============================================ //

export async function getAllCertificates() {
	try {
		const result = await api.get(`api/certificates/all`,{})
		return result.data;
	} catch (error) {
		throw new Error(`Error fetching services : ${error.message}`)
	}
}

export async function deleteCertificateById(id) {
    try {
        const result = await api.delete(`api/certificates/delete/${id}`
        )
        return result.data;
    } catch (error) {
        throw new Error(`Error delete certificate : ${error.message}`)
    }
}

// ======================================================================================== //
export const validateToken = async() => {
	const token = localStorage.getItem("token")
	const formData = new FormData();
	formData.append("token", token);
	if(token != null && token.length>0){
		const result = await api.post("/api/auth/token", formData)
		console.log("abc")
		return result;
	}else{
		return false;
	}
}
const refreshToken= async() => {
	try {
		const id = localStorage.getItem("userId");
		const formData = new FormData();
		formData.append("id", id);
		const response = await api.post('/api/auth/token/refresh', formData);
		return response.data;
	} catch (error) {
		console.log("Error",error); 
	}
}

api.interceptors.request.use(
	async (config) => {
	  const token = localStorage.getItem("token");
	  if (token) {
		config.headers["Authorization"] = `Bearer ${token}`;
	  }
	  config.withCredentials = true;
	  return config;
	},
	(error) => {
	  return Promise.reject(error);
	}
  );
api.interceptors.response.use(
		(response) => {
		  return response;
		},
		async function (error) {
		  const originalRequest = error.config;
		  if ((error.response.status === 403 && !originalRequest._retry)) {
			localStorage.clear();
			window.location.href = '/login';
        	return Promise.reject(error);
		  }
		  if(error.response.status === 401 && !originalRequest._retry){
			try {
				const resp = await refreshToken();
		
				if (resp.token) {
				  const access_token = resp.token;
				  localStorage.setItem('token', access_token);
				  api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
		
				  // Retry the original request with the new token
				  return api(originalRequest);
				} else {
				  return Promise.reject(error); // Reject the promise to avoid further processing
				}
			  } catch (refreshError) {
				// If refreshToken() fails, redirect to login
				window.location.href = '/login'; // Redirect to login page
				return Promise.reject(error); // Reject the promise to avoid further processing
			  }
		  }
		  return Promise.reject(error);
		}
	  );
