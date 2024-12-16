import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import './employee.scss';
import { createEmployee, editEmployee, employeeDelete, getEmployeeData } from '../../services/employeesServic';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserPen } from '@fortawesome/free-solid-svg-icons'
import EditEmployeeModal from './editemployee';
import axios from 'axios';
import { Rss } from 'lucide-react';
function CreateEmployee() {
  const [employee, setEmployee] = useState({
    employeeName: '',
    employeeEmail: '',
    employeePassword: '',
    employeePhone: '',
    employeeRole: '',
    permissions: {
      individual_messaging: false,
      group_messaging: false,
      auto_reply_and_smart_bot: false,
      contact_phrases: false,
      file_management: false,
      linked_platforms: false,
      developers: false,
    },
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [loading, setLoading] = useState(false);
  const[data,setData]=useState([])
  const[runEffect,setRunEffect]=useState(0)
 useEffect(()=>{
  getEmployeeData().then((test) => {
    if(test){
      setData(test)
    }else{
      toast.error("لا يوجد موظفين")
    }
  })
  .catch((error) => {
    console.log('Error:', error);
  });
 
 },[runEffect])
 const openModal = (employee) => {
  setSelectedEmployee(employee);
  setShowModal(true);
};


const closeModal = () => setShowModal(false);

const handleSave =async (updatedEmployee) => {
  try {
    const result=await editEmployee(updatedEmployee)
    console.log(result);
    if(result.message==="Employee updated successfully"){
      setRunEffect((...prev) =>prev+1)
      toast.success("تم التحديث بنجاح")
    }
  } catch (error) {
    console.log(error);
  }
};
  const permissionsList = [
    { key: 'individual_messaging', label: 'رسائل فردية' },
    { key: 'group_messaging', label: 'رسائل جماعية' },
    { key: 'auto_reply_and_smart_bot', label: 'الرد الآلي والروبوت الذكي' },
    { key: 'contact_phrases', label: 'عبارات التواصل' },
    { key: 'file_management', label: 'إدارة الملفات' },
    { key: 'linked_platforms', label: 'المنصات المرتبطة' },
    { key: 'developers', label: 'المطورين' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handlePermissionChange = (permission) => {
    setEmployee((prevState) => ({
      ...prevState,
      permissions: {
        ...prevState.permissions,
        [permission]: !prevState.permissions[permission],
      },
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const {
      employeeName,
      employeeEmail,
      employeePassword,
      employeePhone,
      employeeRole,
      permissions,
    } = employee;

    if (!employeeName || !employeeEmail || !employeePassword || !employeePhone) {
      toast.error('يرجى ملء جميع الحقول!');
      return;
    }

    // تحويل الصلاحيات إلى قائمة تحتوي فقط على الصلاحيات المحددة
    const selectedPermissions = Object.keys(permissions).filter(
      (key) => permissions[key]
    );

    try {
      setLoading(true);

      const payload = {
        name: employeeName,
        job_title: employeeRole,
        password: employeePassword,
        email: employeeEmail,
        phone_number: employeePhone,
        permissions: selectedPermissions,
      };
      console.log(payload);
      const result = await createEmployee(employeeName,employeeEmail,employeePassword,employeePhone,selectedPermissions);

      if (result) {
        toast.success('تمت إضافة الموظف بنجاح!');
        setEmployee({
          employeeName: '',
          employeeEmail: '',
          employeePassword: '',
          employeePhone: '',
          employeeRole: '',
          permissions: {
            individual_messaging: false,
            group_messaging: false,
            auto_reply_and_smart_bot: false,
            contact_phrases: false,
            file_management: false,
            linked_platforms: false,
            developers: false,
          },
        }
      );
      setRunEffect((...prev)=>prev+1)
      } else {
        throw new Error(result.message || 'فشلت العملية');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
const handleEmployeeDelete=async (id)=>{
try{
  const result=await employeeDelete(id)
  if(result.status===200){
    toast.success("تم حذف الموظف بنجاح")
    setRunEffect((...prev)=>prev+1)
  }
}
catch(error){
  console.log(error);
}
}
  return (
    <Layout>
      <div className="container mt-4" style={{ minHeight: '100vh' }}>
        <div className="row">
          <div className="col-md-12">
            <h2>إضافة موظف جديد</h2>
            <p>قم بإضافة بيانات الموظف وإعداد صلاحياته.</p>
          </div>
        </div>

        <div className="row mt-4">
          <div className="form-layout">
            <h3 className="form-header m-0 mt-4">بيانات الموظف</h3>
            <div className="form-section p-4 border shadow-sm">
              <form onSubmit={onSubmit} autoComplete="off">
                {/* حقل اسم الموظف */}
                <div className="mb-3">
                  <label htmlFor="employeeName" className="form-label">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    id="employeeName"
                    className="form-control"
                    placeholder="أدخل اسم الموظف"
                    name="employeeName"
                    value={employee.employeeName}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>

                {/* حقل البريد الإلكتروني */}
                <div className="mb-3">
                  <label htmlFor="employeeEmail" className="form-label">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="employeeEmail"
                    className="form-control"
                    placeholder="أدخل البريد الإلكتروني"
                    name="employeeEmail"
                    value={employee.employeeEmail}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>

                {/* حقل رقم الهاتف */}
                <div className="mb-3">
                  <label htmlFor="employeePhone" className="form-label">
                    رقم الهاتف
                  </label>
                  <input
                    type="text"
                    id="employeePhone"
                    className="form-control"
                    placeholder="أدخل رقم الهاتف"
                    name="employeePhone"
                    value={employee.employeePhone}
                    onChange={handleInputChange}
                  />
                </div>

                {/* حقل كلمة السر */}
                <div className="mb-3">
                  <label htmlFor="employeePassword" className="form-label">
                    كلمة السر
                  </label>
                  <input
                    type="password"
                    id="employeePassword"
                    className="form-control"
                    placeholder="أدخل كلمة السر"
                    name="employeePassword"
                    value={employee.employeePassword}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                  />
                </div>

                {/* قائمة الصلاحيات */}
                <div className="mb-3">
                  <label htmlFor="employeeRole" className="form-label">
                    الصلاحيات
                  </label>
                 
                  <div className="mt-3">
                    {permissionsList.map((perm) => (
                      <div key={perm.key} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={perm.key}
                          checked={employee.permissions[perm.key]}
                          onChange={() => handlePermissionChange(perm.key)}
                        />
                        <label className="form-check-label" htmlFor={perm.key}>
                          {perm.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                  {loading ? 'جاري الحفظ...' : 'حفظ البيانات'}
                </button>
              </form>
            </div>
          </div>

          <div className="form-layout">
            <h3 className="mt-4 form-header m-0">عرض الموظفين</h3>
            <div className="p-4 border shadow-sm">
          
              <table className=''>
                <thead>
                  <tr className='text-center'>
                    <th >
                      الاسم
                    </th>
                    <th>
                      رقم الهاتف
                    </th>
                    <th>البريد الإلكتروني</th>
                    <th>مركز التحكم</th>
                  </tr>
                  </thead>
                    <tbody>
                       
                    {data && data.length>0?data.map(employee=>
                <tr key={employee.id} className='text-center'>
                  <td>{employee.name}</td>
                  <td>{employee.phone_number}</td>
                  <td>{employee.email.slice(0,10)}...</td>
                  <td className=' '>
                  <button onClick={()=>handleEmployeeDelete(employee.id)} className='actionBtn'><FontAwesomeIcon style={{color:"red"}} icon={faTrash} /></button>
                    <button
                    onClick={() =>{
                      window.scroll(0,0)
                      openModal(employee)}}
                    className="actionBtn"
                  >
                    <FontAwesomeIcon style={{color:"green"}} icon={faUserPen} />
                  </button>
                  </td>
                  
                </tr>
              ):null}
                    </tbody>
                
              </table>
              {data && data.length===0?<h1 className='text-center'>لا توجد بيانات لعرضها</h1>:null}
              
      {/* Modal for Editing */}
      {selectedEmployee && (
        <EditEmployeeModal
          show={showModal}
          handleClose={closeModal}
          employeeData={selectedEmployee}
          handleSave={handleSave}
        />)}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateEmployee;
