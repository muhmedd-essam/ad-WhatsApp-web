import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;
export const createBoot = async (data) => {
    try {
      
  
      console.log("Data being sent:", data);
      const token = localStorage.getItem("token");
  
      const response = await axios.post(`${API_URL}/smart-bots/store`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
     console.log(response);
      return response.data; // إرجاع الرد
  
    } catch (error) {
      if (error.response) {
        console.error("Error response from API:", error.response.data);
        return error.response.data; // إرجاع الأخطاء لمعالجتها
      } else {
        console.error("Unknown error:", error.message);
        throw error;
      }
    }
  };

  export const getBootData = async () => {
    const token = localStorage.getItem("token");
  
    try {
  
      const response = await axios.get(`${API_URL}/smart-bots/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(response);
      // Validate response format
      if ( response.status === 200) {
         
        return response.data.employees; // Return the full response object
      }else if(response.status===404){
        return "لا يوجد موظفين"
      } 
      else {
        throw new Error(response.data.msg || "Failed to retrieve employees data.");
      }
    } catch (error) {
      // Handle and re-throw error for further handling in the calling component
      console.log(error);
    }
  };
  