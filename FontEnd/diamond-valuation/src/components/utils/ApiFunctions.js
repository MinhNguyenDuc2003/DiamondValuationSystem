import axios from "axios"

export const api = axios.create({
	baseURL: 'http://localhost:8080/Diamond'
})

export const getHeader = () => {
	const token = localStorage.getItem("token")
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json"
	}
}

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

		if (keyword.length > 0 && page === 0) {  // Correct 'lenght' to 'length'
    		page = 1;
		}
		const result = await api.get(`/api/users/page/${page}?keyword=${keyword}`,{}, {
			headers: getHeader()
		})
		return result.data;
	} catch (error) {
		throw new Error(`Error fetching users : ${error.message}`)
	}
}

export async function getUserById(id) {
	try {
		const result = await api.get(`/api/users/user/${id}`, {} , {
			headers: getHeader()
		})
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
		const response = await api.post("api/users/user/save", formData,{
			headers: {...getHeader(),
				'Content-Type': 'multipart/form-data'
			} }
		)
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
        const result = await api.delete(`/api/users/delete/${id}`,{
            headers: getHeader()
        }
        )
        return result.data;
    } catch (error) {
        throw new Error(`Error delete user : ${error.message}`)
    }
}

// =========================== CUSTOMER ================================================//
export async function getCustomersPerPage(pageNum, keyword) {
	try {
<<<<<<< HEAD
		const token = localStorage.getItem("token")
		console.log(token);
		const result = await api.delete(`/api/users/delete/${id}`,{
			headers: getHeader()
		}
		)
=======
		let page = pageNum;  // Use 'let' to allow reassignment

		if (keyword.length > 0 && page === 0) {  // Correct 'lenght' to 'length'
    		page = 1;
		}
		const result = await api.get(`/api/customers/page/${page}?keyword=${keyword}`,{}, {
			headers: getHeader()
		})
>>>>>>> 95eb2fea71ea33430384be4cc23119fcba56525b
		return result.data;
	} catch (error) {
		throw new Error(`Error fetching users : ${error.message}`)
	}
}

export async function deleteCustomerById(id) {
    try {
        const result = await api.delete(`/api/customers/delete/${id}`,{
            headers: getHeader()
        }
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
		const response = await api.post("api/customers/customer/save", formData,{
			headers: {...getHeader(),
				'Content-Type': 'multipart/form-data'
			} }
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
		const result = await api.get(`/api/customers/customer/${id}`, {} , {
			headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error fetching customer with id ${id} : ${error.message}`)
	}
}