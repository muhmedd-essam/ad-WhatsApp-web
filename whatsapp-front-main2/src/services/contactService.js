import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export const uploadContacts = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/contacts/import`, data, {
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

export const getContacts = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/contacts/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);

    if (response.data && response.data.status === true) {
      if (response.data.data === 404) {
        // No contacts found
        return [];
      } else if (Array.isArray(response.data.data)) {
        // Contacts found
        return response.data.data;
      } else {
        throw new Error("Unexpected data format in response");
      }
    } else {
      throw new Error(response.data.msg || "Unexpected response format");
    }
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error; // Re-throw the error so the calling code can handle it
  }
};

export const deleteContact = async (list_name) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/contacts/list/delete`,
      { list_name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting contact");
  }
};
