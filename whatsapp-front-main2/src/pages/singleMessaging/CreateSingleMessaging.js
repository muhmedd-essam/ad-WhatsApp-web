import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import "./SingleMessaging.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccountsAsync,
  selectAccounts,
  selectAccountStatus,
  selectAccountError,
} from "../../store/reducers/accountSlice";
import { storeConversationAsync } from "../../store/reducers/conversationSlice";

const CreateSingleMessaging = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const status = useSelector(selectAccountStatus);
  const error = useSelector(selectAccountError);
console.log(accounts);
  

  useEffect(() => {
    dispatch(fetchAccountsAsync());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phone_sender: "", // Ensure this is empty initially
    employee_id: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} with value:`, value); // Debugging log
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data being submitted:", formData); // Debugging log

    const conversation = await dispatch(
      storeConversationAsync(formData)
    ).unwrap();

    const conversationId = conversation.id;
    navigate(`/conversation/${conversationId}`);
  };

  return (
    <Layout>
      <div className="container my-5">
        <div className="row">
          <div className="col-md-12">
            <h2>المراسلة الفردية</h2>
            <p>نموذج المراسلة الفردية</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <div className="row">
            {/* Contact Information Section */}
            <div className="col-md-6">
              <div className="form-section">
                <h3>بيانات جهة الاتصال</h3>

                <div className="mb-3 p-3">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>

                <div className="mb-3 p-3">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="أدخل اسم جهة الاتصال"
                  />
                </div>
              </div>
            </div>

            {/* Main Data Section */}
            <div className="col-md-6">
              <div className="form-section">
                <h3>البيانات الرئيسية</h3>

                <div className="mb-3 p-3">
                  <label htmlFor="phone_sender" className="form-label">
                    حساب الواتساب
                  </label>
                  <select
                    id="phone_sender"
                    name="phone_sender"
                    className="form-control"
                    value={formData.phone_sender} // Bind the value to formData.phone_sender
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      اختر...
                    </option>
                    {accounts &&
                    accounts.numbers &&
                    accounts.numbers.length > 0 ? (
                      accounts.numbers.map((account) => (
                        <option key={account.id} value={account.phone_number}>
                          {account.name ? account.name : account.phone_number}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        لا توجد حسابات
                      </option>
                    )}
                  </select>
                </div>

                <div className="mb-3 p-3">
                  <label htmlFor="employee" className="form-label">
                    الموظف
                  </label>
                  <select
                    id="employee"
                    name="employee_id"
                    className="form-control"
                    value={formData.employee_id}
                    onChange={handleInputChange}
                  >
                    <option value="">اختر...</option>
                    <option value="employee1">موظف 1</option>
                    <option value="employee2">موظف 2</option>
                    <option value="employee3">موظف 3</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <button type="submit" className="btn mt-3">
            إنشاء
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateSingleMessaging;
