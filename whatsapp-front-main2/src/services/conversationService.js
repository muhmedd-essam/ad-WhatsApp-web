import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export const storeConversation = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/conversation/store`, data, {
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

export const showConversation = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/conversation/show/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data && response.data.data) {
      console.log(response.data.data);

      return response.data.data;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.log(error);
  }
};

export const showAllConversation = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/conversation/all`, {
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

export const deleteConversation = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_URL}/conversation/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data && response.data.message) {
      return response.data.message; // Assuming the response returns a message on successful deletion
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.log(error);
  }
};
