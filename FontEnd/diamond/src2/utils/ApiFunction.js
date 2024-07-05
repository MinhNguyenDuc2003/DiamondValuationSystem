import axios from "axios"

export const api = axios.create({
	baseURL: 'http://localhost:8081/DiamondShop',
	withCredentials: true
})



export async function loginUser(login) {
    try {
        const response = await api.post("/api/login", login);
        return response.data ;
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

export async function createNewAccount(account){
  try {
    const response = await api.post("/api/signup", account);
    return response;
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
    if(id!==null & id>0){
      const formData = new FormData();
      formData.append("id", id);
      const response = await api.post('/api/auth/token/refresh', formData);
      return response.data;
    }
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
