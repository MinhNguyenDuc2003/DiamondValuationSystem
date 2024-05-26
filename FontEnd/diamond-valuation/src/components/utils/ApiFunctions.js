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


export async function getUsersPerPage(pageNum, keyword) {
	try {
		const result = await api.get(`/api/users/page/${pageNum}?keyword=${keyword}`,{}, {
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

export async function getRoles(id) {
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

	try {
		const response = await api.post("api/users/user/save", formData,{
			headers: {...getHeader(),
				'Content-Type': 'multipart/form-data'
			} }
		)
		return response.data
	} catch (error) {
		console.log(error.data);
	}
}

export async function deleteUserById(id) {
	try {
		const result = await api.delete(`/api/users/delete/${id}`)
		return result.data;
	} catch (error) {
		throw new Error(`Error delete user : ${error.message}`)
	}
}