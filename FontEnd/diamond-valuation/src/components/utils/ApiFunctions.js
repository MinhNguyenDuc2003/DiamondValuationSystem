import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/Diamond",
  withCredentials: true,
});

export async function loginUser(login) {
  try {
    const response = await api.post("/api/auth/sign-in", login);

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else return response.status;
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      return {
        success: false,
        status: error.response.status,
        message: error.response.data?.message || "An error occurred",
      };
    } else {
      // Network error or other issue
      return { success: false, message: error.message || "Network error" };
    }
  }
}

export async function logout() {
  try {
    const id = localStorage.getItem("userId");
    if (id.length > 0 && id !== null) {
      const response = await api.get(`/api/auth/logout/${id}`);
      return response;
    }
  } catch (error) {
    return null;
  }
}

// =========================== USER ================================================
export async function getUsersPerPage(pageNum, keyword) {
  try {
    let page = pageNum; // Use 'let' to allow reassignment
    const token = localStorage.getItem("token");
    if (keyword.length > 0 && page === 0) {
      // Correct 'lenght' to 'length'
      page = 1;
    }
    const result = await api.get(`/api/users/page/${page}?keyword=${keyword}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching users : ${error.message}`);
  }
}

export async function getUserById(id) {
  try {
    const result = await api.get(`/api/users/user/${id}`);
    F;
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching user with id ${id} : ${error.message}`);
  }
}

export async function getRoles() {
  try {
    const result = await api.get("/api/users/user/roles");
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching roles : ${error.message}`);
  }
}

export async function saveUser(user) {
  const formData = new FormData();
  formData.append("id", user.id);
  formData.append("first_name", user.first_name);
  formData.append("last_name", user.last_name);
  formData.append("email", user.email);
  formData.append("password", user.password);
  formData.append("phone_number", user.phone_number);
  formData.append("roles", user.role_ids);
  formData.append("photo", user.photo);
  formData.append("enabled", user.enabled);

  try {
    const response = await api.post("api/users/user/save", formData);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else return response.status;
  } catch (error) {
    console.log(error.data);
  }
}

export async function updateUser(user) {
  const formData = new FormData();
  formData.append("id", user.id);
  formData.append("first_name", user.first_name);
  formData.append("last_name", user.last_name);
  formData.append("email", user.email);
  formData.append("password", user.password);
  formData.append("phone_number", user.phone_number);
  formData.append("photo", user.photo);

  try {
    const response = await api.post("api/users/user/update", formData);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else return response.status;
  } catch (error) {
    console.log(error.data);
  }
}

export async function deleteUserById(id) {
  try {
    const result = await api.delete(`/api/users/delete/${id}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error delete user : ${error.message}`);
  }
}

// =========================== CUSTOMER ================================================//
export async function getCustomersPerPage(pageNum, keyword) {
  try {
    let page = pageNum; // Use 'let' to allow reassignment

    if (keyword.length > 0 && page === 0) {
      // Correct 'lenght' to 'length'
      page = 1;
    }
    const result = await api.get(
      `/api/customers/page/${page}?keyword=${keyword}`
    );
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching users : ${error.message}`);
  }
}

export async function searchCustomerByKeyword(keyword) {
  try {
    if (keyword.length > 0) {
      const result = await api.get(
        `/api/customers/search/customer?keyword=${keyword}`
      );
      return result.data;
    }
  } catch (error) {
    throw new Error(`Error fetching users : ${error.message}`);
  }
}

export async function deleteCustomerById(id) {
  try {
    const result = await api.delete(`/api/customers/delete/${id}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error delete user : ${error.message}`);
  }
}

export async function saveCustomer(customer) {
  const formData = new FormData();
  formData.append("id", customer.id);
  formData.append("first_name", customer.first_name);
  formData.append("last_name", customer.last_name);
  formData.append("email", customer.email);
  formData.append("password", customer.password);
  formData.append("phone_number", customer.phone_number);
  formData.append("location", customer.location);
  formData.append("enabled", customer.enabled);

  try {
    const response = await api.post("api/customers/customer/save", formData);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else return response.status;
  } catch (error) {
    console.log(error.data);
  }
}

export async function getCustomerById(id) {
  try {
    const result = await api.get(`/api/customers/customer/${id}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching customer with id ${id} : ${error.message}`);
  }
}

// =========================== SERVICES ================================================//
export async function getAllServices() {
  try {
    const result = await api.get(`/api/services/all-services`, {});

    return result.data;
  } catch (error) {
    throw new Error(`Error fetching services : ${error.message}`);
  }
}

export async function deleteServiceById(id) {
  try {
    const result = await api.delete(`/api/services/delete/${id}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error delete service : ${error.message}`);
  }
}

export async function saveService(service) {
  const formData = new FormData();
  if (service.id !== null && service.id !== undefined) {
    formData.append("id", service.id);
  }

  formData.append("name", service.name);
  formData.append("money", service.money);
  formData.append("content", service.content);
  formData.append("status", true);
  formData.append("photo", service.photo);

  try {
    const response = await api.post("api/services/service/save", formData);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else return response.status;
  } catch (error) {
    console.log(error.data);
  }
}

export async function getServiceById(id) {
  try {
    const result = await api.get(`api/services/service/${id}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching service with id ${id} : ${error.message}`);
  }
}

// ================================== REQUESTS ============================================ //
export async function getAllRequests() {
  try {
    const result = await api.get(`api/diamond-requests/all-request`, {});
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching services : ${error.message}`);
  }
}

