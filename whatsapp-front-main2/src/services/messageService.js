import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export const storeMessage = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/message/store`, data, {
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

export const getConversation = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/conversation/show/${id}`, {
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

export const receiveMessage = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/receive`, data, {
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
