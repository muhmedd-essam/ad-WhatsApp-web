import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export const storeCampain = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/campaign/store`, data, {
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

export const getCampains = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/campaign/all`, {
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

export const getAllCampains = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/campaign/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response) {
      return response;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.log(error);
  }
};
