import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;

// Login function
export const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    // Return error response instead of logging it
    console.log("Error", error);

    return error.response.data.message;
  }
};
export const Employeelogin = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/employee/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
    if (response.data.token&&response.status===200) {
        console.log("done");
      return response
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    // Return error response instead of logging it
    console.log("Error", error);

    return error.response.data.message;
  }
};

// Signup function
export const signup = async (name, email, phone, company, password) => {
  try {
    const data = {
      name,
      email,
      phone,
      company,
      password,
      plan_id: 1,
    };

    const response = await axios.post(`${API_URL}/auth/register`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
console.log(response);
    if (response.data.status === true) {
      return response.data;
    }else{
      console.log(response);
    }

    return response.data;
  } catch (error) {
    // Return error response instead of logging it
    return error.response
      ? error.response.data
      : { message: "Signup failed. Please try again." };
  }
};
export const googlesignup = async (name, email, password) => {
  try {
    const data = {
      name,
      email,
      
      password,
      plan_id: 1,
    };

    const response = await axios.post(`${API_URL}/auth/register`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
console.log(response);
    if (response.data.status === true) {
      return response.data;
    }else{
      console.log(response);
    }

    return response.data;
  } catch (error) {
    // Return error response instead of logging it
    return error.response
      ? error.response.data
      : { message: "Signup failed. Please try again." };
  }
};
