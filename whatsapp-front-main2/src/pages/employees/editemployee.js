import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

function EditEmployeeModal({ show, handleClose, employeeData, handleSave }) {
  const [editedEmployee, setEditedEmployee] = useState({
    ...employeeData,
    permissions: typeof employeeData.permissions === 'string' ? JSON.parse(employeeData.permissions) : employeeData.permissions
  });

  const permissionsList = ["individual_messaging", "group_messaging", "auto_reply_and_smart_bot", "contact_phrases", "file_management", "linked_platforms", "developers"];

  useEffect(() => {
    setEditedEmployee({
      ...employeeData,
      permissions: typeof employeeData.permissions === 'string' ? JSON.parse(employeeData.permissions) : employeeData.permissions
    });
  }, [employeeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee({ ...editedEmployee, [name]: value });
  };

  const handleCheckboxChange = (permission) => {
    const updatedPermissions = editedEmployee.permissions.includes(permission)
      ? editedEmployee.permissions.filter((p) => p !== permission)
      : [...editedEmployee.permissions, permission];
    
    setEditedEmployee({ ...editedEmployee, permissions: updatedPermissions });
  };

  const saveChanges = () => {
    handleSave({ ...editedEmployee, permissions: JSON.stringify(editedEmployee.permissions) }); // Pass the edited data to the parent component
    handleClose(); // Close the modal
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>تحديث الموظف</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className='row'>
          <div className='col-md-6'>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">الاسم</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={editedEmployee.name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={editedEmployee.email || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">رقم الهاتف</label>
            <input
              type="text"
              id="phone"
              name="phone_number"
              className="form-control"
              value={editedEmployee.phone_number || ''}
              onChange={handleChange}
            />
          </div>
          </div>
          <div className="mb-3 col-md-5">
            <label className="form-label">الصلاحيات</label>
            {permissionsList.map((permission) => (
              <div key={permission} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={permission}
                  checked={editedEmployee.permissions.includes(permission)}
                  onChange={() => handleCheckboxChange(permission)}
                />
                <label className="form-check-label" htmlFor={permission}>
                  {permission}
                </label>
              </div>
            ))}
          </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          إلغاء
        </Button>
        <Button variant="primary" onClick={saveChanges}>
          حفظ البيانات
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditEmployeeModal;
