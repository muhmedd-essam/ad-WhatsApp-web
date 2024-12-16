import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export const getEmployeeData = async () => {
  const token = localStorage.getItem("token");

  try {

    const response = await axios.get(`${API_URL}/employee/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    
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

export const createEmployee = async (
  employeeName,
  employeeEmail,
  employeePassword,
  employeePhone,// ة افتراضية لحقل الهاتف إذا لم يتم توفيره
  permissions // قيمة افتراضية للصلاحيات
) => {
  try {
    const data = {
      name: employeeName,
      job_title: "Software Engineer",
      password: employeePassword,
      email: employeeEmail,
      phone_number: employeePhone,
      permissions, // مصفوفة تحتوي على الصلاحيات
    };

    console.log("Data being sent:", data);
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/employee/store`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

   
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

export const editEmployee = async (data) => {
  try {
    // تأكد من أن permissions هي مصفوفة
    const updatedData = {
      ...data,
      permissions: Array.isArray(data.permissions)
        ? data.permissions
        : JSON.parse(data.permissions), // تحويل النص إلى مصفوفة إذا لزم الأمر
    };

    console.log("Data being updated:", updatedData);
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/employee/update/${data.id}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
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

export const employeeDelete=async (id)=>{
  const token = localStorage.getItem("token");

    try {

        const response = await axios.delete(`${API_URL}/employee/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        return response
        
        
      } catch (error) {
        // Handle and re-throw error for further handling in the calling component
        console.log(error);
      }
}