export async function deleteRequestById(id) {
  try {
    const result = await api.delete(`api/diamond-requests/delete/${id}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error delete request : ${error.message}`);
  }
}

export async function saveRequest(request) {
  const formData = new FormData();
  formData.append("id", request.id);
  formData.append("customer_id", request.customer_id);
  formData.append("note", request.note);
  formData.append("status", request.status);
  formData.append("service_ids", request.service_ids);
  formData.append("payment_method", request.payment_method);
  formData.append("appointmentDate", request.appointment_date);
  formData.append("slotId", request.slotId);
  // formData.append("appointmentTime", request.appointment_time);

  formData.append("paid", request.paid);

  try {
    const response = await api.post(
      "api/diamond-requests/request/save",
      formData
    );
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else return response.status;
  } catch (error) {
    console.log(error.data);
  }
}

export async function getRequestById(id) {
  try {
    const result = await api.get(`api/diamond-requests/request/${id}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching service with id ${id} : ${error.message}`);
  }
}

export async function getAllRequestsStatus(status) {
  try {
    const result = await api.get(
      `api/diamond-requests/requests/status/${status}`,
      {}
    );
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching requests : ${error.message}`);
  }
}

export async function updateRequestStatus(id, status) {
  try {
    const result = await api.put(
      `api/diamond-requests/request/update-status/${id}/${status}`
    );
    return result.data;
  } catch (error) {
    throw new Error(
      `Error update request status with id ${id} : ${error.message}`
    );
  }
}

export async function getSlotAvailable(date) {
  try {
    const result = await api.get(
      `api/diamond-requests/request/slot-available?date=${date}`,
      {}
    );
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching requests : ${error.message}`);
  }
}

// ================================== Certificates ============================================ //

export async function getAllCertificates() {
  try {
    const result = await api.get(`api/certificates/all`, {});
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching services : ${error.message}`);
  }
}

export async function getCertificateById(id) {
  try {
    const result = await api.get(`api/certificates/certificate/${id}`, {});
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching services : ${error.message}`);
  }
}

export async function deleteCertificateById(id) {
  try {
    const result = await api.delete(`api/certificates/delete/${id}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error delete certificate : ${error.message}`);
  }
}

export async function saveCertificate(certificate) {
  const formData = new FormData();
  formData.append("id", certificate.id);
  formData.append("code", certificate.code);
  formData.append("cut", certificate.cut);
  formData.append("carat", certificate.carat);
  formData.append("color", certificate.color);
  formData.append("clarity", certificate.clarity);
  formData.append("make", certificate.make);
  formData.append("measurement", certificate.measurement);
  formData.append("polish", certificate.polish);
  formData.append("symmetry", certificate.symmetry);
  formData.append("flourescence", certificate.flourescence);
  formData.append("name", certificate.cert);
  formData.append("request_id", certificate.request_id);
  formData.append("photo", certificate.photo);

  try {
    const response = await api.post(
      "api/certificates/certificate/save",
      formData
    );
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else return response.status;
  } catch (error) {
    console.log(error.data);
  }
}
// ====================================== RAPAPORT ========================================= //

