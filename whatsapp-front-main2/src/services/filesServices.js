import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export const uploadFiles = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/media/store`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllFiles = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage");
    }

    // Make sure the headers are in the correct position
    const response = await axios.post(
      `${API_URL}/media/all-data`,
      {}, // Empty request body
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token here
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Error in getAllFiles:", error);
    throw error; // Re-throw to handle it in your Redux thunk
  }
};

export const getFiles = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/media/${userId}`, {
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

export const deleteFile = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/media/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
