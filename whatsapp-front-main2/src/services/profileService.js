import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export const getUserData = async () => {
  try {
    const token = localStorage.getItem("token");

    // Check if token exists before making the request
    if (!token) {
      throw new Error("Authentication token not found. Please log in.");
    }

    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Validate response format
    if (response.data && response.data.status === true) {
      return response.data; // Return the full response object
    } else {
      throw new Error(response.data.msg || "Failed to retrieve user data.");
    }
  } catch (error) {
    // Handle and re-throw error for further handling in the calling component
    throw new Error(
      error.response?.data?.msg ||
        error.message ||
        "Something went wrong while fetching user data."
    );
  }
};

export const updateUserData = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/user/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.log(error);
  }
};

export const changePassword = async (passwordData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${API_URL}/auth/change-password`,
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check if the response contains a status and message
    if (res.data) {
      if (res.data.status) {
        return res.data; // Return the successful response
      } else {
        // Log or return the error message
        throw new Error(res.data.message); // Throw an error to be caught in the thunk
      }
    }
  } catch (error) {
    // Log the error if it is not handled by the previous condition
    console.error(error);
    throw new Error("فشل في تغيير كلمة المرور"); // Provide a fallback error message
  }
};
