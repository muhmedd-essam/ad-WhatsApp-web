import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;
export const storeAccount = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/number/store`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Check for different response formats
    if (response?.data?.data) {
      return response.data.data; // Expected format
    } else if (response?.data) {
      return response.data; // Alternative format
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Error in storeAccount:", error);
    throw error;
  }
};

export const getAccounts = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/user/all`, {
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