export async function getAllRapaport() {
  try {
    const result = await api.get(`api/attribute/all`, {});
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching services : ${error.message}`);
  }
}

export async function updateDiamondAttribute(attr) {
  const data = {
    color: attr.color,
    clarity: attr.clarity,
    number: attr.number,
  };

  try {
    const response = await api.put(`api/attribute/update/${attr.id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else return response.status;
  } catch (error) {
    console.log(error.data);
  }
}

export async function deleteDiamondAttributeById(id) {
  try {
    const result = await api.delete(`api/attribute/delete/${id}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error delete certificate : ${error.message}`);
  }
}

export async function addDiamondAttribute(attr, caratId) {
  const data = {
    color: attr.color,
    clarity: attr.clarity,
    number: attr.number,
  };

  try {
    const response = await api.post(`api/attribute/add/${caratId}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else return response.status;
  } catch (error) {
    console.log(error.data);
  }
}

export async function addCaratRange(caratRange) {
  const data = {
    begin_carat: caratRange.begin_carat,
    end_carat: caratRange.end_carat,
  };

  try {
    const response = await api.post("api/carat/add", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else return response.status;
  } catch (error) {
    console.log(error.data);
  }
}

export async function updateCaratRange(id, caratRange) {
  const data = {
    id: id,
    begin_carat: caratRange.begin_carat,
    end_carat: caratRange.end_carat,
  };

  try {
    console.log(data);
    const response = await api.put(`api/carat/update`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else return response.status;
  } catch (error) {
    console.log(error.data);
  }
}

export async function deleteCaratRange(id) {
  try {
    const response = await api.delete(`api/carat/delete/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else return response.status;
  } catch (error) {
    console.log(error.data);
  }
}

// =========================================== REPORTS ======================================//
export async function saveReport(report) {
  const data = {
    id: report.id,
    header: report.header,
    content: report.content,
    type: report.type,
    status: report.status,
    request_id: report.request_id,
  };

  try {
    const response = await api.post("api/reports/report/save", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else return response.status;
  } catch (error) {
    console.log(error.data);
  }
}

export async function getAllReports() {
  try {
    const result = await api.get(`api/reports/all-report`, {});
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching services : ${error.message}`);
  }
}

export async function deleteReport(id) {
  try {
    const response = await api.delete(`api/reports/report/delete/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else return response.status;
  } catch (error) {
    console.log(error.data);
  }
}

// =================================== Request Tracking =================================== //

export async function getRequestTracking(id) {
  try {
    const result = await api.get(`/request-track/${id}`, {});
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching services : ${error.message}`);
  }
}

// =================================== Report Tracking =================================== //

export async function getReportTracking(id) {
  try {
    const result = await api.get(`/report-track/${id}`, {});
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching services : ${error.message}`);
  }
}

// ======================================================================================== //
export const validateToken = async () => {
  const token = localStorage.getItem("token");
  if (token != null && token.length > 0) {
    const result = await api.post("/api/auth/token");
    return result;
  } else {
    const result = await api.post("/api/auth/token");
    return result;
  }
};
const refreshToken = async () => {
  try {
    const id = localStorage.getItem("userId");
    if (id !== null && id > 0) {
      const formData = new FormData();
      formData.append("id", id);
      const response = await api.post("/api/auth/token/refresh", formData);
      return response.data;
    }
  } catch (error) {
    console.log("Error", error);
  }
};

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
    if (error.response.status === 403 && !originalRequest._retry) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }
    if (error.response.status === 401 && !originalRequest._retry) {
      try {
        const resp = await refreshToken();

        if (resp.token) {
          const access_token = resp.token;
          localStorage.setItem("token", access_token);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${access_token}`;

          // Retry the original request with the new token
          return api(originalRequest);
        } else {
          return Promise.reject(error); // Reject the promise to avoid further processing
        }
      } catch (refreshError) {
        // If refreshToken() fails, redirect to login
        // window.location.href = "/login"; // Redirect to login page
        return Promise.reject(error); // Reject the promise to avoid further processing
      }
    }
    return Promise.reject(error);
  }
);
